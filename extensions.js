/**
 * Poo IDE Extension System
 * 
 * Extensions use the .wbx file format:
 * 
 *   settings{ author: "John Doe"; version: 1.0.0; name: "My Extension"; colour: "#FF0000"; }
 *   shapes{ ...shape definition JavaScript code... }
 *   blockdef{ [ ...Blockly JSON block definitions... ] }
 *   gen{ ...generator JavaScript code... }
 *
 * Shape code has access to:
 *   - WEBBLOCKS_SHAPES.register(name, pathFn)  — register a custom shape
 *   - Blockly  global
 *   - The pathFn receives the ConstantProvider (has CORNER_RADIUS, GRID_UNIT, etc)
 *     and must return { isDynamic, width(h), height(h), connectionOffsetY(h),
 *     connectionOffsetX(w), pathDown(h), pathUp(h), pathRightDown(h), pathRightUp(h) }
 *   - After registering, blocks can use "extensions": ["shape_<name>"] in blockdef
 *
 * Generator code has access to:
 *   - htmlGenerator  (the Poo IDE code generator)
 *   - getVal(block, name)  helper
 *   - esc(s)  helper
 *   - wrapJs(block, code)  helper
 *   - Blockly  global
 */

window.PooExtensions = (function () {

    // All loaded extensions: { id, settings, blockTypes[], raw }
    const loaded = [];

    // ─── Parser ──────────────────────────────────────────────────────

    /**
     * Parse a .wbx extension string into { settings, blockdef, gen }.
     */
    function parse(source) {
        const result = { settings: {}, blockdef: null, gen: null, shapes: null };

        // Extract sections: sectionName{ ... }
        // We need to handle nested braces so we can't just regex
        const sections = extractSections(source);

        // --- settings ---
        if (sections.settings) {
            result.settings = parseSettings(sections.settings);
        }

        // --- blockdef ---
        if (sections.blockdef) {
            try {
                // The content should be a JSON array of block definitions
                let bd = sections.blockdef.trim();
                // Allow with or without outer brackets
                if (!bd.startsWith('[')) bd = '[' + bd + ']';
                result.blockdef = JSON.parse(bd);
            } catch (e) {
                throw new Error('blockdef parse error: ' + e.message);
            }
        }

        // --- gen ---
        if (sections.gen) {
            result.gen = sections.gen.trim();
        }

        // --- shapes ---
        if (sections.shapes) {
            result.shapes = sections.shapes.trim();
        }

        return result;
    }

    /**
     * Extract top-level named sections from source.
     * Handles nested braces correctly.
     */
    function extractSections(source) {
        const sections = {};
        // Match section names followed by {
        const sectionRegex = /\b(settings|blockdef|gen|shapes)\s*\{/g;
        let match;
        while ((match = sectionRegex.exec(source)) !== null) {
            const name = match[1];
            const startBrace = match.index + match[0].length;
            let depth = 1;
            let i = startBrace;
            while (i < source.length && depth > 0) {
                if (source[i] === '{') depth++;
                else if (source[i] === '}') depth--;
                if (depth > 0) i++;
            }
            sections[name] = source.substring(startBrace, i);
        }
        return sections;
    }

    /**
     * Parse settings section: semicolon-separated key: value pairs.
     *   author: "John Doe"; version: 1.0.0; name: "Cool Blocks";
     */
    function parseSettings(raw) {
        const settings = {};
        // Split by semicolons, handle quoted values
        const pairs = raw.split(';').map(s => s.trim()).filter(Boolean);
        for (const pair of pairs) {
            const colonIdx = pair.indexOf(':');
            if (colonIdx === -1) continue;
            const key = pair.substring(0, colonIdx).trim();
            let val = pair.substring(colonIdx + 1).trim();
            // Strip quotes
            if ((val.startsWith('"') && val.endsWith('"')) ||
                (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            settings[key] = val;
        }
        return settings;
    }

    // ─── Registration ────────────────────────────────────────────────

    /**
     * Load and register an extension from a .wbx source string.
     * Returns the extension info object.
     */
    function loadExtension(source) {
        const ext = parse(source);

        const info = {
            id: (ext.settings.name || 'ext_' + Date.now()).replace(/\s+/g, '_').toLowerCase(),
            settings: ext.settings,
            blockTypes: [],
            shapeNames: [],
            raw: source
        };

        // Register custom shapes (before blocks, so blockdef can reference them)
        if (ext.shapes) {
            try {
                const shapeFn = new Function(
                    'WEBBLOCKS_SHAPES', 'Blockly',
                    ext.shapes
                );
                // Intercept registrations to track shape names for this extension
                const shapeProxy = {
                    register: function (name, pathFn) {
                        const id = window.WEBBLOCKS_SHAPES.register(name, pathFn);
                        info.shapeNames.push(name);
                        return id;
                    },
                    getId: window.WEBBLOCKS_SHAPES.getId,
                    getAll: window.WEBBLOCKS_SHAPES.getAll,
                    registerTypeCheck: window.WEBBLOCKS_SHAPES.registerTypeCheck
                };
                shapeFn(shapeProxy, Blockly);
            } catch (e) {
                console.error('Extension shapes error (' + info.id + '):', e);
                throw new Error('shapes code error: ' + e.message);
            }
        }

        // Register block definitions
        if (ext.blockdef && ext.blockdef.length > 0) {
            const defineBlocks = Blockly.common
                ? Blockly.common.defineBlocksWithJsonArray
                : Blockly.defineBlocksWithJsonArray;
            defineBlocks(ext.blockdef);

            for (const def of ext.blockdef) {
                if (def.type) info.blockTypes.push(def.type);
            }
        }

        // Register generators
        if (ext.gen) {
            try {
                // The generator code can reference htmlGenerator, getVal, esc, wrapJs
                const genFn = new Function(
                    'htmlGenerator', 'getVal', 'esc', 'wrapJs', 'Blockly',
                    ext.gen
                );
                genFn(
                    window.htmlGenerator || htmlGenerator,
                    window.getVal || getVal,
                    window.esc || esc,
                    window.wrapJs || wrapJs,
                    Blockly
                );
            } catch (e) {
                console.error('Extension generator error (' + info.id + '):', e);
                throw new Error('gen code error: ' + e.message);
            }
        }

        loaded.push(info);
        saveToStorage();
        return info;
    }

    /**
     * Remove an extension by id. Removes blocks from registry.
     */
    function removeExtension(id) {
        const idx = loaded.findIndex(e => e.id === id);
        if (idx === -1) return false;
        const ext = loaded[idx];

        // Unregister blocks and generators
        for (const type of ext.blockTypes) {
            delete Blockly.Blocks[type];
            if (window.htmlGenerator) delete window.htmlGenerator.forBlock[type];
            else if (typeof htmlGenerator !== 'undefined') delete htmlGenerator.forBlock[type];
        }

        loaded.splice(idx, 1);
        saveToStorage();
        return true;
    }

    /**
     * Build a toolbox category for all loaded extension blocks.
     */
    function getToolboxCategory() {
        if (loaded.length === 0) return null;

        const subcategories = [];
        for (const ext of loaded) {
            if (ext.blockTypes.length === 0) continue;
            const colour = ext.settings.colour || ext.settings.color || '#888888';
            subcategories.push({
                kind: 'category',
                name: ext.settings.name || ext.id,
                colour: colour,
                contents: ext.blockTypes.map(type => ({ kind: 'block', type }))
            });
        }

        if (subcategories.length === 0) return null;

        // If only one extension, flatten
        if (subcategories.length === 1) {
            return {
                kind: 'category',
                name: (subcategories[0].name),
                colour: subcategories[0].colour,
                contents: subcategories[0].contents
            };
        }

        return {
            kind: 'category',
            name: 'Extensions',
            colour: '#888888',
            contents: subcategories
        };
    }

    /**
     * Refresh the workspace toolbox to include extension blocks.
     */
    function refreshToolbox(workspaceRef, baseToolbox) {
        const extCat = getToolboxCategory();
        const newToolbox = {
            kind: baseToolbox.kind,
            contents: [...baseToolbox.contents]
        };

        // Remove existing extension category if present
        const extIdx = newToolbox.contents.findIndex(c => c.name === 'Extensions');
        if (extIdx !== -1) {
            newToolbox.contents.splice(extIdx, 1);
        }

        if (extCat) {
            newToolbox.contents.push(extCat);
        }

        workspaceRef.updateToolbox(newToolbox);
    }

    // ─── Persistence (localStorage) ─────────────────────────────────

    function saveToStorage() {
        try {
            const data = loaded.map(e => e.raw);
            localStorage.setItem('pooide_extensions', JSON.stringify(data));
        } catch (e) { }
    }

    function loadFromStorage() {
        try {
            const raw = localStorage.getItem('pooide_extensions');
            if (!raw) return;
            const sources = JSON.parse(raw);
            for (const src of sources) {
                try {
                    loadExtension(src);
                } catch (e) {
                    console.warn('Failed to restore extension:', e.message);
                }
            }
        } catch (e) { }
    }

    // ─── Public API ──────────────────────────────────────────────────

    return {
        parse,
        loadExtension,
        removeExtension,
        getToolboxCategory,
        refreshToolbox,
        loadFromStorage,
        get loaded() { return loaded; }
    };

})();

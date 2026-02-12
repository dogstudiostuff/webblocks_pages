 // PooExtensions: small home-grown extension loader
 window.PooExtensions = (function () {

 var lastLoaded = null; // I sometimes keep track of the last one I fiddled with
 const loaded = [];

 function parse(source) {
 const result = { settings: {}, blockdef: null, gen: null, shapes: null };

 const sections = extractSections(source);

 if (sections.settings) {
 result.settings = parseSettings(sections.settings);
 }

 if (sections.blockdef) {
 try {

let bd = sections.blockdef.trim();

    if (!bd.startsWith('[')) bd = '[' + bd + ']';
    result.blockdef = JSON.parse(bd);
} catch (e) {
    throw new Error('blockdef parse error: ' + e.message);
}
    }

    if (sections.gen) {
        result.gen = sections.gen.trim();
}

        if (sections.shapes) {
result.shapes = sections.shapes.trim();
        }

            return result;
        }

        function extractSections(source) {
            const sections = {};

                const sectionRegex = /\b(settings|blockdef|gen|shapes)\s*\{/g;
                let match;
                while ((match = sectionRegex.exec(source)) !== null) {
                const name = match[1];
            const startBrace = match.index + match[0].length;
                let depth = 1;
            let index = startBrace;
        while (index < source.length && depth > 0) {
if (source[index] === '{') depth++;
        else if (source[index] === '}') depth--;
        if (depth > 0) index++;
            }
        sections[name] = source.substring(startBrace, index);
}
        return sections;
        }

function parseSettings(raw) {
        const settings = {};

const pairs = raw.split(';').map(s => s.trim()).filter(Boolean);
    for (const pair of pairs) {
     const colonIdx = pair.indexOf(':');
     if (colonIdx === -1) continue;
     const key = pair.substring(0, colonIdx).trim();
    let value = pair.substring(colonIdx + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
        }
            settings[key] = value;
            }
            return settings;
            }

            function loadExtension(source) {
            const ext = parse(source);

        const info = {
    id: (ext.settings.name || 'ext_' + Date.now()).replace(/\s+/g, '_').toLowerCase(),
settings: ext.settings,
    blockTypes: [],
     shapeNames: [],
     raw: source
     };

        if (ext.shapes) {
        try {
        const shapeFn = new Function(
            'WEBBLOCKS_SHAPES', 'Blockly',
            ext.shapes
            );

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

if (ext.blockdef && ext.blockdef.length > 0) {
        const defineBlocks = Blockly.common
            ? Blockly.common.defineBlocksWithJsonArray
            : Blockly.defineBlocksWithJsonArray;
            defineBlocks(ext.blockdef);

            for (const def of ext.blockdef) {
        if (def.type) info.blockTypes.push(def.type);
}
        }

                if (ext.gen) {
                    try {

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
        lastLoaded = info.id;
        try { console.log('Loaded extension', info.id); } catch (e) {}
        saveToStorage();
        return info;
        }

                function removeExtension(id) {
            const idx = loaded.findIndex(e => e.id === id);
if (idx === -1) return false;
            const ext = loaded[idx];

        for (const type of ext.blockTypes) {
delete Blockly.Blocks[type];
        if (window.htmlGenerator) delete window.htmlGenerator.forBlock[type];
        else if (typeof htmlGenerator !== 'undefined') delete htmlGenerator.forBlock[type];
            }

                loaded.splice(idx, 1);
                    saveToStorage();
                    return true;
                }

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

    function refreshToolbox(workspaceRef, baseToolbox) {
     const extCat = getToolboxCategory();
     const newToolbox = {
    kind: baseToolbox.kind,
        contents: [...baseToolbox.contents]
};

            const extIdx = newToolbox.contents.findIndex(c => c.name === 'Extensions');
            if (extIdx !== -1) {
            newToolbox.contents.splice(extIdx, 1);
                }

                if (extCat) {
                newToolbox.contents.push(extCat);
            }

workspaceRef.updateToolbox(newToolbox);
        }

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
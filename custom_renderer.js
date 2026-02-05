(function(){
    // Custom renderer scaffold for WebBlocks — builds on top of Zel os if available.
    if (!window.Blockly || !Blockly.blockRendering) {
        console.warn('Blockly or blockRendering API not present — skipping custom renderer registration.');
        return;
    }

    // Zel os renderer may be available as Blockly.blockRendering['zelos'] or Blockly.blockRendering.Zelos
    const ZelosRenderer = Blockly.blockRendering && (Blockly.blockRendering['Zelos'] || Blockly.blockRendering.Zelos || Blockly.blockRendering['zelos']);
    if (!ZelosRenderer) {
        console.warn('Zelos renderer class not found; custom renderer will fallback to existing zelos renderer at runtime.');
    }

    // Define lightweight custom shape classes only if rendering classes exist
    function safeExtend(base) {
        return class extends base {
            constructor(constants) { super(constants); }
        };
    }

    // Create the renderer class, delegating to Zelos when present.
    class WebblocksRenderer extends (ZelosRenderer || Blockly.blockRendering.Renderer) {
        constructor(name) {
            super(name);
        }

        // Allow Zelos to provide constants, then patch shapes if possible.
        makeConstants_() {
            const constants = (typeof super.makeConstants_ === 'function') ? super.makeConstants_() : new Blockly.blockRendering.ConstantProvider();

            // Try to add distinctive shape constructors for arrays/objects.
            try {
                const ShapeClass = constants.shape && Object.values(constants.shape)[0] && Object.values(constants.shape)[0].constructor;
                if (ShapeClass) {
                    // Simple wrappers that defer to existing shape implementation (placeholder for future custom path math)
                    class ArrayShape extends safeExtend(ShapeClass) {}
                    class ObjectShape extends safeExtend(ShapeClass) {}

                    // Register shapes under keys we can reference in a renderer map
                    constants.shape['WEBBLOCKS_ARRAY'] = new ArrayShape(constants);
                    constants.shape['WEBBLOCKS_OBJECT'] = new ObjectShape(constants);
                }
            } catch (e) {
                console.warn('WebblocksRenderer: could not create custom shapes', e);
            }

            return constants;
        }

        // Optionally override getShapeForBlock to pick our shapes based on block type (Zelos provides similar hook)
        getRenderedShape_(block) {
            // If Zelos provides this method, call it and then potentially override
            if (typeof super.getRenderedShape_ === 'function') {
                const shape = super.getRenderedShape_(block);
                try {
                    const t = block && block.type ? block.type : '';
                    if (t && t.startsWith('arr_') && this.constants_.shape['WEBBLOCKS_ARRAY']) {
                        return this.constants_.shape['WEBBLOCKS_ARRAY'];
                    }
                    if (t && t.startsWith('obj_') && this.constants_.shape['WEBBLOCKS_OBJECT']) {
                        return this.constants_.shape['WEBBLOCKS_OBJECT'];
                    }
                } catch (e) {
                    // ignore
                }
                return shape;
            }
            return null;
        }
    }

    // Register the renderer in Blockly's registry if available
    try {
        if (Blockly.blockRendering && typeof Blockly.blockRendering.register === 'function') {
            Blockly.blockRendering.register('webblocks', WebblocksRenderer);
            console.log('Registered renderer: webblocks');
        } else if (Blockly.registry && Blockly.registry.register) {
            // Some Blockly builds expose a registry API
            Blockly.registry.register(Blockly.registry.Type.RENDERER, 'webblocks', WebblocksRenderer);
            console.log('Registered renderer via Blockly.registry: webblocks');
        } else {
            // Best-effort attach; set a property so it can be referenced by name later
            Blockly.blockRendering['webblocks'] = WebblocksRenderer;
            console.log('Attached WebblocksRenderer to Blockly.blockRendering.webblocks (no formal registry available)');
        }
    } catch (e) {
        console.warn('Failed to register webblocks renderer', e);
    }
})();

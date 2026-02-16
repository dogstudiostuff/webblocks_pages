
(function(){

    var _dbg = true;

    if (!window.Blockly || !Blockly.blockRendering) {
        console.warn('Blockly or blockRendering API not present — skipping custom renderer registration.');
        return;
    }

    const ZelosRenderer = Blockly.blockRendering && (Blockly.blockRendering['Zelos'] || Blockly.blockRendering.Zelos || Blockly.blockRendering['zelos']);
    if (!ZelosRenderer) {
        console.warn('Zelos renderer class not found; custom renderer will fallback to existing zelos renderer at runtime.');
    }

    function safeExtend(base) {
        return class extends base {
            constructor(constants) { super(constants); }
        };
    }

    class WebblocksRenderer extends (ZelosRenderer || Blockly.blockRendering.Renderer) {
        constructor(name) {
            super(name);
        }

        makeConstants_() {
            const constants = (typeof super.makeConstants_ === 'function') ? super.makeConstants_() : new Blockly.blockRendering.ConstantProvider();

            try {
                const ShapeClass = constants.shape && Object.values(constants.shape)[0] && Object.values(constants.shape)[0].constructor;
                if (ShapeClass) {

                    class ArrayShape extends safeExtend(ShapeClass) {}
                    class ObjectShape extends safeExtend(ShapeClass) {}

                    constants.shape['WEBBLOCKS_ARRAY'] = new ArrayShape(constants);
                    constants.shape['WEBBLOCKS_OBJECT'] = new ObjectShape(constants);
                }
            } catch (e) {
                console.warn('WebblocksRenderer: could not create custom shapes', e);
            }

            return constants;
        }

        getRenderedShape_(block) {

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

                }
                return shape;
            }
            return null;
        }
    }

    try {
        if (Blockly.blockRendering && typeof Blockly.blockRendering.register === 'function') {
            Blockly.blockRendering.register('webblocks', WebblocksRenderer);
            console.log('Registered renderer: webblocks');
        } else if (Blockly.registry && Blockly.registry.register) {

            Blockly.registry.register(Blockly.registry.Type.RENDERER, 'webblocks', WebblocksRenderer);
            console.log('Registered renderer via Blockly.registry: webblocks');
        } else {

            Blockly.blockRendering['webblocks'] = WebblocksRenderer;
            console.log('Attached WebblocksRenderer to Blockly.blockRendering.webblocks (no formal registry available)');
        }
    } catch (e) {
        console.warn('Failed to register webblocks renderer', e);
    }
})();
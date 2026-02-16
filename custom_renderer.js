
(function () {
    if (!window.Blockly || !Blockly.blockRendering) {
        console.warn('Blockly blockRendering API missing — skipping webblocks renderer');
        return;
    }

    
    class WebBlocksConstants extends Blockly.blockRendering.ConstantProvider {
        constructor() {
            super();
        }

        init() {
            super.init();
            
            
            try {
                
                this.GRID_UNIT = Math.max(this.GRID_UNIT || 8, 8);
                
                this.CORNER_RADIUS = Math.max(10, Math.round((this.GRID_UNIT || 8) * 1.25));
                
                this.WEBBLOCKS_EXTRA_TEXT_PADDING = this.WEBBLOCKS_EXTRA_TEXT_PADDING || 8;
                
                if (typeof this.FIELD_HEIGHT === 'number') this.FIELD_HEIGHT = Math.max(this.FIELD_HEIGHT, 20);
                if (typeof this.SMALL_PADDING === 'number') this.SMALL_PADDING = Math.max(this.SMALL_PADDING || 6, 6);

                
                
                if (window.Blockly && Blockly.zelos && Blockly.zelos.ConstantProvider) {
                    try {
                        var zc = new Blockly.zelos.ConstantProvider();
                        zc.init && zc.init();
                        if (zc.SHAPES && zc.ROUND) {
                            this.SHAPES.ROUND = zc.SHAPES.ROUND;
                            this.ROUND = zc.ROUND;
                        }
                        if (zc.SHAPES && zc.SQUARED) {
                            this.SHAPES.SQUARED = zc.SHAPES.SQUARED;
                            this.SQUARED = zc.SQUARED;
                        }
                        
                        this._zelosConstants = zc;
                    } catch (e) {
                        
                    }
                }
            } catch (e) { }
        }

        



        shapeFor(connection) {
            
            try {
                var checks = connection.getCheck && connection.getCheck();
                if (!checks && connection.targetConnection) checks = connection.targetConnection.getCheck && connection.targetConnection.getCheck();
                if (checks && checks.includes && checks.includes('Boolean')) {
                    if (this._zelosConstants && typeof this._zelosConstants.shapeFor === 'function') {
                        return this._zelosConstants.shapeFor(connection);
                    }
                }
            } catch (e) { }
            return super.shapeFor(connection);
        }
    }

    
    class WebBlocksRenderInfo extends Blockly.blockRendering.RenderInfo {
        constructor(renderer, block) {
            super(renderer, block);
        }

        finalizeOutputConnection_() {
            super.finalizeOutputConnection_();

            if (!this.outputConnection || !this.outputConnection.isDynamicShape) return;
            var shape = this.outputConnection.shape;
            if (!shape || typeof shape.textPadding !== 'function') return;

            
            
            try {
                var blockChecks = (this.outputConnection.getCheck && this.outputConnection.getCheck()) || (this.block_ && this.block_.outputConnection && this.block_.outputConnection.getCheck && this.block_.outputConnection.getCheck());
                if (blockChecks && blockChecks.includes && blockChecks.includes('Boolean')) return;

                if (this.constants_ && this.constants_.ROUND && this.constants_.ROUND.type === shape.type) return;
                if (this.constants_ && this.constants_.SQUARED && this.constants_.SQUARED.type === shape.type) return;
            } catch (e) { }

            var h = this.outputConnection.height;
            var pad = shape.textPadding(h);
            if (typeof pad === 'number') pad = { left: pad, right: pad };

            var origStartX = this.startX;
            var baseStartX = (pad && typeof pad.left === 'number') ? pad.left : 0;

            var extra = Math.round(Math.max(0, this.width * 0.18));
            var newStartX = baseStartX + extra;
            var delta = newStartX - origStartX;
            if (delta === 0) return;

            this.startX = newStartX;
            this.width += delta;
            this.widthWithChildren += delta;

            if (this.rightSide) {
                this.rightSide.width = pad.right || 0;
                this.rightSide.xPos = this.width - (pad.right || 0);
            }

            
            try {
                if (this.rows && Array.isArray(this.rows)) {
                    for (var ri = 0; ri < this.rows.length; ri++) {
                        var row = this.rows[ri];
                        if (!row) continue;
                        if (typeof row.xPos === 'number') row.xPos += delta;
                        if (row.elements && Array.isArray(row.elements)) {
                            for (var ei = 0; ei < row.elements.length; ei++) {
                                var el = row.elements[ei];
                                if (!el) continue;
                                if (typeof el.xPos === 'number') el.xPos += delta;
                                if (typeof el.xPos_ === 'number') el.xPos_ += delta;
                            }
                        }
                    }
                }
            } catch (e) { }

            
            try {
                (function (block, delta) {
                    setTimeout(function () {
                        try {
                            var root = (block.getSvgRoot && block.getSvgRoot()) || block.svgGroup;
                            if (!root) return;
                            var texts = root.querySelectorAll && root.querySelectorAll('text.blocklyText');
                            if (!texts || !texts.length) return;
                            for (var i = 0; i < texts.length; i++) {
                                var t = texts[i];
                                var orig = t.getAttribute('data-wb-orig-x');
                                if (orig === null) {
                                    var cx = t.getAttribute('x');
                                    if (cx === null) {
                                        try { var bbox = t.getBBox(); cx = bbox.x + bbox.width / 2; } catch (e) { continue; }
                                    }
                                    t.setAttribute('data-wb-orig-x', cx);
                                    orig = cx;
                                }
                                var baseX = parseFloat(orig);
                                if (isNaN(baseX)) continue;
                                var nx = baseX + delta;
                                if (!isNaN(nx)) t.setAttribute('x', nx);
                            }
                        } catch (e) { }
                    }, 0);
                })(this.block_, delta);
            } catch (e) { }
        }
    }

    class WebBlocksRenderer extends Blockly.blockRendering.Renderer {
        constructor(name) { super(name); }
        makeConstants_() { return new WebBlocksConstants(); }
        makeRenderInfo_(block) { return new WebBlocksRenderInfo(this, block); }
    }

    try {
        if (Blockly.blockRendering && typeof Blockly.blockRendering.register === 'function') {
            Blockly.blockRendering.register('webblocks', WebBlocksRenderer);
            console.log('Registered standalone webblocks renderer');
        } else if (Blockly.registry && Blockly.registry.register) {
            Blockly.registry.register(Blockly.registry.Type.RENDERER, 'webblocks', WebBlocksRenderer);
            console.log('Registered webblocks renderer via registry');
        } else {
            Blockly.blockRendering['webblocks'] = WebBlocksRenderer;
            console.log('Attached webblocks renderer to blockRendering.webblocks');
        }
    } catch (e) {
        console.warn('Failed to register webblocks renderer', e);
    }

})();
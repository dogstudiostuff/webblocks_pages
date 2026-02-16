(function () {
    
    if (!window.Blockly) {
        console.error('Blockly is not loaded. Cannot register WebBlocks renderer.');
        return;
    }

    
    window.WEBBLOCKS_OUTPUT_SHAPE_HEXAGONAL = 1;
    window.WEBBLOCKS_OUTPUT_SHAPE_ROUND = 2;
    window.WEBBLOCKS_OUTPUT_SHAPE_SQUARE = 3;

    
    const TICKET_SHAPE_ID = 6;
    window.WEBBLOCKS_OUTPUT_SHAPE_TICKET = TICKET_SHAPE_ID;

    
    var _nextShapeId = 100;
    var _customShapes = {};
    var _customTypeChecks = {};
    var _allConstants = new Set(); 

    window.WEBBLOCKS_SHAPES = {
        register: function (name, pathFn) {
            var id = _nextShapeId++;
            _customShapes[name] = { id: id, pathFn: pathFn };

            
            _allConstants.forEach(function (c) {
                _applyShape(c, name, _customShapes[name]);
            });

            
            var extName = 'shape_' + name;
            if (!Blockly.Extensions.isRegistered(extName)) {
                Blockly.Extensions.register(extName, function () {
                    if (this.outputConnection) this.setOutputShape(id);
                });
            }

            window['WEBBLOCKS_OUTPUT_SHAPE_' + name.toUpperCase()] = id;
            return id;
        },

        getId: function (name) {
            var s = _customShapes[name];
            return s ? s.id : undefined;
        },

        getAll: function () {
            var out = {};
            for (var level in _customShapes) out[level] = _customShapes[level].id;
            return out;
        },

        registerTypeCheck: function (typeName, shapeName) {
            _customTypeChecks[typeName] = shapeName;
        }
    };

    

    
    var BaseRenderer = (Blockly.zelos && Blockly.zelos.Renderer) ? Blockly.zelos.Renderer : Blockly.blockRendering.Renderer;
    var BaseConstants = (Blockly.zelos && Blockly.zelos.ConstantProvider) ? Blockly.zelos.ConstantProvider : Blockly.blockRendering.ConstantProvider;
    var BaseRenderInfo = (Blockly.zelos && Blockly.zelos.RenderInfo) ? Blockly.zelos.RenderInfo : Blockly.blockRendering.RenderInfo;

    
    var arc = Blockly.utils.svgPaths.arc;
    var point = Blockly.utils.svgPaths.point;
    var lineV = Blockly.utils.svgPaths.lineOnAxis;

    class WebBlocksConstants extends BaseConstants {
        constructor() {
            super();
            this.SHAPES.TICKET = TICKET_SHAPE_ID;

            
            this.GRID_UNIT = this.GRID_UNIT || 4;
            var g = this.GRID_UNIT;

            
            this.SHAPE_IN_SHAPE_PADDING = this.SHAPE_IN_SHAPE_PADDING || {};
            this.SHAPE_IN_SHAPE_PADDING[TICKET_SHAPE_ID] = {
                0: 2 * g, 1: 2 * g, 2: 2 * g, 3: 2 * g, [TICKET_SHAPE_ID]: 2 * g
            };

            
            [1, 2, 3].forEach(id => {
                if (!this.SHAPE_IN_SHAPE_PADDING[id]) this.SHAPE_IN_SHAPE_PADDING[id] = {};
                this.SHAPE_IN_SHAPE_PADDING[id][TICKET_SHAPE_ID] = 2 * g;
            });
        }

        init() {
            super.init();
            
            _allConstants.add(this);

            
            this.TICKET = this.makeTicket(3.5, 10, 2);
            
            this.TICKET_INPUT = this.makeTicket(1.5, 8, 1.5);

            
            for (var name in _customShapes) {
                _applyShape(this, name, _customShapes[name]);
            }
        }

        makeTicket(tabOut, tabH, tabR) {
            var cr = this.CORNER_RADIUS || 8;

            function makePath(height, up, right) {
                var middleH = height - 2 * cr;
                var halfStraight = Math.max(0, (middleH - tabH) / 2);
                var dy = up ? -1 : 1;
                var cornerSweep = (right === up) ? '0' : '1';
                var dx = right ? 1 : -1;

                var p = arc('a', '0 0,' + cornerSweep, cr, point((right ? 1 : -1) * cr, dy * cr));
                if (halfStraight > 0) p += lineV('v', dy * halfStraight);

                
                p += ' l ' + (dx * tabOut - dx * tabR) + ',0';
                p += arc('a', '0 0,1', tabR, point(dx * tabR, dy * tabR));
                var straightTab = Math.max(0, tabH - 2 * tabR);
                if (straightTab > 0) p += lineV('v', dy * straightTab);
                p += arc('a', '0 0,1', tabR, point(-dx * tabR, dy * tabR));
                p += ' l ' + (-dx * tabOut + dx * tabR) + ',0';

                if (halfStraight > 0) p += lineV('v', dy * halfStraight);
                p += arc('a', '0 0,' + cornerSweep, cr, point((right ? -1 : 1) * cr, dy * cr));
                return p;
            }

            return {
                type: this.SHAPES.TICKET,
                isDynamic: true,
                width: function (h) { return cr; },
                height: function (h) { return h; },
                connectionOffsetY: function (h) { return h / 2; },
                connectionOffsetX: function (w) { return -w; },
                pathDown: function (h) { return makePath(h, false, false); },
                pathUp: function (h) { return makePath(h, true, false); },
                pathRightDown: function (h) { return makePath(h, false, true); },
                pathRightUp: function (h) { return makePath(h, true, true); }
            };
        }

        shapeFor(connection) {
            if (connection.type === Blockly.ConnectionType.INPUT_VALUE ||
                connection.type === Blockly.ConnectionType.OUTPUT_VALUE) {

                var sourceBlock = connection.getSourceBlock();
                var outputShape = sourceBlock ? sourceBlock.getOutputShape() : null;

                
                for (var name in _customShapes) {
                    if (outputShape === _customShapes[name].id) {
                        if (!this[name.toUpperCase()]) {
                            _applyShape(this, name, _customShapes[name]);
                        }
                        return this[name.toUpperCase()];
                    }
                }

                if (outputShape === this.SHAPES.TICKET) return this.TICKET;

                
                var checks = connection.getCheck();
                if (!checks && connection.targetConnection) {
                    checks = connection.targetConnection.getCheck();
                }
                if (checks) {
                    if (checks.includes('Object')) {
                        if (connection.type === Blockly.ConnectionType.INPUT_VALUE && this.TICKET_INPUT) {
                            return this.TICKET_INPUT;
                        }
                        return this.TICKET;
                    }
                    
                    if (checks.includes('Array') && this.SHAPES.SQUARED) return this.SQUARED;

                    for (var typeName in _customTypeChecks) {
                        if (checks.includes(typeName)) {
                            var sName = _customTypeChecks[typeName];
                            if (this[sName.toUpperCase()]) return this[sName.toUpperCase()];
                        }
                    }
                }
            }
            return super.shapeFor(connection);
        }
    }

    class WebBlocksRenderInfo extends BaseRenderInfo {
        constructor(renderer, block) {
            super(renderer, block);
        }

        finalizeOutputConnection_() {
            super.finalizeOutputConnection_();

            
            if (!this.outputConnection || !this.outputConnection.isDynamicShape) return;
            var shape = this.outputConnection.shape;

            if (!shape) return;

            
            var sType = shape.type;
            if (!(typeof sType === 'number' && (sType >= 100 || sType === TICKET_SHAPE_ID))) return;
            var mediaShapeId = window.WEBBLOCKS_OUTPUT_SHAPE_MEDIA;
            var isMediaShape = (typeof mediaShapeId === 'number' && sType === mediaShapeId);
            var isTicketShape = (sType === TICKET_SHAPE_ID);

            
            var h = this.outputConnection.height;
            var pad = (shape.textPadding && typeof shape.textPadding === 'function')
                ? shape.textPadding(h)
                : (h * 0.2); 

            if (typeof pad === 'number') pad = { left: pad, right: pad };

            
            
            if (isMediaShape) {
                var mediaW = (typeof shape.width === 'function') ? shape.width(h) : 10;
                pad = { left: Math.ceil(mediaW + 5), right: 0 };
            }
            if (isTicketShape) {
                var ticketW = (typeof shape.width === 'function') ? shape.width(h) : 8;
                pad = { left: Math.ceil(ticketW), right: 0 };
            }

            var origStartX = this.startX;
            var baseStartX = (pad && typeof pad.left === 'number') ? pad.left : 0;

            
            var extra = (isMediaShape || isTicketShape) ? 0 : Math.round(Math.max(0, this.width * 0.12));
            var newStartX = baseStartX + extra;
            var delta = newStartX - origStartX;

            
            this.startX = newStartX;
            this.width += delta;
            this.widthWithChildren += delta;

            if (this.rightSide) {
                this.rightSide.xPos = this.width - (pad.right || 0);
            }

            
            
            
            
            if (delta !== 0) {
                var block = this.block_;
                setTimeout(function () {
                    if (!block || block.disposed) return;
                    var root = block.getSvgRoot();
                    if (!root) return;

                    var texts = root.querySelectorAll('text.blocklyText');
                    for (var i = 0; i < texts.length; i++) {
                        var t = texts[i];

                        
                        var existingX = parseFloat(t.getAttribute('x'));
                        var origX = t.getAttribute('data-wb-orig-x');

                        if (!origX) {
                            t.setAttribute('data-wb-orig-x', existingX);
                            origX = existingX;
                        }

                        t.setAttribute('x', parseFloat(origX) + delta);
                    }
                }, 0);
            }
        }
    }

    class WebBlocksRenderer extends BaseRenderer {
        constructor(name) { super(name); }
        makeConstants_() { return new WebBlocksConstants(); }
        makeRenderInfo_(block) { return new WebBlocksRenderInfo(this, block); }
    }

    
    function _applyShape(constants, name, shapeInfo) {
        var shape = shapeInfo.pathFn(constants);
        shape.type = shapeInfo.id;

        constants.SHAPES[name.toUpperCase()] = shapeInfo.id;
        constants[name.toUpperCase()] = shape;

        
        if (typeof shape.textPadding !== 'function') {
            var g = constants.GRID_UNIT || 4;
            shape.textPadding = function (h) {
                try {
                    var w = (typeof shape.width === 'function') ? shape.width(h) : (h * 0.2);
                    var pad = Math.ceil(w + 2 * g + 6);
                    return { left: pad, right: 0 };
                } catch (e) {
                    return Math.ceil(h * 0.2) + 6;
                }
            };
        }

        
        var g = constants.GRID_UNIT;
        var paddingMap = constants.SHAPE_IN_SHAPE_PADDING;

        if (!paddingMap[shapeInfo.id]) {
            paddingMap[shapeInfo.id] = {};
            
            [0, 1, 2, 3, TICKET_SHAPE_ID].forEach(id => paddingMap[shapeInfo.id][id] = 2 * g);
        }

        
        for (var key in paddingMap) {
            paddingMap[key][shapeInfo.id] = 2 * g;
        }
    }

    
    Blockly.blockRendering.register('webblocks', WebBlocksRenderer);

    console.log('✅ WebBlocks Renderer Registered (Unified)');
})();

 (function () {
 // quick handwritten renderer tweaks — I leave small notes when I mess with this
 if (!Blockly || !Blockly.zelos) {
 console.warn('Blockly.zelos not available — cannot register webblocks renderer.');
 return;
 }

    var arc   = Blockly.utils.svgPaths.arc;
      var point = Blockly.utils.svgPaths.point;
    var lineV = Blockly.utils.svgPaths.lineOnAxis;
    var _cf = null; // leftover config var I sometimes use

  var TICKET_SHAPE_ID = 6;

  class WebBlocksConstants extends Blockly.zelos.ConstantProvider {
constructor() {
  super();
  this.SHAPES.TICKET = TICKET_SHAPE_ID;

      var g = this.GRID_UNIT;
this.SHAPE_IN_SHAPE_PADDING[TICKET_SHAPE_ID] = {
      0: 2 * g, 1: 2 * g, 2: 2 * g, 3: 2 * g, [TICKET_SHAPE_ID]: 2 * g
      };

        this.SHAPE_IN_SHAPE_PADDING[1][TICKET_SHAPE_ID] = 5 * g;
      this.SHAPE_IN_SHAPE_PADDING[2][TICKET_SHAPE_ID] = 2 * g;
      this.SHAPE_IN_SHAPE_PADDING[3][TICKET_SHAPE_ID] = 2 * g;
      }

      init() {
    super.init();
this.TICKET = this.makeTicket();
    }

    makeTicket() {
var cr       = this.CORNER_RADIUS;
    var tabOut   = 6;
     var tabH     = 12;
     var tabR     = 2.5;

     function makePath(height, up, right) {
    var middleH      = height - 2 * cr;
      var halfStraight = Math.max(0, (middleH - tabH) / 2);
      var dy           = up ? -1 : 1;
      var cornerSweep  = (right === up) ? '0' : '1';

var dx           = right ? 1 : -1;

        var p = arc('a', '0 0,' + cornerSweep, cr,
        point((right ? 1 : -1) * cr, dy * cr));

        if (halfStraight > 0) p += lineV('v', dy * halfStraight);

        p += ' l ' + (dx * tabOut - dx * tabR) + ',0';
        p += arc('a', '0 0,1', tabR,
                    point(dx * tabR, dy * tabR));

        var straightTab = Math.max(0, tabH - 2 * tabR);
        if (straightTab > 0) p += lineV('v', dy * straightTab);

        p += arc('a', '0 0,1', tabR,
        point(-dx * tabR, dy * tabR));

        p += ' l ' + (-dx * tabOut + dx * tabR) + ',0';

        if (halfStraight > 0) p += lineV('v', dy * halfStraight);

        p += arc('a', '0 0,' + cornerSweep, cr,
                 point((right ? -1 : 1) * cr, dy * cr));
        return p;
        }

        return {
        type:              this.SHAPES.TICKET,
        isDynamic:         true,
                 width:             function (h) { return cr; },
        height:            function (h) { return h;  },
      connectionOffsetY: function (h) { return h / 2; },
connectionOffsetX: function (w) { return -w; },
      pathDown:          function (h) { return makePath(h, false, false); },
        pathUp:            function (h) { return makePath(h, true,  false); },
        pathRightDown:     function (h) { return makePath(h, false, true);  },
        pathRightUp:       function (h) { return makePath(h, false, true);  }
        };
        }

        shapeFor(connection) {
        if (connection.type === Blockly.ConnectionType.INPUT_VALUE ||
        connection.type === Blockly.ConnectionType.OUTPUT_VALUE) {

var outputShape = connection.getSourceBlock().getOutputShape();
    if (outputShape === this.SHAPES.TICKET) return this.TICKET;

     var checks = connection.getCheck();
    if (!checks && connection.targetConnection) {
      checks = connection.targetConnection.getCheck();
          }
if (checks) {
        if (checks.includes('Object')) return this.TICKET;
        if (checks.includes('Array'))  return this.SQUARED;

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

              class WebBlocksRenderInfo extends Blockly.zelos.RenderInfo {
            constructor(renderer, block) {
          super(renderer, block);
        }

    finalizeOutputConnection_() {
  super.finalizeOutputConnection_();

  if (!this.outputConnection || !this.outputConnection.isDynamicShape) return;
  var shape = this.outputConnection.shape;
    if (!shape || typeof shape.textPadding !== 'function') return;

    var h = this.outputConnection.height;
var pad = shape.textPadding(h);
    if (typeof pad === 'number') pad = { left: pad, right: pad };

     var origStartX = this.startX;
     var newStartX = pad.left;
     var delta = newStartX - origStartX;
     this.startX = newStartX;
     this.width += delta;
     this.widthWithChildren += delta;

      if (this.rightSide) {
      this.rightSide.width = pad.right;

this.rightSide.xPos = this.width - pad.right;
      }
      }
      }

      class WebBlocksRenderer extends Blockly.zelos.Renderer {
      constructor(name) { super(name); }
      makeConstants_() { return new WebBlocksConstants(); }
      makeRenderInfo_(block) { return new WebBlocksRenderInfo(this, block); }
      }

      Blockly.blockRendering.register('webblocks', WebBlocksRenderer);

      window.WEBBLOCKS_OUTPUT_SHAPE_HEXAGONAL = 1;
        window.WEBBLOCKS_OUTPUT_SHAPE_ROUND = 2;
        window.WEBBLOCKS_OUTPUT_SHAPE_SQUARE = 3;
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

function _applyShape(constants, name, shapeInfo) {
      var shape = shapeInfo.pathFn(constants);
      shape.type = shapeInfo.id;
        constants.SHAPES[name.toUpperCase()] = shapeInfo.id;
      constants[name.toUpperCase()] = shape;

      var g = constants.GRID_UNIT;
      if (!constants.SHAPE_IN_SHAPE_PADDING[shapeInfo.id]) {
        constants.SHAPE_IN_SHAPE_PADDING[shapeInfo.id] = {
          0: 2 * g, 1: 2 * g, 2: 2 * g, 3: 2 * g, [TICKET_SHAPE_ID]: 2 * g
        };
      }

      for (var s = 0; s <= 3; s++) {
      if (constants.SHAPE_IN_SHAPE_PADDING[s]) {
constants.SHAPE_IN_SHAPE_PADDING[s][shapeInfo.id] = 2 * g;
      }
    }
if (constants.SHAPE_IN_SHAPE_PADDING[TICKET_SHAPE_ID]) {
    constants.SHAPE_IN_SHAPE_PADDING[TICKET_SHAPE_ID][shapeInfo.id] = 2 * g;
    }

      for (var otherName in _customShapes) {
    var otherId = _customShapes[otherName].id;
if (otherId !== shapeInfo.id) {
    if (constants.SHAPE_IN_SHAPE_PADDING[shapeInfo.id]) {
    constants.SHAPE_IN_SHAPE_PADDING[shapeInfo.id][otherId] = 2 * g;
      }
      if (constants.SHAPE_IN_SHAPE_PADDING[otherId]) {
      constants.SHAPE_IN_SHAPE_PADDING[otherId][shapeInfo.id] = 2 * g;
    }
}
    }
     }

     var _origInit = WebBlocksConstants.prototype.init;
     WebBlocksConstants.prototype.init = function () {
    _origInit.call(this);
      _allConstants.add(this);
    for (var name in _customShapes) {
  _applyShape(this, name, _customShapes[name]);
}
  };

    var _origShapeFor = WebBlocksConstants.prototype.shapeFor;
    WebBlocksConstants.prototype.shapeFor = function (connection) {
if (connection.type === Blockly.ConnectionType.INPUT_VALUE ||
    connection.type === Blockly.ConnectionType.OUTPUT_VALUE) {
    var outputShape = connection.getSourceBlock().getOutputShape();

      for (var name in _customShapes) {
        if (outputShape === _customShapes[name].id) {

    if (!this[name.toUpperCase()]) {
    _applyShape(this, name, _customShapes[name]);
    }
      return this[name.toUpperCase()];
        }
      }
    }
    return _origShapeFor.call(this, connection);
      };

    console.log('✅ Registered webblocks renderer (extends Zelos, adds ticket shape + extension shape API)');
    })();
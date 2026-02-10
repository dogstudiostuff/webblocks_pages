/**
 * WebBlocks Custom Renderer — extends Zelos with Array (square) and Object (ticket) shapes.
 * Loaded before blocks.js and app.js so the 'webblocks' renderer is available at inject time.
 */
(function () {
  if (!Blockly || !Blockly.zelos) {
    console.warn('Blockly.zelos not available — cannot register webblocks renderer.');
    return;
  }

  var arc   = Blockly.utils.svgPaths.arc;
  var point = Blockly.utils.svgPaths.point;
  var lineV = Blockly.utils.svgPaths.lineOnAxis;

  /** Shape id used by setOutputShape() on Object reporter blocks. */
  var TICKET_SHAPE_ID = 6;

  // ─── Constants ───────────────────────────────────────────────────────
  class WebBlocksConstants extends Blockly.zelos.ConstantProvider {
    constructor() {
      super();
      this.SHAPES.TICKET = TICKET_SHAPE_ID;

      // Padding when a TICKET shape sits inside another shape
      var g = this.GRID_UNIT;
      this.SHAPE_IN_SHAPE_PADDING[TICKET_SHAPE_ID] = {
        0: 2 * g, 1: 2 * g, 2: 2 * g, 3: 2 * g, [TICKET_SHAPE_ID]: 2 * g
      };
      // Padding for TICKET inside existing container shapes
      this.SHAPE_IN_SHAPE_PADDING[1][TICKET_SHAPE_ID] = 5 * g; // inside hex
      this.SHAPE_IN_SHAPE_PADDING[2][TICKET_SHAPE_ID] = 2 * g; // inside round
      this.SHAPE_IN_SHAPE_PADDING[3][TICKET_SHAPE_ID] = 2 * g; // inside square
    }

    init() {
      super.init();
      this.TICKET = this.makeTicket();
    }

    /**
     * Ticket shape — a rounded rectangle with small rounded-square
     * tabs protruding outward on both sides, giving a classic
     * "admission ticket / tag" look.
     */
    makeTicket() {
      var cr       = this.CORNER_RADIUS;   // corner radius (same as squared)
      var tabOut   = 10;                    // how far the tab protrudes outward
      var tabH     = 18;                    // total height of the tab
      var tabR     = 4;                     // corner radius of the tab

      function makePath(height, up, right) {
        var middleH      = height - 2 * cr;
        var halfStraight = Math.max(0, (middleH - tabH) / 2);
        var dy           = up ? -1 : 1;
        var cornerSweep  = (right === up) ? '0' : '1';
        // Tab protrudes outward: left side → left (-x), right side → right (+x)
        var dx           = right ? 1 : -1;

        // Top corner
        var p = arc('a', '0 0,' + cornerSweep, cr,
                    point((right ? 1 : -1) * cr, dy * cr));
        // Line down to tab start
        if (halfStraight > 0) p += lineV('v', dy * halfStraight);
        // Rounded-square outward tab: out, down, back in
        // Top-outer corner
        p += ' l ' + (dx * tabOut - dx * tabR) + ',0';
        p += arc('a', '0 0,1', tabR,
                 point(dx * tabR, dy * tabR));
        // Straight down the tab side
        var straightTab = Math.max(0, tabH - 2 * tabR);
        if (straightTab > 0) p += lineV('v', dy * straightTab);
        // Bottom-outer corner
        p += arc('a', '0 0,1', tabR,
                 point(-dx * tabR, dy * tabR));
        // Back inward
        p += ' l ' + (-dx * tabOut + dx * tabR) + ',0';
        // Line down to bottom corner
        if (halfStraight > 0) p += lineV('v', dy * halfStraight);
        // Bottom corner
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

    /**
     * Override shapeFor to return TICKET for Object connections
     * and SQUARED for Array connections (even on empty input slots).
     */
    shapeFor(connection) {
      if (connection.type === Blockly.ConnectionType.INPUT_VALUE ||
          connection.type === Blockly.ConnectionType.OUTPUT_VALUE) {

        // 1) Honour the explicit outputShape set by extensions
        var outputShape = connection.getSourceBlock().getOutputShape();
        if (outputShape === this.SHAPES.TICKET) return this.TICKET;

        // 2) For empty inputs, match shape to accepted type
        var checks = connection.getCheck();
        if (!checks && connection.targetConnection) {
          checks = connection.targetConnection.getCheck();
        }
        if (checks) {
          if (checks.includes('Object')) return this.TICKET;
          if (checks.includes('Array'))  return this.SQUARED;
          // Check extension-registered type→shape mappings
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

  // ─── Renderer ────────────────────────────────────────────────────────
  class WebBlocksRenderInfo extends Blockly.zelos.RenderInfo {
    constructor(renderer, block) {
      super(renderer, block);
    }

    /**
     * After the output connection is finalized, apply the custom shape's
     * textPadding to adjust startX so text is properly centred.
     *
     * By default, Blockly sets startX = shape.width(h), pushing content
     * right by the full shape border width. Custom shapes can provide a
     * textPadding(h) function that returns {left, right} pixel offsets
     * (or just a number for symmetric padding) to override this.
     */
    finalizeOutputConnection_() {
      super.finalizeOutputConnection_();

      if (!this.outputConnection || !this.outputConnection.isDynamicShape) return;
      var shape = this.outputConnection.shape;
      if (!shape || typeof shape.textPadding !== 'function') return;

      var h = this.outputConnection.height;
      var pad = shape.textPadding(h);
      if (typeof pad === 'number') pad = { left: pad, right: pad };

      // Current startX was set to shape.width(h) — adjust it
      var origStartX = this.startX;
      var newStartX = pad.left;
      var delta = newStartX - origStartX;
      this.startX = newStartX;
      this.width += delta;
      this.widthWithChildren += delta;

      // Adjust right side padding too
      if (this.rightSide && this.rightSide.xPos > 0) {
        var rightDelta = pad.right - origStartX;
        this.rightSide.width = pad.right;
        this.rightSide.xPos = this.width - this.startX + pad.right - this.rightSide.width;
      }
    }
  }

  class WebBlocksRenderer extends Blockly.zelos.Renderer {
    constructor(name) { super(name); }
    makeConstants_() { return new WebBlocksConstants(); }
    makeRenderInfo_(block) { return new WebBlocksRenderInfo(this, block); }
  }

  Blockly.blockRendering.register('webblocks', WebBlocksRenderer);

  // Expose shape IDs so blocks.js and extensions can reference them
  // (Blockly v12 removed Blockly.OUTPUT_SHAPE_* constants)
  window.WEBBLOCKS_OUTPUT_SHAPE_HEXAGONAL = 1;
  window.WEBBLOCKS_OUTPUT_SHAPE_ROUND = 2;
  window.WEBBLOCKS_OUTPUT_SHAPE_SQUARE = 3;
  window.WEBBLOCKS_OUTPUT_SHAPE_TICKET = TICKET_SHAPE_ID;

  // ─── Extension Shape API ─────────────────────────────────────────
  // Expose a registry so extensions can add custom shapes at runtime.
  // Each custom shape gets a unique numeric id starting at 100.
  var _nextShapeId = 100;
  var _customShapes = {};        // name → { id, pathFn }
  var _customTypeChecks = {};   // type check string → shape name
  var _allConstants = new Set();  // track ALL constants instances (main + flyouts)

  window.WEBBLOCKS_SHAPES = {
    /**
     * Register a custom shape.
     * @param {string} name   - Unique shape name (e.g. "diamond", "star")
     * @param {function} pathFn - function(constants) that returns a shape object:
     *   Required:
     *     isDynamic: true,
     *     width(h), height(h), connectionOffsetY(h), connectionOffsetX(w),
     *     pathDown(h), pathUp(h), pathRightDown(h), pathRightUp(h)
     *   Optional:
     *     textPadding(h) — controls horizontal text offset inside the shape.
     *       Return a number for symmetric left+right padding, or
     *       { left: px, right: px } for asymmetric padding.
     *       If omitted, defaults to the shape's width (which may look off-center
     *       on wide shapes like diamonds).
     *
     * The pathFn receives the ConstantProvider so you can use CORNER_RADIUS,
     * GRID_UNIT, etc. It is called for every renderer constants instance
     * (main workspace and flyout).
     *
     * A Blockly extension named "shape_<name>" is auto-registered so block
     * definitions can use:  "extensions": ["shape_myshape"]
     */
    register: function (name, pathFn) {
      var id = _nextShapeId++;
      _customShapes[name] = { id: id, pathFn: pathFn };

      // Apply to ALL existing constants instances
      _allConstants.forEach(function (c) {
        _applyShape(c, name, _customShapes[name]);
      });

      // Register Blockly extension "shape_<name>"
      var extName = 'shape_' + name;
      if (!Blockly.Extensions.isRegistered(extName)) {
        Blockly.Extensions.register(extName, function () {
          if (this.outputConnection) this.setOutputShape(id);
        });
      }

      // Also expose the id on the window for easy reference
      window['WEBBLOCKS_OUTPUT_SHAPE_' + name.toUpperCase()] = id;

      return id;
    },

    /** Get the numeric shape id for a registered custom shape. */
    getId: function (name) {
      var s = _customShapes[name];
      return s ? s.id : undefined;
    },

    /** Get all registered custom shapes: { name → id } */
    getAll: function () {
      var out = {};
      for (var k in _customShapes) out[k] = _customShapes[k].id;
      return out;
    },

    /**
     * Map a type-check name to a custom shape so empty input slots
     * that accept that type display the shape outline.
     * @param {string} typeName  - e.g. "Set"
     * @param {string} shapeName - e.g. "chevron" (must already be registered)
     */
    registerTypeCheck: function (typeName, shapeName) {
      _customTypeChecks[typeName] = shapeName;
    }
  };

  function _applyShape(constants, name, shapeInfo) {
    var shape = shapeInfo.pathFn(constants);
    shape.type = shapeInfo.id;
    constants.SHAPES[name.toUpperCase()] = shapeInfo.id;
    constants[name.toUpperCase()] = shape;

    // Set up padding entries
    var g = constants.GRID_UNIT;
    if (!constants.SHAPE_IN_SHAPE_PADDING[shapeInfo.id]) {
      constants.SHAPE_IN_SHAPE_PADDING[shapeInfo.id] = {
        0: 2 * g, 1: 2 * g, 2: 2 * g, 3: 2 * g, [TICKET_SHAPE_ID]: 2 * g
      };
    }
    // Padding for this shape inside existing containers
    for (var s = 0; s <= 3; s++) {
      if (constants.SHAPE_IN_SHAPE_PADDING[s]) {
        constants.SHAPE_IN_SHAPE_PADDING[s][shapeInfo.id] = 2 * g;
      }
    }
    if (constants.SHAPE_IN_SHAPE_PADDING[TICKET_SHAPE_ID]) {
      constants.SHAPE_IN_SHAPE_PADDING[TICKET_SHAPE_ID][shapeInfo.id] = 2 * g;
    }
    // Cross-padding between custom shapes
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

  // Patch WebBlocksConstants to track every instance and apply custom shapes
  var _origInit = WebBlocksConstants.prototype.init;
  WebBlocksConstants.prototype.init = function () {
    _origInit.call(this);
    _allConstants.add(this);
    for (var name in _customShapes) {
      _applyShape(this, name, _customShapes[name]);
    }
  };

  // Patch shapeFor to recognise custom shapes (with lazy apply as safety net)
  var _origShapeFor = WebBlocksConstants.prototype.shapeFor;
  WebBlocksConstants.prototype.shapeFor = function (connection) {
    if (connection.type === Blockly.ConnectionType.INPUT_VALUE ||
        connection.type === Blockly.ConnectionType.OUTPUT_VALUE) {
      var outputShape = connection.getSourceBlock().getOutputShape();
      // Check custom shapes
      for (var name in _customShapes) {
        if (outputShape === _customShapes[name].id) {
          // Lazy apply: if this constants instance doesn't have the shape yet, apply now
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
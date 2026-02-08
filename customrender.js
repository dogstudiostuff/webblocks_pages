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
      // Pass a smaller grid unit (default Zelos is 4, we use 3) to shrink blocks
      super(3);
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
     * Ticket shape — like the squared shape but with small semicircular
     * notches cut into both sides at the midpoint, giving a classic
     * "admission ticket / coupon" look.
     */
    makeTicket() {
      var cr      = this.CORNER_RADIUS;   // corner radius (same as squared)
      var notchR  = 3;                     // notch semicircle radius

      function makePath(height, up, right) {
        var middleH     = height - 2 * cr;
        var notchD      = notchR * 2;
        var halfStraight = Math.max(0, (middleH - notchD) / 2);
        var dy          = up ? -1 : 1;
        var cornerSweep = (right === up) ? '0' : '1';
        // Notch bulges inward: left side → right bulge (CW=1), right side → left bulge (CCW=0)
        var notchSweep  = right ? '0' : '1';

        // Top corner
        var p = arc('a', '0 0,' + cornerSweep, cr,
                    point((right ? 1 : -1) * cr, dy * cr));
        // Line down to notch
        if (halfStraight > 0) p += lineV('v', dy * halfStraight);
        // Semicircular notch (inward bulge)
        p += arc('a', '0 0,' + notchSweep, notchR,
                 point(0, dy * notchD));
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
        }
      }
      return super.shapeFor(connection);
    }
  }

  // ─── Renderer ────────────────────────────────────────────────────────
  class WebBlocksRenderer extends Blockly.zelos.Renderer {
    constructor(name) { super(name); }
    makeConstants_() { return new WebBlocksConstants(); }
  }

  Blockly.blockRendering.register('webblocks', WebBlocksRenderer);

  // Expose the TICKET id so extensions can reference it
  window.WEBBLOCKS_OUTPUT_SHAPE_TICKET = TICKET_SHAPE_ID;
  console.log('✅ Registered webblocks renderer (extends Zelos, adds ticket shape)');
})();
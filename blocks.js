window.registerWebBlocks = function () {
    
    var defineBlocks = Blockly.common ? Blockly.common.defineBlocksWithJsonArray : Blockly.defineBlocksWithJsonArray;
    var _tmpBlockHint = null; 
    console.log && console.log('registerWebBlocks invoked');
    var x = 0; 

    if (!Blockly.Extensions.isRegistered('shape_square')) {
        Blockly.Extensions.register('shape_square', function () {
            if (this.outputConnection) this.setOutputShape(window.WEBBLOCKS_OUTPUT_SHAPE_SQUARE || 3);
            this._isBoxShape = true;
        });
    }

    if (!Blockly.Extensions.isRegistered('shape_ticket')) {
        Blockly.Extensions.register('shape_ticket', function () {
            if (this.outputConnection) this.setOutputShape(window.WEBBLOCKS_OUTPUT_SHAPE_TICKET || 6);
            this._isTicketShape = true;
        });
    }

    
    if (!Blockly.Extensions.isRegistered('rainbow')) {
        Blockly.Extensions.register('rainbow', function () {
            var block = this;
            
            function attach() {
                var root = (block.getSvgRoot && block.getSvgRoot()) || block.svgGroup;
                if (root) {
                    root.classList.add('wb-rainbow');
                } else {
                    
                    setTimeout(attach, 10);
                }
            }
            attach();
        });
    }

    if (window.WEBBLOCKS_SHAPES && !window.WEBBLOCKS_OUTPUT_SHAPE_MEDIA) {
        WEBBLOCKS_SHAPES.register('media', function (c) {
            var cr = c.CORNER_RADIUS;
            var notch = 5;
            return {
                isDynamic: true,
                width: function (h) { return cr + 2; },
                height: function (h) { return h; },
                connectionOffsetY: function (h) { return h / 2; },
                connectionOffsetX: function (w) { return -w; },
                pathDown: function (h) {
                    var mid = h / 2;
                    var straight = Math.max(0, mid - cr - notch);

                    return ' a ' + cr + ',' + cr + ' 0 0,0 ' + (-cr) + ',' + cr
                        + ' v ' + straight
                        + ' l ' + (-notch) + ',' + notch + ' l ' + notch + ',' + notch
                        + ' v ' + straight
                        + ' a ' + cr + ',' + cr + ' 0 0,0 ' + cr + ',' + cr;
                },
                pathUp: function (h) {
                    var mid = h / 2;
                    var straight = Math.max(0, mid - cr - notch);
                    return ' a ' + cr + ',' + cr + ' 0 0,1 ' + cr + ',' + (-cr)
                        + ' v ' + (-straight)
                        + ' l ' + notch + ',' + (-notch) + ' l ' + (-notch) + ',' + (-notch)
                        + ' v ' + (-straight)
                        + ' a ' + cr + ',' + cr + ' 0 0,1 ' + (-cr) + ',' + (-cr);
                },
                pathRightDown: function (h) {
                    var mid = h / 2;
                    var straight = Math.max(0, mid - cr - notch);
                    return ' a ' + cr + ',' + cr + ' 0 0,1 ' + cr + ',' + cr
                        + ' v ' + straight
                        + ' l ' + notch + ',' + notch + ' l ' + (-notch) + ',' + notch
                        + ' v ' + straight
                        + ' a ' + cr + ',' + cr + ' 0 0,1 ' + (-cr) + ',' + cr;
                },
                pathRightUp: function (h) {
                    var mid = h / 2;
                    var straight = Math.max(0, mid - cr - notch);
                    return ' a ' + cr + ',' + cr + ' 0 0,0 ' + (-cr) + ',' + (-cr)
                        + ' v ' + (-straight)
                        + ' l ' + (-notch) + ',' + (-notch) + ' l ' + notch + ',' + (-notch)
                        + ' v ' + (-straight)
                        + ' a ' + cr + ',' + cr + ' 0 0,0 ' + cr + ',' + (-cr);
                }
            };
        });
        WEBBLOCKS_SHAPES.registerTypeCheck('Media', 'media');
    }

    defineBlocks([
        {
            "type": "game_init",
            "message0": "Create Stage Width %1 Height %2 Color %3",
            "args0": [
                { "type": "field_number", "name": "W", "value": 800 },
                { "type": "field_number", "name": "H", "value": 600 },
                { "type": "input_value", "name": "COL", "check": "String" }
            ],
            "nextStatement": null,
            "colour": "#FFAB19",
            "tooltip": "Initialize the game canvas."
        },
        {
            "type": "game_loop",
            "message0": "Every Frame (60fps) %1",
            "args0": [{ "type": "input_statement", "name": "DO" }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FFAB19"
        },
        {
            "type": "game_move_sprite",
            "message0": "Move Sprite %1 input: %2 output: %3",
            "args0": [
                { "type": "field_input", "name": "NAME", "text": "player" },
                { "type": "input_value", "name": "X", "check": "Number" },
                { "type": "input_value", "name": "Y", "check": "Number" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF"
        },

        {
            "type": "colour_picker",
            "message0": "%1",
            "args0": [
                {
                    "type": "field_colour",
                    "name": "COLOUR",
                    "colour": "#ff0000"
                }
            ],
            "output": "String",
            "colour": "#A6745C",
            "tooltip": "Pick a color"
        },

        {
            "type": "math_number",
            "message0": "%1",
            "args0": [{ "type": "field_number", "name": "NUM", "value": 0 }],
            "output": "Number",
            "colour": "#5b67a5"
        },

        {
            "type": "ui_append",
            "message0": "append %1 to builder",
            "args0": [{ "type": "input_value", "name": "VAL" }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FF6666"
        },
        {

            "type": "ui_page_link",
            "message0": "Link to Page %1 Text %2",
            "args0": [
                { "type": "field_input", "name": "PAGE", "text": "about" },
                { "type": "input_value", "name": "TEXT", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF"
        },

        {
            "type": "meta_tailwind_cdn",
            "message0": "Initialize Tailwind CSS",
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#38bdf8",
            "tooltip": "Adds Tailwind CSS to your page"
        },

        {
            "type": "ui_tailwind_box",
            "message0": "Tailwind Box %1 Classes %2 %3 Content %4",
            "args0": [
                { "type": "input_dummy" },
                { "type": "input_value", "name": "CLASSES", "check": "String" },
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "CONTENT" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#38bdf8",
            "tooltip": "A div container using Tailwind classes (e.g., 'bg-blue-500 p-4')"
        },
        {
            "type": "text_string",
            "message0": "%1",
            "args0": [{
                "type": "field_input",
                "name": "TEXT",
                "text": "text"
            }],
            "output": "String",
            "colour": "#59C059"
        },
        { "type": "math_num", "message0": "%1", "args0": [{ "type": "field_number", "name": "NUM", "value": 0 }], "output": "Number", "colour": "#59C059" },
        { "type": "logic_bool", "message0": "%1", "args0": [{ "type": "field_dropdown", "name": "BOOL", "options": [["true", "true"], ["false", "false"]] }], "output": "Boolean", "colour": "#59C059" },

        { "type": "evil_block", "message0": "evil block", "previousStatement": null, "nextStatement": null, "colour": "#FF0000" },
        { "type": "gay_block", "message0": "gay block", "previousStatement": null, "nextStatement": null, "colour": "#FF4B7B", "extensions": ["rainbow"] },
        { "type": "hemmy_poop", "message0": "hemmy poop", "previousStatement": null, "nextStatement": null, "colour": "#c97303" },

        {
            "type": "raw_html",
            "message0": "custom html",
            "message1": "%1",
            "args1": [{
                "type": "field_multilinetext",
                "name": "CODE",
                "text": "<div></div>",
                "spellcheck": false
            }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#555555"
        },
        {
            "type": "raw_css",
            "message0": "custom css",
            "message1": "%1",
            "args1": [{
                "type": "field_multilinetext",
                "name": "CODE",
                "text": ".class { }",
                "spellcheck": false
            }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#555555"
        },
        {
            "type": "css_raw",
            "message0": "custom css",
            "message1": "%1",
            "args1": [{
                "type": "field_multilinetext",
                "name": "CODE",
                "text": ".class { }",
                "spellcheck": false
            }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#555555"
        },
        { "type": "raw_js", "message0": "custom js", "message1": "%1", "args1": [{ "type": "field_multilinetext", "name": "CODE", "text": "console.log('hi');" }], "previousStatement": null, "nextStatement": null, "colour": "#555555" },
        {
            "type": "css_id_class",
            "message0": "element with ID %1",
            "args0": [
                { "type": "input_value", "name": "ID", "check": "String" }
            ],
            "message1": "Class %1",
            "args1": [
                { "type": "input_value", "name": "CLASS", "check": "String" }
            ],
            "message2": "%1",
            "args2": [
                { "type": "input_statement", "name": "CONTENT" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF"
        },
        {
            "type": "css_inline_style",
            "message0": "inline style",
            "message1": "property %1",
            "args1": [
                { "type": "input_value", "name": "PROP", "check": "String" }
            ],
            "message2": "value %1",
            "args2": [
                { "type": "input_value", "name": "VAL", "check": "String" }
            ],
            "message3": "%1",
            "args3": [
                { "type": "input_statement", "name": "CONTENT" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "Wraps content in a div with a single inline style"
        },
        { "type": "md_block", "message0": "markdown", "message1": "%1", "args1": [{ "type": "field_multilinetext", "name": "MD", "text": "# Hello\length**Bold**" }], "previousStatement": null, "nextStatement": null, "colour": "#585858" },
        { "type": "md_code_inline", "message0": "code", "message1": "` %1 `", "args1": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#585858", "tooltip": "Inline Code" },
        { "type": "md_code_block", "message0": "code block", "message1": "%1", "args1": [{ "type": "field_multilinetext", "name": "CODE", "text": "console.log('Hello');" }], "previousStatement": null, "nextStatement": null, "colour": "#585858", "tooltip": "Code Block" },
        { "type": "md_bold", "message0": "bold text", "message1": "** %1 **", "args1": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#585858", "tooltip": "Bold Text" },
        { "type": "md_italic", "message0": "italic text", "message1": "* %1 *", "args1": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#585858", "tooltip": "Italic Text" },
        { "type": "md_quote", "message0": "blockquote", "message1": "> %1", "args1": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#585858", "tooltip": "Blockquote" },
        { "type": "md_divider", "message0": "---", "previousStatement": null, "nextStatement": null, "colour": "#585858", "tooltip": "Horizontal Rule" },

        { "type": "html_html", "message0": "html tag", "message1": "lang %1", "args1": [{ "type": "input_value", "name": "LANG", "check": "String" }], "message2": "%1", "args2": [{ "type": "input_statement", "name": "CONTENT" }], "colour": "#4C97FF" },
        { "type": "html_head", "message0": "head %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_body", "message0": "body %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_div", "message0": "div", "message1": "id %1", "args1": [{ "type": "input_value", "name": "ID", "check": "String" }], "message2": "class %1", "args2": [{ "type": "input_value", "name": "CLASS", "check": "String" }], "message3": "%1", "args3": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_section", "message0": "section %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_header", "message0": "header %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_footer", "message0": "footer %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_nav", "message0": "nav %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_main", "message0": "main %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_article", "message0": "article %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_aside", "message0": "aside %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "html_details", "message0": "details", "message1": "summary %1", "args1": [{ "type": "input_value", "name": "SUM", "check": "String" }], "message2": "%1", "args2": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },
        { "type": "meta_html_wrapper", "message0": "html %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#606060" },
        { "type": "meta_head_wrapper", "message0": "head %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#606060" },
        { "type": "meta_title", "message0": "page title %1", "args0": [{ "type": "input_value", "name": "VAL", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#606060" },
        { "type": "meta_charset", "message0": "charset utf-8", "previousStatement": null, "nextStatement": null, "colour": "#606060" },
        { "type": "meta_viewport", "message0": "viewport mobile responsive", "previousStatement": null, "nextStatement": null, "colour": "#606060" },
        { "type": "meta_favicon", "message0": "favicon url %1", "args0": [{ "type": "input_value", "name": "URL", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#606060" },
        { "type": "meta_body", "message0": "body %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#606060" },
        { "type": "meta_doctype", "message0": "<!DOCTYPE html>", "nextStatement": null, "colour": "#606060" },

        {
            "type": "layout_flex", "message0": "Flex Box", "message1": "direction %1", "args1": [
                { "type": "field_dropdown", "name": "DIR", "options": [["row", "row"], ["column", "column"]] }
            ], "message2": "justify %1 align %2", "args2": [
                { "type": "field_dropdown", "name": "JUSTIFY", "options": [["start", "flex-start"], ["center", "center"], ["end", "flex-end"], ["space-between", "space-between"]] },
                { "type": "field_dropdown", "name": "ALIGN", "options": [["stretch", "stretch"], ["start", "flex-start"], ["center", "center"], ["end", "flex-end"]] }
            ], "message3": "%1", "args3": [
                { "type": "input_statement", "name": "CONTENT" }
            ], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF"
        },
        {
            "type": "layout_grid", "message0": "Grid Box", "message1": "columns %1", "args1": [
                { "type": "input_value", "name": "COLS", "check": "String" }
            ], "message2": "gap %1", "args2": [
                { "type": "input_value", "name": "GAP", "check": "String" }
            ], "message3": "%1", "args3": [
                { "type": "input_statement", "name": "CONTENT" }
            ], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF"
        },
        { "type": "layout_div", "message0": "div", "message1": "id %1", "args1": [{ "type": "input_value", "name": "ID", "check": "String" }], "message2": "class %1", "args2": [{ "type": "input_value", "name": "CLASS", "check": "String" }], "message3": "%1", "args3": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },

        { "type": "css_style_wrapper", "message0": "style", "message1": "with css %1", "args1": [{ "type": "input_value", "name": "CSS", "check": "String" }], "message2": "%1", "args2": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF" },

        { "type": "html_h", "message0": "heading %1 %2", "args0": [{ "type": "field_dropdown", "name": "LVL", "options": [["H1", "1"], ["H2", "2"], ["H3", "3"]] }, { "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#59C059" },
        { "type": "html_p", "message0": "paragraph %1", "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#59C059" },
        { "type": "html_span", "message0": "span %1", "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#59C059" },
        { "type": "html_a", "message0": "link url %1 text %2", "args0": [{ "type": "input_value", "name": "HREF", "check": "String" }, { "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#59C059" },
        { "type": "html_br", "message0": "line break", "previousStatement": null, "nextStatement": null, "colour": "#59C059" },
        { "type": "html_hr", "message0": "horizontal rule", "previousStatement": null, "nextStatement": null, "colour": "#59C059" },
        { "type": "html_format", "message0": "format %1 text %2", "args0": [{ "type": "field_dropdown", "name": "TAG", "options": [["Bold", "b"], ["Italic", "idx"], ["Underline", "u"], ["Strike", "s"], ["Code", "code"], ["Pre", "pre"], ["Quote", "blockquote"]] }, { "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#59C059" },
        { "type": "html_text", "message0": "%1", "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#59C059" },

        { "type": "html_ul", "message0": "unordered list %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#FFAB19" },
        { "type": "html_ol", "message0": "ordered list %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#FFAB19" },
        { "type": "html_li", "message0": "list item %1", "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FFAB19" },

        { "type": "html_table", "message0": "table", "message1": "border %1", "args1": [{ "type": "field_number", "name": "BORDER", "value": 1 }], "message2": "%1", "args2": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#5CA65C" },
        { "type": "html_tr", "message0": "table row %1", "args0": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#5CA65C" },
        { "type": "html_td", "message0": "table cell %1", "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#5CA65C" },
        { "type": "html_th", "message0": "table header %1", "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#5CA65C" },

        { "type": "html_form", "message0": "form", "message1": "action %1", "args1": [{ "type": "input_value", "name": "ACT", "check": "String" }], "message2": "%1", "args2": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        { "type": "html_input", "message0": "input", "message1": "type %1", "args1": [{ "type": "field_dropdown", "name": "TYPE", "options": [["Text", "text"], ["Password", "password"], ["Email", "email"], ["Number", "number"], ["Date", "date"], ["Color", "color"], ["Checkbox", "checkbox"], ["Radio", "radio"], ["File", "file"]] }], "message2": "name %1", "args2": [{ "type": "input_value", "name": "NAME", "check": "String" }], "message3": "placeholder %1", "args3": [{ "type": "input_value", "name": "PH", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        { "type": "html_button", "message0": "button", "message1": "type %1", "args1": [{ "type": "field_dropdown", "name": "TYPE", "options": [["Button", "button"], ["Submit", "submit"], ["Reset", "reset"]] }], "message2": "text %1", "args2": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        { "type": "html_button_js", "message0": "button", "message1": "text %1", "args1": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "message2": "%1", "args2": [{ "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        { "type": "html_label", "message0": "label", "message1": "for %1", "args1": [{ "type": "input_value", "name": "FOR", "check": "String" }], "message2": "text %1", "args2": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        {
            "type": "html_textarea",
            "message0": "textarea rows %1 cols %2 name %3 placeholder %4",
            "args0": [
                { "type": "field_number", "name": "R", "value": 4 },
                { "type": "field_number", "name": "C", "value": 20 },
                { "type": "input_value", "name": "NAME", "check": "String" },
                { "type": "input_value", "name": "PH", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FF6680"
        },
        { "type": "html_select", "message0": "select", "message1": "name %1", "args1": [{ "type": "input_value", "name": "NAME", "check": "String" }], "message2": "%1", "args2": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        { "type": "html_option", "message0": "option", "message1": "value %1", "args1": [{ "type": "input_value", "name": "VAL", "check": "String" }], "message2": "text %1", "args2": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        { "type": "html_form_adv", "message0": "form", "message1": "id %1", "args1": [{ "type": "input_value", "name": "ID", "check": "String" }], "message2": "%1", "args2": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        { "type": "html_input_req", "message0": "input", "message1": "name %1", "args1": [{ "type": "input_value", "name": "NAME", "check": "String" }], "message2": "type %1", "args2": [{ "type": "field_dropdown", "name": "TYPE", "options": [["Text", "text"], ["Email", "email"], ["Password", "password"], ["Date", "date"]] }], "message3": "required %1", "args3": [{ "type": "field_checkbox", "name": "REQ", "checked": true }], "previousStatement": null, "nextStatement": null, "colour": "#FF6680" },
        { "type": "js_form_submit", "message0": "on form", "message1": "id %1", "args1": [{ "type": "input_value", "name": "ID", "check": "String" }], "message2": "submit %1", "args2": [{ "type": "input_statement", "name": "DO" }], "colour": "#FF6680" },

        { "type": "html_img", "message0": "img", "message1": "src %1", "args1": [{ "type": "input_value", "name": "SRC", "check": "String" }], "message2": "alt %1", "args2": [{ "type": "input_value", "name": "ALT", "check": "String" }], "message3": "width %1", "args3": [{ "type": "input_value", "name": "W", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },
        { "type": "media_image", "message0": "image src %1 alt %2 width %3", "args0": [{ "type": "input_value", "name": "SRC", "check": "String" }, { "type": "input_value", "name": "ALT", "check": "String" }, { "type": "input_value", "name": "W", "check": "String" }], "inputsInline": true, "output": "Media", "colour": "#CF63CF", "tooltip": "Returns an image element as a Media value", "extensions": ["shape_media"] },
        { "type": "media_video", "message0": "video src %1 controls %2", "args0": [{ "type": "input_value", "name": "SRC", "check": "String" }, { "type": "field_checkbox", "name": "CTRL", "checked": true }], "inputsInline": true, "output": "Media", "colour": "#CF63CF", "tooltip": "Returns a video element as a Media value", "extensions": ["shape_media"] },
        { "type": "media_sound", "message0": "sound src %1", "args0": [{ "type": "input_value", "name": "SRC", "check": "String" }], "inputsInline": true, "output": "Media", "colour": "#CF63CF", "tooltip": "Returns an audio element as a Media value", "extensions": ["shape_media"] },
        { "type": "media_favicon", "message0": "favicon src %1", "args0": [{ "type": "input_value", "name": "SRC", "check": "String" }], "inputsInline": true, "output": "Media", "colour": "#CF63CF", "tooltip": "Returns a favicon link element as a Media value", "extensions": ["shape_media"] },
        { "type": "display_media", "message0": "display %1", "args0": [{ "type": "input_value", "name": "MEDIA", "check": "Media" }], "inputsInline": true, "previousStatement": null, "nextStatement": null, "colour": "#CF63CF", "tooltip": "Renders a Media value into the page" },
        { "type": "html_video", "message0": "video", "message1": "src %1", "args1": [{ "type": "input_value", "name": "SRC", "check": "String" }], "message2": "controls %1", "args2": [{ "type": "field_checkbox", "name": "CTRL", "checked": true }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },
        { "type": "html_audio", "message0": "audio", "message1": "src %1", "args1": [{ "type": "input_value", "name": "SRC", "check": "String" }], "message2": "controls %1", "args2": [{ "type": "field_checkbox", "name": "CTRL", "checked": true }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },
        { "type": "html_iframe", "message0": "iframe", "message1": "src %1", "args1": [{ "type": "input_value", "name": "SRC", "check": "String" }], "message2": "width %1", "args2": [{ "type": "input_value", "name": "W", "check": "String" }], "message3": "height %1", "args3": [{ "type": "input_value", "name": "H", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },

        { "type": "html_canvas", "message0": "canvas", "message1": "id %1", "args1": [{ "type": "input_value", "name": "ID", "check": "String" }], "message2": "w %1 h %2", "args2": [{ "type": "field_number", "name": "W", "value": 300 }, { "type": "field_number", "name": "H", "value": 200 }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },
        { "type": "js_canvas_draw", "message0": "on canvas", "message1": "id %1", "args1": [{ "type": "input_value", "name": "ID", "check": "String" }], "message2": "draw %1", "args2": [{ "type": "input_statement", "name": "DO" }], "colour": "#9966FF" },
        { "type": "js_canvas_rect", "message0": "rect input %1 output %2 w %3 h %4 color %5 filled %6", "args0": [{ "type": "field_number", "name": "X", "value": 10 }, { "type": "field_number", "name": "Y", "value": 10 }, { "type": "field_number", "name": "W", "value": 50 }, { "type": "field_number", "name": "H", "value": 50 }, { "type": "field_colour", "name": "C", "colour": "#ff0000" }, { "type": "field_checkbox", "name": "FILL", "checked": true }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },
        { "type": "html_svg", "message0": "svg", "message1": "width %1", "args1": [{ "type": "field_number", "name": "W", "value": 100 }], "message2": "height %1", "args2": [{ "type": "field_number", "name": "H", "value": 100 }], "message3": "%1", "args3": [{ "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },
        { "type": "svg_rect", "message0": "svg rect input %1 output %2 w %3 h %4 fill %5", "args0": [{ "type": "field_number", "name": "X", "value": 0 }, { "type": "field_number", "name": "Y", "value": 0 }, { "type": "field_number", "name": "W", "value": 50 }, { "type": "field_number", "name": "H", "value": 50 }, { "type": "field_colour", "name": "C", "colour": "#0000ff" }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },
        { "type": "svg_circle", "message0": "svg circle cx %1 cy %2 r %3 fill %4", "args0": [{ "type": "field_number", "name": "X", "value": 50 }, { "type": "field_number", "name": "Y", "value": 50 }, { "type": "field_number", "name": "R", "value": 20 }, { "type": "field_colour", "name": "C", "colour": "#00ff00" }], "previousStatement": null, "nextStatement": null, "colour": "#9966FF" },
        {
            "type": "game_draw_rect",
            "message0": "Draw Rectangle Name %1 input %2 output %3 w %4 h %5 color %6",
            "args0": [
                { "type": "field_input", "name": "NAME", "text": "player" },
                { "type": "input_value", "name": "X", "check": "Number" },
                { "type": "input_value", "name": "Y", "check": "Number" },
                { "type": "input_value", "name": "W", "check": "Number" },
                { "type": "input_value", "name": "H", "check": "Number" },
                { "type": "input_value", "name": "COL", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF"
        },
        {
            "type": "game_draw_circle",
            "message0": "Draw Circle Name %1 input %2 output %3 radius %4 color %5",
            "args0": [
                { "type": "field_input", "name": "NAME", "text": "ball" },
                { "type": "input_value", "name": "X", "check": "Number" },
                { "type": "input_value", "name": "Y", "check": "Number" },
                { "type": "input_value", "name": "R", "check": "Number" },
                { "type": "input_value", "name": "COL", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "Draw a circle sprite on the canvas"
        },
        {
            "type": "game_draw_text",
            "message0": "Draw Text %1 input %2 output %3 size %4 color %5",
            "args0": [
                { "type": "input_value", "name": "TEXT", "check": "String" },
                { "type": "input_value", "name": "X", "check": "Number" },
                { "type": "input_value", "name": "Y", "check": "Number" },
                { "type": "field_number", "name": "SIZE", "value": 24, "least": 1 },
                { "type": "input_value", "name": "COL", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "Draw text on the canvas"
        },
        {
            "type": "game_draw_line",
            "message0": "Draw Line from %1 %2 to %3 %4 color %5 width %6",
            "args0": [
                { "type": "field_number", "name": "X1", "value": 0 },
                { "type": "field_number", "name": "Y1", "value": 0 },
                { "type": "field_number", "name": "X2", "value": 100 },
                { "type": "field_number", "name": "Y2", "value": 100 },
                { "type": "field_colour", "name": "COL", "colour": "#ffffff" },
                { "type": "field_number", "name": "WIDTH", "value": 2, "least": 1 }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "Draw a line on the canvas"
        },
        {
            "type": "game_draw_image",
            "message0": "Draw Image %1 input %2 output %3 w %4 h %5",
            "args0": [
                { "type": "input_value", "name": "URL", "check": "String" },
                { "type": "input_value", "name": "X", "check": "Number" },
                { "type": "input_value", "name": "Y", "check": "Number" },
                { "type": "input_value", "name": "W", "check": "Number" },
                { "type": "input_value", "name": "H", "check": "Number" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Draw an image on the canvas (URL, cached automatically)"
        },
        {
            "type": "game_set_background",
            "message0": "Set Background Color %1",
            "args0": [
                { "type": "input_value", "name": "COL", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FFAB19",
            "tooltip": "Fill the entire canvas with a color (use in game loop)"
        },
        {
            "type": "game_mouse_x",
            "message0": "mouse input",
            "output": "Number",
            "colour": "#4C97FF",
            "tooltip": "X position of mouse on the canvas"
        },
        {
            "type": "game_mouse_y",
            "message0": "mouse output",
            "output": "Number",
            "colour": "#4C97FF",
            "tooltip": "Y position of mouse on the canvas"
        },
        {
            "type": "game_canvas_width",
            "message0": "stage width",
            "output": "Number",
            "colour": "#FFAB19",
            "tooltip": "Width of the canvas"
        },
        {
            "type": "game_canvas_height",
            "message0": "stage height",
            "output": "Number",
            "colour": "#FFAB19",
            "tooltip": "Height of the canvas"
        },
        {
            "type": "game_timer",
            "message0": "game timer",
            "output": "Number",
            "colour": "#4C97FF",
            "tooltip": "Seconds since the game started"
        },
        {
            "type": "game_set_var",
            "message0": "set game var %1 to %2",
            "args0": [
                { "type": "field_input", "name": "VAR", "text": "score" },
                { "type": "input_value", "name": "VAL" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FFAB19",
            "tooltip": "Set a named game variable (e.g., score, lives)"
        },
        {
            "type": "game_get_var",
            "message0": "game var %1",
            "args0": [
                { "type": "field_input", "name": "VAR", "text": "score" }
            ],
            "output": "Number",
            "colour": "#FFAB19",
            "tooltip": "Get a named game variable"
        },
        {
            "type": "game_collision_rect",
            "message0": "%1 touching %2 ?",
            "args0": [
                { "type": "field_input", "name": "A", "text": "player" },
                { "type": "field_input", "name": "B", "text": "enemy" }
            ],
            "output": "Boolean",
            "colour": "#4C97FF",
            "tooltip": "Check if two sprites are overlapping (rectangle collision)"
        },
        {
            "type": "game_sprite_prop",
            "message0": "%1 of sprite %2",
            "args0": [
                { "type": "field_dropdown", "name": "PROP", "options": [["input", "input"], ["output", "output"], ["width", "w"], ["height", "h"]] },
                { "type": "field_input", "name": "NAME", "text": "player" }
            ],
            "output": "Number",
            "colour": "#4C97FF",
            "tooltip": "Get a property (input, output, width, height) of a sprite"
        },
        {
            "type": "game_set_sprite_prop",
            "message0": "set %1 of sprite %2 to %3",
            "args0": [
                { "type": "field_dropdown", "name": "PROP", "options": [["input", "input"], ["output", "output"], ["width", "w"], ["height", "h"]] },
                { "type": "field_input", "name": "NAME", "text": "player" },
                { "type": "input_value", "name": "VAL", "check": "Number" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "Set a property of a sprite"
        },
        {
            "type": "game_distance",
            "message0": "distance %1 to %2",
            "args0": [
                { "type": "field_input", "name": "A", "text": "player" },
                { "type": "field_input", "name": "B", "text": "enemy" }
            ],
            "output": "Number",
            "colour": "#4C97FF",
            "tooltip": "Distance in pixels between two sprites"
        },
        {
            "type": "js_key_pressed",
            "message0": "key %1 is pressed?",
            "args0": [
                {
                    "type": "field_input",
                    "name": "KEY",
                    "text": "w"
                }
            ],
            "output": "Boolean",
            "colour": "#4C97FF",
            "tooltip": "Type the key name (e.g., 'a', 'Enter', 'ArrowUp', ' ') to check if it is held down."
        },

        { "type": "js_audio_play", "message0": "play sound %1", "args0": [{ "type": "input_value", "name": "URL", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#CF63CF" },
        { "type": "js_audio_synth", "message0": "synth note %1 duration %2 ms", "args0": [{ "type": "field_dropdown", "name": "NOTE", "options": [["C4", "261.63"], ["D4", "293.66"], ["E4", "329.63"], ["F4", "349.23"], ["G4", "392.00"], ["A4", "440.00"], ["B4", "493.88"]] }, { "type": "field_number", "name": "DUR", "value": 500 }], "previousStatement": null, "nextStatement": null, "colour": "#CF63CF" },

        { "type": "js_page_loaded", "message0": "when page loaded %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "colour": "#FF8C1A" },
        { "type": "js_event", "message0": "on event", "message1": "event %1", "args1": [{ "type": "field_dropdown", "name": "EVT", "options": [["Click", "click"], ["Hover", "mouseenter"], ["Input", "input"]] }], "message2": "selector %1", "args2": [{ "type": "input_value", "name": "SEL", "check": "String" }], "message3": "%1", "args3": [{ "type": "input_statement", "name": "DO" }], "colour": "#FF8C1A" },
        { "type": "js_alert", "message0": "alert %1", "args0": [{ "type": "input_value", "name": "MSG", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF8C1A" },
        { "type": "js_console", "message0": "console log %1", "args0": [{ "type": "input_value", "name": "MSG", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF8C1A" },
        { "type": "js_dom_text", "message0": "set text", "message1": "of %1", "args1": [{ "type": "input_value", "name": "SEL", "check": "String" }], "message2": "to %1", "args2": [{ "type": "input_value", "name": "VAL", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF8C1A" },
        { "type": "js_dom_style", "message0": "set css", "message1": "property %1", "args1": [{ "type": "input_value", "name": "PROP", "check": "String" }], "message2": "of %1", "args2": [{ "type": "input_value", "name": "SEL", "check": "String" }], "message3": "to %1", "args3": [{ "type": "input_value", "name": "VAL", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF8C1A" },
        {
            "type": "js_clipboard",
            "message0": "add %1 to clipboard",
            "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "Copy text to clipboard"
        },
        {
            "type": "js_mouse_clicked",
            "message0": "mouse clicked?",
            "output": "Boolean",
            "colour": "#4C97FF",
            "tooltip": "Returns true if mouse was just clicked"
        },
        {
            "type": "js_mouse_down",
            "message0": "mouse down?",
            "output": "Boolean",
            "colour": "#4C97FF",
            "tooltip": "Returns true if mouse is currently held down"
        },
        {
            "type": "js_throw_error",
            "message0": "throw error %1",
            "args0": [{ "type": "input_value", "name": "MSG", "check": "String" }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FFAB19",
            "tooltip": "Throws a JS Error"
        },
        { "type": "js_geo_get", "message0": "get location", "message1": "lat variable %1", "args1": [{ "type": "field_variable", "name": "LAT", "variable": "lat" }], "message2": "lng variable %1", "args2": [{ "type": "field_variable", "name": "LNG", "variable": "lng" }], "message3": "%1", "args3": [{ "type": "input_statement", "name": "DO" }], "colour": "#FF8C1A" },
        { "type": "js_fetch_json", "message0": "fetch json", "message1": "from %1", "args1": [{ "type": "input_value", "name": "URL", "check": "String" }], "message2": "store in %1", "args2": [{ "type": "field_variable", "name": "DATA", "variable": "data" }], "message3": "%1", "args3": [{ "type": "input_statement", "name": "DO" }], "colour": "#FF8C1A" },
        { "type": "js_localstorage_set", "message0": "storage set %1 = %2", "args0": [{ "type": "input_value", "name": "KEY", "check": "String" }, { "type": "input_value", "name": "VAL", "check": "String" }], "previousStatement": null, "nextStatement": null, "colour": "#FF8C1A" },
        { "type": "js_localstorage_get", "message0": "storage get %1", "args0": [{ "type": "input_value", "name": "KEY", "check": "String" }], "output": "String", "colour": "#FF8C1A" },

        {
            "type": "html_styled_div",
            "message0": "Styled Box",
            "message1": "Styles %1",
            "args1": [{ "type": "input_statement", "name": "STYLES", "check": "CSS_PROP" }],
            "message2": "Content %1",
            "args2": [{ "type": "input_statement", "name": "CONTENT" }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Container with visual styling"
        },

        {
            "type": "css_prop_text",
            "message0": "Text color %1 size %2 align %3 weight %4",
            "args0": [
                { "type": "field_colour", "name": "COLOR", "colour": "#000000" },
                { "type": "field_number", "name": "SIZE", "value": 16, "least": 0 },
                { "type": "field_dropdown", "name": "ALIGN", "options": [["Left", "left"], ["Center", "center"], ["Right", "right"], ["Justify", "justify"]] },
                { "type": "field_dropdown", "name": "WEIGHT", "options": [["Normal", "normal"], ["Bold", "bold"], ["Thin", "lighter"]] }
            ],
            "previousStatement": "CSS_PROP",
            "nextStatement": "CSS_PROP",
            "colour": "#9966FF"
        },
        {
            "type": "css_prop_background",
            "message0": "Background color %1",
            "args0": [
                { "type": "field_colour", "name": "COLOR", "colour": "#f0f0f0" }
            ],
            "previousStatement": "CSS_PROP",
            "nextStatement": "CSS_PROP",
            "colour": "#9966FF"
        },
        {
            "type": "css_prop_border",
            "message0": "Border width %1 color %2 style %3 radius %4",
            "args0": [
                { "type": "field_number", "name": "WIDTH", "value": 1, "least": 0 },
                { "type": "field_colour", "name": "COLOR", "colour": "#000000" },
                { "type": "field_dropdown", "name": "STYLE", "options": [["Solid", "solid"], ["Dashed", "dashed"], ["Dotted", "dotted"], ["None", "none"]] },
                { "type": "field_number", "name": "RADIUS", "value": 0, "least": 0 }
            ],
            "previousStatement": "CSS_PROP",
            "nextStatement": "CSS_PROP",
            "colour": "#9966FF"
        },
        {
            "type": "css_prop_size",
            "message0": "Size width %1 height %2",
            "args0": [
                { "type": "input_value", "name": "W", "check": "String" },
                { "type": "input_value", "name": "H", "check": "String" }
            ],
            "previousStatement": "CSS_PROP",
            "nextStatement": "CSS_PROP",
            "colour": "#9966FF"
        },
        {
            "type": "css_prop_margin_padding",
            "message0": "Spacing margin %1 padding %2",
            "args0": [
                { "type": "field_number", "name": "MARGIN", "value": 5, "least": 0 },
                { "type": "field_number", "name": "PADDING", "value": 10, "least": 0 }
            ],
            "previousStatement": "CSS_PROP",
            "nextStatement": "CSS_PROP",
            "colour": "#9966FF"
        },
        {
            "type": "css_prop_flex_layout",
            "message0": "Flex Layout dir %1 align %2 justify %3",
            "args0": [
                { "type": "field_dropdown", "name": "DIR", "options": [["Row", "row"], ["Column", "column"]] },
                { "type": "field_dropdown", "name": "ALIGN", "options": [["Stretch", "stretch"], ["Center", "center"], ["Start", "flex-start"], ["End", "flex-end"]] },
                { "type": "field_dropdown", "name": "JUSTIFY", "options": [["Start", "flex-start"], ["Center", "center"], ["End", "flex-end"], ["Space Between", "space-between"]] }
            ],
            "previousStatement": "CSS_PROP",
            "nextStatement": "CSS_PROP",
            "colour": "#9966FF"
        },

        {
            "type": "js_get_form_data",
            "message0": "form data from %1",
            "args0": [{ "type": "input_value", "name": "ID", "check": "String" }],
            "output": "Array",
            "colour": "#4C97FF",
            "tooltip": "Returns form data as an object"
        },
        {
            "type": "js_get_url_param",
            "message0": "url parameter %1",
            "args0": [{ "type": "input_value", "name": "KEY", "check": "String" }],
            "output": "String",
            "colour": "#4C97FF",
            "tooltip": "Get value from ?key=value in URL"
        },
        {
            "type": "js_get_time",
            "message0": "current time",
            "output": "String",
            "colour": "#59C059",
            "tooltip": "Returns HH:MM:SS"
        },
        {
            "type": "js_get_date",
            "message0": "current date",
            "output": "String",
            "colour": "#59C059",
            "tooltip": "Returns YYYY-MM-DD"
        },
        {
            "type": "js_get_screen_width",
            "message0": "screen width",
            "output": "Number",
            "colour": "#59C059",
            "tooltip": "Window width in pixels"
        },

        {
            "type": "ui_page_wrapper",
            "message0": "Modern Page %1 Theme %2 %3 Content %4",
            "args0": [
                { "type": "input_dummy" },
                { "type": "field_dropdown", "name": "THEME", "options": [["Dark Mode", "dark"], ["Light Mode", "light"]] },
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "CONTENT" }
            ],
            "colour": "#575757",
            "tooltip": "Sets up the page body with font and colors"
        },
        {
            "type": "ui_hero_section",
            "message0": "Hero Section",
            "message1": "Title %1",
            "args1": [
                { "type": "input_value", "name": "TITLE", "check": "String" }
            ],
            "message2": "Subtitle %1",
            "args2": [
                { "type": "input_value", "name": "SUB", "check": "String" }
            ],
            "message3": "Button Text %1",
            "args3": [
                { "type": "input_value", "name": "BTN_TEXT", "check": "String" }
            ],
            "message4": "Button Action %1",
            "args4": [
                { "type": "input_statement", "name": "DO" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "Big banner at top of page"
        },
        {
            "type": "ui_feature_grid",
            "message0": "Feature Grid %1",
            "args0": [{ "type": "input_statement", "name": "CONTENT" }],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "Container for feature cards"
        },
        {
            "type": "ui_feature_card",
            "message0": "Feature Card %1 Title %2 Text %3 Icon %4",
            "args0": [
                { "type": "input_dummy" },
                { "type": "input_value", "name": "TITLE", "check": "String" },
                { "type": "input_value", "name": "TEXT", "check": "String" },
                { "type": "field_dropdown", "name": "ICON", "options": [["Star", "star"], ["Code", "code"], ["Zap", "zap"], ["Heart", "heart"]] }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "A single card for the grid"
        },
        {
            "type": "ui_navbar_simple",
            "message0": "Navbar Logo %1 Links %2",
            "args0": [
                { "type": "input_value", "name": "LOGO", "check": "String" },
                { "type": "input_statement", "name": "LINKS" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#585858"
        },
        {
            "type": "ui_nav_link",
            "message0": "Nav Link %1 URL %2",
            "args0": [
                { "type": "input_value", "name": "TEXT", "check": "String" },
                { "type": "input_value", "name": "URL", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#555555"
        },
        {
            "type": "ui_pricing_card",
            "message0": "Pricing Card",
            "message1": "Plan Name %1",
            "args1": [
                { "type": "input_value", "name": "Tb_PLAN", "check": "String" }
            ],
            "message2": "Price %1",
            "args2": [
                { "type": "input_value", "name": "Tb_PRICE", "check": "String" }
            ],
            "message3": "Features %1",
            "args3": [
                { "type": "input_statement", "name": "Kb_KX" }
            ],
            "message4": "Button Text %1",
            "args4": [
                { "type": "input_value", "name": "Tb_BTN", "check": "String" }
            ],
            "message5": "Button Action %1",
            "args5": [
                { "type": "input_statement", "name": "DO" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#4C97FF",
            "tooltip": "A modern pricing table card"
        },

        { "type": "arr_new_empty", "message0": "blank array", "output": "Array", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_new_length", "message0": "blank array of length %1", "args0": [{ "type": "input_value", "name": "LEN", "check": "Number" }], "output": "Array", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_parse", "message0": "parse %1 as array", "args0": [{ "type": "input_value", "name": "TXT", "check": "String" }], "output": "Array", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_split", "message0": "split %1 by %2", "args0": [{ "type": "input_value", "name": "TXT", "check": "String" }, { "type": "input_value", "name": "DELIM", "check": "String" }], "output": "Array", "colour": "#FF6666", "extensions": ["shape_square"] },

        { "type": "arr_builder", "message0": "array builder %1  %2 ", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "output": "Array", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_builder_add", "message0": "append %1 to builder", "args0": [{ "type": "input_value", "name": "ITEM" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_builder_set", "message0": "set builder to %1", "args0": [{ "type": "input_value", "name": "ARR", "check": "Array" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6666", "extensions": ["shape_square"] },

        { "type": "arr_get", "message0": "get %1 in %2", "args0": [{ "type": "input_value", "name": "IDX", "check": "Number" }, { "type": "input_value", "name": "ARR", "check": "Array" }], "output": null, "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_slice", "message0": "items %1 to %2 in %3", "args0": [{ "type": "input_value", "name": "START", "check": "Number" }, { "type": "input_value", "name": "END", "check": "Number" }, { "type": "input_value", "name": "ARR", "check": "Array" }], "output": "Array", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_indexof", "message0": "index of %1 in %2", "args0": [{ "type": "input_value", "name": "ITEM" }, { "type": "input_value", "name": "ARR", "check": "Array" }], "output": "Number", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_includes", "message0": "%1 has %2 ?", "args0": [{ "type": "input_value", "name": "ARR", "check": "Array" }, { "type": "input_value", "name": "ITEM" }], "output": "Boolean", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_length", "message0": "length of %1", "args0": [{ "type": "input_value", "name": "ARR", "check": "Array" }], "output": "Number", "colour": "#FF6666", "extensions": ["shape_square"] },

        { "type": "arr_set_idx", "message0": "set %1 in %2 to %3", "args0": [{ "type": "input_value", "name": "IDX", "check": "Number" }, { "type": "input_value", "name": "ARR", "check": "Array" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_push", "message0": "append %1 to %2", "args0": [{ "type": "input_value", "name": "VAL" }, { "type": "input_value", "name": "ARR", "check": "Array" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_concat", "message0": "merge %1 with %2", "args0": [{ "type": "input_value", "name": "A", "check": "Array" }, { "type": "input_value", "name": "B", "check": "Array" }], "output": "Array", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_reverse", "message0": "reverse %1", "args0": [{ "type": "input_value", "name": "ARR", "check": "Array" }], "output": "Array", "colour": "#FF6666", "extensions": ["shape_square"] },
        { "type": "arr_join", "message0": "join %1 with %2", "args0": [{ "type": "input_value", "name": "ARR", "check": "Array" }, { "type": "input_value", "name": "DELIM", "check": "String" }], "output": "String", "colour": "#FF6666", "extensions": ["shape_square"] },

        { "type": "obj_new", "message0": "blank object", "output": "Object", "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_parse", "message0": "parse %1 as object", "args0": [{ "type": "input_value", "name": "TXT" }], "output": "Object", "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_from_entries", "message0": "from entries %1", "args0": [{ "type": "input_value", "name": "ENTRIES", "check": "Array" }], "output": "Object", "colour": "#FFCC33", "extensions": ["shape_ticket"] },

        { "type": "obj_builder", "message0": "object builder %1  %2 ", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "output": "Object", "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_builder_add", "message0": "append key %1 value %2 to builder", "args0": [{ "type": "input_value", "name": "KEY", "check": "String" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_builder_set", "message0": "set builder to %1", "args0": [{ "type": "input_value", "name": "OBJ", "check": "Object" }], "previousStatement": null, "nextStatement": null, "colour": "#FFCC33", "extensions": ["shape_ticket"] },

        { "type": "obj_get", "message0": "get %1 in %2", "args0": [{ "type": "input_value", "name": "KEY", "check": "String" }, { "type": "input_value", "name": "OBJ", "check": "Object" }], "output": null, "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_has", "message0": "%1 has key %2 ?", "args0": [{ "type": "input_value", "name": "OBJ", "check": "Object" }, { "type": "input_value", "name": "KEY", "check": "String" }], "output": "Boolean", "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_keys", "message0": "keys of %1", "args0": [{ "type": "input_value", "name": "OBJ", "check": "Object" }], "output": "Array", "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_values", "message0": "values of %1", "args0": [{ "type": "input_value", "name": "OBJ", "check": "Object" }], "output": "Array", "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_entries", "message0": "entries of %1", "args0": [{ "type": "input_value", "name": "OBJ", "check": "Object" }], "output": "Array", "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_stringify", "message0": "stringify %1", "args0": [{ "type": "input_value", "name": "OBJ" }], "output": "String", "colour": "#FFCC33", "extensions": ["shape_ticket"] },

        { "type": "obj_set", "message0": "set %1 in %2 to %3", "args0": [{ "type": "input_value", "name": "KEY", "check": "String" }, { "type": "input_value", "name": "OBJ", "check": "Object" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_delete", "message0": "delete key %1 from %2", "args0": [{ "type": "input_value", "name": "KEY", "check": "String" }, { "type": "input_value", "name": "OBJ", "check": "Object" }], "previousStatement": null, "nextStatement": null, "colour": "#FFCC33", "extensions": ["shape_ticket"] },
        { "type": "obj_merge", "message0": "merge %1 into %2", "args0": [{ "type": "input_value", "name": "SRC", "check": "Object" }, { "type": "input_value", "name": "DEST", "check": "Object" }], "previousStatement": null, "nextStatement": null, "colour": "#FFCC33", "extensions": ["shape_ticket"] },

        { "type": "http_clear", "message0": "clear current data", "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },

        { "type": "http_response", "message0": "response", "output": "String", "colour": "#2196F3" },
        { "type": "http_error", "message0": "error", "output": "String", "colour": "#2196F3" },
        { "type": "http_status", "message0": "status", "output": "Number", "colour": "#2196F3" },
        { "type": "http_status_text", "message0": "status text", "output": "String", "colour": "#2196F3" },
        { "type": "http_response_headers", "message0": "response headers as json", "output": "String", "colour": "#2196F3" },
        { "type": "http_get_header", "message0": "%1 from response headers", "args0": [{ "type": "input_value", "name": "NAME" }], "output": "String", "colour": "#2196F3" },

        { "type": "http_responded", "message0": "site responded?", "output": "Boolean", "colour": "#2196F3" },
        { "type": "http_failed", "message0": "request failed?", "output": "Boolean", "colour": "#2196F3" },
        { "type": "http_succeeded", "message0": "request succeeded?", "output": "Boolean", "colour": "#2196F3" },

        { "type": "http_on_response", "message0": "when a site responds %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },
        { "type": "http_on_error", "message0": "when a request fails %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },

        { "type": "http_set_content_type", "message0": "set request content type to %1", "args0": [{ "type": "field_dropdown", "name": "TYPE", "options": [["text/plain", "text/plain"], ["application/json", "application/json"], ["application/input-www-form-urlencoded", "application/input-www-form-urlencoded"], ["multipart/form-data", "multipart/form-data"]] }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },
        { "type": "http_set_method", "message0": "set request method to %1", "args0": [{ "type": "field_dropdown", "name": "METHOD", "options": [["GET", "GET"], ["POST", "POST"], ["PUT", "PUT"], ["PATCH", "PATCH"], ["DELETE", "DELETE"], ["HEAD", "HEAD"], ["OPTIONS", "OPTIONS"]] }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },
        { "type": "http_set_header", "message0": "in request headers set %1 to %2", "args0": [{ "type": "input_value", "name": "KEY" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },
        { "type": "http_set_headers_json", "message0": "set request headers to json %1", "args0": [{ "type": "input_value", "name": "JSON" }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },
        { "type": "http_set_body", "message0": "set request body to %1", "args0": [{ "type": "input_value", "name": "BODY" }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },

        { "type": "http_set_body_form", "message0": "set request body to multipart form", "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },
        { "type": "http_form_get", "message0": "%1 in multipart form", "args0": [{ "type": "input_value", "name": "NAME" }], "output": "String", "colour": "#2196F3" },
        { "type": "http_form_set", "message0": "set %1 to %2 in multipart form", "args0": [{ "type": "input_value", "name": "NAME" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },
        { "type": "http_form_delete", "message0": "delete %1 from multipart form", "args0": [{ "type": "input_value", "name": "NAME" }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },

        { "type": "http_send", "message0": "send request to %1", "args0": [{ "type": "input_value", "name": "URL" }], "previousStatement": null, "nextStatement": null, "colour": "#2196F3" },

        { "type": "text_trim", "message0": "trim %1", "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "output": "String", "colour": "#59C059" },
        { "type": "text_replace", "message0": "replace %1 with %2 in %3", "args0": [{ "type": "input_value", "name": "SEARCH", "check": "String" }, { "type": "input_value", "name": "REPL", "check": "String" }, { "type": "input_value", "name": "TEXT", "check": "String" }], "output": "String", "colour": "#59C059" },
        { "type": "math_random_int", "message0": "random int from %1 to %2", "args0": [{ "type": "input_value", "name": "FROM", "check": "Number" }, { "type": "input_value", "name": "TO", "check": "Number" }], "output": "Number", "colour": "#59C059" },
        { "type": "url_parse", "message0": "parse url %1", "args0": [{ "type": "input_value", "name": "URL", "check": "String" }], "output": "Object", "colour": "#4C97FF", "tooltip": "Returns object with url parts (protocol, host, path, query)" },
        { "type": "is_email", "message0": "is %1 an email?", "args0": [{ "type": "input_value", "name": "TEXT", "check": "String" }], "output": "Boolean", "colour": "#59C059" },

        { "type": "style_gradient", "message0": "background gradient from %1 to %2 direction %3", "args0": [{ "type": "input_value", "name": "C1", "check": "String" }, { "type": "input_value", "name": "C2", "check": "String" }, { "type": "field_dropdown", "name": "DIR", "options": [["to right", "to right"], ["to bottom", "to bottom"], ["to top", "to top"], ["to left", "to left"]] }], "output": "String", "colour": "#9966FF", "tooltip": "CSS gradient value" },
        { "type": "style_box_shadow", "message0": "box-shadow input %1 output %2 blur %3 spread %4 color %5 inset %6", "args0": [{ "type": "input_value", "name": "X", "check": "String" }, { "type": "input_value", "name": "Y", "check": "String" }, { "type": "input_value", "name": "B", "check": "String" }, { "type": "input_value", "name": "S", "check": "String" }, { "type": "input_value", "name": "C", "check": "String" }, { "type": "field_checkbox", "name": "IN", "checked": false }], "output": "String", "colour": "#9966FF", "tooltip": "CSS box-shadow value" },
        { "type": "style_border_radius", "message0": "border-radius %1", "args0": [{ "type": "input_value", "name": "R", "check": "String" }], "output": "String", "colour": "#9966FF", "tooltip": "CSS border-radius value (e.g., 8px or 50%)" },
        { "type": "style_spacing_shorthand", "message0": "spacing largest/p %1 %2 %3 %4", "args0": [{ "type": "field_dropdown", "name": "TYPE", "options": [["margin", "margin"], ["padding", "padding"]] }, { "type": "input_value", "name": "A", "check": "String" }, { "type": "input_value", "name": "B", "check": "String" }, { "type": "input_value", "name": "C", "check": "String" }], "previousStatement": "CSS_PROP", "nextStatement": "CSS_PROP", "colour": "#9966FF", "tooltip": "Adds shorthand margin/padding rules (A B C optional)" },
        { "type": "style_font_size", "message0": "font-size %1 unit %2", "args0": [{ "type": "input_value", "name": "SIZE", "check": "Number" }, { "type": "field_dropdown", "name": "UNIT", "options": [["px", "px"], ["em", "em"], ["rem", "rem"], ["%", "%"]] }], "output": "String", "colour": "#9966FF", "tooltip": "Produces a font-size value" },

        { "type": "svelte_component", "message0": "Svelte Component %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "A Svelte component wrapper" },
        { "type": "svelte_script", "message0": "<script> %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "CODE" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Svelte script block" },
        { "type": "svelte_let", "message0": "let %1 = %2", "args0": [{ "type": "field_input", "name": "VAR", "text": "count" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Declare a reactive variable" },
        { "type": "svelte_reactive", "message0": "$: %1 = %2", "args0": [{ "type": "field_input", "name": "VAR", "text": "doubled" }, { "type": "input_value", "name": "EXPR" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Reactive declaration" },
        { "type": "svelte_reactive_stmt", "message0": "$: do %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Reactive statement block" },
        { "type": "svelte_on_event", "message0": "on: %1 do %2 %3", "args0": [{ "type": "field_dropdown", "name": "EVT", "options": [["click", "click"], ["input", "input"], ["submit", "submit"], ["change", "change"], ["keydown", "keydown"], ["keyup", "keyup"], ["mouseover", "mouseover"], ["mouseout", "mouseout"], ["focus", "focus"], ["blur", "blur"]] }, { "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Svelte event handler" },
        { "type": "svelte_on_click", "message0": "on:click do %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00" },
        { "type": "svelte_if", "message0": "{#if} %1 %2 then %3", "args0": [{ "type": "input_value", "name": "COND" }, { "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#D43900", "tooltip": "Svelte {#if} block" },
        { "type": "svelte_if_else", "message0": "{#if} %1 %2 then %3 {:else} %4", "args0": [{ "type": "input_value", "name": "COND" }, { "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }, { "type": "input_statement", "name": "ELSE" }], "previousStatement": null, "nextStatement": null, "colour": "#D43900", "tooltip": "Svelte {#if} {:else} block" },
        { "type": "svelte_each", "message0": "{#each} %1 as %2 %3 do %4", "args0": [{ "type": "input_value", "name": "ARR" }, { "type": "field_input", "name": "ITEM", "text": "item" }, { "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#D43900", "tooltip": "Svelte {#each} loop" },
        { "type": "svelte_each_keyed", "message0": "{#each} %1 as %2 keyed by %3 %4 do %5", "args0": [{ "type": "input_value", "name": "ARR" }, { "type": "field_input", "name": "ITEM", "text": "item" }, { "type": "field_input", "name": "KEY", "text": "item.id" }, { "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#D43900", "tooltip": "Keyed {#each} loop" },
        { "type": "svelte_await", "message0": "{#await} %1 %2 loading %3 then %4 %5", "args0": [{ "type": "input_value", "name": "PROMISE" }, { "type": "input_dummy" }, { "type": "input_statement", "name": "LOADING" }, { "type": "field_input", "name": "VAR", "text": "data" }, { "type": "input_statement", "name": "THEN" }], "previousStatement": null, "nextStatement": null, "colour": "#D43900", "tooltip": "Svelte {#await} block" },
        { "type": "svelte_bind_value", "message0": "input bind:value to %1", "args0": [{ "type": "field_input", "name": "VAR", "text": "name" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6B35", "tooltip": "Two-way bind input value" },
        { "type": "svelte_bind_checked", "message0": "checkbox bind:checked to %1", "args0": [{ "type": "field_input", "name": "VAR", "text": "agreed" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6B35", "tooltip": "Two-way bind checkbox" },
        { "type": "svelte_bind_group", "message0": "radio bind:group to %1 value %2", "args0": [{ "type": "field_input", "name": "VAR", "text": "selected" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6B35" },
        { "type": "svelte_expr", "message0": "{expression} %1", "args0": [{ "type": "field_input", "name": "EXPR", "text": "count" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Output a Svelte expression" },
        { "type": "svelte_html_raw", "message0": "{@html} %1", "args0": [{ "type": "input_value", "name": "EXPR" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Render raw HTML" },
        { "type": "svelte_transition", "message0": "transition: %1 on %2 %3", "args0": [{ "type": "field_dropdown", "name": "TYPE", "options": [["fade", "fade"], ["fly", "fly"], ["slide", "slide"], ["scale", "scale"], ["blur", "blur"], ["draw", "draw"]] }, { "type": "input_dummy" }, { "type": "input_statement", "name": "CONTENT" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6B35", "tooltip": "Add a Svelte transition" },
        { "type": "svelte_on_mount", "message0": "onMount %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Run code when component mounts" },
        { "type": "svelte_on_destroy", "message0": "onDestroy %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Run code when component is destroyed" },
        { "type": "svelte_store_writable", "message0": "writable store %1 = %2", "args0": [{ "type": "field_input", "name": "NAME", "text": "count" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#C73000", "tooltip": "Create a writable store" },
        { "type": "svelte_store_get", "message0": "$%1", "args0": [{ "type": "field_input", "name": "NAME", "text": "count" }], "output": null, "colour": "#C73000", "tooltip": "Read a store value" },
        { "type": "svelte_store_set", "message0": "set %1 to %2", "args0": [{ "type": "field_input", "name": "NAME", "text": "count" }, { "type": "input_value", "name": "VAL" }], "previousStatement": null, "nextStatement": null, "colour": "#C73000", "tooltip": "Set a store value" },
        { "type": "svelte_store_update", "message0": "update %1 with %2 %3", "args0": [{ "type": "field_input", "name": "NAME", "text": "count" }, { "type": "input_dummy" }, { "type": "input_statement", "name": "DO" }], "previousStatement": null, "nextStatement": null, "colour": "#C73000", "tooltip": "Update a store" },
        { "type": "svelte_style", "message0": "<style> %1 %2", "args0": [{ "type": "input_dummy" }, { "type": "input_statement", "name": "CSS" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Component-scoped style block" },
        { "type": "svelte_css_rule", "message0": "%1 { %2 }", "args0": [{ "type": "field_input", "name": "SEL", "text": "h1" }, { "type": "field_input", "name": "PROPS", "text": "color: #FF3E00; font-size: 2em;" }], "previousStatement": null, "nextStatement": null, "colour": "#FF6B35" },
        { "type": "svelte_slot", "message0": "<slot> %1", "args0": [{ "type": "field_input", "name": "NAME", "text": "" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Component slot" },
        { "type": "svelte_export_prop", "message0": "export let %1 = %2", "args0": [{ "type": "field_input", "name": "PROP", "text": "name" }, { "type": "input_value", "name": "DEFAULT" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Declare a component prop" },
        { "type": "svelte_dispatch", "message0": "dispatch %1 with %2", "args0": [{ "type": "field_input", "name": "EVT", "text": "message" }, { "type": "input_value", "name": "DETAIL" }], "previousStatement": null, "nextStatement": null, "colour": "#FF3E00", "tooltip": "Dispatch a custom event" }

    ]);

    var CONTROLS_SWITCH_MUTATOR_MIXIN = {
        caseCount_: 1,
        defaultCount_: 0,

        mutationToDom: function () {
            var container = Blockly.utils.xml.createElement('mutation');
            container.setAttribute('cases', this.caseCount_);
            container.setAttribute('default', this.defaultCount_);
            return container;
        },
        domToMutation: function (xmlElement) {
            this.caseCount_ = parseInt(xmlElement.getAttribute('cases'), 10) || 0;
            this.defaultCount_ = parseInt(xmlElement.getAttribute('default'), 10) || 0;
            this.updateShape_();
        },
        saveExtraState: function () {
            return { cases: this.caseCount_, 'default': this.defaultCount_ };
        },
        loadExtraState: function (state) {
            this.caseCount_ = state['cases'] || 0;
            this.defaultCount_ = state['default'] || 0;
            this.updateShape_();
        },
        decompose: function (workspace) {
            var containerBlock = workspace.newBlock('controls_switch_mutatorcontainer');
            containerBlock.initSvg();
            var connection = containerBlock.getInput('STACK').connection;
            for (var idx = 0; idx < this.caseCount_; idx++) {
                var caseBlock = workspace.newBlock('controls_switch_case_mutator');
                caseBlock.initSvg();
                connection.connect(caseBlock.previousConnection);
                connection = caseBlock.nextConnection;
            }
            if (this.defaultCount_) {
                var defaultBlock = workspace.newBlock('controls_switch_default_mutator');
                defaultBlock.initSvg();
                connection.connect(defaultBlock.previousConnection);
            }
            return containerBlock;
        },
        compose: function (containerBlock) {
            var clauseBlock = containerBlock.getInputTargetBlock('STACK');
            var caseConnections = [];
            var defaultConnection = null;
            var caseCount = 0;
            var hasDefault = false;
            while (clauseBlock) {
                if (clauseBlock.type === 'controls_switch_case_mutator') {
                    caseConnections.push(clauseBlock.statementConnection_);
                    caseCount++;
                } else if (clauseBlock.type === 'controls_switch_default_mutator') {
                    hasDefault = true;
                    if (!defaultConnection) defaultConnection = clauseBlock.statementConnection_;
                }
                clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
            }

            this.caseCount_ = caseCount;
            this.defaultCount_ = hasDefault ? 1 : 0;
            this.updateShape_();

            for (var idx = 0; idx < caseConnections.length; idx++) {
                var inputConn = this.getInput('CASE' + idx);
                if (inputConn && caseConnections[idx]) {
                    inputConn.connection.connect(caseConnections[idx]);
                }
            }
            if (defaultConnection) {
                var defInput = this.getInput('DEFAULT');
                if (defInput) defInput.connection.connect(defaultConnection);
            }

            for (var secondary = 0; secondary < this.caseCount_; secondary++) {
                var caseInput = this.getInput('CASE' + secondary);
                if (caseInput && !caseInput.connection.targetConnection) {
                    var newCase = this.workspace.newBlock('controls_switch_case');
                    newCase.initSvg();
                    newCase.render();
                    caseInput.connection.connect(newCase.previousConnection);
                }
            }

            if (this.defaultCount_) {
                var defSlot = this.getInput('DEFAULT');
                if (defSlot && !defSlot.connection.targetConnection) {
                    var newDef = this.workspace.newBlock('controls_switch_default');
                    newDef.initSvg();
                    newDef.render();
                    defSlot.connection.connect(newDef.previousConnection);
                }
            }
        },
        saveConnections: function (containerBlock) {
            var clauseBlock = containerBlock.getInputTargetBlock('STACK');
            var idx = 0;
            while (clauseBlock) {
                if (clauseBlock.type === 'controls_switch_case_mutator') {
                    var input = this.getInput('CASE' + idx);
                    clauseBlock.statementConnection_ = input && input.connection.targetConnection;
                    idx++;
                } else if (clauseBlock.type === 'controls_switch_default_mutator') {
                    var defaultInput = this.getInput('DEFAULT');
                    clauseBlock.statementConnection_ = defaultInput && defaultInput.connection.targetConnection;
                }
                clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
            }
        },
        updateShape_: function () {
            var idx = 0;
            while (this.getInput('CASE' + idx)) {
                this.removeInput('CASE' + idx);
                idx++;
            }
            if (this.getInput('DEFAULT')) {
                this.removeInput('DEFAULT');
            }

            for (idx = 0; idx < this.caseCount_; idx++) {
                var input = this.appendStatementInput('CASE' + idx)
                    .setCheck('SwitchCase');
                if (idx === 0) input.appendField('cases');
            }
            if (this.defaultCount_) {
                this.appendStatementInput('DEFAULT')
                    .setCheck('SwitchCase')
                    .appendField('default');
            }
        }
    };

    if (Blockly.Extensions.isRegistered('controls_switch_mutator')) {
        Blockly.Extensions.unregister('controls_switch_mutator');
    }
    Blockly.Extensions.registerMutator(
        'controls_switch_mutator',
        CONTROLS_SWITCH_MUTATOR_MIXIN,
        null,
        ['controls_switch_case_mutator', 'controls_switch_default_mutator']
    );

    Blockly.Blocks['controls_switch'] = {
        init: function () {
            this.jsonInit({
                "type": "controls_switch",
                "message0": "switch %1 cases %2",
                "args0": [
                    { "type": "input_value", "name": "SWITCH" },
                    { "type": "input_statement", "name": "CASE0", "check": "SwitchCase" }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#5C81A6",
                "tooltip": "Switch/case control flow",
                "mutator": "controls_switch_mutator"
            });
            this.caseCount_ = 1;
            this.defaultCount_ = 0;
        }
    };

    Blockly.Blocks['controls_switch_case'] = {
        init: function () {
            this.appendValueInput('VALUE')
                .appendField('case');
            this.appendStatementInput('DO')
                .appendField('do');
            this.setPreviousStatement(true, 'SwitchCase');
            this.setNextStatement(true, 'SwitchCase');
            this.setColour('#5C81A6');
            this.setTooltip('Case branch for switch');
        }
    };

    Blockly.Blocks['controls_switch_default'] = {
        init: function () {
            this.appendStatementInput('DO')
                .appendField('default');
            this.setPreviousStatement(true, 'SwitchCase');
            this.setNextStatement(true, 'SwitchCase');
            this.setColour('#5C81A6');
            this.setTooltip('Default branch for switch');
        }
    };

    Blockly.Blocks['controls_switch_mutatorcontainer'] = {
        init: function () {
            this.appendDummyInput().appendField('switch');
            this.appendStatementInput('STACK');
            this.setColour('#5C81A6');
            this.setTooltip('Add, remove, or reorder cases');
            this.contextMenu = false;
        }
    };

    Blockly.Blocks['controls_switch_case_mutator'] = {
        init: function () {
            this.appendDummyInput().appendField('case');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour('#5C81A6');
            this.contextMenu = false;
        }
    };

    Blockly.Blocks['controls_switch_default_mutator'] = {
        init: function () {
            this.appendDummyInput().appendField('default');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour('#5C81A6');
            this.contextMenu = false;
        }
    };
};

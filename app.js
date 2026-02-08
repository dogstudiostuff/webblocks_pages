let workspace = null;
let project = {
    activePage: "index",
    pages: {
        "index": null 
    }
};

// Settings with defaults (persisted to localStorage)
let settings = {
    gridSnap: true,
    gridSpacing: 20,
    trashcan: true,
    sounds: true,
    watermark: true,
    minify: false,
    zoomSpeed: 1.2,
    codeFontSize: '13px',
    autoRemind: false
};

function loadSettings() {
    try {
        const saved = localStorage.getItem('pooide_settings');
        if (saved) Object.assign(settings, JSON.parse(saved));
    } catch(e) {}
}
function saveSettings() {
    try { localStorage.setItem('pooide_settings', JSON.stringify(settings)); } catch(e) {}
}
loadSettings();

const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Page Setup",
            colour: "#606060",
            contents: [
                { kind: "block", type: "meta_doctype" },
                { kind: "block", type: "meta_html_wrapper" },
                { kind: "block", type: "meta_head_wrapper" },
                { kind: "block", type: "meta_body" },
                { kind: "block", type: "meta_title", inputs: { VAL: { shadow: { type: "text_string", fields: { TEXT: "Page Title" } } } } },
                { kind: "block", type: "meta_charset" },
                { kind: "block", type: "meta_viewport" },
                { kind: "block", type: "meta_favicon", inputs: { URL: { shadow: { type: "text_string", fields: { TEXT: "favicon.ico" } } } } },
            ]
        },

        {
            kind: "category",
            name: "Text & Content",
            colour: "#59C059",
            contents: [
                { kind: "block", type: "html_h", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Heading" } } } } },
                { kind: "block", type: "html_p", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Paragraph" } } } } },
                { kind: "block", type: "html_text", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Hello World" } } } } },
                { kind: "block", type: "html_span", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Span" } } } } },
                { kind: "block", type: "html_a", inputs: { HREF: { shadow: { type: "text_string", fields: { TEXT: "https://example.com" } } }, TEXT: { shadow: { type: "text_string", fields: { TEXT: "Link" } } } } },
                { kind: "block", type: "html_br" },
                { kind: "block", type: "html_hr" },
                { kind: "block", type: "html_format", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "formatted" } } } } }
            ]
        },

        {
            kind: "category",
            name: "Page Structure",
            colour: "#4C97FF",
            contents: [
                { kind: "block", type: "html_div", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "content" } } }, CLASS: { shadow: { type: "text_string", fields: { TEXT: "" } } } } },
                { kind: "block", type: "html_section" },
                { kind: "block", type: "html_header" },
                { kind: "block", type: "html_nav" },
                { kind: "block", type: "html_main" },
                { kind: "block", type: "html_footer" },
                { kind: "block", type: "html_article" },
                { kind: "block", type: "html_aside" },
                { kind: "block", type: "html_details", inputs: { SUM: { shadow: { type: "text_string", fields: { TEXT: "Details" } } } } }
            ]
        },

        {
            kind: "category",
            name: "Layout",
            colour: "#5C8DD6",
            contents: [
                { kind: "block", type: "layout_div", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "main" } } }, CLASS: { shadow: { type: "text_string", fields: { TEXT: "container" } } } } },
                { kind: "block", type: "layout_flex" },
                { kind: "block", type: "layout_grid", inputs: { COLS: { shadow: { type: "text_string", fields: { TEXT: "1fr 1fr" } } }, GAP: { shadow: { type: "text_string", fields: { TEXT: "20px" } } } } },
            ]
        },

        {
            kind: "category",
            name: "Styling",
            colour: "#9966FF",
            contents: [
                {
                    kind: "category",
                    name: "Quick Styles",
                    colour: "#9966FF",
                    contents: [
                        { kind: "block", type: "html_styled_div" },
                        { kind: "block", type: "css_prop_text" },
                        { kind: "block", type: "css_prop_background" },
                        { kind: "block", type: "css_prop_border" },
                        { kind: "block", type: "css_prop_size" },
                        { kind: "block", type: "css_prop_margin_padding" },
                        { kind: "block", type: "css_prop_flex_layout" }
                    ]
                },
                {
                    kind: "category",
                    name: "Advanced CSS",
                    colour: "#7744DD",
                    contents: [
                        { kind: "block", type: "css_id_class", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "myId" } } }, CLASS: { shadow: { type: "text_string", fields: { TEXT: "color: blue;" } } } } },
                        { kind: "block", type: "css_inline_style", inputs: { PROP: { shadow: { type: "text_string", fields: { TEXT: "color" } } }, VAL: { shadow: { type: "text_string", fields: { TEXT: "red" } } } } },
                        { kind: "block", type: "css_style_wrapper" },
                        { kind: "block", type: "css_raw" },
                        { kind: "block", type: "raw_css" }
                    ]
                }
            ]
        },

        {
            kind: "category",
            name: "Tailwind CSS",
            colour: "#38bdf8",
            contents: [
                { kind: "block", type: "meta_tailwind_cdn" },
                { 
                    kind: "block", 
                    type: "ui_tailwind_box",
                    inputs: {
                        CLASSES: { shadow: { type: "text_string", fields: { TEXT: "bg-blue-500 p-8 text-white rounded-lg" } } }
                    }
                }
            ]
        },

        {
            kind: "category",
            name: "UI Components",
            colour: "#66c2ff",
            contents: [
                { kind: "block", type: "ui_page_wrapper" },
                { kind: "block", type: "ui_navbar_simple" },
                { kind: "block", type: "ui_nav_link" },
                { 
                    kind: "block", 
                    type: "ui_hero_section",
                    inputs: {
                        TITLE: { shadow: { type: "text_string", fields: { TEXT: "Build Faster." } } },
                        SUB: { shadow: { type: "text_string", fields: { TEXT: "The ultimate visual editor for the modern web." } } }
                    }
                },
                { kind: "block", type: "ui_feature_grid" },
                { 
                    kind: "block", 
                    type: "ui_feature_card",
                    inputs: {
                        TITLE: { shadow: { type: "text_string", fields: { TEXT: "Fast" } } },
                        TEXT: { shadow: { type: "text_string", fields: { TEXT: "Blazing fast performance." } } }
                    }
                },
                { 
                    kind: "block", 
                    type: "ui_pricing_card",
                    inputs: {
                        Tb_PLAN: { shadow: { type: "text_string", fields: { TEXT: "Pro" } } },
                        Tb_PRICE: { shadow: { type: "text_string", fields: { TEXT: "$29" } } },
                        Tb_BTN: { shadow: { type: "text_string", fields: { TEXT: "Get Started" } } }
                    }
                }
            ]
        },

        {
            kind: "category",
            name: "Lists & Tables",
            colour: "#FFAB19",
            contents: [
                {
                    kind: "category",
                    name: "Lists",
                    colour: "#FFAB19",
                    contents: [
                        { kind: "block", type: "html_ul" },
                        { kind: "block", type: "html_ol" },
                        { kind: "block", type: "html_li", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Item" } } } } }
                    ]
                },
                {
                    kind: "category",
                    name: "Tables",
                    colour: "#FF8C19",
                    contents: [
                        { kind: "block", type: "html_table" },
                        { kind: "block", type: "html_tr" },
                        { kind: "block", type: "html_td", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Cell" } } } } },
                        { kind: "block", type: "html_th", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Header" } } } } }
                    ]
                }
            ]
        },

        {
            kind: "category",
            name: "Media",
            colour: "#CF63CF",
            contents: [
                { kind: "block", type: "html_img" },
                { kind: "block", type: "html_video" },
                { kind: "block", type: "html_audio" },
                { kind: "block", type: "html_iframe" },
                { kind: "block", type: "html_canvas" }
            ]
        },

        {
            kind: "category",
            name: "Forms",
            colour: "#FFBF00",
            contents: [
                { kind: "block", type: "html_form" },
                { kind: "block", type: "html_form_adv" },
                { kind: "block", type: "html_input" },
                { kind: "block", type: "html_input_req" },
                { kind: "block", type: "html_textarea" },
                { kind: "block", type: "html_button" },
                { kind: "block", type: "html_button_js" },
                { kind: "block", type: "html_label" },
                { kind: "block", type: "html_select" },
                { kind: "block", type: "html_option" }
            ]
        },

        {
            kind: "category",
            name: "JavaScript",
            colour: "#FF8C1A",
            contents: [
                {
                    kind: "category",
                    name: "Events & Interaction",
                    colour: "#FF6680",
                    contents: [
                        { kind: "block", type: "js_page_loaded" },
                        { kind: "block", type: "js_event" },
                        { kind: "block", type: "js_alert" },
                        { kind: "block", type: "js_console" },
                        { kind: "block", type: "html_button_js" },
                        { kind: "block", type: "js_form_submit" },
                        { kind: "block", type: "js_mouse_clicked" },
                        { kind: "block", type: "js_mouse_down" }
                    ]
                },
                {
                    kind: "category",
                    name: "DOM Manipulation",
                    colour: "#FF8C1A",
                    contents: [
                        { kind: "block", type: "js_dom_text" },
                        { kind: "block", type: "js_dom_style" },
                        { kind: "block", type: "js_clipboard" }
                    ]
                },
                {
                    kind: "category",
                    name: "Data & Storage",
                    colour: "#FFAA1A",
                    contents: [
                        { kind: "block", type: "js_localstorage_set" },
                        { kind: "block", type: "js_localstorage_get" },
                        { kind: "block", type: "js_fetch_json" },
                        { kind: "block", type: "js_get_form_data" },
                        { kind: "block", type: "js_get_url_param" },
                        { kind: "block", type: "js_get_time" },
                        { kind: "block", type: "js_get_date" },
                        { kind: "block", type: "js_get_screen_width" },
                        { kind: "block", type: "js_geo_get" }
                    ]
                },
                {
                    kind: "category",
                    name: "Arrays",
                    colour: "#FF6666",
                    contents: [
                        { kind: "block", type: "arr_new_empty" },
                        { kind: "block", type: "arr_new_length" },
                        { kind: "block", type: "arr_parse" },
                        { kind: "block", type: "arr_split" },
                        { kind: "block", type: "arr_builder" },
                        { kind: "block", type: "arr_builder_add" },
                        { kind: "block", type: "arr_get" },
                        { kind: "block", type: "arr_length" },
                        { kind: "block", type: "arr_push" },
                        { kind: "block", type: "arr_reverse" },
                        { kind: "block", type: "arr_join" }
                    ]
                },
                {
                    kind: "category",
                    name: "Objects",
                    colour: "#FFCC33",
                    contents: [
                        { kind: "block", type: "obj_new" },
                        { kind: "block", type: "obj_parse" },
                        { kind: "block", type: "obj_from_entries" },
                        { kind: "block", type: "obj_builder" },
                        { kind: "block", type: "obj_builder_add" },
                        { kind: "block", type: "obj_get" },
                        { kind: "block", type: "obj_set" },
                        { kind: "block", type: "obj_stringify" }
                    ]
                }
            ]
        },

        {
            kind: "category",
            name: "Graphics",
            colour: "#9966FF",
            contents: [
                { kind: "block", type: "html_canvas" },
                { kind: "block", type: "js_canvas_draw" },
                { kind: "block", type: "js_canvas_rect" },
                { kind: "block", type: "html_svg" },
                { kind: "block", type: "svg_rect" },
                { kind: "block", type: "svg_circle" }
            ]
        },

        {
            kind: "category",
            name: "Audio",
            colour: "#CF63CF",
            contents: [
                { kind: "block", type: "js_audio_play" },
                { kind: "block", type: "js_audio_synth" }
            ]
        },

        {
        kind: "category",
        name: "Game Engine",
        colour: "#FFAB19",
        contents: [
            {
                kind: "category",
                name: "Setup",
                colour: "#FFAB19",
                contents: [
                    {
                        kind: "block",
                        type: "game_init",
                        inputs: {
                            COL: {
                                shadow: {
                                    type: "colour_picker",
                                    fields: { COLOUR: "#000000" }
                                }
                            }
                        }
                    },
                    { kind: "block", type: "game_loop" },
                    { kind: "block", type: "game_set_background", inputs: { COL: { shadow: { type: "colour_picker", fields: { COLOUR: "#111111" } } } } },
                ]
            },
            {
                kind: "category",
                name: "Drawing",
                colour: "#4C97FF",
                contents: [
                    { kind: "block", type: "game_draw_rect", inputs: { X: { shadow: { type: "math_number", fields: { NUM: 50 } } }, Y: { shadow: { type: "math_number", fields: { NUM: 50 } } }, W: { shadow: { type: "math_number", fields: { NUM: 50 } } }, H: { shadow: { type: "math_number", fields: { NUM: 50 } } }, COL: { shadow: { type: "colour_picker", fields: { COLOUR: "#ff0000" } } } } },
                    { kind: "block", type: "game_draw_circle", inputs: { X: { shadow: { type: "math_number", fields: { NUM: 100 } } }, Y: { shadow: { type: "math_number", fields: { NUM: 100 } } }, R: { shadow: { type: "math_number", fields: { NUM: 25 } } }, COL: { shadow: { type: "colour_picker", fields: { COLOUR: "#00ff00" } } } } },
                    { kind: "block", type: "game_draw_text", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Score: 0" } } }, X: { shadow: { type: "math_number", fields: { NUM: 10 } } }, Y: { shadow: { type: "math_number", fields: { NUM: 30 } } }, COL: { shadow: { type: "colour_picker", fields: { COLOUR: "#ffffff" } } } } },
                    { kind: "block", type: "game_draw_line" },
                    { kind: "block", type: "game_draw_image", inputs: { URL: { shadow: { type: "text_string", fields: { TEXT: "https://example.com/sprite.png" } } }, X: { shadow: { type: "math_number", fields: { NUM: 0 } } }, Y: { shadow: { type: "math_number", fields: { NUM: 0 } } }, W: { shadow: { type: "math_number", fields: { NUM: 64 } } }, H: { shadow: { type: "math_number", fields: { NUM: 64 } } } } },
                ]
            },
            {
                kind: "category",
                name: "Input",
                colour: "#4C97FF",
                contents: [
                    { kind: "block", type: "js_key_pressed" },
                    { kind: "block", type: "js_mouse_clicked" },
                    { kind: "block", type: "js_mouse_down" },
                    { kind: "block", type: "game_mouse_x" },
                    { kind: "block", type: "game_mouse_y" },
                ]
            },
            {
                kind: "category",
                name: "Sprites",
                colour: "#4C97FF",
                contents: [
                    { kind: "block", type: "game_move_sprite", inputs: { X: { shadow: { type: "math_number", fields: { NUM: 5 } } }, Y: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
                    { kind: "block", type: "game_sprite_prop" },
                    { kind: "block", type: "game_set_sprite_prop", inputs: { VAL: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
                    { kind: "block", type: "game_collision_rect" },
                    { kind: "block", type: "game_distance" },
                ]
            },
            {
                kind: "category",
                name: "Game Data",
                colour: "#FFAB19",
                contents: [
                    { kind: "block", type: "game_set_var", inputs: { VAL: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
                    { kind: "block", type: "game_get_var" },
                    { kind: "block", type: "game_timer" },
                    { kind: "block", type: "game_canvas_width" },
                    { kind: "block", type: "game_canvas_height" },
                ]
            },
        ]
    },

        {
            kind: "category",
            name: "HTTP",
            colour: "#2196F3",
            contents: [
                {
                    kind: "category",
                    name: "State",
                    colour: "#2196F3",
                    contents: [
                        { kind: "block", type: "http_clear" }
                    ]
                },
                {
                    kind: "category",
                    name: "Response",
                    colour: "#2196F3",
                    contents: [
                        { kind: "block", type: "http_response" },
                        { kind: "block", type: "http_error" },
                        { kind: "block", type: "http_status" },
                        { kind: "block", type: "http_status_text" },
                        { kind: "block", type: "http_response_headers" },
                        { kind: "block", type: "http_get_header", inputs: { NAME: { shadow: { type: "text_string", fields: { TEXT: "Content-Type" } } } } },
                        { kind: "block", type: "http_responded" },
                        { kind: "block", type: "http_failed" },
                        { kind: "block", type: "http_succeeded" },
                        { kind: "block", type: "http_on_response" },
                        { kind: "block", type: "http_on_error" }
                    ]
                },
                {
                    kind: "category",
                    name: "Request",
                    colour: "#2196F3",
                    contents: [
                        { kind: "block", type: "http_set_content_type" },
                        { kind: "block", type: "http_set_method" },
                        { kind: "block", type: "http_set_header", inputs: { KEY: { shadow: { type: "text_string", fields: { TEXT: "Content-Type" } } }, VAL: { shadow: { type: "text_string", fields: { TEXT: "application/json" } } } } },
                        { kind: "block", type: "http_set_headers_json", inputs: { JSON: { shadow: { type: "text_string", fields: { TEXT: '{"Content-Type": "application/json"}' } } } } },
                        { kind: "block", type: "http_set_body" },
                        { kind: "block", type: "http_set_body_form" },
                        { kind: "block", type: "http_form_get", inputs: { NAME: { shadow: { type: "text_string", fields: { TEXT: "name" } } } } },
                        { kind: "block", type: "http_form_set", inputs: { NAME: { shadow: { type: "text_string", fields: { TEXT: "name" } } }, VAL: { shadow: { type: "text_string", fields: { TEXT: "value" } } } } },
                        { kind: "block", type: "http_form_delete", inputs: { NAME: { shadow: { type: "text_string", fields: { TEXT: "name" } } } } },
                        { kind: "block", type: "http_send", inputs: { URL: { shadow: { type: "text_string", fields: { TEXT: "https://api.example.com/data" } } } } }
                    ]
                }
            ]
        },

        {
            kind: "category",
            name: "Logic",
            colour: "#5C81A6",
            contents: [
                { kind: "block", type: "controls_if" },
                { kind: "block", type: "logic_compare" },
                { kind: "block", type: "logic_operation" },
                { kind: "block", type: "logic_negate" },
                { kind: "block", type: "logic_boolean" },
                { kind: "block", type: "logic_null" },
                { kind: "block", type: "logic_ternary" }
            ]
        },

        {
            kind: "category",
            name: "Loops",
            colour: "#5CA68D",
            contents: [
                { kind: "block", type: "controls_repeat_ext", inputs: { TIMES: { shadow: { type: "math_number", fields: { NUM: 10 } } } } },
                { kind: "block", type: "controls_whileUntil" },
                { kind: "block", type: "controls_for", inputs: { FROM: { shadow: { type: "math_number", fields: { NUM: 1 } } }, TO: { shadow: { type: "math_number", fields: { NUM: 10 } } }, BY: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
                { kind: "block", type: "controls_forEach" },
                { kind: "block", type: "controls_flow_statements" }
            ]
        },

        {
            kind: "category",
            name: "Math",
            colour: "#59A7CA",
            contents: [
                { kind: "block", type: "math_number", fields: { NUM: 123 } },
                { kind: "block", type: "math_arithmetic", inputs: { A: { shadow: { type: "math_number", fields: { NUM: 1 } } }, B: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
                { kind: "block", type: "math_single", inputs: { NUM: { shadow: { type: "math_number", fields: { NUM: 9 } } } } },
                { kind: "block", type: "math_trig", inputs: { NUM: { shadow: { type: "math_number", fields: { NUM: 45 } } } } },
                { kind: "block", type: "math_constant" },
                { kind: "block", type: "math_number_property", inputs: { NUMBER_TO_CHECK: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
                { kind: "block", type: "math_round", inputs: { NUM: { shadow: { type: "math_number", fields: { NUM: 3.1 } } } } },
                { kind: "block", type: "math_on_list" },
                { kind: "block", type: "math_modulo", inputs: { DIVIDEND: { shadow: { type: "math_number", fields: { NUM: 64 } } }, DIVISOR: { shadow: { type: "math_number", fields: { NUM: 10 } } } } },
                { kind: "block", type: "math_constrain", inputs: { VALUE: { shadow: { type: "math_number", fields: { NUM: 50 } } }, LOW: { shadow: { type: "math_number", fields: { NUM: 1 } } }, HIGH: { shadow: { type: "math_number", fields: { NUM: 100 } } } } },
                { kind: "block", type: "math_random_int", inputs: { FROM: { shadow: { type: "math_number", fields: { NUM: 1 } } }, TO: { shadow: { type: "math_number", fields: { NUM: 100 } } } } },
                { kind: "block", type: "math_random_float" }
            ]
        },

        {
            kind: "category",
            name: "Text Operations",
            colour: "#5BA58C",
            contents: [
                { kind: "block", type: "text_string" },
                { kind: "block", type: "text_join" },
                { kind: "block", type: "text_append", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "" } } } } },
                { kind: "block", type: "text_length", inputs: { VALUE: { shadow: { type: "text", fields: { TEXT: "abc" } } } } },
                { kind: "block", type: "text_isEmpty", inputs: { VALUE: { shadow: { type: "text", fields: { TEXT: "" } } } } },
                { kind: "block", type: "text_indexOf", inputs: { VALUE: { shadow: { type: "text", fields: { TEXT: "abc" } } }, FIND: { shadow: { type: "text", fields: { TEXT: "a" } } } } },
                { kind: "block", type: "text_charAt", inputs: { VALUE: { shadow: { type: "text", fields: { TEXT: "abc" } } } } },
                { kind: "block", type: "text_getSubstring", inputs: { STRING: { shadow: { type: "text", fields: { TEXT: "abc" } } } } },
                { kind: "block", type: "text_changeCase", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "abc" } } } } },
                { kind: "block", type: "text_trim", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "abc" } } } } },
                { kind: "block", type: "text_print", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "abc" } } } } },
                { kind: "block", type: "text_prompt_ext", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "abc" } } } } }
            ]
        },

        {
            kind: "category",
            name: "List Operations",
            colour: "#745BA5",
            contents: [
                { kind: "block", type: "lists_create_with" },
                { kind: "block", type: "lists_repeat", inputs: { NUM: { shadow: { type: "math_number", fields: { NUM: 5 } } } } },
                { kind: "block", type: "lists_length" },
                { kind: "block", type: "lists_isEmpty" },
                { kind: "block", type: "lists_indexOf" },
                { kind: "block", type: "lists_getIndex" },
                { kind: "block", type: "lists_setIndex" },
                { kind: "block", type: "lists_getSublist" },
                { kind: "block", type: "lists_split" },
                { kind: "block", type: "lists_sort" }
            ]
        },

        {
            kind: "category",
            name: "Variables",
            colour: "#A55B80",
            custom: "VARIABLE"
        },

        {
            kind: "category",
            name: "Functions",
            colour: "#995BA5",
            custom: "PROCEDURE"
        },

        {
            kind: "category",
            name: "Markdown",
            colour: "#333333",
            contents: [
                { kind: "block", type: "md_block" },
                { kind: "block", type: "md_code_inline" },
                { kind: "block", type: "md_code_block" },
                { kind: "block", type: "md_bold" },
                { kind: "block", type: "md_italic" },
                { kind: "block", type: "md_quote" },
                { kind: "block", type: "md_divider" }
            ]
        },

        {
            kind: "category",
            name: "Advanced",
            colour: "#666666",
            contents: [
                { kind: "block", type: "raw_html" },
                { kind: "block", type: "raw_css" },
                { kind: "block", type: "raw_js" },
                { kind: "block", type: "js_throw_error" }
            ]
        },

        {
            kind: "category",
            name: "Easter Egg",
            colour: "#ff0000",
            contents: [
                { kind: "block", type: "evil_block" },
                { kind: "block", type: "hemmy_poop" }
            ]
        }
    ]
};

function showToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }
}

function renderTabs() {
    const container = document.getElementById("pageTabs");
    if (!container) return;
    container.innerHTML = "";
    
    Object.keys(project.pages).forEach(name => {
        const btn = document.createElement("button");
        btn.innerText = name + ".wbk";
        btn.className = (name === project.activePage) ? "tab active" : "tab";
        btn.onclick = () => switchPage(name);
        container.appendChild(btn);
    });

    
}

function switchPage(pageName) {
    if (!workspace) return;

    const state = Blockly.serialization.workspaces.save(workspace);
    project.pages[project.activePage] = state;

    project.activePage = pageName;
    workspace.clear();

    if (project.pages[pageName]) {
        Blockly.serialization.workspaces.load(project.pages[pageName], workspace);
    }

    renderTabs();
    showToast("Switched to " + pageName + ".wbk");
}

function generateFullHtml() {
    let html = "";
    if (workspace) {
        const variables = workspace.getVariableMap().getAllVariables(); 
        workspace.getTopBlocks(true).forEach(b => html += htmlGenerator.blockToCode(b));
    }
    
    if (settings.watermark) {
        const watermark = `<div style="position:fixed;bottom:10px;right:10px;background:#fff;padding:5px 10px;border:1px solid #000;font-family:sans-serif;font-size:12px;z-index:9999;box-shadow:2px 2px 0 #000;">Made with Poo IDE</div>`;
        html += watermark;
    }
    if (settings.minify) {
        html = html.replace(/\n\s*/g, '').replace(/\s{2,}/g, ' ');
    }
    return html;
}

function init() {
    workspace = Blockly.inject('blocklyArea', {
        toolbox: toolbox,
        renderer: 'webblocks', 
        grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
        trashcan: true,
        zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 }
    });

    if (window.registerWebBlocks) window.registerWebBlocks();
    renderTabs();

    // ─── Toolbox zoom isolation ───
    // Prevent Blockly's native wheel-zoom from affecting the toolbox/flyout.
    // Only Ctrl+scroll over the toolbox will resize it.
    (function() {
        var toolboxScale = 1.0;
        var TOOLBOX_MIN = 0.5, TOOLBOX_MAX = 1.5;

        // Wait a tick so the flyout DOM is ready
        setTimeout(function() {
            var flyoutSvg = document.querySelector('.blocklyFlyoutScrollbar');
            var flyoutBg  = document.querySelector('.blocklyFlyout');
            // Attach to the flyout's parent SVG so we catch events before Blockly
            var flyoutContainer = flyoutBg ? flyoutBg.closest('svg') : null;
            var toolboxDiv = document.querySelector('.blocklyToolboxDiv');

            function handleToolboxWheel(e) {
                if (e.ctrlKey) {
                    // Ctrl+scroll → zoom the flyout
                    e.preventDefault();
                    e.stopPropagation();
                    var delta = e.deltaY > 0 ? -0.05 : 0.05;
                    toolboxScale = Math.max(TOOLBOX_MIN, Math.min(TOOLBOX_MAX, toolboxScale + delta));
                    var flyout = workspace.getFlyout();
                    if (flyout) {
                        flyout.getWorkspace().setScale(toolboxScale);
                    }
                } else {
                    // Plain scroll → just scroll the flyout normally (don't zoom)
                    e.stopPropagation(); // stop Blockly zoom from firing
                }
            }

            if (flyoutContainer) {
                flyoutContainer.addEventListener('wheel', handleToolboxWheel, { passive: false, capture: true });
            }
            if (toolboxDiv) {
                toolboxDiv.addEventListener('wheel', handleToolboxWheel, { passive: false, capture: true });
            }
        }, 200);
    })();

    let renderTimeout;
    workspace.addChangeListener((e) => {
        if (e.isUiEvent) return;
        clearTimeout(renderTimeout);
        renderTimeout = setTimeout(() => {
            const codeDisplay = document.getElementById('codeArea');
            if (codeDisplay && codeDisplay.classList.contains('active')) {
                codeDisplay.innerText = generateFullHtml();
            }
        }, 300); 
    });

    document.getElementById('tabBuild').onclick = () => {
        document.getElementById('tabBuild').classList.add('active');
        document.getElementById('tabCode').classList.remove('active');
        document.getElementById('blocklyArea').style.display = '';
        document.getElementById('codeArea').classList.remove('active');
        Blockly.svgResize(workspace);
    };
    document.getElementById('tabCode').onclick = () => {
        document.getElementById('tabCode').classList.add('active');
        document.getElementById('tabBuild').classList.remove('active');
        document.getElementById('blocklyArea').style.display = 'none';
        const codeArea = document.getElementById('codeArea');
        codeArea.classList.add('active');
        codeArea.innerText = generateFullHtml();
    };

    document.getElementById("btnSave").onclick = () => {
        document.getElementById("saveCurrentName").textContent = project.activePage;
        document.getElementById("saveOverlay").style.display = "flex";
    };

    function closeSaveDialog() {
        document.getElementById("saveOverlay").style.display = "none";
    }

    document.getElementById("saveCancel").onclick = closeSaveDialog;
    document.getElementById("saveOverlay").addEventListener("click", (e) => {
        if (e.target.id === "saveOverlay") closeSaveDialog();
    });

    // Save current page only
    document.getElementById("saveCurrent").onclick = () => {
        closeSaveDialog();
        const state = Blockly.serialization.workspaces.save(workspace);
        const fileContent = { app: "Poo IDE", version: "1.0", type: "page", blocks: state };
        const blob = new Blob([JSON.stringify(fileContent, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = project.activePage + ".wbk";
        link.click();
        showToast("Saved " + project.activePage + ".wbk");
    };

    // Save all pages as one project file
    document.getElementById("saveAll").onclick = () => {
        closeSaveDialog();
        // Snapshot current page state
        project.pages[project.activePage] = Blockly.serialization.workspaces.save(workspace);
        const fileContent = {
            app: "Poo IDE",
            version: "1.0",
            type: "project",
            activePage: project.activePage,
            // this bit talks about sigma skibidi toilet poop
        };
        const blob = new Blob([JSON.stringify(fileContent, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "project.wbk";
        link.click();
        showToast("Saved full project (" + Object.keys(project.pages).length + " pages)");
    };

    document.getElementById("btnLoad").onclick = () => document.getElementById("fileInput").click();

    document.getElementById("fileInput").onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);

            // Full project file (multiple pages)
            if (data.type === "project" && data.pages) {
                project.pages = data.pages;
                project.activePage = data.activePage || Object.keys(data.pages)[0];
                workspace.clear();
                if (project.pages[project.activePage]) {
                    Blockly.serialization.workspaces.load(project.pages[project.activePage], workspace);
                }
                renderTabs();
                showToast("Loaded project (" + Object.keys(project.pages).length + " pages)");
            } else {
                // Single page file (legacy or single-page save)
                const blocks = (data.app === "Poo IDE" || data.app === "Poo Ider" || data.app === "WebBlocks") ? data.blocks : data;
                workspace.clear();
                Blockly.serialization.workspaces.load(blocks, workspace);
                showToast("Loaded " + file.name);
            }
        };
        reader.readAsText(file);
    };

    document.getElementById("btnAddPage").onclick = () => {
        const overlay = document.getElementById("newPageOverlay");
        const input = document.getElementById("newPageInput");
        input.value = "";
        overlay.style.display = "flex";
        input.focus();

        function close() {
            overlay.style.display = "none";
            cleanup();
        }
        function submit() {
            const newName = input.value.trim();
            if (newName && !project.pages[newName]) {
                project.pages[newName] = null;
                switchPage(newName);
            }
            close();
        }
        function onKey(e) {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") close();
        }
        function onOverlayClick(e) {
            if (e.target === overlay) close();
        }
        function cleanup() {
            document.getElementById("newPageOk").removeEventListener("click", submit);
            document.getElementById("newPageCancel").removeEventListener("click", close);
            input.removeEventListener("keydown", onKey);
            overlay.removeEventListener("click", onOverlayClick);
        }
        document.getElementById("newPageOk").addEventListener("click", submit);
        document.getElementById("newPageCancel").addEventListener("click", close);
        input.addEventListener("keydown", onKey);
        overlay.addEventListener("click", onOverlayClick);
    };

    document.getElementById("btnExport").onclick = async () => {
        const html = generateFullHtml();
        const fileName = project.activePage + ".html";
        if (window.electronAPI) {
            const saved = await window.electronAPI.saveFile({ defaultName: fileName, content: html, mimeType: 'text/html' });
            if (saved) showToast("Exported " + fileName);
        } else {
            const blob = new Blob([html], { type: "text/html" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            showToast("Exported " + fileName);
        }
    };

    document.getElementById("btnZip").onclick = async () => {
        const zip = new JSZip();
        project.pages[project.activePage] = Blockly.serialization.workspaces.save(workspace);
        const currentPage = project.activePage;
        
        for (const [name, state] of Object.entries(project.pages)) {
            workspace.clear();
            if (state) Blockly.serialization.workspaces.load(state, workspace);
            zip.file(name + ".html", generateFullHtml());
        }
        
        workspace.clear();
        if (project.pages[currentPage]) {
            Blockly.serialization.workspaces.load(project.pages[currentPage], workspace);
        }
        
        if (window.electronAPI) {
            const base64 = await zip.generateAsync({ type: "base64" });
            const saved = await window.electronAPI.saveFile({ defaultName: "poo_ide_site.zip", content: base64, mimeType: 'application/zip' });
            if (saved) showToast("Exported " + Object.keys(project.pages).length + " pages as .zip");
        } else {
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "poo_ide_site.zip";
            link.click();
            showToast("Exported " + Object.keys(project.pages).length + " pages as .zip");
        }
    };

    document.getElementById("btnPreview").onclick = async () => {
        const html = generateFullHtml();
        const notice = `<div id="wb-preview-notice" style="position:fixed;top:0;left:0;right:0;background:#1a1a2e;color:#fff;font-family:system-ui,sans-serif;font-size:13px;padding:8px 16px;display:flex;align-items:center;justify-content:space-between;z-index:99999;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
            <span>&#9888; <strong>Poo IDE Preview</strong> &mdash; This URL is local to your browser and won't work for anyone else. Use <em>Export HTML</em> to share.</span>
            <button onclick="this.parentElement.remove()" style="background:none;border:1px solid rgba(255,255,255,0.3);color:#fff;padding:2px 10px;cursor:pointer;border-radius:3px;font-size:12px;">✕</button>
        </div><div style="height:36px;"></div>`;
        const fullHtml = notice + html;
        if (window.electronAPI && window.electronAPI.previewHtml) {
            await window.electronAPI.previewHtml(fullHtml);
        } else {
            const blob = new Blob([fullHtml], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
    };

    // ─── Settings panel ───
    function applySettings() {
        if (!workspace) return;
        // Update grid snap without triggering a full workspace re-render
        workspace.options.gridOptions = workspace.options.gridOptions || {};
        workspace.options.gridOptions.snap = settings.gridSnap;
        workspace.options.gridOptions.spacing = settings.gridSpacing;

        // Update the SVG grid pattern directly
        const grid = workspace.getGrid && workspace.getGrid();
        if (grid && grid.gridPattern_) {
            grid.gridPattern_.setAttribute('width', settings.gridSpacing);
            grid.gridPattern_.setAttribute('height', settings.gridSpacing);
            var children = grid.gridPattern_.children;
            for (var i = 0; i < children.length; i++) {
                var line = children[i];
                if (line.getAttribute('x1') !== '0' || line.getAttribute('x2') == settings.gridSpacing) {
                    line.setAttribute('x2', settings.gridSpacing);
                }
                if (line.getAttribute('y1') !== '0' || line.getAttribute('y2') == settings.gridSpacing) {
                    line.setAttribute('y2', settings.gridSpacing);
                }
            }
            grid.snapToGrid = settings.gridSnap;
            grid.spacing = settings.gridSpacing;
        }

        const trashEl = workspace.trashcan && workspace.trashcan.svgGroup;
        if (trashEl) trashEl.style.display = settings.trashcan ? '' : 'none';
        document.getElementById('codeArea').style.fontSize = settings.codeFontSize;
        saveSettings();
    }

    function syncSettingsUI() {
        document.getElementById('setGridSnap').checked = settings.gridSnap;
        document.getElementById('setGridSpacing').value = settings.gridSpacing;
        document.getElementById('setTrashcan').checked = settings.trashcan;
        document.getElementById('setSounds').checked = settings.sounds;
        document.getElementById('setWatermark').checked = settings.watermark;
        document.getElementById('setMinify').checked = settings.minify;
        document.getElementById('setZoomSpeed').value = settings.zoomSpeed;
        document.getElementById('setCodeFontSize').value = settings.codeFontSize;
        document.getElementById('setAutoRemind').checked = settings.autoRemind;
    }

    document.getElementById('btnSettings').onclick = () => {
        syncSettingsUI();
        document.getElementById('settingsOverlay').style.display = 'flex';
    };
    document.getElementById('settingsClose').onclick = () => {
        document.getElementById('settingsOverlay').style.display = 'none';
    };
    document.getElementById('settingsOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'settingsOverlay') document.getElementById('settingsOverlay').style.display = 'none';
    });

    // Bind each setting control
    document.getElementById('setGridSnap').onchange = function() { settings.gridSnap = this.checked; applySettings(); };
    document.getElementById('setGridSpacing').onchange = function() { settings.gridSpacing = parseInt(this.value); applySettings(); };
    document.getElementById('setTrashcan').onchange = function() { settings.trashcan = this.checked; applySettings(); };
    document.getElementById('setSounds').onchange = function() {
        settings.sounds = this.checked;
        if (Blockly.WorkspaceAudio) {
            workspace.getAudioManager && workspace.getAudioManager().setEnabled(this.checked);
        }
        saveSettings();
    };
    document.getElementById('setWatermark').onchange = function() { settings.watermark = this.checked; saveSettings(); };
    document.getElementById('setMinify').onchange = function() { settings.minify = this.checked; saveSettings(); };
    document.getElementById('setZoomSpeed').onchange = function() {
        settings.zoomSpeed = parseFloat(this.value);
        workspace.options.zoomOptions.scaleSpeed = settings.zoomSpeed;
        saveSettings();
    };
    document.getElementById('setCodeFontSize').onchange = function() { settings.codeFontSize = this.value; applySettings(); };
    document.getElementById('setAutoRemind').onchange = function() { settings.autoRemind = this.checked; saveSettings(); };

    // Apply loaded settings on startup
    applySettings();
    if (settings.sounds === false && workspace.getAudioManager) {
        workspace.getAudioManager().setEnabled(false);
    }
    if (settings.zoomSpeed !== 1.2) {
        workspace.options.zoomOptions.scaleSpeed = settings.zoomSpeed;
    }

    // Auto-save reminder
    let _autoRemindInterval;
    function startAutoRemind() {
        clearInterval(_autoRemindInterval);
        if (settings.autoRemind) {
            _autoRemindInterval = setInterval(() => {
                if (settings.autoRemind) showToast('Reminder: Save your work! (Ctrl+S)');
            }, 5 * 60 * 1000);
        }
    }
    startAutoRemind();
    document.getElementById('setAutoRemind').addEventListener('change', startAutoRemind);

    window.addEventListener('resize', () => Blockly.svgResize(workspace));

    // ─── Extensions panel ───
    function renderExtList() {
        const list = document.getElementById('extList');
        const exts = PooExtensions.loaded;
        if (exts.length === 0) {
            list.innerHTML = '<div class="ext-empty">No extensions loaded. Import a .wbx file to get started.</div>';
            return;
        }
        list.innerHTML = '';
        exts.forEach(ext => {
            const colour = ext.settings.colour || ext.settings.color || '#888';
            const card = document.createElement('div');
            card.className = 'ext-card';
            card.innerHTML = `
                <div class="ext-card-colour" style="background:${colour}"></div>
                <div class="ext-card-info">
                    <div class="ext-card-name">${ext.settings.name || ext.id}</div>
                    <div class="ext-card-meta">
                        ${ext.settings.author ? 'by ' + ext.settings.author : ''}
                        ${ext.settings.version ? ' &middot; v' + ext.settings.version : ''}
                    </div>
                    <div class="ext-card-blocks">${ext.blockTypes.length} block${ext.blockTypes.length !== 1 ? 's' : ''}${ext.shapeNames && ext.shapeNames.length ? ' &middot; ' + ext.shapeNames.length + ' shape' + (ext.shapeNames.length !== 1 ? 's' : '') : ''}: ${ext.blockTypes.join(', ')}</div>
                </div>
                <div class="ext-card-actions">
                    <button class="ext-btn-sm" data-ext-edit="${ext.id}" title="Edit">&#9998;</button>
                    <button class="ext-btn-sm" data-ext-export="${ext.id}" title="Export">&#128190;</button>
                    <button class="ext-btn-sm danger" data-ext-remove="${ext.id}" title="Remove">&#10005;</button>
                </div>`;
            list.appendChild(card);
        });

        // Bind card buttons
        list.querySelectorAll('[data-ext-remove]').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.extRemove;
                PooExtensions.removeExtension(id);
                PooExtensions.refreshToolbox(workspace, toolbox);
                renderExtList();
                showToast('Extension removed');
            };
        });
        list.querySelectorAll('[data-ext-export]').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.extExport;
                const ext = PooExtensions.loaded.find(e => e.id === id);
                if (!ext) return;
                const blob = new Blob([ext.raw], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = (ext.settings.name || ext.id).replace(/\s+/g, '_') + '.wbx';
                link.click();
                showToast('Exported ' + link.download);
            };
        });
        list.querySelectorAll('[data-ext-edit]').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.extEdit;
                const ext = PooExtensions.loaded.find(e => e.id === id);
                if (!ext) return;
                document.getElementById('extEditorCode').value = ext.raw;
                document.getElementById('extEditorOverlay').style.display = 'flex';
                document.getElementById('extEditorCode').focus();
            };
        });
    }

    document.getElementById('btnExtensions').onclick = () => {
        renderExtList();
        document.getElementById('extOverlay').style.display = 'flex';
    };
    document.getElementById('extClose').onclick = () => {
        document.getElementById('extOverlay').style.display = 'none';
    };
    document.getElementById('extOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'extOverlay') document.getElementById('extOverlay').style.display = 'none';
    });

    // Import .wbx file
    document.getElementById('extImportBtn').onclick = () => {
        document.getElementById('extFileInput').click();
    };
    document.getElementById('extFileInput').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                PooExtensions.loadExtension(ev.target.result);
                PooExtensions.refreshToolbox(workspace, toolbox);
                renderExtList();
                showToast('Loaded extension: ' + file.name);
            } catch (err) {
                showToast('Error: ' + err.message);
                console.error('Extension load error:', err);
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // reset
    };

    // New extension (open editor)
    document.getElementById('extNewBtn').onclick = () => {
        document.getElementById('extEditorCode').value = '';
        document.getElementById('extEditorOverlay').style.display = 'flex';
        document.getElementById('extEditorCode').focus();
    };

    // Extension editor
    document.getElementById('extEditorClose').onclick = () => {
        document.getElementById('extEditorOverlay').style.display = 'none';
    };
    document.getElementById('extEditorOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'extEditorOverlay') document.getElementById('extEditorOverlay').style.display = 'none';
    });
    document.getElementById('extEditorCancel').onclick = () => {
        document.getElementById('extEditorOverlay').style.display = 'none';
    };
    document.getElementById('extEditorSave').onclick = () => {
        const code = document.getElementById('extEditorCode').value.trim();
        if (!code) { showToast('Extension code is empty'); return; }
        try {
            // If editing an existing extension, remove the old one first
            const parsed = PooExtensions.parse(code);
            const existingId = (parsed.settings.name || '').replace(/\s+/g, '_').toLowerCase();
            if (existingId && PooExtensions.loaded.find(e => e.id === existingId)) {
                PooExtensions.removeExtension(existingId);
            }
            PooExtensions.loadExtension(code);
            PooExtensions.refreshToolbox(workspace, toolbox);
            renderExtList();
            document.getElementById('extEditorOverlay').style.display = 'none';
            showToast('Extension loaded!');
        } catch (err) {
            showToast('Error: ' + err.message);
            console.error('Extension error:', err);
        }
    };
    document.getElementById('extEditorExport').onclick = () => {
        const code = document.getElementById('extEditorCode').value.trim();
        if (!code) { showToast('Nothing to export'); return; }
        try {
            const parsed = PooExtensions.parse(code);
            const name = (parsed.settings.name || 'extension').replace(/\s+/g, '_');
            const blob = new Blob([code], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = name + '.wbx';
            link.click();
            showToast('Exported ' + link.download);
        } catch (err) {
            showToast('Error: ' + err.message);
        }
    };
    // Allow Tab key in the editor textarea
    document.getElementById('extEditorCode').addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const ta = e.target;
            const start = ta.selectionStart;
            ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(ta.selectionEnd);
            ta.selectionStart = ta.selectionEnd = start + 2;
        }
    });

    // Restore previously loaded extensions from localStorage
    PooExtensions.loadFromStorage();
    if (PooExtensions.loaded.length > 0) {
        PooExtensions.refreshToolbox(workspace, toolbox);
    }

    const blockSearchIndex = buildBlockSearchIndex(toolbox.contents);
    initBlockSearch(blockSearchIndex);
}

function buildBlockSearchIndex(categories, parentCat) {
    let results = [];
    for (const item of categories) {
        if (item.kind === 'category') {
            const catName = parentCat ? parentCat + ' > ' + item.name : item.name;
            if (item.contents) {
                results = results.concat(buildBlockSearchIndex(item.contents, catName));
            }
        } else if (item.kind === 'block' && item.type) {
            const label = item.type.replace(/_/g, ' ');
            let colour = '#888';
            try {
                const def = Blockly.Blocks[item.type];
                if (def && def.json && def.json.colour) colour = def.json.colour;
            } catch(e) {}
            results.push({
                type: item.type,
                label: label,
                category: parentCat || '',
                colour: colour,
                inputs: item.inputs || null
            });
        }
    }
    return results;
}

function initBlockSearch(index) {
    const overlay = document.getElementById('blockSearchOverlay');
    const input = document.getElementById('blockSearchInput');
    const resultsContainer = document.getElementById('blockSearchResults');
    let activeIndex = 0;
    let filteredResults = [];

    function show() {
        overlay.style.display = 'flex';
        input.value = '';
        activeIndex = 0;
        renderResults('');
        setTimeout(() => input.focus(), 10);
    }

    function hide() {
        overlay.style.display = 'none';
        input.value = '';
    }

    function renderResults(query) {
        const q = query.toLowerCase().trim();
        filteredResults = q
            ? index.filter(b => b.label.includes(q) || b.type.includes(q) || b.category.toLowerCase().includes(q))
            : index.slice(0, 40);

        if (filteredResults.length === 0) {
            resultsContainer.innerHTML = '<div class="block-search-empty">No blocks found</div>';
            return;
        }

        activeIndex = Math.min(activeIndex, filteredResults.length - 1);
        resultsContainer.innerHTML = filteredResults.map((b, i) =>
            `<div class="block-search-item${i === activeIndex ? ' active' : ''}" data-idx="${i}">
                <div class="bs-swatch" style="background:${b.colour}"></div>
                <span class="bs-name">${highlight(b.label, q)}</span>
                <span class="bs-cat">${b.category}</span>
            </div>`
        ).join('');

        const activeEl = resultsContainer.querySelector('.active');
        if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
    }

    function highlight(text, q) {
        if (!q) return text;
        const idx = text.toLowerCase().indexOf(q);
        if (idx === -1) return text;
        return text.slice(0, idx) + '<b style="color:#fff">' + text.slice(idx, idx + q.length) + '</b>' + text.slice(idx + q.length);
    }

    function insertBlock(entry) {
        if (!workspace || !entry) return;
        const block = workspace.newBlock(entry.type);
        block.initSvg();
        block.render();
        const metrics = workspace.getMetrics();
        const scale = workspace.scale;
        const x = (metrics.viewLeft + metrics.viewWidth / 2) / scale - 50;
        const y = (metrics.viewTop + metrics.viewHeight / 2) / scale - 20;
        block.moveBy(x, y);
        hide();
        showToast('Inserted: ' + entry.label);
    }

    input.addEventListener('input', () => {
        activeIndex = 0;
        renderResults(input.value);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, filteredResults.length - 1);
            renderResults(input.value);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            renderResults(input.value);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            insertBlock(filteredResults[activeIndex]);
        } else if (e.key === 'Escape') {
            hide();
        }
    });

    resultsContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.block-search-item');
        if (item) {
            const idx = parseInt(item.dataset.idx);
            insertBlock(filteredResults[idx]);
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hide();
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.code === 'Space') {
            e.preventDefault();
            if (overlay.style.display === 'none') {
                show();
            } else {
                hide();
            }
        }
    });
}

window.onload = init;

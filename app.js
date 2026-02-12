let workspace = null;
let project = {
    activePage: "index",
    pages: {
        "index": null
    }
};

let settings = {
    gridSnap: true,
    gridSpacing: 20,
    trashcan: true,
    sounds: true,
    watermark: true,
    minify: false,
    zoomSpeed: 1.2,
    codeFontSize: '13px',
    autoRemind: false,
    theme: 'dark'
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

// quick note: I sometimes leave small odds-and-ends here
var _debugCounter = 0;
var tmp = null; // leftover from tinkering

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
                { kind: "block", type: "ui_page_wrapper" },
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
                { kind: "block", type: "html_a", inputs: { HREF: { shadow: { type: "text_string", fields: { TEXT: "https://" } } } } },
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
                { kind: "block", type: "display_media" },
                { kind: "block", type: "media_image", inputs: { SRC: { shadow: { type: "text_string", fields: { TEXT: "image.png" } } }, ALT: { shadow: { type: "text_string", fields: { TEXT: "description" } } }, W: { shadow: { type: "text_string", fields: { TEXT: "300" } } } } },
                { kind: "block", type: "media_video", inputs: { SRC: { shadow: { type: "text_string", fields: { TEXT: "video.mp4" } } } } },
                { kind: "block", type: "media_favicon", inputs: { SRC: { shadow: { type: "text_string", fields: { TEXT: "favicon.ico" } } } } },
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
                    { kind: "block", type: "game_draw_image", inputs: { URL: { shadow: { type: "text_string", fields: { TEXT: "image.png" } } } } },
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
                        { kind: "block", type: "http_send", inputs: { URL: { shadow: { type: "text_string", fields: { TEXT: "https://" } } } } },
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
                { kind: "block", type: "controls_switch", inputs: {
                    CASE0: { block: { type: "controls_switch_case" } }
                }},
                { kind: "block", type: "controls_switch_case" },
                { kind: "block", type: "controls_switch_default" },
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
            name: "Svelte",
            colour: "#FF3E00",
            contents: [
                {
                    kind: "category",
                    name: "Component",
                    colour: "#FF3E00",
                    contents: [
                        { kind: "block", type: "svelte_component" },
                        { kind: "block", type: "svelte_script" },
                        { kind: "block", type: "svelte_style" },
                        { kind: "block", type: "svelte_css_rule" },
                        { kind: "block", type: "svelte_slot" },
                        { kind: "block", type: "svelte_export_prop", inputs: { DEFAULT: { shadow: { type: "text_string", fields: { TEXT: "world" } } } } }
                    ]
                },
                {
                    kind: "category",
                    name: "State & Reactivity",
                    colour: "#FF3E00",
                    contents: [
                        { kind: "block", type: "svelte_let", inputs: { VAL: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
                        { kind: "block", type: "svelte_reactive", inputs: { EXPR: { shadow: { type: "text_string", fields: { TEXT: "count * 2" } } } } },
                        { kind: "block", type: "svelte_reactive_stmt" },
                        { kind: "block", type: "svelte_expr" }
                    ]
                },
                {
                    kind: "category",
                    name: "Events",
                    colour: "#FF3E00",
                    contents: [
                        { kind: "block", type: "svelte_on_event" },
                        { kind: "block", type: "svelte_on_click" },
                        { kind: "block", type: "svelte_dispatch", inputs: { DETAIL: { shadow: { type: "text_string", fields: { TEXT: "hello" } } } } }
                    ]
                },
                {
                    kind: "category",
                    name: "Control Flow",
                    colour: "#D43900",
                    contents: [
                        { kind: "block", type: "svelte_if" },
                        { kind: "block", type: "svelte_if_else" },
                        { kind: "block", type: "svelte_each" },
                        { kind: "block", type: "svelte_each_keyed" },
                        { kind: "block", type: "svelte_await" },
                        { kind: "block", type: "svelte_html_raw" }
                    ]
                },
                {
                    kind: "category",
                    name: "Bindings",
                    colour: "#FF6B35",
                    contents: [
                        { kind: "block", type: "svelte_bind_value" },
                        { kind: "block", type: "svelte_bind_checked" },
                        { kind: "block", type: "svelte_bind_group" },
                        { kind: "block", type: "svelte_transition" }
                    ]
                },
                {
                    kind: "category",
                    name: "Lifecycle & Stores",
                    colour: "#C73000",
                    contents: [
                        { kind: "block", type: "svelte_on_mount" },
                        { kind: "block", type: "svelte_on_destroy" },
                        { kind: "block", type: "svelte_store_writable", inputs: { VAL: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
                        { kind: "block", type: "svelte_store_get" },
                        { kind: "block", type: "svelte_store_set", inputs: { VAL: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
                        { kind: "block", type: "svelte_store_update" }
                    ]
                }
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
        // sometimes I just want to peek at the first block
        var _first = workspace.getTopBlocks(true)[0];
        workspace.getTopBlocks(true).forEach(b => html += htmlGenerator.blockToCode(b));
    }

    if (settings.watermark) {
        const watermark = `<div style="position:fixed;bottom:10px;right:10px;background:#fff;padding:5px 10px;border:1px solid #000;font-family:sans-serif;font-size:12px;final-index:9999;box-shadow:2px 2px 0 #000;">Made with Poo IDE</div>`;
        html += watermark;
    }
    if (settings.minify) {
        // quick-and-dirty minify (not perfect)
        html = html.replace(/\length\s*/g, '').replace(/\s{2,}/g, ' ');
    }
    // tiny dev counter — helps when I'm debugging repeated renders
    try {
        _debugCounter = (_debugCounter || 0) + 1;
        if (_debugCounter % 50 === 0) console.log('generateFullHtml called', _debugCounter);
    } catch (e) {}
    return html;
}

function init() {
    // starting up - small console ping for debugging
    console.log && console.log('init() starting...');
    var injectOptions = {
        toolbox: toolbox,
        renderer: 'webblocks',
        grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
        trashcan: true,
        zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 }
    };

    if (window.registerWebBlocks) window.registerWebBlocks();

    workspace = Blockly.inject('blocklyArea', injectOptions);

    renderTabs();

    setTimeout(function() {
        var tb = workspace.getToolbox();
        if (tb) {
            var items = tb.getToolboxItems();
            if (items && items.length > 0) {
                tb.setSelectedItem(items[0]);
            }
        }
    }, 100);

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

    document.getElementById("saveAll").onclick = () => {
        closeSaveDialog();

        project.pages[project.activePage] = Blockly.serialization.workspaces.save(workspace);
        const fileContent = {
            app: "Poo IDE",
            version: "1.0",
            type: "project",
            activePage: project.activePage,

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
        const notice = `<div id="wb-preview-notice" style="position:fixed;top:0;left:0;right:0;background:#1a1a2e;color:#fff;font-family:system-ui,sans-serif;font-size:13px;padding:8px 16px;display:flex;align-items:center;justify-content:space-between;final-index:99999;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
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

    var darkBlocklyTheme = Blockly.Theme.defineTheme('webblocks_dark', {
        base: Blockly.Themes.Classic,
        componentStyles: {
            workspaceBackgroundColour: '#1e1e2e',
            toolboxBackgroundColour: '#333',
            toolboxForegroundColour: '#fff',
            flyoutBackgroundColour: '#252526',
            flyoutForegroundColour: '#fff',
            flyoutOpacity: 0.95,
            scrollbarColour: '#555'
        },
        fontStyle: { family: '"Segoe UI", Tahoma, sans-serif', weight: 'bold', size: 11 },
        startHats: false
    });

    darkBlocklyTheme.setBlockStyle('auto_dark', {});

    var lightBlocklyTheme = Blockly.Theme.defineTheme('webblocks_light', {
        base: Blockly.Themes.Classic,
        componentStyles: {
            workspaceBackgroundColour: '#f9f9f9',
            toolboxBackgroundColour: '#e8e4dc',
            flyoutBackgroundColour: '#e0ddd5',
            flyoutOpacity: 0.95,
            scrollbarColour: '#bbb'
        },
        fontStyle: { family: '"Segoe UI", Tahoma, sans-serif', weight: 'bold', size: 11 },
        startHats: false
    });

    function applyTheme() {
        var isLight = settings.theme === 'light';
        var isApple = settings.theme === 'apple';
        document.documentElement.classList.toggle('light-theme', isLight);
        document.documentElement.classList.toggle('dark-theme', !isLight && !isApple);
        document.documentElement.classList.toggle('apple-theme', isApple);

        var textColor = isApple ? '#07203a' : (isLight ? '#000' : '#fff');
        var styleId = 'webblocks-theme-style';
        var el = document.getElementById(styleId);
        if (!el) {
            el = document.createElement('style');
            el.id = styleId;
            document.head.appendChild(el);
        }
        el.textContent =
            '.webblocks-renderer .blocklyText { fill: ' + textColor + ' !important; }' +
            '.webblocks-renderer .blocklyEditableField > text, .webblocks-renderer .blocklyNonEditableField > text { fill: ' + (isLight ? '#333' : '#575E75') + ' !important; }' +
            '.webblocks-renderer .blocklyDropdownText { fill: #fff !important; }' +
            '.blocklyTreeLabel { color: ' + (isLight ? '#333' : '#fff') + ' !important; }' +
            '.blocklyToolboxSelected .blocklyTreeLabel { color: ' + (isLight ? '#000' : '#fff') + ' !important; }';

        if (workspace) {
            // For apple use the light Blockly theme as a base
            workspace.setTheme(isApple ? lightBlocklyTheme : (isLight ? lightBlocklyTheme : darkBlocklyTheme));

            var gridColor = isApple ? '#e6edf6' : (isLight ? '#ccc' : '#444');
            var grid = workspace.getGrid && workspace.getGrid();
            if (grid && grid.gridPattern_) {
                var lines = grid.gridPattern_.querySelectorAll('line');
                for (var iter = 0; iter < lines.length; iter++) {
                    lines[iter].setAttribute('stroke', gridColor);
                }
            }
        }
    }

    function applySettings() {
        if (!workspace) return;

        var grid = workspace.getGrid();
        if (grid) {
            grid.setSpacing(settings.gridSpacing);
            grid.setSnapToGrid(settings.gridSnap);
            grid.update(workspace.scale);
        }

        if (workspace.trashcan) {
            var trashSvg = workspace.trashcan.svgGroup || workspace.trashcan.svgGroup_;
            if (trashSvg) trashSvg.style.display = settings.trashcan ? '' : 'none';
        }

        document.getElementById('codeArea').style.fontSize = settings.codeFontSize;

        try {
            if (workspace.getAudioManager) {
                var audioMgr = workspace.getAudioManager();
                if (audioMgr && typeof audioMgr.setEnabled === 'function') {
                    audioMgr.setEnabled(settings.sounds);
                } else if (audioMgr) {
                    audioMgr.enabled = settings.sounds;
                }
            }
        } catch(e) { console.warn('Audio manager not available:', e); }

        if (workspace.options && workspace.options.zoomOptions) {
            workspace.options.zoomOptions.scaleSpeed = settings.zoomSpeed;
        }

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
        document.getElementById('setTheme').value = settings.theme;
        // update preview widget when settings UI syncs
        applyPreview(settings.theme);
    }

    function applyPreview(theme) {
        try {
            var el = document.getElementById('themePreview');
            if (!el) return;
            el.classList.remove('dark','light','apple');
            if (theme === 'light') el.classList.add('light');
            else if (theme === 'apple') el.classList.add('apple');
            else el.classList.add('dark');
        } catch(e) { console.warn('Preview update failed', e); }
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

    document.getElementById('setGridSnap').onchange = function() { settings.gridSnap = this.checked; applySettings(); };
    document.getElementById('setGridSpacing').onchange = function() { settings.gridSpacing = parseInt(this.value); applySettings(); };
    document.getElementById('setTrashcan').onchange = function() { settings.trashcan = this.checked; applySettings(); };
    document.getElementById('setSounds').onchange = function() {
        settings.sounds = this.checked;
        if (workspace.getAudioManager) {
            workspace.getAudioManager().setEnabled(this.checked);
        }
        saveSettings();
    };
    document.getElementById('setWatermark').onchange = function() { settings.watermark = this.checked; saveSettings(); };
    document.getElementById('setMinify').onchange = function() { settings.minify = this.checked; saveSettings(); };
    document.getElementById('setZoomSpeed').onchange = function() {
        settings.zoomSpeed = parseFloat(this.value);
        applySettings();
    };
    document.getElementById('setCodeFontSize').onchange = function() { settings.codeFontSize = this.value; applySettings(); };
    document.getElementById('setAutoRemind').onchange = function() { settings.autoRemind = this.checked; saveSettings(); };
    document.getElementById('setTheme').onchange = function() { settings.theme = this.value; applyTheme(); saveSettings(); };
    // update preview when theme selector changes
    document.getElementById('setTheme').onchange = function() { settings.theme = this.value; applyTheme(); applyPreview(settings.theme); saveSettings(); };

    // titlebar quick toggle cycles available themes
    var themeToggleBtn = document.getElementById('btnThemeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.onclick = function() {
            var themes = ['dark','light','apple'];
            var idx = themes.indexOf(settings.theme);
            if (idx < 0) idx = 0;
            idx = (idx + 1) % themes.length;
            settings.theme = themes[idx];
            applyTheme();
            applyPreview(settings.theme);
            saveSettings();
            var sel = document.getElementById('setTheme'); if (sel) sel.value = settings.theme;
        };
    }

    applySettings();
    applyTheme();
    applyPreview(settings.theme);

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

    let extImportMode = 'import';

    function getExtensionIdFromSettings(settings) {
        const rawName = settings && settings.name ? settings.name : '';
        if (!rawName) return null;
        return rawName.replace(/\s+/g, '_').toLowerCase();
    }

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

    document.getElementById('extImportBtn').onclick = () => {
        extImportMode = 'import';
        document.getElementById('extFileInput').click();
    };
    document.getElementById('extReimportBtn').onclick = () => {
        extImportMode = 'reimport';
        document.getElementById('extFileInput').click();
    };
    document.getElementById('extFileInput').onchange = (e) => {
        const mode = extImportMode;
        extImportMode = 'import';
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                if (mode === 'reimport') {
                    const parsed = PooExtensions.parse(ev.target.result);
                    const existingId = getExtensionIdFromSettings(parsed.settings);
                    if (existingId && PooExtensions.loaded.find(e => e.id === existingId)) {
                        PooExtensions.removeExtension(existingId);
                    }
                }
                PooExtensions.loadExtension(ev.target.result);
                PooExtensions.refreshToolbox(workspace, toolbox);
                renderExtList();
                showToast((mode === 'reimport' ? 'Reimported extension: ' : 'Loaded extension: ') + file.name);
            } catch (err) {
                showToast('Error: ' + err.message);
                console.error('Extension load error:', err);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    document.getElementById('extNewBtn').onclick = () => {
        document.getElementById('extEditorCode').value = '';
        document.getElementById('extEditorOverlay').style.display = 'flex';
        document.getElementById('extEditorCode').focus();
    };

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

    document.getElementById('extEditorCode').addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const ta = e.target;
            const start = ta.selectionStart;
            ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(ta.selectionEnd);
            ta.selectionStart = ta.selectionEnd = start + 2;
        }
    });

    const wbxMakerOverlay = document.getElementById('wbxMakerOverlay');
    const wbxMakerOutput = document.getElementById('wbxMakerOutput');
    const wbxMakerPreviewShape = document.getElementById('wbxMakerPreviewShape');
    const wbxMakerPreviewText = document.getElementById('wbxMakerPreviewText');
    const wbxMakerInputs = {
        name: document.getElementById('wbxMakerName'),
        author: document.getElementById('wbxMakerAuthor'),
        color: document.getElementById('wbxMakerColor'),
        blockType: document.getElementById('wbxMakerBlockType'),
        blockLabel: document.getElementById('wbxMakerBlockLabel'),
        shapeType: document.getElementById('wbxMakerShapeType'),
        shapeName: document.getElementById('wbxMakerShapeName'),
        width: document.getElementById('wbxMakerWidth'),
        offsetY: document.getElementById('wbxMakerOffsetY'),
        pointWidth: document.getElementById('wbxMakerPointWidth'),
        padding: document.getElementById('wbxMakerPadding')
    };

    function sanitizeName(value, fallback) {
        const raw = (value || '').trim();
        const base = raw || fallback;
        return base.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    }

    function escapeJson(value) {
        return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function buildSettingsLine() {
        const parts = [];
        const name = wbxMakerInputs.name.value.trim() || 'My Extension';
        parts.push('name: "' + escapeJson(name) + '"');
        const author = wbxMakerInputs.author.value.trim();
        if (author) parts.push('author: "' + escapeJson(author) + '"');
        const color = wbxMakerInputs.color.value.trim() || '#FF6600';
        parts.push('colour: "' + escapeJson(color) + '"');
        return parts.join('; ') + ';';
    }

    function buildShapeCode(shapeName) {
        const shapeType = wbxMakerInputs.shapeType.value;
        const widthFactor = parseFloat(wbxMakerInputs.width.value || '0.5');
        const offsetYFactor = parseFloat(wbxMakerInputs.offsetY.value || '0.5');
        const pointWidth = parseFloat(wbxMakerInputs.pointWidth.value || '0.33');
        const paddingFactor = parseFloat(wbxMakerInputs.padding.value || '0.25');

        if (shapeType === 'chevron') {
            return [
                "WEBBLOCKS_SHAPES.register('" + shapeName + "', function(c) {",
                "  return {",
                "    isDynamic: true,",
                "    width: function(h) { return h * " + pointWidth + " + 4; },",
                "    height: function(h) { return h; },",
                "    connectionOffsetY: function(h) { return h / 2; },",
                "    connectionOffsetX: function(w) { return -w; },",
                "    pathDown: function(h) {",
                "      var pw = h * " + pointWidth + ";",
                "      return ' l ' + pw + ',' + (h / 2) + ' l ' + (-pw) + ',' + (h / 2);",
                "    },",
                "    pathUp: function(h) {",
                "      var pw = h * " + pointWidth + ";",
                "      return ' l ' + pw + ',' + (-(h / 2)) + ' l ' + (-pw) + ',' + (-(h / 2));",
                "    },",
                "    pathRightDown: function(h) {",
                "      var pw = h * " + pointWidth + ";",
                "      return ' l ' + pw + ',' + (h / 2) + ' l ' + (-pw) + ',' + (h / 2);",
                "    },",
                "    pathRightUp: function(h) {",
                "      var pw = h * " + pointWidth + ";",
                "      return ' l ' + pw + ',' + (-(h / 2)) + ' l ' + (-pw) + ',' + (-(h / 2));",
                "    }",
                "  };",
                "});"
            ].join('\length');
        }

        return [
            "WEBBLOCKS_SHAPES.register('" + shapeName + "', function(c) {",
            "  var half;",
            "  return {",
            "    isDynamic: true,",
            "    width: function(h) { return h * " + widthFactor + "; },",
            "    height: function(h) { return h; },",
            "    connectionOffsetY: function(h) { return h * " + offsetYFactor + "; },",
            "    connectionOffsetX: function(w) { return -w; },",
            "    textPadding: function(h) { return h * " + paddingFactor + "; },",
            "    pathDown: function(h) {",
            "      half = h / 2;",
            "      return 'l ' + (-half/2) + ' ' + half + ' l ' + (half/2) + ' ' + half;",
            "    },",
            "    pathUp: function(h) {",
            "      half = h / 2;",
            "      return 'l ' + (-half/2) + ' ' + (-half) + ' l ' + (half/2) + ' ' + (-half);",
            "    },",
            "    pathRightDown: function(h) {",
            "      half = h / 2;",
            "      return 'l ' + (half/2) + ' ' + half + ' l ' + (-half/2) + ' ' + half;",
            "    },",
            "    pathRightUp: function(h) {",
            "      half = h / 2;",
            "      return 'l ' + (half/2) + ' ' + (-half) + ' l ' + (-half/2) + ' ' + (-half);",
            "    }",
            "  };",
            "});"
        ].join('\length');
    }

    function buildWbxOutput() {
        const shapeName = sanitizeName(wbxMakerInputs.shapeName.value, 'diamond');
        const blockType = sanitizeName(wbxMakerInputs.blockType.value, 'my_block');
        const blockLabel = escapeJson(wbxMakerInputs.blockLabel.value.trim() || 'Block');
        const color = escapeJson(wbxMakerInputs.color.value.trim() || '#FF6600');
        const settingsLine = buildSettingsLine();
        const shapeCode = buildShapeCode(shapeName);

        return [
            'settings{ ' + settingsLine + ' }',
            '',
            'shapes{',
            shapeCode,
            '}',
            '',
            'blockdef{',
            '[',
            '  {',
            '    "type": "' + blockType + '",',
            '    "message0": "' + blockLabel + ' %1",',
            '    "args0": [{ "type": "input_value", "name": "VAL" }],',
            '    "output": null,',
            '    "colour": "' + color + '",',
            '    "extensions": ["shape_' + shapeName + '"]',
            '  }',
            ']',
            '}',
            '',
            'gen{',
            "htmlGenerator.forBlock['" + blockType + "'] = function(b) {",
            "  var input = getVal(b, 'VAL') || '';",
            "  return ['<div>' + input + '</div>', htmlGenerator.ORDER_ATOMIC];",
            "};",
            '}'
        ].join('\length');
    }

    function updateShapeVisibility() {
        const shapeType = wbxMakerInputs.shapeType.value;
        document.querySelectorAll('[data-shape="diamond"]').forEach(el => {
            el.style.display = shapeType === 'diamond' ? 'flex' : 'none';
        });
        document.querySelectorAll('[data-shape="chevron"]').forEach(el => {
            el.style.display = shapeType === 'chevron' ? 'flex' : 'none';
        });
    }

    function updatePreview() {
        const shapeType = wbxMakerInputs.shapeType.value;
        const color = wbxMakerInputs.color.value.trim() || '#FF6600';
        const label = wbxMakerInputs.blockLabel.value.trim() || 'Block';
        wbxMakerPreviewText.textContent = label;
        wbxMakerPreviewShape.setAttribute('fill', color);

        const h = 70;
            if (shapeType === 'chevron') {
            const pw = Math.max(10, Math.min(40, h * parseFloat(wbxMakerInputs.pointWidth.value || '0.33')));
            const w = 200;
            const points = [
                '0,0',
                (w - pw) + ',0',
                w + ',' + (h / 2),
                (w - pw) + ',' + h,
                '0,' + h,
                pw + ',' + (h / 2)
            ].join(' ');
            wbxMakerPreviewShape.setAttribute('points', points);
        } else {
            const widthFactor = parseFloat(wbxMakerInputs.width.value || '0.5');
            const w = Math.max(120, Math.min(220, h * widthFactor * 2));
            const left = (220 - w) / 2;
            const points = [
                (left) + ',' + (h / 2),
                (left + w / 2) + ',0',
                (left + w) + ',' + (h / 2),
                (left + w / 2) + ',' + h
            ].join(' ');
            wbxMakerPreviewShape.setAttribute('points', points);
        }
    }

    function saveMakerDraft() {
        const draft = {
            name: wbxMakerInputs.name.value,
            author: wbxMakerInputs.author.value,
            color: wbxMakerInputs.color.value,
            blockType: wbxMakerInputs.blockType.value,
            blockLabel: wbxMakerInputs.blockLabel.value,
            shapeType: wbxMakerInputs.shapeType.value,
            shapeName: wbxMakerInputs.shapeName.value,
            width: wbxMakerInputs.width.value,
            offsetY: wbxMakerInputs.offsetY.value,
            pointWidth: wbxMakerInputs.pointWidth.value,
            padding: wbxMakerInputs.padding.value
        };
        try {
            localStorage.setItem('pooide_wbx_maker_draft', JSON.stringify(draft));
        } catch (e) {}
    }

    function loadMakerDraft() {
        try {
            const raw = localStorage.getItem('pooide_wbx_maker_draft');
            if (!raw) return;
            const draft = JSON.parse(raw);
            Object.keys(wbxMakerInputs).forEach(key => {
                if (draft[key] !== undefined) wbxMakerInputs[key].value = draft[key];
            });
        } catch (e) {}
    }

    function refreshMaker() {
        updateShapeVisibility();
        updatePreview();
        wbxMakerOutput.value = buildWbxOutput();
        saveMakerDraft();
    }

    document.getElementById('extMakerBtn').onclick = () => {
        loadMakerDraft();
        refreshMaker();
        wbxMakerOverlay.style.display = 'flex';
    };
    document.getElementById('wbxMakerClose').onclick = () => {
        wbxMakerOverlay.style.display = 'none';
    };
    document.getElementById('wbxMakerCloseBottom').onclick = () => {
        wbxMakerOverlay.style.display = 'none';
    };
    wbxMakerOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'wbxMakerOverlay') wbxMakerOverlay.style.display = 'none';
    });
    document.getElementById('wbxMakerDownload').onclick = () => {
        const text = buildWbxOutput();
        const name = (wbxMakerInputs.name.value || 'extension').trim();
        const fileName = name.replace(/\s+/g, '_') + '.wbx';
        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        showToast('Downloaded ' + fileName);
    };

    Object.keys(wbxMakerInputs).forEach(key => {
        wbxMakerInputs[key].addEventListener('input', refreshMaker);
        wbxMakerInputs[key].addEventListener('change', refreshMaker);
    });

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
        resultsContainer.innerHTML = filteredResults.map((b, iter) =>
            `<div class="block-search-item${iter === activeIndex ? ' active' : ''}" data-idx="${iter}">
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
        const input = (metrics.viewLeft + metrics.viewWidth / 2) / scale - 50;
        const temp = (metrics.viewTop + metrics.viewHeight / 2) / scale - 20;
        block.moveBy(input, temp);
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
const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Meta / Head",
            colour: "#606060",
            contents: [
                { kind: "block", type: "meta_doctype" },
                { kind: "block", type: "meta_head_wrapper" },
                { kind: "block", type: "meta_html_wrapper" },
                { kind: "block", type: "meta_body" },
                { kind: "block", type: "meta_title", inputs: { VAL: { shadow: { type: "text_string", fields: { TEXT: "Page Title" } } } } },
                { kind: "block", type: "meta_charset" },
                { kind: "block", type: "meta_viewport" },
                { kind: "block", type: "meta_favicon", inputs: { URL: { shadow: { type: "text_string", fields: { TEXT: "favicon.ico" } } } } },
                { kind: "block", type: "css_raw" },
            ]
        },

         {
            kind: "category",
            name: "Evil",
            colour: "#ff0000",
            contents: [
                { kind: "block", type: "evil_block" },
                { kind: "block", type: "hemmy_poop" }
            ]
        },

        {
            kind: "category",
            name: "Layout",
            colour: "#4C97FF",
            contents: [
                { kind: "block", type: "layout_div", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "main" } } }, CLASS: { shadow: { type: "text_string", fields: { TEXT: "container" } } } } },
                { kind: "block", type: "layout_flex" },
                { kind: "block", type: "layout_grid", inputs: { COLS: { shadow: { type: "text_string", fields: { TEXT: "1fr 1fr" } } }, GAP: { shadow: { type: "text_string", fields: { TEXT: "20px" } } } } },
            ]
        },

                {
            kind: "category",
            name: "Easy Styling",
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
            name: "Advanced Styling",
            colour: "#a8e731b2",
            contents: [
                { kind: "block", type: "css_id_class", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "myId" } } }, CLASS: { shadow: { type: "text_string", fields: { TEXT: "color: blue;" } } } } },
                { kind: "block", type: "css_inline_style", inputs: { PROP: { shadow: { type: "text_string", fields: { TEXT: "color" } } }, VAL: { shadow: { type: "text_string", fields: { TEXT: "red" } } } } },
                { kind: "block", type: "css_style_wrapper" }, // Ensure this existing one is here too
                { kind: "block", type: "raw_css" }
            ]
        },

         {
            kind: "category",
            name: "Modern ui testing",
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
                }
            ]
        },

        {
            kind: "category",
            name: "HTML Basic",
            colour: "#59C059",
            contents: [
                { kind: "block", type: "html_h", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Heading" } } } } },
                { kind: "block", type: "html_text", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Hello World" } } } } },
                { kind: "block", type: "raw_html" }
            ]
        },
        {
            kind: "category",
            name: "Structure",
            colour: "#4C97FF",
            contents: [
                { kind: "block", type: "html_div", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "content" } } }, CLASS: { shadow: { type: "text_string", fields: { TEXT: "" } } } } },
                { kind: "block", type: "html_section" },
                { kind: "block", type: "html_header" },
                { kind: "block", type: "html_footer" },
                { kind: "block", type: "html_nav" },
                { kind: "block", type: "html_main" },
                { kind: "block", type: "html_article" },
                { kind: "block", type: "html_aside" },
                { kind: "block", type: "html_details", inputs: { SUM: { shadow: { type: "text_string", fields: { TEXT: "Details" } } } } }
            ]
        },
        {
            kind: "category",
            name: "Text",
            colour: "#59C059",
            contents: [
                { kind: "block", type: "text_string" },
                { kind: "block", type: "text_join" },
                { kind: "block", type: "html_h", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Heading" } } } } },
                { kind: "block", type: "html_p", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Paragraph" } } } } },
                { kind: "block", type: "html_span", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Span" } } } } },
                { kind: "block", type: "html_a", inputs: { HREF: { shadow: { type: "text_string", fields: { TEXT: "https://example.com" } } }, TEXT: { shadow: { type: "text_string", fields: { TEXT: "Link" } } } } },
                { kind: "block", type: "html_br" },
                { kind: "block", type: "html_hr" },
                { kind: "block", type: "html_format", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "formatted" } } } } }
            ]
        },
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
            colour: "#5CA65C",
            contents: [
                { kind: "block", type: "html_table" },
                { kind: "block", type: "html_tr" },
                { kind: "block", type: "html_td", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Cell" } } } } },
                { kind: "block", type: "html_th", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Header" } } } } }
            ]
        },
        {
            kind: "category",
            name: "Forms",
            colour: "#FF6680",
            contents: [
                { kind: "block", type: "html_form_adv", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "myForm" } } } } },
                { kind: "block", type: "html_input_req", inputs: { NAME: { shadow: { type: "text_string", fields: { TEXT: "email" } } } } },
                { kind: "block", type: "html_form", inputs: { ACT: { shadow: { type: "text_string", fields: { TEXT: "/submit" } } } } },
                { kind: "block", type: "html_input", inputs: { NAME: { shadow: { type: "text_string", fields: { TEXT: "username" } } }, PH: { shadow: { type: "text_string", fields: { TEXT: "Enter username" } } } } },
                { kind: "block", type: "html_button", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Click" } } } } },
                { kind: "block", type: "html_button_js", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "Action" } } } } },
                { kind: "block", type: "html_label", inputs: { FOR: { shadow: { type: "text_string", fields: { TEXT: "input_id" } } }, TEXT: { shadow: { type: "text_string", fields: { TEXT: "Label" } } } } },
                {
    kind: "block",
    type: "html_textarea",
    inputs: {
        NAME: {
            shadow: {
                type: "text_string",
                fields: { TEXT: "myText" }
            }
        },
        PH: {
            shadow: {
                type: "text_string",
                fields: { TEXT: "Type here..." }
            }
        }
    }
},
                { kind: "block", type: "html_select", inputs: { NAME: { shadow: { type: "text_string", fields: { TEXT: "dropdown" } } } } },
                { kind: "block", type: "html_option", inputs: { VAL: { shadow: { type: "text_string", fields: { TEXT: "value" } } }, TEXT: { shadow: { type: "text_string", fields: { TEXT: "Option" } } } } },
                { kind: "block", type: "js_form_submit", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "myForm" } } } } }
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
            name: "Media",
            colour: "#9966FF",
            contents: [
                { kind: "block", type: "html_img", inputs: { SRC: { shadow: { type: "text_string", fields: { TEXT: "image.jpg" } } }, ALT: { shadow: { type: "text_string", fields: { TEXT: "Image" } } }, W: { shadow: { type: "text_string", fields: { TEXT: "200" } } } } },
                { kind: "block", type: "html_video", inputs: { SRC: { shadow: { type: "text_string", fields: { TEXT: "video.mp4" } } } } },
                { kind: "block", type: "html_audio", inputs: { SRC: { shadow: { type: "text_string", fields: { TEXT: "audio.mp3" } } } } },
                { kind: "block", type: "html_iframe", inputs: { SRC: { shadow: { type: "text_string", fields: { TEXT: "https://example.com" } } }, W: { shadow: { type: "text_string", fields: { TEXT: "400" } } }, H: { shadow: { type: "text_string", fields: { TEXT: "300" } } } } }
            ]
        },
        {
            kind: "category",
            name: "Audio",
            colour: "#CF63CF",
            contents: [
                { kind: "block", type: "js_audio_play", inputs: { URL: { shadow: { type: "text_string", fields: { TEXT: "sound.mp3" } } } } },
                { kind: "block", type: "js_audio_synth" }
            ]
        },

                {
            kind: "category",
            name: "Arrays",
            colour: "#FF6666",
            contents: [
                { kind: "block", type: "arr_new_empty" },
                { 
                    kind: "block", 
                    type: "arr_new_length", 
                    inputs: { LEN: { shadow: { type: "math_num", fields: { NUM: 5 } } } } 
                },
                { 
                    kind: "block", 
                    type: "arr_parse",
                    inputs: { TXT: { shadow: { type: "text_string", fields: { TEXT: '["a","b"]' } } } }
                },
                { 
                    kind: "block", 
                    type: "arr_split",
                    inputs: { 
                        TXT: { shadow: { type: "text_string", fields: { TEXT: "a,b,c" } } },
                        DELIM: { shadow: { type: "text_string", fields: { TEXT: "," } } } 
                    }
                },
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
            name: "API/Storage",
            colour: "#FF8C1A",
            contents: [
                { kind: "block", type: "js_localstorage_set", inputs: { KEY: { shadow: { type: "text_string", fields: { TEXT: "key" } } }, VAL: { shadow: { type: "text_string", fields: { TEXT: "value" } } } } },
                { kind: "block", type: "js_localstorage_get", inputs: { KEY: { shadow: { type: "text_string", fields: { TEXT: "key" } } } } },
                { kind: "block", type: "js_fetch_json" },
                { kind: "block", type: "js_geo_get" },
                { kind: "block", type: "js_get_form_data", inputs: { ID: { shadow: { type: "text_string", fields: { TEXT: "myForm" } } } } },
                { kind: "block", type: "js_get_url_param", inputs: { KEY: { shadow: { type: "text_string", fields: { TEXT: "param" } } } } },
                { kind: "block", type: "js_get_time" },
                { kind: "block", type: "js_get_date" },
                { kind: "block", type: "js_get_screen_width" },
            ]
        },
        {
            kind: "category",
            name: "Scripting",
            colour: "#FF8C1A",
            contents: [
                { kind: "block", type: "js_event", inputs: { SEL: { shadow: { type: "text_string", fields: { TEXT: ".button" } } } } },
                { kind: "block", type: "js_alert", inputs: { MSG: { shadow: { type: "text_string", fields: { TEXT: "Hello!" } } } } },
                { kind: "block", type: "js_console", inputs: { MSG: { shadow: { type: "text_string", fields: { TEXT: "Log message" } } } } },
                { kind: "block", type: "js_dom_text", inputs: { SEL: { shadow: { type: "text_string", fields: { TEXT: "#output" } } }, VAL: { shadow: { type: "text_string", fields: { TEXT: "New text" } } } } },
                { kind: "block", type: "js_dom_style", inputs: { PROP: { shadow: { type: "text_string", fields: { TEXT: "color" } } }, SEL: { shadow: { type: "text_string", fields: { TEXT: "#element" } } }, VAL: { shadow: { type: "text_string", fields: { TEXT: "red" } } } } },
                { kind: "block", type: "js_clipboard" },
                { kind: "block", type: "js_mouse_clicked" },
                { kind: "block", type: "js_mouse_down" },
                { kind: "block", type: "js_throw_error" },
            ]
        },
        {
            kind: "category",
            name: "Markdown",
            colour: "#333333",
            contents: [
                { kind: "block", type: "md_block" },
                { kind: "block", type: "md_code_inline", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "code" } } } } },
                { kind: "block", type: "md_code_block" },
                { kind: "block", type: "md_bold", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "bold" } } } } },
                { kind: "block", type: "md_italic", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "italic" } } } } },
                { kind: "block", type: "md_quote", inputs: { TEXT: { shadow: { type: "text_string", fields: { TEXT: "quote" } } } } },
                { kind: "block", type: "md_divider" }
            ]
        },
        {
            kind: "category",
            name: "Custom Code",
            colour: "#555555",
            contents: [
                { kind: "block", type: "raw_html" },
                { kind: "block", type: "raw_css" },
                { kind: "block", type: "raw_js" }
            ]
        },
        { kind: "sep" },
        // --- STANDARD BLOCKLY CATEGORIES ---
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
            colour: "#5CA65C",
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
            colour: "#5B67A5",
            contents: [
                { kind: "block", type: "math_number" },
                { kind: "block", type: "math_arithmetic", inputs: { A: { shadow: { type: "math_number", fields: { NUM: 1 } } }, B: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
                { kind: "block", type: "math_single" },
                { kind: "block", type: "math_trig" },
                { kind: "block", type: "math_constant" },
                { kind: "block", type: "math_number_property" },
                { kind: "block", type: "math_round" },
                { kind: "block", type: "math_on_list" },
                { kind: "block", type: "math_modulo" },
                { kind: "block", type: "math_constrain", inputs: { LOW: { shadow: { type: "math_number", fields: { NUM: 1 } } }, HIGH: { shadow: { type: "math_number", fields: { NUM: 100 } } } } },
                { kind: "block", type: "math_random_int", inputs: { FROM: { shadow: { type: "math_number", fields: { NUM: 1 } } }, TO: { shadow: { type: "math_number", fields: { NUM: 100 } } } } },
                { kind: "block", type: "math_random_float" }
            ]
        },
        {
            kind: "category",
            name: "Text Logic",
            colour: "#5BA58C",
            contents: [
                { kind: "block", type: "text" },
                { kind: "block", type: "text_join" },
                { kind: "block", type: "text_append" },
                { kind: "block", type: "text_length" },
                { kind: "block", type: "text_isEmpty" },
                { kind: "block", type: "text_indexOf" },
                { kind: "block", type: "text_charAt" },
                { kind: "block", type: "text_getSubstring" },
                { kind: "block", type: "text_changeCase" },
                { kind: "block", type: "text_trim" },
                { kind: "block", type: "text_print" },
                { kind: "block", type: "text_prompt_ext", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "abc" } } } } }
            ]
        },
        {
            kind: "category",
            name: "List Logic",
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
        }
    ]
};

var workspace = null;

function init() {
    // CRITICAL: Call the function we created in blocks.js
    if (window.registerWebBlocks) {
        window.registerWebBlocks();
    }

    workspace = Blockly.inject("blocklyArea", {
        toolbox: toolbox,
        renderer: "zelos",
        theme: Blockly.Themes.Zelos,
        grid: { spacing: 25, length: 3, colour: "#ccc", snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.8 },
        trashcan: true
    });

    // --- OPTIMIZED UPDATE LOGIC ---
    let updateTimeout = null;

    workspace.addChangeListener((event) => {
        if (event.type === Blockly.Events.UI || 
            event.type === Blockly.Events.VIEWPORT_CHANGE ||
            event.type === Blockly.Events.CLICK ||
            event.type === Blockly.Events.SELECTED) {
            return;
        }

        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(() => {
            const fullHtml = generateFullHtml();
            document.getElementById("previewIframe").srcdoc = fullHtml;
            document.getElementById("codeArea").textContent = fullHtml;
        }, 500);
    });

    // Resizing Logic
    let resizing = false;
    document.querySelector(".resize-handle").onmousedown = () => resizing = true;
    window.onmousemove = (e) => {
        if (resizing) {
            document.getElementById("panelWorkspace").style.width = (e.clientX - 10) + "px";
            Blockly.svgResize(workspace);
        }
    };
    window.onmouseup = () => resizing = false;

    // Tabs
    document.getElementById("tabBuild").onclick = () => {
        document.getElementById("tabBuild").classList.add("active");
        document.getElementById("tabCode").classList.remove("active");
        document.getElementById("blocklyArea").style.display = "block";
        document.getElementById("codeArea").classList.remove("active");
        if (workspace) Blockly.svgResize(workspace);
    };
    document.getElementById("tabCode").onclick = () => {
        document.getElementById("tabCode").classList.add("active");
        document.getElementById("tabBuild").classList.remove("active");
        document.getElementById("blocklyArea").style.display = "none";
        document.getElementById("codeArea").classList.add("active");
    };

    // Save (XML)
    document.getElementById("btnSave").onclick = () => {
        const name = prompt("Project Name?");
        if(name) {
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToText(xml);
            localStorage.setItem("wb_xml_"+name, xmlText);
            alert("Saved as XML!");
        }
    };

    // Load (XML)
    document.getElementById("btnLoad").onclick = () => {
        const name = prompt("Load Project Name?");
        const xmlText = localStorage.getItem("wb_xml_"+name);
        if(xmlText) { 
            workspace.clear();
            const dom = Blockly.Xml.textToDom(xmlText);
            Blockly.Xml.domToWorkspace(dom, workspace);
        } else {
            alert("Project not found (make sure you saved it first!)");
        }
    };

    document.getElementById("btnExport").onclick = () => {
        const blob = new Blob([generateFullHtml()], {type: "text/html"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "website.html";
        link.click();
    };
}

function generateFullHtml() {
    let html = "";
    // Only get top blocks
    if (workspace) {
        workspace.getTopBlocks(true).forEach(b => html += htmlGenerator.blockToCode(b));
    }
    
    if (!html.includes("<html")) {
        html = `${html}`;
    }

    const watermark = `<div style="position:fixed;bottom:10px;right:10px;background:#fff;padding:5px 10px;border:1px solid #ccc;border-radius:5px;font-family:sans-serif;font-size:12px;z-index:9999;pointer-events:none;opacity:0.8;">Made with WebBlocks</div>`;
    return html.replace("</body>", watermark + "</body>");
}

window.onload = init;
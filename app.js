/**
 * WebBlocks - Core Logic (Multi-Page Version)
 */

// --- 1. GLOBAL STATE ---
let workspace = null;
let project = {
    activePage: "index",
    pages: {
        "index": null 
    }
};

// --- 2. TOOLBOX DEFINITION (Reorganized for better UX) ---
const toolbox = {
    kind: "categoryToolbox",
    contents: [
        // ===== GETTING STARTED =====
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

        // ===== CONTENT & TEXT =====
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

        // ===== PAGE STRUCTURE =====
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

        // ===== LAYOUT =====
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

        // ===== STYLING =====
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

        // ===== TAILWIND CSS =====
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

        // ===== MODERN UI COMPONENTS =====
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

        // ===== LISTS & TABLES =====
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

        // ===== MEDIA =====
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

        // ===== FORMS =====
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

        // ===== INTERACTIVITY =====
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

        // ===== GRAPHICS & MEDIA =====
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
        { kind: "block", type: "game_draw_rect" },
        { kind: "block", type: "js_key_pressed" } // You'll need this for WASD
        ]
    },


        // ===== LOGIC & DATA =====
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

        // ===== MARKDOWN =====
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

        // ===== ADVANCED / RAW CODE =====
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

        // ===== EASTER EGG =====
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

// --- 3. UTILITY FUNCTIONS ---

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

    // Save current workspace state
    const state = Blockly.serialization.workspaces.save(workspace);
    project.pages[project.activePage] = state;

    // Switch page
    project.activePage = pageName;
    workspace.clear();

    // Load page data if it exists
    if (project.pages[pageName]) {
        Blockly.serialization.workspaces.load(project.pages[pageName], workspace);
    }

    renderTabs();
    showToast("Switched to " + pageName + ".wbk");
}

function generateFullHtml() {
    let html = "";
    if (workspace) {
        // v12 fix for variable map
        const variables = workspace.getVariableMap().getAllVariables(); 
        workspace.getTopBlocks(true).forEach(b => html += htmlGenerator.blockToCode(b));
    }
    
    // Your exact Watermark logic
    const watermark = `<div style="position:fixed;bottom:10px;right:10px;background:#fff;padding:5px 10px;border:1px solid #000;font-family:sans-serif;font-size:12px;z-index:9999;box-shadow:2px 2px 0 #000;">Made with WebBlocks</div>`;
    return html + watermark;
}

// --- 4. MAIN APP INITIALIZATION ---

function init() {
    workspace = Blockly.inject('blocklyArea', {
        toolbox: toolbox,
        renderer: 'zelos', 
        grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
        trashcan: true,
        zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 }
    });

    if (window.registerWebBlocks) window.registerWebBlocks();
    renderTabs();

    // 1. THE DEBOUNCER (Prevents lag during dragging)
    let renderTimeout;
    workspace.addChangeListener((e) => {
        // Ignore UI events (opening the toolbox, clicking a tab, etc.)
        if (e.isUiEvent) return;

        // Clear the timer every time a block moves
        clearTimeout(renderTimeout);

        // Wait 300ms AFTER the last movement before refreshing
        renderTimeout = setTimeout(() => {
            console.log("Refreshing Preview..."); // Check your console to see it working
            const html = generateFullHtml();
            
            const codeDisplay = document.getElementById('codeArea');
            if (codeDisplay) codeDisplay.innerText = html;
            
            const preview = document.getElementById('previewIframe');
            if (preview) preview.srcdoc = html;
        }, 300); 
    });

    // 2. BUTTON HANDLERS (Same as before)
    document.getElementById("btnSave").onclick = () => {
        const state = Blockly.serialization.workspaces.save(workspace);
        const fileContent = { app: "WebBlocks", version: "1.0", blocks: state };
        const blob = new Blob([JSON.stringify(fileContent, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = project.activePage + ".wbk";
        link.click();
        showToast("Project Saved!");
    };

    document.getElementById("btnLoad").onclick = () => document.getElementById("fileInput").click();

    document.getElementById("fileInput").onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            const blocks = data.app === "WebBlocks" ? data.blocks : data;
            workspace.clear();
            Blockly.serialization.workspaces.load(blocks, workspace);
        };
        reader.readAsText(file);
    };

    document.getElementById("btnAddPage").onclick = () => {
        const newName = prompt("New Page Name?");
        if (newName && !project.pages[newName]) {
            project.pages[newName] = null;
            switchPage(newName);
        }
    };

    document.getElementById("btnExport").onclick = async () => {
        const zip = new JSZip();
        project.pages[project.activePage] = Blockly.serialization.workspaces.save(workspace);
        for (const [name, state] of Object.entries(project.pages)) {
            workspace.clear();
            if (state) Blockly.serialization.workspaces.load(state, workspace);
            zip.file(name + ".html", generateFullHtml());
        }
        Blockly.serialization.workspaces.load(project.pages[project.activePage], workspace);
        const content = await zip.generateAsync({type: "blob"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "webblocks_site.zip";
        link.click();
    };

    window.addEventListener('resize', () => Blockly.svgResize(workspace));
}

// Start Application
window.onload = init;

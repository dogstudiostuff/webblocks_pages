const htmlGenerator = new Blockly.Generator("HTML");
htmlGenerator.ORDER_ATOMIC = 0;

htmlGenerator.scrub_ = (block, code, thisOnly) => {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
        return code + htmlGenerator.blockToCode(nextBlock);
    }
    return code;
};

// Helper: Get text from value input (strip quotes if literal)
function getVal(block, name) {
    // We check both generators just in case
    let code = "";
    try {
        code = htmlGenerator.valueToCode(block, name, htmlGenerator.ORDER_ATOMIC);
        if (!code && Blockly.JavaScript) {
            code = Blockly.JavaScript.valueToCode(block, name, Blockly.JavaScript.ORDER_ATOMIC);
        }
    } catch (e) {
        console.error("Value generation failed for", name, e);
    }

    // Strip quotes if it's a string, or return 0 if empty
    if (!code) return "0";
    if ((code.startsWith("'") && code.endsWith("'")) || (code.startsWith('"') && code.endsWith('"'))) {
        return code.slice(1, -1);
    }
    return code;
}


function wrapJs(block, code) {
    const parent = block.getParent();
    let parentIsJs = false;
    
    // Check if parent is a JS block or a Control block (loops/ifs) or Array Builder
    if (parent) {
        const type = parent.type;
        if (type.startsWith('js_') || type.startsWith('controls_') || type === 'raw_js' || type === 'arr_builder') {
            parentIsJs = true;
        }
    }

    if (parentIsJs) return code + "\n";
    return `<script>\n${code}\n</script>\n`;
}

function esc(s) { return String(s).replace(/"/g, '&quot;'); }

htmlGenerator.statementToCode = (block, name) => {
  let target = block.getInputTargetBlock(name);
  return htmlGenerator.blockToCode(target);
};

// TUFF BLOCKS
htmlGenerator.forBlock['evil_block'] = (b) => `<h1 style="color: red;">Eeeevilllll</h1>\n`;
htmlGenerator.forBlock['hemmy_poop'] = (b) => `<h1 style="color: brown;">Hemmy Poop</h1>\n`;

// --- CUSTOM GENERATORS ---
htmlGenerator.forBlock['raw_html'] = (b) => b.getFieldValue('CODE') + "\n";
htmlGenerator.forBlock['raw_css'] = (b) => `<style>${b.getFieldValue('CODE')}</style>\n`;
htmlGenerator.forBlock['raw_js'] = (b) => `<script>${b.getFieldValue('CODE')}</script>\n`;
htmlGenerator.forBlock['css_raw'] = (b) => `<style>${b.getFieldValue('CODE')}</style>\n`;

// REPORTERS
htmlGenerator.forBlock["text_string"] = (b) => {
    return ["'" + b.getFieldValue("TEXT") + "'", htmlGenerator.ORDER_ATOMIC];
};
htmlGenerator.forBlock["text_join"] = (b) => {
    const a = htmlGenerator.valueToCode(b, "A", htmlGenerator.ORDER_ATOMIC) || "''";
    const b_val = htmlGenerator.valueToCode(b, "B", htmlGenerator.ORDER_ATOMIC) || "''";
    return [a + " + " + b_val, htmlGenerator.ORDER_ATOMIC];
};
htmlGenerator.forBlock["math_num"] = (b) => [b.getFieldValue('NUM'), htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["logic_bool"] = (b) => [b.getFieldValue('BOOL'), htmlGenerator.ORDER_ATOMIC];

// META
htmlGenerator.forBlock['meta_doctype'] = () => `<!DOCTYPE html>\n`;
htmlGenerator.forBlock['meta_head_wrapper'] = (b) => `<head>${htmlGenerator.statementToCode(b,'CONTENT')}</head>`;
htmlGenerator.forBlock['meta_title'] = (b) => {
    const val = getVal(b, 'VAL');
    return `<title>${val}</title>\n`;
};
htmlGenerator.forBlock['meta_charset'] = () => `<meta charset="UTF-8">\n`;
htmlGenerator.forBlock['meta_viewport'] = () => `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
htmlGenerator.forBlock['meta_favicon'] = (b) => {
    const url = getVal(b, 'URL');
    return `<link rel="icon" href="${url}">\n`;
};
htmlGenerator.forBlock['meta_body'] = (b) => `<body>${htmlGenerator.statementToCode(b, 'CONTENT')}</body>\n`;
htmlGenerator.forBlock['meta_html_wrapper'] = (b) => `<html>${htmlGenerator.statementToCode(b, 'CONTENT')}</html>\n`;

// LAYOUT
htmlGenerator.forBlock['layout_div'] = (b) => {
    const id = getVal(b, 'ID');
    const cls = getVal(b, 'CLASS');
    return `<div id="${id}" class="${cls}">${htmlGenerator.statementToCode(b, 'CONTENT')}</div>\n`;
};
htmlGenerator.forBlock['layout_flex'] = (b) => `<div style="display:flex;flex-direction:${b.getFieldValue('DIR')};justify-content:${b.getFieldValue('JUSTIFY')};align-items:${b.getFieldValue('ALIGN')}">${htmlGenerator.statementToCode(b, 'CONTENT')}</div>\n`;
htmlGenerator.forBlock['layout_grid'] = (b) => {
    const cols = getVal(b, 'COLS');
    const gap = getVal(b, 'GAP');
    return `<div style="display:grid;grid-template-columns:${cols};gap:${gap}">${htmlGenerator.statementToCode(b, 'CONTENT')}</div>\n`;
};
htmlGenerator.forBlock["css_style_wrapper"] = (b) => {
    let css = htmlGenerator.valueToCode(b, 'CSS', htmlGenerator.ORDER_ATOMIC) || "";
    if ((css.startsWith("'") && css.endsWith("'")) || (css.startsWith('"') && css.endsWith('"'))) {
        css = css.substring(1, css.length - 1);
    }
    const content = htmlGenerator.statementToCode(b, 'CONTENT');
    return `<div style="${css}">\n${content}</div>\n`;
};

// GRAPHICS
htmlGenerator.forBlock['html_canvas'] = (b) => `<canvas id="${b.getFieldValue('ID')}" width="${b.getFieldValue('W')}" height="${b.getFieldValue('H')}" style="border:1px solid #000"></canvas>\n`;
htmlGenerator.forBlock['js_canvas_draw'] = (b) => `<script>(function(){var c=document.getElementById('${b.getFieldValue('ID')}');var ctx=c.getContext('2d');${htmlGenerator.statementToCode(b, 'DO')}})();</script>\n`;
htmlGenerator.forBlock['js_canvas_rect'] = (b) => `ctx.fillStyle='${b.getFieldValue('C')}';ctx.strokeStyle='${b.getFieldValue('C')}';ctx.${b.getFieldValue('FILL')=='TRUE'?'fillRect':'strokeRect'}(${b.getFieldValue('X')},${b.getFieldValue('Y')},${b.getFieldValue('W')},${b.getFieldValue('H')});\n`;

htmlGenerator.forBlock['html_svg'] = (b) => `<svg width="${b.getFieldValue('W')}" height="${b.getFieldValue('H')}">${htmlGenerator.statementToCode(b, 'CONTENT')}</svg>\n`;
htmlGenerator.forBlock['svg_rect'] = (b) => `<rect x="${b.getFieldValue('X')}" y="${b.getFieldValue('Y')}" width="${b.getFieldValue('W')}" height="${b.getFieldValue('H')}" fill="${b.getFieldValue('C')}" />\n`;
htmlGenerator.forBlock['svg_circle'] = (b) => `<circle cx="${b.getFieldValue('X')}" cy="${b.getFieldValue('Y')}" r="${b.getFieldValue('R')}" fill="${b.getFieldValue('C')}" />\n`;

// AUDIO
htmlGenerator.forBlock['js_audio_play'] = (b) => {
    const url = htmlGenerator.valueToCode(b, 'URL', htmlGenerator.ORDER_ATOMIC) || "''";
    return `<script>new Audio(${url}).play();</script>\n`;
};
htmlGenerator.forBlock['js_audio_synth'] = (b) => `<script>(function(){var a=new (window.AudioContext||window.webkitAudioContext)();var o=a.createOscillator();o.frequency.value=${b.getFieldValue('NOTE')};o.connect(a.destination);o.start();setTimeout(function(){o.stop()},${b.getFieldValue('DUR')});})();</script>\n`;

// APIs
htmlGenerator.forBlock['js_geo_get'] = (b) => {
    const lat = b.getFieldValue('LAT');
    const lng = b.getFieldValue('LNG');
    return `<script>navigator.geolocation.getCurrentPosition(function(pos){var ${lat}=pos.coords.latitude;var ${lng}=pos.coords.longitude;${htmlGenerator.statementToCode(b, 'DO')}});</script>\n`;
};
htmlGenerator.forBlock['js_fetch_json'] = (b) => {
    const dataName = b.getFieldValue('DATA');
    const url = htmlGenerator.valueToCode(b, 'URL', htmlGenerator.ORDER_ATOMIC) || "''";
    return `<script>fetch(${url}).then(r=>r.json()).then(${dataName}=>{${htmlGenerator.statementToCode(b, 'DO')}});</script>\n`;
};

// STORAGE
htmlGenerator.forBlock['js_localstorage_set'] = (b) => {
    const key = htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC) || "''";
    const val = htmlGenerator.valueToCode(b, 'VAL', htmlGenerator.ORDER_ATOMIC) || "''";
    return `<script>localStorage.setItem(${key},${val});</script>\n`;
};
htmlGenerator.forBlock['js_localstorage_get'] = (b) => {
    const key = htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC) || "''";
    return [`localStorage.getItem(${key})`, 0];
};

// FORMS
htmlGenerator.forBlock['html_form_adv'] = (b) => {
    const id = getVal(b, 'ID');
    return `<form id="${id}">${htmlGenerator.statementToCode(b, 'CONTENT')}</form>\n`;
};
htmlGenerator.forBlock['html_input_req'] = (b) => {
    const name = getVal(b, 'NAME');
    return `<input type="${b.getFieldValue('TYPE')}" name="${name}" ${b.getFieldValue('REQ')=='TRUE'?'required':''}><br>\n`;
};
htmlGenerator.forBlock['js_form_submit'] = (b) => {
    const id = getVal(b, 'ID');
    return `<script>document.getElementById('${id}').addEventListener('submit',function(e){e.preventDefault();${htmlGenerator.statementToCode(b, 'DO')}});</script>\n`;
};

// STANDARD
htmlGenerator.forBlock['html_text'] = (b) => {
    const text = getVal(b, 'TEXT');
    return `${text}\n`;
};
htmlGenerator.forBlock['html_h'] = (b) => `<h${b.getFieldValue('LVL')}>${getVal(b, 'TEXT')}</h${b.getFieldValue('LVL')}>\n`;
htmlGenerator.forBlock['html_raw'] = (b) => b.getFieldValue('CODE') + "\n";

// STAGE STUFF
htmlGenerator.forBlock['game_init'] = function(block) {
    const w = block.getFieldValue('W');
    const h = block.getFieldValue('H');
    const col = getVal(block, 'COL') || "#000000";
    
    return `
<canvas id="stage" width="${w}" height="${h}" style="background:${col}; display:block; margin:auto;"></canvas>
<script>
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d');
    
    // Define global vars so they are never "undefined"
    var x = 0; 
    var y = 0;
    
    const keys = {};
    window.addEventListener('keydown', e => { keys[e.key] = true; });
    window.addEventListener('keyup', e => { keys[e.key] = false; });
</script>\n`;
};

htmlGenerator.forBlock['colour_picker'] = function(block) {
  const code = block.getFieldValue('COLOUR');
  // We wrap it in quotes so it's a valid string in JS
  return ["'" + code + "'", htmlGenerator.ORDER_ATOMIC];
};

// 1. Keep your existing HTML generator for the block
htmlGenerator.forBlock['game_draw_rect'] = function(block) {
    const name = block.getFieldValue('NAME');
    const x = getVal(block, 'X') || 0;
    const y = getVal(block, 'Y') || 0;
    const w = getVal(block, 'W') || 50;
    const h = getVal(block, 'H') || 50;
    const col = getVal(block, 'COL') || "#ffffff";
    
    // This is the code that will actually run inside the <script> tags
    return `ctx.fillStyle = "${col}";\nctx.fillRect(${x}, ${y}, ${w}, ${h});\n`;
};

// 2. THE FIX: Register it with the JavaScript generator too
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_draw_rect'] = function(block) {
        // We reuse the exact same logic as the HTML generator
        return htmlGenerator.forBlock['game_draw_rect'](block);
    };
}

// Add the key pressed detector
// 1. Existing HTML Generator (Make sure this exists)
htmlGenerator.forBlock['js_key_pressed'] = function(block) {
    const key = block.getFieldValue('KEY');
    return [`(window.keys && window.keys["${key}"])`, htmlGenerator.ORDER_ATOMIC];
};

// 2. THE FIX: Register with the JavaScript Generator
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['js_key_pressed'] = function(block) {
        const key = block.getFieldValue('KEY');
        // This returns the exact same code so the logic blocks can read it
        return [`(window.keys && window.keys["${key}"])`, Blockly.JavaScript.ORDER_ATOMIC];
    };
}
htmlGenerator.forBlock['game_loop'] = function(block) {
    // This gets all the blocks you snapped inside the loop
    const branch = htmlGenerator.statementToCode(block, 'DO'); 
    
    return `
<script>
    // This function runs 60 times per second
    function gameLoop() {
        if (typeof ctx !== 'undefined') {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the stage
            ${branch} // This is where your 'if key pressed' logic goes
        }
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
</script>\n`;
};


// MARKDOWN
htmlGenerator.forBlock['md_block'] = (b) => {
  let md = b.getFieldValue('MD');
  md = md.replace(/&/g, "&amp;").replace(/<(?!blockquote|strong|em|h1|h2|h3|code|a|hr|br|\/blockquote|\/strong|\/em|\/h1|\/h2|\/h3|\/code|\/a)/g, "&lt;");
  md = md.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  md = md.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  md = md.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  md = md.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  md = md.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  md = md.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  md = md.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  md = md.replace(/\*(.*)\*/gim, '<em>$1</em>');
  md = md.replace(/^>(.*$)/gim, '<blockquote>$1</blockquote>');
  md = md.replace(/`(.*?)`/gim, '<code style="background:#eee;padding:2px 4px;border-radius:3px;font-family:monospace">$1</code>');
  md = md.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>");
  md = md.replace(/^--evilmd(.*$)/gim, '<h1 style="color: red;">$1</h1>');
  return `<div class="markdown-body" style="line-height: 1.6;">\n${md}\n</div>\n`;
};

htmlGenerator.forBlock['md_code_inline'] = (b) => {
    const text = getVal(b, 'TEXT');
    return `<code style="background:#eee;padding:2px 4px;border-radius:3px;font-family:monospace">${text}</code>\n`;
};
htmlGenerator.forBlock["md_code_block"] = (b) => `<pre style="background:#333;color:#fff;padding:10px;border-radius:5px;overflow-x:auto"><code>${b.getFieldValue('CODE')}</code></pre>\n`;
htmlGenerator.forBlock["md_bold"] = (b) => {
    const text = getVal(b, 'TEXT');
    return `<b>${text}</b>\n`;
};
htmlGenerator.forBlock["md_italic"] = (b) => {
    const text = getVal(b, 'TEXT');
    return `<i>${text}</i>\n`;
};
htmlGenerator.forBlock["md_quote"] = (b) => {
    const text = getVal(b, 'TEXT');
    return `<blockquote style="border-left:4px solid #ccc;padding-left:10px;color:#666">${text}</blockquote>\n`;
};
htmlGenerator.forBlock["md_divider"] = () => `<hr>\n`;

// STRUCTURE
htmlGenerator.forBlock["html_html"] = (b) => {
    const lang = getVal(b, 'LANG');
    return `<!DOCTYPE html><html lang="${lang}">${htmlGenerator.statementToCode(b, 'CONTENT')}</html>`;
};
htmlGenerator.forBlock["html_head"] = (b) => `<head><meta charset="UTF-8">${htmlGenerator.statementToCode(b, 'CONTENT')}</head>`;
htmlGenerator.forBlock["html_body"] = (b) => `<body>${htmlGenerator.statementToCode(b, 'CONTENT')}</body>`;
htmlGenerator.forBlock["html_section"] = (b) => `<section>${htmlGenerator.statementToCode(b, 'CONTENT')}</section>\n`;
htmlGenerator.forBlock["html_header"] = (b) => `<header>${htmlGenerator.statementToCode(b, 'CONTENT')}</header>\n`;
htmlGenerator.forBlock["html_footer"] = (b) => `<footer>${htmlGenerator.statementToCode(b, 'CONTENT')}</footer>\n`;
htmlGenerator.forBlock["html_nav"] = (b) => `<nav>${htmlGenerator.statementToCode(b, 'CONTENT')}</nav>\n`;
htmlGenerator.forBlock["html_main"] = (b) => `<main>${htmlGenerator.statementToCode(b, 'CONTENT')}</main>\n`;
htmlGenerator.forBlock["html_article"] = (b) => `<article>${htmlGenerator.statementToCode(b, 'CONTENT')}</article>\n`;
htmlGenerator.forBlock["html_aside"] = (b) => `<aside>${htmlGenerator.statementToCode(b, 'CONTENT')}</aside>\n`;
htmlGenerator.forBlock["html_details"] = (b) => {
    const sum = getVal(b, 'SUM');
    return `<details><summary>${sum}</summary>${htmlGenerator.statementToCode(b, 'CONTENT')}</details>\n`;
};
htmlGenerator.forBlock["html_div"] = (b) => {
    const id = getVal(b, 'ID');
    const cls = getVal(b, 'CLASS');
    return `<div id="${id}" class="${cls}">${htmlGenerator.statementToCode(b, 'CONTENT')}</div>\n`;
};

// TEXT
htmlGenerator.forBlock["html_p"] = (b) => `<p>${getVal(b, 'TEXT')}</p>\n`;
htmlGenerator.forBlock["html_span"] = (b) => `<span>${getVal(b, 'TEXT')}</span>\n`;
htmlGenerator.forBlock["html_a"] = (b) => {
    const href = getVal(b, 'HREF');
    const text = getVal(b, 'TEXT');
    return `<a href="${href}" target="${b.getFieldValue('TARG')}">${text}</a>\n`;
};
htmlGenerator.forBlock["html_br"] = () => `<br>\n`;
htmlGenerator.forBlock["html_hr"] = () => `<hr>\n`;
htmlGenerator.forBlock["html_format"] = (b) => {
    const tag = b.getFieldValue('TAG');
    const text = getVal(b, 'TEXT');
    return `<${tag}>${text}</${tag}>\n`;
};

// LISTS
htmlGenerator.forBlock["html_ul"] = (b) => `<ul>${htmlGenerator.statementToCode(b, 'CONTENT')}</ul>\n`;
htmlGenerator.forBlock["html_ol"] = (b) => `<ol>${htmlGenerator.statementToCode(b, 'CONTENT')}</ol>\n`;
htmlGenerator.forBlock["html_li"] = (b) => {
    const text = getVal(b, 'TEXT');
    return `<li>${text}</li>\n`;
};

// TABLES
htmlGenerator.forBlock["html_table"] = (b) => `<table border="${b.getFieldValue('BORDER')}">${htmlGenerator.statementToCode(b, 'CONTENT')}</table>\n`;
htmlGenerator.forBlock["html_tr"] = (b) => `<tr>${htmlGenerator.statementToCode(b, 'CONTENT')}</tr>\n`;
htmlGenerator.forBlock["html_td"] = (b) => {
    const text = getVal(b, 'TEXT');
    return `<td>${text}</td>\n`;
};
htmlGenerator.forBlock["html_th"] = (b) => {
    const text = getVal(b, 'TEXT');
    return `<th>${text}</th>\n`;
};

// FORMS
htmlGenerator.forBlock["html_form"] = (b) => {
    const act = getVal(b, 'ACT');
    return `<form action="${act}">${htmlGenerator.statementToCode(b, 'CONTENT')}</form>\n`;
};
htmlGenerator.forBlock["html_input"] = (b) => {
    const name = getVal(b, 'NAME');
    const ph = getVal(b, 'PH');
    return `<input type="${b.getFieldValue('TYPE')}" name="${name}" placeholder="${ph}">\n`;
};
htmlGenerator.forBlock["html_button"] = (b) => `<button type="${b.getFieldValue('TYPE')}">${getVal(b, 'TEXT')}</button>\n`;
htmlGenerator.forBlock["html_label"] = (b) => {
    const forVal = getVal(b, 'FOR');
    return `<label for="${forVal}">${getVal(b, 'TEXT')}</label>\n`;
};
htmlGenerator.forBlock["html_textarea"] = (b) => {
    const rows = b.getFieldValue('R');
    const cols = b.getFieldValue('C');
    const name = getVal(b, 'NAME'); // Helper function handles quotes
    const ph = getVal(b, 'PH');     // Helper function handles quotes
    
    return `<textarea rows="${rows}" cols="${cols}" name="${name}" placeholder="${ph}"></textarea>\n`;
};
htmlGenerator.forBlock["html_select"] = (b) => {
    const name = getVal(b, 'NAME');
    return `<select name="${name}">${htmlGenerator.statementToCode(b, 'CONTENT')}</select>\n`;
};
htmlGenerator.forBlock["html_option"] = (b) => {
    const val = getVal(b, 'VAL');
    const text = getVal(b, 'TEXT');
    return `<option value="${val}">${text}</option>\n`;
};

// MEDIA
htmlGenerator.forBlock["html_img"] = (b) => {
    const src = getVal(b, 'SRC');
    const alt = getVal(b, 'ALT');
    const w = getVal(b, 'W');
    return `<img src="${src}" alt="${alt}" width="${w}">\n`;
};
htmlGenerator.forBlock["html_video"] = (b) => {
    const src = getVal(b, 'SRC');
    return `<video src="${src}" ${b.getFieldValue('CTRL')==='TRUE'?'controls':''}></video>\n`;
};
htmlGenerator.forBlock["html_audio"] = (b) => {
    const src = getVal(b, 'SRC');
    return `<audio src="${src}" ${b.getFieldValue('CTRL')==='TRUE'?'controls':''}></audio>\n`;
};
htmlGenerator.forBlock["html_iframe"] = (b) => {
    const src = getVal(b, 'SRC');
    const w = getVal(b, 'W');
    const h = getVal(b, 'H');
    return `<iframe src="${src}" width="${w}" height="${h}"></iframe>\n`;
};

// SCRIPTING
htmlGenerator.forBlock["js_event"] = (b) => {
    const sel = getVal(b, 'SEL');
    const evt = b.getFieldValue('EVT');
    return `<script>document.querySelector('${sel}')?.addEventListener('${evt}',(e)=>{ ${htmlGenerator.statementToCode(b, 'DO')} });</script>\n`;
};
htmlGenerator.forBlock["js_alert"] = (b) => {
    const msg = htmlGenerator.valueToCode(b, 'MSG', htmlGenerator.ORDER_ATOMIC) || "''";
    return `alert(${msg});\n`;
};
htmlGenerator.forBlock["js_console"] = (b) => {
    const msg = htmlGenerator.valueToCode(b, 'MSG', htmlGenerator.ORDER_ATOMIC) || "''";
    return `console.log(${msg});\n`;
};
htmlGenerator.forBlock["js_dom_text"] = (b) => {
    const sel = getVal(b, 'SEL');
    const val = getVal(b, 'VAL');
    return `document.querySelector('${sel}').innerText='${val}';\n`;
};
htmlGenerator.forBlock["js_dom_style"] = (b) => {
    const prop = getVal(b, 'PROP');
    const sel = getVal(b, 'SEL');
    const val = getVal(b, 'VAL');
    return `document.querySelector('${sel}').style['${prop}']='${val}';\n`;
};
htmlGenerator.forBlock["js_clipboard"] = (b) => {
    const text = htmlGenerator.valueToCode(b, "TEXT", htmlGenerator.ORDER_ATOMIC) || "''";
    return `navigator.clipboard.writeText(${text});\n`;
};
htmlGenerator.forBlock["js_mouse_clicked"] = (b) => ["false", htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["js_mouse_down"] = (b) => ["false", htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["js_throw_error"] = (b) => {
    const msg = htmlGenerator.valueToCode(b, "MSG", htmlGenerator.ORDER_ATOMIC) || "'Error'";
    return `throw new Error(${msg});\n`;
};
htmlGenerator.forBlock["html_button_js"] = (b) => {
    const text = getVal(b, 'TEXT');
    let jsCode = htmlGenerator.statementToCode(b, 'DO');
    jsCode = jsCode.replace(/<script>/g, '').replace(/<\/script>/g, '').trim().replace(/"/g, '&quot;');
    return `<button onclick="${jsCode}">${text}</button>\n`;
};

// --- EASY STYLING ---
htmlGenerator.forBlock["html_styled_div"] = (b) => {
    const styles = htmlGenerator.statementToCode(b, 'STYLES').replace(/\n/g, ' ').trim();
    const content = htmlGenerator.statementToCode(b, 'CONTENT');
    return `<div style="${styles}">\n${content}</div>\n`;
};

htmlGenerator.forBlock["css_prop_text"] = (b) => 
    `color:${b.getFieldValue('COLOR')};font-size:${b.getFieldValue('SIZE')}px;text-align:${b.getFieldValue('ALIGN')};font-weight:${b.getFieldValue('WEIGHT')};`;
htmlGenerator.forBlock["css_prop_background"] = (b) => 
    `background-color:${b.getFieldValue('COLOR')};`;
htmlGenerator.forBlock["css_prop_border"] = (b) => 
    `border:${b.getFieldValue('WIDTH')}px ${b.getFieldValue('STYLE')} ${b.getFieldValue('COLOR')};border-radius:${b.getFieldValue('RADIUS')}px;`;
htmlGenerator.forBlock["css_prop_size"] = (b) => 
    `width:${b.getFieldValue('W')};height:${b.getFieldValue('H')};`;
htmlGenerator.forBlock["css_prop_margin_padding"] = (b) => 
    `margin:${b.getFieldValue('MARGIN')}px;padding:${b.getFieldValue('PADDING')}px;`;
htmlGenerator.forBlock["css_prop_flex_layout"] = (b) => 
    `display:flex;flex-direction:${b.getFieldValue('DIR')};align-items:${b.getFieldValue('ALIGN')};justify-content:${b.getFieldValue('JUSTIFY')};`;

// CSS HELPERS
htmlGenerator.forBlock['css_id_class'] = (b) => {
    const id = getVal(b, 'ID');
    const cls = getVal(b, 'CLASS');
    return `<style>${id?'.'+id:''} { ${cls} }</style>\n`;
};
htmlGenerator.forBlock['css_inline_style'] = (b) => {
    const prop = getVal(b, 'PROP');
    const val = getVal(b, 'VAL');
    return `style="${prop}:${val}"`;
};

// REPORTERS
htmlGenerator.forBlock["js_get_form_data"] = (b) => {
    const id = htmlGenerator.valueToCode(b, 'ID', htmlGenerator.ORDER_ATOMIC) || "''";
    return [`Object.fromEntries(new FormData(document.getElementById(${id})))`, htmlGenerator.ORDER_ATOMIC];
};
htmlGenerator.forBlock["js_get_url_param"] = (b) => {
    const key = htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC) || "''";
    return [`new URLSearchParams(window.location.search).get(${key})`, htmlGenerator.ORDER_ATOMIC];
};
htmlGenerator.forBlock["js_get_time"] = () => [`new Date().toLocaleTimeString()`, htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["js_get_date"] = () => [`new Date().toLocaleDateString()`, htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["js_get_screen_width"] = () => [`window.innerWidth`, htmlGenerator.ORDER_ATOMIC];

// more ui blocks
htmlGenerator.forBlock["ui_page_wrapper"] = (b) => {
    const theme = b.getFieldValue('THEME');
    const bg = theme === 'dark' ? '#0f0f11' : '#ffffff';
    const text = theme === 'dark' ? '#ffffff' : '#000000';
    const content = htmlGenerator.statementToCode(b, 'CONTENT');
    return `
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: ${bg}; color: ${text}; }
        * { box-sizing: border-box; }
    </style>
    ${content}
    `;
};

htmlGenerator.forBlock["ui_navbar_simple"] = (b) => {
    const links = htmlGenerator.statementToCode(b, 'LINKS');
    return `
    <nav style="display:flex;justify-content:space-between;align-items:center;padding:20px 40px;border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="font-weight:900;font-size:20px;letter-spacing:-1px;">${b.getFieldValue('LOGO')}</div>
        <div style="display:flex;gap:20px;">${links}</div>
    </nav>
    `;
};

htmlGenerator.forBlock["ui_nav_link"] = (b) => {
    return `<a href="${b.getFieldValue('URL')}" style="text-decoration:none;color:inherit;opacity:0.8;font-weight:500;font-size:14px;">${b.getFieldValue('TEXT')}</a>`;
};

htmlGenerator.forBlock["ui_hero_section"] = (b) => {
    const title = htmlGenerator.valueToCode(b, 'TITLE', htmlGenerator.ORDER_ATOMIC) || "'Title'";
    const sub = htmlGenerator.valueToCode(b, 'SUB', htmlGenerator.ORDER_ATOMIC) || "'Subtitle'";
    const btnText = b.getFieldValue('BTN_TEXT');
    // JS Logic for button
    let jsCode = htmlGenerator.statementToCode(b, 'DO');
    jsCode = jsCode.replace(/<script>/g, '').replace(/<\/script>/g, '').trim().replace(/"/g, '&quot;');

    return `
    <section style="text-align:center;padding:100px 20px;max-width:800px;margin:0 auto;">
        <h1 style="font-size:60px;font-weight:800;margin-bottom:20px;letter-spacing:-2px;background:linear-gradient(to right, #fff, #888);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
            \${${title}}
        </h1>
        <p style="font-size:20px;opacity:0.7;line-height:1.6;margin-bottom:40px;">
            \${${sub}}
        </p>
        <button onclick="${jsCode}" style="padding:15px 30px;background:#fff;color:#000;border:none;border-radius:50px;font-weight:bold;font-size:16px;cursor:pointer;transition:transform 0.2s;">
            ${btnText}
        </button>
    </section>
    `;
};

htmlGenerator.forBlock["ui_feature_grid"] = (b) => {
    const content = htmlGenerator.statementToCode(b, 'CONTENT');
    return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:20px;padding:40px;max-width:1200px;margin:0 auto;">
        ${content}
    </div>
    `;
};

htmlGenerator.forBlock["ui_feature_card"] = (b) => {
    const title = htmlGenerator.valueToCode(b, 'TITLE', htmlGenerator.ORDER_ATOMIC) || "'Feature'";
    const text = htmlGenerator.valueToCode(b, 'TEXT', htmlGenerator.ORDER_ATOMIC) || "'Description'";
    return `
    <div style="padding:30px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
        <div style="font-size:24px;margin-bottom:15px;">✨</div>
        <h3 style="margin:0 0 10px 0;font-size:18px;">${title}</h3>
        <p style="margin:0;opacity:0.6;font-size:14px;line-height:1.5;">${text}</p>
    </div>
    `;
};

htmlGenerator.forBlock["ui_pricing_card"] = (b) => {
    const plan = htmlGenerator.valueToCode(b, 'Tb_PLAN', htmlGenerator.ORDER_ATOMIC) || "'Basic'";
    const price = htmlGenerator.valueToCode(b, 'Tb_PRICE', htmlGenerator.ORDER_ATOMIC) || "'$10'";
    const btnText = htmlGenerator.valueToCode(b, 'Tb_BTN', htmlGenerator.ORDER_ATOMIC) || "'Buy Now'";
    const features = htmlGenerator.statementToCode(b, 'Kb_KX');

    return `
    <div style="border:1px solid #ddd; border-radius:12px; padding:30px; text-align:center; background:#fff; color:#333; box-shadow:0 4px 6px rgba(0,0,0,0.1); max-width:300px; margin:10px;">
        <h3 style="margin:0; font-size:1.2rem; opacity:0.7;">${plan.replace(/'/g, "")}</h3>
        <div style="font-size:3rem; font-weight:800; margin:10px 0;">${price.replace(/'/g, "")}</div>
        <ul style="list-style:none; padding:0; margin:20px 0; text-align:left; line-height:1.8;">
            ${features}
        </ul>
        <button style="width:100%; padding:12px; background:#000; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">
            ${btnText.replace(/'/g, "")}
        </button>
    </div>
    `;
};

// generators.js
htmlGenerator.forBlock['meta_tailwind_cdn'] = function(block) {
  return '<script src="https://cdn.tailwindcss.com"></script>\n';
};


htmlGenerator.forBlock['ui_tailwind_box'] = function(block) {
    var classes = htmlGenerator.valueToCode(block, 'CLASSES', htmlGenerator.ORDER_ATOMIC) || "''";
    var content = htmlGenerator.statementToCode(block, 'CONTENT');
    
    // Clean up quotes from the input
    classes = classes.replace(/^'(.*)'$/, '$1');

    return `<div class="${classes}">\n${content}\n</div>\n`;
};

htmlGenerator.forBlock['ui_page_link'] = function(block) {
    const page = block.getFieldValue('PAGE');
    const text = htmlGenerator.valueToCode(block, 'TEXT', htmlGenerator.ORDER_ATOMIC) || "'Link'";
    const cleanText = text.replace(/'/g, "");
    
    // When exported, index.wbk becomes index.html
    return `<a href="${page}.html" class="nav-link">${cleanText}</a>`;
};

// --- ARRAYS ---
htmlGenerator.forBlock["arr_new_empty"] = () => ["[]", htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["arr_new_length"] = (b) => [`new Array(${htmlGenerator.valueToCode(b, 'LEN', 0) || 0})`, 0];
htmlGenerator.forBlock["arr_parse"] = (b) => [`JSON.parse(${htmlGenerator.valueToCode(b, 'TXT', 0) || '[]'})`, 0];
htmlGenerator.forBlock["arr_split"] = (b) => [`(${htmlGenerator.valueToCode(b, 'TXT', 0) || "''"}).split(${htmlGenerator.valueToCode(b, 'DELIM', 0) || "''"})`, 0];

htmlGenerator.forBlock["arr_builder"] = (b) => {
    // This wraps the internal statements in an IIFE to return the built array
    const code = htmlGenerator.statementToCode(b, 'DO');
    return [`(function(){ var _arr = []; ${code} return _arr; })()`, htmlGenerator.ORDER_ATOMIC];
};
htmlGenerator.forBlock["arr_builder_add"] = (b) => `_arr.push(${htmlGenerator.valueToCode(b, 'ITEM', 0)});`;
htmlGenerator.forBlock["arr_builder_set"] = (b) => `_arr = ${htmlGenerator.valueToCode(b, 'ARR', 0)};`;

htmlGenerator.forBlock["arr_get"] = (b) => [`${htmlGenerator.valueToCode(b, 'ARR', 0)}[${htmlGenerator.valueToCode(b, 'IDX', 0)}]`, 0];
htmlGenerator.forBlock["arr_slice"] = (b) => [`${htmlGenerator.valueToCode(b, 'ARR', 0)}.slice(${htmlGenerator.valueToCode(b, 'START', 0)}, ${htmlGenerator.valueToCode(b, 'END', 0)})`, 0];
htmlGenerator.forBlock["arr_indexof"] = (b) => [`${htmlGenerator.valueToCode(b, 'ARR', 0)}.indexOf(${htmlGenerator.valueToCode(b, 'ITEM', 0)})`, 0];
htmlGenerator.forBlock["arr_includes"] = (b) => [`${htmlGenerator.valueToCode(b, 'ARR', 0)}.includes(${htmlGenerator.valueToCode(b, 'ITEM', 0)})`, 0];
htmlGenerator.forBlock["arr_length"] = (b) => [`${htmlGenerator.valueToCode(b, 'ARR', 0)}.length`, 0];

htmlGenerator.forBlock["arr_set_idx"] = (b) => wrapJs(b, `${htmlGenerator.valueToCode(b, 'ARR', 0)}[${htmlGenerator.valueToCode(b, 'IDX', 0)}] = ${htmlGenerator.valueToCode(b, 'VAL', 0)};`);
htmlGenerator.forBlock["arr_push"] = (b) => wrapJs(b, `${htmlGenerator.valueToCode(b, 'ARR', 0)}.push(${htmlGenerator.valueToCode(b, 'VAL', 0)});`);
htmlGenerator.forBlock["arr_concat"] = (b) => [`${htmlGenerator.valueToCode(b, 'A', 0)}.concat(${htmlGenerator.valueToCode(b, 'B', 0)})`, 0];
htmlGenerator.forBlock["arr_reverse"] = (b) => [`[...${htmlGenerator.valueToCode(b, 'ARR', 0)}].reverse()`, 0];
htmlGenerator.forBlock["arr_join"] = (b) => [`${htmlGenerator.valueToCode(b, 'ARR', 0)}.join(${htmlGenerator.valueToCode(b, 'DELIM', 0)})`, 0];

// tuff json tools

// --- OBJECTS ---
htmlGenerator.forBlock["obj_new"] = () => ["{}", htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["obj_parse"] = (b) => [`JSON.parse(${htmlGenerator.valueToCode(b, 'TXT', htmlGenerator.ORDER_ATOMIC) || "'{}'"})`, htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["obj_from_entries"] = (b) => [`Object.fromEntries(${htmlGenerator.valueToCode(b, 'ENTRIES', htmlGenerator.ORDER_ATOMIC) || "[]"})`, htmlGenerator.ORDER_ATOMIC];

htmlGenerator.forBlock["obj_builder"] = (b) => {
    const code = htmlGenerator.statementToCode(b, 'DO');
    return [`(function(){ var _obj = {}; ${code} return _obj; })()`, htmlGenerator.ORDER_ATOMIC];
};
htmlGenerator.forBlock["obj_builder_add"] = (b) => `_obj[${htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC)}] = ${htmlGenerator.valueToCode(b, 'VAL', htmlGenerator.ORDER_ATOMIC)};\n`;
htmlGenerator.forBlock["obj_builder_set"] = (b) => `_obj = ${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC) || '{}'};\n`;

htmlGenerator.forBlock["obj_get"] = (b) => [`${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC)}[${htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC)}]`, htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["obj_has"] = (b) => [`${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC)}.hasOwnProperty(${htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC)})`, htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["obj_keys"] = (b) => [`Object.keys(${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC)})`, htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["obj_values"] = (b) => [`Object.values(${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC)})`, htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["obj_entries"] = (b) => [`Object.entries(${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC)})`, htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["obj_stringify"] = (b) => [`JSON.stringify(${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC)})`, htmlGenerator.ORDER_ATOMIC];

htmlGenerator.forBlock["obj_set"] = (b) => wrapJs(b, `${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC)}[${htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC)}] = ${htmlGenerator.valueToCode(b, 'VAL', htmlGenerator.ORDER_ATOMIC)};`);
htmlGenerator.forBlock["obj_delete"] = (b) => wrapJs(b, `delete ${htmlGenerator.valueToCode(b, 'OBJ', htmlGenerator.ORDER_ATOMIC)}[${htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC)}];`);
htmlGenerator.forBlock["obj_merge"] = (b) => wrapJs(b, `Object.assign(${htmlGenerator.valueToCode(b, 'DEST', htmlGenerator.ORDER_ATOMIC)}, ${htmlGenerator.valueToCode(b, 'SRC', htmlGenerator.ORDER_ATOMIC)});`);

// --- JAVASCRIPT GENERATORS FOR CUSTOM OBJECT BLOCKS ---
Blockly.JavaScript.forBlock = Blockly.JavaScript.forBlock || {};
Blockly.JavaScript.forBlock["obj_new"] = () => ["{}", Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.forBlock["obj_parse"] = (b) => [`JSON.parse(${Blockly.JavaScript.valueToCode(b, 'TXT', Blockly.JavaScript.ORDER_ATOMIC) || '{}'})`, Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.forBlock["obj_from_entries"] = (b) => [`Object.fromEntries(${Blockly.JavaScript.valueToCode(b, 'ENTRIES', Blockly.JavaScript.ORDER_ATOMIC) || '[]'})`, Blockly.JavaScript.ORDER_ATOMIC];

Blockly.JavaScript.forBlock["obj_builder"] = (b) => {
    const code = Blockly.JavaScript.statementToCode(b, 'DO');
    return [`(function(){ var _obj = {}; ${code} return _obj; })()`, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.forBlock["obj_builder_add"] = (b) => `_obj[${Blockly.JavaScript.valueToCode(b, 'KEY', Blockly.JavaScript.ORDER_ATOMIC)}] = ${Blockly.JavaScript.valueToCode(b, 'VAL', Blockly.JavaScript.ORDER_ATOMIC)};\n`;
Blockly.JavaScript.forBlock["obj_builder_set"] = (b) => `_obj = ${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC) || '{}'};\n`;

Blockly.JavaScript.forBlock["obj_get"] = (b) => [`${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC)}[${Blockly.JavaScript.valueToCode(b, 'KEY', Blockly.JavaScript.ORDER_ATOMIC)}]`, Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.forBlock["obj_has"] = (b) => [`${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC)}.hasOwnProperty(${Blockly.JavaScript.valueToCode(b, 'KEY', Blockly.JavaScript.ORDER_ATOMIC)})`, Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.forBlock["obj_keys"] = (b) => [`Object.keys(${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC)})`, Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.forBlock["obj_values"] = (b) => [`Object.values(${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC)})`, Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.forBlock["obj_entries"] = (b) => [`Object.entries(${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC)})`, Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.forBlock["obj_stringify"] = (b) => [`JSON.stringify(${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC)})`, Blockly.JavaScript.ORDER_ATOMIC];

Blockly.JavaScript.forBlock["obj_set"] = (b) => `${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC)}[${Blockly.JavaScript.valueToCode(b, 'KEY', Blockly.JavaScript.ORDER_ATOMIC)}] = ${Blockly.JavaScript.valueToCode(b, 'VAL', Blockly.JavaScript.ORDER_ATOMIC)};`;
Blockly.JavaScript.forBlock["obj_delete"] = (b) => `delete ${Blockly.JavaScript.valueToCode(b, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC)}[${Blockly.JavaScript.valueToCode(b, 'KEY', Blockly.JavaScript.ORDER_ATOMIC)}];`;
Blockly.JavaScript.forBlock["obj_merge"] = (b) => `Object.assign(${Blockly.JavaScript.valueToCode(b, 'DEST', Blockly.JavaScript.ORDER_ATOMIC)}, ${Blockly.JavaScript.valueToCode(b, 'SRC', Blockly.JavaScript.ORDER_ATOMIC)});`;
htmlGenerator.forBlock['math_number'] = function(block) {
  const code = String(block.getFieldValue('NUM'));
  return [code, htmlGenerator.ORDER_ATOMIC];
};

// 1. Tell your HTML generator how to handle it
htmlGenerator.forBlock['colour_picker'] = function(block) {
  const code = block.getFieldValue('COLOUR');
  // Return as a quoted string so it works in CSS/Canvas styles
  return ["'" + code + "'", htmlGenerator.ORDER_ATOMIC];
};

// 2. Tell the internal JavaScript generator how to handle it 
// (This prevents the 'JavaScript generator does not know how to generate' error)
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['colour_picker'] = function(block) {
        const code = block.getFieldValue('COLOUR');
        return ["'" + code + "'", Blockly.JavaScript.ORDER_ATOMIC];
    };
}

// --- BRIDGE TO STANDARD BLOCKLY JS GENERATOR ---
const standardBlocks = [
    'controls_if', 'controls_repeat_ext', 'controls_whileUntil', 'controls_for', 'controls_forEach', 'controls_flow_statements',
    'logic_compare', 'logic_operation', 'logic_negate', 'logic_boolean', 'logic_null', 'logic_ternary',
     'math_arithmetic', 'math_single', 'math_trig', 'math_constant', 'math_number_property', 'math_round', 'math_on_list', 'math_modulo', 'math_constrain', 'math_random_int', 'math_random_float',
    'text', 'text_join', 'text_append', 'text_length', 'text_isEmpty', 'text_indexOf', 'text_charAt', 'text_getSubstring', 'text_changeCase', 'text_trim', 'text_print', 'text_prompt_ext',
    'lists_create_with', 'lists_repeat', 'lists_length', 'lists_isEmpty', 'lists_indexOf', 'lists_getIndex', 'lists_setIndex', 'lists_getSublist', 'lists_split', 'lists_sort', 'colour_random', 'colour_rgb', 'colour_blend',
    'variables_get', 'variables_set',
    'procedures_defreturn', 'procedures_defnoreturn', 'procedures_callreturn', 'procedures_callnoreturn', 'procedures_ifreturn'
];

standardBlocks.forEach(type => {
    htmlGenerator.forBlock[type] = function(block) {
        const jsGen = Blockly.JavaScript || window.Blockly.JavaScript;
        if (!jsGen) return "";
        if(!jsGen.nameDB_) jsGen.init(block.workspace);
        return jsGen.blockToCode(block);
    };


htmlGenerator.forBlock['math_change'] = function(block) {
    // Get the variable name and the amount to change it by
    const argument0 = htmlGenerator.valueToCode(block, 'DELTA', htmlGenerator.ORDER_ADDITION) || '0';
    const varName = block.getFieldValue('VAR');
    
    // Returns the actual JS code to increment the variable
    return varName + ' = (typeof ' + varName + ' === "number" ? ' + varName + ' : 0) + ' + argument0 + ';\n';
};

    const standardBlocks = [
    'math_number', 
    'math_change', 
    'variables_set', 
    'variables_get', 
    'logic_boolean', 
    'controls_if'
];

// A stronger bridge for internal variable and math blocks
const bridgeBlock = (name) => {
    htmlGenerator.forBlock[name] = function(block) {
        // We MUST use Blockly.JavaScript specifically here 
        // to avoid the 'Cannot read properties of undefined' error
        return Blockly.JavaScript.forBlock[name].call(Blockly.JavaScript, block);
    };
};

// List every standard block type you are using in your workspace
['variables_get', 'variables_set', 'math_change', 'math_number', 'logic_boolean', 'controls_if'].forEach(bridgeBlock);
});


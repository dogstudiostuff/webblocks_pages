const htmlGenerator = new Blockly.Generator("HTML");
htmlGenerator.ORDER_ATOMIC = 0;

htmlGenerator.scrub_ = (block, code, thisOnly) => {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
        return code + htmlGenerator.blockToCode(nextBlock);
    }
    return code;
};

function getVal(block, name) {
    let code = "";
    try {
        code = htmlGenerator.valueToCode(block, name, htmlGenerator.ORDER_ATOMIC);
        if (!code && Blockly.JavaScript) {
            code = Blockly.JavaScript.valueToCode(block, name, Blockly.JavaScript.ORDER_ATOMIC);
        }
    } catch (e) {
        console.error("Value generation failed for", name, e);
    }

    if (!code) return "0";
    if ((code.startsWith("'") && code.endsWith("'")) || (code.startsWith('"') && code.endsWith('"'))) {
        return code.slice(1, -1);
    }
    return code;
}


function wrapJs(block, code) {
    const parent = block.getParent();
    let parentIsJs = false;
    
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

htmlGenerator.forBlock['raw_html'] = (b) => b.getFieldValue('CODE') + "\n";
htmlGenerator.forBlock['raw_css'] = (b) => `<style>${b.getFieldValue('CODE')}</style>\n`;
htmlGenerator.forBlock['raw_js'] = (b) => `<script>${b.getFieldValue('CODE')}</script>\n`;
htmlGenerator.forBlock['css_raw'] = (b) => `<style>${b.getFieldValue('CODE')}</style>\n`;

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

htmlGenerator.forBlock['html_canvas'] = (b) => `<canvas id="${b.getFieldValue('ID')}" width="${b.getFieldValue('W')}" height="${b.getFieldValue('H')}" style="border:1px solid #000"></canvas>\n`;
htmlGenerator.forBlock['js_canvas_draw'] = (b) => `<script>(function(){var c=document.getElementById('${b.getFieldValue('ID')}');var ctx=c.getContext('2d');${htmlGenerator.statementToCode(b, 'DO')}})();</script>\n`;
htmlGenerator.forBlock['js_canvas_rect'] = (b) => `ctx.fillStyle='${b.getFieldValue('C')}';ctx.strokeStyle='${b.getFieldValue('C')}';ctx.${b.getFieldValue('FILL')=='TRUE'?'fillRect':'strokeRect'}(${b.getFieldValue('X')},${b.getFieldValue('Y')},${b.getFieldValue('W')},${b.getFieldValue('H')});\n`;

htmlGenerator.forBlock['html_svg'] = (b) => `<svg width="${b.getFieldValue('W')}" height="${b.getFieldValue('H')}">${htmlGenerator.statementToCode(b, 'CONTENT')}</svg>\n`;
htmlGenerator.forBlock['svg_rect'] = (b) => `<rect x="${b.getFieldValue('X')}" y="${b.getFieldValue('Y')}" width="${b.getFieldValue('W')}" height="${b.getFieldValue('H')}" fill="${b.getFieldValue('C')}" />\n`;
htmlGenerator.forBlock['svg_circle'] = (b) => `<circle cx="${b.getFieldValue('X')}" cy="${b.getFieldValue('Y')}" r="${b.getFieldValue('R')}" fill="${b.getFieldValue('C')}" />\n`;

htmlGenerator.forBlock['js_audio_play'] = (b) => {
    const url = htmlGenerator.valueToCode(b, 'URL', htmlGenerator.ORDER_ATOMIC) || "''";
    return `<script>new Audio(${url}).play();</script>\n`;
};
htmlGenerator.forBlock['js_audio_synth'] = (b) => `<script>(function(){var a=new (window.AudioContext||window.webkitAudioContext)();var o=a.createOscillator();o.frequency.value=${b.getFieldValue('NOTE')};o.connect(a.destination);o.start();setTimeout(function(){o.stop()},${b.getFieldValue('DUR')});})();</script>\n`;

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

htmlGenerator.forBlock['js_localstorage_set'] = (b) => {
    const key = htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC) || "''";
    const val = htmlGenerator.valueToCode(b, 'VAL', htmlGenerator.ORDER_ATOMIC) || "''";
    return `<script>localStorage.setItem(${key},${val});</script>\n`;
};
htmlGenerator.forBlock['js_localstorage_get'] = (b) => {
    const key = htmlGenerator.valueToCode(b, 'KEY', htmlGenerator.ORDER_ATOMIC) || "''";
    return [`localStorage.getItem(${key})`, 0];
};

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

htmlGenerator.forBlock['html_text'] = (b) => {
    const text = getVal(b, 'TEXT');
    return `${text}\n`;
};
htmlGenerator.forBlock['html_h'] = (b) => `<h${b.getFieldValue('LVL')}>${getVal(b, 'TEXT')}</h${b.getFieldValue('LVL')}>\n`;
htmlGenerator.forBlock['html_raw'] = (b) => b.getFieldValue('CODE') + "\n";

htmlGenerator.forBlock['game_init'] = function(block) {
    const w = block.getFieldValue('W');
    const h = block.getFieldValue('H');
    const col = getVal(block, 'COL') || "#000000";
    
    return `
<canvas id="stage" width="${w}" height="${h}" style="background:${col}; display:block; margin:auto;"></canvas>
<script>
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d');
    
    window.gameVars = window.gameVars || {};
    
    window.sprites = window.sprites || {};
    
    window.keys = window.keys || {};
    window.addEventListener('keydown', e => { window.keys[e.key] = true; e.preventDefault(); });
    window.addEventListener('keyup', e => { window.keys[e.key] = false; });
    
    window.mouseX = 0;
    window.mouseY = 0;
    window.mouseDown = false;
    window.mouseClicked = false;
    window._mouseJustClicked = false;
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        window.mouseX = e.clientX - rect.left;
        window.mouseY = e.clientY - rect.top;
    });
    canvas.addEventListener('mousedown', e => { window.mouseDown = true; window._mouseJustClicked = true; });
    canvas.addEventListener('mouseup', e => { window.mouseDown = false; });
    
    window.gameStartTime = Date.now();
    
    window.gameImages = window.gameImages || {};
</script>\n`;
};

htmlGenerator.forBlock['colour_picker'] = function(block) {
  const code = block.getFieldValue('COLOUR');
  return ["'" + code + "'", htmlGenerator.ORDER_ATOMIC];
};

htmlGenerator.forBlock['game_move_sprite'] = function(block) {
    const name = block.getFieldValue('NAME');
    const dx = htmlGenerator.valueToCode(block, 'X', htmlGenerator.ORDER_ATOMIC) || '0';
    const dy = htmlGenerator.valueToCode(block, 'Y', htmlGenerator.ORDER_ATOMIC) || '0';
    return `if(window.sprites['${name}']){window.sprites['${name}'].x+=${dx};window.sprites['${name}'].y+=${dy};}
`;
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_move_sprite'] = function(block) {
        return htmlGenerator.forBlock['game_move_sprite'](block);
    };
}

htmlGenerator.forBlock['game_draw_rect'] = function(block) {
    const name = block.getFieldValue('NAME');
    const x = htmlGenerator.valueToCode(block, 'X', htmlGenerator.ORDER_ATOMIC) || '0';
    const y = htmlGenerator.valueToCode(block, 'Y', htmlGenerator.ORDER_ATOMIC) || '0';
    const w = htmlGenerator.valueToCode(block, 'W', htmlGenerator.ORDER_ATOMIC) || '50';
    const h = htmlGenerator.valueToCode(block, 'H', htmlGenerator.ORDER_ATOMIC) || '50';
    const col = htmlGenerator.valueToCode(block, 'COL', htmlGenerator.ORDER_ATOMIC) || "'#ffffff'";
    
    return `(function(){
  var _n='${name}',_x=${x},_y=${y},_w=${w},_h=${h},_c=${col};
  if(!window.sprites[_n])window.sprites[_n]={x:_x,y:_y,w:_w,h:_h,col:_c};
  var s=window.sprites[_n]; s.w=_w; s.h=_h; s.col=_c;
  ctx.fillStyle=s.col; ctx.fillRect(s.x,s.y,s.w,s.h);
})();
`;
};

if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_draw_rect'] = function(block) {
        return htmlGenerator.forBlock['game_draw_rect'](block);
    };
}

htmlGenerator.forBlock['js_key_pressed'] = function(block) {
    const key = block.getFieldValue('KEY');
    return [`(window.keys && window.keys["${key}"])`, htmlGenerator.ORDER_ATOMIC];
};

if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['js_key_pressed'] = function(block) {
        const key = block.getFieldValue('KEY');
        return [`(window.keys && window.keys["${key}"])`, Blockly.JavaScript.ORDER_ATOMIC];
    };
}
htmlGenerator.forBlock['game_loop'] = function(block) {
    let branch = htmlGenerator.statementToCode(block, 'DO');
    branch = branch.replace(/<\/?script>/g, '').trim();
    
    return `
<script>
    function gameLoop() {
        if (typeof ctx !== 'undefined') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            window.mouseClicked = window._mouseJustClicked;
            window._mouseJustClicked = false;
            ${branch}
        }
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
</script>\n`;
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_loop'] = function(block) {
        return htmlGenerator.forBlock['game_loop'](block);
    };
}

htmlGenerator.forBlock['game_draw_circle'] = function(block) {
    const name = block.getFieldValue('NAME');
    const x = htmlGenerator.valueToCode(block, 'X', htmlGenerator.ORDER_ATOMIC) || '0';
    const y = htmlGenerator.valueToCode(block, 'Y', htmlGenerator.ORDER_ATOMIC) || '0';
    const r = htmlGenerator.valueToCode(block, 'R', htmlGenerator.ORDER_ATOMIC) || '25';
    const col = htmlGenerator.valueToCode(block, 'COL', htmlGenerator.ORDER_ATOMIC) || "'#ffffff'";
    return `(function(){
  var _n='${name}',_x=${x},_y=${y},_r=${r},_c=${col};
  if(!window.sprites[_n])window.sprites[_n]={x:_x,y:_y,w:_r*2,h:_r*2,r:_r,col:_c,shape:'circle'};
  var s=window.sprites[_n]; s.r=_r; s.col=_c;
  ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
  ctx.fillStyle=s.col; ctx.fill(); ctx.closePath();
})();
`;
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_draw_circle'] = function(block) {
        return htmlGenerator.forBlock['game_draw_circle'](block);
    };
}

htmlGenerator.forBlock['game_draw_text'] = function(block) {
    const text = htmlGenerator.valueToCode(block, 'TEXT', htmlGenerator.ORDER_ATOMIC) || "''";
    const x = htmlGenerator.valueToCode(block, 'X', htmlGenerator.ORDER_ATOMIC) || '0';
    const y = htmlGenerator.valueToCode(block, 'Y', htmlGenerator.ORDER_ATOMIC) || '0';
    const size = block.getFieldValue('SIZE');
    const col = htmlGenerator.valueToCode(block, 'COL', htmlGenerator.ORDER_ATOMIC) || "'#ffffff'";
    return `ctx.fillStyle=${col}; ctx.font='${size}px sans-serif'; ctx.fillText(${text},${x},${y});\n`;
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_draw_text'] = function(block) {
        return htmlGenerator.forBlock['game_draw_text'](block);
    };
}

htmlGenerator.forBlock['game_draw_line'] = function(block) {
    const x1 = block.getFieldValue('X1');
    const y1 = block.getFieldValue('Y1');
    const x2 = block.getFieldValue('X2');
    const y2 = block.getFieldValue('Y2');
    const col = block.getFieldValue('COL');
    const width = block.getFieldValue('WIDTH');
    return `ctx.beginPath();ctx.moveTo(${x1},${y1});ctx.lineTo(${x2},${y2});ctx.strokeStyle='${col}';ctx.lineWidth=${width};ctx.stroke();ctx.closePath();\n`;
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_draw_line'] = function(block) {
        return htmlGenerator.forBlock['game_draw_line'](block);
    };
}

htmlGenerator.forBlock['game_draw_image'] = function(block) {
    const url = htmlGenerator.valueToCode(block, 'URL', htmlGenerator.ORDER_ATOMIC) || "''";
    const x = htmlGenerator.valueToCode(block, 'X', htmlGenerator.ORDER_ATOMIC) || '0';
    const y = htmlGenerator.valueToCode(block, 'Y', htmlGenerator.ORDER_ATOMIC) || '0';
    const w = htmlGenerator.valueToCode(block, 'W', htmlGenerator.ORDER_ATOMIC) || '64';
    const h = htmlGenerator.valueToCode(block, 'H', htmlGenerator.ORDER_ATOMIC) || '64';
    return `(function(){
  var _u=${url};
  if(!window.gameImages[_u]){var _i=new Image();_i.src=_u;window.gameImages[_u]=_i;}
  var _img=window.gameImages[_u];
  if(_img.complete)ctx.drawImage(_img,${x},${y},${w},${h});
})();
`;
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_draw_image'] = function(block) {
        return htmlGenerator.forBlock['game_draw_image'](block);
    };
}

htmlGenerator.forBlock['game_set_background'] = function(block) {
    const col = htmlGenerator.valueToCode(block, 'COL', htmlGenerator.ORDER_ATOMIC) || "'#000000'";
    return `ctx.fillStyle=${col};ctx.fillRect(0,0,canvas.width,canvas.height);\n`;
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_set_background'] = function(block) {
        return htmlGenerator.forBlock['game_set_background'](block);
    };
}

htmlGenerator.forBlock['game_mouse_x'] = () => ['(window.mouseX||0)', htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock['game_mouse_y'] = () => ['(window.mouseY||0)', htmlGenerator.ORDER_ATOMIC];
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_mouse_x'] = () => ['(window.mouseX||0)', Blockly.JavaScript.ORDER_ATOMIC];
    Blockly.JavaScript.forBlock['game_mouse_y'] = () => ['(window.mouseY||0)', Blockly.JavaScript.ORDER_ATOMIC];
}

htmlGenerator.forBlock['game_canvas_width'] = () => ['canvas.width', htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock['game_canvas_height'] = () => ['canvas.height', htmlGenerator.ORDER_ATOMIC];
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_canvas_width'] = () => ['canvas.width', Blockly.JavaScript.ORDER_ATOMIC];
    Blockly.JavaScript.forBlock['game_canvas_height'] = () => ['canvas.height', Blockly.JavaScript.ORDER_ATOMIC];
}

htmlGenerator.forBlock['game_timer'] = () => ['((Date.now()-window.gameStartTime)/1000)', htmlGenerator.ORDER_ATOMIC];
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_timer'] = () => ['((Date.now()-window.gameStartTime)/1000)', Blockly.JavaScript.ORDER_ATOMIC];
}

htmlGenerator.forBlock['game_set_var'] = function(block) {
    const name = block.getFieldValue('VAR');
    const val = htmlGenerator.valueToCode(block, 'VAL', htmlGenerator.ORDER_ATOMIC) || '0';
    return `window.gameVars['${name}']=${val};\n`;
};
htmlGenerator.forBlock['game_get_var'] = function(block) {
    const name = block.getFieldValue('VAR');
    return [`(window.gameVars['${name}']||0)`, htmlGenerator.ORDER_ATOMIC];
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_set_var'] = function(block) {
        return htmlGenerator.forBlock['game_set_var'](block);
    };
    Blockly.JavaScript.forBlock['game_get_var'] = function(block) {
        return htmlGenerator.forBlock['game_get_var'](block);
    };
}

htmlGenerator.forBlock['game_collision_rect'] = function(block) {
    const a = block.getFieldValue('A');
    const b_name = block.getFieldValue('B');
    return [`(function(){var a=window.sprites['${a}'],b=window.sprites['${b_name}'];if(!a||!b)return false;return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;})()`, htmlGenerator.ORDER_ATOMIC];
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_collision_rect'] = function(block) {
        return htmlGenerator.forBlock['game_collision_rect'](block);
    };
}

htmlGenerator.forBlock['game_sprite_prop'] = function(block) {
    const name = block.getFieldValue('NAME');
    const prop = block.getFieldValue('PROP');
    return [`(window.sprites['${name}']&&window.sprites['${name}'].${prop}||0)`, htmlGenerator.ORDER_ATOMIC];
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_sprite_prop'] = function(block) {
        return htmlGenerator.forBlock['game_sprite_prop'](block);
    };
}

htmlGenerator.forBlock['game_set_sprite_prop'] = function(block) {
    const name = block.getFieldValue('NAME');
    const prop = block.getFieldValue('PROP');
    const val = htmlGenerator.valueToCode(block, 'VAL', htmlGenerator.ORDER_ATOMIC) || '0';
    return `if(window.sprites['${name}'])window.sprites['${name}'].${prop}=${val};\n`;
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_set_sprite_prop'] = function(block) {
        return htmlGenerator.forBlock['game_set_sprite_prop'](block);
    };
}

htmlGenerator.forBlock['game_distance'] = function(block) {
    const a = block.getFieldValue('A');
    const b_name = block.getFieldValue('B');
    return [`(function(){var a=window.sprites['${a}'],b=window.sprites['${b_name}'];if(!a||!b)return 9999;var dx=a.x-b.x,dy=a.y-b.y;return Math.sqrt(dx*dx+dy*dy);})()`, htmlGenerator.ORDER_ATOMIC];
};
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['game_distance'] = function(block) {
        return htmlGenerator.forBlock['game_distance'](block);
    };
}

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

htmlGenerator.forBlock["html_ul"] = (b) => `<ul>${htmlGenerator.statementToCode(b, 'CONTENT')}</ul>\n`;
htmlGenerator.forBlock["html_ol"] = (b) => `<ol>${htmlGenerator.statementToCode(b, 'CONTENT')}</ol>\n`;
htmlGenerator.forBlock["html_li"] = (b) => {
    const text = getVal(b, 'TEXT');
    return `<li>${text}</li>\n`;
};

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
    const name = getVal(b, 'NAME');
    const ph = getVal(b, 'PH');
    
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
htmlGenerator.forBlock["js_mouse_clicked"] = (b) => ["(!!window.mouseClicked)", htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["js_mouse_down"] = (b) => ["(!!window.mouseDown)", htmlGenerator.ORDER_ATOMIC];
if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock["js_mouse_clicked"] = (b) => ["(!!window.mouseClicked)", Blockly.JavaScript.ORDER_ATOMIC];
    Blockly.JavaScript.forBlock["js_mouse_down"] = (b) => ["(!!window.mouseDown)", Blockly.JavaScript.ORDER_ATOMIC];
}
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
    const logo = (htmlGenerator.valueToCode(b, 'LOGO', htmlGenerator.ORDER_ATOMIC) || "'Logo'").replace(/^'|'$/g, '');
    const links = htmlGenerator.statementToCode(b, 'LINKS');
    return `
    <nav style="display:flex;justify-content:space-between;align-items:center;padding:20px 40px;border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="font-weight:900;font-size:20px;letter-spacing:-1px;">${logo}</div>
        <div style="display:flex;gap:20px;">${links}</div>
    </nav>
    `;
};

htmlGenerator.forBlock["ui_nav_link"] = (b) => {
    const text = (htmlGenerator.valueToCode(b, 'TEXT', htmlGenerator.ORDER_ATOMIC) || "'Link'").replace(/^'|'$/g, '');
    const url = (htmlGenerator.valueToCode(b, 'URL', htmlGenerator.ORDER_ATOMIC) || "'#'").replace(/^'|'$/g, '');
    return `<a href="${url}" style="text-decoration:none;color:inherit;opacity:0.8;font-weight:500;font-size:14px;">${text}</a>`;
};

htmlGenerator.forBlock["ui_hero_section"] = (b) => {
    const title = (htmlGenerator.valueToCode(b, 'TITLE', htmlGenerator.ORDER_ATOMIC) || "'Title'").replace(/^'|'$/g, '');
    const sub = (htmlGenerator.valueToCode(b, 'SUB', htmlGenerator.ORDER_ATOMIC) || "'Subtitle'").replace(/^'|'$/g, '');
    const btnText = (htmlGenerator.valueToCode(b, 'BTN_TEXT', htmlGenerator.ORDER_ATOMIC) || "'Click'").replace(/^'|'$/g, '');
    let jsCode = htmlGenerator.statementToCode(b, 'DO');
    jsCode = jsCode.replace(/<script>/g, '').replace(/<\/script>/g, '').trim().replace(/"/g, '&quot;');

    return `
    <section style="text-align:center;padding:100px 20px;max-width:800px;margin:0 auto;">
        <h1 style="font-size:60px;font-weight:800;margin-bottom:20px;letter-spacing:-2px;background:linear-gradient(to right, #fff, #888);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
            ${title}
        </h1>
        <p style="font-size:20px;opacity:0.7;line-height:1.6;margin-bottom:40px;">
            ${sub}
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
    const title = (htmlGenerator.valueToCode(b, 'TITLE', htmlGenerator.ORDER_ATOMIC) || "'Feature'").replace(/^'|'$/g, '');
    const text = (htmlGenerator.valueToCode(b, 'TEXT', htmlGenerator.ORDER_ATOMIC) || "'Description'").replace(/^'|'$/g, '');
    const iconMap = { star: '&#9733;', code: '&#60;/&#62;', zap: '&#9889;', heart: '&#9829;' };
    const iconKey = b.getFieldValue('ICON') || 'star';
    const icon = iconMap[iconKey] || '&#9733;';
    return `
    <div style="padding:30px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
        <div style="font-size:24px;margin-bottom:15px;">${icon}</div>
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

htmlGenerator.forBlock['meta_tailwind_cdn'] = function(block) {
  return '<script src="https://cdn.tailwindcss.com"></script>\n';
};


htmlGenerator.forBlock['ui_tailwind_box'] = function(block) {
    var classes = htmlGenerator.valueToCode(block, 'CLASSES', htmlGenerator.ORDER_ATOMIC) || "''";
    var content = htmlGenerator.statementToCode(block, 'CONTENT');
    
    classes = classes.replace(/^'(.*)'$/, '$1');

    return `<div class="${classes}">\n${content}\n</div>\n`;
};

htmlGenerator.forBlock['ui_page_link'] = function(block) {
    const page = block.getFieldValue('PAGE');
    const text = htmlGenerator.valueToCode(block, 'TEXT', htmlGenerator.ORDER_ATOMIC) || "'Link'";
    const cleanText = text.replace(/'/g, "");
    
    return `<a href="${page}.html" class="nav-link">${cleanText}</a>`;
};

htmlGenerator.forBlock["arr_new_empty"] = () => ["[]", htmlGenerator.ORDER_ATOMIC];
htmlGenerator.forBlock["arr_new_length"] = (b) => [`new Array(${htmlGenerator.valueToCode(b, 'LEN', 0) || 0})`, 0];
htmlGenerator.forBlock["arr_parse"] = (b) => [`JSON.parse(${htmlGenerator.valueToCode(b, 'TXT', 0) || '[]'})`, 0];
htmlGenerator.forBlock["arr_split"] = (b) => [`(${htmlGenerator.valueToCode(b, 'TXT', 0) || "''"}).split(${htmlGenerator.valueToCode(b, 'DELIM', 0) || "''"})`, 0];

htmlGenerator.forBlock["arr_builder"] = (b) => {
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

htmlGenerator.forBlock['colour_picker'] = function(block) {
  const code = block.getFieldValue('COLOUR');
  return ["'" + code + "'", htmlGenerator.ORDER_ATOMIC];
};

if (Blockly.JavaScript) {
    Blockly.JavaScript.forBlock['colour_picker'] = function(block) {
        const code = block.getFieldValue('COLOUR');
        return ["'" + code + "'", Blockly.JavaScript.ORDER_ATOMIC];
    };
}

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
    const argument0 = htmlGenerator.valueToCode(block, 'DELTA', htmlGenerator.ORDER_ADDITION) || '0';
    const varName = block.getFieldValue('VAR');
    
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

const bridgeBlock = (name) => {
    htmlGenerator.forBlock[name] = function(block) {
        return Blockly.JavaScript.forBlock[name].call(Blockly.JavaScript, block);
    };
};

['variables_get', 'variables_set', 'math_change', 'math_number', 'logic_boolean', 'controls_if'].forEach(bridgeBlock);
});


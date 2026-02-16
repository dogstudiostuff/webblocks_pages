const fs = require('fs');

var p = 'c:\\Users\\dotun\\WebBlocks\\webblocks\\app.js';
var s;
try {
  s = fs.readFileSync(p, 'utf8');
} catch (err) {
  console.error('Could not read', p, err.message);
  process.exit(1);
}
const pos = 23046; 
var inStr = null;
var esc = false;
var line = 1;
for (var i = 0; i < pos && i < s.length; i++) {
  const ch = s[i];
  if (ch === '\n') line++;
  if (esc) { esc = false; continue; }
  if (ch === '\\') { esc = true; continue; }
  if (!inStr && (ch === '"' || ch === '\'' || ch === '`')) { inStr = ch; }
  else if (inStr && ch === inStr) { inStr = null; }
}
console.log('inString at pos?', inStr, 'line', line);
console.log('snippet around pos:\n', s.slice(pos-80, pos+80).replace(/\r/g,'[CR]').replace(/\n/g,'[LF]'));


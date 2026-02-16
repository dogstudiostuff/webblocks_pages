# Creating a WBX Extension (Quick Guide)

This short guide explains the `.wbx` extension format used by Poo IDE / WebBlocks and shows a minimal "Hello" extension that adds a block which renders "hello world" in the Preview.

**WBX sections**
- `settings{ ... }`: key:value pairs (author, name, version, colour).
- `shapes{ ... }` (optional): JS that calls `WEBBLOCKS_SHAPES.register(name, pathFn)`.
- `blockdef{ ... }`: Blockly JSON array of block definitions.
- `gen{ ... }`: JavaScript generator code. It can assign `htmlGenerator.forBlock['<type>']`.

Example minimal extension (see `hello.wbx` in the repo):

```
settings{ author: "You"; version: 1.0.0; name: "Hello Extension"; colour: "#00AAFF"; }

blockdef{
[
  {
    "type": "hello_block",
    "message0": "Hello Block",
    "output": null,
    "colour": "#00AAFF"
  }
]
}

gen{
htmlGenerator.forBlock['hello_block'] = function(block) {
  return ['<div>hello world</div>', htmlGenerator.ORDER_ATOMIC];
};
}
```

How to load the extension
- Open the app (load `index.html` in Electron/dev or open the app normally).
- Click the `Ext` button (Extensions), then `Import .wbx` and choose `hello.wbx`.
- Or: open `Extensions -> New Extension` and paste the `hello.wbx` content into the editor, then click `Load Extension`.

Verify in Preview
- After loading, the block category will include your extension under Extensions.
- Drag `Hello Block` into the workspace, then click the `Preview` button (▶) in the titlebar.
- The Preview output should include a DOM element containing the text `hello world`.

Notes and tips
- Use `blockdef` JSON to define inputs, outputs and block UI.
- The generator runs in the same environment as the app; it should use `htmlGenerator` helpers (see existing `generators.js`).
- For custom shapes, place JS in `shapes{}` that calls `WEBBLOCKS_SHAPES.register`.

Files added:
- Hello extension: [hello.wbx](hello.wbx)


**Next steps**
- See more [WebBlocks documentation](https://github.com/aefarkalibastafinfein/pooide-docs) for more details.
- Explore the [WebBlocks GitHub repository](https://github.com/aefarkalibastafinfein/pooide) for more examples.
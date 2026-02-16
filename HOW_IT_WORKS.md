# How WebBlocks Works

## Overview
WebBlocks is a Blockly-based visual web builder.
Users assemble blocks, the app generates HTML/JS/CSS, and then users can preview, export, or package pages.

Main runtime files:
- `index.html`: UI shell, dialogs, script loading order.
- `app.js`: app state, workspace lifecycle, tabs, save/load, preview/export, assets manager.
- `blocks.js`: custom block definitions and shape registration hooks.
- `generators.js`: block-to-code generation logic.
- `renderer.js`: custom Blockly renderer behavior and connection shape rules.
- `extensions.js`: `.poox` extension parser/loader and toolbox integration.

## App State Model
`app.js` keeps the main state in `project`:
- `activePage`: currently selected page tab.
- `pages`: map of page name -> Blockly serialized workspace state.
- `assets`: imported files stored as Data URLs.

There is also a special non-workspace tab id:
- `ASSETS_PAGE_ID = "__assets__"`

That tab is for asset management only, not block editing.

## Startup Flow
1. `index.html` loads Blockly core scripts and plugins.
2. `renderer.js` registers the `webblocks` renderer.
3. `generators.js` initializes `htmlGenerator` and block generators.
4. `blocks.js` registers custom blocks and shapes.
5. `app.js` runs `init()` on `window.onload`.
6. `init()` injects Blockly, sets listeners, sets up dialogs/buttons, and renders tabs.

## Blockly Workspace Flow
- Workspace is injected once with toolbox + renderer options.
- On page switch, current workspace is serialized and stored in `project.pages[activePage]`.
- New page load restores serialized data into workspace.
- Build/Code panel toggle:
  - Build: shows Blockly workspace.
  - Code: shows generated output from current top-level blocks.

## Code Generation
`generateFullHtml()`:
1. Walks workspace top blocks.
2. Calls `htmlGenerator.blockToCode(block)` for each.
3. Concatenates generated markup/code.
4. Injects asset map resolver script.
5. Appends optional watermark.
6. Optionally minifies output (simple pass).

## Assets System
The assets tab supports importing any file type.

### Import
- Triggered by `Import Assets` button.
- Uses hidden file input with `multiple`.
- Files are read as Data URLs via `FileReader`.
- Stored in `project.assets` as:
  - `name`
  - `type`
  - `dataUrl`

### Asset Tab UI
`renderAssetsArea()` renders cards with:
- Image preview for `image/*`.
- Video preview for `video/*`.
- Generic extension label for other file types.
- Actions:
  - Copy path (`assets/<filename>`)
  - Download
  - Remove

### Runtime Asset Resolution
`appendAssetMapToHtml()` appends a script that maps file paths to Data URLs and rewrites matching attributes at runtime.

Resolved attributes include:
- `img[src]`
- `source[src]`
- `video[src]`
- `audio[src]`
- `track[src]`
- `a[href]`
- `link[href]`
- `object[data]`

So references like `assets/logo.png` work in preview/export if that asset exists.

## Save/Load Formats
Current formats:
- Project/page files save as `.poo`.
- Extensions save as `.poox`.

Compatibility:
- Import still accepts legacy `.wbk` and `.wbx`.
- Loader also accepts older payload fields (`images`) and maps them into `assets`.

## Export and Preview
### Export HTML
- Exports current page generated HTML as `<page>.html`.

### Export ZIP
- Iterates all project pages.
- Generates HTML for each page.
- Packs files into zip using JSZip.

### Preview
- Builds generated HTML for current page.
- Adds a preview notice banner.
- Opens via Electron preview API or browser blob URL fallback.

## Extension System (`.poox`)
`extensions.js` parses custom extension source sections, then registers:
- Custom shapes through `WEBBLOCKS_SHAPES`.
- Block definitions.
- Generator functions.

Loaded extensions are merged into toolbox categories and persisted by extension storage logic.

## Custom Renderer
`renderer.js` customizes Blockly rendering:
- Registers additional connection shapes (including ticket/custom shapes).
- Applies shape-specific spacing/offset handling.
- Handles type-check to shape mapping.

This is where visual tuning for media/ticket/custom shapes is implemented.

## UI Structure
Major UI parts in `index.html`:
- Titlebar toolbar (save/load/export/preview/extensions/settings).
- Workspace panel (Build/Code toggle).
- Page tabs + Assets tab.
- Dialog overlays: settings, save modal, new page, extension manager/editor, visual extension maker.

## Notes for Future Changes
- If a new block is added, update both `blocks.js` and `generators.js`.
- If a new file-bearing element is introduced, add its selector/attribute in asset resolver map.
- Keep save/load schema backward-compatible by reading old fields when possible.

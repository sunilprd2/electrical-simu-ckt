# ELECTRICAL SIMU CKT — SVG Symbol Library Integration

This build connects the supplied original SVG files to the component library.

## Publish to GitHub Pages
1. Extract this ZIP.
2. Upload/replace the repository files, preserving `assets/symbols/`.
3. Commit changes to the branch configured for GitHub Pages.
4. Wait for GitHub Pages to finish publishing, then hard-refresh the site (Ctrl+F5).

## Notes
- `symbol-library.json` indexes the SVG symbol files.
- `app.js` loads the manifest and displays the original SVG artwork in the library.
- Dragged symbols use the original SVG asset and retain the editor's move/select/delete and terminal-point interaction layer.
- `PRINT PDF` opens the browser print dialog; choose Save as PDF.
- The current simulation remains a visual prototype: PLAY/STOP updates the demo state and placed controls can visibly toggle while running. It is not yet a validated electrical solver and does not compute circuit continuity/current or real device logic.
- Some symbols have generic terminal coordinates until individual IEC terminal maps are authored and tested.

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


## V17 workspace cleanup
- Dark mode applies an invert filter to original SVG artwork for contrast.
- Workspace component names/reference tags and terminal labels are hidden.
- CONNECT toolbar mode reveals small terminal circles; selected terminals highlight.
- Light mode preserves original SVG artwork.
- Verify individual terminal maps and wire behavior before engineering use.


## V19 label and terminal polish
- Component library labels now derive from the SVG filename only; no assets/symbols path is shown.
- Library labels have no strike-through decoration and IEC prefix text is hidden.
- Workspace connection terminals use small red circles; in CONNECT mode hover/selection turns the point cyan.


## V20 CAD-style wiring feedback
- Added a live dashed orthogonal wire preview while selecting a destination terminal.
- Added horizontal/vertical alignment guides during wiring.
- Completed wires are orthogonal and snap to the selected terminal coordinates.


## V23 terminal endpoint adjustment
- Three-pole SVG terminal points use three evenly spaced top and bottom rail endpoints (6 total), with points moved outward to the ends of the vertical tails.
- Two-pole assets use 4 points; single-pole assets use 2 points.
- Wiring still uses the same port definitions for point display, snapping, and connections.


## V24 user-requested wiring interaction
- Port markers are interactive overlays, not baked into SVG artwork. They appear only in CONNECT mode.
- Port generation uses the actual SVG filename, enabling 6 terminals for 3-pole, 4 for 2-pole and 2 for 1-pole symbols.
- Terminal endpoint coordinates are placed at the top/bottom ends of the symbol rail.
- While a wire is in progress, left-clicking blank canvas adds a cable bend; right-click cancels the unfinished cable.
- Left component library width reduced to 300px on desktop (280px/250px on smaller screens).


## V25 terminal interaction and toolbar
- Corrected pole terminal positions to top/bottom ends of symbol rails (three-pole: six endpoints).
- Library previews no longer add terminal marker overlays.
- Workspace terminal targets are invisible until clicked; the active terminal shows a tiny cyan circle.
- Added Undo/Redo toolbar buttons and Ctrl+Z / Ctrl+Y history for workspace changes.
- Added color accents to toolbar icons.


## V26 CAD workspace tools
- Terminal dots hidden until hovered/selected in CONNECT mode.
- Added zoom in/out, center, insert text tools, wheel zoom and left-drag pan on empty workspace.
- Added component details dialog for name, short designation, value/rating and terminal labels.
- Added short designation tags on placed components and removed page/workspace scrollbars where possible.

- Updated terminal number fields also update the clickable terminal targets.
- Panning does not intercept left-clicks used to add wire bends.


## V27 requested polish
- Hide terminal circles at rest; only show a tiny cue when hovering a terminal while CONNECT mode is active.
- Component short tags use normal font weight and smaller size.
- Component pointer-down on a terminal no longer starts dragging the whole component; body drag remains available.
- Power Supply is explicitly first in the library category order.
- Workspace/page scrollbars are hidden.


## V28 terminal appearance
- All visible terminal circles, rings, and hover halos are disabled. Transparent terminal hit areas are retained so click-to-connect can continue to work.


## Power supply library
The POWER SUPPLY category includes phase/neutral/PE terminals, 1-phase and 3-phase supply symbols, DC positive/negative, ground, transformers and AC/DC supply. These are SVG assets and are included in both the external and embedded symbol manifests for file:// preview.


## Coil SVG library
Four separate SVG coil/timer symbols are available in `components/Coils/`. The artwork has no K/KT reference designation; the editor assigns K1/K2... or KT1/KT2... when dropped into the workspace.

## Run-mode wiring diagnostics
- A fault banner appears only when the running circuit has a detected fault; it stays hidden when no fault is present. Motor run/off status is not shown in the banner.
- The banner reports phase-to-phase, line-to-neutral, DC polarity, and conductor-to-PE wiring faults.
- Three-phase motors run only when U/V/W receive three distinct phases. Missing phases and duplicate phase assignments stop the motor and report the affected terminal.
- The DC motor defaults to a two-terminal permanent-magnet model. To simulate a wound-field motor, open Component Details, choose **Wound field**, and supply A1/A2 plus F1/F2. Energized armature with an unpowered F1/F2 field circuit is reported as field loss and the motor remains stopped.
- These checks use ideal connection and potential labels. They do not calculate current, impedance, protection coordination, or installation safety.

## Group selection and movement
- Right-click and drag a rectangle around components and wires; each selected component gets its own gold outline. Dragging from right to left also selects items the rectangle crosses. No Shift key is required.
- Left-drag any selected component or wire to move the full selected group. Wires between moved components keep their route and connections; wires that reach outside the group reroute to stay connected.
- Press **Delete** or use the Delete button to remove the selected group. Removing a component also removes wires attached to it.

## V138 selection and wiring cleanup
- Group selection uses the tight gold component outline without the oversized legacy selection frame.
- Clicking an empty point in the workspace cancels an unfinished wire start; selecting a second terminal completes the connection.


## V139 label and text controls
- Component reference tags and terminal names/numbers share a configurable colour in Settings.
- Reference tags are smaller and sit closer to the component; comments move to the former tag area.
- Drawing text colour and size are controlled from Settings; the floating text toolbar is removed.


## V140 annotation placement
- Component comments display vertically to the left of the reference tag.
- The smaller horizontal reference tag sits immediately beside the component artwork.


## V141 label and text selection fixes
- Vertical comments have a clear gap to the left of the component reference tag; the tag sits at the component edge.
- The shared label colour is applied to reference tags, generated terminal numbers, and matching IEC terminal names in component artwork.
- A workspace click commits drawing text. Single-click selects it for rotation; double-click reopens editing.


## V142 IEC annotation placement
- Component reference tags are smaller and vertical, beside the symbol's left edge.
- Vertical comments sit in a separate column farther left; terminal labels remain by their terminals.


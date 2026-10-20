import os
import re
import json
import shutil
import zipfile
import xml.etree.ElementTree as ET

# ==============================================================================
# CONFIGURATION: UNIFIED SCREEN-SPACE PITCH
# Standard height in app.js is vh = 464.0 (mapped to ESC_ART_H = 63px).
# A pitch of 200.0 units at vh = 464.0 equals 27.155px on the schematic canvas.
# By scaling target_pitch = 200.0 * (vh / 464.0) for any SVG's viewBox height,
# EVERY 2-pole, 3-pole, and 4-pole component (Sources, Breakers, Contactors,
# Overload Relays, Fuses, and 3-Phase Motors) will have the EXACT same
# on-screen terminal spacing (27.155px) without distorting motor circle size!
# ==============================================================================
BASE_VH = 464.0
BASE_PITCH = 200.0

ET.register_namespace("", "http://www.w3.org/2000/svg")
ET.register_namespace("svg", "http://www.w3.org/2000/svg")

def parse_matrix_tx_ty(transform_str):
    if not transform_str:
        return 0.0, 0.0, 1.0, 1.0
    m = re.search(r'matrix\(\s*([-\d\.eE]+)[,\s]+([-\d\.eE]+)[,\s]+([-\d\.eE]+)[,\s]+([-\d\.eE]+)[,\s]+([-\d\.eE]+)[,\s]+([-\d\.eE]+)\s*\)', transform_str)
    if m:
        sx, _, _, sy, tx, ty = [float(x) for x in m.groups()]
        return tx, ty, sx, sy
    m = re.search(r'translate\(\s*([-\d\.eE]+)(?:[,\s]+([-\d\.eE]+))?\s*\)', transform_str)
    if m:
        tx = float(m.group(1))
        ty = float(m.group(2)) if m.group(2) else 0.0
        return tx, ty, 1.0, 1.0
    return 0.0, 0.0, 1.0, 1.0

def add_dx_to_element(elem, dx):
    """Shifts an SVG element horizontally by dx while preserving its exact geometry and attributes."""
    if abs(dx) < 1e-4:
        return
    tag = elem.tag.split('}')[-1]
    tr = elem.attrib.get('transform', '')

    # If the element has a rotate(angle cx cy) transform, update cx and translate
    rot_m = re.search(r'rotate\(\s*([-\d\.eE]+)\s+([-\d\.eE]+)\s+([-\d\.eE]+)\s*\)', tr)
    if rot_m and tag == 'rect':
        ang, rcx, rcy = float(rot_m.group(1)), float(rot_m.group(2)), float(rot_m.group(3))
        elem.attrib['x'] = f"{float(elem.attrib['x']) + dx:.2f}"
        elem.attrib['transform'] = f"rotate({ang} {rcx + dx:.2f} {rcy})"
        return

    # If the element uses a matrix transform, shift its tx (5th parameter)
    mat_m = re.search(r'matrix\(\s*([-\d\.eE]+)[,\s]+([-\d\.eE]+)[,\s]+([-\d\.eE]+)[,\s]+([-\d\.eE]+)[,\s]+([-\d\.eE]+)[,\s]+([-\d\.eE]+)\s*\)', tr)
    if mat_m:
        vals = [float(x) for x in mat_m.groups()]
        vals[4] += dx
        elem.attrib['transform'] = f"matrix({vals[0]} {vals[1]} {vals[2]} {vals[3]} {vals[4]:.2f} {vals[5]})"
        return

    if tag == 'line':
        elem.attrib['x1'] = f"{float(elem.attrib['x1']) + dx:.2f}"
        elem.attrib['x2'] = f"{float(elem.attrib['x2']) + dx:.2f}"
    elif tag == 'rect':
        elem.attrib['x'] = f"{float(elem.attrib['x']) + dx:.2f}"
    elif tag == 'circle':
        elem.attrib['cx'] = f"{float(elem.attrib['cx']) + dx:.2f}"
    elif tag == 'text':
        elem.attrib['x'] = f"{float(elem.attrib['x']) + dx:.2f}"
    elif tag == 'path':
        d = elem.attrib.get('d', '')
        # Relative path starting with m x,y
        if re.match(r'^\s*m\s*[-\d\.]+', d):
            elem.attrib['d'] = re.sub(
                r'^(\s*m\s*)([-\d\.]+)',
                lambda m: f"{m.group(1)}{float(m.group(2)) + dx:.2f}",
                d,
                count=1
            )
        else:
            # Absolute path (M / L / A / C): shift via transform or token parser
            tokens = re.findall(r'[a-zA-Z]|[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?', d)
            out = []
            i = 0
            cmd = ''
            while i < len(tokens):
                t = tokens[i]
                if t.isalpha():
                    cmd = t
                    out.append(t)
                    i += 1
                else:
                    if cmd in ('M', 'L', 'T'):
                        out.append(f"{float(tokens[i]) + dx:.2f}")
                        out.append(tokens[i+1])
                        i += 2
                    elif cmd == 'H':
                        out.append(f"{float(tokens[i]) + dx:.2f}")
                        i += 1
                    elif cmd == 'V':
                        out.append(tokens[i])
                        i += 1
                    elif cmd == 'C':
                        for k in range(0, 6, 2):
                            out.append(f"{float(tokens[i+k]) + dx:.2f}")
                            out.append(tokens[i+k+1])
                        i += 6
                    elif cmd in ('S', 'Q'):
                        for k in range(0, 4, 2):
                            out.append(f"{float(tokens[i+k]) + dx:.2f}")
                            out.append(tokens[i+k+1])
                        i += 4
                    elif cmd == 'A':
                        out.extend(tokens[i:i+5])
                        out.append(f"{float(tokens[i+5]) + dx:.2f}")
                        out.append(tokens[i+6])
                        i += 7
                    else:
                        # Relative commands (l, c, a, etc.) need no X shift after initial M/m
                        out.append(t)
                        i += 1
            elem.attrib['d'] = " ".join(out)

def get_element_center_and_span(elem):
    """Returns (cx, cy, width_span) of an SVG element in root coordinates."""
    tag = elem.tag.split('}')[-1]
    tr = elem.attrib.get('transform', '')
    tx, ty, sx, sy = parse_matrix_tx_ty(tr)

    if tag == 'line':
        x1 = float(elem.attrib.get('x1', 0)) * sx + tx
        x2 = float(elem.attrib.get('x2', 0)) * sx + tx
        y1 = float(elem.attrib.get('y1', 0)) * sy + ty
        y2 = float(elem.attrib.get('y2', 0)) * sy + ty
        return (x1 + x2) / 2.0, (y1 + y2) / 2.0, abs(x2 - x1)
    elif tag == 'rect':
        x = float(elem.attrib.get('x', 0)) * sx + tx
        y = float(elem.attrib.get('y', 0)) * sy + ty
        w = float(elem.attrib.get('width', 0)) * sx
        h = float(elem.attrib.get('height', 0)) * sy
        return x + w / 2.0, y + h / 2.0, w
    elif tag == 'circle':
        cx = float(elem.attrib.get('cx', 0)) * sx + tx
        cy = float(elem.attrib.get('cy', 0)) * sy + ty
        r = float(elem.attrib.get('r', 0)) * abs(sx)
        return cx, cy, r * 2.0
    elif tag == 'text':
        x = float(elem.attrib.get('x', 0)) * sx + tx
        y = float(elem.attrib.get('y', 0)) * sy + ty
        return x, y, 0.0
    elif tag == 'path':
        d = elem.attrib.get('d', '')
        m = re.match(r'^\s*[mM]\s*([-\d\.]+)[,\s]+([-\d\.]+)', d)
        if m:
            x0 = float(m.group(1)) * sx + tx
            y0 = float(m.group(2)) * sy + ty
            # Check if it's a 12-sided terminal polygon
            if d.lower().endswith('z') and d.lower().count('l') >= 10:
                nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
                # In relative 12-gon, x0 is left edge; radius is half of sum of positive dx
                dx_vals = nums[2::2]
                w_poly = sum(v for v in dx_vals if v > 0) * abs(sx)
                return x0 + w_poly / 2.0, y0, w_poly
            return x0, y0, 0.0
    return None, None, 0.0

def align_component_svg_and_ports(svg_text, catalog_entry, asset_key):
    """
    Aligns multi-terminal SVG geometry and updates catalog_entry['vb'] & catalog_entry['ports']
    so all multi-pole components share the exact same screen-space terminal pitch and
    perfectly vertical phase alignment.
    """
    if not catalog_entry or 'ports' not in catalog_entry:
        return svg_text, catalog_entry

    ports = catalog_entry['ports']
    vb = list(catalog_entry['vb']) # [vx0, vy0, vw, vh]
    vx0, vy0, vw, vh = [float(v) for v in vb]

    # Target pitch in this SVG's coordinate space so screen pitch == 27.155px everywhere
    target_pitch = round(BASE_PITCH * (vh / BASE_VH), 2)

    # Group ports by pole (X-coordinate proximity)
    # Exclude PE on motors from the main 3-phase U-V-W pole group so U,V,W get exact 3-phase pitch
    is_motor = asset_key.startswith('motor_')
    main_ports = [p for p in ports if not (is_motor and p.get('label') == 'PE')]
    pe_ports = [p for p in ports if (is_motor and p.get('label') == 'PE')]

    # Cluster main_ports by vx
    sorted_x = sorted(set(round(p['vx'], 1) for p in main_ports))
    pole_clusters = []
    for x in sorted_x:
        if not pole_clusters or abs(x - pole_clusters[-1][-1]) > target_pitch * 0.35:
            pole_clusters.append([x])
        else:
            pole_clusters[-1].append(x)

    old_pole_xs = [sum(c) / len(c) for c in pole_clusters]
    num_poles = len(old_pole_xs)

    # Single-column vertical components: just ensure top & bottom ports have identical vx
    if num_poles <= 1:
        if len(main_ports) == 2 and main_ports[0]['side'] != main_ports[1]['side']:
            avg_x = round((main_ports[0]['vx'] + main_ports[1]['vx']) / 2.0, 2)
            main_ports[0]['vx'] = avg_x
            main_ports[1]['vx'] = avg_x
        return svg_text, catalog_entry

    # Calculate new equidistant pole X coordinates centered around the existing pole group center
    center_x = sum(old_pole_xs) / num_poles
    new_pole_xs = [
        round(center_x + (i - (num_poles - 1) / 2.0) * target_pitch, 2)
        for i in range(num_poles)
    ]

    pole_dx = [new_pole_xs[i] - old_pole_xs[i] for i in range(num_poles)]

    # If PE port exists on a motor, shift it outward by the same delta as the rightmost pole
    pe_old_x = pe_ports[0]['vx'] if pe_ports else None
    pe_dx = max(0.0, pole_dx[-1]) if pe_ports else 0.0

    # Parse XML and shift elements belonging to each pole
    root = ET.fromstring(svg_text)
    layer = root.find('.//{http://www.w3.org/2000/svg}g') or root

    for elem in list(layer):
        tag = elem.tag.split('}')[-1]
        if tag in ('title', 'defs', 'desc'):
            continue
        cx, cy, span = get_element_center_and_span(elem)
        if cx is None:
            continue

        # 1. Never distort or shift the main motor circle or its centered M3/AC label
        if is_motor and tag == 'circle' and span > vh * 0.25:
            continue
        if is_motor and elem.attrib.get('id') in ('svg_m3', 'svg_ac_tilde', 'svg_motor_circle'):
            continue

        # 2. Check if this element is part of the motor PE ground assembly on the right
        if pe_old_x is not None and cx > old_pole_xs[-1] + target_pitch * 0.45:
            add_dx_to_element(elem, pe_dx)
            continue

        # 3. Check if this is a horizontal spanning element (enclosure box, divider, or dashed linkage)
        old_span_total = old_pole_xs[-1] - old_pole_xs[0]
        if tag == 'rect' and span > old_span_total * 0.75:
            # Stretch protection enclosure box symmetrically across the new poles
            x_left = float(elem.attrib['x'])
            w_old = float(elem.attrib['width'])
            new_x_left = x_left + pole_dx[0]
            new_w = w_old + (pole_dx[-1] - pole_dx[0])
            elem.attrib['x'] = f"{new_x_left:.2f}"
            elem.attrib['width'] = f"{new_w:.2f}"
            continue

        if tag == 'line' and span > old_span_total * 0.65:
            # Horizontal divider line or dashed linkage line across poles
            x1 = float(elem.attrib['x1'])
            x2 = float(elem.attrib['x2'])
            if x1 <= x2:
                # If x1 starts at the manual actuator box to the left of Pole 1, shift actuator with Pole 1
                elem.attrib['x1'] = f"{x1 + pole_dx[0]:.2f}"
                elem.attrib['x2'] = f"{x2 + pole_dx[-1]:.2f}"
            else:
                elem.attrib['x1'] = f"{x1 + pole_dx[-1]:.2f}"
                elem.attrib['x2'] = f"{x2 + pole_dx[0]:.2f}"
            continue

        # 4. Left-hand manual actuator assembly on MPCBs (to the left of Pole 1)
        if cx < old_pole_xs[0] - 25:
            add_dx_to_element(elem, pole_dx[0])
            continue

        # 5. Otherwise, assign element to its nearest pole and shift by that pole's dx
        nearest_idx = min(range(num_poles), key=lambda i: abs(cx - old_pole_xs[i]))
        add_dx_to_element(elem, pole_dx[nearest_idx])

    # Update port coordinates in catalog_entry and level their Y-coordinates per row
    top_ys = [p['vy'] for p in main_ports if p.get('side') == 'top']
    bot_ys = [p['vy'] for p in main_ports if p.get('side') == 'bottom']
    avg_top_y = round(sum(top_ys) / len(top_ys), 2) if top_ys else None
    avg_bot_y = round(sum(bot_ys) / len(bot_ys), 2) if bot_ys else None

    for p in main_ports:
        nearest_idx = min(range(num_poles), key=lambda i: abs(p['vx'] - old_pole_xs[i]))
        p['vx'] = new_pole_xs[nearest_idx]
        if p.get('side') == 'top' and avg_top_y is not None:
            p['vy'] = avg_top_y
        elif p.get('side') == 'bottom' and avg_bot_y is not None:
            p['vy'] = avg_bot_y

    if pe_ports:
        pe_ports[0]['vx'] = round(pe_ports[0]['vx'] + pe_dx, 2)

    # Expand viewBox horizontally if needed so outer poles have clean symmetrical margin
    all_port_xs = [p['vx'] for p in ports]
    min_px, max_px = min(all_port_xs), max(all_port_xs)
    margin = max(65.0, target_pitch * 0.42)
    new_vx0 = min(vx0 + pole_dx[0], min_px - margin)
    new_vx1 = max(vx0 + vw + pole_dx[-1], max_px + margin)
    catalog_entry['vb'] = [round(new_vx0, 2), round(vy0, 2), round(new_vx1 - new_vx0, 2), round(vh, 2)]

    xml_out = '<?xml version="1.0"?>\n' + ET.tostring(root, encoding='unicode')
    return xml_out, catalog_entry


def build_unified_website_zip(
    input_website_zip="electrical-simu-ckt-main (34).zip",
    output_website_zip="electrical-simu-ckt-main-aligned.zip"
):
    work_dir = "build_workspace_aligned"
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(work_dir, exist_ok=True)

    with zipfile.ZipFile(input_website_zip, 'r') as zf:
        zf.extractall(work_dir)

    site_root = os.path.join(work_dir, "electrical-simu-ckt-main")
    app_js_path = os.path.join(site_root, "app.js")

    with open(app_js_path, 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()

    # Locate SVG_TERMINAL_CATALOG and SVG_INLINE_CATALOG lines in app.js
    term_line_idx = next(i for i, l in enumerate(lines) if l.startswith("const SVG_TERMINAL_CATALOG ="))
    inl_line_idx = next(i for i, l in enumerate(lines) if l.startswith("const SVG_INLINE_CATALOG ="))

    term_cat = json.loads(lines[term_line_idx].split("=", 1)[1].strip().rstrip(";"))
    inl_cat = json.loads(lines[inl_line_idx].split("=", 1)[1].strip().rstrip(";"))

    # Find all SVG files inside components/
    svg_paths = []
    for r, _, files in os.walk(os.path.join(site_root, "components")):
        for file in files:
            if file.lower().endswith(".svg"):
                svg_paths.append(os.path.join(r, file))

    # Process each canonical/numbered SVG in the catalog
    updated_count = 0
    for svg_path in svg_paths:
        fname = os.path.basename(svg_path).lower()
        canon = re.sub(r'\s*\(\d+\)(?=\.svg$)', '', fname).replace(' _', '_')

        cat_key = fname if fname in term_cat else (canon if canon in term_cat else None)
        if not cat_key:
            continue

        with open(svg_path, 'r', encoding='utf-8') as f:
            raw_svg = f.read()

        entry_copy = json.loads(json.dumps(term_cat[cat_key]))
        new_svg, new_entry = align_component_svg_and_ports(raw_svg, entry_copy, canon)

        # Write updated SVG back to disk
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(new_svg)

        # Update both numbered and canonical keys in SVG_TERMINAL_CATALOG and SVG_INLINE_CATALOG
        for k in set([fname, canon]):
            if k in term_cat:
                term_cat[k] = new_entry
            if k in inl_cat:
                vb_tuple = new_entry['vb']
                inner_match = re.search(r'<svg[^>]*>(.*)</svg>', new_svg, re.DOTALL | re.IGNORECASE)
                inner_xml = inner_match.group(1).strip() if inner_match else inl_cat[k]['inner']
                inl_cat[k] = {
                    "vb": f"{vb_tuple[0]} {vb_tuple[1]} {vb_tuple[2]} {vb_tuple[3]}",
                    "inner": inner_xml
                }
        updated_count += 1

    # Write updated catalogs back into app.js
    lines[term_line_idx] = "const SVG_TERMINAL_CATALOG = " + json.dumps(term_cat, separators=(',', ':')) + ";"
    lines[inl_line_idx] = "const SVG_INLINE_CATALOG = " + json.dumps(inl_cat, separators=(',', ':')) + ";"

    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines) + "\n")

    # Package the complete website into a single ZIP
    with zipfile.ZipFile(output_website_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for r, _, files in os.walk(work_dir):
            for file in files:
                full_path = os.path.join(r, file)
                rel_path = os.path.relpath(full_path, work_dir)
                zf.write(full_path, arcname=rel_path)

    print(f"✅ Successfully updated {updated_count} SVGs and synchronized app.js catalogs!")
    print(f"✅ Ready-to-upload website archive created: {output_website_zip}")

if __name__ == "__main__":
    build_unified_website_zip()
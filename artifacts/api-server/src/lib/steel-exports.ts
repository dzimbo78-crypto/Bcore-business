/**
 * SteelVision quotation artefacts. No third-party PDF engine is required.
 * JSON is the lossless editable source; CSV contains every primitive field.
 * PDF is a human-readable concept / QA report, never a structural certificate.
 */
type ObjectMap = Record<string, unknown>;
const obj = (x: unknown): ObjectMap => x && typeof x === "object" && !Array.isArray(x) ? x as ObjectMap : {};
const arr = (x: unknown): unknown[] => Array.isArray(x) ? x : [];
const asText = (x: unknown) => x == null ? "" : String(x);

function flatten(value: unknown, path = "project", rows: string[][] = []): string[][] {
  if (Array.isArray(value)) {
    if (!value.length) rows.push([path, "[]"]);
    else value.forEach((v, i) => flatten(v, path + "[" + i + "]", rows));
  } else if (value && typeof value === "object") {
    const fields = Object.entries(value);
    if (!fields.length) rows.push([path, "{}"]);
    else fields.forEach(([key, v]) => flatten(v, path + "." + key, rows));
  } else {
    rows.push([path, value === null ? "null" : asText(value)]);
  }
  return rows;
}

function escapeCsv(cell: unknown): string {
  let text = asText(cell);
  // Protect spreadsheet applications from interpreting customer text as formulas.
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
function csvFromDesign(design: ObjectMap): string {
  const rows = [["Field / Pole", "Value / Wartosc"], ...flatten(design, "design")];
  return "\ufeff" + rows.map((r) => r.map(escapeCsv).join(";")).join("\r\n") + "\r\n";
}
function latinText(value: unknown): string {
  return asText(value).replaceAll("ł", "l").replaceAll("Ł", "L")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "?");
}
function pdfEscape(text: string): string {
  return latinText(text).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}
function wrap(text: string, width = 100): string[] {
  const out: string[] = [];
  for (const logicalLine of latinText(text).split(/\r?\n/)) {
    const words = logicalLine.split(/\s+/);
    let line = "";
    for (let word of words) {
      while (word.length > width) {
        if (line) { out.push(line); line = ""; }
        out.push(word.slice(0, width));
        word = word.slice(width);
      }
      if ((line + " " + word).trim().length > width) {
        out.push(line);
        line = word;
      } else line = line ? line + " " + word : word;
    }
    out.push(line);
  }
  return out;
}
type PlanSheet = { title: string; geometry: string; notes: string[] };
function buildPlanSheets(design: ObjectMap): PlanSheet[] {
  const items = arr(obj(design.state).items);
  return items.flatMap((entry, index): PlanSheet[] => {
    const item = obj(entry);
    const rawSegments = arr(item.segments);
    if (!rawSegments.length) return [];
    const points: number[][] = [[0,0]];
    const labels: string[] = [];
    for (const raw of rawSegments) {
      const segment = obj(raw), distance = Number(segment.length), angle = Number(segment.angle || 0);
      if (!Number.isFinite(distance) || !Number.isFinite(angle) || distance <= 0 || distance > 200) continue;
      const p = points[points.length - 1];
      points.push([p[0] + distance * Math.cos(angle * Math.PI / 180),
        p[1] + distance * Math.sin(angle * Math.PI / 180)]);
      labels.push(take(segment.name || "Segment", 35) + " " + distance.toFixed(3) + " m @ " + angle + " deg");
    }
    if (points.length < 2) return [];
    const xs=points.map(p=>p[0]), ys=points.map(p=>p[1]);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    const width=Math.max(.15,maxX-minX),height=Math.max(.15,maxY-minY);
    const scale=Math.min(495/width,420/height,150);
    const tx=(595-width*scale)/2-minX*scale,ty=240+(420-height*scale)/2-minY*scale;
    const p=(xy:number[])=>[(tx+xy[0]*scale).toFixed(2),(ty+xy[1]*scale).toFixed(2)];
    const from=p(points[0]);
    const geom = ["q","6 w","0.72 0.49 0.29 RG",from[0]+" "+from[1]+" m",
      ...points.slice(1).map(xy=>{const v=p(xy);return v[0]+" "+v[1]+" l"}),
      "S","Q"].join("\n")+"\n";
    return [{ title:(index+1)+". "+take(item.name||item.type||"Linear element",55),
      geometry:geom, notes:labels }];
  });
}

function createPdf(lines: string[], plans: PlanSheet[] = []): Buffer {
  const wrapped = lines.flatMap((line) => wrap(line));
  const perPage = 49;
  const pages: Array<{lines: string[]; graphics?: string}> = [];
  for (let i = 0; i < wrapped.length; i += perPage) pages.push({lines:wrapped.slice(i, i + perPage)});
  if (!pages.length) pages.push({lines:["STEELVISION - PROJECT REPORT"]});
  for(const plan of plans){
    pages.push({lines:["STEELVISION - TOP VIEW / RZUT Z GORY",plan.title,
      "SCHEMATIC ONLY - not a fabrication drawing.","",
      ...plan.notes.slice(0,23)],graphics:plan.geometry});
  }
  // Object 1: catalog; 2: page tree; 3: font; pages then content streams.
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ];
  const kids: string[] = [];
  pages.forEach((page, index) => {
    const pageObject = 4 + index * 2, streamObject = pageObject + 1;
    kids.push(pageObject + " 0 R");
    const stream = "BT\n/F1 9 Tf\n12 TL\n42 789 Td\n" +
      page.lines.map((line) => "(" + pdfEscape(line) + ") Tj\nT*\n").join("") +
      "ET\n" + (page.graphics || "");
    objects.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] " +
      "/Resources << /Font << /F1 3 0 R >> >> /Contents " + streamObject + " 0 R >>");
    objects.push("<< /Length " + Buffer.byteLength(stream, "ascii") + " >>\nstream\n" + stream + "endstream");
  });
  objects[1] = "<< /Type /Pages /Count " + pages.length + " /Kids [" + kids.join(" ") + "] >>";
  const chunks = [Buffer.from("%PDF-1.4\n", "ascii")], offsets = [0];
  let offset = chunks[0].length;
  for (let i = 0; i < objects.length; i++) {
    offsets.push(offset);
    const chunk = Buffer.from((i + 1) + " 0 obj\n" + objects[i] + "\nendobj\n", "ascii");
    chunks.push(chunk); offset += chunk.length;
  }
  const xrefPosition = offset;
  const xref = "xref\n0 " + offsets.length + "\n0000000000 65535 f \n" +
    offsets.slice(1).map((n) => String(n).padStart(10, "0") + " 00000 n \n").join("") +
    "trailer\n<< /Size " + offsets.length + " /Root 1 0 R >>\n" +
    "startxref\n" + xrefPosition + "\n%%EOF\n";
  chunks.push(Buffer.from(xref, "ascii"));
  return Buffer.concat(chunks);
}
function take(x: unknown, max = 300): string {
  return asText(x).replace(/[\r\n]+/g, " ").slice(0, max);
}
function reportLines(contact: ObjectMap, design: ObjectMap, reference: string, generatedAt: string): string[] {
  const project = obj(design.project), state = obj(design.state), report = obj(design.report);
  const lines = [
    "B-CORE | STEELVISION STUDIO - QUOTATION REPORT",
    "Reference: " + reference + " | Generated: " + generatedAt,
    "STATUS: Concept / initial RFQ. NOT approved for construction or fabrication.",
    "",
    "CONTACT", "Name: " + take(contact.name), "Email: " + take(contact.email),
    "Phone: " + take(contact.phone),
    "Subject: " + take(contact.category),
    "Message: " + take(contact.message, 1200),
    "",
    "PROJECT",
  ];
  Object.entries(project).forEach(([key, value]) => lines.push(key + ": " + take(value, 350)));
  lines.push("", "ITEMS");
  arr(state.items).forEach((entry, i) => {
    const item = obj(entry);
    lines.push((i + 1) + ". " + take(item.name) + " / " + take(item.type) +
      " | qty " + take(item.qty) + " | shape " + take(item.shape));
    for (const field of ["material","postProfile","topProfile","bottomProfile","infill",
      "postSpacing","designLineLoad","mountType","anchorType","substrate","finish","engineeringApproval"]) {
      if (item[field] !== undefined) lines.push("  " + field + ": " + take(item[field]));
    }
    arr(item.segments).forEach((segment, j) => {
      const s = obj(segment);
      lines.push("  Segment " + (j + 1) + ": " + take(s.name) + " / " + take(s.length) +
        " m / angle " + take(s.angle) + " deg / joint " + take(s.jointType) +
        " / gap " + take(s.jointGap) + " mm");
    });
  });
  lines.push("", "AUTOMATIC GEOMETRY CORRECTIONS (before -> after)");
  const corrections = arr(report.corrections);
  if (!corrections.length) lines.push("None made automatically.");
  corrections.forEach((entry) => {
    const c = obj(entry);
    lines.push(take(c.item) + " | " + take(c.code) + " | " +
      take(c.field) + ": " + take(c.before) + " -> " + take(c.after) +
      " | " + take(c.reason, 250));
  });
  lines.push("", "ENGINEERING / INTEGRITY VALIDATION");
  const validation = obj(report.validation);
  lines.push("Blockers: " + take(validation.blockers) + " | Warnings: " + take(validation.warnings));
  arr(validation.issues).slice(0, 80).forEach((entry) => {
    const issue = obj(entry);
    lines.push(" - " + take(issue.itemName) + " / " + take(issue.sev) +
      " / " + take(issue.code) + ": " + take(issue.msg, 280));
  });
  const integrity = obj(report.integrity);
  lines.push("Consistency checks: " + take(integrity.passed) + "/" + take(integrity.total));
  arr(integrity.issues).slice(0, 80).forEach((entry) => {
    const issue = obj(entry);
    lines.push(" - " + take(issue.name) + ": " + take(issue.msg, 280));
  });
  lines.push("", "Open engineering questions and suggested checks:");
  arr(report.recommendations).slice(0, 80).forEach((entry) => lines.push(" - " + take(entry, 300)));
  lines.push("", "Full lossless project data: attached JSON; all source fields: attached CSV.",
    "No automatic structural capacity approval. Confirm EN 1990/1991/1993, EN 1090,",
    "connections, supports, anchors, materials, local regulations and site conditions.",
    "Geometry adjustments are preliminary and need designer / manufacturer review.");
  return lines;
}

export function steelAttachments(contact: ObjectMap, design: ObjectMap, reference: string) {
  const prefix = reference.replace(/[^A-Za-z0-9_-]/g, "_");
  // Stable bytes matter for provider idempotency: a retry with identical
  // quoteId must not produce different timestamps and a 409 conflict.
  const report = obj(design.report);
  const date = typeof report.createdAt === "string" && !Number.isNaN(Date.parse(report.createdAt))
    ? new Date(report.createdAt).toISOString() : "1970-01-01T00:00:00.000Z";
  const json = JSON.stringify({ reference, contact, design, generatedAt: date }, null, 2);
  const csv = csvFromDesign({ reference, contact, ...design });
  const pdf = createPdf(reportLines(contact, design, reference, date), buildPlanSheets(design));
  return [
    { filename: prefix + "_SteelVision_Report.pdf", content: pdf.toString("base64") },
    { filename: prefix + "_SteelVision_Full_Data.csv", content: Buffer.from(csv, "utf8").toString("base64") },
    { filename: prefix + "_SteelVision_Full_Project.json", content: Buffer.from(json, "utf8").toString("base64") },
  ];
}

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
  const drawings = arr(state.detailSheets);
  if (drawings.length) {
    lines.push("", "EDITABLE DETAILING SHEETS / DETALE BALUSTRAD");
    drawings.slice(0,60).forEach((entry,i) => {
      const v=obj(entry), d=obj(v.drawing), geometry=arr(d.segments);
      const amount=geometry.reduce<number>((n,x)=>n+Number(obj(x).lengthMm||0),0);
      lines.push("  Sheet "+(i+1)+": "+take(d.name||v.itemName)+
        " / "+amount.toFixed(0)+" mm / "+arr(d.objects).length+" objects / REV "+take(d.revision));
    });
    lines.push("Mounts are editable customer geometry; strength and anchors are not verified.");
  }
  arr(report.detailerWarnings).slice(0,60).forEach((entry) =>
    lines.push("DETAILER PROFILE DISCREPANCY: " + take(entry,250)));
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

/** Converts editable SteelVision Detailer v3 sheets to printable PDF vector
 * geometry. Values are customer-supplied concept dimensions, never approvals. */
function buildDetailerSheets(design: ObjectMap): PlanSheet[] {
  const raw = arr(obj(design.state).detailSheets).slice(0, 60);
  const N = (v: unknown, min: number, max: number, fallback = min) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const P = (n: number) => n.toFixed(2);
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    `${P(x1)} ${P(y1)} m ${P(x2)} ${P(y2)} l S`;
  const rect = (x: number, y: number, w: number, h: number) =>
    `${P(x)} ${P(y)} ${P(w)} ${P(h)} re S`;
  const circle = (x: number, y: number, radius: number) => {
    const r = Math.max(.7, radius), k = 0.55228474983 * r;
    return `${P(x+r)} ${P(y)} m ${P(x+r)} ${P(y+k)} ${P(x+k)} ${P(y+r)} ${P(x)} ${P(y+r)} c ` +
      `${P(x-k)} ${P(y+r)} ${P(x-r)} ${P(y+k)} ${P(x-r)} ${P(y)} c ` +
      `${P(x-r)} ${P(y-k)} ${P(x-k)} ${P(y-r)} ${P(x)} ${P(y-r)} c ` +
      `${P(x+k)} ${P(y-r)} ${P(x+r)} ${P(y-k)} ${P(x+r)} ${P(y)} c S`;
  };
  const label = (x: number, y: number, size: number, value: unknown) =>
    `BT /F1 ${size} Tf ${P(x)} ${P(y)} Td (${pdfEscape(take(value, 120))}) Tj ET`;
  return raw.flatMap((sheet, idx): PlanSheet[] => {
    const s = obj(sheet), d = obj(s.drawing);
    if (d.app !== "steelvision-detailer" || d.schema !== 3) return [];
    const segments = arr(d.segments).slice(0, 30).map(obj).filter(x => Number(x.lengthMm)>0);
    if (!segments.length) return [];
    const total = segments.reduce((sum, x) => sum + N(x.lengthMm, 50, 30000), 0);
    if (!Number.isFinite(total) || total <= 0) return [];
    const h = N(d.heightMm, 350, 3500, 1120), objects = arr(d.objects).slice(0, 400).map(obj);
    const scale = Math.min(475 / total, 184 / h), X = (x: number) => 54 + x * scale;
    const Y = (z: number) => 363 + z * scale;
    const commands = ["q", "0.10 0.34 0.53 RG", "0.8 w", label(50, 655, 12, "STEELVISION - DETAIL DRAWING / RYSUNEK BALUSTRADY"),
      label(50, 642, 8, "Front unfolded elevation - dimensions in mm (concept only)"),
      rect(X(0),Y(0),total*scale,h*scale),
      line(X(0),Y(h-90),X(total),Y(h-90)),line(X(0),Y(60),X(total),Y(60)),
      "0.06 0.47 0.66 RG", "1.4 w"];
    let posts=0,fixings=0;
    for (const entry of objects) {
      const kind=String(entry.kind||""),x=N(entry.xMm,0,total,0),z=N(entry.zMm,-1000,5000,0);
      if(kind==="post"){
        posts++;
        commands.push(line(X(x),Y(0),X(x),Y(h)));
      }
      if (["plate","under","wall"].includes(kind)) {
        fixings++;
        const w=N(entry.plateWidthMm,10,1000,120),ht=N(entry.plateHeightMm,10,1000,25),n=Math.floor(N(entry.holeCount,0,16,2)),diam=N(entry.holeDiaMm,0,120,10);
        const cx=X(x),cy=Y(z),pw=Math.max(2,w*scale),ph=Math.max(2,ht*scale);
        commands.push(rect(cx-pw/2,cy-ph/2,pw,ph));
        for(let j=0;j<n;j++) commands.push(circle(cx-pw/2+(j+1)*pw/(n+1),cy,Math.max(.8,diam*scale/2)));
        if(kind==="under")commands.push(line(cx,Y(0),cx,Y(-N(entry.dropMm,0,1500,170))));
      }
      if(kind==="support")commands.push(line(X(x),Y(0),X(x),Y(-N(entry.dropMm,0,1500,170))));
    }
    commands.push("0.72 0.32 0.17 RG","0.6 w",line(X(0),334,X(total),334),line(X(0),330,X(0),338),line(X(total),330,X(total),338),
      label(215,324,10,`${Math.round(total)} mm`),label(50,613,9,`Posts: ${posts} | Mountings: ${fixings} | Height: ${Math.round(h)} mm`));
    // Plan view follows the true segment angles, not just the unfolded length.
    const points: number[][]=[[0,0]];
    for(const seg of segments){const prev=points[points.length-1];const a=N(seg.angleDeg,-360,360)*Math.PI/180,l=N(seg.lengthMm,50,30000);
      points.push([prev[0]+l*Math.cos(a),prev[1]+l*Math.sin(a)]);}
    const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
    const sx=Math.max(1,Math.max(...xs)-Math.min(...xs)),sy=Math.max(1,Math.max(...ys)-Math.min(...ys));
    const factor=Math.min(320/sx,100/sy,1);const xx=(v:number)=>100+(v-Math.min(...xs))*factor, yy=(v:number)=>195+(v-Math.min(...ys))*factor;
    commands.push("0.18 0.43 0.59 RG","1.5 w",label(50,303,10,"PLAN VIEW / RZUT Z GORY"));
    for(let i=1;i<points.length;i++)commands.push(line(xx(points[i-1][0]),yy(points[i-1][1]),xx(points[i][0]),yy(points[i][1])));
    const firstFixing=objects.find(o=>["plate","under","wall"].includes(String(o.kind)));
    if(firstFixing){const w=N(firstFixing.plateWidthMm,10,1000,120),ht=N(firstFixing.plateHeightMm,10,1000,25),n=Math.floor(N(firstFixing.holeCount,0,16,2)),diam=N(firstFixing.holeDiaMm,0,120,10);
      const sc=Math.min(100/w,30/ht,2);
      const rw=w*sc,rh=ht*sc,x=460-rw/2,y=225;
      commands.push(label(402,303,10,"MOUNTING DETAIL (sample)"),rect(x,y,rw,rh));
      for(let j=0;j<n;j++)commands.push(circle(x+(j+1)*rw/(n+1),y+rh/2,Math.max(1,diam*sc/2)));
      commands.push(label(402,207,8,`${Math.round(w)} x ${Math.round(ht)} mm / ${n} x dia ${Math.round(diam)} mm`));
    }
    commands.push(label(50,120,8,"NOT APPROVED FOR FABRICATION. ENGINEER: verify loads, anchors, welds and concrete."),"Q");
    const detailedMounts = objects.filter(o => ["plate","wall","under","support"].includes(String(o.kind)));
    const schedules: PlanSheet[] = [];
    // Every fixing is represented by kind, face, X/Z, plate and hole geometry.
    // Keep pagination bounded: full lossless schedule always remains in JSON/CSV.
    const perSchedule = 19, maxPages = 22, countPages = Math.min(maxPages,Math.ceil(detailedMounts.length/perSchedule));
    for (let page=0;page<countPages;page++) {
      const rows = detailedMounts.slice(page*perSchedule,(page+1)*perSchedule).map((o,j) =>
        String(page*perSchedule+j+1).padStart(2,"0") + " " +
        take(o.label||o.kind,28) + " / "+take(o.kind,14) + " / face "+take(o.face||"front",12) +
        " / X "+Math.round(N(o.xMm,0,total,0)) + " / Z "+Math.round(N(o.zMm,-1000,5000,0)) +
        " / "+Math.round(N(o.plateWidthMm,10,1000,120))+"x"+Math.round(N(o.plateHeightMm,10,1000,25))+
        " / "+Math.floor(N(o.holeCount,0,16,2))+"x dia"+Math.round(N(o.holeDiaMm,0,120,10))+
        " / projection "+Math.round(N(o.projectionMm,0,2000,0))+
        " / drop "+Math.round(N(o.dropMm,0,1500,0)));
      if(page===countPages-1&&detailedMounts.length>perSchedule*maxPages)
        rows.push("Further "+(detailedMounts.length-perSchedule*maxPages)+" fixings: see attached JSON/CSV.");
      schedules.push({
        title:"STEELVISION DETAILER - MOUNTING SCHEDULE "+(page+1)+"/"+countPages,
        geometry:"",
        notes:["Railing: "+take(d.name||s.itemName||"Railing",48), "All coordinates in mm (unfolded station); concept only.",
          ...rows,"No automatic approval of wall/slab anchors or welds."]
      });
    }
    return [{title:`SteelVision Detailer v3 - ${idx+1}. ${take(d.name||s.itemName||"Railing",45)}`,
      geometry:commands.join("\n")+"\n",
      notes:[`Qty: ${N(d.quantity,1,100,1)} | Rev: ${take(d.revision||"A",12)} | Finish: ${take(d.finish,50)}`,
        `Length: ${Math.round(total)} mm | Elevation: ${Math.round(h)} mm`,
        `Profile top/bottom: ${take(d.topRail,30)}/${take(d.bottomRail,30)}, post: ${take(d.postProfile,30)}`,
        `Attachment locations and holes must be checked against site and material.`]},
      ...schedules];
  });
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
  const pdf = createPdf(reportLines(contact, design, reference, date), [...buildPlanSheets(design), ...buildDetailerSheets(design)]);
  return [
    { filename: prefix + "_SteelVision_Report.pdf", content: pdf.toString("base64") },
    { filename: prefix + "_SteelVision_Full_Data.csv", content: Buffer.from(csv, "utf8").toString("base64") },
    { filename: prefix + "_SteelVision_Full_Project.json", content: Buffer.from(json, "utf8").toString("base64") },
  ];
}

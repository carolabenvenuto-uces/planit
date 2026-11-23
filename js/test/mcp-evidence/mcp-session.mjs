// Sesion de QA contra el servidor oficial @playwright/mcp por stdio (protocolo MCP).
// Uso: node mcp-session.mjs <raiz-del-sitio> <directorio-de-salida>
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const [root, outDir] = process.argv.slice(2).map((p) => path.resolve(p));
fs.mkdirSync(outDir, { recursive: true });

// Servidor estatico equivalente a Live Server en el puerto 5500.
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(5500);

const serverCmd = { command: "npx", args: ["-y", "@playwright/mcp@latest", "--headless", "--browser", "chromium", "--output-dir", "."] };
const transport = new StdioClientTransport({ ...serverCmd, cwd: outDir });
const client = new Client({ name: "planit-qa-client", version: "1.0.0" });
const log = { startedAt: new Date().toISOString(), mcpServerLaunch: serverCmd, calls: [], assertions: [] };

await client.connect(transport);
log.serverInfo = client.getServerVersion();
log.toolsListed = (await client.listTools()).tools.map((t) => t.name);

let n = 0;
async function call(name, args) {
  const request = { jsonrpc: "2.0", method: "tools/call", params: { name, arguments: args } };
  const t0 = Date.now();
  const result = await client.callTool({ name, arguments: args });
  const text = (result.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
  const entry = {
    step: ++n,
    request,
    durationMs: Date.now() - t0,
    response: {
      isError: !!result.isError,
      content: (result.content || []).map((c) => (c.type === "text" ? c : { type: c.type, mimeType: c.mimeType, bytes: c.data ? Buffer.from(c.data, "base64").length : 0 })),
    },
  };
  log.calls.push(entry);
  console.log(`#${n} ${name} -> ${result.isError ? "ERROR" : "ok"} (${entry.durationMs} ms)`);
  if (result.isError) throw new Error(`${name} fallo: ${text}`);
  return text;
}
function assert(desc, ok, actual) {
  log.assertions.push({ desc, ok, actual });
  console.log(`${ok ? "PASS" : "FAIL"} ${desc} :: ${JSON.stringify(actual)}`);
}
function resultOf(t) {
  const m = t.match(/### Result\s*\n```(?:json)?\s*\n([\s\S]*?)\n```/) || t.match(/### Result\s*\n([\s\S]*?)(\n###|$)/);
  return m ? JSON.parse(m[1].trim()) : null;
}
const lines = (t, re) => t.split("\n").filter((l) => re.test(l)).map((l) => l.trim());

try {
  await call("browser_navigate", { url: "http://localhost:5500/index.html" });
  const snapCat = await call("browser_snapshot", { target: "#contenedor-catalogo" });
  const nSumar = (snapCat.match(/button "Sumar al Evento"/g) || []).length;
  assert("Snapshot del catalogo lista 3 botones 'Sumar al Evento'", nSumar === 3, nSumar);

  // Flujo 1: Sumar al Evento desde una tarjeta -> Toast
  await call("browser_click", { element: "Boton 'Sumar al Evento' de Gourmet Finger Food", target: '.btn-sumar-evento[data-service-title="Gourmet Finger Food"]' });
  await call("browser_wait_for", { text: "Gourmet Finger Food · $3.500 / pax", time: 10 });
  const toastSnap = await call("browser_snapshot", { target: "#toastConfirmacion" });
  assert("Snapshot del Toast contiene servicio y mensaje", toastSnap.includes("Gourmet Finger Food · $3.500 / pax") && toastSnap.includes("Experiencia agregada a tu evento"), lines(toastSnap, /Gourmet|Experiencia/));
  const toastState = resultOf(await call("browser_evaluate", {
    element: "Toast de confirmacion",
    target: "#toastConfirmacion",
    function: "(el) => ({ visible: el.classList.contains('show'), servicio: document.getElementById('toastConfirmacionServicio').textContent, mensaje: document.getElementById('toastConfirmacionMensaje').textContent, dataTitle: el.dataset.serviceTitle, dataPrice: el.dataset.servicePrice })",
  }));
  assert("Toast visible (.show) con dataset del servicio", toastState?.visible === true && toastState.dataTitle === "Gourmet Finger Food" && toastState.dataPrice === "$3.500 / pax", toastState);
  await call("browser_take_screenshot", { type: "png", filename: "mcp-01-toast.png", scale: "css" });

  // Flujo 2: Ver detalle -> Modal con los datos de la tarjeta
  await call("browser_click", { element: "Boton 'Ver detalle' de Flores Pilar", target: '.btn-ver-detalle[data-service-title="Flores Pilar"]' });
  await call("browser_wait_for", { text: "1 jornada de montaje", time: 10 });
  const modalSnap = await call("browser_snapshot", { target: "#modalDetalleServicio" });
  assert("Snapshot del Modal muestra el dialogo de Flores Pilar con su precio", /dialog "Flores Pilar"/.test(modalSnap) && modalSnap.includes("$70.000 / base"), lines(modalSnap, /dialog|70\.000|jornada/));
  const modalState = resultOf(await call("browser_evaluate", {
    element: "Modal de detalle de servicio",
    target: "#modalDetalleServicio",
    function: "(el) => ({ abierto: el.classList.contains('show'), titulo: document.getElementById('modalDetalleServicioTitulo').textContent, capacidad: document.getElementById('modalDetalleServicioCapacidad').textContent, duracion: document.getElementById('modalDetalleServicioDuracion').textContent, precio: document.getElementById('modalDetalleServicioPrecio').textContent, sumarDataTitle: el.querySelector('.btn-sumar-evento').dataset.serviceTitle })",
  }));
  assert("Modal abierto con los data-service-* de Flores Pilar", modalState?.abierto === true && modalState.titulo === "Flores Pilar" && modalState.duracion === "1 jornada de montaje" && modalState.precio === "$70.000 / base" && modalState.sumarDataTitle === "Flores Pilar", modalState);
  await call("browser_take_screenshot", { type: "png", filename: "mcp-02-modal.png", scale: "css" });

  // Flujo 3: Sumar al Evento desde el Modal -> Toast con el servicio del Modal
  await call("browser_click", { element: "Boton 'Sumar al Evento' dentro del Modal", target: "#modalDetalleServicio .btn-sumar-evento" });
  await call("browser_wait_for", { text: "Flores Pilar · $70.000 / base", time: 10 });
  const final = resultOf(await call("browser_evaluate", {
    function: "() => ({ modalAbierto: document.getElementById('modalDetalleServicio').classList.contains('show'), toastVisible: document.getElementById('toastConfirmacion').classList.contains('show'), toastServicio: document.getElementById('toastConfirmacionServicio').textContent })",
  }));
  assert("Toast muestra el servicio sumado desde el Modal", final?.toastVisible === true && final.toastServicio === "Flores Pilar · $70.000 / base", final);
  await call("browser_take_screenshot", { type: "png", filename: "mcp-03-toast-desde-modal.png", scale: "css" });

  log.consoleErrors = await call("browser_console_messages", { level: "error" });
} catch (e) {
  log.error = String(e?.stack || e);
  console.error(e);
} finally {
  try { await call("browser_close", {}); } catch {}
  await client.close();
  server.close();
  log.finishedAt = new Date().toISOString();
  log.verdict = !log.error && log.assertions.length > 0 && log.assertions.every((a) => a.ok) ? "PASS" : "FAIL";
  fs.writeFileSync(path.join(outDir, "mcp-session-log.json"), JSON.stringify(log, null, 2));
  console.log("VEREDICTO:", log.verdict, `(${log.assertions.filter((a) => a.ok).length}/${log.assertions.length} aserciones)`);
  process.exit(log.verdict === "PASS" ? 0 : 1);
}

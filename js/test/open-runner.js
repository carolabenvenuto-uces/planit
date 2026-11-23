/**
 * Abre js/test/test-runner.html en un Chromium con ventana visible (Playwright) para
 * inspeccionar la suite de Jasmine en su reporter HTML. La ventana queda abierta hasta
 * que se la cierra a mano.
 *
 * Uso (desde la raíz del repositorio, tras `npm ci` y `npm run test:install-browsers`):
 *   npm run test:browser
 *
 * Alternativa sin Node: abrir js/test/test-runner.html directamente en cualquier navegador.
 */
const { chromium } = require("playwright");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    const runnerPath = path.resolve(__dirname, "test-runner.html");
    await page.goto(pathToFileURL(runnerPath).href);
    console.log("test-runner.html abierto. Cerrá la ventana del navegador para terminar.");
    page.on("close", async () => {
        await browser.close();
        process.exit(0);
    });
    browser.on("disconnected", () => process.exit(0));
})();

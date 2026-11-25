/**
 * Genera las capturas de evidencia del test runner (AO4) usando la librería
 * Playwright (la misma que ya usa run-jasmine.js) para abrir test-runner.html
 * en un Chromium headless y guardar los PNG en js/test/screenshots/.
 *
 * Uso: node js/test/take-screenshots.js
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    const runnerPath = path.resolve(__dirname, "test-runner.html");
    const url = "file:///" + runnerPath.replace(/\\/g, "/");
    await page.goto(url);
    await page
        .waitForFunction(() => {
            const bar = document.querySelector(".jasmine-overall-result");
            return bar && bar.textContent && bar.textContent.trim().length > 0;
        }, { timeout: 15000 })
        .catch(() => {});
    await page.waitForTimeout(300);

    const outDir = path.resolve(__dirname, "screenshots");
    fs.mkdirSync(outDir, { recursive: true });

    await page.screenshot({ path: path.join(outDir, "ao4-general.png"), fullPage: true });

    const suites = [
        { label: "models.spec.js", file: "ao4-models.png" },
        { label: "Almacenamiento", file: "ao4-storage.png" },
        { label: "script.spec.js", file: "ao4-script.png" }
    ];

    for (const suite of suites) {
        const handle = await page.evaluateHandle((label) => {
            const detail = Array.from(document.querySelectorAll(".jasmine-suite-detail")).find(
                (el) => el.textContent.trim() === label
            );
            return detail ? detail.closest(".jasmine-suite") : null;
        }, suite.label);

        const element = handle.asElement();
        if (!element) {
            console.log("No se encontró el suite:", suite.label);
            continue;
        }
        await element.screenshot({ path: path.join(outDir, suite.file) });
        console.log("Guardado:", suite.file);
    }

    await browser.close();
})();

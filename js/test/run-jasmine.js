/**
 * Ejecuta la suite de Jasmine de js/test/test-runner.html en un Chromium headless
 * (Playwright) y vuelca el resumen final en la consola.
 *
 * Uso (desde la raíz del repositorio, con las dependencias de devDependencies instaladas
 * y los navegadores de Playwright descargados con `npx playwright install chromium`):
 *   node js/test/run-jasmine.js
 *
 * Evidencia de uso: docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md (RC13, PR #82).
 */
const { chromium } = require("playwright");
const path = require("path");

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push("pageerror: " + err.message));
    page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push("console.error: " + msg.text());
    });

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

    const summary = await page.evaluate(() => {
        const overall = document.querySelector(".jasmine-overall-result");
        const failedSpecs = Array.from(
            document.querySelectorAll(".jasmine-spec-detail.jasmine-failed .jasmine-description")
        ).map((e) => e.textContent);
        return {
            overallText: overall ? overall.textContent.trim() : null,
            failedSpecs
        };
    });

    console.log(summary.overallText);
    if (summary.failedSpecs.length > 0) {
        console.log("Specs fallidos:", summary.failedSpecs);
    }
    if (consoleErrors.length > 0) {
        console.log("Errores de consola:", consoleErrors);
    }

    await browser.close();
    process.exit(summary.failedSpecs.length > 0 || consoleErrors.length > 0 ? 1 : 0);
})();

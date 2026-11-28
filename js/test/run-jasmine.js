/**
 * Ejecuta la suite de Jasmine de js/test/test-runner.html en un Chromium headless
 * (Playwright) y vuelca el resumen final en la consola.
 *
 * Uso (desde la raíz del repositorio, con las dependencias de devDependencies instaladas
 * y los navegadores de Playwright descargados con `npx playwright install chromium`):
 *   node js/test/run-jasmine.js
 *
 * Código de salida: 0 solo si Jasmine se cargó, la corrida terminó, se ejecutó al menos
 * un spec, ninguno falló, Jasmine no informó errores globales (por ejemplo, en un
 * afterAll) y no hubo errores de consola. En cualquier otro caso, 1. Antes, si Jasmine
 * no llegaba a cargarse (archivo de vendor/ faltante o roto), el script imprimía `null`
 * y terminaba con 0: un falso verde (ver spec-tester-qa-segundo-parcial.md, MOMENTO 2).
 *
 * Evidencia de uso: docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md (RC13, PR #82).
 */
const { chromium } = require("playwright");
const path = require("path");

/** Tiempo máximo para que Jasmine termine la corrida completa. */
const TIMEOUT_CORRIDA_MS = 60000;

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
    // jsApiReporter lo crea boot0.js de Jasmine; `finished` pasa a true al terminar la corrida.
    // goto() espera el evento load, así que a esta altura los scripts ya corrieron: si
    // jsApiReporter no existe, Jasmine no cargó y no hace falta esperar el timeout.
    await page
        .waitForFunction(() => !window.jsApiReporter || window.jsApiReporter.finished,
            null, { timeout: TIMEOUT_CORRIDA_MS })
        .catch(() => {});
    await page.waitForTimeout(300);

    const summary = await page.evaluate(() => {
        const reporter = window.jsApiReporter;
        const jasmineCargado = typeof window.jasmine !== "undefined" && Boolean(reporter);
        const terminado = Boolean(reporter && reporter.finished);
        const specs = terminado ? reporter.specs() : [];
        const detalles = terminado && reporter.runDetails ? reporter.runDetails : {};
        const overall = document.querySelector(".jasmine-overall-result");
        return {
            jasmineCargado,
            terminado,
            ejecutados: specs.filter((s) => s.status === "passed" || s.status === "failed").length,
            estadoGeneral: detalles.overallStatus || null,
            motivoIncompleto: detalles.incompleteReason || null,
            erroresGlobales: (detalles.failedExpectations || []).map((e) => e.message),
            overallText: overall ? overall.textContent.trim() : null,
            failedSpecs: Array.from(
                document.querySelectorAll(".jasmine-spec-detail.jasmine-failed .jasmine-description")
            ).map((e) => e.textContent)
        };
    });

    const problemas = [];
    if (!summary.jasmineCargado) {
        problemas.push("Jasmine no se cargó: revisá las rutas de js/test/vendor/ en test-runner.html.");
    } else if (!summary.terminado) {
        problemas.push("La corrida de Jasmine no terminó en " + TIMEOUT_CORRIDA_MS / 1000 + " s.");
    } else if (summary.ejecutados === 0) {
        problemas.push("No se ejecutó ningún spec.");
    }
    if (summary.estadoGeneral === "incomplete") {
        problemas.push("Corrida incompleta: " + (summary.motivoIncompleto || "sin motivo informado") + ".");
    }

    console.log(summary.overallText || "(Jasmine no informó un resumen)");
    if (summary.failedSpecs.length > 0) {
        console.log("Specs fallidos:", summary.failedSpecs);
    }
    if (summary.erroresGlobales.length > 0) {
        console.log("Errores globales de Jasmine:", summary.erroresGlobales);
    }
    if (consoleErrors.length > 0) {
        console.log("Errores de consola:", consoleErrors);
    }
    problemas.forEach((problema) => console.log("ERROR: " + problema));

    await browser.close();
    const falla = problemas.length > 0 ||
        summary.failedSpecs.length > 0 ||
        summary.erroresGlobales.length > 0 ||
        summary.estadoGeneral === "failed" ||
        consoleErrors.length > 0;
    process.exit(falla ? 1 : 0);
})();

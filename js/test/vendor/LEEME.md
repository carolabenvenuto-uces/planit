# Copias locales de librerías para el test runner

`js/test/test-runner.html` carga estas copias en lugar de pedirlas a un CDN, para cumplir el criterio de la sección 2.1 de `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`: **ningún test depende de la red**. Con el CDN caído, `run-jasmine.js` terminaba con exit 1 por los `console.error` de los scripts que no cargaban.

Los archivos no se modificaron: son copias byte a byte de la versión publicada, con su aviso de licencia original.

| Archivo | Versión | Origen | Verificación | Licencia |
|---|---|---|---|---|
| `bootstrap-5.3.3/bootstrap.bundle.min.js` | Bootstrap 5.3.3 | `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js` (la misma URL de `index.html`) | `sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz`, igual al `integrity` de `index.html` | MIT, en el encabezado del archivo |
| `chartjs-4.4.7/chart.umd.js` | Chart.js 4.4.7 | `https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.js` (la misma URL de `index.html`) | `sha384-zYPBGXwO4633CABX/5Spf6emCKUJCfoOkhOMYyxMsatqQZPnDblmmOewfjsIVWCM`, igual al `integrity` de `index.html` | MIT, en el encabezado del archivo |
| `jasmine-5.10.0/jasmine.js`, `jasmine-html.js`, `boot0.js`, `boot1.js`, `jasmine.css`, `jasmine_favicon.png`, `LICENSE` | Jasmine 5.10.0 | Paquete npm `jasmine-core@5.10.0` (`lib/jasmine-core/`, `images/jasmine_favicon.png` y `LICENSE`) | Tarball con `sha512-MrChbWV5LBo+EaeKwTM1eZ6oYSz1brvFExnRafraEkJkbJ9evbUxABhnIgGQimhpMxhg+BD6QmOvb/e3NXsNdg==`, igual al `dist.integrity` del registro npm | MIT: encabezado en cada `.js` y archivo `LICENSE` (el `.css` no trae encabezado) |

**Por qué Jasmine sale del paquete npm y no de cdnjs.** Antes, el runner usaba los `.min.js` de cdnjs. Esos archivos coinciden con el SRI que publica cdnjs, pero no traen el aviso de licencia, y `jasmine_favicon.png` no existe en cdnjs (404). El paquete npm es la misma versión, conserva la licencia en cada archivo e incluye el favicon.

**Por qué no hay `integrity` en `test-runner.html`.** El runner se abre como `file://`. En ese esquema Chrome no puede hacer la verificación SRI (no hay CORS) y **bloquea** el script con un `console.error`. Por eso la verificación se hace sobre el archivo. Para comprobar que las copias siguen coincidiendo con `index.html`, desde la raíz del repo:

```bash
openssl dgst -sha384 -binary js/test/vendor/bootstrap-5.3.3/bootstrap.bundle.min.js | openssl base64 -A
openssl dgst -sha384 -binary js/test/vendor/chartjs-4.4.7/chart.umd.js | openssl base64 -A
```

Si `index.html` cambia de versión de Bootstrap o de Chart.js, hay que reemplazar la copia correspondiente y actualizar esta tabla.

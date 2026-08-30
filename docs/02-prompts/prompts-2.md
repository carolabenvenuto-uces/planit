# Prompt 2 — Valeria Silva (Desarrollador Frontend y Documentador/UX)

## Modelo utilizado
GitHub Copilot en modo Agente (VS Code)

## Método de prompting
Zero-shot con instrucciones estructuradas (consigna directa con varios
requisitos explícitos, sin ejemplos previos ni razonamiento paso a paso
pedido)

## Prompt exacto

\`\`\`
Copilot, conectate a nuestro mockup en Figma a través del servidor Figma
MCP usando el link indicado en el README principal. Con ese diseño de
Cockpit Operativo, generá la estructura HTML5 semántica y accesible para
index.html. Asegurate de no incluir textos de relleno y de dejar notas
explicativas estructuradas para el CSS y JS futuros.
\`\`\`

## Captura de pantalla
![Prompt enviado a Copilot Agent](capturas/prompt-2-enviado.png)
![Resultado: estructura HTML5 generada](capturas/prompt-2-resultado.png)

## Resultado esperado
Generar la estructura HTML5 semántica y accesible del `index.html` a partir
del mockup de Figma (diseño "Cockpit Operativo"), conectando directamente
al archivo de diseño mediante el servidor MCP de Figma, sin contenido de
relleno (Lorem Ipsum) y con comentarios preparados para las futuras
integraciones de CSS y JavaScript.

## Resultado obtenido
Copilot Agent se conectó exitosamente al mockup vía Figma MCP y generó la
estructura completa del `index.html`, incluyendo: encabezado con logo y
navegación principal, diseño de dos columnas en el área principal
(formulario de carga de eventos a la izquierda, tabla de presupuesto
desglosado a la derecha), sección de catálogo con tarjetas de experiencias,
pie de página con datos académicos y enlaces internos a las
especificaciones (`spec-ux.md`, `spec-frontend.md`). Usó etiquetas
semánticas (`header`, `main`, `footer`, `section`, `article`, `nav`),
jerarquía de títulos con información real (sin Lorem Ipsum), atributos
`alt` descriptivos en imágenes, rutas relativas correctas al mockup, y
comentarios HTML explicativos para las futuras integraciones de CSS y
JavaScript.

## Correcciones manuales realizadas
1. Se enlazaron las imágenes temporales apuntando de forma relativa a la
   ruta física real del mockup
   (`./docs/01-mockup/actividad-obligatoria-1/diseño-inicial.png`).
2. Se añadieron los datos académicos de UCES y el nombre completo de
   Valeria Silva en la sección del pie de página (`<footer>`).
3. Se agregaron y probaron los enlaces relativos directos a las
   especificaciones individuales (`spec-ux.md` y `spec-frontend.md`) en el
   menú del pie de página.

## Archivo(s) o parte del proyecto donde se aplicó
`index.html` (estructura completa del maquetado inicial de la Entrega 1)
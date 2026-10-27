---
name: Sistema de Certificados Digitales · Municipalidad Distrital de Morales
description: Tinturas del escudo sobre una base SaaS clara y cálida; el teal del logotipo para lo que se presiona y las tinturas para codificar datos.
colors:
  primario: "#047488"
  primario-hover: "#035e6e"
  primario-claro: "#e3f0f2"
  tintura-celeste: "#3db7df"
  tintura-celeste-texto: "#0a6488"
  tintura-celeste-claro: "#e4f4fb"
  tintura-verde: "#64a52d"
  tintura-verde-texto: "#3b6f1b"
  tintura-verde-claro: "#ebf4e2"
  tintura-sol: "#e1b232"
  tintura-sol-texto: "#765700"
  tintura-sol-claro: "#fcf3d6"
  tintura-ocre: "#bb946a"
  tintura-ocre-texto: "#76552f"
  tintura-ocre-claro: "#f4ede4"
  escudo-rojo: "#e94d2e"
  exito: "#2e6b2a"
  exito-claro: "#e9f3e8"
  error: "#b3261e"
  error-claro: "#fceceb"
  advertencia: "#7a5000"
  advertencia-claro: "#fff4db"
  neutro-0: "#ffffff"
  neutro-50: "#f8f7f5"
  neutro-100: "#efece8"
  neutro-200: "#ddd8d1"
  neutro-400: "#8b8277"
  neutro-500: "#6b6359"
  neutro-700: "#45403a"
  neutro-900: "#23201c"
  velo: "rgb(35 32 28 / 0.45)"
typography:
  display:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  body-input:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  caption:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  badge:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
  dato:
    fontFamily: "'Libre Franklin', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "8": "3rem"
  alto-control: "2.75rem"
  alto-header: "4rem"
  ancho-sidebar: "15.5rem"
  ancho-formulario: "23.75rem"
  ancho-franja: "0.5rem"
  icono-md: "1.25rem"
components:
  button:
    backgroundColor: "{colors.neutro-0}"
    textColor: "{colors.neutro-900}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
    height: "{spacing.alto-control}"
  button-hover:
    backgroundColor: "{colors.neutro-50}"
  button-primary:
    backgroundColor: "{colors.primario}"
    textColor: "{colors.neutro-0}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
    height: "{spacing.alto-control}"
  button-primary-hover:
    backgroundColor: "{colors.primario-hover}"
  button-sin-borde:
    textColor: "{colors.neutro-500}"
    rounded: "{rounded.sm}"
  button-sin-borde-hover:
    backgroundColor: "{colors.neutro-100}"
    textColor: "{colors.neutro-900}"
  button-icono:
    width: "{spacing.alto-control}"
    height: "{spacing.alto-control}"
    padding: "0"
  input:
    backgroundColor: "{colors.neutro-0}"
    textColor: "{colors.neutro-900}"
    typography: "{typography.body-input}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.75rem"
    height: "{spacing.alto-control}"
  alert-error:
    backgroundColor: "{colors.error-claro}"
    textColor: "{colors.error}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  alert-exito:
    backgroundColor: "{colors.exito-claro}"
    textColor: "{colors.exito}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  alert-advertencia:
    backgroundColor: "{colors.advertencia-claro}"
    textColor: "{colors.advertencia}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  card:
    backgroundColor: "{colors.neutro-0}"
    rounded: "{rounded.lg}"
    padding: "{spacing.5}"
  badge:
    backgroundColor: "{colors.neutro-100}"
    textColor: "{colors.neutro-700}"
    typography: "{typography.badge}"
    rounded: "{rounded.sm}"
    padding: "0 0.5rem"
    height: "1.5rem"
  badge-participacion:
    backgroundColor: "{colors.tintura-celeste-claro}"
    textColor: "{colors.tintura-celeste-texto}"
  badge-practicas:
    backgroundColor: "{colors.tintura-verde-claro}"
    textColor: "{colors.tintura-verde-texto}"
  badge-reconocimiento:
    backgroundColor: "{colors.tintura-sol-claro}"
    textColor: "{colors.tintura-sol-texto}"
  nav-item:
    textColor: "{colors.neutro-700}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.75rem"
    height: "{spacing.alto-control}"
  nav-item-hover:
    backgroundColor: "{colors.neutro-100}"
    textColor: "{colors.neutro-900}"
  nav-item-active:
    backgroundColor: "{colors.primario-claro}"
    textColor: "{colors.primario}"
  header:
    backgroundColor: "{colors.neutro-0}"
    height: "{spacing.alto-header}"
  sidebar:
    backgroundColor: "{colors.neutro-50}"
    width: "{spacing.ancho-sidebar}"
---

# Design System: Sistema de Certificados Digitales · Municipalidad Distrital de Morales

Los tokens viven en `src/styles.scss` (propiedades personalizadas en `:root`) y el frontmatter de este archivo los refleja. Si cambias un valor, cámbialo en los dos sitios. Los nombres de los tokens en CSS llevan prefijo: `--color-primario`, `--tintura-celeste-texto`, `--neutro-400`, `--radio-sm`, `--espacio-4`, `--alto-control`, etc.

## Overview

**Creative North Star: "Tinturas del escudo"**

El escudo de Morales funciona como programa de color sobre una base SaaS clara y cálida. El blanco y los neutros, derivados del ocre del escudo, sostienen la pantalla; el teal del logotipo marca lo único que se puede presionar; las tinturas del escudo (celeste, verde, sol, ocre) codifican datos, sobre todo el tipo de certificado. La identidad se reconoce en el panel de marca de las páginas de acceso (escudo destacado, nombres en texto real y franja vertical de tinturas) y, dentro del sistema, se reduce al escudo pequeño del header para dejar paso a los datos.

La densidad responde a digitadores que pasan jornadas largas cargando datos: controles de 44 px, texto base de 15 px, tablas con cifras tabulares y una interfaz plana, sin sombras decorativas, degradados ni animaciones de adorno. Los íconos son funcionales y finos (Material Symbols Outlined, trazo 300) y siempre van acompañados de texto o de un `aria-label`.

Se rechaza el panel gubernamental azul genérico con íconos de adorno.

**Key Characteristics:**
- Base blanca con neutros cálidos (del ocre del escudo), nunca grises fríos.
- Un solo color de acción: el teal del logotipo, para botones, enlaces, navegación activa y foco.
- Tinturas del escudo como codificación de datos, cada una con su variante de texto AA sobre su fondo claro.
- Libre Franklin 400/500/600 con números tabulares en datos.
- Plano: bordes cálidos de 1 px y radios de 4 a 8 px; la única sombra es la del cajón móvil.
- Íconos funcionales de trazo 300, nunca decorativos.

## Colors

Paleta cálida y sobria: un teal de acción, cuatro tinturas para datos, un rojo de identidad y una escala de neutros ocre.

### Primary
- **Teal del logotipo** (`primario`): lo que se puede presionar. Fondo del botón principal, color de los enlaces, texto del ítem activo del menú y anillo de foco (`--color-foco` apunta a él). 5,44:1 sobre blanco.
- **Teal profundo** (`primario-hover`): solo el hover del botón principal. 7,42:1 con texto blanco.
- **Teal claro** (`primario-claro`): fondo del ítem activo del menú y de la selección de texto. El teal sobre este fondo da 4,67:1.

### Secondary: tinturas del escudo (datos)
Cada tintura tiene tres tokens con funciones distintas:
- **Base** (`tintura-*`): solo muestras y barras (el cuadradito de 8 px de las etiquetas, barras de gráficos, la franja de marca). Nunca como color de texto: celeste da 2,32:1 y sol 1,98:1 sobre blanco.
- **Texto** (`tintura-*-texto`): el color de texto AA cuando va sobre su propio fondo claro.
- **Claro** (`tintura-*-claro`): el fondo de etiquetas y superficies codificadas.

- **Celeste** (`tintura-celeste`, `-texto`, `-claro`): certificados de **participación**. Texto sobre claro: 5,84:1.
- **Verde** (`tintura-verde`, `-texto`, `-claro`): certificados de **prácticas**. Texto sobre claro: 5,34:1.
- **Sol** (`tintura-sol`, `-texto`, `-claro`): certificados de **reconocimiento**. Texto sobre claro: 6,04:1.
- **Ocre** (`tintura-ocre`, `-texto`, `-claro`): hoy solo aparece en la franja de marca; sus variantes de texto y fondo (5,81:1) están definidas y reservadas para una cuarta categoría de datos cuando exista. No tiene tipo de certificado asignado.

### Tertiary: identidad
- **Rojo del escudo** (`escudo-rojo`): la franja diagonal del escudo. Solo identidad (quinta banda de la franja de tinturas). Nunca para estados, errores ni acciones.

### Estados
- **Éxito** (`exito` sobre `exito-claro`, 5,67:1), **Error** (`error` sobre `error-claro`, 5,71:1; sobre blanco 6,54:1, usado en `.error-text` y en el borde del input inválido), **Advertencia** (`advertencia` sobre `advertencia-claro`, 6,46:1). Se usan en avisos y etiquetas de estado.

### Neutral
- **Blanco** (`neutro-0`): fondo de página, contenido principal, header, inputs, tarjetas y botones secundarios.
- **Papel cálido** (`neutro-50`): fondo del sidebar, hover de botones y filas, fondo del aviso “en construcción”.
- **Arena** (`neutro-100`): fondo del panel de marca del login, hover del menú y de botones sin borde, fondo de la etiqueta neutra, separadores de filas.
- **Arena media** (`neutro-200`): bordes estructurales (header, sidebar, tarjetas, encabezado de tabla, separador del panel de marca).
- **Piedra** (`neutro-400`): bordes de controles (inputs y botones). 3,78:1 sobre blanco y 3,53:1 sobre papel cálido, por encima del 3:1 de WCAG 1.4.11.
- **Tierra** (`neutro-500`): texto secundario (subtítulos de acceso, rol del usuario, ayudas, encabezados de tabla, ícono de botones sin borde). 5,91:1 sobre blanco.
- **Tierra oscura** (`neutro-700`): texto de menú y de etiquetas neutras, descripción del panel de marca. 9,58:1 sobre papel cálido.
- **Tinta** (`neutro-900`): texto principal y títulos. 16,22:1 sobre blanco.
- **Velo** (`velo`): fondo detrás del cajón de navegación móvil.

### Named Rules
**The Pressable Teal Rule.** El teal primario solo pinta lo que se puede presionar (botones, enlaces, navegación activa) y el foco. Si no se puede hacer clic, no es teal.

**The Tinctures-Encode-Data Rule.** Las tinturas codifican datos (tipo de certificado), nunca acciones. Un botón, enlace o estado no lleva tintura.

**The Swatch-Not-Text Rule.** El tono base de cada tintura solo pinta muestras y barras; el texto usa siempre la variante `-texto` sobre la variante `-claro`.

**The Red-Is-Identity Rule.** El rojo del escudo es identidad, no un estado. Los errores usan `error`.

## Typography

**Body Font:** Libre Franklin (con system-ui, -apple-system, Segoe UI, Roboto, Arial)
**Íconos:** Material Symbols Outlined (ver Components → Iconografía)

**Character:** una grotesca americana sobria y legible, con autoridad sin rigidez; una sola familia para todo, jerarquía por tamaño y peso.

Se cargan desde Google Fonts solo los pesos 400, 500 y 600, con `display=swap` para que el HTML prerenderizado por SSR muestre el texto al instante con la fuente de sistema. `b` y `strong` están mapeados a 600 para que el navegador no sintetice un 700 que no existe.

### Hierarchy
- **Display** (600, 2,5rem, 1,1, -0,02em): el nombre del sistema en el panel de marca de acceso, con `max-width: 12ch`. En celular baja a 1rem. No se usa dentro del sistema.
- **Headline** (600, 1,625rem, 1,2, -0,01em): el `h1` de cada página (títulos de acceso y el título de módulo de `app-page-title`). `h2` y `h3` comparten peso, interlineado y tracking.
- **Title** (600, 1,25rem, 1,2): el `h2` de los diálogos de confirmación (`.dialogo`).
- **Body** (400, 0,9375rem / 15px, 1,5): texto general de la interfaz. Botones a 500; botón principal, nombre del usuario e ítem activo del menú a 600.
- **Body input** (400, 1rem / 16px): el texto dentro de los inputs; 16px evita el zoom automático de iOS.
- **Label** (600, 0,875rem): etiquetas de formulario; también el tamaño de avisos y enlaces secundarios de acceso (a 400).
- **Caption** (400, 0,8125rem): ayudas de formulario, mensajes de error de campo, rol del usuario; encabezados de tabla a 600.
- **Badge** (600, 0,75rem): etiquetas.

### Named Rules
**The Three Weights Rule.** Solo 400, 500 y 600. Nunca `font-weight: 700` ni `bold`: no está cargado y se sintetizaría.

**The Tabular Data Rule.** Toda cifra que se compara o se lee como dato (tablas, correos, fechas, códigos) usa números tabulares: `.table` los aplica a toda la tabla y `.dato` a un fragmento suelto.

## Layout

- **Escala de espacios** (`--espacio-1` a `--espacio-8`): 4, 8, 12, 16, 24, 32 y 48 px. Los campos de formulario se separan con 24 px; los avisos también dejan 24 px debajo.
- **Acceso** (`app-auth-layout`): rejilla dividida; el panel de marca ocupa `minmax(26rem, 46%)` sobre arena y el contenido queda centrado en una columna de 380 px (`--ancho-formulario`). A 800 px o menos el panel se reduce a un encabezado (escudo de 48 px, nombre del sistema y de la municipalidad en una fila), se ocultan la descripción y la línea de verificación, y el formulario sube arriba.
- **Shell privado** (`app-main-layout`): header blanco de 64 px (`--alto-header`) a todo el ancho, sidebar de 248 px (`--ancho-sidebar`) en papel cálido y contenido con 32 px de relleno. A 768 px o menos el sidebar pasa a ser un popover nativo (cajón desde la izquierda, `min(248px + 32px, 85vw)`, con velo) que se abre con el botón de menú; el relleno del contenido baja a 24/16 px. A 480 px o menos el botón “Salir” queda solo con ícono (el texto sigue disponible para lectores de pantalla) y se ocultan nombre y rol.
- **Alturas de fila**: celdas de tabla de 48 px y encabezado de 40 px.

## Elevation & Depth

Plano por defecto. La profundidad se expresa con capas tonales (blanco, papel cálido, arena) y bordes cálidos de 1 px, no con sombras. La única sombra del sistema es funcional: el cajón de navegación móvil, que flota sobre el contenido con un velo detrás.

### Shadow Vocabulary
- **Cajón** (`--sombra-lg`, `box-shadow: 0 8px 24px rgb(35 32 28 / 0.18)`): solo para superficies que se superponen al contenido (hoy, el sidebar como popover móvil).

### Named Rules
**The Flat-By-Default Rule.** Las tarjetas, botones, inputs y paneles no llevan sombra. Una sombra solo aparece cuando una superficie se superpone al contenido.

## Shapes

Esquinas apenas suavizadas y bordes cálidos finos.
- **2px** (`--radio-xs`): solo las muestras de color de 8 px de los badges de tipo.
- **4px** (`--radio-sm`): controles (botones, inputs, ítems del menú) y etiquetas.
- **6px** (`--radio-md`): avisos.
- **8px** (`--radio-lg`): tarjetas.
- **2px**: el cuadradito de muestra de las etiquetas de tintura (8×8 px).
- La **franja de tinturas** es la única forma propia: cinco bandas iguales (celeste, verde, sol, ocre y rojo del escudo) en vertical, de 8 px de ancho (`--ancho-franja`), pegadas al borde izquierdo del panel de marca.

## Components

Todas las clases base están en `src/styles.scss`; no se redefinen en los componentes.

### Buttons
Sobrios y táctiles: alto mínimo de 44 px, radio de 4 px, peso 500, transición de 0,15 s en fondo y borde (desactivada con `prefers-reduced-motion`). Deshabilitados al 60 % de opacidad.
- **`.btn`** (secundario por defecto): fondo blanco, borde piedra, texto tinta; hover en papel cálido.
- **`.btn-primary`**: la acción principal de la pantalla. Fondo teal, texto blanco a 600; hover en teal profundo. Una por formulario.
- **`.btn-block`**: ancho completo (botones de envío de las páginas de acceso).
- **`.btn-icono`**: cuadrado de 44 px para botones de solo ícono; lleva siempre `aria-label`.
- **`.btn-sin-borde`**: fondo y borde transparentes, ícono en tierra; hover en arena con texto tinta. Para acciones discretas dentro de controles (mostrar contraseña, abrir menú).
- **`.btn-invertido`**: botón para superficies oscuras. Se conserva por compatibilidad y hoy no se usa en ninguna plantilla.

```html
<button type="submit" class="btn btn-primary btn-block" [disabled]="enviando()" [attr.aria-busy]="enviando()">
  {{ enviando() ? 'Ingresando…' : 'Ingresar' }}
</button>

<button type="button" class="btn">
  <span class="material-symbols-outlined" aria-hidden="true">logout</span>
  <span>Salir</span>
</button>

<button type="button" class="btn btn-icono btn-sin-borde" aria-label="Menú de navegación">
  <span class="material-symbols-outlined" aria-hidden="true">menu</span>
</button>
```

Un enlace que actúa como acción principal usa las mismas clases: `<a routerLink="/" class="btn btn-primary btn-block">Ir al inicio</a>`.

### Inputs / Fields
- **`.form-field`**: columna con 4 px entre etiqueta, control y mensaje, y 24 px debajo. La `label` va a 0,875rem y 600.
- **`.input`**: blanco, borde piedra de 1 px, radio de 4 px, 44 px de alto, texto de 16px y cursor teal. **Foco:** borde teal y contorno de 2 px pegado (`outline-offset: 0`). **Inválido** (`.ng-invalid.ng-touched`): borde y contorno en `error`.
- **`.input-con-accion`**: envuelve un input con un `.btn-icono` dentro, a la derecha; el input reserva el espacio.
- **`.form-ayuda`**: ayuda en tierra a 0,8125rem. **`.error-text`**: error de campo en `error` a 0,8125rem.

```html
<div class="form-field">
  <label for="email">Correo electrónico</label>
  <input id="email" class="input" type="email" formControlName="email" autocomplete="username"
    aria-required="true" aria-describedby="email-error"
    [attr.aria-invalid]="form.controls.email.touched && form.controls.email.invalid" />
  <div id="email-error" aria-live="polite">
    @if (form.controls.email.touched && form.controls.email.invalid) {
      <p class="error-text">Ingresa un correo válido.</p>
    }
  </div>
</div>

<div class="input-con-accion">
  <input #campo id="password" class="input" type="password" formControlName="password" />
  <button type="button" class="btn btn-icono btn-sin-borde" aria-label="Mostrar contraseña"
    [attr.aria-pressed]="campo.type === 'text'"
    (click)="campo.type = campo.type === 'password' ? 'text' : 'password'">
    <span class="material-symbols-outlined" aria-hidden="true">
      {{ campo.type === 'password' ? 'visibility' : 'visibility_off' }}
    </span>
  </button>
</div>
```

Cuando el campo tiene una ayuda permanente, la misma región muestra la ayuda o el error: `@if (inválido) { <p class="error-text">…</p> } @else { <p class="form-ayuda">Mínimo 8 caracteres.</p> }`.

### Alerts
Fondo claro del estado, texto del estado, radio de 6 px, 0,875rem. El ícono de estado acompaña al texto, nunca lo sustituye. Variantes: `.alert-error` (ícono `error`), `.alert-exito` (ícono `check_circle`), `.alert-advertencia`.

```html
<div role="alert">
  @if (error()) {
    <div class="alert alert-error">
      <span class="material-symbols-outlined" aria-hidden="true">error</span>
      <span>No se pudo iniciar sesión. Intenta nuevamente en unos minutos.</span>
    </div>
  }
</div>
```

### Cards / Containers
- **`.card`**: blanco, borde arena media de 1 px, radio de 8 px, relleno de 24 px, sin sombra. Puede pasar a papel cálido para avisos informativos (como en “en construcción”).

```html
<div class="card"><p>Este módulo está en construcción.</p></div>
```

### Tables
- **`.table`**: ancho completo, números tabulares, celdas de 48 px con 12 px de relleno lateral y separador arena; encabezados de 40 px en tierra a 0,8125rem y 600; hover de fila en papel cálido. Aún no la usa ninguna pantalla, pero es la clase base para los listados.

```html
<table class="table">
  <thead><tr><th scope="col">Participante</th><th scope="col">Tipo</th><th scope="col">Fecha</th></tr></thead>
  <tbody><tr><td>Ana Ríos</td><td><span class="badge badge-practicas">Prácticas</span></td><td>12/09/2026</td></tr></tbody>
</table>
```

### Badges (chips)
- **`.badge`**: etiqueta neutra (arena con texto tierra oscura), 24 px de alto, radio de 4 px, 0,75rem y 600. Se usa hoy para “Próximamente” en el panel de marca.
- **Estado:** `.badge-exito`, `.badge-error`, `.badge-advertencia`.
- **Tipo de certificado** (firma del sistema): `.badge-participacion` (celeste), `.badge-practicas` (verde), `.badge-reconocimiento` (sol). Llevan un cuadradito de 8 px con el tono base de la tintura y el texto en la variante `-texto` sobre `-claro`. El texto siempre nombra el tipo: el color refuerza, no sustituye.

```html
<span class="badge badge-participacion">Participación</span>
<span class="badge badge-practicas">Prácticas</span>
<span class="badge badge-reconocimiento">Reconocimiento</span>
<span class="badge badge-exito">Emitido</span>
```

### Navigation
- **Header** (`app-header` + `private-layout`): blanco, 64 px, borde inferior arena media. A la izquierda el escudo de 36 px (`alt=""`, porque el nombre va al lado) y el nombre del sistema en texto (600); a la derecha nombre (600) y rol (tierra, 0,8125rem) y el botón secundario “Salir” con ícono.
- **Sidebar** (`app-sidebar`): papel cálido, borde derecho arena media, ítems de 44 px separados 2 px, texto tierra oscura a 500 con ícono a la izquierda. Hover en arena; **activo** (`routerLinkActive="active"`, `aria-current="page"`) en teal claro con texto teal a 600. El foco del ítem va hacia adentro (`outline-offset: -2px`). Los ítems vienen del backend (`/auth/me`).
- **Móvil**: el sidebar es un popover nativo abierto por un `.btn-icono .btn-sin-borde` con `popovertarget`; se cierra al pulsar un ítem.

### Páginas de acceso (`app-auth-layout`)
Envoltorio de login, recuperación, restablecimiento y acceso denegado: panel de marca (franja de tinturas; escudo de 160 px junto al nombre del sistema y de la municipalidad, ambos en texto real con Libre Franklin; descripción y línea de verificación) y la página proyectada a la derecha. El contenido usa tres clases:
- **`.auth-titulo`**: el `h1`, con 8 px debajo.
- **`.auth-texto`**: subtítulo en tierra con 32 px debajo.
- **`.auth-enlaces`**: enlaces secundarios bajo el formulario, a 0,875rem, con 8 px de relleno vertical para ampliar el área táctil.

```html
<app-auth-layout>
  <section aria-labelledby="titulo-login">
    <h1 id="titulo-login" class="auth-titulo">Iniciar sesión</h1>
    <p class="auth-texto">Ingresa con tu correo institucional.</p>
    <!-- formulario -->
    <p class="auth-enlaces"><a routerLink="/recuperar-password">¿Olvidaste tu contraseña?</a></p>
  </section>
</app-auth-layout>
```

### Franja de tinturas (firma de identidad)
- **`.franja-tinturas`**: cinco `span` vacíos que la clase pinta en orden celeste, verde, sol, ocre y rojo del escudo. Es decorativa: lleva `aria-hidden="true"`. El tamaño y la posición los pone el contenedor (en el login, 8 px de ancho y alto completo en el borde izquierdo).

```html
<div class="franja-tinturas" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
```

### Utilidades
- **`.dato`**: números tabulares para un fragmento suelto (`<span class="dato">{{ email }}</span>`).
- **`.sr-only`**: texto solo para lectores de pantalla (`<span class="sr-only">Abre en una pestaña nueva</span>`).

### Marca e imágenes
El escudo es provisional (ver *Pendientes*). La fuente `public/marca/escudo-morales-solo.png` queda fuera del build (`ignore` en los assets de `angular.json`); en la web solo se sirven derivados recortados a su tamaño de uso:

| Uso | Archivo (1x / 2x) | Tamaño mostrado |
| --- | --- | --- |
| Panel de marca, escritorio | `marca/escudo-160.webp` / `escudo-320.webp` | 150×160 |
| Panel de marca, celular (≤ 800 px) | `marca/escudo-48.webp` / `escudo-96.webp` | 45×48 |
| Header privado | `marca/escudo-36.webp` / `escudo-72.webp` | 34×36 |
| Favicon | `favicon-32x32.png` y `favicon.ico` (16 y 32) | — |
| iOS | `apple-touch-icon.png` (180×180, sobre blanco: iOS rellena la transparencia con negro) | — |

El panel cambia de archivo por breakpoint con `<picture>` + `<source media>`; el header usa `srcset` con descriptores `1x/2x`. Los nombres del sistema y de la municipalidad son siempre texto real en Libre Franklin.

Para regenerar los derivados (ImageMagick) cuando llegue el escudo oficial:

```sh
magick public/marca/escudo-morales-solo.png -trim +repage /tmp/escudo.png
for h in 36 48 72 96 160 320; do
  magick /tmp/escudo.png -filter Lanczos -resize x$h -strip -quality 85 \
    -define webp:alpha-quality=90 -define webp:method=6 public/marca/escudo-$h.webp
done
magick /tmp/escudo.png -resize 30x30 -background none -gravity center -extent 32x32 -strip public/favicon-32x32.png
magick /tmp/escudo.png -resize 144x144 -background white -gravity center -extent 180x180 -alpha remove \
  -dither FloydSteinberg -colors 256 -strip PNG8:public/apple-touch-icon.png
magick /tmp/escudo.png -background none -gravity center \( -clone 0 -resize 15x15 -extent 16x16 \) \
  \( -clone 0 -resize 30x30 -extent 32x32 \) -delete 0 public/favicon.ico
```

### Registros inactivos
- **`.registro-inactivo`**: la fila o tarjeta de un registro inactivo (usuario, rol…) pasa a texto `neutro-500`, siempre igual en todos los módulos. El estado se dice además con un badge de texto (`Inactivo`), nunca solo con el color.

### Diálogos de confirmación
- **`.dialogo`** sobre un `<dialog>` nativo abierto con `showModal()`: atrapa el foco, Esc cierra y el navegador devuelve el foco al botón que lo abrió. El contenido queda siempre en el DOM y el diálogo se abre con `afterNextRender`, para que el foco y el lector de pantalla encuentren ya el texto del registro. El botón de cancelar lleva `autofocus`; la acción va en `.btn-primary`. Acciones en `.dialogo-acciones`. Solo para acciones que cambian el estado de un registro (activar o desactivar), no para tareas que caben en la página.

```html
<dialog #dialogo class="dialogo" aria-labelledby="dialogo-titulo" aria-describedby="dialogo-texto">
  <h2 id="dialogo-titulo">Desactivar a Maria Perez</h2>
  <p id="dialogo-texto">No podrá iniciar sesión hasta que su cuenta se vuelva a activar.</p>
  <div class="dialogo-acciones">
    <button type="button" class="btn" autofocus>Cancelar</button>
    <button type="button" class="btn btn-primary">Desactivar</button>
  </div>
</dialog>
```

### Listados (patrón de Gestión de Usuarios)
- Encabezado con `app-page-title` y la acción principal (`.btn-primary`), visible solo con su permiso (`*appHasPermission="'usuarios.crear'"`).
- Un contenedor `role="status"` fijo para el resultado de las acciones; un 429 se muestra como `.alert-advertencia` con un texto que pide esperar.
- Filtros en un `form role="search"` con labels visibles; la búsqueda espera 350 ms (debounce).
- Escritorio: `.table` con `caption` para lectores de pantalla, cifras con `.dato` y acciones de fila como `.btn-icono .btn-sin-borde` con `aria-label` que nombra el registro ("Editar a Maria Perez") y `title`. Celular (≤ 768 px): tarjetas apiladas con las acciones en texto visible, en lugar de scroll horizontal.
- Carga: `.esqueleto` (barras quietas en `neutro-100`, sin animación) y un "Cargando…" solo para lectores de pantalla. Vacío: `.card.estado-vacio` con el mensaje y "Limpiar filtros" si hay filtros activos.
- Paginación: `nav.paginacion` con "x–y de total" en `.dato` y `.paginacion-botones` (Anterior/Siguiente; en celular ocupan todo el ancho).
- Fechas y horas siempre en hora de Lima (`ZONA_HORARIA_LIMA`, en `shared/utils/zona-horaria.ts`).
- Las acciones de fila y la acción principal se ocultan con `*appHasPermission`. Es solo presentación: el backend valida cada permiso.

### Iconografía
- **Fuente:** Material Symbols Outlined, trazo 300, tamaño óptico 20, sin relleno, a 20 px (`--icono-md`). Se carga desde Google Fonts con un subconjunto recortado por el parámetro `icon_names` en `src/index.html`.
- **Lista espejo:** `src/app/shared/utils/iconos-disponibles.ts` (`ICONOS_DISPONIBLES`) repite exactamente esa lista. Las dos listas deben ser idénticas y estar en orden alfabético. Hoy: `add`, `admin_panel_settings`, `bar_chart`, `campaign`, `check_circle`, `chevron_left`, `chevron_right`, `dashboard`, `edit`, `error`, `event`, `forward_to_inbox`, `group`, `how_to_reg`, `lock_open`, `logout`, `menu`, `military_tech`, `people`, `person_off`, `school`, `visibility`, `visibility_off`, `workspace_premium`.
- **Íconos de módulo:** cada módulo trae en el backend el nombre de un ícono de Material. Si se agrega un módulo con un ícono nuevo, hay que sumarlo a **las dos** listas (en orden alfabético). El sidebar descarta los nombres que no están en `ICONOS_DISPONIBLES` y deja solo la etiqueta, para que nunca se dibuje el nombre del ícono como texto.
- **Dónde:** solo en el menú, acciones, controles y estados. Siempre con texto visible al lado o, en botones de solo ícono, con `aria-label`; el `span` del ícono lleva `aria-hidden="true"`.

**The Functional Icon Rule.** Un ícono solo aparece si ayuda a reconocer una acción, un destino del menú, un control o un estado. Los íconos decorativos están prohibidos: nada de un ícono sobre el título del login ni en encabezados de sección.

### Accesibilidad
- **Foco:** contorno teal de 2 px con 2 px de separación en todo elemento con `:focus-visible` (en inputs, pegado; en el menú, hacia adentro). No se elimina nunca.
- **Áreas táctiles:** controles de 44 px (`--alto-control`): botones, inputs, ítems del menú, botones de ícono.
- **Texto de input** a 16px.
- **Bordes de controles** con `neutro-400` (3,78:1 sobre blanco), por encima del 3:1.
- **Avisos:** el contenedor con `role="alert"` (errores) o `role="status"` (confirmaciones) está siempre en el DOM y el aviso se inserta dentro, para que el lector de pantalla lo anuncie. Un error que ya está presente al cargar la página puede llevar `role="alert"` directamente.
- **Errores de campo:** cada campo tiene una región `aria-live="polite"` con id, enlazada desde el input por `aria-describedby`; el input marca `aria-invalid` cuando está tocado e inválido y `aria-required="true"` si es obligatorio.
- **Envíos:** el botón se deshabilita, cambia su texto (“Ingresando…”) y marca `aria-busy` mientras espera.
- **Botones conmutables** (mostrar contraseña): `aria-pressed`.
- **Pares de contraste medidos (WCAG):** teal sobre blanco 5,44; teal sobre teal claro 4,67; blanco sobre teal profundo 7,42; tierra sobre blanco 5,91; tierra oscura sobre papel cálido 9,58; tinta sobre blanco 16,22; tinturas `-texto` sobre `-claro` 5,34 a 6,04; éxito, error y advertencia sobre su fondo claro 5,67, 5,71 y 6,46; piedra (borde) sobre blanco 3,78.

## Do's and Don'ts

### Do:
- **Do** reservar el teal primario para botones, enlaces, navegación activa y foco.
- **Do** codificar el tipo de certificado con su tintura: participación en celeste, prácticas en verde, reconocimiento en sol (`.badge-participacion`, `.badge-practicas`, `.badge-reconocimiento`), siempre con el nombre del tipo en texto.
- **Do** usar la variante `-texto` sobre la variante `-claro` para todo texto codificado con tintura, y el tono base solo para muestras y barras.
- **Do** usar los tokens (`var(--espacio-4)`, `var(--radio-sm)`, `var(--neutro-400)`) en lugar de valores sueltos.
- **Do** mantener controles de 44 px, texto de input de 16px y el contorno de foco de 2 px en teal.
- **Do** aplicar `.table` o `.dato` a toda cifra que se lee como dato.
- **Do** agregar cada ícono nuevo a `icon_names` en `src/index.html` y a `ICONOS_DISPONIBLES`, en orden alfabético.
- **Do** servir el escudo desde las versiones WebP recortadas al tamaño de uso (ver *Marca e imágenes*), con su par 2x en `srcset`, y escribir los nombres como texto, nunca como imagen.

### Don't:
- **Don't** usar las tinturas en botones, enlaces o estados: codifican datos, nunca acciones.
- **Don't** usar el rojo del escudo para errores o estados; es solo identidad.
- **Don't** usar el teal en elementos que no se pueden presionar (títulos, íconos de adorno, fondos).
- **Don't** usar `font-weight: 700` o `bold`; solo 400, 500 y 600.
- **Don't** poner íconos decorativos (por ejemplo, un ícono sobre el título del login) ni íconos sin texto visible o `aria-label`.
- **Don't** agregar sombras a tarjetas, botones o inputs, ni degradados o animaciones decorativas.
- **Don't** usar grises fríos: los neutros salen del ocre del escudo.
- **Don't** redibujar ni recolorear el escudo, ni servir el PNG fuente de 1254 px en la web.

## Pendientes

- **Escudo provisional.** `public/marca/escudo-morales-solo.png` (1254×1254, fondo transparente) fue **regenerado a partir del logotipo** de 229×94 y **no es el archivo oficial**: tiene detalles que difieren del original y halos de color en los bordes. Debe reemplazarse por el escudo oficial de la municipalidad (idealmente SVG, o PNG grande de origen oficial) y, al hacerlo, regenerar todas las versiones derivadas con los comandos de *Marca e imágenes*. El logotipo horizontal `public/marca/escudo-morales.png` (229×94) ya no se usa en las plantillas.
- **Portal público de verificación.** No existe todavía; “Verificar autenticidad” es texto con una etiqueta “Próximamente” hasta que tenga ruta. Entonces pasa a ser un enlace.
- **Respaldo de la fuente de íconos.** Si la fuente de íconos no carga, las cajas fijas de 1em muestran letras recortadas del nombre del ícono. No bloquea el uso (todo ícono va con texto o `aria-label`); se podría ocultar el ícono hasta que `document.fonts` confirme la carga.
- **Clics antes de la hidratación.** El login se prerenderiza y `withEventReplay()` no está activado en `provideClientHydration`, así que los clics hechos antes de hidratar no se repiten.

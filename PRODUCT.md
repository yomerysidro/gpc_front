# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Administrador** (rol Administrador): gestiona usuarios, roles, módulos y
  permisos, además de actividades, ponentes y firmantes, y reportes.
- **Digitadores** (rol Digitador): registran actividades, participantes,
  practicantes, reconocimientos, ponentes y firmantes, y emiten certificados.
  Son quienes más horas pasan en el sistema, con trabajo repetitivo de carga de datos.
- **Gerencia** (rol Gerencial; por ejemplo, el alcalde): consulta el dashboard
  y los reportes, en modo solo lectura.
- **Ciudadanos y terceros**: usan el portal público para verificar que un
  certificado emitido por la municipalidad es auténtico. No tienen cuenta.

## Product Purpose

Sistema de Certificados Digitales de la Municipalidad Distrital de Morales
(San Martín, Perú). Centraliza el registro de actividades y personas y la
emisión de certificados (participación, prácticas, reconocimientos), y permite
verificarlos públicamente. El éxito es que los digitadores emitan sin fricción
y que cualquiera pueda confirmar en segundos la autenticidad de un certificado.

## Positioning

Es el sistema oficial de una municipalidad concreta: los certificados llevan su
respaldo institucional y su verificación pública es la prueba de esa autenticidad.
No es un producto genérico de certificados.

## Operating Context

- Uso interno en oficinas municipales, en jornadas largas de carga de datos;
  la gerencia consulta de forma ocasional, también desde el celular.
- Acceso por roles: el menú lateral se arma con los módulos y permisos que
  devuelve el backend (`/auth/me`). Módulos actuales: Gestión de Usuarios,
  Roles y Permisos, Dashboard, Actividades, Participantes, Practicantes,
  Reconocimientos, Ponentes y Firmantes, Emisión de Certificados, Reportes.
- Cada módulo trae en el backend el nombre de un ícono de Material.

## Capabilities and Constraints

- Frontend en Angular 18 standalone con SSR (gpc_front) y backend en Laravel
  (gpc_back), con un JWT en una cookie httpOnly.
- Ya existen el login con bloqueo tras intentos fallidos, la recuperación y el
  restablecimiento de contraseña, y la página de acceso denegado.
- El portal público de verificación está por diseñar.
- Pendiente: el contrato de la API de certificados.

## Brand Commitments

- Nombre oficial: Municipalidad Distrital de Morales. Lema que figura en el
  logotipo: "Un gobierno de todos y para todos".
- El escudo oficial es la identidad y no se redibuja ni se modifica.
- Debe sentirse como un SaaS moderno y confiable, con identidad institucional.
  Nada de estética de landing page, degradados llamativos ni animaciones decorativas.
- Los íconos se usan para acciones funcionales (menú, tablas), no como adorno.
- La paleta parte de los colores reales del escudo y del logotipo.

## Evidence on Hand

- `public/marca/escudo-morales.png`: logotipo completo (escudo, nombre y lema)
  de 229×94 px, sin versión vectorial. Falta un SVG o PNG en alta resolución
  del escudo solo.
- No hay fotografías, testimonios ni cifras. No deben inventarse.

## Product Principles

1. La carga de datos de los digitadores manda: claridad y velocidad antes que expresión.
2. La autoridad institucional se expresa con sobriedad y precisión, no con adornos.
3. Un certificado verificable debe poder comprobarse en segundos, por cualquiera.
4. Cada pantalla muestra solo lo que el rol del usuario puede hacer.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste, foco visible, labels asociados y errores anunciados.
El portal público debe funcionar bien en celulares de gama baja.

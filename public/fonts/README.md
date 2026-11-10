# Material Symbols Outlined

`material-symbols-outlined.ttf` contiene el subconjunto de la biblioteca que ya
utilizaba la aplicación, servido localmente. No se añadió un paquete npm.

Origen: Google Fonts, familia Material Symbols Outlined, ejes
`opsz=20,wght=300,FILL=0,GRAD=0`. Se conservan los iconos previos y se incluyen
`settings`, `calendar_month`, `co_present`, `groups` y `lock`, usados por Actividades,
ademas de `search`, `refresh`, `inbox` y `edit_calendar`, usados por Solicitudes.
También incluye `arrow_back` para el retorno compacto del detalle de actividad. La lista completa está en `src/app/shared/utils/iconos-disponibles.ts`.

Fuente de descarga:
`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,300,0,0&icon_names=add,admin_panel_settings,arrow_back,bar_chart,calendar_month,campaign,check_circle,chevron_left,chevron_right,co_present,dashboard,edit,edit_calendar,error,event,expand_more,forward_to_inbox,group,groups,how_to_reg,inbox,lock,lock_open,logout,menu,military_tech,people,person_off,refresh,school,search,settings,toggle_off,toggle_on,tune,visibility,visibility_off,warning,workspace_premium&display=block`

La URL devuelve CSS con la ubicación del archivo de fuente. El archivo obtenido
es TrueType y se declara con `format('truetype')` en `src/styles.scss`.

Licencia: Apache 2.0, incluida en `LICENSE.material-symbols.txt`, obtenida del
[repositorio oficial](https://github.com/google/material-design-icons/blob/master/LICENSE).

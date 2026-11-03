import { Routes } from '@angular/router';
import { SeccionGestionComponent } from './seccion-gestion/seccion-gestion.component';

/** Se conserva authGuard del PrivateLayout; cada petición vuelve a ser autorizada por Laravel. */
export const GESTION_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'personas' },
  {
    path: 'personas', component: SeccionGestionComponent,
    data: { titulo: 'Personas', enlaces: [
      { titulo: 'Personas', ruta: '/gestion/personas', exacto: true },
      { titulo: 'Documentos', ruta: '/gestion/personas/documentos', exacto: false },
    ] },
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./persona/persona.component').then(m => m.PersonaGestionComponent) },
      { path: 'documentos', loadComponent: () => import('./persona-documento/persona-documento.component').then(m => m.PersonaDocumentoGestionComponent) },
    ],
  },
  {
    path: 'trabajadores', component: SeccionGestionComponent,
    data: { titulo: 'Trabajadores', enlaces: [] },
    children: [
      { path: '', loadComponent: () => import('./persona-trabajador/persona-trabajador.component').then(m => m.PersonaTrabajadorGestionComponent) },
    ],
  },
  {
    path: 'practicas', component: SeccionGestionComponent,
    data: { titulo: 'Prácticas', enlaces: [
      { titulo: 'Prácticas', ruta: '/gestion/practicas', exacto: true },
      { titulo: 'Practicantes', ruta: '/gestion/practicas/practicantes', exacto: false },
      { titulo: 'Supervisores', ruta: '/gestion/practicas/supervisores', exacto: false },
    ] },
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./practica/practica.component').then(m => m.PracticaGestionComponent) },
      { path: 'practicantes', loadComponent: () => import('./persona-practicante/persona-practicante.component').then(m => m.PersonaPracticanteGestionComponent) },
      { path: 'supervisores', loadComponent: () => import('./practica-supervisor/practica-supervisor.component').then(m => m.PracticaSupervisorGestionComponent) },
    ],
  },
  {
    path: 'ponentes', component: SeccionGestionComponent,
    data: { titulo: 'Ponentes', enlaces: [] },
    children: [
      { path: '', loadComponent: () => import('./persona-ponente/persona-ponente.component').then(m => m.PersonaPonenteGestionComponent) },
    ],
  },
  {
    path: 'configuracion', component: SeccionGestionComponent,
    data: { titulo: 'Configuración', enlaces: [
      { titulo: 'Áreas', ruta: '/gestion/configuracion', exacto: true },
      { titulo: 'Tipos de documento', ruta: '/gestion/configuracion/tipos-documento', exacto: false },
      { titulo: 'Instituciones', ruta: '/gestion/configuracion/instituciones', exacto: false },
    ] },
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./area/area.component').then(m => m.AreaGestionComponent) },
      { path: 'tipos-documento', loadComponent: () => import('./tipo-documento/tipo-documento.component').then(m => m.TipoDocumentoGestionComponent) },
      { path: 'instituciones', loadComponent: () => import('./institucion/institucion.component').then(m => m.InstitucionGestionComponent) },
    ],
  },
];

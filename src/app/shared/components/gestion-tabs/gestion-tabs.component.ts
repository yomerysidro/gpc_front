import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonComponent } from '../../../pages/person/person';
import { PersonDocumentComponent } from '../../../pages/person-document/person-document';
import { PersonInternComponent } from '../../../pages/person-intern/person-intern';
import { PracticeComponent } from '../../../pages/practice/practice';
import { PracticeSupervisorComponent } from '../../../pages/practice-supervisor/practice-supervisor';
import { AreaComponent } from '../../../pages/area/area';
import { DocumentTypeComponent } from '../../../pages/document-type/document-type';
import { InstitutionComponent } from '../../../pages/institution/institution';
import { PageTitleComponent } from '../page-title/page-title.component';
import { TiposCertificadoComponent } from '../../../pages/emision-certificados/configuracion/tipos-certificado/tipos-certificado.component';
import { CATALOGOS_CLASIFICACIONES, CATALOGOS_INSTITUCIONALES } from '../../../components/sidebar/catalogos-configuracion';

type Pestana = { id: string; etiqueta: string; componente: Type<unknown>; entradas?: Record<string, unknown> };
type Seccion = 'personas' | 'practicas' | 'configuracion' | 'clasificaciones';
const SECCIONES: Record<Seccion, { titulo: string; pestanas: readonly Pestana[] }> = {
  personas: { titulo: 'Gestión de Personas', pestanas: [
    { id: 'personas', etiqueta: 'Personas', componente: PersonComponent },
    { id: 'documentos', etiqueta: 'Documentos de personas', componente: PersonDocumentComponent },
  ] },
  practicas: { titulo: 'Gestión de Prácticas', pestanas: [
    { id: 'practicantes', etiqueta: 'Practicantes', componente: PersonInternComponent },
    { id: 'practicas', etiqueta: 'Prácticas', componente: PracticeComponent },
    { id: 'supervisores', etiqueta: 'Supervisores', componente: PracticeSupervisorComponent },
  ] },
  configuracion: { titulo: 'Gestión institucional', pestanas: [
    { ...CATALOGOS_INSTITUCIONALES[0], componente: AreaComponent },
    { ...CATALOGOS_INSTITUCIONALES[1], componente: DocumentTypeComponent },
    { ...CATALOGOS_INSTITUCIONALES[2], componente: InstitutionComponent },
  ] },
  clasificaciones: { titulo: 'Tipos y clasificaciones', pestanas: CATALOGOS_CLASIFICACIONES.map((catalogo, indice) => ({
    ...catalogo, componente: TiposCertificadoComponent,
    entradas: { embedded: true, recurso: ['ativicty-type', 'participation-type', 'tipos-certificado'][indice] },
  })) },
};

/** Misma navegación de pestañas que Roles: query param, teclado y un componente activo. */
@Component({
  selector: 'app-gestion-tabs',
  standalone: true,
  imports: [NgComponentOutlet, PageTitleComponent],
  templateUrl: './gestion-tabs.component.html',
  styleUrl: './gestion-tabs.component.scss',
})
export class GestionTabsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly parametros = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  protected readonly seccion = SECCIONES[this.route.snapshot.data['seccion'] as Seccion];
  protected readonly entradas = { embedded: true };
  protected readonly pestana = computed(() => this.seccion.pestanas.find(
    opcion => opcion.id === this.parametros().get('pestana'))?.id ?? this.seccion.pestanas[0].id);

  protected seleccionar(id: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pestana: id === this.seccion.pestanas[0].id ? null : id },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected alTeclear(evento: KeyboardEvent): void {
    const opciones = this.seccion.pestanas;
    const actual = opciones.findIndex(opcion => opcion.id === this.pestana());
    const destino = {
      ArrowRight: (actual + 1) % opciones.length,
      ArrowLeft: (actual - 1 + opciones.length) % opciones.length,
      Home: 0,
      End: opciones.length - 1,
    }[evento.key];
    if (destino === undefined) return;
    evento.preventDefault();
    const id = opciones[destino].id;
    this.seleccionar(id);
    (evento.currentTarget as HTMLElement).querySelector<HTMLElement>(`#gestion-tab-${id}`)?.focus();
  }
}

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../security/auth-request.context';
import { GestionReadSource } from '../../shared/components/gestion-table/gestion-table.component';
import { PersonService } from './person/person.service';
import { PersonDocumentService } from './person-document/person-document.service';
import { PersonWorkerService } from './person-worker/person-worker.service';
import { PersonInternService } from './person-intern/person-intern.service';
import { PracticeService } from './practice/practice.service';
import { PracticeSupervisorService } from './practice-supervisor/practice-supervisor.service';
import { PersonSpeakerService } from './person-speaker/person-speaker.service';
import { AreaService } from './area/area.service';
import { DocumentTypeService } from './document-type/document-type.service';
import { InstitutionService } from './institution/institution.service';

const RECURSOS: { servicio: Type<GestionReadSource>; endpoint: string; clave: string }[] = [
  { servicio: PersonService, endpoint: 'persons', clave: 'id_persona' },
  { servicio: PersonDocumentService, endpoint: 'person-documents', clave: 'id_persona_documento' },
  { servicio: PersonWorkerService, endpoint: 'person-workers', clave: 'id_persona_trabajador' },
  { servicio: PersonInternService, endpoint: 'practicing-individuals', clave: 'id_persona_practicante' },
  { servicio: PracticeService, endpoint: 'practices', clave: 'id_practica' },
  { servicio: PracticeSupervisorService, endpoint: 'supervisory-internships', clave: 'id_practica_supervisor' },
  { servicio: PersonSpeakerService, endpoint: 'person-speakers', clave: 'id_persona_ponente' },
  { servicio: AreaService, endpoint: 'areas', clave: 'id_area' },
  { servicio: DocumentTypeService, endpoint: 'document-types', clave: 'id_tipo_documento' },
  { servicio: InstitutionService, endpoint: 'institutions', clave: 'id_institucion' },
];

// HttpTestingController intercepta todas las peticiones: estas pruebas no contactan Laravel ni Neon.
for (const recurso of RECURSOS) {
  describe(recurso.servicio.name + ' CRUD con HTTP interceptado', () => {
    let servicio: GestionReadSource;
    let http: HttpTestingController;
    const url = `${environment.apiBaseUrl}/${recurso.endpoint}`;
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
      servicio = TestBed.inject(recurso.servicio);
      http = TestBed.inject(HttpTestingController);
    });
    afterEach(() => http.verify());

    it('consulta el listado real con contexto de autenticación', () => {
      let registros: unknown;
      servicio.listar().subscribe(datos => registros = datos);
      const consulta = http.expectOne(`${url}/list`);
      expect(consulta.request.method).toBe('GET');
      expect(consulta.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
      consulta.flush({ success: true, message: '', data: [] });
      expect(registros).toEqual([]);
    });

    it('consulta el detalle real y extrae data', () => {
      let registro: unknown;
      servicio.obtener(1).subscribe(datos => registro = datos);
      const consulta = http.expectOne(`${url}/detail/1`);
      expect(consulta.request.method).toBe('GET');
      expect(consulta.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
      const datoDePrueba = { [recurso.clave]: 1 };
      consulta.flush({ success: true, message: '', data: datoDePrueba });
      expect(registro).toEqual(datoDePrueba);
    });

    it('propaga el 403 sin inventar una lista vacía ni reintentar', () => {
      let estado = 0;
      servicio.listar().subscribe({ next: () => fail('No debe sustituir el error por datos'), error: error => estado = error.status });
      http.expectOne(`${url}/list`).flush(
        { success: false, message: 'No autorizado.', data: [] }, { status: 403, statusText: 'Forbidden' },
      );
      expect(estado).toBe(403);
      http.expectNone(() => true);
    });

    it('rechaza una respuesta de listado con formato incorrecto', () => {
      let error = false;
      servicio.listar().subscribe({ next: () => fail('La respuesta no es un listado'), error: () => error = true });
      http.expectOne(`${url}/list`).flush({ success: true, message: '', data: {} });
      expect(error).toBeTrue();
    });

    for (const metodo of ['POST', 'PUT', 'DELETE']) {
      it('conecta ' + metodo + ' al contrato Laravel sin contactar la red', () => {
        const payload = { nombre: 'Solo en memoria' };
        const observable = metodo === 'POST' ? servicio.crear!(payload) : metodo === 'PUT' ? servicio.actualizar!(1, payload) : servicio.eliminar!(1);
        let mensaje = '';
        observable.subscribe(r => mensaje = r.message);
        const sufijo = metodo === 'POST' ? '/create' : metodo === 'PUT' ? '/update/1' : '/delete/1';
        const solicitud = http.expectOne(url + sufijo);
        expect(solicitud.request.method).toBe(metodo);
        expect(solicitud.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
        expect(solicitud.request.body).toEqual(metodo === 'DELETE' ? null : payload);
        solicitud.flush({ success: true, message: 'Operacion simulada', data: null });
        expect(mensaje).toBe('Operacion simulada');
      });
    }
    for (const estado of [403, 409, 422]) {
      it('propaga errores de escritura HTTP ' + estado + ' sin reintentar', () => {
        let recibido = 0;
        servicio.actualizar!(1, {}).subscribe({ error: e => recibido = e.status });
        http.expectOne(url + '/update/1').flush({ success: false, message: 'Rechazado', data: {} }, { status: estado, statusText: 'Error' });
        expect(recibido).toBe(estado);
        http.expectNone(() => true);
      });
    }
  });
}

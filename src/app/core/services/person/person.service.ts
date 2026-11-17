import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';

export type Person = {
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  fecha_registro: string;
};

export type PersonPayload = Omit<Person, 'id_persona'>;
type PersonResponse<T> = { success: boolean; message: string; data: T };

@Injectable({ providedIn: 'root' })
export class PersonService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/persons`;

  listar(): Observable<readonly Person[]> {
    return this.http.get<PersonResponse<readonly Person[]>>(`${this.url}/list`, this.opciones())
      .pipe(map(respuesta => {
        const registros = this.datos(respuesta);
        if (!Array.isArray(registros)) throw new Error('Respuesta de listado invalida.');
        return registros;
      }));
  }

  obtener(id: number): Observable<Person> {
    return this.http.get<PersonResponse<Person>>(`${this.url}/detail/${id}`, this.opciones())
      .pipe(map(respuesta => {
        const registro = this.datos(respuesta);
        if (!registro || typeof registro !== 'object' || Array.isArray(registro)) throw new Error('Respuesta de detalle inválida.');
        return registro;
      }));
  }

  private datos<T>(respuesta: PersonResponse<T>): T {
    if (!respuesta.success) throw new Error(respuesta.message || 'No se pudo consultar Personas.');
    return respuesta.data;
  }

  crear(payload: Record<string, unknown>): Observable<{ success: boolean; message: string; data: unknown }> {
    return this.http.post<{ success: boolean; message: string; data: unknown }>(`${this.url}/create`, payload, this.opciones()).pipe(map(r => this.validarEscritura(r)));
  }

  actualizar(id: number, payload: Record<string, unknown>): Observable<{ success: boolean; message: string; data: unknown }> {
    return this.http.put<{ success: boolean; message: string; data: unknown }>(`${this.url}/update/${id}`, payload, this.opciones()).pipe(map(r => this.validarEscritura(r)));
  }

  eliminar(id: number): Observable<{ success: boolean; message: string; data: unknown }> {
    return this.http.delete<{ success: boolean; message: string; data: unknown }>(`${this.url}/delete/${id}`, this.opciones()).pipe(map(r => this.validarEscritura(r)));
  }

  private validarEscritura(r: { success: boolean; message: string; data: unknown }) {
    if (!r.success) throw new Error(r.message || 'No se pudo completar la operación.');
    return r;
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
}

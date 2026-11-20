import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AUTHENTICATED_REQUEST } from '../security/auth-request.context';

@Injectable({ providedIn: 'root' })
export class AvisoOperacion {
  private readonly aviso = signal('');
  private temporizador?: ReturnType<typeof setTimeout>;
  readonly mensaje = this.aviso.asReadonly();

  mostrar(mensaje: string): void {
    clearTimeout(this.temporizador);
    this.aviso.set(mensaje);
    this.temporizador = setTimeout(() => this.cerrar(), 4500);
  }

  cerrar(): void {
    clearTimeout(this.temporizador);
    this.aviso.set('');
  }
}

export const operacionAvisoInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(AUTHENTICATED_REQUEST) || !['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) return next(req);
  const avisos = inject(AvisoOperacion);
  return next(req).pipe(tap(evento => {
    if (!(evento instanceof HttpResponse)) return;
    const cuerpo = evento.body as { success?: boolean; message?: string } | null;
    const mensaje = cuerpo?.message?.trim();
    if (cuerpo?.success !== true || !mensaje) return;
    if (req.method === 'POST' && evento.status !== 201
        && !/\b(?:cread|registrad|guardad|actualizad|eliminad|enviad|confirmad|aprobad|rechazad|derivad|finalizad)[oa]s?\b/i.test(mensaje)) return;
    avisos.mostrar(mensaje);
  }));
};
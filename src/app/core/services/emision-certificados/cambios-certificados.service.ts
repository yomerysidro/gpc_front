import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CambiosCertificadosService {
  private readonly cambios = new Subject<void>();
  readonly cambios$ = this.cambios.asObservable();
  confirmar(): void { this.cambios.next(); }
}

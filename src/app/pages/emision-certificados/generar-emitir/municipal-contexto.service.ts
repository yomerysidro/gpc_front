import { Injectable } from '@angular/core';
import { EvaluacionOrigen } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { DocumentoFirmas } from '../../../core/services/emision-certificados/documentos-digitales.service';

/** Contexto efímero: no coloca datos personales ni tokens en la URL o almacenamiento. */
@Injectable({ providedIn: 'root' })
export class MunicipalContextoService {
  seleccionado: { evaluacion: EvaluacionOrigen; documento: DocumentoFirmas | null } | null = null;
}

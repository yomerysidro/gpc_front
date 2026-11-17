import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ArchivoPdf } from '../../interfaces/emision-certificados/documento-digital.interface';

export const MAX_PDF_PREVIA = 10 * 1024 * 1024;
export function validarMensajeCertificado(control: AbstractControl): ValidationErrors | null {
  const texto: string = control.value ?? '';
  if (!texto.replace(/^[ \n\r\t\v\0]+|[ \n\r\t\v\0]+$/g, '')) return { mensaje: true };
  if (Array.from(texto).length > 1200) return { longitudUnicode: true };
  return /<[^>]*>|[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u202A-\u202E\u2066-\u2069]/u.test(texto) ? { textoPlano: true } : null;
}
export function decodificarVistaPrevia(pdf: { contenido_base64: string; tipo_contenido: string; nombre_archivo: string; persistido: boolean }, persistido = false): ArchivoPdf {
  const base64 = pdf?.contenido_base64;
  if (pdf?.tipo_contenido !== 'application/pdf' || pdf.persistido !== persistido || typeof base64 !== 'string' || !base64.length
    || base64.length > 4 * Math.ceil(MAX_PDF_PREVIA / 3) || base64.length % 4 !== 0
    || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) throw new Error('La respuesta no contiene una vista previa PDF válida.');
  const binario = atob(base64);
  if (btoa(binario) !== base64 || binario.length > MAX_PDF_PREVIA || !binario.startsWith('%PDF-') || !binario.trimEnd().endsWith('%%EOF')) throw new Error('El PDF de vista previa está vacío, corrupto o excede el tamaño permitido.');
  const bytes = Uint8Array.from(binario, c => c.charCodeAt(0));
  const nombre = typeof pdf.nombre_archivo === 'string' && /^[\w. -]+\.pdf$/i.test(pdf.nombre_archivo) ? pdf.nombre_archivo : 'vista-previa-certificado.pdf';
  return { blob: new Blob([bytes], { type: 'application/pdf' }), nombre };
}

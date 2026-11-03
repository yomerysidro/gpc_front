import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

/** No inyecta servicios administrativos ni solicita una sesion institucional. */
@Component({
  selector: 'app-verificacion-publica', standalone: true,
  template: `
    <main class="verificacion-publica">
      <img src="/marca/escudo-160.webp" alt="Escudo de la Municipalidad Distrital de Morales" width="80" height="80" />
      <p>Municipalidad Distrital de Morales</p>
      <h1>Consulta de autenticidad de certificados</h1>
      <section class="card" aria-labelledby="consulta-publica-titulo">
        <h2 id="consulta-publica-titulo">Verificar un documento</h2>
        <div class="form-field">
          <label for="codigo-publico">Código de verificación del documento</label>
          <input id="codigo-publico" class="input" maxlength="30" [value]="parametros()?.get('codigo') ?? ''" aria-describedby="verificacion-pendiente" />
        </div>
        <button class="btn btn-consulta" disabled aria-describedby="verificacion-pendiente">Consultar autenticidad</button>
        <p id="verificacion-pendiente" class="alert alert-advertencia" role="status">Integración pendiente: la consulta pública de autenticidad aún no está disponible. No se puede determinar la autenticidad ni la vigencia de este documento.</p>
        <p>Esta página no consulta registros administrativos ni acredita firmas digitales.</p>
      </section>
    </main>
  `,
  styles: `:host { display: block; } .verificacion-publica { max-width: 48rem; margin: auto; padding: var(--espacio-6); } img { object-fit: contain; } .alert { margin-top: var(--espacio-5); }`,
})
export class VerificacionPublicaComponent {
  protected readonly parametros = toSignal(inject(ActivatedRoute).paramMap);
}

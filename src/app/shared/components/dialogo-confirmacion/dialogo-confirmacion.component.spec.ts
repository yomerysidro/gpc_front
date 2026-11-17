import { TestBed } from '@angular/core/testing';
import { DialogoConfirmacionComponent } from './dialogo-confirmacion.component';

describe('DialogoConfirmacionComponent', () => {
  const crear = async () => {
    const fixture = TestBed.createComponent(DialogoConfirmacionComponent);
    fixture.componentRef.setInput('titulo', 'Salir sin guardar');
    fixture.componentRef.setInput('texto', 'Los cambios se perderán.');
    fixture.componentRef.setInput('confirmar', 'Salir sin guardar');
    fixture.autoDetectChanges();
    await fixture.whenStable();
    return fixture;
  };
  const botones = (el: HTMLElement) => el.querySelectorAll<HTMLButtonElement>('.dialogo-acciones button');

  it('resuelve true al confirmar y cierra el diálogo', async () => {
    const fixture = await crear();
    const respuesta = fixture.componentInstance.abrir();
    await fixture.whenStable();
    const dialogo: HTMLDialogElement = fixture.nativeElement.querySelector('dialog');
    expect(dialogo.open).toBeTrue();
    expect(dialogo.getAttribute('aria-describedby')).toBe(fixture.nativeElement.querySelector('p').id);
    botones(fixture.nativeElement)[1].click();
    expect(await respuesta).toBeTrue();
    expect(dialogo.open).toBeFalse();
  });

  it('resuelve false al cancelar o con Esc', async () => {
    const fixture = await crear();
    const cancelar = fixture.componentInstance.abrir();
    await fixture.whenStable();
    botones(fixture.nativeElement)[0].click();
    expect(await cancelar).toBeFalse();

    const esc = fixture.componentInstance.abrir();
    await fixture.whenStable();
    fixture.nativeElement.querySelector('dialog').close();
    expect(await esc).toBeFalse();
  });
});

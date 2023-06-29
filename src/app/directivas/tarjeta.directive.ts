import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appTarjeta]',
})
export class TarjetaDirective implements OnInit {
  @Input('appTarjeta') tipoTarjeta = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const img = document.createElement('img');
    const p = document.createElement('p');
    const des = document.createElement('p');
    const small = document.createElement('small');
    let contenidoP: any = '';
    let contenidoSmall: any = '';
    let contenidoDes: any = '';

    img.style.marginTop = '2rem';
    img.style.width = '9rem';
    img.style.display = 'block';
    img.style.marginLeft = 'auto';
    img.style.marginRight = 'auto';
    p.style.textAlign = 'center';
    p.style.color = '#fff';
    p.style.fontWeight = 'bolder';
    p.style.textShadow = '1px 1px #000';
    p.style.marginTop = '1rem';
    des.style.textAlign = 'center';
    des.style.color = '#fff';
    des.style.fontWeight = 'bolder';
    des.style.textShadow = '1px 1px #000';
    des.style.marginTop = '1rem';
    small.style.display = 'block';
    small.style.color = '#fff';
    small.style.fontSize = '1rem';
    small.style.textAlign = 'center';

    if (this.tipoTarjeta == 'log') {
      contenidoP = document.createTextNode('LOG DE LOS INGRESOS AL SISTEMA');
      contenidoDes = document.createTextNode('Descripcion del informe: ');
      img.src = '../../assets/log.png';
      contenidoSmall = document.createTextNode(
        'Detalle de los inicio de sesión de todos los usuarios'
      );
    } else if (this.tipoTarjeta == 'especialidad') {
      contenidoP = document.createTextNode('TURNOS POR ESPECIALIDAD');
      contenidoDes = document.createTextNode('Descripcion del informe: ');
      img.src = '../../assets/graficoDeTorta.png';
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos solicitados por especialidad'
      );
    } else if (this.tipoTarjeta == 'dia') {
      contenidoP = document.createTextNode('CANTIDAD DE TURNOS POR DÍA');
      contenidoDes = document.createTextNode('Descripcion del informe: ');
      img.src = '../../assets/grafico-de-barras.png';
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos solicitados por día'
      );
    } else if (this.tipoTarjeta == 'solicitados') {
      contenidoP = document.createTextNode('TURNOS EN ESTADO DE SOLICITUD');
      contenidoDes = document.createTextNode('Descripcion del informe: ');
      img.src = '../../assets/graficoDona.png';
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos solicitados por un médico en un lapso de tiempo'
      );
    } else if (this.tipoTarjeta == 'finalizados') {
      contenidoP = document.createTextNode('TURNOS EN ESTADO YA FINALIZADOS');
      contenidoDes = document.createTextNode('Descripcion del informe: ');
      img.src = '../../assets/grafico-circular.png';
      contenidoSmall = document.createTextNode(
        'Cantidad de turnos finalizados por un médico en un lapso d tiempo'
      );
    }

    p.appendChild(contenidoP);
    des.appendChild(contenidoDes);
    small.appendChild(contenidoSmall);

    this.el.nativeElement.appendChild(p);
    this.el.nativeElement.appendChild(img);
    this.el.nativeElement.appendChild(des);
    this.el.nativeElement.appendChild(small);
  }
}
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appHover]',
})
export class HoverDirective implements OnInit {
  @Input('appHover') colorHover = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  @HostListener('mouseenter') onMouseEnter() {
    this.hover(this.colorHover);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover('default');
  }

  private hover(color: string) {
    if (color == 'violeta') {
      this.el.nativeElement.style.background = 'rgb(189, 138, 191)';
      this.el.nativeElement.style.transition = 'background 0.5s';
      this.el.nativeElement.style.cursor = 'pointer';
      var pElements = this.el.nativeElement.querySelectorAll('p');
      var smallElement = this.el.nativeElement.querySelector('small');
      // var desElement = this.el.nativeElement.querySelector('des');
  
      // Cambiar el color del texto a negro
      pElements.forEach(function(pElement: HTMLElement) {
      pElement.style.color = 'black';
      pElement.style.textShadow = '0px 0px #000';
      pElement.style.fontWeight = '0';});
      // desElement.style.color = 'black';
      // desElement.style.fontWeight = '0';
      smallElement.style.color = 'black';
      smallElement.style.fontWeight = 'bolder';
      console.log(this.el.nativeElement);

    }

    if (color == 'default') {
      this.el.nativeElement.style.background= 'rgba(255, 255, 255, 0.116)';
      this.el.nativeElement.style.backdrop= 'blur(10px)';
      var pElements = this.el.nativeElement.querySelectorAll('p');
      var smallElement = this.el.nativeElement.querySelector('small');
      // var desElement = this.el.nativeElement.querySelector('des');

  
      // Cambiar el color del texto a negro
      pElements.forEach(function(pElement: HTMLElement) {
      pElement.style.color = '#fff';
      pElement.style.fontWeight = 'bolder';  });
      // desElement.style.color = '#fff';
      // desElement.style.fontWeight = 'bolder';
      smallElement.style.color = '#fff';
      smallElement.style.fontWeight = 'normal';
      smallElement.style.fontSize = '1rem';
      // console.log(pElement);



    }
  }
}
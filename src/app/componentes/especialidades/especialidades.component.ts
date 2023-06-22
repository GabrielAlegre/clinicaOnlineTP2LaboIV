import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'src/app/servicios/firestore.service';
// import { FirestoreService } from 'src/app/services/firestore.service';
// import { ServiceAlert } from 'src/app/services/swal.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent {
  @Output() botonClickeado = new EventEmitter<any>();
  especialidades: string[] = [];
  listaFiltrada: string[] = [];
  valorInput: string;
  nuevaEspecialidad: string;
  inputValidado: boolean = false;
  listaEspecialidades: any;

  constructor( private firestoreService: FirestoreService,
    private serviceAlert:SweetalertService,) {
    this.listaEspecialidades = [];
    this.nuevaEspecialidad = "";
    this.valorInput = "";
  }

  ngOnInit(): void {
    this.listaFiltrada = [];
    this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.listaFiltrada = [...this.especialidades];
    });
  }

  validarEspecialidad() {
    if (this.valorInput.match(/^[a-zA-Z ]+$/)) {
      this.inputValidado = true;
      this.nuevaEspecialidad = this.valorInput;
    }
    else {
      this.inputValidado = false;
    }
    this.valorInput = '';
    this.listaFiltrada = [...this.especialidades];
  }

  filtrarLista() {
    this.listaFiltrada = this.especialidades.filter((item: string) =>
    item.toLowerCase().startsWith(this.valorInput.toLowerCase()));
  }

  agregarItem() {
    if (this.inputValidado) {
      this.firestoreService.setEspecialidad(this.nuevaEspecialidad);
      this.serviceAlert.showSuccessAlert("Especialidad agregada con éxito!", "AGREGADA", 'success');
    }
    else {
      this.serviceAlert.showSuccessAlert("Sólo debe contener letras", "FALLÓ AL AGREGAR", 'error');
    }
  }


  ayuda() {
    this.serviceAlert.showSuccessAlert("Si no encuentra su especialidad en la lista, puede agregarla escribiendola y tocando el botón '+'", "Modo de uso:", 'info');
  }

  // borrarContenido() {
  //  this.nuevaEspecialidad = '';
  // this.listaFiltrada = [...this.especialidades];
  // }

  // clickListado(especialidad: any) {
  //   if (!this.listaEspecialidades.includes(especialidad) && this.listaEspecialidades.length < 5) {
  //     this.listaEspecialidades.push(especialidad);
  //     this.botonClickeado.emit(this.listaEspecialidades);
  //   }
  //   else if (this.listaEspecialidades.includes(especialidad) && this.listaEspecialidades.length < 6) {
  //     let indice = this.listaEspecialidades.indexOf(especialidad);
  //     this.listaEspecialidades.splice(indice, 1);
  //     this.botonClickeado.emit(this.listaEspecialidades);
  //   }
  // }
  
  clickListado(especialidad: any) {

    const especialidadConNombre = { nombre: especialidad };

    if (!this.listaEspecialidades.some((e:any) => e.nombre === especialidad)) {
      if (this.listaEspecialidades.length < 2) {
        this.listaEspecialidades.push(especialidadConNombre);
        this.botonClickeado.emit(this.listaEspecialidades);
      }
    } else {
      const indice = this.listaEspecialidades.findIndex((e:any) => e.nombre === especialidad);
      this.listaEspecialidades.splice(indice, 1);
      this.botonClickeado.emit(this.listaEspecialidades);
    }
  
  }
  
}

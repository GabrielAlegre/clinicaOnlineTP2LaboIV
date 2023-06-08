import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';
@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent {
  @Output() botonClickeadoUsuarios = new EventEmitter<any>();
  arrayDePacientes:any;
  arrayDeEspecialista:any;
  arrayDeAdmins:any;
  // mostrarSpinner:boolean=false;
  constructor(private serviceAlert:SweetalertService, private authlogin:AuthService, private firestore:FirestoreService) {
    this.arrayDePacientes=[];
    this.arrayDeEspecialista=[];
    this.arrayDeAdmins=[];
  }
  
  ngOnInit(): void {
    this.firestore.traer().subscribe(pacientes => {
      this.arrayDePacientes=pacientes;   
    });

    this.firestore.traerEspecialistas().subscribe(especialistas => {
      this.arrayDeEspecialista=especialistas;   
    });

    this.firestore.traerAdministradores().subscribe(administradores => {
      this.arrayDeAdmins=administradores;   
    });
    // this.mostrarSpinner = true;
    // setTimeout(() => {
    //   this.mostrarSpinner = false;
    // }, 3000);
  }
 
  clickListado(usuario: any) {
    // const eventData = { users: usuario, tipo: num };
    console.log(usuario);
    this.botonClickeadoUsuarios.emit(usuario);
  }
}

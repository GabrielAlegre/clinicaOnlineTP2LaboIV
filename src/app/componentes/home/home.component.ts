import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  especialidades: string[] = [];
  listaFiltrada: string[] = [];
  arrayDePacientes:any;
  arrayDeEspecialista:any;
  arrayDeAdmins:any;
  usersList: any[] = [];

  constructor(public authlogin:AuthService, private firestoreService: FirestoreService){
    this.arrayDePacientes=[];
    this.arrayDeEspecialista=[];
    this.arrayDeAdmins=[];
  }

  ngOnInit() {
    this.listaFiltrada = [];
    this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.listaFiltrada = [...this.especialidades];
    });

    this.firestoreService.traer().subscribe(pacientes => {
      this.arrayDePacientes=pacientes;   
    });

    this.firestoreService.traerEspecialistas().subscribe(especialistas => {
      this.arrayDeEspecialista=especialistas;   
    });

    this.firestoreService.traerAdministradores().subscribe(administradores => {
      this.arrayDeAdmins=administradores;   
    });

    this.firestoreService.traerUsuariosCombinados().subscribe((users) => {
      this.usersList = users;
  });
  }

  
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';


@Component({
    selector: 'app-seccion-usuarios',
    templateUrl: './seccion-usuarios.component.html',
    styleUrls: ['./seccion-usuarios.component.css']
})
export class SeccionUsuariosComponent {
    queQuiereRegistrar: string = "";
    usersList: any[] = [];
    createrUserMenu: boolean = false;
    formPaciente: boolean = false;
    formEspecialista: boolean = false;
    formAdministrador: boolean = false;
    spinner: boolean = false;
    perfil: string = "";

    constructor(private firestoreService: FirestoreService, private serviceAlert: SweetalertService, private router:Router) {
    }

    ngOnInit(): void {
        // this.spinner = true;
        this.firestoreService.traerUsuariosCombinados().subscribe((users) => {
            this.usersList = users;
        });
    }


    updateUser(user: any, option: number) {
        if (user.hasOwnProperty("especialidad")) {
            if (option == 1) {
                user.habilitado = true;
                this.firestoreService.updateEspecialista(user);
                this.serviceAlert.showSuccessAlert('Excelente el especialita: '+user.nombre+' ha sido hablitado', 'Usuario habilitado correctamente!', 'success');
            } else if (option == 2) {
                user.habilitado = false;
                this.firestoreService.updateEspecialista(user);
                this.serviceAlert.showSuccessAlert('Excelente el especialita: '+user.nombre+' ha sido inhabilitar', 'Usuario inhabilitado correctamente!', 'warning');
            }
        }
    }

    showCreateUserMenu() {
        this.spinner = true;
        setTimeout(() => {
            this.spinner = false;
        }, 1500);
        this.createrUserMenu = true;
    }

    showUserList() {
        this.createrUserMenu = false;
        this.formPaciente = false;
        this.formEspecialista = false;
        this.formAdministrador = false;
    }

    goToFormPaciente() {
        this.formPaciente = true;
        this.queQuiereRegistrar="paciente";
        // this.router.navigate(['/registro']);
    }

    goToFormEspecialista() {
        this.formEspecialista = true;
        this.queQuiereRegistrar="especialista";
        // this.router.navigate(['/registro']);
    }

    goToFormAdministrador() {
        this.formAdministrador = true;
        // this.queQuiereRegistrar="admin";
    }

    goToRegistro() {
        this.formPaciente = false;
        this.formEspecialista = false;
        this.formAdministrador = false;
    }
}
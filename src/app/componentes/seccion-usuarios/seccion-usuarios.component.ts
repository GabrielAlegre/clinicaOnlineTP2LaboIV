import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { format } from 'date-fns';

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
  historialClinico: any[] = [];
  user: any = null;
  fechaActual: Date = new Date();
  listaTurnos: any[] = [];
  listaFiltrada: any;
  especialidades: any;
  descargar=true;

  constructor(private firestoreService: FirestoreService, private serviceAlert: SweetalertService, private router: Router) {
  }
  onModalShow() {
    this.descargar = false;
    console.log('El modal se abrió');
  }

  onModalHidden() {
    this.descargar = true;
    console.log('El modal se cerró');
  }

  ngOnInit(): void {
    // this.spinner = true;
    // this.firestoreService.traerUsuariosCombinados().subscribe((users) => {
    //     this.usersList = users;
    // });


    //historial
    this.spinner = true;
    this.listaFiltrada = [];
    this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.listaFiltrada = [...this.especialidades];
    });


    this.firestoreService.traerUsuariosCombinados().subscribe((users) => {
      this.usersList = users;

      // Obtener UIDs de usuarios pacientes
      const usuariosPacientes = this.usersList
        .filter((user: any) => user.obraSocial)
        .map((user: any) => user.uid);

      // Obtener historiales clínicos
      this.firestoreService.getHistorialesClinicos().subscribe((historiales) => {

        const historialesPacientes = historiales.filter((historial: any) =>
          usuariosPacientes.includes(historial.paciente.uid)
        );

        // Enlazar historiales clínicos a los usuarios pacientes
        this.usersList.forEach((user: any) => {
          if (user.obraSocial) {
            user.historialesClinicos = historialesPacientes.filter(
              (historial: any) =>
                historial.paciente.uid === user.uid
            );
          }
        });

        this.spinner = false;
      });
    });

    this.firestoreService.getTurnList().subscribe((turnos: any) => {
      this.listaTurnos = [];
      for (let i = 0; i < turnos.length; i++) {
        const turnoEspecialista = turnos[i].turnos;
        for (let j = 0; j < turnoEspecialista.length; j++) {
          const t = turnoEspecialista[j];
          this.listaTurnos.push(t);
        }
      }
      // console.log(this.listaTurnos);
    });
  }


  updateUser(user: any, option: number) {
    if (user.hasOwnProperty("especialidad")) {
      if (option == 1) {
        user.habilitado = true;
        this.firestoreService.updateEspecialista(user);
        this.serviceAlert.showSuccessAlert('Excelente el especialita: ' + user.nombre + ' ha sido hablitado', 'Usuario habilitado correctamente!', 'success');
      } else if (option == 2) {
        user.habilitado = false;
        this.firestoreService.updateEspecialista(user);
        this.serviceAlert.showSuccessAlert('Excelente el especialita: ' + user.nombre + ' ha sido inhabilitar', 'Usuario inhabilitado correctamente!', 'warning');
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
    this.queQuiereRegistrar = "paciente";
    // this.router.navigate(['/registro']);
  }

  goToFormEspecialista() {
    this.formEspecialista = true;
    this.queQuiereRegistrar = "especialista";
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

  verHistorialClinico(user: any) {
    this.descargar=false;
    this.historialClinico = user.historialesClinicos;
  }
  cerroHistorial()
  {
    this.descargar=true;
  }

  //Excel
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  verTurnosUsuario(usuario: any) {
    if(this.descargar)
    {
      const listaTurnosUsuario: any[] = [];

      if (usuario.obraSocial) {
        this.listaTurnos.forEach((t: any) => {
          if (usuario.uid == t?.paciente?.uid) {
            const turno: any = {};
            // turno.nombrePac = usuario.nombre;
            // turno.apellidoPac = usuario.apellido;
            // turno.fechaDelTurno = new Date(t.fecha.seconds * 1000);
            // turno.horaDelTurno = format(new Date(t.fecha.seconds * 1000), 'HH:mm:ss');
            // turno.especialidad = t.especialidad;
            // turno.nombreEsp = t.especialista.nombre;
            // turno.apellidoEsp = t.especialista.apellido;
            // turno.estado = t.estado;
            turno.paciente = usuario.nombre+', '+usuario.apellido;
            turno.fechaDelTurno = new Date(t.fecha.seconds * 1000);
            turno.horaDelTurno = format(new Date(t.fecha.seconds * 1000), 'HH:mm:ss');
            turno.especialista = t.especialista.nombre+', '+t.especialista.apellido;
            turno.especialidad = t.especialidad;
            turno.estado = t.estado;
            listaTurnosUsuario.push(turno);
          }
        });
        if (listaTurnosUsuario.length == 0) {
          this.serviceAlert.showSuccessAlert(
            'El paciente no tiene turnos',
            'Usuarios',
            'info'
          );
        } else {
          this.exportAsExcelFile(listaTurnosUsuario, 'turnosPaciente');
          this.serviceAlert.showSuccessAlert(
            'Turnos del paciente ' + usuario.nombre+', '+usuario.apellido+' descargado',
            'Usuarios',
            'success'
          );
        }
      }
      // } else {
      //   this.serviceAlert.showSuccessAlert(
      //     'Debes elegir un paciente',
      //     'Usuarios',
      //     'warning'
      //   );
      // }
    }
  }

  verTodosUsuarios() {
    const listaUsuarios: any[] = [];
    this.usersList.forEach((user: any) => {
      const usuario: any = {};
      if (user.obraSocial) {
        usuario.perfil = "PACIENTE";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.mail = user.mail;
        usuario.dni = user.dni;
        usuario.obraSocial = user.obraSocial;
        usuario.especialidad="-";
        listaUsuarios.push(usuario);
      }
      else if (user.especialidad) {
        usuario.perfil = "ESPECIALISTA";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.mail = user.mail;
        usuario.dni = user.dni;
        usuario.obraSocial = "-";
        user.especialidad?.forEach((especialidad: any, index: number) => {
          if (especialidad != undefined) {
            if (index == 0) {
              usuario.especialidad = ""
            }
            usuario.especialidad += especialidad.nombre;

            if (index !== user.especialidad.length - 1) {
              usuario.especialidad += " - ";
            }
          }
        });
        listaUsuarios.push(usuario);
      }
      else {
        usuario.perfil = "ADMINISTRADOR";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.mail = user.mail;
        usuario.dni = user.dni;
        usuario.especialidad="-";
        usuario.obraSocial = "-";
        listaUsuarios.push(usuario);
      }
    });
    if (listaUsuarios.length == 0) {
      this.serviceAlert.showSuccessAlert(
        'No hay usuarios registrados',
        'Usuarios',
        'info'
      );
    } else {
      this.exportAsExcelFile(listaUsuarios, 'listaUsuarios');
      this.serviceAlert.showSuccessAlert(
        'Listado de usuarios descargado',
        'Usuarios',
        'success'
      );
    }
  }
}
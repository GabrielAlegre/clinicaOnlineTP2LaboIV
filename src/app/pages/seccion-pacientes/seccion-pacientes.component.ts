import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { FirestoreService } from '../../servicios/firestore.service';
import { SweetalertService } from '../../servicios/sweetalert.service';

@Component({
  selector: 'app-seccion-pacientes',
  templateUrl: './seccion-pacientes.component.html',
  styleUrls: ['./seccion-pacientes.component.scss']
})
export class SeccionPacientesComponent {
  spinner: boolean = false;
  user: any = null;
  listaDeUsuarios: any[] = [];

  pacientesAtendidos: any[] = [];

  historialClinico: any[] = [];
  historialActivo: any[] = [];
  historialClinicoDelEspecialista: any[] = [];
  hayPacientesAtendidos: boolean = false;
  especialidadesDelEspecialista:any;
  pacienteDelQueSeVeraElHistorial:any=null;

  constructor(
    private authService: AuthService,
    private notificationService: SweetalertService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      this.spinner = false;
      if (user) {
        this.user = user;
        this.especialidadesDelEspecialista=""
        this.user.especialidad?.forEach((especialidad: any, index: number) => {
          if (especialidad != undefined) {
            this.especialidadesDelEspecialista += especialidad.nombre;
            
            if (index !== this.user.especialidad.length - 1) {
              this.especialidadesDelEspecialista += " - ";
            }
          }
        });
        
        console.log(this.especialidadesDelEspecialista);
      }
      //el this.firestoreService.traer() trae solamente a los pacientes!!!
      this.firestoreService.traer().subscribe((users) => {
        if (users) {
          this.listaDeUsuarios = users;
        }
        this.firestoreService.getHistorialesClinicos().subscribe((historiales) => {
          this.historialClinico = historiales;
          this.pacientesAtendidos = [];
          this.historialClinicoDelEspecialista = [];
          historiales.forEach((unHistorial) => {
            for (let i = 0; i < this.listaDeUsuarios.length; i++) {
              const usuario = this.listaDeUsuarios[i];
              if (usuario.uid == unHistorial.paciente.uid && this.user.uid == unHistorial.especialista.uid) 
              {
                this.listaDeUsuarios[i].historial = true;
                this.pacientesAtendidos = this.pacientesAtendidos.filter(
                  (p) => {
                    return p.uid != usuario.uid;
                  }
                  );
                  this.pacientesAtendidos.push(usuario);
              }
            }
          });

          this.historialClinicoDelEspecialista = this.historialClinico.filter(
            (h) => {
              if(user)
              {
                return h.especialista.uid == user.uid;
              }
              return 0;
            }
          );

          this.historialClinicoDelEspecialista.forEach((h) => {
            h.paciente.contadorHistorial = 0;
          });
          for (let i = 0; i < this.pacientesAtendidos.length; i++) {
            const paciente = this.pacientesAtendidos[i];
            paciente.contador = 0;
            this.historialClinicoDelEspecialista.forEach((h) => {
              if (paciente.uid == h.paciente.uid) {
                paciente.contador++;
                h.paciente.contador = paciente.contador;
              }
            });
          }

          if (this.pacientesAtendidos.length == 0) {
            this.hayPacientesAtendidos = false;
          } else {
            this.hayPacientesAtendidos = true;
          }
        });
      });
    });
  }

  verHistorialPaciente(paciente: any) {
    this.historialActivo = [];
    for (let i = 0; i < this.historialClinico.length; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.uid == paciente.uid) {
        this.historialActivo.push(historial);
        this.pacienteDelQueSeVeraElHistorial=historial.paciente;
      }
    }
  }
}

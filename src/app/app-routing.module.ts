import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AccesosComponent } from './componentes/accesos/accesos.component';
import { LoginComponent } from './componentes/login/login.component';
import { ListadoUsuariosComponent } from './componentes/listado-usuarios/listado-usuarios.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { RegistroAdministradorComponent } from './componentes/registro-administrador/registro-administrador.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { SeccionPacientesComponent } from './pages/seccion-pacientes/seccion-pacientes.component';
import { InformesComponent } from './pages/informes/informes.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent},
  {path: "registro", component: RegistroComponent},
  {path: "login", component: LoginComponent, data: { animation: 'Login'}},
  {path: "solicitarTurno", component: SolicitarTurnoComponent, data: { animation: 'Perfil'}},
  {path: "listadoUsers", component: ListadoUsuariosComponent},
  // {path: "seccionUsuarios", component:SeccionUsuariosComponent},
  {path: "administrador", component: SeccionUsuariosComponent, children: [{path: "seccionUsuarios", component:SeccionUsuariosComponent}]},
  {path: "regisAdmin", component:RegistroAdministradorComponent},
  {path: "accesos", component: AccesosComponent},
  {path: "misTurnos", component: MisTurnosComponent},
  {path: "miPerfil", component: MiPerfilComponent},
  // {path: "turnos", component: TurnosComponent},
  {path: "administrador", component: TurnosComponent, children: [{path: "turnos", component: TurnosComponent}]},
  {path: "seccionPacientes", component: SeccionPacientesComponent},
  // {path: "informes", component: InformesComponent},
  {path: "administrador", component: InformesComponent, children: [{path: "informes", component: InformesComponent}]},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

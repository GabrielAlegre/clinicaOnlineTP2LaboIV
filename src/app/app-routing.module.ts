import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AccesosComponent } from './componentes/accesos/accesos.component';
import { LoginComponent } from './componentes/login/login.component';
import { ListadoUsuariosComponent } from './componentes/listado-usuarios/listado-usuarios.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { RegistroAdministradorComponent } from './componentes/registro-administrador/registro-administrador.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent},
  {path: "registro", component: RegistroComponent},
  {path: "login", component: LoginComponent},
  {path: "listadoUsers", component: ListadoUsuariosComponent},
  {path: "seccionUsuarios", component:SeccionUsuariosComponent},
  {path: "regisAdmin", component:RegistroAdministradorComponent},
  {path: "accesos", component: AccesosComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

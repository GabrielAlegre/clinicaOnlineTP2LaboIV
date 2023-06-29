import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { AccesosComponent } from './componentes/accesos/accesos.component';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { EspecialidadesComponent } from './componentes/especialidades/especialidades.component';
import { LoginComponent } from './componentes/login/login.component';
import { ListadoUsuariosComponent } from './componentes/listado-usuarios/listado-usuarios.component';
// import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { RegistroAdministradorComponent } from './componentes/registro-administrador/registro-administrador.component';
import { LoadingComponent } from './componentes/loading/loading.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { SeccionPacientesComponent } from './pages/seccion-pacientes/seccion-pacientes.component';
import { InformesComponent } from './pages/informes/informes.component';
import { HoverDirective } from './directivas/hover.directive';
import { BotonDirective } from './directivas/boton.directive';
import { TarjetaDirective } from './directivas/tarjeta.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DayWithHourPipe } from './pipes/day-with-hour.pipe';
import { DayDatePipe } from './pipes/day-date.pipe';
import { DatePipe } from './pipes/date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistroComponent,
    NavBarComponent,
    AccesosComponent,
    SeccionUsuariosComponent,
    EspecialidadesComponent,
    LoginComponent,
    ListadoUsuariosComponent,
    RegistroAdministradorComponent,
    LoadingComponent,
    MisTurnosComponent,
    MiPerfilComponent,
    TurnosComponent,
    SolicitarTurnoComponent,
    SeccionPacientesComponent,
    InformesComponent,
    HoverDirective,
    BotonDirective,
    TarjetaDirective,
    DayWithHourPipe,
    DayDatePipe,
    DatePipe,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

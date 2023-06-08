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
  ],
  imports: [
    FormsModule,
    BrowserModule,
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

import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { SweetalertService } from './sweetalert.service';
// import { NotificationService } from './notification.service';
import { addDoc, collection, collectionData, Firestore, getDoc, getDocs, updateDoc } from "@angular/fire/firestore";
// import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, of, switchMap } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$?: any;
  token: string = "";
  sePudo: boolean = false;
  esconderBotonCierre: boolean = true;
  emailDelUserQueSeLogueo: string = "";
  nombreDelUserQueSeLogueo: string = "";
  fotoDelUser = "";
  perfilDelUsuario = "";

  constructor(private serviceFirestore: FirestoreService, private angularFirestore: AngularFirestore, private router: Router, private serviceAlert: SweetalertService, private firestore: Firestore, private angularFireAuth: AngularFireAuth) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          return this.serviceFirestore.traerUsuario(user.uid).pipe(
            map((usuario: any) => {
              if (usuario?.obraSocial) {
                return usuario;

              } else if (usuario?.especialidad) {
                return usuario;
              }
              else {
                return usuario;
              }
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  login(email: string | any, password: string | any, esRegistro: number, nombreUser?: string, foto?: string, perfil?: string) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(
      response => {
        firebase.auth().currentUser?.getIdToken().then(
          token => {
            // this.notificacion.toasCorrecto("Bienvenido "+nombreUser, "Inicio de sesion exitoso");
            if (firebase.auth().currentUser?.emailVerified) {
              this.emailDelUserQueSeLogueo = email;
              this.token = token;
              this.sePudo = true;
              this.esconderBotonCierre = false;
              if (perfil != undefined) {
                this.perfilDelUsuario = perfil;
              }
              if (foto != undefined) {
                this.fotoDelUser = foto;
              }
              if (nombreUser != undefined) {
                this.nombreDelUserQueSeLogueo = nombreUser;
              }
              this.router.navigate(['/home']);

              if (esRegistro == 0) {

                this.serviceAlert.showSuccessAlert(`Login exitoso`, "Bienvenido " + nombreUser + "!", 'success');
              }
              else {
                this.serviceAlert.showSuccessAlert(`Se registro correctamente al usuario `, "excelente!", 'success');
              }
            }
            else {
              this.serviceAlert.showSuccessAlert(`Por favor revise su correo`, "Mail no verificado!", 'error');
            }


          }
        )
      }
    )
      .catch(
        error => {
          this.sePudo = false;
          if (email == "" || password == "") {
            this.serviceAlert.showSuccessAlert(`Debe completar todos los campos para iniciar sesión `, "Ups!", 'warning');
          }
          else {
            this.serviceAlert.showSuccessAlert(`Debe campos incorrectos`, "Ups!", 'error');
          }
        }
      )
  }

  getIdToken() {
    return this.token;
  }

  desloguear() {
    firebase.auth().signOut();
    this.token = "";
    this.router.navigateByUrl("login");
    this.serviceAlert.showSuccessAlert(`Cierre de sesion exitoso!`, "Excelente!", 'success');
    this.esconderBotonCierre = true;
    this.sePudo = false;
  }


  getSeLogueo() {
    return this.sePudo;
  }

  getEstaLogueado() {
    return this.esconderBotonCierre;
  }

  getEmailUser() {
    return firebase.auth().currentUser?.email;
  }

}

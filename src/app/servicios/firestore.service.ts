import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Paciente } from '../clases/paciente';
import { Especialista } from '../clases/especialista';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SweetalertService } from './sweetalert.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Administrador } from '../clases/administrador';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  images: string[] = [];

  constructor(private angularFirestore: AngularFirestore, private angularFireAuth: AngularFireAuth, private serviceAlert:SweetalertService) {
  }

  guardar(paciente: Paciente) {
    this.angularFireAuth.createUserWithEmailAndPassword(paciente.mail,  paciente.password).then((data) =>{
      data.user?.sendEmailVerification();

      // const documento = this.angularFirestore.doc('pacientes/' + this.angularFirestore.createId());
      // const uid = documento.ref.id;

      const uid = data.user?.uid;

      const documento = this.angularFirestore.doc('pacientes/' + uid);

      documento.set({
        uid: uid,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        edad: paciente.edad,
        dni: paciente.dni,
        obraSocial: paciente.obraSocial,
        mail: paciente.mail,
        password: paciente.password,
        fotos: paciente.fotos
      })
      .then(() => {
        this.serviceAlert.showSuccessAlert("Registro exitoso. Verifique su correo.", "Exito", "success")
      })
      .catch(()=>{
        this.serviceAlert.showSuccessAlert("Ocurrio un error al registrarse", "Error", "error")
      })
    })
    .catch(()=>{
      this.serviceAlert.showSuccessAlert("Ocurrio un error", "Error", "error")
    })
  }

  traer() {
    const collection = this.angularFirestore.collection<any>('pacientes');
    return collection.valueChanges();
  }

  traerEspecialistas() {
    const collection = this.angularFirestore.collection<any>('especialistas');
    return collection.valueChanges();
  }

  traerAdministradores() {
    const collection = this.angularFirestore.collection<any>('administradores');
    return collection.valueChanges();
  }

  traerEspecialidades() {
    const collection = this.angularFirestore.collection<any>('especialidades');
    return collection.valueChanges();
  }

  traerUsuarios() {
    const pacientesCollection = this.angularFirestore.collection<any>('pacientes').valueChanges();
    const especialidadesCollection = this.angularFirestore.collection<any>('especialistas').valueChanges();
  
    return combineLatest([pacientesCollection, especialidadesCollection]).pipe(
      map(([pacientes, especialidades]) => {
        // Aquí puedes realizar cualquier operación deseada con los datos de ambas colecciones
        // console.log('Datos de pacientes:', pacientes);
        // console.log('Datos de especialidades:', especialidades);
  
        // Puedes combinar los datos en un solo arreglo o estructura de datos si lo necesitas
        const datosCombinados = {
          pacientes,
          especialidades
        };
  
        return datosCombinados;
      })
    );
  }

  traerUsuariosCombinados() {
    const pacientesCollection = this.angularFirestore.collection<any>('pacientes').valueChanges();
    const especialidadesCollection = this.angularFirestore.collection<any>('especialistas').valueChanges();
    const administradoresCollection = this.angularFirestore.collection<any>('administradores').valueChanges();

    return combineLatest([pacientesCollection, especialidadesCollection, administradoresCollection]).pipe(
      map(([pacientes, especialidades, administradores]) => {

        const datosCombinados = {
          pacientes,
          especialidades,
          administradores
        };

        const arrayUsuarios: any[] = [];

        for (const unUser of datosCombinados.pacientes) {
          arrayUsuarios.push(unUser);
        }
        for (const especialistas of datosCombinados.especialidades) {
          arrayUsuarios.push(especialistas);
        }
        for (const admin of datosCombinados.administradores) {
          arrayUsuarios.push(admin);
        }

        return arrayUsuarios;
      })
    );
  }

  guardarEsp(especialista: Especialista) {
    this.angularFireAuth.createUserWithEmailAndPassword(especialista.mail,  especialista.password).then((data) =>{
      data.user?.sendEmailVerification();

      const uid = data.user?.uid;
      const documento = this.angularFirestore.doc('especialistas/' + uid);

      documento.set({
        uid: uid,
        nombre: especialista.nombre,
        apellido: especialista.apellido,
        edad: especialista.edad,
        dni: especialista.dni,
        especialidad: especialista.especialidad,
        mail: especialista.mail,
        password: especialista.password,
        fotos: especialista.foto,
        habilitado: especialista.habilitado
      })
      .then(() => {
        this.serviceAlert.showSuccessAlert("Registro exitoso. Verifique su correo.", "Exito", "success")
      })
      .catch(()=>{
        this.serviceAlert.showSuccessAlert("Ocurrio un error al registrarse", "Error", "error")
      })
    })
    .catch(()=>{
      this.serviceAlert.showSuccessAlert("Ocurrio un error", "Error", "error")
    })
  }

  guardarAdmin(administrador: Administrador) {
    this.angularFireAuth.createUserWithEmailAndPassword(administrador.mail,  administrador.password).then((data) =>{
      data.user?.sendEmailVerification();
      
      const uid = data.user?.uid;
      const documento = this.angularFirestore.doc('administradores/' + uid);


      documento.set({
        uid: uid,
        nombre: administrador.nombre,
        apellido: administrador.apellido,
        edad: administrador.edad,
        dni: administrador.dni,
        mail: administrador.mail,
        password: administrador.password,
        fotos: administrador.fotos,
      })
      .then(() => {
        this.serviceAlert.showSuccessAlert("Se registro correctamente al administrador: "+administrador.nombre, "Exito", "success")
      })
    })
    .catch((error)=>{
      const mensaje = this.createMessage(error.code);
      this.serviceAlert.showSuccessAlert(mensaje, "Error", "error")
    })
  }

  // guardarEsp(elemento: Especialista) {
  //   const documento = this.angularFirestore.doc('especialistas/' + this.angularFirestore.createId());
  //   const uid = documento.ref.id;

  //   documento.set({
  //     uid: uid,
  //     nombre: elemento.nombre,
  //     apellido: elemento.apellido,
  //     edad: elemento.edad,
  //     dni: elemento.dni,
  //     especialidad: elemento.especialidad,
  //     mail: elemento.mail,
  //     password: elemento.password,
  //     foto: elemento.foto
  //   });
  // }

  setEspecialidad(nombres: any) {
    const documento = this.angularFirestore.doc('especialidades/' + this.angularFirestore.createId());
    const uid = documento.ref.id;

    documento.set({
      uid: uid,
      nombre: nombres
    });
  }

  traerUsuario(uid: string) {
    return this.traerUsuariosCombinados().pipe(
      map((usuarios: any[]) => {
        return usuarios.find(user => user.uid === uid);
      })
    );
  }
  
  updateEspecialista(userMod: any) {
    this.angularFirestore
      .doc<any>(`especialistas/${userMod.uid}`)
      .update(userMod)
      .then(() => { })
      .catch((error) => {
      });
  }


  private createMessage(errorCode: string): string {
    let message: string = '';
    switch (errorCode) {
      case 'auth/internal-error':
        message = 'Los campos estan vacios';
        break;
      case 'auth/operation-not-allowed':
        message = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        message = 'El email ya está registrado.';
        break;
      case 'auth/invalid-email':
        message = 'El email no es valido.';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        message = 'Error al crear el usuario.';
        break;
    }

    return message;
  }

  //TURNOS
  createTurnList(turn: any) {
    this.angularFirestore
      .collection<any>('turnos')
      .add(turn)
      .then((data) => {
        this.angularFirestore.collection('turnos').doc(data.id).set({
          id: data.id,
          especialista: turn.especialista,
          turnos: turn.turnos,
        });
      });
  }

  getTurnList() {
    const collection = this.angularFirestore.collection<any>('turnos');
    return collection.valueChanges();
  }

  updateTurnList(turn: any) {
    this.angularFirestore
      .doc<any>(`turnos/${turn.id}`)
      .update(turn)
      .then(() => { })
      .catch((error) => {
        console.log(error.message);
        this.serviceAlert.showSuccessAlert('Ocurrio un error', 'Administrador', 'error');
      });
  }

  createHistorialClinico(turn: any) {
    return this.angularFirestore
      .collection<any>('historialesClinicos')
      .add(turn)
      .then((data) => {
        this.angularFirestore
          .collection('historialesClinicos')
          .doc(data.id)
          .set({
            id: data.id,
            especialidad: turn.especialidad,
            especialista: turn.especialista,
            paciente: turn.paciente,
            fecha: turn.fecha,
            detalle: turn.detalle,
            detalleAdicional: turn.detalleAdicional,
          });
      })
      .catch((error) => {
        throw error;
      });
  }

  getHistorialesClinicos() {
    const collection = this.angularFirestore.collection<any>(
      'historialesClinicos'
    );
    return collection.valueChanges();
  }
}
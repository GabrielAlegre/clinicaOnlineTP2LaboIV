import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Input() usuario?: any;
  correoValido: boolean = false;
  passValido: boolean = false;
  contraBind="";
  emailBind="";
  arrayDeUsuarios:any[]=[];
  fotoDelUsuario="";
  perfilUser="";

  constructor(private serviceAlert:SweetalertService, private authlogin:AuthService, private firestore:FirestoreService)
  {
  }

  clickListadoUsuarios($event: any) {
    this.usuario = $event;
    console.log(this.usuario);
    this.loginAutomatico(this.usuario.mail,this.usuario.password);
  }

  ngOnInit() {
    this.arrayDeUsuarios=[];
    this.firestore.traerUsuariosCombinados().subscribe((users) => {
      this.arrayDeUsuarios = users;
  });
    // this.firestore.traerUsuarios().subscribe(usuarios => {
    //   for (const unUser of usuarios.pacientes) {
    //     this.arrayDeUsuarios.push(unUser);
    //   }
    //   for (const especialidad of usuarios.especialidades) {
    //     this.arrayDeUsuarios.push(especialidad);
    //   }
    // });
  }

  logear()
  {
    const userLog =this.obtenerUser(this.emailBind);
    console.log(userLog);
    const nombreDelUsuario = this.buscarNombreDelUsuarioQueSeLogeo(this.emailBind);
    const perfilDelUsuario = this.perfilUser;
    if(userLog.hasOwnProperty("habilitado")){
      if(userLog.habilitado==true)
      {
        console.log("estoy habilitado: ", userLog.habilitado);
        this.authlogin.login(this.emailBind, this.contraBind,0, nombreDelUsuario, this.fotoDelUsuario, perfilDelUsuario);
      }
      else{
        this.serviceAlert.showSuccessAlert(`Lo sentimos, aun usted no fue aprobado por un administrador`, "No estas aprobado por los administradores!", 'error');
      } 
    }
    else{
      this.authlogin.login(this.emailBind, this.contraBind,0, nombreDelUsuario, this.fotoDelUsuario, perfilDelUsuario);
    }
    console.log(this.perfilUser);
  }

  loginAutomatico(email:string, constraseña:string){
    this.emailBind=email;
    this.contraBind=constraseña;
    this.correoValido = true;
    this.passValido = true;
  }

  obtenerUser(emailIngresado:string){
    let nombreDelUsuario="";
    for (const unUsuario of this.arrayDeUsuarios) {
      if(unUsuario.mail==emailIngresado){
        return unUsuario;
        break;
      }
    }
    return nombreDelUsuario;
  }

  buscarNombreDelUsuarioQueSeLogeo(emailIngresado:string){
    let nombreDelUsuario="";
    for (const unUsuario of this.arrayDeUsuarios) {
      if(unUsuario.mail==emailIngresado){
        nombreDelUsuario=unUsuario.nombre;
        if(unUsuario.hasOwnProperty("obraSocial"))
        {
          this.perfilUser="paciente";
          this.fotoDelUsuario=unUsuario.fotos[0];
        }
        else if(unUsuario.hasOwnProperty("especialidad")){
          this.perfilUser="especialista";
          this.fotoDelUsuario=unUsuario.fotos;
        }
        else{
          console.log("hola");
          this.perfilUser="administrador";
          this.fotoDelUsuario=unUsuario.fotos;
        }
        break;
      }
    }
    return nombreDelUsuario;
  }

  validarCorreo() {
    if (this.emailBind.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)&& this.emailBind.length>6) {
      this.correoValido = true;
    } else {
      this.correoValido = false;
    }
  }

  validarPass() {
    if (this.contraBind.match(/[0-9a-zA-Z]{6,}/)){
      this.passValido = true;
    } else {
      this.passValido = false;
    }
  }
}

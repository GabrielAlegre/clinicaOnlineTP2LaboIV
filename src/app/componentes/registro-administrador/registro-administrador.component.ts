import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';
import { Administrador } from 'src/app/clases/administrador';


@Component({
  selector: 'app-registro-administrador',
  templateUrl: './registro-administrador.component.html',
  styleUrls: ['./registro-administrador.component.css']
})
export class RegistroAdministradorComponent {
  
  administrador: Administrador = new Administrador("","",0,0,"","","");
  image: string = "";
  form!: FormGroup;
  imageCount: number = 0;
  images: string[];
  apellidoValido: boolean = false;
  nameValido: boolean = false;
  edadValidada: boolean = false;
  dniValido: boolean = false;
  obraSocialValida: boolean = false;
  passValido: boolean = false;
  correoValido: boolean = false;
  passValidoConf: boolean = false;
  mostrarSpinner:boolean=false;

  constructor(private formBuilder: FormBuilder,
    public firestoreService: FirestoreService,
    private serviceAlert: SweetalertService,
    private storage: Storage) {

    this.images = [];
  }

  resetForm() {
    this.form.patchValue({
      nom: "",
      ap: "",
      ed: "",
      dni: "",
      mail: "",
      pw: "",
      pwConf: "",
      ft: ""
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      ap: ['', Validators.required],
      ed: ['', Validators.required],
      dni: ['', Validators.required],
      mail: ['', Validators.required],
      pw: ['', Validators.required],
      pwConf: ['', Validators.required],
      ft: ['', Validators.required]
    });
  }



  async guardar() {
    let borrar=false;
    if (this.apellidoValido && this.nameValido && this.edadValidada && this.dniValido && this.passValido && this.correoValido && this.passValidoConf) {

      this.administrador.nombre = this.form.value.nom;
      this.administrador.apellido = this.form.value.ap;
      this.administrador.edad = this.form.value.ed;
      this.administrador.dni = this.form.value.dni;
      this.administrador.mail = this.form.value.mail;
      this.administrador.password = this.form.value.pw;
      this.administrador.fotos = this.form.value.ft;

      const fileInput = document.getElementById('fileInputEsp') as HTMLInputElement;
      const files: FileList | null = fileInput.files;

      if (files) {
        const file = files[0];

        if(file!=undefined)
        {
          console.log(file);
          this.mostrarSpinner = true;
          setTimeout(() => {
            this.mostrarSpinner = false;
          }, 5000);
  
          const imgRef = ref(this.storage, `administradores/${this.administrador.dni}/${file.name}`);
          await uploadBytes(imgRef, file);

          
          const url = await getDownloadURL(imgRef);

          
          this.administrador.fotos = url;

          this.firestoreService.guardarAdmin(this.administrador);
        }
        else{
          this.serviceAlert.showSuccessAlert('Debe seleccionar una imagen', 'Ups! Le falta subir la imagen', 'error');
          borrar=true;
          }
      } else {
        // Manejar el caso en que no se seleccionaron archivos
        this.serviceAlert.showSuccessAlert('Debe seleccionar exactamente una imágenes', 'DEBE SUBIR UNA IMAGENE', 'error');
      }
      if(!borrar)
      {
        this.limpiar();
      }
    } 
    else {
      this.serviceAlert.showSuccessAlert('Debe ingresar todos los datos', 'INCOMPLETO', 'warning');
    }
  }

  limpiar() {
    this.administrador = new Administrador("","",0,0,"","","");
    this.resetForm();
    this.imageCount = 0;
    this.images = [];
    this.image = "";
  }


  handleFileInputChangeEsp(event: any) {
    const files: FileList = event.target.files;

    if (files.length !== 1) {
      this.serviceAlert.showSuccessAlert('Debe subir solo una imagen', 'INCOMPLETO', 'warning');
      return;
    }

    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    this.image = imageUrl;

  }

  validarDni() {
    if (this.form.value.dni > 999999 && this.form.value.dni < 100000000) {
      this.dniValido = true;
    } else {
      this.dniValido = false;
    }
  }

  validarApellido() {
    if (this.form.value.ap.match(/[a-zA-Z]/) && this.form.value.ap.length < 15 && this.form.value.ap.length > 2) {
      this.apellidoValido = true;
    } else {
      this.apellidoValido = false;
    }
  }

  validarEdad() {
    if (this.form.value.ed > 17 && this.form.value.ed < 100) {
      this.edadValidada = true;
    } else {
      this.edadValidada = false;
    }
  }

  validarName() {
    if (this.form.value.nom.match(/[a-zA-Z]/) && this.form.value.nom.length < 15 && this.form.value.nom.length > 2) {
      this.nameValido = true;
    } else {
      this.nameValido = false;
    }
  }

  validarPass() {
    if (this.form.value.pw.match(/[0-9a-zA-Z]{6,}/)) {
      this.passValido = true;
    } else {
      this.passValido = false;
    }
  }

  validarPassConf() {
    if (this.form.value.pw == this.form.value.pwConf) {
      this.passValidoConf = true;
    } else {
      this.passValidoConf = false;
    }
  }

  validarCorreo() {
    if (this.form.value.mail.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/) && this.form.value.mail.length > 6) {
      this.correoValido = true;
    } else {
      this.correoValido = false;
    }
  }

}

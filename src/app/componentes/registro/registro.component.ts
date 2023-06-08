import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paciente } from 'src/app/clases/paciente';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';
import { Especialista } from 'src/app/clases/especialista';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  @Input() especialidad?: any;
  @Input() queQuiereRegistrar?: string;
  paciente: Paciente = new Paciente('', '', 0, 0, '', '', '', '');
  especialista: Especialista = new Especialista('', '', 0, 0, '', '', '', '');
  image: string = "";
  form!: FormGroup;
  formEspecialista!: FormGroup;
  images: string[];
  apellidoValido: boolean = false;
  nameValido: boolean = false;
  edadValidada: boolean = false;
  dniValido: boolean = false;
  obraSocialValida: boolean = false;
  passValido: boolean = false;
  correoValido: boolean = false;
  passValidoConf: boolean = false;
  opcionRegistro = document.getElementsByName("opcionRegistro") as NodeListOf<HTMLInputElement>;
  mostrarListadoEspecialidades: boolean = false;
  especialidades:string="";
  mostrarSpinner = false;


  constructor(private formBuilder: FormBuilder,
    public firestoreService: FirestoreService,
    private serviceAlert: SweetalertService,
    private storage: Storage) {

    this.images = [];
  }

  cambiarPagina(): void {
    // Resetear las validaciones y el estado del formulario
    this.form.reset();
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.setErrors(null);
    });
  }


  resetForm() {
    this.form.patchValue({
      nom: "",
      ap: "",
      ed: "",
      dni: "",
      os: "",
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
      os: ['', Validators.required],
      mail: ['', Validators.required],
      pw: ['', Validators.required],
      pwConf: ['', Validators.required],
      ft: ['', Validators.required]
    });
    if(this.queQuiereRegistrar!=undefined)
    {
      //this.opcionRegistro[0] -> hace referencia a especialista
      //this.opcionRegistro[1] -> hace referencia a pacientes
      if(this.queQuiereRegistrar=="paciente"){
        this.opcionRegistro[0].checked=false;
        this.opcionRegistro[1].checked=true;
      }
      else if(this.queQuiereRegistrar="especialista"){

        this.opcionRegistro[0].checked=true;
        this.opcionRegistro[1].checked=false;
        this.mostrarListadoEspecialidades = true;
      }
    }
  }

  handleChangeActivar(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      console.log("Radio seleccionado:", target.id);
      if (target.id == 'chk') {
        this.mostrarListadoEspecialidades = false;
      }
      else {
        this.mostrarListadoEspecialidades = true;
      }
      this.resetForm();
      console.log("Radio seleccionado:", this.mostrarListadoEspecialidades);
    }
  }

  cambioRadio(evento: Event): void {
    const radio = evento.target as HTMLInputElement;
    const valor = radio.value;
    console.log(valor);
  }

  async guardar(esPaciente: boolean) {
    let borrar=false;
    if (this.apellidoValido && this.nameValido && this.edadValidada && this.dniValido && this.passValido && 
      this.correoValido && this.passValidoConf) {
      if (esPaciente && this.obraSocialValida && this.images.length==2) {
        this.paciente.nombre = this.form.value.nom;
        this.paciente.apellido = this.form.value.ap;
        this.paciente.edad = this.form.value.ed;
        this.paciente.dni = this.form.value.dni;
        this.paciente.obraSocial = this.form.value.os;
        this.paciente.mail = this.form.value.mail;
        this.paciente.password = this.form.value.pw;
        this.paciente.fotos = this.form.value.ft;

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const files: FileList | null = fileInput.files;

        if (files) {
          const urls: string[] = [];

          this.mostrarSpinner = true;
          setTimeout(() => {
            this.mostrarSpinner = false;
          }, 6000);

          for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Subir la imagen al almacenamiento
            const imgRef = ref(this.storage, `pacientes/${this.paciente.dni}/${file.name}`);
            await uploadBytes(imgRef, file);

            // Obtener la URL de la imagen subida
            const url = await getDownloadURL(imgRef);
            urls.push(url);
          }

          // Asignar las URLs al objeto paciente
          this.paciente.fotos = urls;

          // Guardar el paciente en la base de datos
          this.firestoreService.guardar(this.paciente);
        

          // this.serviceAlert.showSuccessAlert('Datos subidos correctamente', 'EXCELENTE', 'success');
        } else {
          // Manejar el caso en que no se seleccionaron archivos
          this.serviceAlert.showSuccessAlert('Debe seleccionar exactamente 2 imágenes', 'DEBE SUBIR LAS IMAGENES', 'error');
        }
        this.limpiar();
      }else if(!esPaciente){
        this.especialista.nombre = this.form.value.nom;
        this.especialista.apellido = this.form.value.ap;
        this.especialista.edad = this.form.value.ed;
        this.especialista.dni = this.form.value.dni;
        this.especialista.especialidad = this.especialidad;
        this.especialista.mail = this.form.value.mail;
        this.especialista.password = this.form.value.pw;
        this.especialista.foto = this.form.value.ft;

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
  
            // Subir la imagen al almacenamiento
            const imgRef = ref(this.storage, `especialistas/${this.especialista.dni}/${file.name}`);
            await uploadBytes(imgRef, file);
    
            // Obtener la URL de la imagen subida
            const url = await getDownloadURL(imgRef);
    
            // Asignar las URLs al objeto paciente
            this.especialista.foto = url;
    
            // Guardar el paciente en la base de datos
            this.firestoreService.guardarEsp(this.especialista);
            
          }
          else{
          this.serviceAlert.showSuccessAlert('Debe seleccionar una imagen', 'Ups! Le falta subir la imagen', 'error');
          borrar=true;
          }

          // this.serviceAlert.showSuccessAlert('Datos subidos correctamente', 'EXCELENTE', 'success');
        } else {
          // Manejar el caso en que no se seleccionaron archivos
          this.serviceAlert.showSuccessAlert('Debe seleccionar exactamente 2 imágenes', 'DEBE SUBIR LAS IMAGENES', 'error');
        }
        if(!borrar)
        {
          this.limpiar();
        }
      }
      else{
      this.serviceAlert.showSuccessAlert('Ingrese la foto que le falta!', 'Le falto subir una foto', 'warning');
      }
    } else {
      this.serviceAlert.showSuccessAlert('Debe ingresar todos los datos', 'INCOMPLETO', 'warning');
    }
  }

  limpiar() {
    this.paciente = new Paciente('', '', 0, 0, '', '', '', '');
    this.resetForm();
    this.images = [];
    this.image = "";
    this.especialidad = null;
  }

  handleFileInputChange(event: any) {
    const files: FileList = event.target.files;

    if (files.length !== 2) {
      this.serviceAlert.showSuccessAlert('Debe subir 2 imagenes', 'INCOMPLETO', 'warning');
      return;
    }

    this.images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      this.images.push(imageUrl);
    }
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


  getValorSeleccionadoDelRadio() {
    const selectedRadio = document.querySelector(`input[name=opcionRegistro]:checked`) as HTMLInputElement;
    if (selectedRadio) {
      const selectedValue = selectedRadio.value;
      return selectedValue;
    } else {
      return 0;
    }
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

  validarObraSocial() {
    if (this.form.value.os.match(/[a-zA-Z]/) && this.form.value.os.length < 20 && this.form.value.os.length > 2) {
      this.obraSocialValida = true;
    } else {
      this.obraSocialValida = false;
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


  clickListado($event: any) {
    this.especialidades=$event.join(' - ');
    this.especialidad = $event;
  }

}




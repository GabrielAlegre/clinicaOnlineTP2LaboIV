import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { SweetalertService } from '../../servicios/sweetalert.service';


@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss'],
})
export class InformesComponent implements OnInit {
  spinner: boolean = false;
  listaLogs: any[] = [];
  listaTurnos: any[] = [];

  //@ts-ignore
  chartPorEspecialidad: Chart<"pie", "bar", any[], any>;

  btn7Dias: boolean = false;
  btn15Dias: boolean = true;
  banderaChartSolicitados: boolean = true;

  btn7DiasFinalizado: boolean = false;
  btn15DiasFinalizado: boolean = true;
  banderaChartFinalizados = true;
  listaEspecialidades: any[] = [];
  especialidadSeleccionada: string | null = null;
  listaUsuariosEspecialistas: any[] = [];
  //directivas

  constructor(private authService: AuthService, private firestoreService: FirestoreService, private notificationService: SweetalertService,) {
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale,
      ChartDataLabels
    );
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.firestoreService.traerEspecialistas().subscribe((especialistas) => {
      this.listaUsuariosEspecialistas=especialistas;

      especialistas.forEach((especialista) => {
        const nombresEspecialidades = especialista.especialidad.map((especialidad:any) => especialidad.nombre);
        this.listaEspecialidades = this.listaEspecialidades.concat(nombresEspecialidades);
      });
    });

    this.firestoreService.getUsersLog().subscribe((logs) => {
      this.listaLogs = logs;
      this.listaLogs.forEach((l) => {
        l.fecha = new Date(l.fecha.seconds * 1000);
      });
    });
    this.firestoreService.getTurnList().subscribe((turnos) => {
      this.listaTurnos = [];
      for (let i = 0; i < turnos.length; i++) {
        const turnosEspecialista = turnos[i].turnos;
        turnosEspecialista.forEach((t: any) => {
          if (t.estado != 'disponible') {
            this.listaTurnos.push(t);
          }
        });
      }
      // this.generarChartClienteHumor();
      this.generarChartCantidadTurnosEspecialidad();
      this.generarChartTurnosPorDia();
      this.generarChartTurnosSolicitadosPorMedico(this.listaTurnos);
      this.generarChartTurnosFinalizadosPorMedico(this.listaTurnos);
      // console.log(this.listaTurnos);
    });
  }

  // LOGS DE USUARIOS
  descargarPDFLogs() {
    this.spinner=true;
    const DATA = document.getElementById('pdflogs');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`informeLogs.pdf`);
        this.spinner=false;
        this.notificationService.showSuccessAlert('Informe descargado exitosamente en formato PDF', 'Informe PDF', 'success');
      });
  }

  descargarExcelLogs() {
    this.exportAsExcelFile(this.listaLogs, 'informeLogs');
  }

  // CHART CANTIDAD DE TURNOS POR ESPECIALIDAD
  // generarChartClienteHumor() {
  //   const ctx = (<any>(
  //     document.getElementById('turnosPorEspecialidad')
  //   )).getContext('2d');

  //   const colors = [
  //     '#e28743',
  //     '#2ca02c',
  //     '#8a65a8',
  //   ];

  //   let i = 0;
  //   const turnosColores = this.listaTurnos.map(
  //     (_) => colors[(i = (i + 1) % colors.length)]
  //   );

  //   let listaTurnos = [0, 0, 0];
  //   this.listaTurnos.forEach((t) => {
  //     if (t.especialidad == 'Dermatologia') {
  //       listaTurnos[0]++;
  //     } else if (t.especialidad == 'Pediatria') {
  //       listaTurnos[1]++;
  //     } else if (t.especialidad == 'Ginecologia') {
  //       listaTurnos[2]++;
  //     }
  //   });

  //   // this.chartPorEspecialidad = new Chart(ctx, {
  //   //   type: 'pie',
  //   //   data: {
  //   //     labels: ['Dermatologia', 'Pediatria', 'Ginecologia'],
  //   //     datasets: [
  //   //       {
  //   //         label: undefined,
  //   //         data: listaTurnos,
  //   //         backgroundColor: turnosColores,
  //   //         borderColor: ['#000'],
  //   //         borderWidth: 2,
  //   //       },
  //   //     ],
  //   //   },
  //   //   options: {
  //   //     responsive: true,
  //   //     layout: {
  //   //       padding: 20,
  //   //     },
  //   //     plugins: {
  //   //       legend: {
  //   //         position: 'top',
  //   //         display: false,
            
  //   //       },
  //   //       title: {
  //   //         display: true,
  //   //         text: 'Numero de turnos por especialidad',
  //   //         color:'black',
  //   //       },
  //   //       datalabels: {
  //   //         color: 'black',
  //   //         anchor: 'center',
  //   //         align: 'center',
  //   //         font: {
  //   //           size: 20,
  //   //           weight: 'bold',
            
  //   //         },
  //   //       },
  //   //     },
  //   //   },
  //   // });
  //   this.chartPorEspecialidad=new Chart(ctx, {
  //     type: 'pie',
  //     data: {
  //       labels: ['Dermatologia', 'Pediatria', 'Ginecologia'],
  //       datasets: [
  //         {
  //           label: undefined,
  //           data: listaTurnos,
  //           backgroundColor: turnosColores,
  //           borderColor: ['#000'],
  //           borderWidth: 2,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       layout: {
  //         padding: 20,
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //           display: true,
  //         },
  //         title: {
  //           display: true,
  //           text: 'Numero de turnos por especialidad',
  //           color:'black',
  //         },
  //         datalabels: {
  //           color: 'black',
  //           anchor: 'center',
  //           align: 'center',
  //           font: {
  //             size: 20,
  //             weight: 'bold',
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  generarChartCantidadTurnosEspecialidad() {
    const ctx = (<any>document.getElementById('turnosPorEspecialidad'))?.getContext('2d');

    if (this.chartPorEspecialidad) {
      this.chartPorEspecialidad.destroy();
    }

    const colors = [
      '#c5322b',
      '#1f77b4',
      '#d67ea5',
      '#e28743',
      '#2ca02c',
      '#8a65a8',
      '#2c1a22',
    ];
    
    const especialidades = this.listaEspecialidades;
    const listaTurnosPorEspecialidad = Array(especialidades.length).fill(0);

    this.listaTurnos.forEach((t) => {
      const index = especialidades.indexOf(t.especialidad);
      if (index !== -1) {
        listaTurnosPorEspecialidad[index]++;
      }
    });

    const turnosColores = listaTurnosPorEspecialidad.map((_, i) => colors[i % colors.length]);

    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: especialidades,
        datasets: [
          {
            label: undefined,
            data: listaTurnosPorEspecialidad,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
            options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Numero de turnos por especialidad',
            color:'black',
          },
          datalabels: {
            color: 'black',
            anchor: 'center',
            align: 'center',
            font: {
              size: 20,
              weight: 'bold',
            },
          },
        },
      },
    });
  }
  

  descargarPDFTurnosPorEspecialidad() {
    const DATA = document.getElementById('pdfTurnosPorEspecialidad');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    this.spinner=true;
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`informeTurnosPorEspecialidad.pdf`);
        this.spinner=false;
        this.notificationService.showSuccessAlert('Informe descargado exitosamente en formato PDF', 'Informe PDF', 'success');
        
        
      });
  }

  // descargarExcelTurnosPorEspecialidad() {
  //   // labels: ['Dermatologia', 'Pediatria', 'Ginecologia'],

  //   const listaTurnos = [
  //     { especialidad: 'Dermatologia', turnos: 0 },
  //     { especialidad: 'Pediatria', turnos: 0 },
  //     { especialidad: 'Ginecologia', turnos: 0 },
  //     { especialidad: 'Nutricionista', turnos: 0 },
  //   ];
  //   this.listaTurnos.forEach((t) => {
  //     if (t.especialidad == 'Dermatologia') {
  //       listaTurnos[0].turnos++;
  //     } else if (t.especialidad == 'Pediatria') {
  //       listaTurnos[1].turnos++;
  //     } else if (t.especialidad == 'Ginecologia') {
  //       listaTurnos[2].turnos++;
  //     }else if (t.especialidad == 'Nutricionista') {
  //       listaTurnos[3].turnos++;
  //     }
      
  //   });
  //   this.exportAsExcelFile(listaTurnos, 'informeTurnosPorEspecialidad');
  // }
  descargarExcelTurnosPorEspecialidad() {
    const listaTurnos = this.listaEspecialidades.map((especialidad: string) => ({
      especialidad,
      turnos: 0
    }));

    this.listaTurnos.forEach((t) => {
      const index = listaTurnos.findIndex((item) => item.especialidad === t.especialidad);
      if (index !== -1) {
        listaTurnos[index].turnos++;
      }
    });

    this.exportAsExcelFile(listaTurnos, 'informeTurnosPorEspecialidad');
  }
  // CHART CANTIDAD DE TURNOS POR DIA
  generarChartTurnosPorDia() {
    const ctx = (<any>document.getElementById('turnosPorDia'))?.getContext('2d');

    const colors = [
      '#2c1a22',
      '#1f77b4',
      '#8a65a8',
      '#e28743',
      '#2ca02c',
      '#c5322b',
      '#d67ea5',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnosPorDia = [0, 0, 0, 0, 0, 0];
    this.listaTurnos.forEach((t) => {
      console.log(new Date(t.fecha.seconds * 1000));
      if (new Date(t.fecha.seconds * 1000).getDay() == 1) {
        listaTurnosPorDia[0]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 2) {
        listaTurnosPorDia[1]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 3) {
        listaTurnosPorDia[2]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 4) {
        listaTurnosPorDia[3]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 5) {
        listaTurnosPorDia[4]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 6) {
        listaTurnosPorDia[5]++;
      }
    });

     this.chartPorEspecialidad = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
        datasets: [
          {
            label: undefined,
            data: listaTurnosPorDia,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: false,
            
          },
          title: {
            display: true,
            text: 'Cantidad de turnos por día',
            color:'black',
          },
          datalabels: {
            color: 'black',
            anchor: 'center',
            align: 'center',
            font: {
              size: 20,
              weight: 'bold',
            
            },
          },
        },
      },
    });
     /*new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
        datasets: [
          {
            label: undefined,
            data: listaTurnosPorDia,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Cantidad de turnos por día',
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });*/
  }

  descargarPDFTurnosPorDia() {
    const DATA = document.getElementById('pdfTurnosPorDia');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    this.spinner=true;

    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`informeTurnosPorDia.pdf`);
        this.spinner=false;

        this.notificationService.showSuccessAlert('Informe descargado exitosamente en formato PDF', 'Informe PDF', 'success');
        
        
      });
  }

  descargarExcelTurnosPorDia() {
    const listaTurnosPorDia = [
      {
        Fecha: new Date(),
        Lunes: 0,
        Martes: 0,
        Miercoles: 0,
        Jueves: 0,
        Viernes: 0,
        Sabado: 0,
      },
    ];
    this.listaTurnos.forEach((t) => {
      if (new Date(t.fecha.seconds * 1000).getDay() == 1) {
        //@ts-ignore
        listaTurnosPorDia[0].Lunes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 2) {
        //@ts-ignore
        listaTurnosPorDia[0].Martes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 3) {
        //@ts-ignore
        listaTurnosPorDia[0].Miercoles++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 4) {
        //@ts-ignore
        listaTurnosPorDia[0].Jueves++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 5) {
        //@ts-ignore
        listaTurnosPorDia[0].Viernes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 6) {
        //@ts-ignore
        listaTurnosPorDia[0].Sabado++;
      }
    });
    this.exportAsExcelFile(listaTurnosPorDia, 'informeTurnosPorDia');
  }

  // CHART CANTIDAD DE TURNOS SOLICITADOS POR MEDICO
  // generarChartTurnosSolicitadosPorMedico(listado: any[]) {
  //   const ctx = (<any>(
  //     document.getElementById('turnosSolicitadosPorMedico')
  //   )).getContext('2d');

  //   const colors = [
  //     '#e28743',
  //     '#2ca02c',
  //     '#8a65a8',
  //   ];

  //   let i = 0;
  //   const turnosColores = this.listaTurnos.map(
  //     (_) => colors[(i = (i + 1) % colors.length)]
  //   );

  //   let listaTurnosSolicitadosPorMedico = [0, 0];
  //   listado.forEach((t) => {
  //     if (
  //       t.especialista.mail == 'nevaunnetouffo-6575@yopmail.com' &&
  //       t.estado == 'solicitado'
  //     ) {
  //       listaTurnosSolicitadosPorMedico[0]++;
  //     } else if (
  //       t.especialista.mail == 'hoinneppeigroya-2286@yopmail.com' &&
  //       t.estado == 'solicitado'
  //     ) {
  //       listaTurnosSolicitadosPorMedico[1]++;
  //     }
  //   });

  //   this.chartPorEspecialidad = new Chart(ctx, {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['Mariana Varela', 'Agustin Medina'],
  //       datasets: [
  //         {
  //           label: undefined,
  //           data: listaTurnosSolicitadosPorMedico,
  //           backgroundColor: turnosColores,
  //           borderColor: ['#000'],
  //           borderWidth: 2,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       layout: {
  //         padding: 20,
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //           display: true,
  //         },
  //         title: {
  //           display: true,
  //           text: 'Cantidad de turnos solicitados por médico',
  //         },
  //         datalabels: {
  //           color: '#fff',
  //           anchor: 'center',
  //           align: 'center',
  //           font: {
  //             size: 15,
  //             weight: 'bold',
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  generarChartTurnosSolicitadosPorMedico(listado: any[]) {
    const ctx = (<any>document.getElementById('turnosSolicitadosPorMedico'))?.getContext('2d');

    const colors = [
      '#c5322b',
      '#1f77b4',
      '#d67ea5',
      '#e28743',
      '#2ca02c',
      '#8a65a8',
      '#2c1a22',
    ];

    const especialistas = this.listaUsuariosEspecialistas;
    const nombresEspecialistas = especialistas.map((especialista: any) => `${especialista.nombre} ${especialista.apellido}`);

    const listaTurnosSolicitadosPorMedico = Array(especialistas.length).fill(0);
    listado.forEach((t) => {
      const index = especialistas.findIndex((especialista: any) => especialista.uid === t.especialista.uid);
      if (index !== -1 && t.estado == 'solicitado') {
        listaTurnosSolicitadosPorMedico[index]++;
      }
    });

    const turnosColores = listaTurnosSolicitadosPorMedico.map((_, i) => colors[i % colors.length]);

    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: nombresEspecialistas,
        datasets: [
          {
            label: undefined,
            data: listaTurnosSolicitadosPorMedico,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Cantidad de turnos solicitados por médico',
          },
          datalabels: {
            color: 'black',
            anchor: 'center',
            align: 'center',
            font: {
              size: 20,
              weight: 'bold',
            },
          },
        },
      },
    });
  }


  descargarPDFTurnosSolicitadosPorMedico() {
    const DATA = document.getElementById('pdfTurnosSolicitadosPorMedico');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    this.spinner=true;

    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`informeTurnosSolicitados.pdf`);
        this.spinner=false;

        this.notificationService.showSuccessAlert('Informe descargado exitosamente en formato PDF', 'Informe PDF', 'success');
        
        
      });
  }

  // descargarExcelTurnosSolicitadosPorMedico() {
  //   let listaTurnosSolicitadosPorMedico = [
  //     {
  //       Fecha: new Date(),
  //       Mariana_Varela: 0,
  //       Agustin_Medina: 0,
  //     },
  //   ];
  //   if (this.btn15Dias) {
  //     this.listaTurnos.forEach((t) => {
  //       if (
  //         t.especialista.mail == 'nevaunnetouffo-6575@yopmail.com' &&
  //         t.estado == 'solicitado'
  //       ) {
  //         listaTurnosSolicitadosPorMedico[0].Mariana_Varela++;
  //       } else if (
  //         t.especialista.mail == 'hoinneppeigroya-2286@yopmail.com' &&
  //         t.estado == 'solicitado'
  //       ) {
  //         listaTurnosSolicitadosPorMedico[0].Agustin_Medina++;
  //       } 
  //     });
  //   } else {
  //     const currentDate = new Date();
  //     const futureDate = new Date(currentDate.getTime() + 84600000 * 7);
  //     const listadoFiltrado: any[] = [];
  //     this.listaTurnos.forEach((t) => {
  //       if (
  //         new Date(t.fecha.seconds * 1000).getTime() <= futureDate.getTime() &&
  //         t.estado == 'solicitado'
  //       ) {
  //         listadoFiltrado.push(t);
  //       }
  //     });

  //     listadoFiltrado.forEach((t) => {
  //       if (
  //         t.especialista.mail == 'nevaunnetouffo-6575@yopmail.com' &&
  //         t.estado == 'solicitado'
  //       ) {
  //         listaTurnosSolicitadosPorMedico[0].Mariana_Varela++;
  //       } else if (
  //         t.especialista.mail == 'hoinneppeigroya-2286@yopmail.com' &&
  //         t.estado == 'solicitado'
  //       ) {
  //         listaTurnosSolicitadosPorMedico[0].Agustin_Medina++;
  //       }
  //     });
  //   }
  //   this.exportAsExcelFile(
  //     listaTurnosSolicitadosPorMedico,
  //     'informeTurnosSolicitados'
  //   );
  // }

  descargarExcelTurnosSolicitadosPorMedico() {
    const especialistas = this.listaUsuariosEspecialistas;
    const nombresEspecialistas: string[] = especialistas.map((especialista: any) => `${especialista.nombre} ${especialista.apellido}`);

    const listaTurnosSolicitadosPorMedico: {
      [key: string]: number | Date;
      Fecha: Date;
    }[] = [{ Fecha: new Date() }];

    this.listaTurnos.forEach((t) => {
      const index = especialistas.findIndex((especialista: any) => especialista.uid === t.especialista.uid);
      if (index !== -1 && t.estado === 'solicitado') {
        const especialistaNombre = nombresEspecialistas[index];
        if (typeof listaTurnosSolicitadosPorMedico[0][especialistaNombre] === 'number') {
          listaTurnosSolicitadosPorMedico[0][especialistaNombre] = (listaTurnosSolicitadosPorMedico[0][especialistaNombre] as number) + 1;
        } else {
          listaTurnosSolicitadosPorMedico[0][especialistaNombre] = 1;
        }
      }
    });

    this.exportAsExcelFile(listaTurnosSolicitadosPorMedico, 'informeTurnosSolicitados');
  }

  filtrarTurnosPorDias(cantidadDias: number) {
    this.banderaChartSolicitados = false;
    if (cantidadDias == 7) {
      this.btn7Dias = true;
      this.btn15Dias = false;
    } else if (cantidadDias == 15) {
      this.btn7Dias = false;
      this.btn15Dias = true;
    }
    setTimeout(() => {
      this.banderaChartSolicitados = true;
      setTimeout(() => {
        const currentDate = new Date();
        const futureDate = new Date(
          currentDate.getTime() + 84600000 * cantidadDias
        );
        const listadoFiltrado: any[] = [];
        this.listaTurnos.forEach((t) => {
          if (
            new Date(t.fecha.seconds * 1000).getTime() <=
            futureDate.getTime() &&
            t.estado == 'solicitado'
          ) {
            listadoFiltrado.push(t);
          }
        });
        this.generarChartTurnosSolicitadosPorMedico(listadoFiltrado);
      }, 500);
    }, 100);
  }

  // CHART CANTIDAD DE TURNOS FINALIZADOS POR MEDICO
  // generarChartTurnosFinalizadosPorMedico(listado: any[]) {
  //   const ctx = (<any>(
  //     document.getElementById('turnosFinalizadosPorMedico')
  //   )).getContext('2d');

  //   const colors = [
  //     '#e28743',
  //     '#2ca02c',
  //     '#8a65a8',
  //   ];

  //   let i = 0;
  //   const turnosColores = this.listaTurnos.map(
  //     (_) => colors[(i = (i + 1) % colors.length)]
  //   );

  //   let listaTurnosFinalizadosPorMedico = [0, 0];
  //   listado.forEach((t) => {
  //     if (
  //       t.especialista.mail == 'nevaunnetouffo-6575@yopmail.com' &&
  //       t.estado == 'realizado'
  //     ) {
  //       listaTurnosFinalizadosPorMedico[0]++;
  //     } else if (
  //       t.especialista.mail == 'hoinneppeigroya-2286@yopmail.com' &&
  //       t.estado == 'realizado'
  //     ) {
  //       listaTurnosFinalizadosPorMedico[1]++;
  //     }
  //   });

  //   this.chartPorEspecialidad = new Chart(ctx, {
  //     type: 'pie',
  //     data: {
  //       labels: ['Mariana Varela', 'Agustin Medina'],
  //       datasets: [
  //         {
  //           label: undefined,
  //           data: listaTurnosFinalizadosPorMedico,
  //           backgroundColor: turnosColores,
  //           borderColor: ['#000'],
  //           borderWidth: 2,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       layout: {
  //         padding: 20,
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //           display: true,
  //         },
  //         title: {
  //           display: true,
  //           text: 'Cantidad de turnos finalizados por médico',
  //           color:'black',
  //         },
  //         datalabels: {
  //           color: 'black',
  //           anchor: 'center',
  //           align: 'center',
  //           font: {
  //             size: 20,
  //             weight: 'bold',
  //           },
  //         },
  //       },
  //     },
  //   });
  //   // new Chart(ctx, {
  //   //   type: 'doughnut',
  //   //   data: {
  //   //     labels: ['Mariana Varela', 'Agustin Medina'],
  //   //     datasets: [
  //   //       {
  //   //         label: undefined,
  //   //         data: listaTurnosFinalizadosPorMedico,
  //   //         backgroundColor: turnosColores,
  //   //         borderColor: ['#000'],
  //   //         borderWidth: 2,
  //   //       },
  //   //     ],
  //   //   },
  //   //   options: {
  //   //     responsive: true,
  //   //     layout: {
  //   //       padding: 20,
  //   //     },
  //   //     plugins: {
  //   //       legend: {
  //   //         position: 'top',
  //   //         display: true,
  //   //       },
  //   //       title: {
  //   //         display: true,
  //   //         text: 'Cantidad de turnos finalizados por médico',
  //   //       },
  //   //       datalabels: {
  //   //         color: '#fff',
  //   //         anchor: 'center',
  //   //         align: 'center',
  //   //         font: {
  //   //           size: 15,
  //   //           weight: 'bold',
  //   //         },
  //   //       },
  //   //     },
  //   //   },
  //   // });
  // }//fin
  generarChartTurnosFinalizadosPorMedico(listado: any[]) {
    const ctx = (<any>document.getElementById('turnosFinalizadosPorMedico'))?.getContext('2d');

    const colors = [
      '#c5322b',
      '#1f77b4',
      '#d67ea5',
      '#e28743',
      '#2ca02c',
      '#8a65a8',
      '#2c1a22',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    const especialistas = this.listaUsuariosEspecialistas;
    const listaTurnosFinalizadosPorMedico = Array(especialistas.length).fill(0);

    listado.forEach((t) => {
      const index = especialistas.findIndex(
        (especialista) => especialista.mail === t.especialista.mail
      );
      if (index !== -1 && t.estado === 'realizado') {
        listaTurnosFinalizadosPorMedico[index]++;
      }
    });

    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: especialistas.map((especialista) => `${especialista.nombre} ${especialista.apellido}`),
        datasets: [
          {
            label: undefined,
            data: listaTurnosFinalizadosPorMedico,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Cantidad de turnos finalizados por médico',
          },
          datalabels: {
            color: 'black',
            anchor: 'center',
            align: 'center',
            font: {
              size: 20,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  // descargarExcelTurnosFinalizadosPorMedico() {
  //   let listaTurnosFinalizadosPorMedico = [
  //     {
  //       Fecha: new Date(),
  //       Mariana_Varela: 0,
  //       Agustin_Medina: 0,
  //     },
  //   ];
  //   if (this.btn15DiasFinalizado) {
  //     this.listaTurnos.forEach((t) => {
  //       if (
  //         t.especialista.mail == 'nevaunnetouffo-6575@yopmail.com' &&
  //         t.estado == 'realizado'
  //       ) {
  //         listaTurnosFinalizadosPorMedico[0].Mariana_Varela++;
  //       } else if (
  //         t.especialista.mail == 'hoinneppeigroya-2286@yopmail.com' &&
  //         t.estado == 'realizado'
  //       ) {
  //         listaTurnosFinalizadosPorMedico[0].Agustin_Medina++;
  //       }
  //     });
  //   } else {
  //     const currentDate = new Date();
  //     const futureDate = new Date(currentDate.getTime() + 84600000 * 7);
  //     const listadoFiltrado: any[] = [];
  //     this.listaTurnos.forEach((t) => {
  //       if (
  //         new Date(t.fecha.seconds * 1000).getTime() <= futureDate.getTime() &&
  //         t.estado == 'realizado'
  //       ) {
  //         listadoFiltrado.push(t);
  //       }
  //     });

  //     listadoFiltrado.forEach((t) => {
  //       if (
  //         t.especialista.mail == 'nevaunnetouffo-6575@yopmail.com' &&
  //         t.estado == 'realizado'
  //       ) {
  //         listaTurnosFinalizadosPorMedico[0].Mariana_Varela++;
  //       } else if (
  //         t.especialista.mail == 'hoinneppeigroya-2286@yopmail.com' &&
  //         t.estado == 'realizado'
  //       ) {
  //         listaTurnosFinalizadosPorMedico[0].Agustin_Medina++;
  //       }
  //     });
  //   }
  //   this.exportAsExcelFile(
  //     listaTurnosFinalizadosPorMedico,
  //     'informeTurnosFinalizados'
  //   );
  // }

  descargarExcelTurnosFinalizadosPorMedico() {
    const especialistas = this.listaUsuariosEspecialistas;
    const nombresEspecialistas: string[] = especialistas.map((especialista: any) => `${especialista.nombre} ${especialista.apellido}`);

    const listaTurnosFinalizadosPorMedico: {
      [key: string]: number | Date;
      Fecha: Date;
    }[] = [{ Fecha: new Date() }];

    this.listaTurnos.forEach((t) => {
      const index = especialistas.findIndex((especialista: any) => especialista.uid === t.especialista.uid);
      if (index !== -1 && t.estado === 'realizado') {
        const especialistaNombre = nombresEspecialistas[index];
        if (typeof listaTurnosFinalizadosPorMedico[0][especialistaNombre] === 'number') {
          listaTurnosFinalizadosPorMedico[0][especialistaNombre] = (listaTurnosFinalizadosPorMedico[0][especialistaNombre] as number) + 1;
        } else {
          listaTurnosFinalizadosPorMedico[0][especialistaNombre] = 1;
        }
      }
    });

    this.exportAsExcelFile(listaTurnosFinalizadosPorMedico, 'informeTurnosFinalizados');
  }

  descargarPDFTurnosFinalizadosPorMedico() {
    const DATA = document.getElementById('pdfTurnosFinalizadosPorMedico');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    this.spinner=true;

    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`informeTurnosFinalizados.pdf`);
        this.spinner=false;

        this.notificationService.showSuccessAlert('Informe descargado exitosamente en formato PDF', 'Informe PDF', 'success');
        
        
      });
  }

  filtrarTurnosPorDiasFinalizados(cantidadDias: number) {
    this.banderaChartFinalizados = false;
    if (cantidadDias == 7) {
      this.btn7DiasFinalizado = true;
      this.btn15DiasFinalizado = false;
    } else if (cantidadDias == 15) {
      this.btn7DiasFinalizado = false;
      this.btn15DiasFinalizado = true;
    }
    setTimeout(() => {
      this.banderaChartFinalizados = true;
      setTimeout(() => {
        const currentDate = new Date();
        const futureDate = new Date(
          currentDate.getTime() + 84600000 * cantidadDias
        );
        const listadoFiltrado: any[] = [];
        this.listaTurnos.forEach((t) => {
          if (
            new Date(t.fecha.seconds * 1000).getTime() <=
            futureDate.getTime() &&
            t.estado == 'realizado'
          ) {
            listadoFiltrado.push(t);
          }
        });
        this.generarChartTurnosFinalizadosPorMedico(listadoFiltrado);
      }, 500);
    }, 100);
  }

  // UTILES
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
    this.notificationService.showSuccessAlert('Informe descargado exitosamente en formato excel', 'Informe excel', 'success');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}

window.addEventListener('DOMContentLoaded', event => {
  let numDescansos, numEntradas, numSalidas, numAusentes, usuariosActivos;
  let fichajesPorFecha = [];
  let ausentesPorFecha = [];
  let lineChart;
  let entradas = [];
  let descansos = [];
  let salidas = [];

  let fechaSelect = $('#selector-fecha').val();
  cargarDatosFichajes(fechaSelect).then(() => {
    contarFichajesPorHora();
  });
  $('#selector-fecha').change(function () {
    fechaSelect = $(this).val();
    cargarDatosFichajes(fechaSelect).then(() => {
      contarFichajesPorHora();
    });
  });

  function cargarDatosFichajes(fecha) {
    return cargarFichajesYAusentes(fecha).then(data => {
      fichajesPorFecha = data.fichajes;
      ausentesPorFecha = data.ausentes;
      console.log("Datos cargados:", fichajesPorFecha);
    }).catch(error => {
      console.error("Error al obtener fichajes y ausentes:", error);
    });
  }
  function contarFichajesPorHora() {

    let horasExactas = [];

    fichajesPorFecha.forEach(fichaje => {
      let fecha = new Date(fichaje.created_at);
      let horaFichaje = fecha.getHours().toString().padStart(2, '0') + ":" +
        fecha.getMinutes().toString().padStart(2, '0');
      //console.log("Horas de los fichajes: "+ horaFichaje);

      horasExactas.push(horaFichaje); // Agregar cada hora exacta al eje X

      if (fichaje.tipo_fichaje === "entrada") entradas.push({ horaFichaje });
      if (fichaje.tipo_fichaje === "inicio_descanso") descansos.push({ horaFichaje });
      if (fichaje.tipo_fichaje === "salida") salidas.push({ horaFichaje });

      //console.log("Valor de entradas :  " , entradas);
    });
    // Ordenamos las horas en orden cronológico y eliminamos duplicados
    // horasExactas = [...new Set(horasExactas)].sort();
    // console.log("Horas exactas " + horasExactas);

    // Función auxiliar para obtener el número de fichajes en una hora exacta
    // function obtenerCantidad(fichajes, hora) {
    //   return fichajes.filter(f => f.hora === hora).reduce((acc, cur) => acc + cur.cantidad, 0);
    // }
    //console.log("Valor de entradas map:  " , horasExactas.map(hora => obtenerCantidad(entradas, hora)));
    generarGraficoFichajes();
    // return {
    //   horasExactas,
    //   entradas: horasExactas.map(hora => obtenerCantidad(entradas, hora)),

    //   descansos: horasExactas.map(hora => obtenerCantidad(descansos, hora)),
    //   salidas: horasExactas.map(hora => obtenerCantidad(salidas, hora))
    // };
  }


  function generarGraficoFichajes() {
    // let { horasExactas, entradas, descansos, salidas } = contarFichajesPorHora();
    let totalEmpleadosActivos = fichajesPorFecha.filter(f => f.tipo_fichaje === "entrada").length
      + ausentesPorFecha.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;

    // Configuración de horas del eje X
    //let horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];


    //console.log("Entradas: ", entradas);
    let horasEntrada = [...new Set(entradas.map(e => e.horaFichaje))]; // Eliminar duplicados y ordenar
    horasEntrada.sort();
    let horasDescanso = [...new Set(descansos.map(e => e.horaFichaje))];
    horasDescanso.sort();
    let horasSalida = [...new Set(salidas.map(e => e.horaFichaje))];
    horasSalida.sort();
    let etiquetasX = [...new Set(entradas.map(e => e.horaFichaje))]; // Eliminar duplicados y ordenar
    etiquetasX.sort();

    console.log("horasEntrada: ", horasEntrada);
    console.log("EtiquetasX " + etiquetasX);

    // Convertir horas a segundos
    function horaASegundos(hora) {
      const [hh, mm] = hora.split(":").map(Number);
      return hh * 3600 + mm * 60;
    }

    // Generar etiquetas del eje X con horas enteras en segundos
    const horas = [];
    for (let i = 8; i <= 20; i++) {
      horas.push(i * 3600); // 08:00 -> 28800, 09:00 -> 32400, etc.
    }

    // Convertir datos de fichajes a segundos
    const entradasData = entradas.map(hora => ({ x: horaASegundos(hora), y: 1 }));
    const descansosData = descansos.map(hora => ({ x: horaASegundos(hora), y: 1 }));
    const salidasData = salidas.map(hora => ({ x: horaASegundos(hora), y: 1 }));

    // Obtener el contexto del gráfico

    const data = {
      labels: horas,
      datasets: [
        {
          label: "Entradas",
          data: entradas,
          borderColor: "green",
          fill: false,
          tension: 0.1,
          spanGaps: true
        },
        {
          label: "Descansos",
          data: descansosData,
          borderColor: "blue",
          fill: false,
          tension: 0.1,
          spanGaps: true
        },
        {
          label: "Salidas",
          data: salidasData,
          borderColor: "orange",
          fill: false,
          tension: 0.1,
          spanGaps: true
        }
      ]
    };
    const options = {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        x: {

          type: 'time',
          time: {
            unit: 'minutes',
            displayFormats: {
              hour: 'HH:mm'
            }
          },
          title: {
            display: true,
            text: 'Hora'
          }
        },
        y: [{

          ticks: {

            beginAtZero: true,

            min: 0,
            max: totalEmpleadosActivos,
            precision: 0
          },
          title: {
            display: true,
            text: 'Cantidad de fichajes'
          }
        }]
      }
    };


    var ctx = document.getElementById("multiLineChart").getContext("2d");
    if (lineChart) {
      lineChart.destroy();
    }

    // Crear el gráfico con la configuración adecuada
    lineChart = new Chart(ctx, {
      type: "line",

      data: data,
      options: options,
    });
  }





  // function generarGraficoFichajes() {
  //   let { horasExactas, entradas, descansos, salidas } = contarFichajesPorHora();
  //   let totalEmpleadosActivos = ausentesPorFecha.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;
  //   let horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  //   // Reemplazar 0 con null para evitar que la línea pase por el 0
  //   entradas = entradas.map(value => value === 0 ? null : value);
  //   descansos = descansos.map(value => value === 0 ? null : value);
  //   salidas = salidas.map(value => value === 0 ? null : value);

  //   var ctx = document.getElementById("multiLineChart").getContext("2d");
  //   new Chart(ctx, {
  //     type: "line",
  //     data: {
  //       labels: horas, // Eje X solo con horas reales de fichajes
  //       datasets: [
  //         { label: "Entradas", data: entradas, borderColor: "green", fill: false, tension: 0.1, spanGaps: true },
  //         { label: "Descansos", data: descansos, borderColor: "blue", fill: false, tension: 0.1, spanGaps: true },
  //         { label: "Salidas", data: salidas, borderColor: "orange", fill: false, tension: 0.1, spanGaps: true }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: { legend: { display: true } },
  //       scales: {
  //         xAxes: {
  //           type: "time",
  //           time: {
  //             unit: "minute", // Ajusta el eje X para mostrar horas y minutos exactos
  //             tooltipFormat: "HH:mm",
  //             displayFormats: { minute: "HH:mm" }
  //           }
  //         },
  //         yAxes:[{            
  //           ticks: {
  //             beginAtZero: true,              
  //             max: totalEmpleadosActivos,
  //             // stepSize: 1,
  //             precision: 0,       
  //           }
  //         }]
  //       }
  //     }
  //   });
  // }





  const xValues2 = ["Italy", "France", "Spain", "USA", "Argentina"];
  const yValues = [55, 49, 44, 24, 15];
  const barColors = ["red", "green", "blue", "orange", "brown"];
  var ctx2 = document.getElementById("myPieChart");
  new Chart(ctx2, {
    type: "pie",
    data: {
      labels: xValues2,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: "World Wide Wine Production"
      }
    }
  });

});

// // Set new default font family and font color to mimic Bootstrap's default styling
// Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
// Chart.defaults.global.defaultFontColor = '#292b2c';

// // Area Chart Example
// var ctx = document.getElementById("myAreaChart");
// var myLineChart = new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13"],
//     datasets: [{
//       label: "Sessions",
//       lineTension: 0.3,
//       backgroundColor: "rgba(2,117,216,0.2)",
//       borderColor: "rgba(2,117,216,1)",
//       pointRadius: 5,
//       pointBackgroundColor: "rgba(2,117,216,1)",
//       pointBorderColor: "rgba(255,255,255,0.8)",
//       pointHoverRadius: 5,
//       pointHoverBackgroundColor: "rgba(2,117,216,1)",
//       pointHitRadius: 50,
//       pointBorderWidth: 2,
//       data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
//     }],
//   },
//   options: {
//     scales: {
//       xAxes: [{
//         time: {
//           unit: 'date'
//         },
//         gridLines: {
//           display: false
//         },
//         ticks: {
//           maxTicksLimit: 7
//         }
//       }],
//       yAxes: [{
//         ticks: {
//           min: 0,
//           max: 40000,
//           maxTicksLimit: 5
//         },
//         gridLines: {
//           color: "rgba(0, 0, 0, .125)",
//         }
//       }],
//     },
//     legend: {
//       display: false
//     }
//   }
// });
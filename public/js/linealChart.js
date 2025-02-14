window.addEventListener('DOMContentLoaded', event => {
    let numDescansos, numEntradas, numSalidas, numAusentes;
    let lineChart;
    let fichajesPorFecha;
    let ausentesPorFecha;
    let fechaSelect = $('#selector-fecha').val();
    let horas = ['08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00'];
    let horasExactas = [];
    let entradas = [];
    let descansos = [];
    let salidas = [];

    cargarDatosFichajes(fechaSelect).then(() => {
        generarGraficoFichajes();
    });
    $('#selector-fecha').change(function () {
        fechaSelect = $(this).val();
        console.log("Horas exactas: ", horasExactas);
        cargarDatosFichajes(fechaSelect).then(() => {
            generarGraficoFichajes();
        });
    });

    function cargarDatosFichajes(fecha) {
        horasExactas = [];
        return cargarFichajesYAusentes(fecha).then(data => {
            fichajesPorFecha = data.fichajes;
            ausentesPorFecha = data.ausentes;
            console.log("Datos cargados:", fichajesPorFecha, ausentesPorFecha);
        }).catch(error => {
            console.error("Error al obtener fichajes y ausentes:", error);
        });
    }

    function contarFichajesPorHora() {



        fichajesPorFecha.forEach(fichaje => {
            // let fecha = new Date(fichaje.created_at);
            // let horaMinuto = fecha.getHours().toString().padStart(2, '0') + ":" +
            //     fecha.getMinutes().toString().padStart(2, '0');
            let horaMinuto = fichaje.hora;

            horasExactas.push(horaMinuto); // Agregar cada hora exacta al eje X

            if (fichaje.tipo_fichaje === "entrada") entradas.push({ hora: horaMinuto, cantidad: 1 });
            if (fichaje.tipo_fichaje === "inicio_descanso") descansos.push({ hora: horaMinuto, cantidad: 1 });
            if (fichaje.tipo_fichaje === "salida") salidas.push({ hora: horaMinuto, cantidad: 1 });
        });

        // Ordenamos las horas en orden cronológico y eliminamos duplicados
        horasExactas = [...new Set(horasExactas)].sort();

        // Función auxiliar para obtener el número de fichajes en una hora exacta
        function obtenerCantidad(fichajes, hora) {
            return fichajes.filter(f => f.hora === hora).reduce((acc, cur) => acc + cur.cantidad, 0);
        }

        return {
            horasExactas,
            entradas: horasExactas.map(hora => obtenerCantidad(entradas, hora)),
            descansos: horasExactas.map(hora => obtenerCantidad(descansos, hora)),
            salidas: horasExactas.map(hora => obtenerCantidad(salidas, hora))
        };
    }
    function obtenerTotalEmpleadosActivos() {
        return ausentesPorFecha.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;
    }


    function generarGraficoFichajes() {
        let { horasExactas, entradas, descansos, salidas } = contarFichajesPorHora();
        let totalEmpleadosActivos = fichajesPorFecha.filter(f => f.tipo_fichaje === "entrada").length
            + ausentesPorFecha.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;
        // entradas = entradas.map(value => value === 0 ? null : value);
        // descansos = descansos.map(value => value === 0 ? null : value);
        // salidas = salidas.map(value => value === 0 ? null : value);

        const data = {
            labels: horasExactas, // Usamos las horas exactas en el eje X
            datasets: [
                { label: "Entradas", data: entradas, borderColor: "green", fill: false, tension: 0.1, spanGaps: true },
                { label: "Descansos", data: descansos, borderColor: "blue", fill: false, tension: 0.1, spanGaps: true },
                { label: "Salidas", data: salidas, borderColor: "orange", fill: false, tension: 0.1, spanGaps: true }
            ]
        };
        const options = {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                // xAxes: [{
                //     ticks: {
                //     },
                //     type: 'time',
                //     // time: {
                //     //   round: 'hours',
                //     //   parser: "yyyy, M, d, H, m, s",
                //     //   displayFormats: {
                //     //     'millisecond': '',
                //     //     'second': 'H:mm',
                //     //     'minute': 'H:mm',
                //     //     'hour': 'H:mm',
                //     //     'day': 'H:mm',
                //     //     'week': 'MMM DD',
                //     //     'month': 'MMM DD',
                //     //     'quarter': 'MMM DD',
                //     //     'year': 'MMM DD',
                //     //   },
                //     //   tooltipFormat: 'D MMM YYYY H:mm'
                //     // }
                //   }],
                yAxes: [{
                    min: 0,
                    max: totalEmpleadosActivos,
                    ticks: {
                        beginAtZero: true,
                        max: totalEmpleadosActivos,
                        stepSize: 1
                    }
                }]
            }
        };

        var ctx = document.getElementById("multiLineChart").getContext("2d");
        if (lineChart) {
            lineChart.destroy();
        }
        lineChart = new Chart(ctx, {
            type: "line",
            data: data,
            options: options
        });
    }







});
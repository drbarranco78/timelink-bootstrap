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
    let fechaCompleta;
    let horaMinuto;

    cargarDatosFichajes(fechaSelect).then(() => {
        generarGraficoFichajes();
    });
    $('#selector-fecha').change(function () {
        fechaSelect = $(this).val();
        entradas = [];
        descansos = [];
        salidas = [];
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
        // Recorremos los fichajes y los agrupamos por hora
        fichajesPorFecha.forEach(fichaje => {
            let fechaFichaje = new Date(fechaSelect).toISOString().split('T')[0];
            let fechaCompleta = `${fechaFichaje}${fichaje.hora}`;
    
            horasExactas.push(fechaCompleta);
    
            // Agrupar por tipo de fichaje
            if (fichaje.tipo_fichaje === "entrada") {
                entradas.push(fechaCompleta);
            }
            if (fichaje.tipo_fichaje === "inicio_descanso") {
                descansos.push(fechaCompleta);
            }
            if (fichaje.tipo_fichaje === "salida") {
                salidas.push(fechaCompleta);
            }
        });
    
        // Elimina duplicados de horasExactas y ordénalos
        horasExactas = [...new Set(horasExactas)].sort();
    
        // Función para obtener la cantidad de fichajes por hora
        function obtenerCantidad(fichajes, hora) {
            return fichajes.filter(f => f === hora).length;
        }
    
        // Aseguramos que cada dataset tiene la estructura correcta
        return {
            horasExactas,
            entradas: horasExactas.map(hora => ({ x: hora, y: obtenerCantidad(entradas, hora) })),
            descansos: horasExactas.map(hora => ({ x: hora, y: obtenerCantidad(descansos, hora) })),
            salidas: horasExactas.map(hora => ({ x: hora, y: obtenerCantidad(salidas, hora) }))
        };
    }
    function generarGraficoFichajes() {
        let { horasExactas, entradas, descansos, salidas } = contarFichajesPorHora();
        let totalEmpleadosActivos = fichajesPorFecha.filter(f => f.tipo_fichaje === "entrada").length
            + ausentesPorFecha.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;
        // entradas = entradas.map(value => value === 0 ? null : value);
        // descansos = descansos.map(value => value === 0 ? null : value);
        // salidas = salidas.map(value => value === 0 ? null : value);
        function convertirAFechas(datos) {
            return datos.map(item => {
                return {
                    x: new Date(item.x), // Convertir la cadena a objeto Date
                    y: item.y
                };
            });
        }
    
        let entradasConvertidas = convertirAFechas(entradas);
        let descansosConvertidos = convertirAFechas(descansos);
        let salidasConvertidas = convertirAFechas(salidas);
    
        console.log("Entradas en formato HH:mm " ,entradas);
        console.log("Entradas convertidas " ,entradas);
        const data = {
            //labels: horasExactas, // Usamos las horas exactas en el eje X
            datasets: [
                { label: "Entradas", data: entradas, borderColor: "green", fill: false, tension: 0.1, spanGaps: true },
                { label: "Descansos", data: descansos, borderColor: "blue", fill: false, tension: 0.1, spanGaps: true },
                { label: "Salidas", data: salidas, borderColor: "orange", fill: false, tension: 0.1, spanGaps: true }
            ]
        };

        // const data = {
        //     datasets: [
        //         {
        //             label: "Entradas",
        //             data: [
        //                 { x: "2025-02-14T08:15:00", y: 1 },
        //                 { x: "2025-02-14T09:47:00", y: 1 }
        //             ],
        //             borderColor: "green",
        //             fill: false,
        //             tension: 0.1,
        //             spanGaps: true
        //         },
        //         {
        //             label: "Descansos",
        //             data: [
        //                 { x: "2025-02-14T10:30:00", y: 1 },
        //                 { x: "2025-02-14T11:45:00", y: 4 }
        //             ],
        //             borderColor: "blue",
        //             fill: false,
        //             tension: 0.1,
        //             spanGaps: true
        //         },
        //         {
        //             label: "Salidas",
        //             data: [
        //                 { x: "2025-02-14T12:00:00", y: 1 }
        //             ],
        //             borderColor: "orange",
        //             fill: false,
        //             tension: 0.1,
        //             spanGaps: true
        //         }
        //     ]
        // };
        
        const options = {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        parser: "yyyy-MM-ddHH:mm:ss",
                        tooltipFormat: "HH:mm:ss",
                        unit: "hour",
                        displayFormats: {
                            minute: "HH:mm",
                            hour: "HH:mm"
                        }
                    },
                    min: "2025-02-14T08:00:00",
                    max: "2025-02-14T20:00:00",
                    ticks: {
                        source: "auto",
                        autoSkip: true,
                        maxTicksLimit: 24
                    }
                },
                y: {
                    min: 0,
                    max: totalEmpleadosActivos,
                    ticks: {
                        stepSize: 1,
                        beginAtZero: true
                    }
                }
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


    function obtenerTotalEmpleadosActivos() {
        return ausentesPorFecha.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;
    }




});
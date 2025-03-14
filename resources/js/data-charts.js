window.addEventListener('DOMContentLoaded', event => {

    let lineChart, barChart, pieChart, mapa;
    let fichajesPorFecha;
    let ausentesPorFecha;
    let fechaSelect = $('#selector-fecha').val();
    let fechaInformes = fechaHoy;
    let horasExactas = [];
    let entradas = [];
    let descansos = [];
    let salidas = [];
    let tiempoTotalTrabajado;
    let tiempoTotalDescanso;
    let totalEmpleadosActivos;
    let numAusentes;
    let valoresAusencias, etiquetasDias;
    let tableHead = $("#report-table thead");
    let tableBody = $("#report-table tbody");
    let filaHead, filaBody;
    let usuariosTiempos = [];
    let usuariosEmpresa = [];
    let filas = '';
    obtenerUsuariosPorEmpresa(empresa.id_empresa, fechaInformes);
    $(document).on('mousedown', function (e) {
        if (!$(e.target).closest('#report-modal').length) {
            $('#report-modal').css("display", "none");
        }
    });
    $('#selector-fecha-informes').attr('max', new Date().toISOString().split("T")[0]);


    $(document).on('click', '.toggle-chart, .chart-header', function () {

        // Encuentra el contenedor padre (card) y ocúltalo
        $(this).closest('.card').find('.card-body').slideToggle(200);

        // Cambia el icono de dirección
        $(this).toggleClass('fa-angle-up fa-angle-down');
    });

    window.actualizarCharts = function () {
        cargarDatosFichajes(fechaSelect).then(() => {
            generarGraficoFichajes();
            cargarMapa(fichajesPorFecha);
            obtenerAusenciasSemana(fechaSelect);
            obtenerTiemposTotales(fechaSelect);
        });
    }
    actualizarCharts();

    $('#selector-fecha').change(function () {
        fechaSelect = $(this).val();
        entradas = [];
        descansos = [];
        salidas = [];
        actualizarCharts();
    });

    function obtenerUsuariosPorEmpresa(idEmpresa, fecha) {
        return $.ajax({
            url: `/api/empresa/${idEmpresa}/usuarios?fecha=${fecha}`,
            method: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            }
        }).then(response => {
            usuariosEmpresa = response;
            return response;
        }).catch(error => {
            console.error("Error al obtener los usuarios de la empresa:", error);
            throw error;
        });
    }

    function cargarDatosFichajes(fecha) {
        horasExactas = [];
        return cargarFichajesYAusentes(fecha).then(data => {
            fichajesPorFecha = data.fichajes;
            ausentesPorFecha = data.ausentes;


        }).catch(error => {
            console.error("Error al obtener fichajes y ausentes:", error);
            throw error;
        });
    }

    function contarFichajesPorHora() {
        // Agrupamos los fichajes por hora
        fichajesPorFecha.forEach(fichaje => {
            let fechaFichaje = new Date(fechaSelect).toISOString().split('T')[0];
            let fechaCompleta = `${fechaFichaje}T${fichaje.hora}`;
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

        // Ordena la lista
        horasExactas = [...new Set(horasExactas)].sort();

        // Función para obtener la cantidad de fichajes por hora
        function obtenerCantidad(fichajes, hora) {
            return fichajes.filter(f => f === hora).length;
        }
        return {
            horasExactas,
            entradas: horasExactas.map(hora => ({ x: hora, y: obtenerCantidad(entradas, hora) })),
            descansos: horasExactas.map(hora => ({ x: hora, y: obtenerCantidad(descansos, hora) })),
            salidas: horasExactas.map(hora => ({ x: hora, y: obtenerCantidad(salidas, hora) }))
        };
        // return {
        //     horasExactas,
        //     entradas: horasExactas
        //         .map(hora => ({ x: hora, y: obtenerCantidad(entradas, hora) }))
        //         .filter(dato => dato.y > 0),
        //     descansos: horasExactas
        //         .map(hora => ({ x: hora, y: obtenerCantidad(descansos, hora) }))
        //         .filter(dato => dato.y > 0),
        //     salidas: horasExactas
        //         .map(hora => ({ x: hora, y: obtenerCantidad(salidas, hora) }))
        //         .filter(dato => dato.y > 0)
        // };
    }
    function generarGraficoFichajes() {
        let { horasExactas, entradas, descansos, salidas } = contarFichajesPorHora();


        totalEmpleadosActivos = fichajesPorFecha.filter(f => f.tipo_fichaje === "entrada").length
            + ausentesPorFecha.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;
        entradas = entradas.map(value => value === 0 ? null : value);
        descansos = descansos.map(value => value === 0 ? null : value);
        salidas = salidas.map(value => value === 0 ? null : value);

        const data = {
            datasets: [
                {
                    label: "Entrada", data: entradas, borderColor: "rgba(75, 192, 192, 0.8)", backgroundColor: "rgba(75, 192, 192, 0.2)", fill: true, tension: 0.1, spanGaps: false, pointRadius: 6,
                    pointHoverRadius: 8,
                },
                {
                    label: "Inicio_descanso", data: descansos, borderColor: "rgba(54, 162, 235, 0.8)", backgroundColor: "rgba(54, 162, 235, 0.2)", fill: true, tension: 0.1, spanGaps: false, pointRadius: 6,
                    pointHoverRadius: 8,

                },
                {
                    label: "Salida", data: salidas, borderColor: "rgba(255, 205, 86, 0.8)", backgroundColor: "rgba(255, 205, 86, 0.2)", fill: true, tension: 0.1, spanGaps: false, pointRadius: 6,
                    pointHoverRadius: 8,
                }
            ]
        };
        const options = {
            responsive: true,
            plugins: {
                legend: { display: true },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            let horaTooltip = tooltipItem.raw.x.split("T")[1]; // Extraer solo la hora
                            let tipoFichaje = tooltipItem.dataset.label; // Tipo de fichaje

                            // Filtramos los empleados que ficharon a esa hora y con ese tipo de fichaje
                            let empleados = fichajesPorFecha
                                .filter(f => f.hora === horaTooltip && f.tipo_fichaje.toLowerCase() === tipoFichaje.toLowerCase())
                                .map(f => `${f.usuario.nombre} ${f.usuario.apellidos}`);

                            return empleados.length ? [`${tipoFichaje}:`, ...empleados] : [`${tipoFichaje}: Sin registros`];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        parser: "yyyy-MM-dd'T'HH:mm:ss",
                        tooltipFormat: "HH:mm:ss",
                        unit: "hour",
                        displayFormats: {
                            minute: "HH:mm",
                            hour: "HH:mm"
                        }
                    },
                    // min: `${new Date(fechaSelect).toISOString().split('T')[0]}T08:00:00`,
                    // max: `${new Date(fechaSelect).toISOString().split('T')[0]}T20:00:00`,                    
                    ticks: {
                        source: "auto",
                        autoSkip: true,
                        maxTicksLimit: 24
                    }
                },
                y: {
                    min: 0,
                    // max:7,
                    // max: totalEmpleadosActivos,
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
    async function obtenerAusenciasSemana(fechaSeleccionada) {
        try {
            $.ajax({
                url: `/api/fichajes/ausencias-semana/${fechaSeleccionada}/${empresa.id_empresa}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + apiKey
                },
                success: function (data) {

                    let hoy = new Date().toISOString().split('T')[0];

                    // Filtrar fechas menores o iguales a hoy
                    const fechasFiltradas = Object.keys(data).filter(function (fecha) {
                        return new Date(fecha) <= new Date(hoy);
                    });

                    // Convertir fechas en nombres de días (Lunes, Martes...)
                    const opcionesFormato = { weekday: "long" };
                    etiquetasDias = Object.keys(data).map(function (fecha) {
                        let fechaObj = new Date(fecha);
                        let nombreDia = fechaObj.toLocaleDateString("es-ES", opcionesFormato);
                        let numeroDia = fechaObj.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
                        return `${nombreDia} ${numeroDia}`;
                    });

                    // Filtrar los valores de ausencias basados en las fechas filtradas
                    valoresAusencias = fechasFiltradas.map(function (fecha) {
                        return data[fecha];
                    });
                    generarGraficoAusencias();

                },
                error: function (xhr, status, error) {
                    console.error("Error cargando ausencias:", error);
                }
            });
        } catch (error) {
            console.error("Error inesperado:", error);
        }

        function generarGraficoAusencias(params) {
            // Configurar datos para la gráfica
            const chartData = {
                labels: etiquetasDias,
                datasets: [{
                    label: "Número de Ausencias",
                    data: valoresAusencias,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                    ],
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1
                }]
            };
            // Destruir gráfica anterior si existe
            if (barChart) {
                barChart.destroy();
            }
            // Crear gráfica de barras
            const ctxBar = document.getElementById("myBarChart").getContext("2d");
            barChart = new Chart(ctxBar, {
                type: "bar",
                data: chartData,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            ticks: {
                                stepSize: 1,
                                beginAtZero: true
                            }
                        }
                    }
                }
            });
        }
    }

    function cargarMapa(fichajesPorFecha) {
        if (mapa) {
            mapa.remove();
        }
        let primerFichaje = fichajesPorFecha[0];
        mapa = L.map('mapaFichajes').setView(
            fichajesPorFecha && fichajesPorFecha.length > 0
                ? [primerFichaje.latitud, primerFichaje.longitud]
                : [40.4167750, -3.7037900], // Coordenadas de Madrid por defecto si no hay datos
            8 // Zoom inicial
        );
        // Cargar el mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);

        let markers = L.markerClusterGroup();
        fichajesPorFecha.forEach(fichaje => {
            let comentarios = fichaje.comentarios ? fichaje.comentarios : "";
            let ubicacion = fichaje.ciudad ? fichaje.ciudad : "Ubicación no disponible"
            let marker = L.marker([fichaje.latitud, fichaje.longitud]).addTo(mapa)
                .bindPopup(fichaje.usuario.nombre + " " + fichaje.usuario.apellidos
                    + "<br>" + fichaje.tipo_fichaje + " " + fichaje.hora + "<br>"
                    + comentarios + "<br>" + ubicacion)
                .openPopup();
            markers.addLayer(marker);
        });
        mapa.addLayer(markers);
        if (markers.getLayers().length > 0) {
            // Obtiene los límites del clúster
            const bounds = markers.getBounds();
            // Ajusta la vista del mapa para que incluya todos los puntos
            mapa.fitBounds(bounds);
        }
    }

    // Formatea los segundos obtenidos del campo duracion en la tabla Fichajes a HH:mm:ss 
    function segundosAHora(segundos) {
        var horas = Math.floor(segundos / 3600);
        var minutos = Math.floor((segundos % 3600) / 60);
        var segundosRestantes = segundos % 60;

        return (horas < 10 ? '0' : '') + horas + ':' +
            (minutos < 10 ? '0' : '') + minutos + ':' +
            (segundosRestantes < 10 ? '0' : '') + segundosRestantes;
    }

    function obtenerTiemposTotales(fechaSeleccionada) {
        return $.ajax({
            url: `/api/fichajes/tiempos-totales/${fechaSeleccionada}/${empresa.id_empresa}`,
            method: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            }
        }).then(response => {
            tiempoTotalTrabajado = response.total_trabajado;
            tiempoTotalDescanso = response.total_descansos;
            usuariosTiempos = response.usuarios;
            generarGraficoTiempos(fechaSeleccionada);
        }).catch(xhr => {
            console.error(xhr.responseJSON?.message || 'Error desconocido');
            throw xhr; // Propaga el error para que Promise.all lo maneje
        });
    }
    function obtenerTotalEmpleadosActivos() {
        return ausentesPorFecha.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;
    }
    function generarGraficoTiempos() {
        numAusentes = obtenerTotalEmpleadosActivos();
        const factor = 3600;

        const data = {
            labels: ['Tiempo trabajado', 'Tiempo de descanso', 'Número de ausencias'],
            datasets: [{
                data: [tiempoTotalTrabajado, tiempoTotalDescanso, numAusentes * factor], // Evitar valores cero
                backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
            }],
        }
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {

                        // Personalizar el texto del tooltip
                        label: function (tooltipItem) {
                            // Obtiene el valor de los datos
                            var value = tooltipItem.raw;

                            // Obtiene la etiqueta
                            var label = tooltipItem.label;

                            // Si el valor es un tiempo en segundos, formatearlo como HH:mm:ss
                            if (label === 'Tiempo trabajado' || label === 'Tiempo de descanso') {
                                return label + ': ' + segundosAHora(value); // Formatear tiempo
                            } else {
                                // Número de ausencias                              
                                return label + ': ' + (value / factor);

                            }
                        }
                    }
                }
            },
        };
        var ctx = document.getElementById("myPieChart").getContext("2d");
        if (pieChart) {
            pieChart.destroy();
        }
        pieChart = new Chart(ctx, {
            type: "doughnut",
            data: data,
            options: options
        });
    }


    // Zona de informes 
    $(".report-card").click(function () {
        // Obtener el título del informe clickeado
        let reportTitle = $(this).find(".report-title").text();
        //fechaInformes = fechaHoy;
        // Llamar a la función para generar el informe
        elegirInforme(reportTitle);
    });

    $('#selector-fecha-informes').change(function () {
        fechaInformes = $(this).val();
        $('#report-details').fadeOut(300);
        $('#loading-gif').show();


        Promise.all([
            cargarDatosFichajes(fechaInformes),
            obtenerTiemposTotales(fechaInformes),
            obtenerUsuariosPorEmpresa(empresa.id_empresa, fechaInformes)
        ])
            .then(() => {
                elegirInforme($('.modal-title').text());
            })
            .catch(error => {
                console.error("Error al actualizar los datos:", error);
            });
    });

    // Función para manejar la generación del informe

    function elegirInforme(titulo) {
        if ($.fn.DataTable.isDataTable('#report-table')) {
            $('#report-table').DataTable().destroy();
        }
        $('#selector-fecha-informes').val(fechaInformes);

        //cargarDatosFichajes(fechaInformes).then(() => {
        // cargarFichajesYAusentes(fechaInformes).then(data => {
        //     fichajesPorFecha = data.fichajes;
        //     ausentesPorFecha = data.ausentes;
        $('#report-container').hide();
        $('#loading-gif').show();
        //$('#report-content').hide(); 

        // Simula una carga de datos (puedes reemplazarlo por tu lógica de carga de datos)
        setTimeout(function () {
           
            $('#loading-gif').hide(); 
            $('#report-details').fadeIn(200);  
        }, 100);  
        //$('#report-table_wrapper').fadeIn(5000);
        $('.modal-title').text(titulo);
        // $('.lock-screen').addClass('activo');

        tableHead.empty();
        tableBody.empty();
        switch (titulo) {
            case "Informe de fichajes diarios":
                console.log(fichajesPorFecha);
                filaHead = `<tr>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Tipo de Fichaje</th>
                                <th>Hora</th>
                                <th>Ubicación</th>
                                <th>Ciudad</th>                        
                            </tr>`;
                tableHead.append(filaHead);
                filas = '';
                fichajesPorFecha.forEach(fichaje => {
                    let nombreCompleto = `${fichaje.usuario.nombre} ${fichaje.usuario.apellidos}`.trim();
                    filas += `<tr>
                                    <td>${fichaje.usuario.dni}</td>
                                    <td>${nombreCompleto}</td>
                                    <td>${fichaje.tipo_fichaje}</td>
                                    <td>${fichaje.hora}</td>
                                    <td>${fichaje.ubicacion}</td>
                                    <td>${fichaje.ciudad}</td>
                                </tr>`;
                    // tableBody.append(filaBody);

                });
                tableBody.html(filas);
                generarInforme();
                break;
            case "Informe de ausencias":
                console.log(ausentesPorFecha);
                filaHead = `<tr>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Cargo</th>                                               
                            </tr>`;
                tableHead.append(filaHead);
                filas = '';
                ausentesPorFecha.forEach(empleado => {
                    let nombreCompleto = `${empleado.nombre} ${empleado.apellidos}`.trim();
                    filas += `<tr>
                                    <td>${empleado.dni}</td>
                                    <td>${nombreCompleto}</td>
                                    <td>${empleado.email}</td>
                                    <td>${empleado.cargo}</td>                        
                                </tr>`;
                    // tableBody.append(filaBody);
                });
                tableBody.html(filas);
                generarInforme();
                break;
            case "Tiempo total de descanso":

                filaHead = `<tr>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Tiempo de descanso</th>                        
                            </tr>`;
                tableHead.append(filaHead);
                filas = '';
                usuariosTiempos.forEach(usuario => {
                    let tiempoTotalDescanso = segundosAHora(`${usuario.total_descansos}`);
                    let nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.trim();
                    filas += `<tr>
                                    <td>${usuario.dni}</td>
                                    <td>${nombreCompleto}</td>
                                    <td>${tiempoTotalDescanso} min</td>                        
                                </tr>`;
                    // tableBody.append(filaBody);
                });
                tableBody.html(filas);
                generarInforme();

                break;
            case "Porcentaje de horas trabajadas":
                const jornadaSegundos = 8 * 60 * 60; // 28800 segundos para una jornada de 8 horas
                filaHead = `<tr>
                                    <th>Identificador</th>
                                    <th>Nombre</th>
                                    <th>Porcentaje trabajado</th>
                                </tr>`;
                tableHead.append(filaHead);
                filas = '';
                usuariosTiempos.forEach(usuario => {
                    let nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.trim();
                    let tiempoTrabajadoSegundos = usuario.total_trabajado;
                    let porcentaje = (tiempoTrabajadoSegundos / jornadaSegundos) * 100;
                    let porcentajeFormateado = porcentaje.toFixed(2) + '%';
                    filas += `<tr>
                                    <td>${usuario.dni}</td>
                                    <td>${nombreCompleto}</td>
                                    <td>${porcentajeFormateado}</td>
                                </tr>`;
                    // tableBody.append(filaBody);
                });
                tableBody.html(filas);
                generarInforme();

                break;
            case "Tiempo extra trabajado":
                let jornadaEstandar = 8 * 60 * 60; // 28800 segundos para una jornada de 8 horas
                filaHead = `<tr>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Horas extra trabajadas</th>
                            </tr>`;
                tableHead.append(filaHead);
                filas = '';
                usuariosTiempos.forEach(usuario => {
                    let nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.trim();
                    let tiempoTrabajadoSegundos = usuario.total_trabajado;
                    let tiempoExtraSegundos = Math.max(tiempoTrabajadoSegundos - jornadaEstandar, 0);
                    let tiempoExtraFormateado = segundosAHora(tiempoExtraSegundos);
                    filas += `<tr>
                                <td>${usuario.dni}</td>
                                <td>${nombreCompleto}</td>
                                <td>${tiempoExtraFormateado}</td>
                            </tr>`;
                    // tableBody.append(filaBody);
                });
                tableBody.html(filas);
                generarInforme();
                break;
            case "Tiempo total trabajado":
                filaHead = `<tr>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Tiempo trabajado</th>                        
                            </tr>`;
                tableHead.append(filaHead);
                filas = '';
                usuariosTiempos.forEach(usuario => {
                    let nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.trim();
                    let tiempoTotalTrabajado = segundosAHora(`${usuario.total_trabajado}`);
                    filas += `<tr>
                                    <td>${usuario.dni}</td>
                                    <td>${nombreCompleto}</td>
                                    <td>${tiempoTotalTrabajado} min</td>                        
                                </tr>`;
                    // tableBody.append(filaBody);
                });
                tableBody.html(filas);
                generarInforme(usuariosTiempos);
                break;
            case "Fichajes en ruta":
                filaHead = `<tr>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Hora</th>  
                                <th>Ubicación</th>  
                                <th>Ciudad</th>
                                <th>Comentarios</th>                    
                            </tr>`;
                tableHead.append(filaHead);
                filas = '';
                fichajesPorFecha.forEach(fichaje => {
                    if (fichaje.tipo_fichaje === "registro") {
                        let nombreCompleto = `${fichaje.usuario.nombre} ${fichaje.usuario.apellidos}`.trim();
                        filas += `<tr>
                                        <td>${fichaje.usuario.dni}</td>
                                        <td>${nombreCompleto}</td>
                                        <td>${fichaje.hora}</td>
                                        <td>${fichaje.ubicacion}</td>
                                        <td>${fichaje.ciudad}</td>
                                        <td>${fichaje.comentarios}</td>
                                    </tr>`;
                        // tableBody.append(filaBody);
                    }
                });
                tableBody.html(filas);
                generarInforme();
                break;
            case "Empleados inactivos":
                filaHead = `<tr>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Email</th>  
                                <th>Cargo</th>  
                                <th>Estado</th>                                                   
                            </tr>`;
                tableHead.append(filaHead);
                filas = '';
                const empleadosInactivos = usuariosEmpresa.filter(usuario => usuario.estado !== "aceptada");
                empleadosInactivos.forEach(usuario => {
                    let nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.trim();
                    filas += `<tr>
                                    <td>${usuario.dni}</td>
                                    <td>${nombreCompleto}</td>
                                    <td>${usuario.email}</td>
                                    <td>${usuario.cargo || "Sin cargo"}</td>
                                    <td>${usuario.estado}</td>
                                </tr>`;
                    // tableBody.append(filaBody);
                });
                tableBody.html(filas);
                generarInforme();
                break;
            case "Total de plantilla":
                filaHead = `<tr>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Email</th>  
                                <th>Cargo</th>  
                                <th>Estado</th>                                                   
                            </tr>`;
                tableHead.append(filaHead);
                filas = '';
                usuariosEmpresa.forEach(usuario => {
                    let nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.trim();
                    filas += `<tr>
                            <td>${usuario.dni}</td>
                            <td>${nombreCompleto}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.cargo || "Sin cargo"}</td>
                            <td>${usuario.estado}</td>
                        </tr>`;
                    // tableBody.append(filaBody);
                });
                tableBody.html(filas);
                generarInforme(usuariosEmpresa);


                break;

            default:
                console.log("Informe desconocido");
        }

        //});
    }

    function generarInforme() {

        dataTable = $('#report-table').DataTable({
            responsive: true,
            autoWidth: false,
            deferRender: true,           
            pageLength: 10, // Cantidad de filas por página
            lengthMenu: [5, 10, 25, 50], // Opciones de paginación
            language: {
                "url": "/js/Es-es.json",                
                "emptyTable": "Ningún dato disponible en esta tabla"
                
            },
            dom: 'pfrtiB',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<i class="fas fa-file-excel"></i> ',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success'
                },
                {
                    extend: 'pdfHtml5',
                    text: '<i class="fas fa-file-pdf"></i> ',
                    titleAttr: 'Exportar a PDF',
                    className: 'btn btn-danger'
                },
                {
                    extend: 'print',
                    text: '<i class="fa fa-print"></i> ',
                    titleAttr: 'Imprimir',
                    className: 'btn btn-info'
                },
                {
                    extend: 'copy',
                    text: '<i class="fa fa-copy"></i> ',
                    titleAttr: 'Copiar al portapapeles',
                    className: 'btn btn-secondary'
                },
            ]

        });
        //$('#report-table_wrapper').fadeIn(5000);

    }
    $(document).on('click', '.btn-close , .close-report', function () {
        $('#report-container').show();
        $('#report-details').hide();

    });
});
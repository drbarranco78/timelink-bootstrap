// import './echo';

$(document).on('mousedown', function (e) {
    if (!$(e.target).closest('#div-solicitudes-acceso').length) {
        $('#div-solicitudes-acceso').css("display", "none");            
    }
});
//console.log('Escuchando eventos en admin...');
window.cargarFichajesYAusentes = cargarFichajesYAusentes;
// Función optimizada para obtener fichajes y ausentes en paralelo
function cargarFichajesYAusentes(fecha) {
    // Preparamos los datos en formato JSON
    const payload = JSON.stringify({ fecha: fecha, id_empresa: empresa.id_empresa });

    // Creamos dos promesas para las peticiones AJAX
    let pFichajes = $.ajax({
        url: '/api/fichajes/fecha',
        method: 'POST',
        contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + apiKey },
        data: payload
    });

    let pAusentes = $.ajax({
        url: '/api/fichajes/ausentes',
        method: 'POST',
        contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + apiKey },
        data: payload
    });

    // Usamos Promise.all para esperar a que ambas peticiones se completen
    return Promise.all([pFichajes, pAusentes])
        .then(results => {
            // results[0] contiene la respuesta de fichajes
            // results[1] contiene la respuesta de ausentes
            return { fichajes: results[0], ausentes: results[1] };
        })
        .catch(error => {
            console.error("Error al obtener fichajes o ausentes:", error);
            // Rechazamos la promesa para que se pueda manejar en el .catch del llamador
            throw error;
        });
}
// window.Echo.channel('fichajes').listenToAll((event, data) => {
//     console.log('Evento recibido en fichajes:', event, data);
// });
// window.Echo.channel('fichajes')
//     .listen('.fichajeRealizado', (e) => {
//         console.log('Evento recibido:', e);

//         alert('¡Evento recibido en admin.js!');
//     });

// console.log('Echo conectado:', window.Echo);
window.addEventListener('DOMContentLoaded', event => {
    $('#reports').hide();
    // $('#reports h2').hide();
    $(document).on('click', '#cerrar-solicitudes', function () {
        $('#div-solicitudes-acceso').hide();
    });

    actualizarNotificaciones();
    obtenerFechaHora();
    // Llamada para obtener los fichajes de hoy
    obtenerNumFichajes(new Date().toISOString().split('T')[0]);
    $('#selector-fecha').change(function () {
        fechaSeleccionada = $(this).val();

        // Convertir la fecha al formato dd/mm/yyyy
        let partesFecha = fechaSeleccionada.split("-");
        let fechaFormateadaSeleccionada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

        // Actualizar el texto del span
        $('#span-fecha').text(fechaHoy === fechaSeleccionada ? "Mostrando datos de hoy" : "Mostrando datos del día " + fechaFormateadaSeleccionada);

        if (usuarioActivo.rol === "maestro") {
            obtenerNumFichajes(fechaSeleccionada);
        }
    });

    // Se actualizan los fichajes cada media hora
    // setInterval(() => {
    //     obtenerNumFichajes(fechaSeleccionada);
    // }, 1800000);
    // setInterval(actualizarNotificaciones, 30000);

    if (empresa) {
        $('#nombre-empresa').html(empresa.nombre_empresa);
    }

    window.obtenerEmpleados = function () {
        $.ajax({
            url: `/api/empresa/${empresa.id_empresa}/usuarios`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
            success: function (response) {
                empleados = response;
                // Llenar la tabla con los empleados
                actualizarTablaEmpleados(empleados);
                obtenerNumFichajes(fechaSeleccionada);
            },
            error: function (xhr) {
                mostrarMensaje(xhr.responseJSON.message, '.error-msg');
            }
        });
    }
    obtenerEmpleados();
    obtenerInactivos();
    function obtenerInactivos() {
        $.ajax({
            url: '/api/usuarios/inactivos',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
            data: { id_empresa: empresa.id_empresa },
            success: function (response) {
                $('#excluded-number').text(response.inactivos.length);
                if (response.inactivos.length > 0) {

                    $('#link-excluded').click(function () {
                        mostrarListaInactivos(response.inactivos);
                    });
                }
            },
            error: function (xhr, message) {

                if (xhr.responseJSON) {
                    mostrarMensaje(xhr.responseJSON.message, '.error-msg');
                }
            }
        });
    }
    function mostrarListaInactivos(inactivos) {

        let html = `
                    <div class="header-solicitudes">
                        <h3>Empleados Inactivos</h3>
                        <span id="cerrar-solicitudes">&times;</span>
                    </div>
                    `;
        inactivos.forEach(inactivo => {
            html += `
                    <div class="solicitud" data-id="${inactivo.id}">
                        <p><strong>${inactivo.nombre} ${inactivo.apellidos}</strong></p>
                        <p>Email: ${inactivo.email}</p>
                        <!-- Solo pasamos el 'id' del usuario -->
                        <button class="btn-perfil-exc" data-id="${inactivo.id}">Ver Perfil</button>                                 
                    </div>
                `;
        });

        $('#div-solicitudes-acceso').html(html);
        $('#div-solicitudes-acceso').show();

        // Cerrar ventana al hacer clic en la "X"
        $('#cerrar-solicitudes').click(function () {
            $('#div-solicitudes-acceso').hide();
        });

        // Evento click en el botón "Ver Perfil"
        $(document).on('click', '.btn-perfil-exc', function () {
            $('#div-solicitudes-acceso').hide();
            // Obtenemos el ID del empleado desde el botón
            let idEmpleado = $(this).data('id');

            consultarEmpleado(idEmpleado);
        });
    }
    function actualizarTablaEmpleados(empleados) {
        // Destruir la instancia actual de DataTable si ya existe
        if ($.fn.DataTable.isDataTable('#tabla-empleados')) {
            $('#tabla-empleados').DataTable().destroy();
        }
        let tabla = $("#tabla-empleados tbody");

        // Limpiamos la tabla antes de insertar datos
        tabla.empty();

        empleados.forEach(empleado => {

            if (empleado.rol === "empleado" && empleado.estado === "aceptada") {
                let fechaAlta = formatearFecha(new Date(empleado.created_at).toISOString().split('T')[0]);
                let fila = `<tr>
                        <td>${empleado.nombre}</td>
                        <td>${empleado.apellidos}</td>
                        <td>${empleado.dni}</td>
                        <td>${empleado.email}</td>
                        <td>${empleado.cargo}</td>
                        <td>${fechaAlta}</td>
                        <td class="ver-perfil">
                            <button class="btn-ver-perfil" data-id="${empleado.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>`;
                tabla.append(fila);
            }
        });
        // Volver a inicializar DataTable
        $('#tabla-empleados').DataTable({
            language: {
                "url": "/js/Es-es.json"
            },
            responsive: true
        });
    }
    $(".toggle-detalles").click(function (event) {
        event.preventDefault();
        expandirFichas(this);
    });
    function expandirFichas(elemento) {

        // Encuentra la tarjeta más cercana
        let tarjeta = $(elemento).closest(".card");

        // Encuentra la sección de detalles dentro de esta tarjeta
        let detalles = tarjeta.find(".detalles-actividad");

        // Encuentra el icono dentro de esta tarjeta
        let icono = tarjeta.find(".fa-angle-down, .fa-angle-up");

        // Alternar visibilidad
        detalles.slideToggle(200);

        // Alternar icono
        icono.toggleClass("fa-angle-down fa-angle-up");

        // Si los detalles no están cargados, cargarlos
        if (!detalles.hasClass("loaded")) {
            cargarFichajesYAusentes(fechaSeleccionada).then(data => {
                // Llamar a la función rellenarFichas y pasarle los datos obtenidos
                rellenarFichas(data.fichajes);
            });
            detalles.addClass("loaded");
        }

    }
    // Cierra las fichas abiertas si se hace click fuera de ellas
    $(document).click(function (event) {
        let dentroDeTarjeta = $(event.target).closest(".card").length > 0;
        let dentroDeBoton = $(event.target).closest(".toggle-detalles").length > 0;

        if (!dentroDeTarjeta && !dentroDeBoton) {
            $(".detalles-actividad").slideUp(200).removeClass("mostrar loaded");
            $(".fa-angle-up").removeClass("fa-angle-up").addClass("fa-angle-down");
        }
    });

    // Función para contar y mostrar el número de fichajes en las tarjetas y los ausentes
    function obtenerNumFichajes(fecha) {

        cargarFichajesYAusentes(fecha).then(data => {
            let fichajes = data.fichajes;
            let ausentes = data.ausentes;

            // Contar los fichajes por tipo
            let numeroDescansos = fichajes.filter(f => f.tipo_fichaje === "inicio_descanso").length;
            let numeroEntradas = fichajes.filter(f => f.tipo_fichaje === "entrada").length;
            let numeroSalidas = fichajes.filter(f => f.tipo_fichaje === "salida").length;
            let numeroAusentes = ausentes.filter(f => f.rol !== "maestro" && f.estado === "aceptada").length;

            // Actualizar los contadores de fichajes
            $('.bg-primary .card-body span').text(numeroDescansos);
            $('.bg-warning .card-body span').text(numeroSalidas);
            $('.bg-success .card-body span').text(numeroEntradas);
            $('.bg-danger .card-body span').text(numeroAusentes);

            // Mostrar los ausentes
            $('#ficha-ausencias').html(
                ausentes
                    // Excluye al administrador y pendientes de aceptar
                    .filter(a => a.rol !== "maestro" && a.estado === "aceptada")
                    .map(a => `<span class="border-b"><i class="fas fa-user-times m-right10"></i>${a.nombre} ${a.apellidos}</span><br>`)
                    .join('') || "No hay ausencias registradas"
            );

            // Llamar a la función para rellenar las fichas con los datos de los fichajes
            rellenarFichas(fichajes);

        }).catch(error => {
            console.error("Error al obtener fichajes y ausentes:", error);
        });
    }

    // Función para rellenar las tarjetas con los fichajes
    window.rellenarFichas = function (fichajes) {

        // Contenedores para cada tipo de fichaje
        let contenedorDescansos = $('#ficha-descansos');
        let contenedorEntradas = $('#ficha-entradas');
        let contenedorSalidas = $('#ficha-salidas');

        // Variables para almacenar el contenido
        let contenidoDescansos = "";
        let contenidoEntradas = "";
        let contenidoSalidas = "";

        // Recorrer los fichajes y filtrar por tipo
        fichajes.forEach(function (fichaje) {
            let textoFichaje = `${fichaje.usuario.nombre} ${fichaje.usuario.apellidos} -  ${fichaje.ciudad || "Ubicación no disponible"}`;

            if (fichaje.tipo_fichaje === "inicio_descanso") {
                contenidoDescansos += `<span style="all: unset;"><i class="fas fa-mug-hot m-right10"></i>
                ${fichaje.hora.slice(0, 8)}<i class="fas fa-arrow-right m-left10 m-right10"></i>Inicio de descanso</span><br><p class="border-b">${textoFichaje}</p>`;

            } else if (fichaje.tipo_fichaje === "fin_descanso") {
                contenidoDescansos += `<span style="all: unset;"><i class="fas fa-hourglass-end m-right10"></i>
                ${fichaje.hora.slice(0, 8)}<i class="fas fa-arrow-right m-left10 m-right10"></i>Fin de descanso</span><br><p class="border-b">${textoFichaje}</p>`;

            } else if (fichaje.tipo_fichaje === "entrada") {
                contenidoEntradas += `<span style="all: unset;"><i class="fas fa-stopwatch m-right10"></i>${fichaje.hora.slice(0, 8)}</span><br><p class="border-b">${textoFichaje}</p>`;
            } else if (fichaje.tipo_fichaje === "salida") {
                contenidoSalidas += `<span style="all: unset;"><i class="fas fa-sign-out-alt m-right10"></i>${fichaje.hora.slice(0, 8)}</span><br><p class="border-b">${textoFichaje}</p>`;
            }
        });

        // Actualizar los contenedores
        contenedorDescansos.html(contenidoDescansos || "No hay ningún descanso registrado");
        contenedorEntradas.html(contenidoEntradas || "No hay ninguna entrada registrada");
        contenedorSalidas.html(contenidoSalidas || "No hay ninguna salida registrada");
    }

    function actualizarNotificaciones() {
        // $('#div-solicitudes-acceso').html('');
        $.ajax({
            url: "/api/solicitudes-pendientes",
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
            success: function (data) {
                if (data.pendientes.length > 0) {
                    $('#ico-users').addClass('fa-user-plus').removeClass('fa-users');

                    $('#access-request-number').text(data.pendientes.length);
                    $('#div-solicitudes-acceso').html('');
                    // Construimos el contenido del div
                    let html = `
                            <div class="header-solicitudes">
                                <h3>Solicitudes de acceso</h3>
                                <span id="cerrar-solicitudes">&times;</span>
                            </div>
                        `;

                    data.pendientes.forEach(solicitud => {
                        html += `
                                <div class="solicitud" data-id="${solicitud.id}">
                                    <p><strong>${solicitud.nombre} ${solicitud.apellidos}</strong></p>
                                    <p>Email: ${solicitud.email}</p>
                                    <button class="btn-aceptar" data-id="${solicitud.id}" data-nombre="${solicitud.nombre}" data-apellidos="${solicitud.apellidos}">Aceptar</button>
                                    <button class="btn-rechazar" data-id="${solicitud.id}" data-nombre="${solicitud.nombre}" data-apellidos="${solicitud.apellidos}">Rechazar</button>
                                </div>
                            `;
                    });

                    $('#div-solicitudes-acceso').html(html);

                    // Asignar eventos a los botones 
                    $(document).on('click', '.btn-aceptar', function () {
                        mostrarDialogo("Aceptar la solicitud de " + $(this).data('nombre') + " " + $(this).data('apellidos') + "?")
                            .then(() => {
                                let userId = $(this).data('id');
                                actualizarEstado(userId, "aceptada");

                            })
                            .catch(() => {
                                // Si el usuario cancela la acción
                                console.log("Acción cancelada");
                            });
                    });

                    $(document).on('click', '.btn-rechazar', function () {
                        mostrarDialogo("Rechazar la solicitud de " + $(this).data('nombre') + " " + $(this).data('apellidos') + "?")
                            .then(() => {
                                let userId = $(this).data('id');
                                actualizarEstado(userId, "rechazada");
                            })
                            .catch(() => {
                                console.log("Acción cancelada");
                            });
                    });

                    //Mostrar el div al hacer clic en el enlace
                    $('#access-request-link').click(function () {
                        $('#div-solicitudes-acceso').html(html).show();
                    });

                } else {
                    $('#access-request-number').text('0').css("color", "inherit");
                    $('#ico-users').removeClass('fa-user-plus').addClass('fa-users');
                    $('#div-solicitudes-acceso').hide();
                }
            },
            error: function (xhr) {
                console.error("Error al obtener las solicitudes pendientes:", xhr.responseText);
            }
        });
    }
    window.actualizarEstado = function (userId, estado) {
        $.ajax({
            url: `/api/usuarios/${userId}/estado`,
            method: 'PATCH',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
            data: JSON.stringify({ estado: estado }),
            success: function (data) {
                mostrarMensaje(data.message, '.exito-msg');

                // Elimina la solicitud de la lista
                $(`.solicitud[data-id="${userId}"]`).remove();
                actualizarNotificaciones();
                obtenerEmpleados();
                obtenerInactivos();
                actualizarCharts();
            },
            error: function (xhr) {
                mostrarMensaje(xhr.responseJSON?.message || "Error al actualizar el estado", '.error-msg');
            }
        });
    }
    $('#link-send-invitation').click(function () {
        let html = `
                <div class="header-solicitudes">
                    <h3>Enviar invitación</h3>
                    <span id="cerrar-solicitudes">&times;</span>
                </div>
                <div id="form-invitacion">
                    
                    <input class="input-email-invitado" type="email" id="email-invitado" placeholder="Introduzca el correo del empleado" required>
                    <button id="btn-enviar-invitacion">Enviar Invitación</button>
                </div>
                `;
        $('#div-solicitudes-acceso').html(html);
        $('#div-solicitudes-acceso').show();
        $('#btn-enviar-invitacion').click(function (event) {
            event.preventDefault();
            let emailInvitado = $('#email-invitado').val();
            enviarInvitacion(emailInvitado);
        });
    });

    // Envía una invitación por correo electrónico para unirse a la empresa 
    function enviarInvitacion(emailInvitado) {
        $.ajax({
            url: 'api/enviar-invitacion',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
            data: JSON.stringify({
                id_empresa: empresa.id_empresa,
                email: emailInvitado,
                nombre_empresa: empresa.nombre_empresa
            }),
            success: function (response) {
                if (response.showDialog) {

                    // Si ya había una invitación activa para esa dirección, se le pregunta
                    mostrarDialogo(response.message)
                        .then(() => {
                            // Si el usuario acepta, reenviar con reenviar: true
                            $.ajax({
                                url: 'api/enviar-invitacion',
                                method: 'POST',
                                contentType: 'application/json',
                                headers: {
                                    'Authorization': 'Bearer ' + apiKey
                                },
                                data: JSON.stringify({
                                    id_empresa: empresa.id_empresa,
                                    email: emailInvitado,
                                    nombre_empresa: empresa.nombre_empresa,
                                    reenviar: true
                                }),
                                success: function (response) {
                                    mostrarMensaje(response.message, ".exito-msg");
                                    $('#div-solicitudes-acceso').hide();
                                },
                                error: function (xhr) {
                                    mostrarMensaje(xhr.responseJSON?.message || "Error al reenviar la invitación", '.error-msg');
                                }
                            });
                        })
                        .catch(() => {
                            console.log("Acción cancelada por el usuario");
                        });
                } else {
                    // Si no se necesita mostrar diálogo, solo mostrar el mensaje de éxito
                    mostrarMensaje(response.message, ".exito-msg");
                    $('#div-solicitudes-acceso').hide();
                }
            },
            error: function (xhr) {
                mostrarMensaje(xhr.responseJSON?.message || "Error al enviar la invitación", '.error-msg');
            }
        });
    }

    $(document).on('click', '#report-link', function (event) {      
            // $('#report-container').show();
            // $('#reports h2').show();
            $('#reports').show();
            $('#report-details').hide();
            $('#report-container').show();
            $('#contenedor-principal').hide(); 
            $('#seccion-perfil').hide();       
    });

    // $(document).on('click', '.btn-close', function (event) {      
    //     event.preventDefault();
    //     $('#report-modal').hide();
    // });
    
});

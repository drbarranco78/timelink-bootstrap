let admin = JSON.parse(localStorage.getItem('usuario'));
let empresa = JSON.parse(localStorage.getItem('empresa'));
// let idEmpresa;
let empleados = [];
let dataTable;
let selectorFecha;
let fechaSeleccionada;

window.addEventListener('DOMContentLoaded', event => {

    // $('.tab-pane').not('.active').hide();

    // // Maneja el cambio de pestañas
    // $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
    //     // Oculta todas las pestañas
    //     $('.tab-pane').hide();

    //     // Muestra solo la pestaña activa
    //     var target = $(e.target).attr('href');
    //     $(target).fadeIn(); // Usar fadeIn() para mayor suavidad
    // });




    actualizarNotificaciones();

    let fecha = new Date();
    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0');
    let anio = fecha.getFullYear();

    // Formato yyyy-mm-dd para el selector de fecha
    let fechaHoy = `${anio}-${mes}-${dia}`;

    // Establecer la fecha en el input
    $('#selector-fecha').val(fechaHoy);
    $('#selector-fecha').attr('max', fecha.toISOString().split("T")[0]);

    $('#span-fecha').text("Mostrando datos de hoy");

    // Llamada para obtener los fichajes de hoy
    obtenerNumFichajes(fechaHoy);

    fechaSeleccionada = fechaHoy;

    $('#selector-fecha').change(function () {
        fechaSeleccionada = $(this).val();

        // Convertir la fecha al formato dd/mm/yyyy
        let partesFecha = fechaSeleccionada.split("-");
        let fechaFormateadaSeleccionada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

        // Actualizar el texto del span
        $('#span-fecha').text(fechaHoy === fechaSeleccionada ? "Mostrando datos de hoy" : "Mostrando datos del día " + fechaFormateadaSeleccionada);
        console.log("Seleccionada " + fechaSeleccionada);

        obtenerNumFichajes(fechaSeleccionada);
    });
    // Se actualizan los fichajes cada media hora
    // setInterval(() => {
    //     obtenerNumFichajes(fechaSeleccionada);
    // }, 1800000);
    // setInterval(actualizarNotificaciones, 30000);

    if (empresa) {
        $('#nombre-empresa').html(empresa.nombre_empresa);
        idEmpresa = empresa.id_empresa;
    }
    obtenerEmpleados();
    obtenerInactivos();

    function obtenerEmpleados() {
        $.ajax({
            url: `/api/empresa/${idEmpresa}/usuarios`,
            method: 'GET',
            success: function (response) {
                empleados = response;
                console.log("Lista de empleados:", empleados);

                // Llenar la tabla con los empleados
                actualizarTablaEmpleados(empleados);
            },
            error: function (xhr) {
                mostrarMensaje(xhr.responseJSON.message, '.error-msg');
            }
        });
    }
    function obtenerInactivos() {
        $.ajax({
            url: '/api/usuarios/inactivos',
            method: 'POST',
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
                console.log("Error:", message);
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
        tabla.empty(); // Limpiamos la tabla antes de insertar datos

        empleados.forEach(empleado => {
            if (empleado.rol === "empleado" && empleado.estado === "aceptada") {
                let fila = `<tr>
                        <td>${empleado.nombre}</td>
                        <td>${empleado.apellidos}</td>
                        <td>${empleado.dni}</td>
                        <td>${empleado.email}</td>
                        <td>${empleado.cargo}</td>
                        <td>${empleado.created_at}</td>
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
                "url": "/js/es-ES.json"
            },
            responsive: true
        });

        // Asociar eventos a los botones de ver perfil
        $('.btn-ver-perfil').click(function () {
            let idEmpleado = $(this).data("id");
            console.log(idEmpleado);
            consultarEmpleado(idEmpleado);
        });
    }

    function consultarEmpresa(idEmpresa) {
        $.ajax({
            url: `/api/empresas/${idEmpresa}`,
            method: "GET",
            dataType: "json",
            success: function (empresa) {
                cargarPerfilEmpresa(empresa);
            },
            error: function () {
                alert("Error al cargar el perfil del usuario.");
            }
        });
    }
    function cargarPerfilEmpresa(empresa) {
        $("#seccion-perfil").attr("data-id-empresa", empresa.id_empresa);
        actualizarLabels("empresa");
        $("#lb-profile").text("Logo de la empresa")
        $(".profile-card img").attr("src", "img/your_logo.png");
        $(".col-md-8 img").attr("src", "img/your_logo.png");
        $('#seccion-perfil h3').text("Datos de la empresa");
        $(".profile-card h2").text(empresa.nombre_empresa);
        $(".profile-card h3").hide();

        $('#contenedor-principal').hide();
        $('#seccion-perfil').show();

        $('#delete-user').hide();
        $('#status-change').hide();
        $('#li_change-password').hide();

        // Sección resúmen
        $("#profile-name").text(empresa.nombre_empresa);
        $("#profile-surname").text(empresa.direccion);
        $("#profile-dni").text(empresa.cif);
        $("#profile-email").text(empresa.email);
        $("#profile-role").text(empresa.telefono);
        $("#profile-joindate").text(empresa.created_at);

        // Sección editar perfil
        $("#fullname").val(empresa.nombre_empresa);
        $("#surname").val(empresa.direccion);
        $("#dni").val(empresa.cif);
        $("#email").val(empresa.email);
        $("#job").val(empresa.telefono);
        $("#join-date").val(empresa.created_at);
    }

    function consultarEmpleado(idEmpleado) {

        $.ajax({
            url: `/api/usuarios/${idEmpleado}`,
            method: "GET",
            dataType: "json",
            success: function (empleado) {
                cargarPerfil(empleado);
            },
            error: function () {
                alert("Error al cargar el perfil del usuario.");
            }
        });

    }
    function cargarPerfil(empleado) {
        $("#seccion-perfil").attr("data-id-usuario", empleado.id);
        $("#seccion-perfil").attr("data-rol-usuario", empleado.rol);
        actualizarLabels("empleado");
        $("#lb-profile").text("Imagen de perfil");
        $(".profile-card img").attr("src", "img/ico_usuario_activo.png");
        $(".col-md-8 img").attr("src", "img/ico_usuario_activo.png");
        $(".profile-card h3").show();
        $('#seccion-perfil h3').text(empleado.rol === "maestro" ? 'Mi Perfil' : 'Perfil del empleado');
        $('#contenedor-principal').hide();
        $('#seccion-perfil').show();

        $('#delete-user').show();
        if (empleado.rol !== "maestro") {
            $('#status-change').show();
            $('input[name="status"]').prop('checked', false);
            let estadoActual = empleado.estado;
            // Marcar el radio button según el estado actual
            switch (estadoActual) {
                case 'pendiente':
                    $('#status-pendiente').prop('checked', true);
                    break;
                case 'aceptada':
                    $('#status-aceptado').prop('checked', true);
                    break;
                case 'rechazada':
                    $('#status-rechazado').prop('checked', true);
                    break;
                case 'baja':
                    $('#status-baja').prop('checked', true);
                    break;
                case 'vacaciones':
                    $('#status-vacaciones').prop('checked', true);
                    break;
                default:
                    $('#status-aceptado').prop('checked', true);
                    break;
            }
            $('#change-status').click(function (event) {
                event.preventDefault();
                // Obtener el estado seleccionado
                let estadoSeleccionado = $('input[name="status"]:checked').val();
        
                if (estadoSeleccionado) {
                    // Llamar a la función para actualizar el estado
                    actualizarEstado(empleado.id, estadoSeleccionado);
                } else {
                    mostrarMensaje("Debes seleccionar un estado.", '.error-msg');
                }
            });
        } else {
            $('#status-change').hide();
        }

        $('#li_change-password').show();



        $(".profile-card h2").text(empleado.nombre + " " + empleado.apellidos);
        $(".profile-card h3").text(empleado.cargo);

        // Sección resúmen
        $("#profile-name").text(empleado.nombre);
        $("#profile-surname").text(empleado.apellidos);
        $("#profile-dni").text(empleado.dni);
        $("#profile-email").text(empleado.email);
        $("#profile-role").text(empleado.cargo);
        $("#profile-joindate").text(empleado.created_at);

        // Sección editar perfil    
        $("#fullname").val(empleado.nombre);
        $("#surname").val(empleado.apellidos);
        $("#dni").val(empleado.dni);
        $("#email").val(empleado.email);
        $("#job").val(empleado.cargo);
        $("#join-date").val(empleado.created_at);



        $("#remove-employee-form").attr("data-id", empleado.id);
    }

    function actualizarLabels(tipo) {
        // Se sitúa en el apartado "resúmen"
        $('button[data-bs-target="#profile-overview"]').tab('show');

        if (tipo === "empresa") {
            // $('#profile-change-password').hide();
            // $('#li_change-password').hide();
            // Actualizar labels para la empresa
            $('#lb-profile-name, #lb-fullname').text("Nombre de la empresa");
            $('#lb-profile-surname, #lb-surname').text("Dirección");
            $('#lb-profile-dni, #lb-dni').text("CIF");
            $('#lb-profile-role, #lb-job').text("Teléfono");

            $("#btn-save-changes").addClass("esEmpresa");
            $("#btn-save-changes").removeClass("esEmpleado");

        } else if (tipo === "empleado") {
            // $('#profile-change-password').show();
            // $('#li_change-password').show();
            // Actualizar labels para el empleado
            $('#lb-profile-name, #lb-fullname').text("Nombre");
            $('#lb-profile-surname, #lb-surname').text("Apellidos");
            $('#lb-profile-dni, #lb-dni').text("DNI/NIE");
            $('#lb-profile-role, #lb-job').text("Puesto");

            $("#btn-save-changes").addClass("esEmpleado");
            $("#btn-save-changes").removeClass("esEmpresa");
        }
    }
    $("#btn-save-changes").click(function (event) {
        event.preventDefault();
        let datos;

        if ($(this).hasClass("esEmpresa")) {
            // Datos de la empresa
            datos = {
                id_empresa: empresa.id_empresa,
                cif: $("#dni").val(),
                nombre_empresa: $("#fullname").val(),
                direccion: $("#surname").val(),
                telefono: $("#job").val(),
                email: $("#email").val()
            };
            if (validarRegistro(datos)) {
                // Llamar al endpoint para actualizar la empresa
                $.ajax({
                    url: "/api/empresa/update",
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function (response) {
                        mostrarMensaje(response.message, ".exito-msg");
                    },
                    error: function (xhr) {
                        mostrarMensaje(xhr.responseJSON.message, '.error-msg');
                    }
                });
            }

        } else {
            // Datos del empleado   
            let idUsuario = $("#seccion-perfil").attr("data-id-usuario");
            datos = {
                id: idUsuario,
                nombre: $("#fullname").val(),
                apellidos: $("#surname").val(),
                dni: $("#dni").val(),
                email: $("#email").val(),
                cargo: $("#job").val()
            };

            if (validarRegistro(datos)) {
                // Llamar al endpoint para actualizar el empleado
                $.ajax({
                    url: "/api/usuarios/update",
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function (response) {
                        mostrarMensaje(response.message, ".exito-msg");
                        obtenerEmpleados();
                    },
                    error: function (error) {
                        mostrarMensaje("Error al guardar cambios", ".error-msg");
                    }
                });
            }
        }
    });
    function cambiarPassword() {
        let passwordActual = $('#currentPassword').val();
        let nuevoPassword = $('#newPassword').val();
        let repetirPassword = $('#renewPassword').val();
        let idUsuario = $("#seccion-perfil").attr("data-id-usuario");

        console.log("ID del usuario: " + idUsuario);
        console.log("Password actual: " + passwordActual);
        console.log("Nuevo: " + nuevoPassword);
        console.log("Confirmacion: " + repetirPassword);

        if (!patronPassword.test(nuevoPassword)) {
            mostrarMensaje("La contraseña debe tener entre 8 y 20 caracteres, y al menos una mayúscula, una minúscula y un número", ".error-msg");
            return false;
        }
        // Validación de la confirmación de la contraseña
        if (nuevoPassword !== repetirPassword) {
            mostrarMensaje("La nueva contraseña no coincide en los 2 campos", ".error-msg");
            return false;
        }
        $.ajax({
            url: "/api/cambiar-password",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                id_usuario: idUsuario,
                password_actual: passwordActual,
                nuevo_password: nuevoPassword

            }),
            success: function (response) {
                mostrarMensaje(response.message, 'exito-msg');
            },
            error: function (xhr) {
                mostrarMensaje(xhr.responseJSON.message, '.error-msg');
            }
        });
    }
    $('#change-password').click(function (event) {
        event.preventDefault();
        cambiarPassword();
    })

    $('#enlace-perfil').click(function () {
        consultarEmpleado(admin.id);
        $('#contenedor-principal').hide();
        $('#seccion-perfil').show();
    });

    $('#perfil-empresa').click(function () {
        consultarEmpresa(empresa.id_empresa);
    })
    $('#dashboard-inicio').click(function () {
        $('#contenedor-principal').show();
        $('#seccion-perfil').hide();
    });
    $(".toggle-detalles").click(function (event) {
        event.preventDefault();

        // Encuentra la tarjeta más cercana
        let tarjeta = $(this).closest(".card");

        // Encuentra la sección de detalles dentro de esta tarjeta
        let detalles = tarjeta.find(".detalles-actividad");

        // Encuentra el icono dentro de esta tarjeta
        let icono = tarjeta.find(".fa-angle-down, .fa-angle-up");

        // Alternar visibilidad
        detalles.slideToggle(200);
        //detalles.toggleClass("mostrar");

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
    });

    // Función para cargar fichajes y ausentes desde el backend
    function cargarFichajesYAusentes(fecha) {

        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/fichajes/fecha',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ fecha: fecha }),
                success: function (fichajes) {
                    // Llamar para obtener los ausentes
                    $.ajax({
                        url: '/api/fichajes/ausentes',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({ fecha: fecha }),
                        success: function (ausentes) {
                            resolve({ fichajes, ausentes }); // Resolvemos ambos datos en un solo objeto
                        },
                        error: function (xhr) {
                            reject("Error al obtener ausentes: " + xhr.responseJSON.message);
                        }
                    });
                },
                error: function (xhr) {
                    reject("Error al cargar los fichajes: " + xhr.responseJSON.message);
                }
            });
        });
    }

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
            $('#ficha-ausencias ul').html(
                ausentes
                    // Excluye al administrador y pendientes de aceptar
                    .filter(a => a.rol !== "maestro" && a.estado === "aceptada")
                    .map(a => `<li>${a.nombre} ${a.apellidos}</li>`)
                    .join('') || "No hay ausencias registradas"
            );

            // Llamar a la función para rellenar las fichas con los datos de los fichajes
            rellenarFichas(fichajes);

        }).catch(error => {
            console.error("Error al obtener fichajes y ausentes:", error);
        });
    }

    // Función para rellenar las tarjetas con los fichajes
    function rellenarFichas(fichajes) {

        // Contenedores para cada tipo de fichaje
        let contenedorDescansos = $('#ficha-descansos ul');
        let contenedorEntradas = $('#ficha-entradas ul');
        let contenedorSalidas = $('#ficha-salidas ul');

        // Variables para almacenar el contenido
        let contenidoDescansos = "";
        let contenidoEntradas = "";
        let contenidoSalidas = "";

        // Recorrer los fichajes y filtrar por tipo
        fichajes.forEach(function (fichaje) {
            let textoFichaje = `${fichaje.usuario.nombre} ${fichaje.usuario.apellidos} - ${fichaje.hora.slice(0, 5)}`;

            if (fichaje.tipo_fichaje === "inicio_descanso" || fichaje.tipo_fichaje === "fin_descanso") {
                contenidoDescansos += `<li>${textoFichaje} - ${fichaje.tipo_fichaje}</li>`;
            } else if (fichaje.tipo_fichaje === "entrada") {
                contenidoEntradas += `<li>${textoFichaje}</li>`;
            } else if (fichaje.tipo_fichaje === "salida") {
                contenidoSalidas += `<li>${textoFichaje}</li>`;
            }
        });

        // Actualizar los contenedores
        contenedorDescansos.html(contenidoDescansos || "No hay ningún descanso registrado");
        contenedorEntradas.html(contenidoEntradas || "No hay ninguna entrada registrada");
        contenedorSalidas.html(contenidoSalidas || "No hay ninguna salida registrada");
    }

    function actualizarNotificaciones() {
        $.ajax({
            url: "/api/solicitudes-pendientes",
            method: "GET",
            success: function (data) {
                if (data.pendientes.length > 0) {
                    $('#ico-users').addClass('fa-user-plus').removeClass('fa-users');
                    //$("#notificacion-solicitudes").text(data.pendientes.length).show();

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
                                // Si el usuario cancela la acción, registra un mensaje en la consola
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

                    // Mostrar el div al hacer clic en el enlace
                    $('#access-request-link').click(function () {
                        $('#div-solicitudes-acceso').show();
                    });

                    // Cerrar ventana al hacer clic en la "X"
                    $('#cerrar-solicitudes').click(function () {
                        $('#div-solicitudes-acceso').hide();
                    });

                } else {
                    $('#access-request-number').text('0').css("color", "inherit");
                    $('#ico-users').removeClass('fa-user-plus').addClass('fa-users');
                    //$("#notificacion-solicitudes").hide();
                    $('#div-solicitudes-acceso').hide();
                }
            },
            error: function (xhr) {
                console.error("Error al obtener las solicitudes pendientes:", xhr.responseText);
            }
        });
    }
    function actualizarEstado(userId, estado) {
        $.ajax({
            url: `/api/usuarios/${userId}/estado`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({ estado: estado }),
            success: function (data) {
                mostrarMensaje(data.message, '.exito-msg');

                // Elimina la solicitud de la lista
                $(`.solicitud[data-id="${userId}"]`).remove();
                actualizarNotificaciones();
                obtenerEmpleados();
                obtenerInactivos();
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
        $('#cerrar-solicitudes').click(function () {
            $('#div-solicitudes-acceso').hide();
        });
        $('#btn-enviar-invitacion').click(function (event) {
            event.preventDefault();
            let emailInvitado = $('#email-invitado').val();
            enviarInvitacion(emailInvitado);
        });
    });
    function enviarInvitacion(emailInvitado) {
        $.ajax({
            url: 'api/enviar-invitacion',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id_empresa: empresa.id_empresa,
                email: emailInvitado,
                nombre_empresa: empresa.nombre_empresa
            }),
            success: function (response) {
                if (response.showDialog) {
                    mostrarDialogo(response.message)
                        .then(() => {
                            // Si el usuario acepta, reenviar con reenviar: true
                            $.ajax({
                                url: 'api/enviar-invitacion',
                                method: 'POST',
                                contentType: 'application/json',
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
    $('#remove-employee-form').submit(function (event) {
        event.preventDefault();
        let rolUsuario = $("#seccion-perfil").attr("data-rol-usuario");
        if (!$('#changesMade').is(':checked')) {
            $('.form-check span').text("Marca la casilla para continuar").fadeIn(); // Muestra el mensaje
        
            
            setTimeout(function() {
                $('.form-check span').fadeOut();
            }, 2000);
            return;
        }
        if (rolUsuario === "maestro") {
            mostrarDialogo("Vas a eliminar la cuenta del administrador, esto borrará todos los datos de la empresa y todos sus empleados "
                + "Esta acción es irreversible")
                .then(() => {
                    let empresaId = $("#seccion-perfil").attr("data-id-empresa")

                    $.ajax({
                        url: `api/empresas/${empresaId}`,
                        method: 'DELETE',
                        contentType: "application/json",

                        success: function (response) {
                            mostrarMensaje(response.message, ".exito-msg");
                            window.location.href = response.redirect;
                        },
                        error: function (xhr) {
                            mostrarMensaje(xhr.responseJSON?.message || "Error al eliminar la empresa", '.error-msg');
                        }
                    });
                })
                .catch(() => {
                    console.log("Acción cancelada");
                });
        } else {
            mostrarDialogo("¿Eliminar esta cuenta de forma permanente? Esta acción es irreversible")
                .then(() => {
                    let userId = $("#seccion-perfil").attr("data-id-usuario");
                    $.ajax({
                        url: `api/usuarios/${userId}`,
                        method: 'delete',
                        contentType: "application/json",

                        success: function (response) {
                            mostrarMensaje(response.message, ".exito-msg");
                            $('#contenedor-principal').show();
                            $('#seccion-perfil').hide();
                        },
                        error: function (xhr) {
                            mostrarMensaje(xhr.responseJSON?.message || "Error al eliminar la cuenta de usuario", '.error-msg');
                        }
                    });
                })
                .catch(() => {
                    console.log("Acción cancelada");
                });
        }
    });

    $('#enlace-logout').click(function () {
        cerrarSesion();
    });

});

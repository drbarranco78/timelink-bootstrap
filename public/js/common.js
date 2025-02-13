let usuarioActivo = JSON.parse(localStorage.getItem('usuario'));
let empresa = JSON.parse(localStorage.getItem('empresa'));
// let idEmpresa;
let empleados = [];
let dataTable;
let selectorFecha;
let fechaSeleccionada;
let fechaHoy;


window.addEventListener('DOMContentLoaded', event => {
    window.obtenerFechaHora = function () {
        let fecha = new Date();
        let dia = String(fecha.getDate()).padStart(2, '0');
        let mes = String(fecha.getMonth() + 1).padStart(2, '0');
        let anio = fecha.getFullYear();

        // Formato yyyy-mm-dd para el selector de fecha
        fechaHoy = `${anio}-${mes}-${dia}`;

        // Establecer la fecha en el input
        $('#selector-fecha').val(fechaHoy);
        $('#selector-fecha').attr('max', fecha.toISOString().split("T")[0]);
        if (usuarioActivo.rol === "maestro") {
            $('#span-fecha').text("Mostrando datos de hoy");
        }
        // Convierte la fecha a un formato legible
        let opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);

        // Inserta la fecha en el HTML
        $('.fecha-actual').html("Hoy es " + fechaFormateada);

        // Función para actualizar el reloj
        window.actualizarReloj = function () {
            const fecha = new Date();
            const horas = String(fecha.getHours()).padStart(2, '0');
            const minutos = String(fecha.getMinutes()).padStart(2, '0');
            const segundos = String(fecha.getSeconds()).padStart(2, '0');
            const horaFormateada = `${horas}:${minutos}:${segundos}`;

            $('#hora').text(horaFormateada);
            return horaFormateada;
        }
        // Llamar a la función inmediatamente para mostrar la hora sin esperar 1 segundo
        actualizarReloj();
        // Actualizar el reloj cada segundo
        setInterval(actualizarReloj, 1000);
    }

    $(document).on('click', '.btn-ver-perfil', function () {
        let idEmpleado = $(this).data("id");
        console.log(idEmpleado);
        consultarEmpleado(idEmpleado);
    });

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
        $('#li-profile-edit').hide();
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

    window.consultarEmpleado = function (idEmpleado) {

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
        $('#li-profile-edit').show();
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
            $('#profile-status-change').off('click', '#change-status').on('click', '#change-status', function (event) {
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
                        if (usuarioActivo.rol === "maestro") {
                            obtenerEmpleados();
                        }

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
        consultarEmpleado(usuarioActivo.id);
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
    $('#remove-employee-form').submit(function (event) {
        event.preventDefault();
        let rolUsuario = $("#seccion-perfil").attr("data-rol-usuario");
        if (!$('#changesMade').is(':checked')) {
            $('.form-check span').text("Marca la casilla para continuar").fadeIn(); // Muestra el mensaje


            setTimeout(function () {
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


    $('#enlace-logout , #logo-timelink').click(function () {
        cerrarSesion();
    });
    function cerrarSesion() {
        mostrarDialogo("¿Cerrar la sesión y volver al inicio?")
            .then(() => {
                $.ajax({
                    url: '/api/logout',
                    method: 'POST',
                    success: function (response) {
                        localStorage.removeItem('usuario');
                        localStorage.removeItem('empresa');
                        // Redirigir a la página de login
                        window.location.href = '/';
                    },
                    error: function (xhr, status, error) {
                        console.log(xhr.responseText);
                        mostrarMensaje("Hubo un problema al cerrar sesión, por favor intente más tarde.", '.error-logout');
                    }
                });

            })
            .catch(() => {
                console.log("Acción cancelada");
            });

    }

    /**
     * Muestra un cuadro de diálogo de confirmación con una promesa.
     * @param {string} pregunta - La pregunta a mostrar en el cuadro de diálogo.
     * @returns {Promise} - Se resuelve si el usuario acepta, se rechaza si cancela.
     */
    window.mostrarDialogo = function (pregunta) {
        return new Promise((resolve, reject) => {
            const $dialogo = $('#confirmar-accion');

            // Mostrar el diálogo
            $dialogo.css("display", "flex");
            $dialogo.find('p').text(pregunta);

            // Evento para capturar clics fuera del diálogo
            $(document).on('mousedown', function (e) {
                if (!$(e.target).closest('#confirmar-accion').length) {
                    $dialogo.css("display", "none");
                    reject(); // Rechazar la promesa
                }
            });

            // Cuando el usuario hace clic en "Cancelar"
            $('#cancelar-accion').off('click').on('click', function () {
                $dialogo.css("display", "none");
                reject(); // Rechazar la promesa
            });

            // Cuando el usuario hace clic en "Aceptar"
            $('#aceptar-accion').off('click').on('click', function () {
                $dialogo.css("display", "none");
                resolve(); // Resolver la promesa
            });
        });
    }
    /**
     * Muestra un mensaje temporal en un elemento seleccionado, animándolo con fadeIn y fadeOut.
     * @param {string} mensaje - El mensaje a mostrar.
     * @param {string} selector - El selector del elemento donde mostrar el mensaje.
     */
    function mostrarMensaje(mensaje, selector) {
        $(selector).html(`<h3>${mensaje}</h3>`).fadeIn(500).delay(2000).fadeOut(500);
    }
});
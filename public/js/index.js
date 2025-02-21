// Expresión regular para validar el formato del email
const patronEmail = /^[a-zA-Z0-9._%+-]{1,40}@[a-zA-Z0-9.-]{2,20}\.[a-zA-Z]{2,}$/;
// Expresión regular para validar la contraseña (mínimo 8 caracteres, una mayúscula, una minúscula y un número)
const patronPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
// Expresión regular para validar el nombre (solo letras y espacios)
const patronNombre = /^(?=[A-Za-zñÑáéíóúÁÉÍÓÚ])[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{1,48}[A-Za-zñÑáéíóúÁÉÍÓÚ]$/;
// Expresión regular para validar el DNI o NIE
const patronDni = /^(?:\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/i;

let identificador;
let passwordLogin;
let empresas = [];
let idEmpresa;
let urlParams = new URLSearchParams(window.location.search);

// Captura los valores de los parámetros
let emailInvitado = urlParams.get('email');
let idEmpresaInvitado = urlParams.get('id_empresa');
let nombreEmpresaInvitado = urlParams.get('nombre_empresa');

$(document).ready(function () {
    cargarEmpresas();
});

// Se ejecuta después de la función asíncrona que carga las empresas en el selector
$(document).ajaxStop(function () {
    if (emailInvitado && idEmpresaInvitado && nombreEmpresaInvitado) {
        $('#profile-tab').remove();
        $('#myTab').css("width", "fit-content");
        $('#home-tab').text("Invitado");
        $('#employee-register').val("Acceder");
        $('#enlace-login').hide();       
        $("#employee-email").val(emailInvitado).prop('disabled', true);

        // Seleccionar la opción correspondiente al id_empresa
        $("#company-selection").val(idEmpresaInvitado).prop('disabled', true);
    }
});
function validarDniNie(dniNie) {
    const patronDNI = /^\d{8}[A-Z]$/;
    const patronNIE = /^[XYZ]\d{7}[A-Z]$/;
    
    // Si no cumple ninguno de los dos patrones, es inválido
    if (!patronDNI.test(dniNie) && !patronNIE.test(dniNie)) {
        return false;
    }

    // Si es un NIE, convertimos la letra inicial en un número
    let numero = dniNie
        .replace(/^X/, '0')
        .replace(/^Y/, '1')
        .replace(/^Z/, '2')
        .slice(0, -1); // Quitamos la letra final

    // Cálculo de la letra correcta
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const letraEsperada = letras[numero % 23];

    // Comprobar si la letra es correcta
    return dniNie.slice(-1) === letraEsperada;
}

/**
* Valida los campos del formulario de login
* @returns {boolean} true si los campos son válidos, false si hay errores
*/
function validarLogin() {
    identificador = $("input[name='dni']").val();
    passwordLogin = $("input[name='password']").val();
    // Valida el email y la contraseña
    if (patronDni.test(identificador) && patronPassword.test(passwordLogin)) {
        return true;
    } else {
        if (!patronDni.test(identificador)) {

            mostrarMensaje("Introduzca un número de identificador válido", ".error-msg");
        } else if (!patronPassword.test(passwordLogin)) {
            mostrarMensaje("La contraseña debe tener entre 8 y 20 caracteres, y al menos una mayúscula, una minúscula y un número", ".error-msg");
        }
        return false;
    }
}

/**
 * Muestra u oculta las contraseñas en el formulario de registro
 */
$('#mostrarPassword').click(function () {
    var passwordField = document.getElementById('current-password');
    var icon = this;

    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordField.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
});

/**
 * Envia el formulario de login
 * @param {Event} event - El evento de envío del formulario
 */
$("#btnLogin").click(function (event) {

    event.preventDefault();
    if (validarLogin()) {
        // Petición AJAX para autenticar
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: {
                dni: identificador,
                password: passwordLogin
            },
            success: function (response) {
                if (response.usuario.estado !== "aceptada") {
                    mostrarMensaje("El administrador de tu empresa aún no ha aceptado tu solicitud de unión, recibirás un email para informarte cuando lo haga", '.exito-msg');
                    return;
                }
                if (response.redirect) {
                    // Guardar datos del usuario en localStorage
                    localStorage.setItem('usuario', JSON.stringify(response.usuario));
                    // Guardar datos de la empresa                    
                    localStorage.setItem('empresa', JSON.stringify(response.empresa));

                    mostrarMensaje(response.message, '.exito-msg');

                    // Redirigir a la página correspondiente
                    window.location.href = response.redirect;
                } else {
                    mostrarMensaje(response.message, '.error-msg');
                }
            },
            error: function (xhr) {
                mostrarMensaje(xhr.responseJSON.message, '.error-msg');
            }
        });

    }
});

function cargarEmpresas() {
    $.ajax({
        url: '/api/empresas',
        method: 'GET',
        success: function (data) {
            // Guarda las empresas en una variable global
            empresas = data.array;
            let selectEmpresas = $("#company-selection");
            selectEmpresas.empty();

            // Agregar opción inicial (placeholder)
            selectEmpresas.append('<option class="hidden" selected disabled>Selecciona tu empresa</option>');

            // Rellenar con las empresas obtenidas del backend
            empresas.forEach(empresa => {
                selectEmpresas.append(`<option value="${empresa.id_empresa}">${empresa.nombre_empresa}</option>`);
            });
        },
        error: function (xhr) {
            mostrarMensaje(xhr.responseJSON.message, '.error-msg');
        }
    });
}
$("#company-selection").change(function () {
    idEmpresa = $(this).val();
});

/**
 * Función para validar el formulario de registro
 * @returns {boolean} true si todos los campos son válidos, false si hay errores
 */
function validarRegistro(datos) {

    let repetirPassword = datos["rol"] === "maestro" ? $("#admin-password2").val() : $("#employee-password2").val();

    // Validación del DNI/NIE
    if (datos["dni"] && !patronDni.test(datos["dni"])) {
        mostrarMensaje("El DNI o NIE no tiene un formato válido", ".error-msg");
        return false;
    }
    // Validación del nombre
    if (!patronNombre.test(datos["nombre"])) {
        mostrarMensaje("El campo Nombre no puede contener caracteres especiales ni espacios consecutivos, y debe tener una longitud entre 2 y 50", ".error-msg");
        return false;
    }

    // Validación del email
    if (datos["email"] && !patronEmail.test(datos["email"])) {
        mostrarMensaje("Introduzca una dirección de correo válida de 60 caracteres máximo", ".error-msg");
        return false;
    }

    // Validación de la contraseña
    if (datos["password"] && !patronPassword.test(datos["password"])) {
        mostrarMensaje("La contraseña debe tener entre 8 y 20 caracteres, y al menos una mayúscula, una minúscula y un número", ".error-msg");
        return false;
    }

    // Validación de la confirmación de la contraseña
    if (datos["password"] !== repetirPassword) {
        mostrarMensaje("La contraseña tiene que coincidir en los 2 campos", ".error-msg");
        return false;
    }

    return true;
}
$(".btnRegister").on("click", function (e) {
    e.preventDefault();

    if ($(this).attr("id") === "btnLogin") {
        return;
    }

    let datos = {};
    const rol = $(this).attr("id") === "employee-register" ? "empleado" : "maestro";
    let num_empresa = idEmpresa;
    if (rol === "empleado" && emailInvitado && idEmpresaInvitado) {
        datos = {
            dni: $('#employee-dni').val(),
            password: $("#employee-password1").val().trim(),
            nombre: $("#employee-name").val(),
            apellidos: $("#employee-surname").val(),
            email: $("#employee-email").val(),
            id_empresa: idEmpresaInvitado,
            cargo: $("#employee-job").val(),
            rol: rol,
            estado: "aceptada",
        };
        registrarUsuario(datos);
    } else if (rol === "empleado") {
        datos = {
            dni: $('#employee-dni').val(),
            password: $("#employee-password1").val().trim(),
            nombre: $("#employee-name").val(),
            apellidos: $("#employee-surname").val(),
            email: $("#employee-email").val(),
            id_empresa: num_empresa,
            cargo: $("#employee-job").val(),
            rol: rol,
            estado: "pendiente",
        };
        registrarUsuario(datos);
    } else {
        datos = {
            dni: $('#admin-dni').val(),
            password: $("#admin-password1").val().trim(),
            nombre: $("#admin-name").val(),
            apellidos: $("#admin-surname").val(),
            email: $("#admin-email").val(),
            empresa: $("#admin-company").val(),
            cargo: "Administrador",
            rol: rol,

        };
        if (!validarRegistro(datos)) {
            return;
        }
        let empresa = {
            nombre_empresa: $("#admin-company").val(),
            cif: $("#admin-cif").val(),
        };

        // Hacer un POST para crear la empresa
        $.ajax({
            url: '/api/empresas',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(empresa),
            success: function (response) {

                // Guardar datos de la empresa                    
                localStorage.setItem('empresa', JSON.stringify(response.empresa));
                // Obtener el id_empresa de la respuesta
                const idEmpresa = response.empresa.id_empresa;
                const datosAdmin = {
                    dni: $('#admin-dni').val(),
                    password: $("#admin-password1").val().trim(),
                    nombre: $("#admin-name").val(),
                    apellidos: $("#admin-surname").val(),
                    email: $("#admin-email").val(),
                    id_empresa: idEmpresa,
                    cargo: "Administrador",
                    rol: rol,
                    estado: "aceptada",
                };
                mostrarMensaje(response.message, '.exito-msg');
                // Registrar al usuario administrador
                registrarUsuario(datosAdmin);
            },
            error: function (xhr) {
                mostrarMensaje(xhr.responseJSON.message, '.error-msg');
            }
        });
    }

});

function solicitarUnion(datos) {
    if (!validarRegistro(datos)) {
        return;
    }
    idEmpresa = datos['id_empresa'];
    $.ajax({
        url: `/api/empresa/${idEmpresa}/maestro`,
        method: 'GET',
        success: function (response) {
            const emailMaestro = response.email;
            // Llama a la función para enviar el correo
            enviarCorreoSolicitud(datos, emailMaestro);
        },
        error: function (xhr) {
            mostrarMensaje(xhr.responseJSON.message, '.error-msg');
        }
    });
}

function enviarCorreoSolicitud(datos, emailMaestro) {
    console.log(emailMaestro);
    let datosCorreo = {
        nombre: datos['nombre'],
        apellidos: datos['apellidos'],
        dni: datos['dni'],
        email: emailMaestro
    };
    $.ajax({
        url: '/api/enviar-solicitud',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datosCorreo),
        success: function (data) {
            console.log('Correo enviado con éxito:', data.message);
            mostrarMensaje("Se ha enviado la solicitud al administrador de la empresa", '.exito-msg');

        },
        error: function (xhr) {
            mostrarMensaje(xhr.responseJSON.message, '.error-msg');
        }
    });
}

/**
 * Envia el formulario de registro
 * @param {Object} datos - Los datos del usuario a registrar
 */
function registrarUsuario(datos) {   

    if (validarRegistro(datos)) {
        $.ajax({
            url: '/api/usuarios',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datos),
            success: function (response) {
                mostrarMensaje(response.message, '.exito-msg');
                console.log(response);
                if (response.usuario.estado !== "aceptada") {
                    $("#register-form")[0].reset();
                    return;
                }
                if (response.redirect) {
                    localStorage.setItem('usuario', JSON.stringify(response.usuario));
                    
                    window.location.href = response.redirect;

                } else {
                    mostrarMensaje(response.error, '.error-msg');
                }
            },
            error: function (xhr) {
                mostrarMensaje(xhr.responseJSON.error, '.error-msg');
            }
        });
    }
}

/**
 * Muestra un mensaje temporal en un elemento seleccionado, animándolo con fadeIn y fadeOut.
 * @param {string} mensaje - El mensaje a mostrar.
 * @param {string} selector - El selector del elemento donde mostrar el mensaje.
 */
function mostrarMensaje(mensaje, selector) {
    $(selector).html(`<h3>${mensaje}</h3>`).fadeIn(500).delay(2000).fadeOut(500);
}

$("#enlace-login").click(function (event) {

    event.preventDefault();
    $(".register").css("display", "none");
    $("#login").fadeIn(1000).css("display", "block");

});

$("#enlace-registro").click(function (event) {

    event.preventDefault();
    $("#login").css("display", "none");
    $("#register").fadeIn(1000).css("display", "block");

});


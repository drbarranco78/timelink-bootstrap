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

$(document).ready(function () {
    cargarEmpresas();
});

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
            
            mostrarMensaje("Introduzca un número de identificador válido", ".error-login");
        } else if (!patronPassword.test(passwordLogin)) {
            mostrarMensaje("La contraseña debe tener entre 8 y 20 caracteres, y al menos una mayúscula, una minúscula y un número", ".error-login");
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
    $.ajax({
        url: '/api/enviar-solicitud',
        method: 'GET',
        success: function (data) {
            console.log('Correo enviado con éxito:', data.message);
            
        },
        error: function (xhr, status, error) {
            let mensajeError = "Hubo un problema con el servidor, por favor intente más tarde.";
            try {
                const respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message) {
                    mensajeError = respuesta.message; 
                }
            } catch (e) {
                console.error("Error al procesar la respuesta del servidor: ", e);
            }

            mostrarMensaje(mensajeError, '.error-login');
        }
    });
    

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
                if (response.redirect) {
                    console.log("Redirigiendo a:", response.redirect);
                    localStorage.setItem('usuario', JSON.stringify(response.usuario));
                    mostrarMensaje(response.message, '.exito-login');
                    window.location.href = response.redirect;
                } else {

                    mostrarMensaje(response.message, '.error-login');
                }
            },
            error: function (xhr, status, error) {
                let mensajeError = "Hubo un problema con el servidor, por favor intente más tarde.";
                try {
                    const respuesta = JSON.parse(xhr.responseText);
                    if (respuesta.message) {
                        mensajeError = respuesta.message; 
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta del servidor: ", e);
                }

                mostrarMensaje(mensajeError, '.error-login');
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
        error: function (xhr, status, error) {
            let mensajeError = "Hubo un problema con el servidor, por favor intente más tarde.";
            try {
                const respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message) {
                    mensajeError = respuesta.message; 
                }
            } catch (e) {
                console.error("Error al procesar la respuesta del servidor: ", e);
            }

            mostrarMensaje(mensajeError, '.error-login');
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
    if (!patronDni.test(datos["dni"])) {
        mostrarMensaje("El DNI o NIE no tiene un formato válido", ".error-login");
        return false;
    }
    // Validación del nombre
    if (!patronNombre.test(datos["nombre"])) {
        mostrarMensaje("El campo Nombre no puede contener caracteres especiales ni espacios consecutivos, y debe tener una longitud entre 2 y 50", ".error-login");
        return false;
    }

    // Validación del email
    if (!patronEmail.test(datos["email"])) {
        mostrarMensaje("Introduzca una dirección de correo válida de 60 caracteres máximo", ".error-login");
        return false;
    }

    // Validación de la contraseña
    if (!patronPassword.test(datos["password"])) {
        mostrarMensaje("La contraseña debe tener entre 8 y 20 caracteres, y al menos una mayúscula, una minúscula y un número", ".error-login");
        return false;
    }

    // Validación de la confirmación de la contraseña
    if (datos["password"] !== repetirPassword) {
        mostrarMensaje("La contraseña tiene que coincidir en los 2 campos", ".error-login");
        return false;
    }

    return true;
}
$(".btnRegister").on("click", function (e) {
    if ($(this).attr("id") === "btnLogin") {        
        return;
    }
    e.preventDefault();

    let datos = {};
    const rol = $(this).attr("id") === "employee-register" ? "empleado" : "maestro";
    let num_empresa = idEmpresa;
    console.log("Rol: " + rol);

    if (rol === "empleado") {
        console.log("ID de la empresa seleccionada al pulsar el boton: ", idEmpresa);
        datos = {
            dni: $('#employee-dni').val(),
            password: $("#employee-password1").val().trim(),
            nombre: $("#employee-name").val(),
            apellidos: $("#employee-surname").val(),
            email: $("#employee-email").val(),
            id_empresa: num_empresa,
            cargo: $("#employee-job").val(),
            rol: rol,
        };
        solicitarUnion(datos);
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
                // Obtener el id_empresa de la respuesta
                const idEmpresa = response.id_empresa;
                const datosAdmin = {
                    dni: $('#admin-dni').val(),
                    password: $("#admin-password1").val().trim(),
                    nombre: $("#admin-name").val(),
                    apellidos: $("#admin-surname").val(),
                    email: $("#admin-email").val(),
                    id_empresa: idEmpresa,
                    cargo: "Administrador",
                    rol: rol,
                };

                // Registrar al usuario administrador
                registrarUsuario(datosAdmin);
            },
            error: function (xhr, status, error) {
                let mensajeError = "Hubo un problema con el servidor.";
                try {
                    const respuesta = JSON.parse(xhr.responseText);
                    if (respuesta.error && respuesta.message) {
                        mensajeError = respuesta.message;
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta del servidor: ", e);
                }
        
                mostrarMensaje(mensajeError, '.error-login');
            }
        });
    }

});

function solicitarUnion(datos){
    if (!validarRegistro(datos)) {
        return;        
    }
    idEmpresa=datos['id_empresa'];
    $.ajax({
        url: `/api/empresa/${idEmpresa}/maestro`,
        method: 'GET',
        success: function (response) {
            const emailMaestro = response.email;

            // Llama a la función para enviar el correo
            enviarCorreoSolicitud(datos, emailMaestro);
        },
        error: function (xhr) {
            let mensajeError = "No se pudo obtener el email del maestro de la empresa.";
            try {
                const respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message) {
                    mensajeError = respuesta.message;
                }
            } catch (e) {
                console.error("Error al procesar la respuesta del servidor: ", e);
            }
            mostrarMensaje(mensajeError, '.error-login');
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
            mostrarMensaje("Se ha enviado la solicitud al administrador de la empresa", '.exito-login');
            
        },
        error: function (xhr, status, error) {
            let mensajeError = "Hubo un problema con el servidor, por favor intente más tarde.";
            try {
                const respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message) {
                    mensajeError = respuesta.message; 
                }
            } catch (e) {
                console.error("Error al procesar la respuesta del servidor: ", e);
            }
            console.log(mensajeError);
            mostrarMensaje(mensajeError, '.error-login');
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
                console.log(response);
                if (response.redirect) {
                    console.log("Redirigiendo a:", response.redirect);
                    localStorage.setItem('usuario', JSON.stringify(response.usuario));
                    mostrarMensaje(response.message, '.exito-login');
                    window.location.href = response.redirect;
                } else {
                    mostrarMensaje(response.message, '.error-login');
                }
            },
            error: function (xhr) {
                let mensajeError = "Hubo un problema al registrar el usuario.";
                try {
                    const respuesta = JSON.parse(xhr.responseText);
    
                    
                    if (respuesta.errors) {
                        mensajeError = Object.values(respuesta.errors).flat()[0]; 
                    } else if (respuesta.error) {
                        mensajeError = respuesta.error; 
                    }
                } catch (e) {
                    console.error("Error al procesar la respuesta del servidor: ", e);
                }
    
                mostrarMensaje(mensajeError, '.error-login');
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

$("#enlace-login, #pie-formularios-registro").click(function (event) {

    event.preventDefault();
    //if ($("#register").css("display") !== "none") {
    $(".register").css("display", "none"); // Oculta la sección de registro si está visible
    //}

    $("#login").fadeIn(1000).css("display", "block");

});

$("#enlace-registro, #pie-formularios-login").click(function () {

    event.preventDefault(); 
    //if ($("#login").css("display") !== "none") {
    $("#login").css("display", "none"); // Oculta la sección de registro si está visible
    //}

    $("#register").fadeIn(1000).css("display", "block");

});


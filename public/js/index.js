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

$(document).ready(function () {
    cargarEmpresas();
    console.log(patronPassword.test("Password1")); // Debería devolver true
console.log(patronPassword.test("password1")); // Debería devolver false (falta una mayúscula)
console.log(patronPassword.test("PASSWORD1")); // Debería devolver false (falta una minúscula)
console.log(patronPassword.test("Passw1"));    // Debería devolver false (menos de 8 caracteres)

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
            // Cambiamos el texto del div de error antes de mostrarlo
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
                        mensajeError = respuesta.message; // Extraer el mensaje si está disponible
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
            let selectEmpresas = $("#company-selection");
            selectEmpresas.empty();

            // Agregar opción inicial (placeholder)
            selectEmpresas.append('<option class="hidden" selected disabled>Selecciona tu empresa</option>');

            // Rellenar con las empresas obtenidas del backend
            data.array.forEach(empresa => {
                selectEmpresas.append(`<option value="${empresa.id_empresa}">${empresa.nombre_empresa}</option>`);
            });
        },
        error: function (xhr, status, error) {
            let mensajeError = "Hubo un problema con el servidor, por favor intente más tarde.";
            try {
                const respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message) {
                    mensajeError = respuesta.message; // Extraer el mensaje si está disponible
                }
            } catch (e) {
                console.error("Error al procesar la respuesta del servidor: ", e);
            }

            mostrarMensaje(mensajeError, '.error-login');
        }
    });
}


/**
 * Función para validar el formulario de registro
 * @returns {boolean} true si todos los campos son válidos, false si hay errores
 */
function validarRegistro(datos) {
    //fechaActual = new Date();
    // Obtener año, mes y día
    //let anio = fechaActual.getFullYear();
    //let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    //let dia = String(fechaActual.getDate()).padStart(2, '0');

    // Formatear la fecha como DD-MM-YYYY
    //fechaFormateada = `${dia}/${mes}/${anio}`;
    // dni = $("#dni").val();
    // nombre = $("#nombre").val();
    // emailRegistro = $("#email-registro").val();
    // password1 = $("#password1").val();
    // password2 = $("#password2").val();
    // nivel = $("#nivel").val();
    // fechaNac = $("#fechaNac").val();
    // let [anioNac, mesNac, diaNac] = fechaNac.split('-');
    // fechaNac = `${diaNac}/${mesNac}/${anioNac}`;
    // genero = $("input[name='genero']:checked").val();
    let repetirPassword= datos["rol"]==="maestro"?$("#admin-password2").val() : $("#employee-password2").val();

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
    e.preventDefault();

    let datos = {};
    const rol = $(this).attr("id") === "employee-register" ? "empleado" : "maestro";

    console.log("Rol: " + rol);

    if (rol === "empleado") {
        datos = {
            dni: $('#employee-dni').val(),
            password: $("#employee-password1").val().trim(),
            nombre: $("#employee-name").val(),
            apellidos: $("#employee-surname").val(),
            email: $("#employee-email").val(),
            empresa: $("#company-selection").val(),
            cargo: $("#employee-job").val(),
            rol: rol,
        };
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
    }

    console.log("DNI: " + datos.dni);
    console.log("Email: " + datos.email);
    console.log("Email: " + datos.password);

    // Enviar al backend
    registrarUsuario(datos);
});


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
                console.log('Success:', response);
                mostrarMensaje("Usuario registrado con éxito", ".exito-login");
                // Redirige al área privada
                setTimeout(function () {
                    window.location.href = 'private';
                }, 2000);
            },
            error: function (xhr) {
                console.error('Error:', xhr);
                if (xhr.status === 409) {
                    mostrarMensaje("El email ya está registrado", ".error-login");
                } else {
                    mostrarMensaje("Error en el registro. Por favor, inténtalo de nuevo", ".error-login");
                }
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

    event.preventDefault(); // Previene el comportamiento por defecto del enlace
    //if ($("#register").css("display") !== "none") {
    $(".register").css("display", "none"); // Oculta la sección de registro si está visible
    //}

    $("#login").fadeIn(1000).css("display", "block");

});

$("#enlace-registro, #pie-formularios-login").click(function () {

    event.preventDefault(); // Previene el comportamiento por defecto del enlace
    //if ($("#login").css("display") !== "none") {
    $("#login").css("display", "none"); // Oculta la sección de registro si está visible
    //}

    $("#register").fadeIn(1000).css("display", "block");

});


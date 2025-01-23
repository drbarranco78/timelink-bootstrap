// Expresión regular para validar el formato del email
const patronEmail = /^[a-zA-Z0-9._%+-]{1,40}@[a-zA-Z0-9.-]{2,20}\.[a-zA-Z]{2,}$/;
// Expresión regular para validar la contraseña (mínimo 8 caracteres, una mayúscula, una minúscula y un número)
const patronPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
// Expresión regular para validar el nombre (solo letras y espacios)
const patronNombre = /^(?=[A-Za-zñÑáéíóúÁÉÍÓÚ])[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{1,48}[A-Za-zñÑáéíóúÁÉÍÓÚ]$/;
// Expresión regular para validar el DNI o NIE
const patronDni = /^(?:\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/i;


/**
* Valida los campos del formulario de login
* @returns {boolean} true si los campos son válidos, false si hay errores
*/
function validarLogin() {
    identificador = $("#userid").val();
    passwordLogin = $("#current-password").val();
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
$("#formulario-login").submit(function (event) {
    
    event.preventDefault();
    if (validarLogin()) {
        // Obtenemos los valores del formulario
        var identificador = $("#userid").val(); // DNI
        var passwordLogin = $("#current-password").val(); // Contraseña

        // Petición AJAX para autenticar
        $.ajax({
            url: '/api/login', 
            method: 'POST',
            data: {
                dni: identificador,  
                password: passwordLogin
            },
            success: function(response) {
                if (response.redirect) {
                    console.log("Redirigiendo a:", response.redirect);
                    localStorage.setItem('usuario', JSON.stringify(response.usuario));
                    mostrarMensaje(response.message, '.exito-login');
                    window.location.href = response.redirect; 
                } else {
                    
                    mostrarMensaje(response.message, '.error-login');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error del servidor: ", xhr.responseText);
                mostrarMensaje("Hubo un problema con el servidor, por favor intente más tarde. " + xhr.responseText, '.error-login');
            }
        });

    }

});


/**
 * Muestra un mensaje temporal en un elemento seleccionado, animándolo con fadeIn y fadeOut.
 * @param {string} mensaje - El mensaje a mostrar.
 * @param {string} selector - El selector del elemento donde mostrar el mensaje.
 */
function mostrarMensaje(mensaje, selector) {
    $(selector).html(`<h3>${mensaje}</h3>`).fadeIn(500).delay(2000).fadeOut(500);
}


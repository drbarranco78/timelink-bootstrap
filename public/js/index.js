// Expresión regular para validar el formato del email
const patronEmail = /^[a-zA-Z0-9._%+-]{1,40}@[a-zA-Z0-9.-]{2,20}\.[a-zA-Z]{2,}$/;
// Expresión regular para validar la contraseña (mínimo 8 caracteres, una mayúscula, una minúscula y un número)
const patronPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
// Expresión regular para validar el nombre (solo letras y espacios)
const patronNombre = /^(?=[A-Za-zñÑáéíóúÁÉÍÓÚ])[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{1,48}[A-Za-zñÑáéíóúÁÉÍÓÚ]$/;
// Expresión regular para validar el DNI o NIE
const patronDni = /^(?:\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/i;

$("#enlace-login, #pie-formularios-registro").click(function (event) {

    event.preventDefault(); // Previene el comportamiento por defecto del enlace
    if ($(".registro").css("display") !== "none") {
        $(".registro").css("display", "none"); // Oculta la sección de registro si está visible
    }

    $(".login").fadeIn(1000).css("display", "block");

});

$("#enlace-registro, #pie-formularios-login").click(function () {

    $(".login").fadeOut(1000, function () {
        $(this).css("display", "none");
        $(".registro").fadeIn(1000); // Muestra la sección de registro
        $(".registro").css("display", "block");
    });
});

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
 * @param {number} numero - El número del campo de contraseña (1 o 2)
 */
$("#mostrarPassword1").click(function () {
    mostrarContrasena(1);
});
$("#mostrarPassword2").click(function () {
    mostrarContrasena(2);
});

/**
 * Función para mostrar u ocultar las contraseñas
 * @param {number} numero - El número del campo de contraseña (1 o 2)
 */
function mostrarContrasena(numero) {
    var contrasena = document.getElementById("contrasena" + numero);
    // Si la contraseña está oculta se muestra al pulsar el botón y viceversa
    if (contrasena.type == "password") {
        contrasena.type = "text";
    } else {
        contrasena.type = "password";
    }
}

/**
 * Función para validar el formulario de registro
 * @returns {boolean} true si todos los campos son válidos, false si hay errores
 */
function validarRegistro() {
    fechaActual = new Date();
    // Obtener año, mes y día
    let anio = fechaActual.getFullYear();
    let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    let dia = String(fechaActual.getDate()).padStart(2, '0');

    // Formatear la fecha como DD-MM-YYYY
    fechaFormateada = `${dia}/${mes}/${anio}`;
    dni = $("#dni").val();
    nombre = $("#nombre").val();
    emailRegistro = $("#email-registro").val();
    contrasena1 = $("#contrasena1").val();
    contrasena2 = $("#contrasena2").val();
    nivel = $("#nivel").val();
    fechaNac = $("#fechaNac").val();
    let [anioNac, mesNac, diaNac] = fechaNac.split('-');
    fechaNac = `${diaNac}/${mesNac}/${anioNac}`;
    genero = $("input[name='genero']:checked").val();

    // Validación del DNI/NIE
    if (!patronDni.test(dni)) {
        mostrarMensaje("El DNI o NIE no tiene un formato válido", ".error-registro");
        return false;
    }
    // Validación del nombre
    if (!patronNombre.test(nombre)) {
        mostrarMensaje("El campo Nombre no puede contener caracteres especiales ni espacios consecutivos, y debe tener una longitud entre 2 y 50", ".error-registro");
        return false;
    }

    // Validación del email
    if (!patronEmail.test(emailRegistro)) {
        mostrarMensaje("Introduzca una dirección de correo válida de 60 caracteres máximo", ".error-registro");
        return false;
    }

    // Validación de la contraseña
    if (!patronPassword.test(contrasena1)) {
        mostrarMensaje("La contraseña debe tener entre 8 y 20 caracteres, y al menos una mayúscula, una minúscula y un número", ".error-registro");
        return false;
    }

    // Validación de la confirmación de la contraseña
    if (contrasena1 !== contrasena2) {
        mostrarMensaje("La contraseña tiene que coincidir en los 2 campos", ".error-registro");
        return false;
    }

    return true;
}

/**
 * Envia el formulario de login
 * @param {Event} event - El evento de envío del formulario
 */
$("#formulario-login").submit(function (event) {
    event.preventDefault();
    if (validarLogin()){
        
    }
    
});

/**
 * Envia el formulario de Registro
 * @param {Event} event - El evento de envío del formulario
 */
$("#formulario-registro").submit(function (event) {
    event.preventDefault();
    validarRegistro();
});

/**
 * Muestra un mensaje temporal en un elemento seleccionado, animándolo con fadeIn y fadeOut.
 * @param {string} mensaje - El mensaje a mostrar.
 * @param {string} selector - El selector del elemento donde mostrar el mensaje.
 */
function mostrarMensaje(mensaje, selector) {
    $(selector).html(`<h3>${mensaje}</h3>`).fadeIn(500).delay(2000).fadeOut(500);
}


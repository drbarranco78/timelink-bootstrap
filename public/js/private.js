const $historialList = $('.lista-historial');
const $historialHeader = $('.historial h2');
const $mostrarHistorial = $('#mostrar-historial');
const $borrarHistorial = $('#borrar-historial');
let usuario = JSON.parse(localStorage.getItem('usuario'));
$('#mensaje-bienvenida h3').html("Trabajador: " + usuario.nombre + " " + usuario.apellidos);
$(document).ready(function () {
    
    // Obtener la fecha actual
    let fechaActual = new Date();

    // Extrae año, mes y día con métodos de Date
    let anio = fechaActual.getFullYear();
    let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    let dia = String(fechaActual.getDate()).padStart(2, '0');

    // Crea el objeto Date con el formato deseado
    fechaActual = new Date(`${anio}-${mes}-${dia}`);

    // Convierte la fecha a un formato legible
    let opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fechaFormateada = fechaActual.toLocaleDateString('es-ES', opcionesFecha);

    // Inserta la fecha en el HTML
    $('.fecha-actual').html(fechaFormateada);

    // Función para actualizar el reloj
    function actualizarReloj() {
        const fecha = new Date();
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        const segundos = String(fecha.getSeconds()).padStart(2, '0');
        const horaFormateada = `${horas}:${minutos}:${segundos}`;

        $('#hora').text(horaFormateada);
    }

    // Actualizar el reloj cada segundo
    setInterval(actualizarReloj, 1000);

    // Llamar a la función inmediatamente para mostrar la hora sin esperar 1 segundo
    actualizarReloj();
});

let fechaInicio;

// Al hacer clic en "Comenzar jornada"
$("#btn-comenzar").click(function () {
    mostrarDialogo("¿Comenzar la jornada?")
        .then(() => {
            // Si el usuario confirma la acción
            // Registrar la hora de inicio
            fechaInicio = new Date();
            const horaInicio = fechaInicio.toLocaleTimeString();
            agregarHistorial("Jornada Iniciada");
            // Actualizar mensaje de estado
            $(".mensaje-estado").html(`Jornada iniciada a las ${horaInicio}`);
            $('.historial h2').removeClass('d-none');
            // Ocultar "Comenzar jornada" y mostrar los otros botones
            $(this).addClass("d-none");
            $("#btn-detener").removeClass("d-none");
            $("#btn-descanso").removeClass("d-none");
            // Cambiar estado y color
            $("#estado").text("Trabajando")
                .removeClass("estado-descanso estado-fuera")
                .addClass("estado-trabajando");

            // Cambiar icono
            $("#icono-estado").attr("class", "fas fa-briefcase"); // Icono de "trabajando"
            registrarFichaje("entrada");
        })
        .catch(() => {
            // Si el usuario cancela la acción, registra un mensaje en la consola
            console.log("Acción cancelada");
        });
});

// Al hacer clic en "Detener jornada"
$("#btn-detener").click(function () {
    mostrarDialogo("¿Finalizar la jornada?")
        .then(() => {
            const fechaFin = new Date();
            const horaFin = fechaFin.toLocaleTimeString();
            agregarHistorial("Jornada detenida");
            // Actualizar mensaje de estado
            $(".mensaje-estado").html(`Jornada finalizada a las ${horaFin}`);

            // Restaurar el estado inicial de los botones
            $(this).addClass("d-none");
            $("#btn-descanso").addClass("d-none");
            $("#btn-terminar-descanso").addClass("d-none");
            $("#btn-comenzar").removeClass("d-none");
            // Cambiar estado y color
            $("#estado").text("Fuera del trabajo")
                .removeClass("estado-trabajando estado-descanso")
                .addClass("estado-fuera");

            // Cambiar icono
            $("#icono-estado").attr("class", "fas fa-times-circle");
            registrarFichaje("salida");
        })
        .catch(() => {
            console.log("Acción cancelada");
        });
});

// Al hacer clic en "Descanso"
$("#btn-descanso").click(function () {
    mostrarDialogo("¿Empezar un descanso?")
        .then(() => {
            // Registrar la hora de inicio del descanso
            descansoInicio = new Date();
            const horaDescanso = descansoInicio.toLocaleTimeString();
            agregarHistorial("Descanso iniciado");
            // Actualizar mensaje de estado
            $(".mensaje-estado").html(`Descanso iniciado a las ${horaDescanso}`);

            // Ocultar botón "Descanso" y mostrar "Terminar descanso"
            $(this).addClass("d-none");
            $("#btn-terminar-descanso").removeClass("d-none");
            // Cambiar estado y color
            $("#estado").text("En descanso")
                .removeClass("estado-trabajando estado-fuera")
                .addClass("estado-descanso");

            // Cambiar icono
            $("#icono-estado").attr("class", "fas fa-coffee"); // Icono de "descanso"
            registrarFichaje("inicio_descanso");
        })
        .catch(() => {
            // Si el usuario cancela la acción, registra un mensaje en la consola
            console.log("Acción cancelada");
        });

});

// Al hacer clic en "Terminar descanso"
$("#btn-terminar-descanso").click(function () {
    mostrarDialogo("¿Volver al trabajo?")
        .then(() => {
            const descansoFin = new Date();
            const horaDescansoFin = descansoFin.toLocaleTimeString();
            agregarHistorial("Descanso finalizado");
            // Actualizar mensaje de estado
            $(".mensaje-estado").html(`Descanso terminado a las ${horaDescansoFin}`);

            // Restaurar el estado inicial del descanso
            $(this).addClass("d-none");
            $("#btn-descanso").removeClass("d-none");
            $("#estado").text("Trabajando")
                .removeClass("estado-descanso estado-fuera")
                .addClass("estado-trabajando");

            // Cambiar icono
            $("#icono-estado").attr("class", "fas fa-briefcase");
            registrarFichaje("fin_descanso");

        })
        .catch(() => {
            // Si el usuario cancela la acción, registra un mensaje en la consola
            console.log("Acción cancelada");
        });

});

// Función para agregar un nuevo evento al historial con fecha, hora y mensaje
function agregarHistorial(mensaje) {
    const fecha = new Date();
    const fechaFormateada = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
    const $li = $('<li></li>').text(`[${fechaFormateada}] - ${mensaje}`);
    $historialList.append($li);
}

// Lógica para mostrar/ocultar el historial
$('#mostrar-historial').click(function () {
    if ($historialList.is(':visible')) {
        $historialList.slideUp();
        $mostrarHistorial.html('<i class="fas fa-eye"></i>');
    } else {
        $historialList.slideDown();
        $mostrarHistorial.html('<i class="fas fa-eye-slash"></i>');
    }
});

// Lógica para borrar el historial
$('#borrar-historial').click(function () {
    $historialList.html(''); // Borra todos los elementos de la lista
});

$('#cerrar-sesion').click(function () {
    $.ajax({
        url: '/api/logout',
        method: 'POST',
        success: function(response) {
            localStorage.removeItem('usuario');
            // Redirigir a la página de login
            window.location.href = '/';
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText); // Verifica el error detallado
            mostrarMensaje("Hubo un problema al cerrar sesión, por favor intente más tarde.", '.error-logout');
        }
    });
});

/**
 * Muestra un cuadro de diálogo de confirmación con una promesa.
 * @param {string} pregunta - La pregunta a mostrar en el cuadro de diálogo.
 * @returns {Promise} - Se resuelve si el usuario acepta, se rechaza si cancela.
 */
function mostrarDialogo(pregunta) {
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

function registrarFichaje(tipo){



}


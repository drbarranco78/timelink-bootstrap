const $historialList = $('.lista-historial');
const $historialHeader = $('.historial h2');
const $mostrarHistorial = $('#mostrar-historial');
const $borrarHistorial = $('#borrar-historial');
let empleado = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;
let hoy = new Date().toISOString().split('T')[0];
let segundosEntrada = 0;
let segundosDescanso = 0;
let intervaloEntrada, intervaloDescanso;
let fechaFichajes;
let ultimoFichaje;
let horaEntrada;

$(document).ready(function () {
    // $('#span-fecha').html("Trabajador: " + empleado.nombre + " " + empleado.apellidos);
    $('#mensaje-usuario').text(empleado.nombre + " " + empleado.apellidos);
    obtenerUltimoFichaje();

    //actualizarTablaFichajes();
    obtenerFichajesEmpleado(hoy);
    obtenerFechaHora();

});
$('#selector-fecha').change(function () {
    fechaFichajes = $(this).val();

    // Convertir la fecha al formato dd/mm/yyyy
    let partesFecha = fechaFichajes.split("-");
    let fechaFormateadaSeleccionada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    // Actualizar el texto del span
    $('#span-fecha').text(fechaHoy === fechaFichajes ? "Mostrando datos de hoy" : "Mostrando datos del día " + fechaFormateadaSeleccionada);
    console.log("Seleccionada " + fechaFichajes);

    obtenerFichajesEmpleado(fechaFichajes);
});
function obtenerFichajesEmpleado(fecha) {
    $.ajax({
        url: '/api/fichajes/fecha',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ fecha: fecha, id_usuario: empleado.id }),
        success: function (fichajes) {
            actualizarTablaFichajes(fichajes);
        },
        error: function (xhr, status, error) {
            console.log("Error al cargar los fichajes: " + (xhr.responseJSON?.message || error));
        }
    });
}

function actualizarTablaFichajes(fichajes) {
    // Destruir la instancia actual de DataTable si ya existe
    if ($.fn.DataTable.isDataTable('#tabla-fichajes')) {
        $('#tabla-fichajes').DataTable().destroy();
    }
    let tabla = $("#tabla-fichajes tbody");
    tabla.empty();
    fichajes.forEach(fichaje => {
        let fila = `<tr>
                    <td>${fichaje.tipo_fichaje}</td>
                    <td>${fichaje.fecha}</td>
                    <td>${fichaje.hora}</td>
                    <td>${fichaje.ubicacion}</td>                    
                </tr>`;
        tabla.append(fila);

    });

    // Volver a inicializar DataTable
    $('#tabla-fichajes').DataTable({
        language: {
            "url": "/js/es-ES.json"
        },
        responsive: true
    });
}

$(document).on("click", ".panel-fichaje", function (event) {
    event.preventDefault();

    let tipoFichaje = $(this).data("tipo");
    let mensaje = '';

    // Verifica entrada
    if (tipoFichaje === "entrada") {
        if (!$(this).hasClass('fichaje-activo')) {
            if (!$('.panel-fichaje[data-tipo="inicio_descanso"]').hasClass('fichaje-activo')) {
                mensaje = 'Iniciar la jornada?';
            } else {
                mensaje = '¿Terminar el descanso?';
                tipoFichaje = "fin_descanso";
            }
        }
        else {
            mostrarMensaje('Ya has iniciado la jornada hoy. Solo puedes fichar una vez la entrada al día', '.error-msg');
            return;
        }
    }

    // Verifica salida
    if (tipoFichaje === "salida") {

        if (!$(this).hasClass('fichaje-activo')) {
            if ($('.panel-fichaje[data-tipo="inicio_descanso"]').hasClass('fichaje-activo')) {
                mostrarMensaje('Tienes que terminar el descanso para finalizar la jornada', '.error-msg');
                return;
            }
            if ($('.panel-fichaje[data-tipo="entrada"]').hasClass('fichaje-activo')) {
                mensaje = 'Terminar la jornada?';
            } else {
                mostrarMensaje('Aún no has iniciado la jornada. Tienes que fichar la entrada para poder salir', '.error-msg');
                return;
            }
        } else {
            mostrarMensaje('Ya has terminado la jornada de hoy. Solo puedes fichar una vez la salida al día', '.error-msg');
            return;
        }
    }

    // Verifica descanso
    if (tipoFichaje === "inicio_descanso") {
        if (!$(this).hasClass('fichaje-activo')) {
            if ($('.panel-fichaje[data-tipo="entrada"]').hasClass('fichaje-activo')) {
                mensaje = '¿Iniciar un descanso?';
            } else {
                mostrarMensaje('Tienes que comenzar la jornada antes de empezar un descanso', '.error-msg');
                return;
            }
        } else {
            mensaje = '¿Terminar el descanso?';
            tipoFichaje = "fin_descanso";
        }
    }

    // Llama la función para registrar el fichaje
    registrarFichaje(tipoFichaje, mensaje, $(this));

});


/**
 * Función para registrar los datos de un fichaje
 * @param {string} tipo - Tipo de fichaje (entrada, salida, etc.)
 * 
 */
function registrarFichaje(tipo, mensaje, elemento) {
    mostrarDialogo(mensaje)
        .then(() => {
            // Obtener la fecha y hora actuales
            let fecha = new Date();
            let horas = String(fecha.getHours()).padStart(2, '0');
            let minutos = String(fecha.getMinutes()).padStart(2, '0');
            //let segundos = String(fecha.getSeconds()).padStart(2, '0');

            let fechaActual = fecha.toISOString().split('T')[0];
            let horaActual = `${horas}:${minutos}`;

            navigator.geolocation.getCurrentPosition(
                async position => {
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;

                    // Obtener la dirección de forma asíncrona
                    let ubicacion = await obtenerDireccion(lat, lng);
                    console.log("Ubicación para mandar: " + ubicacion);

                    // Realizar la solicitud AJAX con la ubicación
                    enviarFichaje(tipo, fechaActual, horaActual, ubicacion, elemento);
                },
                error => {
                    console.error("Error al obtener la ubicación: ", error);

                    // Registrar el fichaje sin ubicación
                    let ubicacion = "Ubicación no disponible";
                    enviarFichaje(tipo, fechaActual, horaActual, ubicacion, elemento);
                }
            );

        })
        .catch(() => {
            console.log("Acción cancelada");
        });
}

/**
 * Función para enviar los datos del fichaje al servidor
 * @param {string} tipo - Tipo de fichaje (entrada, salida, etc.)
 * @param {string} fecha - Fecha del fichaje en formato YYYY-MM-DD
 * @param {string} hora - Hora del fichaje en formato HH:mm:ss
 * @param {string} ubicacion - Ubicación o mensaje en caso de no obtenerla
 */
function enviarFichaje(tipo, fecha, hora, ubicacion, elemento) {
    $.ajax({
        url: '/api/fichajes',
        method: 'POST',
        data: {
            id_usuario: empleado.id,
            tipo_fichaje: tipo,
            fecha: fecha,
            hora: hora,
            ubicacion: ubicacion
        },
        success: function (response) {
            if (response.ok) {
                console.log(response.message);
                mostrarMensaje(response.message, '.exito-msg');
                // Eliminar la clase 'fichaje-activo' de todos los elementos
                $('.panel-fichaje').removeClass('fichaje-activo');
                if (tipo !== "fin_descanso") {
                    elemento.addClass('fichaje-activo');
                } else if (tipo === "fin_descanso") {
                    $('.panel-fichaje[data-tipo="entrada"]').addClass('fichaje-activo');
                }
                obtenerFichajesEmpleado($('#selector-fecha').val());
                actualizarDetalles(tipo);

            } else {
                mostrarMensaje(response.message, '.error-msg');
            }
        },
        error: function (xhr, status, error) {
            let mensajeError;
            try {
                let respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message) {
                    mensajeError = respuesta.message;
                }
            } catch (e) {
                console.error("Error al procesar la respuesta del servidor: ", e);
            }
            console.log(mensajeError || "Error al registrar el fichaje.");
            mostrarMensaje(mensajeError || "Error al registrar el fichaje.", '.error-msg');
        }
    });
}

function actualizarDetalles(tipo) {
    let hora = actualizarReloj();
    //let horaEntrada;
    if (tipo === "entrada") {
        //segundosEntrada = 0; 
        clearInterval(intervaloDescanso);
        intervaloEntrada = setInterval(contadorEntrada, 1000);
        $('#span-estado').text("Jornada iniciada a las " + hora);
        horaEntrada = hora;
    }
    if (tipo === "inicio_descanso") {
        //segundosDescanso = 0; 
        clearInterval(intervaloEntrada);
        intervaloDescanso = setInterval(contadorDescanso, 1000);
        $('#span-estado').text("Descanso iniciado a las " + hora);
    }
    if (tipo === "fin_descanso") {
        clearInterval(intervaloDescanso);
        intervaloEntrada = setInterval(contadorEntrada, 1000);
        $('#span-estado').text("Jornada iniciada a las " + horaEntrada);
    }
    if (tipo === "salida") {
        $('#detalles-salida').html("Hora de salida: " + hora);
        $('#span-estado').text("Jornada finalizada a las " + hora);
        clearInterval(intervaloEntrada);
        clearInterval(intervaloDescanso);
    }
}

function contadorEntrada() {
    segundosEntrada++;
    $('#detalles-entrada').html(formatearTiempo(segundosEntrada));
}

function contadorDescanso() {
    segundosDescanso++;
    $('#detalles-descanso').html(formatearTiempo(segundosDescanso));
}

function formatearTiempo(segundos) {
    let horas = Math.floor(segundos / 3600);
    let minutos = Math.floor((segundos % 3600) / 60);
    let segs = segundos % 60;

    return (
        String(horas).padStart(2, '0') + ":" +
        String(minutos).padStart(2, '0') + ":" +
        String(segs).padStart(2, '0')
    );
}

function obtenerUltimoFichaje() {
    $.ajax({
        url: '/api/fichajes/ultimo',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id_usuario: empleado.id }),
        success: function (fichaje) {
            $('#detalles-salida').text('');
            console.log("Último fichaje:", fichaje);
            let tiempoTranscurrido = calcularTiempoTranscurrido(fichaje.created_at);
            if (fichaje && fichaje.tipo_fichaje) {
                if (fichaje.tipo_fichaje === "entrada" || fichaje.tipo_fichaje === "fin_descanso") {
                    $('.panel-fichaje[data-tipo="entrada"]').addClass('fichaje-activo');
                    $('#span-estado').text("Jornada iniciada el " + formatearFecha(fichaje.created_at));
                    segundosEntrada = tiempoTranscurrido;
                    contadorEntrada();
                    intervaloEntrada = setInterval(contadorEntrada, 1000);
                } else if (fichaje.tipo_fichaje === "inicio_descanso") {
                    $('.panel-fichaje[data-tipo="inicio_descanso"]').addClass('fichaje-activo');
                    $('#span-estado').text("Descanso iniciado el " + formatearFecha(fichaje.created_at));
                    segundosDescanso = tiempoTranscurrido;
                    contadorDescanso();
                    intervaloDescanso = setInterval(contadorDescanso, 1000);
                } else if (fichaje.tipo_fichaje === "salida") {
                    $('.panel-fichaje[data-tipo="salida"]').addClass('fichaje-activo');
                    $('#span-estado, #detalles-salida').text("Jornada finalizada el " + formatearFecha(fichaje.created_at));
                    // $('#span-estado').text("Aún no has iniciado la jornada");
                }
            }
        },
        error: function (xhr) {
            console.log("Error al obtener el último fichaje: " + xhr.responseJSON?.mensaje);
        }
    });
}
// Función para calcular tiempo transcurrido desde el último fichaje
function calcularTiempoTranscurrido(fechaFichaje) {
    let fechaInicio = new Date(fechaFichaje); 
    let fechaActual = new Date();
    let diferenciaSegundos = Math.floor((fechaActual - fechaInicio) / 1000);
    return diferenciaSegundos > 0 ? diferenciaSegundos : 0;
}
function formatearFecha(fechaISO) {
    let fecha = new Date(fechaISO);

    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Enero es 0
    let año = fecha.getFullYear();
    let horas = String(fecha.getHours()).padStart(2, '0');
    let minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${año} a las ${horas}:${minutos}`;
}


async function obtenerDireccion(lat, lng) {
    // Obtiene la dirección de Openstreetmap a partir de las coordenadas
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Concatena la dirección y la devuelve     
        if (data.address) {
            let direccion = [
                (data.address.road ? data.address.road + ', ' : '') +
                (data.address.city || data.address.town || data.address.village || ''),
                data.address.province || '',
                data.address.state || data.address.region || '',
            ].filter(Boolean).join(', ');

            return direccion;
        } else {
            console.error("No se encontró una dirección para estas coordenadas.");
            return '';
        }
    } catch (error) {
        console.error("Error al llamar a la API de Openstreetmap", error);
        return '';
    }
}



// // Función para agregar un nuevo evento al historial con fecha, hora y mensaje
// function agregarHistorial(mensaje) {
//     const fecha = new Date();
//     const fechaFormateada = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
//     const $li = $('<li></li>').text(`[${fechaFormateada}] - ${mensaje}`);
//     $historialList.append($li);
// }

// // Lógica para mostrar/ocultar el historial
// $('#mostrar-historial').click(function () {
//     if ($historialList.is(':visible')) {
//         $historialList.slideUp();
//         $mostrarHistorial.html('<i class="fas fa-eye"></i>');
//     } else {
//         $historialList.slideDown();
//         $mostrarHistorial.html('<i class="fas fa-eye-slash"></i>');
//     }
// });

// // Lógica para borrar el historial
// $('#borrar-historial').click(function () {
//     $historialList.html(''); // Borra todos los elementos de la lista
// });


// Al hacer clic en "Detener jornada"
// $("#btn-detener").click(function () {
//     mostrarDialogo("¿Finalizar la jornada?")
//         .then(() => {
//             const fechaFin = new Date();
//             const horaFin = fechaFin.toLocaleTimeString();
//             agregarHistorial("Jornada detenida");
//             // Actualizar mensaje de estado
//             $(".mensaje-estado").html(`Jornada finalizada a las ${horaFin}`);

//             // Restaurar el estado inicial de los botones
//             $(this).addClass("d-none");
//             $("#btn-descanso").addClass("d-none");
//             $("#btn-terminar-descanso").addClass("d-none");
//             $("#btn-comenzar").removeClass("d-none");
//             // Cambiar estado y color
//             $("#estado").text("Fuera del trabajo")
//                 .removeClass("estado-trabajando estado-descanso")
//                 .addClass("estado-fuera");

//             // Cambiar icono
//             $("#icono-estado").attr("class", "fas fa-times-circle");
//             registrarFichaje("salida");
//         })
//         .catch(() => {
//             console.log("Acción cancelada");
//         });
// });

// // Al hacer clic en "Descanso"
// $("#btn-descanso").click(function () {
//     mostrarDialogo("¿Empezar un descanso?")
//         .then(() => {
//             // Registrar la hora de inicio del descanso
//             descansoInicio = new Date();
//             const horaDescanso = descansoInicio.toLocaleTimeString();
//             agregarHistorial("Descanso iniciado");
//             // Actualizar mensaje de estado
//             $(".mensaje-estado").html(`Descanso iniciado a las ${horaDescanso}`);

//             // Ocultar botón "Descanso" y mostrar "Terminar descanso"
//             $(this).addClass("d-none");
//             $("#btn-terminar-descanso").removeClass("d-none");
//             // Cambiar estado y color
//             $("#estado").text("En descanso")
//                 .removeClass("estado-trabajando estado-fuera")
//                 .addClass("estado-descanso");

//             // Cambiar icono
//             $("#icono-estado").attr("class", "fas fa-coffee"); // Icono de "descanso"
//             registrarFichaje("inicio_descanso");
//         })
//         .catch(() => {
//             // Si el usuario cancela la acción, registra un mensaje en la consola
//             console.log("Acción cancelada");
//         });

// });

// // Al hacer clic en "Terminar descanso"
// $("#btn-terminar-descanso").click(function () {
//     mostrarDialogo("¿Volver al trabajo?")
//         .then(() => {
//             const descansoFin = new Date();
//             const horaDescansoFin = descansoFin.toLocaleTimeString();
//             agregarHistorial("Descanso finalizado");
//             // Actualizar mensaje de estado
//             $(".mensaje-estado").html(`Descanso terminado a las ${horaDescansoFin}`);

//             // Restaurar el estado inicial del descanso
//             $(this).addClass("d-none");
//             $("#btn-descanso").removeClass("d-none");
//             $("#estado").text("Trabajando")
//                 .removeClass("estado-descanso estado-fuera")
//                 .addClass("estado-trabajando");

//             // Cambiar icono
//             $("#icono-estado").attr("class", "fas fa-briefcase");
//             registrarFichaje("fin_descanso");

//         })
//         .catch(() => {
//             // Si el usuario cancela la acción, registra un mensaje en la consola
//             console.log("Acción cancelada");
//         });

// });



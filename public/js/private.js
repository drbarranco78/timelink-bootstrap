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
let horaEntrada = 0;
let fechaUltimoFichaje;
let duracion, comentarios;
let tiempoTrabajado = 0;
let tiempoDescanso = 0;
let tiempoTotalDesdeEntrada = 0;

$(document).ready(function () {
    $('#mensaje-usuario').text(empleado.nombre + " " + empleado.apellidos);
    obtenerFichajesHoy();

    //actualizarTablaFichajes();
    obtenerFichajesEmpleado(hoy);
    obtenerFechaHora();
    //obtenerTiemposEmpleado();

});
$(document).on('click', '#cerrar-modal', function () {
    $('#div-registro-ubicacion').hide();
});



function obtenerTiemposEmpleado() {
    $.ajax({
        url: '/api/fichajes/tiempos',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        data: JSON.stringify({
            id_usuario: empleado.id,
        }),
        success: function (tiempos) {
            console.log('Tiempo trabajado:', tiempos.trabajo + 'Tiempo de descanso:', tiempos.descanso);
        },
        error: function (xhr, status, error) {
            console.log("Error al cargar los datos: " + (xhr.responseJSON?.message || error));
        }

    })

}
$('#selector-fecha').change(function () {
    fechaFichajes = $(this).val();
    // Actualizar el texto del span
    $('#span-fecha').text(fechaHoy === fechaFichajes ? "Mostrando datos de hoy" : "Mostrando datos del día " + formatearFecha(fechaFichajes));
    obtenerFichajesEmpleado(fechaFichajes);
});
function obtenerFichajesEmpleado(fecha) {
    console.log("Id de la empresa para filtrar por fecha " + empresa.id_empresa);
    $.ajax({
        url: '/api/fichajes/fecha',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        data: JSON.stringify({ fecha: fecha, id_usuario: empleado.id, id_empresa: empresa.id_empresa }),
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
        let fechaFormateada = formatearFecha(fichaje.fecha);
        let fila = `<tr>
                    <td>${fichaje.tipo_fichaje}</td>
                    <td>${fechaFormateada}</td>
                    <td>${fichaje.hora}</td>
                    <td>${fichaje.ubicacion}</td>                    
                </tr>`;
        tabla.append(fila);
    });
    // Volver a inicializar DataTable
    $('#tabla-fichajes').DataTable({
        language: {
            "url": "/js/Es-es.json"
        },
        responsive: true
    });
}
function obtenerFechaSinHora(fecha) {
    return new Date(fecha).toISOString().split('T')[0];
}
$(document).on("click", ".panel-fichaje", function (event) {
    event.preventDefault();
    let tipoFichaje = $(this).data("tipo");
    let mensaje = '';

    // Verifica entrada
    if (tipoFichaje === "entrada") {

        // Asegura que sólo se fiche la entrada una vez al día  (COMENTADO PARA PRUEBAS)

        // if (hoy == fechaUltimoFichaje) {
        //     mostrarMensaje('Ya has terminado la jornada hoy. Solo puedes fichar una vez la entrada al día', '.error-msg');
        //     return;
        // }

        if (!$(this).hasClass('fichaje-activo')) {
            if (!$('.panel-fichaje[data-tipo="inicio_descanso"]').hasClass('fichaje-activo')) {
                mensaje = 'Iniciar la jornada?';
            } else {
                mensaje = '¿Terminar el descanso?';
                tipoFichaje = "fin_descanso";
            }
        } else {
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
    registrarFichaje(tipoFichaje, mensaje, $(this), comentarios);
});
$(document).on("click", "#location-register", function (event) {
    event.preventDefault();
    $('#div-registro-ubicacion').show();

});
$(document).on('click', '#btn-registrar-ubicacion', function (event) {
    event.preventDefault();
    if (!$('.panel-fichaje[data-tipo="entrada"]').hasClass('fichaje-activo')) {
        mostrarMensaje('No puedes registrar el fichaje sin iniciar la jornada ni en medio de un descanso', '.error-msg');
        return;
    }
    comentarios = $('#input-comentarios').val();
    mensaje = '¿Registrar tu ubicación?';
    tipoFichaje = "registro";
    registrarFichaje(tipoFichaje, mensaje, null, comentarios);

});

/**
 * Función para registrar los datos de un fichaje
 * @param {string} tipo - Tipo de fichaje (entrada, salida, etc.)
 * 
 */
function registrarFichaje(tipo, mensaje, elemento, comentarios) {
    mostrarDialogo(mensaje)
        .then(() => {
            // Obtener la fecha y hora actuales
            let fecha = new Date();
            let horas = String(fecha.getHours()).padStart(2, '0');
            let minutos = String(fecha.getMinutes()).padStart(2, '0');
            let segundos = String(fecha.getSeconds()).padStart(2, '0');

            let fechaActual = fecha.toISOString().split('T')[0];
            let horaActual = `${horas}:${minutos}:${segundos}`;

            navigator.geolocation.getCurrentPosition(
                async position => {
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;

                    // Obtener la dirección de forma asíncrona
                    let ubicacionCompleta = await obtenerDireccion(lat, lng);
                    let ubicacion = ubicacionCompleta.direccion;
                    let ciudad = ubicacionCompleta.ciudad;

                    // Realizar la solicitud AJAX con la ubicación
                    enviarFichaje(tipo, fechaActual, horaActual, ubicacion, ciudad, lat, lng, duracion, comentarios, elemento);
                },
                error => {
                    console.error("Error al obtener la ubicación: ", error);

                    // Registrar el fichaje sin ubicación
                    let ubicacion = "Ubicación no disponible";
                    let ciudad = "Ciudad no disponible";
                    enviarFichaje(tipo, fechaActual, horaActual, ubicacion, ciudad, 0, 0, elemento);
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
function enviarFichaje(tipo, fecha, hora, ubicacion, ciudad, lat, lng, duracion = null, comentarios = null, elemento) {
    console.log("Hora para mandar: " + hora);
    $.ajax({
        url: '/api/fichajes',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        data: {
            id_usuario: empleado.id,
            tipo_fichaje: tipo,
            fecha: fecha,
            hora: hora,
            ubicacion: ubicacion,
            ciudad: ciudad,
            latitud: lat,
            longitud: lng,
            duracion: duracion,
            comentarios: comentarios
        },
        success: function (response) {
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
        },
        error: function (xhr) {
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
        $('#detalles-salida').empty();
        //segundosEntrada = 0; 
        clearInterval(intervaloDescanso);
        intervaloEntrada = setInterval(contadorEntrada, 1000);
        $('#span-estado').text("Jornada iniciada a las " + hora);

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
        //horaEntrada = hora;
        $('#span-estado').text("Jornada reanudada a las " + hora);
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

function obtenerFichajesHoy() {
    $.ajax({
        url: '/api/fichajes/fecha',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        
        data: JSON.stringify({
            id_usuario: empleado.id,
            fecha: hoy,
            id_empresa: empresa.id_empresa
        }),
        success: function (fichajes) {
            if (fichajes && fichajes.length > 0) {
                // El array ya está ordenado, así que el último fichaje es el más reciente
                ultimoFichaje = fichajes[fichajes.length - 1];
                console.log("Último fichaje:", ultimoFichaje);

            } else {
                console.log("No hay fichajes para la fecha:", hoy);
                return;
            }
            fichajes.forEach(fichaje => {
                if (fichaje.tipo_fichaje === "entrada") {
                    tiempoTrabajado = fichaje.duracion;
                    tiempoTotalDesdeEntrada = calcularTiempoTranscurrido(fichaje.hora);
                    console.log("Tiempo total desde entrada: " + tiempoTotalDesdeEntrada);
                }
                if (fichaje.tipo_fichaje === "fin_descanso") {
                    tiempoDescanso += fichaje.duracion;
                }
            })
            $('#detalles-salida').text('');

            let tiempoTranscurrido = calcularTiempoTranscurrido(ultimoFichaje.hora);
            if (ultimoFichaje && ultimoFichaje.tipo_fichaje) {
                if (ultimoFichaje.tipo_fichaje === "entrada" || ultimoFichaje.tipo_fichaje === "fin_descanso") {
                    $('.panel-fichaje[data-tipo="entrada"]').addClass('fichaje-activo');
                    $('#span-estado').text("Jornada iniciada el " + formatearFechaYhora(ultimoFichaje.created_at));
                    console.log("Tiempo de descanso: " + tiempoDescanso);
                    segundosDescanso = tiempoDescanso;
                    contadorDescanso();
                    segundosEntrada = tiempoTotalDesdeEntrada - tiempoDescanso;
                    contadorEntrada();
                    intervaloEntrada = setInterval(contadorEntrada, 1000);
                } else if (ultimoFichaje.tipo_fichaje === "inicio_descanso") {
                    $('.panel-fichaje[data-tipo="inicio_descanso"]').addClass('fichaje-activo');
                    $('#span-estado').text("Descanso iniciado el " + formatearFechaYhora(ultimoFichaje.created_at));
                    console.log("Tiempo trabajado: " + tiempoTrabajado);
                    segundosEntrada = tiempoTrabajado;
                    contadorEntrada();
                    segundosDescanso = tiempoTranscurrido;
                    contadorDescanso();
                    intervaloDescanso = setInterval(contadorDescanso, 1000);
                } else if (ultimoFichaje.tipo_fichaje === "salida") {
                    $('.panel-fichaje[data-tipo="salida"]').addClass('fichaje-activo');
                    $('#span-estado, #detalles-salida').text("Jornada finalizada el " + formatearFechaYhora(ultimoFichaje.created_at));
                    fechaUltimoFichaje = ultimoFichaje.fecha;
                    // $('#span-estado').text("Aún no has iniciado la jornada");
                }
            }
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                console.warn(xhr.responseJSON?.mensaje);
                $('#span-estado').text("Aún no has iniciado la jornada");
            } else {
                console.error("Error al obtener el último fichaje: " + xhr.responseJSON?.mensaje);
            }
        }
    });
}
// Función para calcular tiempo transcurrido desde el último fichaje
function calcularTiempoTranscurrido(fechaFichaje) {
    if (!fechaFichaje || !/^\d{2}:\d{2}:\d{2}$/.test(fechaFichaje)) {
        throw new Error("Formato de hora inválido. Debe ser HH:mm:ss");
    }
    let fechaActual = new Date();
    console.log("Fecha actual:", fechaActual);

    let fechaInicio = new Date(`${fechaActual.toISOString().split('T')[0]}T${fechaFichaje}Z`);
    console.log("Fecha de inicio:", fechaInicio);

    if (fechaInicio > fechaActual) {
        fechaInicio.setDate(fechaInicio.getDate() - 1);
        console.log("Fecha de inicio ajustada:", fechaInicio);
    }

    let diferenciaSegundos = Math.floor((fechaActual - fechaInicio) / 1000);
    console.log("Diferencia en segundos:", diferenciaSegundos);

    return diferenciaSegundos > 0 ? diferenciaSegundos : 0;
}
function formatearFechaYhora(fechaISO) {
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

            ].filter(Boolean).join(', ');


            let ciudad = data.address.province ||
                data.address.state || data.address.region || '';

            return { direccion, ciudad };
        } else {
            console.error("No se encontró una dirección para estas coordenadas.");
            return '';
        }
    } catch (error) {
        console.error("Error al llamar a la API de Openstreetmap", error);
        return '';
    }
}





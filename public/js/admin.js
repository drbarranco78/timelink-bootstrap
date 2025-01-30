let admin = JSON.parse(localStorage.getItem('usuario'));
let empresa = JSON.parse(localStorage.getItem('empresa'));
let idEmpresa;
let empleados = [];
let dataTable;
window.addEventListener('DOMContentLoaded', event => {

    if (empresa) {
        $('#nombre-empresa').html(empresa.nombre_empresa);
        idEmpresa = empresa.id_empresa;
    }
    $.ajax({
        url: `/api/empresa/${idEmpresa}/usuarios`,
        method: 'GET',
        success: function (response) {
            empleados = response; // Guardamos los empleados en la variable
            console.log("Lista de empleados:", empleados);

            // Llenar la tabla con los empleados
            actualizarTablaEmpleados(empleados);
        },
        error: function (xhr) {
            mostrarMensaje(xhr.responseJSON.message, '.error-login');
        }
    });

    function actualizarTablaEmpleados(empleados) {
        dataTable = new DataTable('#example', {
            language: {
                "url": "/js/es-ES.json"
            },
            responsive: true
        });

        let tabla = $("#example tbody");
        tabla.empty(); // Limpiamos la tabla antes de insertar datos

        empleados.forEach(empleado => {
            if (empleado.rol === "empleado") {
                let fila = `<tr>
                        <td>${empleado.nombre}</td>
                        <td>${empleado.apellidos}</td>
                        <td>${empleado.dni}</td>
                        <td>${empleado.email}</td>
                        <td>${empleado.cargo}</td>
                        <td>${empleado.created_at}</td>
                    </tr>`;
                tabla.append(fila);
            }
        });
        // tabla.clear().draw();
        // table.ajax.reload();

    }

    $('#enlace-perfil , #perfil-empresa').click(function () {
        $('#contenedor-principal').hide();
        $('#seccion-perfil').show();
        
    });
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
        detalles.slideToggle();

        // Alternar icono
        icono.toggleClass("fa-angle-down fa-angle-up");
    });
    

});

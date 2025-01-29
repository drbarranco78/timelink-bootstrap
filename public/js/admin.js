let admin = JSON.parse(localStorage.getItem('usuario'));
let empresa = JSON.parse(localStorage.getItem('empresa'));
let idEmpresa;
let empleados = [];
let dataTable;
window.addEventListener('DOMContentLoaded', event => {
    const datatablesSimple = document.getElementById('datatablesSimple');

    if (datatablesSimple) {
        dataTable = new simpleDatatables.DataTable(datatablesSimple, {
            language: {
                url: '//cdn.datatables.net/plug-ins/2.2.1/i18n/es-ES.json',
            }
        });
    }
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
            let tabla = $("#datatablesSimple tbody");
            tabla.empty(); // Limpiamos la tabla antes de insertar datos

            empleados.forEach(empleado => {
                let fila = `<tr>
                        <td>${empleado.nombre}</td>
                        <td>${empleado.apellidos}</td>
                        <td>${empleado.dni}</td>
                        <td>${empleado.email}</td>
                        <td>${empleado.cargo}</td>
                        <td>${empleado.created_at}</td>
                    </tr>`;
                tabla.append(fila);
            });
            dataTable.update();
        }

    });

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>Panel de control - Timelink</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/style.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('css/private.css') }}">
    <link rel="stylesheet" href="{{ asset('css/index.css') }}">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">

    <link rel="stylesheet" href="{{ asset('css/bootstrap-icons.css') }}">
    <link rel="stylesheet" href="{{ asset('css/boxicons.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/quill.snow.css') }}">
    <link rel="stylesheet" href="{{ asset('css/quill.bubble.css') }}">
    <link rel="stylesheet" href="{{ asset('css/remixicon.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style2.css') }}">
    <link rel="stylesheet" href="{{ asset('css/common.css') }}">




    <link rel="stylesheet" href="https://cdn.datatables.net/2.2.1/css/dataTables.bootstrap5.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/3.0.3/css/responsive.bootstrap5.css">

    <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
</head>

<body class="sb-nav-fixed">
    <nav class="sb-topnav heigth100 navbar navbar-expand navbar-dark bg-dark">
        <!-- Navbar Brand-->


        <!-- <a class="navbar-brand ps-3" href="index.html">Start Bootstrap</a> -->
        <!-- Sidebar Toggle-->
        <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i
                class="fas fa-bars"></i></button>
        <img id="logo-timelink" class="logo-timelink" src="img/timelink.webp" alt="">
        <div class="reloj">
            <i class="fas fa-clock"></i>
            <span id="hora"></span>
        </div>
        <!-- Navbar Search-->
        <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">

            <div class="input-group">
                <h3 id="mensaje-usuario"></h3>

            </div>
        </form>
        <!-- Navbar-->
        <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button"
                    data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a id="enlace-perfil" class="dropdown-item" href="#!">Mi Perfil</a></li>
                    {{-- <li><a class="dropdown-item" href="#!">Activity Log</a></li> --}}
                    <li>
                        <hr class="dropdown-divider" />
                    </li>
                    <li><a id="enlace-logout" class="dropdown-item" href="#!">Logout</a></li>
                </ul>
            </li>
        </ul>
    </nav>
    <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
            <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div class="sb-sidenav-menu">
                    <div class="nav">
                        <div class="sb-sidenav-menu-heading"></div>
                        <a id="dashboard-inicio" class="nav-link" href="#">
                            <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                            Panel de fichajes
                        </a>
                        <div class="sb-sidenav-menu-heading">Interface</div>
                        <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                            data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                            <div class="sb-nav-link-icon"><i class="fa-solid fa-building"></i></div>
                            Empresa
                            <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                        </a>
                        <div class="collapse" id="collapseLayouts" aria-labelledby="headingOne"
                            data-bs-parent="#sidenavAccordion">
                            <nav class="sb-sidenav-menu-nested nav">
                                <a id="perfil-empresa" class="nav-link" href="#">Datos de la empresa</a>
                                {{-- <a class="nav-link" href="layout-sidenav-light.html">Light Sidenav</a> --}}
                            </nav>
                        </div>

                        <div class="collapse" id="collapsePages" aria-labelledby="headingTwo"
                            data-bs-parent="#sidenavAccordion">
                            <nav class="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">

                                <a id="link-excluded" class="nav-link collapsed" href="#"
                                    data-bs-toggle="collapse" data-bs-target="#pagesCollapseError"
                                    aria-expanded="false" aria-controls="pagesCollapseError">
                                    Inactivos<span id="excluded-number"></span>
                                    <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                                </a>
                                <a id="link-send-invitation" class="nav-link collapsed" href="#"
                                    data-bs-toggle="collapse" data-bs-target="#pagesCollapseError"
                                    aria-expanded="false" aria-controls="pagesCollapseError">
                                    Enviar Invitación
                                    <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                                </a>

                            </nav>
                        </div>
                        {{-- <div class="sb-sidenav-menu-heading">Addons</div> --}}
                        <a id="location-register" class="nav-link" href="#">
                            <div class="sb-nav-link-icon"><i class="fas fa-location"></i></div>
                            Registrar ubicación
                        </a>

                    </div>
                </div>
                <div class="sb-sidenav-footer">
                    <div class="small">Conectado como:</div>
                    Empleado
                </div>
            </nav>
        </div>
        <div id="layoutSidenav_content">
            <main>
                <section id="seccion-perfil" class="section profile">
                    <h3>Perfil</h3>
                    <div class="row">
                        <div class="col-xl-4">
                            <div class="card">
                                <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
                                    <img src="img/ico_usuario_activo.png" alt="Profile" class="rounded-circle">
                                    <h2>Daniel Rodríguez</h2>
                                    <h3>Web Designer</h3>
                                    <div class="social-links mt-2">
                                        <a href="#" class="twitter"><i class="bi bi-twitter"></i></a>
                                        <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
                                        <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
                                        <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></a>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="col-xl-8">

                            <div class="card">
                                <div class="card-body pt-3">
                                    <!-- Bordered Tabs -->
                                    <ul class="nav nav-tabs nav-tabs-bordered">

                                        <li class="nav-item">
                                            <button class="nav-link active" data-bs-toggle="tab"
                                                data-bs-target="#profile-overview">Resumen</button>
                                        </li>

                                        <li id="li-profile-edit" class="nav-item">
                                            <button class="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#profile-edit">Editar Perfil</button>
                                        </li>


                                        <li id="li-change-password" class="nav-item">
                                            <button class="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#profile-change-password">Cambiar Password</button>
                                        </li>

                                        {{-- <li id="status-change" class="nav-item">
                                            <button class="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#profile-status-change">Cambiar Estado</button>
                                        </li> --}}


                                        <li id="delete-user" class="nav-item">
                                            <button class="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#profile-settings">Eliminar</button>
                                        </li>


                                    </ul>
                                    <div class="tab-content pt-2">

                                        <div class="tab-pane fade show active profile-overview" id="profile-overview"
                                            role="tabpanel">
                                            <h5 class="card-title">About</h5>
                                            <p class="small fst-italic">Sunt est soluta temporibus accusantium neque
                                                nam maiores cumque temporibus. Tempora libero non est unde veniam est
                                                qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis
                                                odit. Fuga sequi sed ea saepe at unde.</p>

                                            <h5 class="card-title">Detalles</h5>


                                            <div class="row">
                                                <div id="lb-profile-name" class="col-lg-3 col-md-4 label ">Nombre
                                                </div>
                                                <div id="profile-name" class="col-lg-9 col-md-8"></div>
                                            </div>

                                            <div class="row">
                                                <div id="lb-profile-surname" class="col-lg-3 col-md-4 label">Apellidos
                                                </div>
                                                <div id="profile-surname" class="col-lg-9 col-md-8"></div>
                                            </div>

                                            <div class="row">
                                                <div id="lb-profile-dni" class="col-lg-3 col-md-4 label">DNI</div>
                                                <div id="profile-dni" class="col-lg-9 col-md-8"></div>
                                            </div>

                                            <div class="row">
                                                <div id="lb-profile-email" class="col-lg-3 col-md-4 label">Email</div>
                                                <div id="profile-email" class="col-lg-9 col-md-8"></div>
                                            </div>

                                            <div class="row">
                                                <div id="lb-profile-role" class="col-lg-3 col-md-4 label">Puesto</div>
                                                <div id="profile-role" class="col-lg-9 col-md-8"></div>
                                            </div>

                                            <div class="row">
                                                <div id="lb-profile-joindate" class="col-lg-3 col-md-4 label">Fecha de
                                                    alta</div>
                                                <div id="profile-joindate" class="col-lg-9 col-md-8"></div>
                                            </div>

                                        </div>

                                        <div class="tab-pane fade profile-edit pt-3" id="profile-edit"
                                            role="tabpanel">

                                            <!-- Profile Edit Form -->
                                            <form>
                                                <div class="row mb-3">
                                                    <label id="lb-profile" for="profileImage"
                                                        class="col-md-4 col-lg-3 col-form-label">Imagen de
                                                        Perfil</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <img src="img/ico_usuario_activo.png" alt="Profile">
                                                        <div class="pt-2">
                                                            <a href="#" class="btn btn-primary btn-sm"
                                                                title="Upload new profile image"><i
                                                                    class="bi bi-upload"></i></a>
                                                            <a href="#" class="btn btn-danger btn-sm"
                                                                title="Remove my profile image"><i
                                                                    class="bi bi-trash"></i></a>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label id="lb-fullname" for="fullname"
                                                        class="col-md-4 col-lg-3 col-form-label">Nombre</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="fullname" type="text" class="form-control"
                                                            id="fullname" value="" disabled>
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label id="lb-surname" for="surname"
                                                        class="col-md-4 col-lg-3 col-form-label">Apellidos</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="surname" type="text" class="form-control"
                                                            id="surname" value="" disabled>
                                                        {{-- <textarea name="about" class="form-control" id="about" style="height: 100px">Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</textarea> --}}
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label id="lb-dni" for="dni"
                                                        class="col-md-4 col-lg-3 col-form-label">DNI</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="dni" type="text" class="form-control"
                                                            id="dni" value="" disabled>
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label id="lb-email" for="email"
                                                        class="col-md-4 col-lg-3 col-form-label">Email</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="email" type="email" class="form-control"
                                                            id="email" value="" disabled>
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label id="lb-job" for="Job"
                                                        class="col-md-4 col-lg-3 col-form-label">Puesto</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="job" type="text" class="form-control"
                                                            id="job" value="Web Designer" disabled>
                                                    </div>
                                                </div>


                                                <div class="row mb-3">
                                                    <label id="lb-join-date" for="join-date"
                                                        class="col-md-4 col-lg-3 col-form-label">Fecha de Alta</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="join-date" type="text" class="form-control"
                                                            id="join-date" value="" disabled>
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label for="Twitter"
                                                        class="col-md-4 col-lg-3 col-form-label">Twitter</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="twitter" type="text" class="form-control"
                                                            id="Twitter" value="https://twitter.com/#">
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label for="Facebook"
                                                        class="col-md-4 col-lg-3 col-form-label">Facebook</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="facebook" type="text" class="form-control"
                                                            id="Facebook" value="https://facebook.com/#">
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label for="Instagram"
                                                        class="col-md-4 col-lg-3 col-form-label">Instagram</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="instagram" type="text" class="form-control"
                                                            id="Instagram" value="https://instagram.com/#">
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label for="Linkedin"
                                                        class="col-md-4 col-lg-3 col-form-label">Linkedin</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="linkedin" type="text" class="form-control"
                                                            id="Linkedin" value="https://linkedin.com/#">
                                                    </div>
                                                </div>

                                                <div class="text-center">
                                                    <button id="btn-save-changes" type="submit"
                                                        class="btn btn-primary">Guardar cambios</button>
                                                </div>
                                            </form><!-- End Profile Edit Form -->

                                        </div>

                                        <div class="tab-pane fade pt-3" id="profile-settings" role="tabpanel">

                                            <!-- Settings Form -->
                                            <form id="remove-employee-form">

                                                <div class="row mb-3">
                                                    <label for="fullname"
                                                        class="col-md-4 col-lg-3 col-form-label">Cancelar
                                                        cuenta</label>
                                                    <div class="col-md-8 col-lg-9 col-form-label">
                                                        <div class="form-check">
                                                            <span></span>
                                                            <input class="form-check-input" type="checkbox"
                                                                id="changesMade">
                                                            <label class="form-check-label" for="changesMade">
                                                                Eliminar esta cuenta de forma permanente
                                                            </label>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div class="text-center">
                                                    <button type="submit" class="btn btn-primary">Eliminar</button>
                                                </div>
                                            </form><!-- End settings Form -->

                                        </div>

                                        <div class="tab-pane fade pt-3" id="profile-change-password" role="tabpanel">
                                            <!-- Change Password Form -->
                                            <form>

                                                <div class="row mb-3">
                                                    <label for="currentPassword"
                                                        class="col-md-4 col-lg-3 col-form-label">Password
                                                        actual</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="password" type="password" class="form-control"
                                                            id="currentPassword">
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label for="newPassword"
                                                        class="col-md-4 col-lg-3 col-form-label">Nuevo Password</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="newpassword" type="password"
                                                            class="form-control" id="newPassword">
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label for="renewPassword"
                                                        class="col-md-4 col-lg-3 col-form-label">Repetir
                                                        Password</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="renewpassword" type="password"
                                                            class="form-control" id="renewPassword">
                                                    </div>
                                                </div>

                                                <div class="text-center">
                                                    <button id="change-password" type="submit"
                                                        class="btn btn-primary">Cambiar Password</button>
                                                </div>
                                            </form><!-- End Change Password Form -->

                                        </div>
                                        <div class="tab-pane fade pt-3" id="profile-status-change" role="tabpanel">
                                            <form>
                                                <div class="row mb-3">
                                                    <label class="col-md-4 col-lg-3 col-form-label">Cambiar
                                                        estado</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio"
                                                                name="status" id="status-pendiente"
                                                                value="pendiente">
                                                            <label class="form-check-label"
                                                                for="status-pendiente">Pendiente</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio"
                                                                name="status" id="status-aceptado" value="aceptada">
                                                            <label class="form-check-label"
                                                                for="status-aceptado">Aceptado</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio"
                                                                name="status" id="status-rechazado"
                                                                value="rechazada">
                                                            <label class="form-check-label"
                                                                for="status-rechazado">Rechazado</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio"
                                                                name="status" id="status-baja" value="baja">
                                                            <label class="form-check-label" for="status-baja">Baja
                                                                temporal</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="radio"
                                                                name="status" id="status-vacaciones"
                                                                value="vacaciones">
                                                            <label class="form-check-label"
                                                                for="status-vacaciones">Vacaciones</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="text-center">
                                                    <button id="change-status" type="submit"
                                                        class="btn btn-primary">Actualizar estado</button>
                                                </div>
                                            </form>
                                        </div><!-- End Bordered Tabs -->


                                    </div><!-- End Bordered Tabs -->

                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <div id="contenedor-principal" class="container-fluid px-4">

                    <div class="cabecera mb-4">
                        <h2 id="nombre-empresa" class="mt-4"></h2>
                        <div class="div-fecha">
                            <h3 class="fecha-actual mt-4"></h3>
                            {{-- <span id="span-estado">Jornada no iniciada</span> --}}
                        </div>
                        {{-- <li class="breadcrumb-item active">Dashboard</li> --}}
                    </div>
                    <div class="panel-container">
                        <span id="span-estado">Jornada no iniciada</span>
                        <div id="action-panels" class="row">
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-success text-white mb-4 panel-fichaje" data-tipo="entrada">
                                    <div class="card-body">Entrada <i class="ico-fichaje fas fa-play"></i></div>

                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a id="detalles-entrada"
                                            class="small text-white stretched-link toggle-detalles" href="#"
                                            data-tipo="entrada"></a>
                                        <div class="small text-white"><i id="ico_entrada"
                                                class="fas fa-angle-down"></i>
                                        </div>
                                    </div>
                                    <div id="ficha-entradas" class="card-body bg-success p-3 detalles-actividad">
                                        <ul></ul>

                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-primary text-white mb-4 panel-fichaje"
                                    data-tipo="inicio_descanso">
                                    <div class="card-body">Descanso <i class="ico-fichaje fas fa-coffee"></i></div>
                                    <div id="tarjeta-actividad"
                                        class="card-footer d-flex align-items-center justify-content-between">
                                        <a id="detalles-descanso"
                                            class="small text-white stretched-link toggle-detalles" href="#"
                                            data-tipo="inicio_descanso"></a>
                                        <div class="small text-white"><i id="ico_descanso"
                                                class="fas fa-angle-down"></i>
                                        </div>
                                    </div>
                                    <div id="ficha-descansos" class="card-body bg-primary p-3 detalles-actividad">
                                        <ul></ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-danger text-white mb-4 panel-fichaje" data-tipo="salida">
                                    <div class="card-body">Salida <i class="ico-fichaje fas fa-sign-out-alt"></i>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a id="detalles-salida"
                                            class="small text-white stretched-link toggle-detalles" href="#"
                                            data-tipo="salida"></a>
                                        <div class="small text-white"><i class="fas fa-angle-down"></i></div>
                                    </div>
                                    <div id="ficha-salidas" class="card-body bg-warning p-3 detalles-actividad">
                                        <ul></ul>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div class="card mb-4">
                            <div class="card-header">
                                <div>
                                    <i class="fas fa-table me-1"></i>
                                    <span id="span-fecha">Historial de hoy</span>
                                </div>
                                <div class="div-calendar">
                                    <span>Mostrar datos del dia: </span>
                                    <input id="selector-fecha" class="mt-4" type="date">
                                </div>
                            </div>

                            <div class="table-body">
                                <table id="tabla-fichajes" class="table table-striped nowrap" style="width:100%">
                                    <thead>
                                        <tr>
                                            <th>Acción</th>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Ubicacion</th>
                                            {{-- <th>Posición</th>
                                        <th>Fecha de alta</th>
                                        <th class="ver-perfil">Ver perfil</th> --}}
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            </main>
            <footer id="footer" class="footer">
                <div class="copyright">
                    &copy; Copyright <strong><span>TimeLink</span></strong>. All Rights Reserved
                </div>
                <div class="credits">
                    <!-- All the links in the footer should remain intact. -->
                    <!-- You can delete the links only if you purchased the pro version. -->
                    <!-- Licensing information: https://bootstrapmade.com/license/ -->
                    <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
                    Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
                </div>
            </footer>
            <!-- <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid px-4">
                        <div class="d-flex align-items-center justify-content-between small">
                            <div class="text-muted">Copyright &copy; Your Website 2023</div>
                            <div>
                                <a href="#">Privacy Policy</a>
                                &middot;
                                <a href="#">Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>
                </footer> -->
        </div>
        <div class="exito-msg"></div>
        <div class="error-msg"></div>


        <div id="div-registro-ubicacion">
            <div class="header-solicitudes">
                <h3>Registrar ubicación</h3>
                <span id="cerrar-modal">×</span>
            </div>
            <div id="form-registro-ubicacion">
                <input class="input-comentarios" type="text" id="input-comentarios"
                    placeholder="Indique el motivo del registro" required="true">
                <button id="btn-registrar-ubicacion">Enviar</button>
            </div>
        </div>

    </div>
    <div id="confirmar-accion" class="confirmar-accion">
        <p class="texto-confirmar-accion">¿Estás seguro?</p>
        <div class="botones-accion">
            <button id="aceptar-accion" class="aceptar-accion">Aceptar</button>
            <button id="cancelar-accion" class="cancelar-accion">Cancelar</button>
        </div>
    </div>
    </div>
    <script src="{{ asset('js/jquery-3.7.1.min.js') }}"></script>
    <script src="{{ asset('js/scripts.js') }}"></script>
    <script src="{{ asset('js/index.js') }}"></script>
    <script src="{{ asset('js/tinymce.min.js') }}"></script>
    <script src="{{ asset('js/main.js') }}"></script>
    <script src="{{ asset('js/common.js') }}"></script>
    <script src="{{ asset('js/private.js') }}"></script>

    <script src="https://cdn.datatables.net/2.2.1/js/dataTables.js"></script>
    <script src="https://cdn.datatables.net/2.2.1/js/dataTables.bootstrap5.js"></script>
    <script src="https://cdn.datatables.net/responsive/3.0.3/js/dataTables.responsive.js"></script>
    <script src="https://cdn.datatables.net/responsive/3.0.3/js/responsive.bootstrap5.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous">
    </script>

</body>

</html>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>Panel de control - Timelink</title>
    {{-- @vite(['resources/js/admin.js']) --}}
    {{-- @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/js/app.js', 'resources/js/admin.js','resources/js/data-charts.js'])
    @endif --}}
    @vite(['resources/js/app.js', 'resources/js/admin.js', 'resources/js/data-charts.js'])

    <!-- Estilos para el Cluster del mapa-->
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/style.min.css" rel="stylesheet" />


    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
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
                <input class="form-control" type="text" placeholder="Buscar..." aria-label="Search for..."
                    aria-describedby="btnNavbarSearch" />
                <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i
                        class="fas fa-search"></i></button>
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
                            Panel de control
                        </a>
                        {{-- <div class="sb-sidenav-menu-heading">Interface</div> --}}
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
                        <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                            data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                            <div class="sb-nav-link-icon"><i id="ico-users" class="fas fa-users"></i></div>
                            Empleados
                            <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                        </a>
                        <div class="collapse" id="collapsePages" aria-labelledby="headingTwo"
                            data-bs-parent="#sidenavAccordion">
                            <nav class="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                <a id="access-request-link" class="nav-link collapsed" href="#"
                                    data-bs-toggle="collapse" data-bs-target="#pagesCollapseAuth"
                                    aria-expanded="false" aria-controls="pagesCollapseAuth">
                                    Solicitudes<span id="access-request-number"></span>
                                    <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                                </a>
                                {{-- <div class="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                        <nav class="sb-sidenav-menu-nested nav">
                                            <a class="nav-link" href="login.html">Login</a>
                                            <a class="nav-link" href="register.html">Register</a>
                                            <a class="nav-link" href="password.html">Forgot Password</a>
                                        </nav>
                                    </div> --}}
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

                                {{-- <div class="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                        <nav class="sb-sidenav-menu-nested nav">
                                            <a class="nav-link" href="401.html">401 Page</a>
                                            <a class="nav-link" href="404.html">404 Page</a>
                                            <a class="nav-link" href="500.html">500 Page</a>
                                        </nav>
                                    </div> --}}
                            </nav>
                        </div>
                        {{-- <div class="sb-sidenav-menu-heading">Addons</div> --}}
                        <a id="report-link" class="nav-link" href="#">
                            <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                            Informes
                        </a>
                        <a class="nav-link" href="tables.html">
                            <div class="sb-nav-link-icon"><i class="fas fa-table"></i></div>
                            Tables
                        </a>
                    </div>
                </div>
                <div class="sb-sidenav-footer">
                    <div class="small">Conectado como:</div>
                    Administrador
                </div>
            </nav>
        </div>
        <div id="layoutSidenav_content">
            <main>
                <!-- <div class="pagetitle">
                    <h1>Profile</h1>
                    <nav>
                        <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li class="breadcrumb-item">Users</li>
                        <li class="breadcrumb-item active">Profile</li>
                        </ol>
                    </nav>
                </div> -->
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

                                        <li class="nav-item">
                                            <button class="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#profile-edit">Editar Perfil</button>
                                        </li>


                                        <li id="li-change-password" class="nav-item">
                                            <button class="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#profile-change-password">Cambiar Password</button>
                                        </li>

                                        <li id="status-change" class="nav-item">
                                            <button class="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#profile-status-change">Cambiar Estado</button>
                                        </li>


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
                                                            id="fullname" value="">
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label id="lb-surname" for="surname"
                                                        class="col-md-4 col-lg-3 col-form-label">Apellidos</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="surname" type="text" class="form-control"
                                                            id="surname" value="">
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
                                                            id="email" value="">
                                                    </div>
                                                </div>

                                                <div class="row mb-3">
                                                    <label id="lb-job" for="Job"
                                                        class="col-md-4 col-lg-3 col-form-label">Puesto</label>
                                                    <div class="col-md-8 col-lg-9">
                                                        <input name="job" type="text" class="form-control"
                                                            id="job" value="Web Designer">
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
                            <span id="span-fecha"></span>
                        </div>

                        {{-- <li class="breadcrumb-item active">Dashboard</li> --}}
                        <div class="div-calendar">
                            <span class="mt-4">Mostrar datos del dia: </span>
                            <input id="selector-fecha" class="mt-4" type="date">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-success text-white mb-4">
                                <div class="card-body">Entradas <span></span></div>
                                <div class="card-footer d-flex align-items-center justify-content-between">
                                    <a class="small text-white stretched-link toggle-detalles" href="#"
                                        data-tipo="entrada">Ver Detalles</a>
                                    <div class="small text-white"><i class="fas fa-angle-down"></i></div>
                                </div>
                                <div id="ficha-entradas" class="card-body bg-success p-3 detalles-actividad l-height">
                                    <ul></ul>

                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-primary text-white mb-4">
                                <div class="card-body">Descansos <span></span></div>
                                <div id="tarjeta-actividad"
                                    class="card-footer d-flex align-items-center justify-content-between">
                                    <a class="small text-white stretched-link toggle-detalles" href="#"
                                        data-tipo="inicio_descanso">Ver Detalles</a>
                                    <div class="small text-white"><i id="icono" class="fas fa-angle-down"></i>
                                    </div>
                                </div>
                                <div id="ficha-descansos"
                                    class="card-body bg-primary p-3 detalles-actividad l-height">
                                    <ul></ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-warning text-white mb-4">
                                <div class="card-body">Salidas <span></span></div>
                                <div class="card-footer d-flex align-items-center justify-content-between">
                                    <a class="small text-white stretched-link toggle-detalles" href="#"
                                        data-tipo="salida">Ver Detalles</a>
                                    <div class="small text-white"><i class="fas fa-angle-down"></i></div>
                                </div>
                                <div id="ficha-salidas" class="card-body bg-warning p-3 detalles-actividad l-height">
                                    <ul></ul>

                                </div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-md-6">
                            <div class="card bg-danger text-white mb-4">
                                <div class="card-body">Ausencias <span></span></div>
                                <div class="card-footer d-flex align-items-center justify-content-between">
                                    <a class="small text-white stretched-link toggle-detalles" href="#"
                                        data-tipo="ausencia">Ver Detalles</a>
                                    <div class="small text-white"><i class="fas fa-angle-down"></i></div>
                                </div>
                                <div id="ficha-ausencias" class="card-body bg-danger p-3 detalles-actividad l-height">
                                    <ul></ul>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xl-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-area me-1"></i>
                                    Fichajes por Fecha
                                    <i id="show-lineChart" class="fas fa-angle-up toggle-chart"></i>
                                </div>
                                <div id="chartContainer" class="card-body chart-body"><canvas class="chart-canvas"
                                        id="multiLineChart" width="100%" height="40"></canvas></div>
                            </div>
                        </div>
                        <div class="col-xl-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-area me-1"></i>
                                    Mapa de fichajes
                                    <i id="show-lineChart" class="fas fa-angle-up toggle-chart"></i>
                                </div>
                                <div class="card-body chart-body">
                                    {{-- <div id="mapContainer" class="card-body"><canvas id="mapaFichajes" width="100%"
                                        height="40vh"></canvas></div> --}}
                                    <div id="mapaFichajes" style="height: 32vh;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-bar me-1"></i>
                                    Ausencias por Semana
                                    <i id="show-lineChart" class="fas fa-angle-down toggle-chart"></i>
                                </div>
                                <div class="card-body chart-body" style="display: none;"><canvas class="chart-canvas"
                                        id="myBarChart" width="100%" height="40"></canvas></div>
                            </div>
                        </div>

                        <div class="col-xl-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-area me-1"></i>
                                    Totales por Fecha
                                    <i id="show-lineChart" class="fas fa-angle-down toggle-chart"></i>
                                </div>
                                <div class="card-body chart-body" style="display: none;"><canvas class="chart-canvas"
                                        id="myPieChart" width="100%" height="40"></canvas></div>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-4">
                        <div class="card-header">
                            <i class="fas fa-table me-1"></i>
                            Tabla de empleados
                        </div>
                        <div class="table-body">
                            <table id="tabla-empleados" class="table table-striped nowrap" style="width:100%">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellidos</th>
                                        <th>DNI</th>
                                        <th>Email</th>
                                        <th>Posición</th>
                                        <th>Fecha de alta</th>
                                        <th class="ver-perfil">Ver perfil</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div id="reports" class="mt-4">
                    <h2>Informes</h2>
                    <div id="report-container">

                        <div class="report-card">
                            <div class="report-icon">
                                <i class="far fa-clock"></i>
                            </div>
                            <h5 class="report-title">Informe de fichajes diarios</h5>
                            <p class="report-desc">Muestra los fichajes diarios de todos los empleados</p>
                        </div>

                        <div class="report-card">
                            <div class="report-icon">
                                <i class="far fa-calendar-times"></i>
                            </div>
                            <h5 class="report-title">Informe de ausencias diárias</h5>
                            <p class="report-desc">Lista los empleados que no han registrado fichajes en el día seleccionado</p>
                        </div>

                        <div class="report-card">
                            <div class="report-icon">
                                <i class="far fa-pause-circle"></i>
                            </div>
                            <h5 class="report-title">Tiempo total de descanso</h5>
                            <p class="report-desc">Calcula el tiempo acumulado en pausas de cada empleado.</p>
                        </div>

                        <div class="report-card">
                            <div class="report-icon">
                                <i class="fas fa-percentage"></i>
                            </div>
                            <h5 class="report-title">Porcentaje de horas trabajadas</h5>
                            <p class="report-desc">Muestra la relación entre horas trabajadas y la jornada laboral
                                total.</p>
                        </div>

                        <div class="report-card">
                            <div class="report-icon">
                                <i class="far fa-bell"></i>
                            </div>
                            <h5 class="report-title">Retrasos en fichajes</h5>
                            <p class="report-desc">Registra los fichajes realizados fuera del horario establecido.</p>
                        </div>

                        <div class="report-card">
                            <div class="report-icon">
                                <i class="far fa-hourglass"></i>
                            </div>
                            <h5 class="report-title">Tiempo total trabajado</h5>
                            <p class="report-desc">Calcula el tiempo total de trabajo de cada empleado
                                laboral.</p>
                        </div>


                    </div>
                </div>


            </main>
            <!-- Modal para mostrar el informe -->
            {{-- <div class="lock-screen"> --}}
            <div id="report-modal" aria-labelledby="reportModalLabel">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="reportModalLabel">Informe de Fichajes</h5>
                            <div class="div-calendar-informes">
                                <span class="mt-4">Mostrar datos del dia: </span>
                                <input id="selector-fecha-informes" class="mt-4" type="date">
                            </div>
                           
                            <button type="button" class="btn-close"><span id="span-close">&times;</span></button>
                        </div>
                        <div class="modal-body">
                            <table id="report-table" class="table table-striped table-bordered nowrap" style="width:100%">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Empleado</th>
                                        <th>Fecha</th>
                                        <th>Hora Entrada</th>
                                        <th>Hora Salida</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Datos de la tabla -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {{-- </div> --}}



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
        <div id="div-solicitudes-acceso"></div>
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

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
    {{-- <script src="{{ asset('js/app.js') }}"></script>  
    <script src="{{ asset('js/bootstrap.js') }}"></script>   --}}

    {{-- @vite(['resources/js/app.js']) --}}
    <script src="{{ asset('js/common.js') }}"></script>
    {{-- <script src="{{ asset('js/admin.js') }}"></script> --}}

    <script src="{{ asset('js/index.js') }}"></script>
    <script src="{{ asset('js/tinymce.min.js') }}"></script>
    <script src="{{ asset('js/main.js') }}"></script>



    <script src="https://cdn.datatables.net/2.2.1/js/dataTables.js"></script>
    <script src="https://cdn.datatables.net/2.2.1/js/dataTables.bootstrap5.js"></script>
    <script src="https://cdn.datatables.net/responsive/3.0.3/js/dataTables.responsive.js"></script>
    <script src="https://cdn.datatables.net/responsive/3.0.3/js/responsive.bootstrap5.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous">
    </script>
    {{-- <script src="{{ asset('js/data-charts.js') }}"></script> --}}

</body>

</html>

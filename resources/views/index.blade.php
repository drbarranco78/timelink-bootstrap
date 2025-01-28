@extends('layouts.app')

@section('title', 'Inicio de Sesión')
@section('header')
    <div class="logotipo">
        <img src="{{ asset('img/timelink.webp') }}" id="logo-cabecera" class="icono-cabecera" alt="Logotipo de TimeLink">
        <h3>TimeLink</h3>
    </div>
    
@endsection
@section('content')
<div class="contenedor-principal">
        <div class="container register" id="login">
            <div class="row">
                <div class="col-md-3 register-left">
                    <img src="img/timelink.webp" alt="">
                    <h3>Usuario registrado</h3>
                    <p>Accede a tu cuenta de forma segura</p>
                    <input id="enlace-registro" type="submit" name="" value="Register" /><br />
                </div>
                <div class="col-md-9 register-right">
                    <h3 class="register-heading">Iniciar sesión</h3>
                    <div class="row register-form">
                        <div id= "formulario-login" class="col-md-6 offset-md-3">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="DNI *" name="dni" required />
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" placeholder="Password *" name="password" required />
                            </div>
                            <input type="submit" class="btnRegister" id="btnLogin" value="Entrar" />
                        </div>
                    </div>
                </div>
            </div> 
        </div>
                
        <div class="container register" id="register">
            <div class="row">
                <div class="col-md-3 register-left">
                    <i class="fa-solid fa-handshake fa-3x"></i>
                    <!-- <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" /> -->
                    <h3>Bienvenido</h3>
                    <p>Registrate gratis y empieza a gestionar tus fichajes de manera sencilla y eficaz</p>
                    <input id="enlace-login" type="submit" name="" value="Login" /><br />
                </div>
                <div class="col-md-9 register-right">
                    <ul class="nav nav-tabs nav-justified" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab"
                                aria-controls="home" aria-selected="true">Empleado</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                                aria-controls="profile" aria-selected="false">Empresa</a>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <h3 class="register-heading">Registro de empleado</h3>
                            <div class="row register-form">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <input type="text" id="employee-name" class="form-control" maxlength=20 placeholder="Nombre *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="employee-surname" class="form-control" maxlength=50 placeholder="Apellidos *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" id="employee-password1" maxlength=20 class="form-control" placeholder="Password *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" id="employee-password2" maxlength=20 class="form-control" placeholder="Confirmar Password *"
                                            value="" />
                                    </div>
                                    <div class="form-group">
                                        <div class="maxl">
                                            <label class="radio inline">
                                                <input type="radio" id="gender-male" name="gender" value="male" checked>
                                                <span> Hombre </span>
                                            </label>
                                            <label class="radio inline">
                                                <input type="radio" id="gender-female" name="gender" value="female">
                                                <span>Mujer </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <input type="text" id="employee-dni" maxlength=10 class="form-control" placeholder="DNI/NIE *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="email" id="employee-email" maxlength=50 name="txtEmpEmail"
                                            class="form-control" placeholder="Email *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <select class="form-control" maxlength=50 id="company-selection">
                                            <option class="hidden" selected disabled>Selecciona tu empresa</option>                                            
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="employee-job" maxlength=30 class="form-control" placeholder="Función laboral *"
                                            value="" />
                                    </div>
                                    <input type="submit" id="employee-register" class="btnRegister" value="Enviar solicitud" />
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade show" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <h3 class="register-heading">Registro de empresa</h3>
                            <div class="row register-form">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <input type="text" id="admin-name" class="form-control" maxlength=20 placeholder="Nombre del administrador *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="admin-surname" class="form-control" maxlength=50 placeholder="Apellidos *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" id="admin-password1" maxlength=20 class="form-control" placeholder="Password *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" id="admin-password2" maxlength=20 class="form-control"
                                            placeholder="Confirmar Password *" value="" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <input type="text" id="admin-dni" class="form-control" maxlength=10 placeholder="DNI/NIE *" value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="email" id="admin-email" class="form-control" maxlength=50 placeholder="Email *"
                                            value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="admin-company" class="form-control" maxlength=50 placeholder="Nombre de la empresa *"
                                            value="" />
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="admin-cif" class="form-control" maxlength=10 placeholder="CIF *" value="" />
                                    </div>
                                    <input type="submit" id="admin-register" class="btnRegister" value="Registrar" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="exito-login"></div>
        <div class="error-login"></div>
    </div>
@endsection

@section('scripts')
    <!-- <script src="{{ asset('js/jquery-3.7.1.min.js') }}"></script> -->
    <script src="{{ asset('js/index.js') }}"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script> -->
@endsection

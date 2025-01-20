@extends('layouts.app')

@section('title', 'TimeLink - Página Privada')

@section('header')
    <div class="logotipo">
        <img src="{{ asset('img/timelink.webp') }}" id="logo-cabecera" class="icono-cabecera" alt="Logotipo de TimeLink">
        <h3>TimeLink</h3>
    </div>
    <div class="usuario">
        <div id="mensaje-bienvenida">
            <h3>Bienvenido, Usuario</h3>
            <img src="{{ asset('img/ico_usuario_activo.png') }}" id="icono-usuario" class="icono-cabecera" alt="Icono de usuario">
        </div>
    </div>
@endsection

@section('content')
    <div class="contenido-principal">
        <div class="cabecera-ficha">
            <div class="estado-actual">
                <i id="icono-estado" class="fas fa-times-circle"></i>
                <span id="estado">Fuera del trabajo</span>
            </div>
            <h2 class="fecha-actual"></h2>
            <div class="reloj">
                <i class="fas fa-clock"></i>
                <span id="hora"></span>
            </div>
        </div>
        <h3 class="mensaje-estado">Aún no has comenzado la jornada</h3>

        <div id="botones-jornada">
            <button id="btn-comenzar" class="btn-jornada">
                <i class="fas fa-play"></i> Comenzar Jornada
            </button>
            <button id="btn-detener" class="btn-jornada d-none">
                <i class="fas fa-stop"></i> Detener Jornada
            </button>
            <button id="btn-descanso" class="btn-jornada d-none">
                <i class="fas fa-coffee"></i> Descanso
            </button>
            <button id="btn-terminar-descanso" class="btn-jornada d-none">
                <i class="fas fa-clock"></i> Terminar descanso
            </button>
        </div>

        <div class="historial">
            <h2 class="d-none">Historial de acciones
                <span id="mostrar-historial" class="icono-mostrar">
                    <i class="fas fa-eye"></i>
                </span>
                <span id="borrar-historial" class="icono-borrar">
                    <i class="fas fa-trash-alt"></i>
                </span>
            </h2>

            <ul class="lista-historial"></ul>
        </div>
    </div>

    <div id="confirmar-accion" class="confirmar-accion">
        <p class="texto-confirmar-accion">¿Estás seguro?</p>
        <div class="botones-accion">
            <button id="aceptar-accion" class="aceptar-accion">Aceptar</button>
            <button id="cancelar-accion" class="cancelar-accion">Cancelar</button>
        </div>
    </div>
@endsection

@section('scripts')
    <!-- <script src="{{ asset('js/jquery-3.7.1.min.js') }}"></script> -->
    <script src="{{ asset('js/private.js') }}"></script>
@endsection

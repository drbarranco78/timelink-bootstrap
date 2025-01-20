@extends('layouts.app')

@section('title', 'Inicio de Sesión')
@section('header')
    <div class="logotipo">
        <img src="{{ asset('img/timelink.webp') }}" id="logo-cabecera" class="icono-cabecera" alt="Logotipo de TimeLink">
        <h3>TimeLink</h3>
    </div>
    
@endsection
@section('content')
    <h1 class="titulo">TimeLink - Control de horarios</h1>

    <section class="login">
        <fieldset>
            <legend>Inicio de Sesión</legend>
            <form id="formulario-login" action="{{ route('login') }}" method="post">
                @csrf
                <label for="userid">Nº de DNI / NIE</label>
                <input type="text" name="userid" id="userid" maxlength="10" required />
                <label for="current-password">Contraseña:</label>
                <input type="password" name="current-password" id="current-password" maxlength="20" required />
                <input type="submit" class="boton-login" value="Acceder" />
            </form>
        </fieldset>
    </section>
@endsection

@section('scripts')
    <!-- <script src="{{ asset('js/jquery-3.7.1.min.js') }}"></script> -->
    <script src="{{ asset('js/index.js') }}"></script>
@endsection

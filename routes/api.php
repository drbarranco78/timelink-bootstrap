<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FichajeController;
use App\Http\Controllers\CredencialController;
use App\Http\Controllers\MailController;

Route::get('/empresas', [EmpresaController::class, 'index']);
Route::post('/empresas', [EmpresaController::class, 'store']);
Route::get('/empresas/{id}', [EmpresaController::class, 'show']);
//Route::put('/empresas/{id}', [EmpresaController::class, 'update']);
Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy']);
Route::get('/empresa/{idEmpresa}/maestro', [UserController::class, 'obtenerEmailMaestro']);
Route::get('/empresa/{idEmpresa}/usuarios', [UserController::class, 'obtenerUsuariosPorEmpresa']);
Route::put('/empresa/update', [EmpresaController::class, 'update']);


Route::get('/usuarios', [UserController::class, 'index']);
Route::post('/usuarios', [UserController::class, 'store']);
Route::get('/usuarios/{id}', [UserController::class, 'show']);
Route::put('/usuarios/{id}', [UserController::class, 'update']);
Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::get('/usuarios/{id}', [UserController::class, 'obtenerUsuarioPorId']);
Route::put('/usuarios/update', [UserController::class, 'update']);
Route::get('/solicitudes-pendientes', [UserController::class, 'contarSolicitudesPendientes']);
Route::patch('/usuarios/{id}/estado', [UserController::class, 'actualizarEstado']);
Route::post('/usuarios/invitado', [UserController::class, 'registrarEmpleadoConInvitacion']);
Route::post('/usuarios/inactivos', [UserController::class, 'obtenerEmpleadosInactivos']);


Route::get('/credenciales', [CredencialController::class, 'index']);
Route::post('/credenciales', [CredencialController::class, 'store']);
Route::get('/credenciales/{id}', [CredencialController::class, 'show']);
// Route::put('/credenciales/{id}', [CredencialController::class, 'update']);
Route::delete('/credenciales/{id}', [CredencialController::class, 'destroy']);
Route::put('/cambiar-password', [CredencialController::class, 'cambiarPassword']);

Route::get('/fichajes', [FichajeController::class, 'index']);
Route::post('/fichajes', [FichajeController::class, 'store']);
Route::get('/fichajes/{id}', [FichajeController::class, 'show']);
Route::put('/fichajes/{id}', [FichajeController::class, 'update']);
Route::delete('/fichajes/{id}', [FichajeController::class, 'destroy']);
Route::post('/fichajes/filtrar', [FichajeController::class, 'obtenerPorTrabajadorYRango']);
Route::post('/fichajes/fecha', [FichajeController::class, 'obtenerFichajesPorFecha']);
Route::post('/fichajes/ausentes', [FichajeController::class, 'obtenerAusentes']);
Route::post('/fichajes/ultimo', [FichajeController::class, 'obtenerUltimoFichaje']);
Route::get('/fichajes/ausencias-semana/{fecha}', [FichajeController::class, 'obtenerAusentesSemana']);
Route::get('/fichajes/tiempos-totales/{fecha}', [FichajeController::class, 'obtenerTiemposTotales']);




Route::post('/enviar-solicitud', [MailController::class, 'enviarSolicitud']);
Route::post('/enviar-invitacion', [MailController::class, 'enviarInvitacion']);






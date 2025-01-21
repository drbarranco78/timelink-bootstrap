<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectIfNotAuthenticated;

Route::get('/', function () {
    return view('index');
});

Route::middleware([RedirectIfNotAuthenticated::class])->group(function () {

    Route::get('/private', function () {
        return view('private'); // Cambia 'Contenido privado' si necesitas devolver una vista específica
    });

    Route::get('/admin', function () {
        return 'Panel de administración';
    });

});


// Route::middleware('auth')->get('/private', function () {
//     return view('private'); 
// });

//Route::view('/private', 'private')->name('private')->middleware('auth');

// Route::get('/login', function (){
//     return 'Login page';
// })->name('login');

// Route::post('/login', [AuthController::class, 'login'])->name('login');
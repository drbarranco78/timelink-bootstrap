<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RedirectIfNotAuthenticated;

Route::get('/', function () {
    return view('index');
});
// Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/private', function () {
    return view('private');
});

// Route::middleware('auth')->get('/private', function () {
//     return view('private'); 
// });

//Route::view('/private', 'private')->name('private')->middleware('auth');

// Route::get('/login', function (){
//     return 'Login page';
// })->name('login');

// Route::middleware([RedirectIfNotAuthenticated::class])->group(function () {
//     Route::get('/private', function () {
//         return 'Contenido privado';
//     });

//     Route::get('/admin', function () {
//         return 'Panel de administración';
//     });
// });
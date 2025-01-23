<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Configuration\Middleware;




Route::get('/', function () {
    return view('index');
});

// Route::get('/private', function () {
//     return view('private');
// })->middleware('auth');

Route::get('/login', function (){
    return view('index');
})->name('login');

Route::middleware(['auth'])->group(function () {
    Route::get('/private', function () {
        return view('private'); // O contenido según sea necesario
    });
    Route::get('/admin', function () {
        return view('admin'); // O contenido según sea necesario
    });
});

// Route::get('login', function (){
//     return view('index');
// });

// Route::middleware(['web'])->group(function () {
//     Route::post('/login', [UserController::class, 'login']);
// });

// Route::get('/login', function () {
//     if (Auth::user()){
//         return view('private');
//     }else{
//         echo 'Valor de check '.Auth::check();
        
//     }    
// })->name('login');

// Route::view('/private', 'private')->name('private')->middleware('auth');

// Route::middleware(['auth'])->group(function () {
//     Route::get('/private', function () {
//         return view('private'); // O contenido según sea necesario
//     });
// });
// Route::middleware([RedirectIfNotAuthenticated::class])->group(function () {

//     Route::get('/private', function () {        
//         return view('private');     
//     });

//     Route::get('/admin', function () {
//         return 'Panel de administración';
//     });

// });


// Route::middleware('auth')->get('/private', function () {
//     return view('private'); 
// });



// Route::get('/login', function (){
//     return 'Login page';
// })->name('login');

// Route::post('/login', [AuthController::class, 'login'])->name('login');

// Route::get('/private', function () {
//     return view('private');
// })->middleware(RedirectIfNotAuthenticated::class);

// Route::group(['middleware' => ['web']], function () {
//     Route::post('/login', [UserController::class, 'login']);
// });

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
        return view('private'); 
    });
    Route::get('/admin', function () {
        return view('admin'); 
    });
});


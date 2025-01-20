<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/private', function () {
    return view('private');
});

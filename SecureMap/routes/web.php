<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarkerController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/map');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register.form');
    Route::post('/register', [AuthController::class, 'register'])->name('register.attempt');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/map', [MarkerController::class, 'index'])->name('map.index');
    Route::post('/markers', [MarkerController::class, 'store'])->name('markers.store');
    Route::patch('/markers/{marker}', [MarkerController::class, 'update'])
        ->middleware('throttle:90,1')
        ->name('markers.update');
    Route::delete('/markers/{marker}', [MarkerController::class, 'destroy'])->name('markers.destroy');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

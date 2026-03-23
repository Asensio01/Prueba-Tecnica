<?php

use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\MarkerApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthTokenController::class, 'register']);
Route::post('/auth/login', [AuthTokenController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::delete('/auth/token', [AuthTokenController::class, 'destroy']);

    Route::get('/markers', [MarkerApiController::class, 'index']);
    Route::post('/markers', [MarkerApiController::class, 'store']);
    Route::patch('/markers/{marker}', [MarkerApiController::class, 'update'])
        ->middleware('throttle:120,1');
    Route::delete('/markers/{marker}', [MarkerApiController::class, 'destroy']);
});

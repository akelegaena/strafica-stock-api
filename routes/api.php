<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MouvementController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FournisseurController;
use App\Http\Controllers\Api\UserController;






Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('mouvements', MouvementController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('articles', ArticleController::class);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('fournisseurs', FournisseurController::class);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class);
});


Route::middleware(['auth:sanctum', 'role:ADMIN'])->group(function () {
    Route::apiResource('users', UserController::class);

    Route::patch('/users/{user}/change-role', [UserController::class, 'changeRole']);
    Route::patch('/users/{user}/change-password', [UserController::class, 'changePassword']);
});

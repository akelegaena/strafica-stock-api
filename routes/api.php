<?php

/*use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FournisseurController;
use App\Http\Controllers\Api\MouvementController;
use App\Http\Controllers\Api\DashboardController;




Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('articles', ArticleController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('fournisseurs', FournisseurController::class);
    Route::apiResource('mouvements', MouvementController::class);
});

Route::middleware(['auth:sanctum', 'role:ADMIN'])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::patch('/users/{user}/change-role', [UserController::class, 'changeRole']);
    Route::patch('/users/{user}/change-password', [UserController::class, 'changePassword']);
});
*/



use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FournisseurController;
use App\Http\Controllers\Api\MouvementController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/
/*Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/alerts', [DashboardController::class, 'alerts']); // optionnel
});*/

Route::middleware('auth:sanctum')->get(
    '/dashboard',
    [DashboardController::class, 'index']
);


/*
|--------------------------------------------------------------------------
| RESSOURCES MÉTIER
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('articles', ArticleController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('fournisseurs', FournisseurController::class);
    Route::apiResource('mouvements', MouvementController::class);
});

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:ADMIN'])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::patch('/users/{user}/change-role', [UserController::class, 'changeRole']);
    Route::patch('/users/{user}/change-password', [UserController::class, 'changePassword']);
});

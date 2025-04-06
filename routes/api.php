<?php

use App\Http\Controllers\BasketController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\IngredientsController;
use App\Http\Controllers\ProductImageRelationsController;
use App\Http\Controllers\ReadyCakeImageRelationsController;
use App\Http\Controllers\ReadyCakesController;
use App\Http\Controllers\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', [TestController::class, 'index']);

Route::prefix('ingredients')->group(function () {
    Route::post('/', [IngredientsController::class, 'create']);
    Route::get('/', [IngredientsController::class, 'index']);
    Route::get('/{ingredient}', [IngredientsController::class, 'show']);
    Route::post('/{ingredient}', [IngredientsController::class, 'update']);
    Route::delete('/{ingredient}', [IngredientsController::class, 'destroy']);
});

Route::prefix('ready-cakes')->group(function () {
    Route::post('/', [ReadyCakesController::class, 'create']);
    Route::get('/', [ReadyCakesController::class, 'index']);
    Route::get('/{cake}', [ReadyCakesController::class, 'show']);
    Route::post('/{cake}', [ReadyCakesController::class, 'update']);
    Route::delete('/{cake}', [ReadyCakesController::class, 'destroy']);
});

Route::prefix('images')->group(function () {
    Route::post('/', [ImagesController::class, 'create']);
    Route::get('/', [ImagesController::class, 'index']);
    Route::get('/{image}', [ImagesController::class, 'show']);
    Route::post('/{image}', [ImagesController::class, 'update']);
    Route::delete('/{image}', [ImagesController::class, 'destroy']);
});

Route::prefix('ready-cake-image-relations')->group(function () {
    Route::post('/', [ReadyCakeImageRelationsController::class, 'create']);
    Route::get('/', [ReadyCakeImageRelationsController::class, 'index']);
    Route::get('/{readyCakeImageRelation}', [ReadyCakeImageRelationsController::class, 'show']);
    Route::delete('/{readyCakeImageRelation}', [ReadyCakeImageRelationsController::class, 'destroy']);
});

Route::prefix('product-image-relations')->group(function () {
    Route::post('/', [ProductImageRelationsController::class, 'create']);
    Route::get('/', [ProductImageRelationsController::class, 'index']);
    Route::get('/{productImageRelation}', [ProductImageRelationsController::class, 'show']);
    Route::delete('/{productImageRelation}', [ProductImageRelationsController::class, 'destroy']);
});

Route::prefix('baskets')->group(function () {
    Route::post('/', [BasketController::class, 'create']);
    Route::post('/{id}', [BasketController::class, 'update']);
    Route::get('/', [BasketController::class, 'index']);
    Route::delete('/{id}', [BasketController::class, 'destroy']);
});

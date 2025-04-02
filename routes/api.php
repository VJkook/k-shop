<?php

use App\Http\Controllers\ImagesController;
use App\Http\Controllers\IngredientsController;
use App\Http\Controllers\ProductImageRelationsController;
use App\Http\Controllers\ProductsController;
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

Route::prefix('products')->group(function () {
    Route::post('/', [ProductsController::class, 'create']);
    Route::get('/', [ProductsController::class, 'index']);
    Route::get('/{product}', [ProductsController::class, 'show']);
    Route::post('/{product}', [ProductsController::class, 'update']);
    Route::delete('/{product}', [ProductsController::class, 'destroy']);
});

Route::prefix('images')->group(function () {
    Route::post('/', [ImagesController::class, 'create']);
    Route::get('/', [ImagesController::class, 'index']);
    Route::get('/{image}', [ImagesController::class, 'show']);
    Route::post('/{image}', [ImagesController::class, 'update']);
    Route::delete('/{image}', [ImagesController::class, 'destroy']);
});

Route::prefix('product-image-relations')->group(function () {
    Route::post('/', [ProductImageRelationsController::class, 'create']);
    Route::get('/', [ProductImageRelationsController::class, 'index']);
    Route::get('/{productImageRelation}', [ProductImageRelationsController::class, 'show']);
    Route::delete('/{productImageRelation}', [ProductImageRelationsController::class, 'destroy']);
});

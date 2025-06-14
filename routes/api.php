<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BasketController;
use App\Http\Controllers\CakeDesignersController;
use App\Http\Controllers\CakeFormsController;
use App\Http\Controllers\CakeSpongesController;
use App\Http\Controllers\CookingStepsController;
use App\Http\Controllers\CoveragesController;
use App\Http\Controllers\DecorsController;
use App\Http\Controllers\FillingsController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\IngredientsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductImageRelationsController;
use App\Http\Controllers\ReadyCakeImageRelationsController;
use App\Http\Controllers\ReadyCakesController;
use App\Http\Controllers\RecipesController;
use App\Http\Controllers\TechnologicalMapsController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TiersController;
use App\Http\Controllers\UsersController;
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

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::post('/register', [AuthController::class, 'register'])->name('register');
//Route::get('/token', [AuthController::class, 'getToken'])->name('getToken');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser'])->name('user');


Route::prefix('/users')->group(function () {
    Route::get('/', [UsersController::class, 'index'])->name('users');
    Route::get('/confectioners', [UsersController::class, 'confectioners'])->name('confectioners');
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
    Route::get('/{id}', [ReadyCakesController::class, 'show']);
    Route::post('/{id}', [ReadyCakesController::class, 'update']);
    Route::delete('/{id}', [ReadyCakesController::class, 'destroy']);
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

Route::middleware('auth:sanctum')->prefix('basket')->group(function () {
    Route::post('/', [BasketController::class, 'create']);
    Route::post('/{id}', [BasketController::class, 'update']);
    Route::get('/', [BasketController::class, 'index']);
    Route::delete('/{id}', [BasketController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('orders')->group(function () {
    Route::post('/', [OrdersController::class, 'create']);
    Route::get('/', [OrdersController::class, 'index']);
    Route::get('/all', [OrdersController::class, 'all']);
    Route::post('/{id}', [OrdersController::class, 'update']);
});

Route::prefix('fillings')->group(function () {
    Route::post('/', [FillingsController::class, 'create']);
    Route::get('/', [FillingsController::class, 'index']);
    Route::get('/{id}', [FillingsController::class, 'show']);
    Route::post('/{id}', [FillingsController::class, 'update']);
    Route::delete('/{id}', [FillingsController::class, 'destroy']);
});

Route::prefix('cake-sponges')->group(function () {
    Route::post('/', [CakeSpongesController::class, 'create']);
    Route::get('/', [CakeSpongesController::class, 'index']);
    Route::get('/{id}', [CakeSpongesController::class, 'show']);
    Route::post('/{id}', [CakeSpongesController::class, 'update']);
    Route::delete('/{id}', [CakeSpongesController::class, 'destroy']);
});

Route::prefix('coverages')->group(function () {
    Route::post('/', [CoveragesController::class, 'create']);
    Route::get('/', [CoveragesController::class, 'index']);
    Route::get('/{id}', [CoveragesController::class, 'show']);
    Route::post('/{id}', [CoveragesController::class, 'update']);
    Route::delete('/{id}', [CoveragesController::class, 'destroy']);
});

Route::prefix('cake-forms')->group(function () {
    Route::post('/', [CakeFormsController::class, 'create']);
    Route::get('/', [CakeFormsController::class, 'index']);
    Route::get('/{id}', [CakeFormsController::class, 'show']);
    Route::post('/{id}', [CakeFormsController::class, 'update']);
    Route::delete('/{id}', [CakeFormsController::class, 'destroy']);
});

Route::prefix('decors')->group(function () {
    Route::post('/', [DecorsController::class, 'create']);
    Route::get('/', [DecorsController::class, 'index']);
    Route::get('/{id}', [DecorsController::class, 'show']);
    Route::post('/{id}', [DecorsController::class, 'update']);
    Route::delete('/{id}', [DecorsController::class, 'destroy']);
});

// TODO: remove deprecated
Route::prefix('tiers')->group(function () {
    Route::post('/', [TiersController::class, 'create']);
    Route::get('/', [TiersController::class, 'index']);
    Route::get('/{id}', [TiersController::class, 'show']);
    Route::delete('/{id}', [TiersController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('cake-designers')->group(function () {
    Route::post('/', [CakeDesignersController::class, 'create']);
    Route::get('/', [CakeDesignersController::class, 'index']);
    Route::get('/{id}', [CakeDesignersController::class, 'show']);
//    Route::post('/{id}', [CakeDesignersController::class, 'update']);
    Route::delete('/{id}', [CakeDesignersController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('technological-maps')->group(function () {
    Route::post('/', [TechnologicalMapsController::class, 'create']);
    Route::get('/', [TechnologicalMapsController::class, 'index']);

    Route::get('/{mapId}', [TechnologicalMapsController::class, 'show']);
    Route::delete('/{id}', [TechnologicalMapsController::class, 'destroy']);

    Route::prefix('/{technologicalMapId}/cooking-steps')->group(function () {
        Route::post('/', [CookingStepsController::class, 'create']);
        Route::get('/', [CookingStepsController::class, 'index']);
        Route::get('/{id}', [CookingStepsController::class, 'show']);
        Route::delete('/{id}', [CookingStepsController::class, 'destroy']);
    });
});

Route::middleware('auth:sanctum')->prefix('recipes')->group(function () {
    Route::post('/for-ready-cakes', [RecipesController::class, 'createForReadyCake']);
    Route::get('/{id}', [RecipesController::class, 'show']);
    Route::post('/{id}/add-technological-map', [RecipesController::class, 'addTechnologicalMap']);
    Route::delete('/{id}', [RecipesController::class, 'destroy']);
});

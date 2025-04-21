<?php

use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('product', [ProductController::class, 'index'])->name('product.index');
    Route::post('product/store', [ProductController::class, 'store'])->name('product.store');


    Route::prefix('category')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('category.index');
        Route::post('store', [CategoryController::class, 'store'])->name('category.store');
        Route::post('delete-multiple', [CategoryController::class, 'deleteMultiple'])->name('category.delete-multiple');
        Route::post('delete', [CategoryController::class, 'delete'])->name('category.delete');
        Route::post('update', [CategoryController::class, 'update'])->name('category.update');
    });


    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('user.index');
        Route::post('store', [UserController::class, 'store'])->name('user.store');
        Route::post('delete-multiple', [UserController::class, 'deleteMultiple'])->name('user.delete-multiple');
        Route::post('delete', [UserController::class, 'delete'])->name('user.delete');
        Route::post('update', [UserController::class, 'update'])->name('user.update');
    });

    Route::prefix('kelas')->group(function () {
        Route::get('/', [KelasController::class, 'index'])->name('kelas.index');
        Route::post('store', [KelasController::class, 'store'])->name('kelas.store');
        Route::post('delete-multiple', [KelasController::class, 'deleteMultiple'])->name('kelas.delete-multiple');
        Route::post('delete', [KelasController::class, 'delete'])->name('kelas.delete');
        Route::post('update', [KelasController::class, 'update'])->name('kelas.update');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

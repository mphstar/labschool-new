<?php

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
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

<?php

use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\KeuanganController;
use App\Http\Controllers\Admin\MataPelajaranController;
use App\Http\Controllers\Admin\MateriController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\SuratController;
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

    Route::prefix('mata-pelajaran')->group(function () {
        Route::get('/', [MataPelajaranController::class, 'index'])->name('mata-pelajaran.index');
        Route::post('store', [MataPelajaranController::class, 'store'])->name('mata-pelajaran.store');
        Route::post('delete-multiple', [MataPelajaranController::class, 'deleteMultiple'])->name('mata-pelajaran.delete-multiple');
        Route::post('delete', [MataPelajaranController::class, 'delete'])->name('mata-pelajaran.delete');
        Route::post('update', [MataPelajaranController::class, 'update'])->name('mata-pelajaran.update');


        Route::prefix('{id}/materi')->group(function () {
            Route::get('/', [MateriController::class, 'index'])->name('materi.index');
            Route::post('store', [MateriController::class, 'store'])->name('materi.store');
            Route::post('delete-multiple', [MateriController::class, 'deleteMultiple'])->name('materi.delete-multiple');
            Route::post('delete', [MateriController::class, 'delete'])->name('materi.delete');
            Route::post('update', [MateriController::class, 'update'])->name('materi.update');
    
        });
    });

    Route::prefix('keuangan')->group(function () {
        Route::get('/', [KeuanganController::class, 'index'])->name('keuangan.index');
        Route::post('store', [KeuanganController::class, 'store'])->name('keuangan.store');
        Route::post('delete-multiple', [KeuanganController::class, 'deleteMultiple'])->name('keuangan.delete-multiple');
        Route::post('delete', [KeuanganController::class, 'delete'])->name('keuangan.delete');
        Route::post('update', [KeuanganController::class, 'update'])->name('keuangan.update');
    });

    Route::prefix('surat')->group(function () {
        Route::get('/', [SuratController::class, 'index'])->name('surat.index');
        Route::post('store', [SuratController::class, 'store'])->name('surat.store');
        Route::post('delete-multiple', [SuratController::class, 'deleteMultiple'])->name('surat.delete-multiple');
        Route::post('delete', [SuratController::class, 'delete'])->name('surat.delete');
        Route::post('update', [SuratController::class, 'update'])->name('surat.update');
    });

    Route::prefix('siswa')->group(function () {
        Route::get('/', [SiswaController::class, 'index'])->name('siswa.index');
        Route::post('store', [SiswaController::class, 'store'])->name('siswa.store');
        Route::post('delete-multiple', [SiswaController::class, 'deleteMultiple'])->name('siswa.delete-multiple');
        Route::post('delete', [SiswaController::class, 'delete'])->name('siswa.delete');
        Route::post('update', [SiswaController::class, 'update'])->name('siswa.update');
    });

    

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

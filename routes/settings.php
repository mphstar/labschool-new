<?php

use App\Http\Controllers\Admin\CapaianKompetensiController;
use App\Http\Controllers\Admin\PengaturanPpdbController;
use App\Http\Controllers\Admin\SidebarMenuController;
use App\Http\Controllers\Admin\WebsiteController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('settings/website', [WebsiteController::class, 'index'])->name('website.index');
    Route::post('settings/website/update', [WebsiteController::class, 'update'])->name('website.update');


    Route::get('settings/capaian-kompetensi', [CapaianKompetensiController::class, 'index'])->name('capaian-kompetensi.index');
    Route::post('settings/capaian-kompetensi/save', [CapaianKompetensiController::class, 'save'])->name('capaian-kompetensi.save');

    Route::get('settings/ppdb', [PengaturanPpdbController::class, 'index'])->name('ppdb.index');
    Route::post('settings/ppdb/update', [PengaturanPpdbController::class, 'update'])->name('ppdb.update');

    // Sidebar Menu settings
    Route::get('settings/sidebar-menu', [SidebarMenuController::class, 'index'])->name('sidebar-menu.index');
    Route::post('settings/sidebar-menu/store', [SidebarMenuController::class, 'store'])->name('sidebar-menu.store');
    Route::post('settings/sidebar-menu/update', [SidebarMenuController::class, 'update'])->name('sidebar-menu.update');
    Route::post('settings/sidebar-menu/delete', [SidebarMenuController::class, 'delete'])->name('sidebar-menu.delete');
    Route::post('settings/sidebar-menu/delete-multiple', [SidebarMenuController::class, 'deleteMultiple'])->name('sidebar-menu.delete-multiple');
});

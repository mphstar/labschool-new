<?php

use App\Models\CategoryKeuangan;
use App\Models\Keuangan;
use App\Models\Kelas;
use App\Models\Ppdb;
use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\Surat;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/report')->assertRedirect('/login');
});

test('authenticated users can visit the report page', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/report')->assertOk();
});

test('report page aggregates keuangan, presensi, surat, siswa, and ppdb data', function () {
    $category = CategoryKeuangan::factory()->create(['name' => 'SPP']);

    $year = now()->year;

    Keuangan::factory()->create([
        'category_keuangan_id' => $category->id,
        'jenis' => 'masuk',
        'jumlah' => 500_000,
        'tanggal' => "{$year}-01-15",
    ]);

    Keuangan::factory()->create([
        'category_keuangan_id' => $category->id,
        'jenis' => 'keluar',
        'jumlah' => 100_000,
        'tanggal' => "{$year}-02-10",
    ]);

    Presensi::factory()->create([
        'status' => 'hadir',
        'tanggal' => "{$year}-03-01 08:00:00",
    ]);
    Presensi::factory()->create([
        'status' => 'alfa',
        'tanggal' => "{$year}-03-01 08:00:00",
    ]);

    Surat::factory()->create([
        'jenis' => 'masuk',
        'tanggal_surat' => "{$year}-02-05",
    ]);
    Surat::factory()->create([
        'jenis' => 'keluar',
        'tanggal_surat' => "{$year}-04-05",
    ]);

    Ppdb::factory()->create(['jenis_kelamin' => 'L']);

    $this->actingAs(User::factory()->create())
        ->get('/report')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('report/index')
            ->where('reportData.meta.tahun', $year)
            ->where('reportData.keuangan.totalPemasukan', 500_000)
            ->where('reportData.keuangan.totalPengeluaran', 100_000)
            ->where('reportData.keuangan.saldo', 400_000)
            ->where('reportData.presensi.total.hadir', 1)
            ->where('reportData.presensi.total.alfa', 1)
            ->where('reportData.surat.totalMasuk', 1)
            ->where('reportData.surat.totalKeluar', 1)
            ->where('reportData.ppdb.total', 1)
        );
});

test('report page filters data by year query parameter', function () {
    $year = now()->year;
    $lastYear = $year - 1;

    Keuangan::factory()->create([
        'jenis' => 'masuk',
        'jumlah' => 999_000,
        'tanggal' => "{$lastYear}-01-15",
    ]);

    $this->actingAs(User::factory()->create())
        ->get('/report', ['year' => $year])
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('report/index')
            ->where('reportData.selectedYear', $year)
            ->where('reportData.keuangan.totalPemasukan', 0)
        );
});

<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$models = [
    App\Models\TahunAkademik::class,
    App\Models\Kelas::class,
    App\Models\MataPelajaran::class,
    App\Models\CategoryKeuangan::class,
    App\Models\Materi::class,
    App\Models\Keuangan::class,
    App\Models\Surat::class,
    App\Models\Siswa::class,
    App\Models\RiwayatKelas::class,
    App\Models\Nilai::class,
    App\Models\DetailNilai::class,
    App\Models\Presensi::class,
    App\Models\Ppdb::class,
    App\Models\CapaianKompetensi::class,
];

foreach ($models as $model) {
    echo "Testing factory for $model... ";
    try {
        $model::factory()->make();
        echo "OK\n";
    } catch (\Throwable $e) {
        echo "FAILED: " . $e->getMessage() . "\n";
    }
}

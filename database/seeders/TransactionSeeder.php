<?php

namespace Database\Seeders;

use App\Models\Keuangan;
use App\Models\Materi;
use App\Models\Nilai;
use App\Models\Ppdb;
use App\Models\Presensi;
use App\Models\RiwayatKelas;
use App\Models\Siswa;
use App\Models\Surat;
use App\Models\DetailNilai;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Transactional finance
        Keuangan::factory()->count(20)->create();

        // 2. Letters
        Surat::factory()->count(10)->create();

        // 3. Learning Materials
        Materi::factory()->count(15)->create();

        // 4. Students & Academic History
        // Create students, each with a riwayat_kelas
        Siswa::factory()
            ->count(30)
            ->has(
                RiwayatKelas::factory()
                    ->count(1)
                    ->state(function (array $attributes, Siswa $siswa) {
                        return ['siswa_id' => $siswa->id];
                    }),
                'riwayat_kelas' // Explicit relationship name
            )
            ->create();

        // 5. Grades & Attendance (depend on RiwayatKelas)
        $riwayatKelas = RiwayatKelas::all();

        foreach ($riwayatKelas as $riwayat) {
            // Create grades for each student in some subjects
            Nilai::factory()
                ->count(3)
                ->state(['riwayat_kelas_id' => $riwayat->id])
                ->has(DetailNilai::factory()->count(2), 'detail_nilai') // Explicit relationship name
                ->create();

            // Create attendance records
            Presensi::factory()
                ->count(5)
                ->state(['riwayat_kelas_id' => $riwayat->id])
                ->create();
        }

        // 6. PPDB Registrations
        Ppdb::factory()->count(10)->create();
    }
}

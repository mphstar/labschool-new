<?php

namespace Database\Seeders;

use App\Models\CapaianKompetensi;
use App\Models\CategoryKeuangan;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\PengaturanPpdb;
use App\Models\PengaturanWebsite;
use App\Models\TahunAkademik;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Settings
        PengaturanWebsite::create([
            'name' => 'Labschool Cendekia',
            'logo' => 'https://via.placeholder.com/150',
            'favicon' => 'https://via.placeholder.com/32',
        ]);

        PengaturanPpdb::create([
            'title' => 'PPDB Tahun 2024/2025',
            'description' => 'Penerimaan Peserta Didik Baru',
            'no_rekening' => '1234567890',
            'atas_nama' => 'Yayasan Labschool',
            'biaya_pendaftaran' => 150000,
        ]);

        // Academic Years
        TahunAkademik::factory()->create(['name' => '2023/2024']);
        TahunAkademik::factory()->create(['name' => '2024/2025']);

        // Finance Categories
        CategoryKeuangan::factory()->count(5)->create();

        // Competency Achievements
        CapaianKompetensi::factory()->count(4)->create();

        // Classes (must be created after users/teachers)
        // We assume teachers exist from RoleAndUserSeeder
        Kelas::factory()->count(6)->create();

        // Subjects (linked to classes)
        MataPelajaran::factory()->count(10)->create();
    }
}

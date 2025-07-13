<?php

namespace Database\Seeders;

use App\Models\PengaturanPpdb;
use App\Models\PengaturanWebsite;
use Illuminate\Database\Seeder;

class PengaturanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PengaturanWebsite::create([
            'name' => 'Labschool',
            'logo' => 'default.png',
        ]);

        PengaturanPpdb::create([
            'title' => 'Pendaftaran Peserta Didik Baru (PPDB)',
            'description' => 'Silakan lengkapi formulir pendaftaran di bawah ini dengan data yang benar',
            'no_rekening' => '1234567890',
            'atas_nama' => 'Labschool',
            'biaya_pendaftaran' => 500000,
        ]);
    }
}

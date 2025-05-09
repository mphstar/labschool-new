<?php

namespace Database\Seeders;

use App\Models\PengaturanWebsite;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
    }
}

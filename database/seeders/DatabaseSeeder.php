<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Materi;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $kelas = ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"];
        $mapel = ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "IPA", "IPS"];

        foreach ($kelas as $k) {
            $kel = new Kelas();
            $kel->name = $k;
            $kel->save();

            foreach ($mapel as $m) {
                $map = new MataPelajaran();
                $map->name = $m;
                $map->kelas_id = $kel->id;
                $map->kategori = 'wajib';
                $map->save();
            }
        }

        User::factory()->create([
            'name' => 'Bintang',
            'email' => 'bintang@gmail.com',
            'password' => bcrypt('12345678'),
        ]);
    }
}

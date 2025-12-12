<?php

namespace Database\Factories;

use App\Models\MataPelajaran;
use App\Models\RiwayatKelas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Nilai>
 */
class NilaiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'riwayat_kelas_id' => RiwayatKelas::factory(),
            'mata_pelajaran_id' => MataPelajaran::inRandomOrder()->first()->id ?? MataPelajaran::factory(),
        ];
    }
}

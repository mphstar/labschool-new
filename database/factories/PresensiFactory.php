<?php

namespace Database\Factories;

use App\Models\RiwayatKelas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Presensi>
 */
class PresensiFactory extends Factory
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
            'status' => $this->faker->randomElement(['hadir', 'izin', 'sakit', 'alfa']),
            'keterangan' => $this->faker->optional()->sentence(),
            'tanggal' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Kelas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MataPelajaran>
 */
class MataPelajaranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = [
            'Matematika',
            'Bahasa Indonesia',
            'Bahasa Inggris',
            'Fisika',
            'Kimia',
            'Biologi',
            'Sejarah',
            'Geografi',
            'Sosiologi',
            'Ekonomi',
            'Seni Budaya',
            'PJOK'
        ];

        return [
            'name' => $this->faker->randomElement($subjects),
            'kategori' => $this->faker->randomElement(['wajib', 'ekskul']),
            'kelas_id' => Kelas::inRandomOrder()->first()->id ?? Kelas::factory(),
        ];
    }
}

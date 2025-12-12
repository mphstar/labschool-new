<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Surat>
 */
class SuratFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nomor_surat' => $this->faker->unique()->bothify('###/SURAT/202#'),
            'perihal' => $this->faker->sentence(4),
            'jenis' => $this->faker->randomElement(['masuk', 'keluar']),
            'pihak' => $this->faker->company(),
            'file_surat' => $this->faker->imageUrl(), // Simulasi file path/url
            'tanggal_surat' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ];
    }
}

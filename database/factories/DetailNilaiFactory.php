<?php

namespace Database\Factories;

use App\Models\Nilai;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DetailNilai>
 */
class DetailNilaiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nilai_id' => Nilai::factory(),
            'nilai' => $this->faker->numberBetween(60, 100),
            'jenis' => $this->faker->randomElement(['materi', 'non-tes', 'tes']),
            'keterangan' => $this->faker->optional()->word(),
        ];
    }
}

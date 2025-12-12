<?php

namespace Database\Factories;

use App\Models\CategoryKeuangan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Keuangan>
 */
class KeuanganFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'keterangan' => $this->faker->sentence(),
            'jenis' => $this->faker->randomElement(['masuk', 'keluar']),
            'category_keuangan_id' => CategoryKeuangan::inRandomOrder()->first()->id ?? CategoryKeuangan::factory(),
            'tipe_pembayaran' => $this->faker->randomElement(['tunai', 'transfer']),
            'bukti_pembayaran' => $this->faker->imageUrl(),
            'jumlah' => $this->faker->numberBetween(100000, 10000000),
            'tanggal' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ];
    }
}

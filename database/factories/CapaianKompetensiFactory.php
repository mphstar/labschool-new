<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CapaianKompetensi>
 */
class CapaianKompetensiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $min = $this->faker->numberBetween(0, 80);
        return [
            'min' => $min,
            'max' => $this->faker->numberBetween($min + 10, 100),
            'label' => $this->faker->word(),
        ];
    }
}

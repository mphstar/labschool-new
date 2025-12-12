<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kelas>
 */
class KelasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $levels = ['X', 'XI', 'XII'];
        $majors = ['IPA', 'IPS'];
        $classes = ['1', '2', '3'];

        // Generate a random class name, but we handle uniqueness by retries in seeder or just accept random collisions if not unique constraint in DB.
        // DB has unique constraint on 'name'.
        // So we should better generate unique names using faker unique, but with a better provider or just Pre-defined array.

        // Let's use a simpler approach for factory: return a valid format. 
        // Uniqueness is hard to guarantee with randomElement combination unless we check.
        // Let's use bothify to add some randomness

        return [
            'name' => $this->faker->unique()->bothify('Kelas ??-##'),
            // e.g. Kelas XA-01 -> maybe too complex.
            // Let's stick to X-A, XI-A.
            // Simple:
            'name' => $this->faker->unique()->regexify('(X|XI|XII)-[A-C]'),
            'user_id' => User::factory(), // Wali kelas
        ];
    }
}

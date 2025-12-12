<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ppdb>
 */
class PpdbFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_lengkap' => $this->faker->name(),
            'nama_panggilan' => $this->faker->firstName(),
            'tempat_lahir' => $this->faker->city(),
            'tanggal_lahir' => $this->faker->date(),
            'jenis_kelamin' => $this->faker->randomElement(['L', 'P']),
            'agama' => $this->faker->randomElement(['Islam', 'Kristen', 'Khatolik', 'Hindu', 'Buddha', 'Khonghucu']),
            'alamat' => $this->faker->address(),
            'no_telepon' => $this->faker->phoneNumber(),
            'pendidikan_sebelumnya' => 'SD ' . $this->faker->Company(),
            'pilihan_seni' => $this->faker->randomElement(['-', 'Seni Musik', 'Seni Tari', 'Seni Rupa', 'Seni Teater', 'Seni Media']),

            // Orang Tua
            'nama_ayah' => $this->faker->name('male'),
            'nama_ibu' => $this->faker->name('female'),
            'pekerjaan_ayah' => $this->faker->jobTitle(),
            'pekerjaan_ibu' => $this->faker->jobTitle(),
            'jalan' => $this->faker->streetName(),
            'kelurahan' => $this->faker->streetSuffix(),
            'kecamatan' => $this->faker->citySuffix(),
            'kabupaten' => $this->faker->city(),
            'provinsi' => $this->faker->state(),

            // Wali
            'nama_wali' => $this->faker->name(),
            'pekerjaan_wali' => $this->faker->jobTitle(),
            'alamat_wali' => $this->faker->address(),
            'no_telepon_wali' => $this->faker->phoneNumber(),

            'bukti_pembayaran' => $this->faker->imageUrl(),
        ];
    }
}

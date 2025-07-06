<?php

namespace Database\Seeders;

use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Nilai;
use App\Models\RiwayatKelas;
use App\Models\TahunAkademik;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID'); // Indonesian locale

        $tahunAkademik = TahunAkademik::create([
            'name' => '2025/2026',
        ]);

        // Nama-nama Indonesia yang umum
        $namaLakiLaki = [
            'Ahmad Rizki',
            'Budi Santoso',
            'Chandra Wijaya',
            'Dedi Kurniawan',
            'Eko Prasetyo',
            'Fajar Nugroho',
            'Galih Pratama',
            'Hendra Saputra',
            'Indra Gunawan',
            'Joko Susilo',
            'Kevin Adiputra',
            'Lukman Hakim',
            'Muhammad Iqbal',
            'Nanda Pratama',
            'Oscar Ramadhan',
            'Pandu Wicaksono',
            'Rizal Maulana',
            'Satria Bagus',
            'Taufik Hidayat',
            'Yoga Mahendra',
            'Arif Rahman',
            'Bayu Anggara',
            'Danang Wibowo',
            'Febrian Aldi',
            'Gilang Ramadhan',
            'Hadi Permana',
            'Irfan Maulana',
            'Krisna Bayu',
            'Leo Andika',
            'Mario Pratama',
            'Naufal Akbar',
            'Rangga Putra',
            'Septian Dwi',
            'Tegar Wijaya',
            'Vino Saputra'
        ];

        $namaPerempuan = [
            'Adinda Putri',
            'Bella Safira',
            'Citra Dewi',
            'Diah Ayu',
            'Elvira Sari',
            'Fitri Handayani',
            'Gina Puspita',
            'Hani Rahayu',
            'Indah Permata',
            'Jessica Wulandari',
            'Karina Salsabila',
            'Lestari Dewi',
            'Maya Anggraini',
            'Nadya Cantika',
            'Olivia Maharani',
            'Putri Ayu',
            'Rani Kartika',
            'Sari Puspita',
            'Tiana Maharani',
            'Vira Saskia',
            'Anisa Rahman',
            'Devi Kusuma',
            'Fanny Oktavia',
            'Gaby Ananda',
            'Hesti Wulan',
            'Ika Pratiwi',
            'Kania Sari',
            'Linda Ratnasari',
            'Meilani Putri',
            'Nina Safitri',
            'Prima Angelia',
            'Ratna Sari',
            'Sinta Dewi',
            'Vera Amelia',
            'Zahra Aulia'
        ];

        $kotaIndonesia = [
            'Jakarta',
            'Surabaya',
            'Bandung',
            'Medan',
            'Semarang',
            'Makassar',
            'Palembang',
            'Tangerang',
            'Depok',
            'Bekasi',
            'Solo',
            'Batam',
            'Pekanbaru',
            'Bandar Lampung',
            'Malang',
            'Padang',
            'Bogor',
            'Samarinda',
            'Tasikmalaya',
            'Pontianak',
            'Balikpapan',
            'Jambi',
            'Cimahi',
            'Surakarta',
            'Serang',
            'Mataram',
            'Yogyakarta',
            'Denpasar',
            'Banjarmasin',
            'Tegal',
            'Kediri',
            'Jember',
            'Cirebon',
            'Palu',
            'Manado'
        ];

        $pekerjaanOrangTua = [
            'PNS',
            'Guru',
            'Dokter',
            'Perawat',
            'Polisi',
            'TNI',
            'Pedagang',
            'Wiraswasta',
            'Karyawan Swasta',
            'Buruh',
            'Petani',
            'Nelayan',
            'Sopir',
            'Tukang',
            'Cleaning Service',
            'Security',
            'Ibu Rumah Tangga',
            'Pensiunan',
            'Mahasiswa',
            'Tidak Bekerja'
        ];

        $kelurahan = [
            'Kebon Jeruk',
            'Kemang',
            'Senayan',
            'Menteng',
            'Cikini',
            'Tebet',
            'Kuningan',
            'Kelapa Gading',
            'Pluit',
            'Sunter',
            'Tanjung Priok',
            'Cempaka Putih',
            'Senen',
            'Gambir',
            'Sawah Besar',
            'Kemayoran',
            'Johar Baru',
            'Cakung',
            'Kramat Jati',
            'Makasar',
            'Pasar Minggu',
            'Jagakarsa',
            'Mampang Prapatan',
            'Pancoran'
        ];

        $kecamatan = [
            'Menteng',
            'Tanah Abang',
            'Kemayoran',
            'Senen',
            'Cempaka Putih',
            'Johar Baru',
            'Sawah Besar',
            'Gambir',
            'Tanjung Priok',
            'Kelapa Gading',
            'Pademangan',
            'Penjaringan',
            'Pluit',
            'Kalideres',
            'Cengkareng',
            'Kebon Jeruk',
            'Palmerah',
            'Grogol Petamburan',
            'Tambora',
            'Kota Tua',
            'Mangga Besar',
            'Krukut'
        ];

        $kabupaten = [
            'Jakarta Pusat',
            'Jakarta Utara',
            'Jakarta Barat',
            'Jakarta Selatan',
            'Jakarta Timur',
            'Tangerang',
            'Bekasi',
            'Bogor',
            'Depok',
            'Tangerang Selatan'
        ];

        $provinsi = [
            'DKI Jakarta',
            'Jawa Barat',
            'Jawa Tengah',
            'Jawa Timur',
            'Banten',
            'Sumatera Utara',
            'Sumatera Barat',
            'Sumatera Selatan',
            'Kalimantan Timur',
            'Sulawesi Selatan',
            'Bali',
            'Nusa Tenggara Barat'
        ];

        $agama = ['Islam', 'Kristen', 'Khatolik', 'Hindu', 'Buddha'];
        $seniOptions = ['-', 'Seni Musik', 'Seni Tari', 'Seni Rupa', 'Seni Teater', 'Seni Media'];

        // Get all kelas
        $kelasList = Kelas::all();

        if ($kelasList->isEmpty()) {
            echo "No kelas found! Make sure to run DatabaseSeeder first.\n";
            return;
        }

        echo "Found " . $kelasList->count() . " kelas\n";

        foreach ($kelasList as $kelas) {
            echo "Creating students for kelas: " . $kelas->name . "\n";
            // Buat 15 siswa untuk setiap kelas
            for ($i = 0; $i < 15; $i++) {
                $jenisKelamin = $faker->randomElement(['L', 'P']);
                $namaArray = $jenisKelamin == 'L' ? $namaLakiLaki : $namaPerempuan;
                $namaLengkap = $faker->randomElement($namaArray);
                $namaPanggilan = explode(' ', $namaLengkap)[0];

                $siswa = Siswa::create([
                    'nis' => $faker->unique()->numerify('########'),
                    'nisn' => $faker->unique()->numerify('##########'),
                    'nama_lengkap' => $namaLengkap,
                    'nama_panggilan' => $namaPanggilan,
                    'tempat_lahir' => $faker->randomElement($kotaIndonesia),
                    'tanggal_lahir' => $faker->dateTimeBetween('-18 years', '-6 years')->format('Y-m-d'),
                    'jenis_kelamin' => $jenisKelamin,
                    'agama' => $faker->randomElement($agama),
                    'alamat' => 'Jl. ' . $faker->randomElement(['Merdeka', 'Sudirman', 'Gatot Subroto', 'Diponegoro', 'Ahmad Yani', 'Veteran', 'Pahlawan', 'Pemuda']) . ' No. ' . $faker->numberBetween(1, 999) . ', RT.' . $faker->numberBetween(1, 20) . '/RW.' . $faker->numberBetween(1, 15),
                    'no_telepon' => '08' . $faker->numerify('#########'),
                    'pendidikan_sebelumnya' => $faker->randomElement(['TK Negeri 1', 'TK Swasta Al-Azhar', 'TK Kartika', 'TK Dharma Wanita', 'TK Islam Terpadu']),
                    'pilihan_seni' => $faker->randomElement($seniOptions),

                    // Data Orang Tua
                    'nama_ayah' => $faker->randomElement($namaLakiLaki),
                    'nama_ibu' => $faker->randomElement($namaPerempuan),
                    'pekerjaan_ayah' => $faker->randomElement($pekerjaanOrangTua),
                    'pekerjaan_ibu' => $faker->randomElement($pekerjaanOrangTua),
                    'jalan' => 'Jl. ' . $faker->randomElement(['Merdeka', 'Sudirman', 'Gatot Subroto', 'Diponegoro', 'Ahmad Yani', 'Veteran', 'Pahlawan', 'Pemuda']) . ' No. ' . $faker->numberBetween(1, 999),
                    'kelurahan' => $faker->randomElement($kelurahan),
                    'kecamatan' => $faker->randomElement($kecamatan),
                    'kabupaten' => $faker->randomElement($kabupaten),
                    'provinsi' => $faker->randomElement($provinsi),

                    // Data Wali (50% kemungkinan ada wali)
                    'nama_wali' => $faker->boolean(50) ? $faker->randomElement(array_merge($namaLakiLaki, $namaPerempuan)) : null,
                    'pekerjaan_wali' => $faker->boolean(50) ? $faker->randomElement($pekerjaanOrangTua) : null,
                    'alamat_wali' => $faker->boolean(50) ? 'Jl. ' . $faker->randomElement(['Merdeka', 'Sudirman', 'Gatot Subroto', 'Diponegoro', 'Ahmad Yani', 'Veteran', 'Pahlawan', 'Pemuda']) . ' No. ' . $faker->numberBetween(1, 999) : null,
                    'no_telepon_wali' => $faker->boolean(50) ? '08' . $faker->numerify('#########') : null,

                    'tahun_akademik_id' => $tahunAkademik->id,
                ]);

                // Buat riwayat kelas dengan status aktif
                $rk = RiwayatKelas::create([
                    'siswa_id' => $siswa->id,
                    'kelas_id' => $kelas->id,
                    'status' => 'aktif'
                ]);

                $mapel = MataPelajaran::where('kelas_id', $kelas->id)->get();
                foreach ($mapel as $mp) {
                    // Buat nilai awal untuk setiap mata pelajaran
                    Nilai::create([
                        'riwayat_kelas_id' => $rk->id,
                        'mata_pelajaran_id' => $mp->id,
                    ]);
                }
            }
            echo "Created 15 students for " . $kelas->name . "\n";
        }

        $totalSiswa = Siswa::count();
        $totalRiwayat = RiwayatKelas::count();
        echo "StudentSeeder completed!\n";
        echo "Total students created: " . $totalSiswa . "\n";
        echo "Total riwayat kelas created: " . $totalRiwayat . "\n";
    }
}

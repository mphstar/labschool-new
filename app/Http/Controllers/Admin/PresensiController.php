<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Presensi;
use App\Models\TahunAkademik;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresensiController extends Controller
{
    public function index()
    {
        $data = Presensi::with(['riwayat_kelas.siswa.tahun_akademik', 'riwayat_kelas.kelas'])->latest()->get();
        $kelas = Kelas::get();
        $thnakademik = TahunAkademik::get();

        // Logic to fetch and display attendance data
        return Inertia::render('presensi/view', [
            'data' => $data,
            'kelas' => $kelas,
            'thnakademik' => $thnakademik
        ]);
    }
}

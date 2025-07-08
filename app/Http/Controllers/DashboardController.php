<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\User;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Ppdb;
use App\Models\Keuangan;
use App\Models\Presensi;
use App\Models\Materi;
use App\Models\Nilai;
use App\Models\TahunAkademik;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Get current date
        $today = Carbon::today();
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Get basic statistics
        $totalSiswaAktif = Siswa::where('status', 'aktif')->count();
        $totalGuru = User::where('role', 'guru')->count();
        $totalKelas = Kelas::count();
        $totalMapel = MataPelajaran::count();
        $totalPendaftarPpdb = Ppdb::count();

        // Get gender breakdown
        $siswaLaki = Siswa::where('status', 'aktif')->where('jenis_kelamin', 'L')->count();
        $siswaPerempuan = Siswa::where('status', 'aktif')->where('jenis_kelamin', 'P')->count();

        // Get financial data for current month
        $pemasukanBulanIni = Keuangan::where('jenis', 'masuk')
            ->whereMonth('tanggal', $currentMonth)
            ->whereYear('tanggal', $currentYear)
            ->sum('jumlah');

        $pengeluaranBulanIni = Keuangan::where('jenis', 'keluar')
            ->whereMonth('tanggal', $currentMonth)
            ->whereYear('tanggal', $currentYear)
            ->sum('jumlah');

        // Get today's attendance
        $presensiHariIni = Presensi::whereDate('created_at', $today)->count();

        // Get learning activities for current month
        $materiBulanIni = Materi::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Count actual grade entries (detail_nilai) for current month, fallback to nilai count if no detail_nilai
        $detailNilaiCount = DB::table('detail_nilai')
            ->join('nilai', 'detail_nilai.nilai_id', '=', 'nilai.id')
            ->whereMonth('nilai.created_at', $currentMonth)
            ->whereYear('nilai.created_at', $currentYear)
            ->count();
        
        $nilaiBulanIni = $detailNilaiCount > 0 ? $detailNilaiCount : Nilai::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Get average score for current month (from detail_nilai joined with nilai)
        $rataRataNilai = DB::table('detail_nilai')
            ->join('nilai', 'detail_nilai.nilai_id', '=', 'nilai.id')
            ->whereMonth('nilai.created_at', $currentMonth)
            ->whereYear('nilai.created_at', $currentYear)
            ->avg('detail_nilai.nilai');

        // Get current academic year (latest one since there's no status column)
        $tahunAkademikAktif = TahunAkademik::latest('created_at')->first();

        // Get recent activities (last 7 days)
        $recentNilaiCount = DB::table('detail_nilai')
            ->join('nilai', 'detail_nilai.nilai_id', '=', 'nilai.id')
            ->where('nilai.created_at', '>=', Carbon::now()->subDays(7))
            ->count();
        
        // Fallback to nilai count if no detail_nilai
        if ($recentNilaiCount == 0) {
            $recentNilaiCount = Nilai::where('created_at', '>=', Carbon::now()->subDays(7))->count();
        }

        $recentActivities = collect([
            [
                'type' => 'siswa',
                'count' => Siswa::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
                'label' => 'Siswa baru terdaftar'
            ],
            [
                'type' => 'materi',
                'count' => Materi::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
                'label' => 'Materi baru ditambahkan'
            ],
            [
                'type' => 'nilai',
                'count' => $recentNilaiCount,
                'label' => 'Nilai baru diinput'
            ],
            [
                'type' => 'ppdb',
                'count' => Ppdb::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
                'label' => 'Pendaftar PPDB baru'
            ]
        ]);

        // Financial summary for the year
        $financialSummary = [
            'total_pemasukan_tahun' => Keuangan::where('jenis', 'masuk')
                ->whereYear('tanggal', $currentYear)
                ->sum('jumlah'),
            'total_pengeluaran_tahun' => Keuangan::where('jenis', 'keluar')
                ->whereYear('tanggal', $currentYear)
                ->sum('jumlah'),
        ];

        $dashboardData = [
            'totalSiswaAktif' => $totalSiswaAktif,
            'totalGuru' => $totalGuru,
            'totalKelas' => $totalKelas,
            'totalMapel' => $totalMapel,
            'totalPendaftarPpdb' => $totalPendaftarPpdb,
            'pemasukanBulanIni' => $pemasukanBulanIni,
            'pengeluaranBulanIni' => $pengeluaranBulanIni,
            'presensiHariIni' => $presensiHariIni,
            'siswaLaki' => $siswaLaki,
            'siswaPerempuan' => $siswaPerempuan,
            'materiBulanIni' => $materiBulanIni,
            'nilaiBulanIni' => $nilaiBulanIni,
            'rataRataNilai' => $rataRataNilai ? round($rataRataNilai, 2) : 0,
            'tahunAkademikAktif' => $tahunAkademikAktif,
            'recentActivities' => $recentActivities,
            'financialSummary' => $financialSummary,
            'currentMonth' => Carbon::now()->format('F Y'),
            'currentDate' => Carbon::now()->format('d F Y'),
        ];

        return Inertia::render('dashboard', [
            'dashboardData' => $dashboardData
        ]);
    }

    /**
     * Get dashboard statistics for API calls
     */
    public function getStats()
    {
        $today = Carbon::today();
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        return response()->json([
            'siswa_aktif' => Siswa::where('status', 'aktif')->count(),
            'guru_total' => User::where('role', 'guru')->count(),
            'kelas_total' => Kelas::count(),
            'mapel_total' => MataPelajaran::count(),
            'presensi_hari_ini' => Presensi::whereDate('created_at', $today)->count(),
            'pemasukan_bulan_ini' => Keuangan::where('jenis', 'masuk')
                ->whereMonth('tanggal', $currentMonth)
                ->whereYear('tanggal', $currentYear)
                ->sum('jumlah'),
            'pengeluaran_bulan_ini' => Keuangan::where('jenis', 'keluar')
                ->whereMonth('tanggal', $currentMonth)
                ->whereYear('tanggal', $currentYear)
                ->sum('jumlah'),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Keuangan;
use App\Models\Nilai;
use App\Models\Ppdb;
use App\Models\Presensi;
use App\Models\RiwayatKelas;
use App\Models\Siswa;
use App\Models\Surat;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    private const MONTH_LABELS = [
        1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
        7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
    ];

    public function index(Request $request)
    {
        $currentYear = Carbon::now()->year;

        $earliestYear = collect([
            Keuangan::min('tanggal'),
            Surat::min('tanggal_surat'),
            Presensi::min('tanggal'),
            Siswa::min('created_at'),
            Ppdb::min('created_at'),
            Nilai::min('created_at'),
        ])->filter()
            ->map(fn ($date) => Carbon::parse($date)->year)
            ->sort()
            ->first();

        $minYear = max($earliestYear ?? $currentYear, $currentYear - 5);
        $years = range($currentYear, $minYear);

        $selectedYear = (int) $request->query('year', $currentYear);
        if (! in_array($selectedYear, $years, true)) {
            $selectedYear = $currentYear;
        }

        $reportData = [
            'years' => $years,
            'selectedYear' => $selectedYear,
            'keuangan' => $this->keuanganReport($selectedYear),
            'presensi' => $this->presensiReport($selectedYear),
            'surat' => $this->suratReport($selectedYear),
            'siswa' => $this->siswaReport($selectedYear),
            'ppdb' => $this->ppdbReport($selectedYear),
            'nilai' => $this->nilaiReport($selectedYear),
            'meta' => [
                'tahun' => $selectedYear,
                'generatedAt' => Carbon::now()->format('d F Y'),
            ],
        ];

        return Inertia::render('report/index', [
            'reportData' => $reportData,
        ]);
    }

    private function keuanganReport(int $year): array
    {
        $keuangan = Keuangan::whereYear('tanggal', $year)
            ->with('category_keuangan')
            ->get();

        $bulanan = [];
        $perKategori = [];
        $kategoriMap = [];
        $totalPemasukan = 0;
        $totalPengeluaran = 0;

        foreach (self::MONTH_LABELS as $month => $label) {
            $bulanan[$month] = [
                'bulan' => $label,
                'pemasukan' => 0,
                'pengeluaran' => 0,
            ];
        }

        foreach ($keuangan as $item) {
            $month = Carbon::parse($item->tanggal)->month;

            if ($item->jenis === 'masuk') {
                $bulanan[$month]['pemasukan'] += $item->jumlah;
                $totalPemasukan += $item->jumlah;
            } else {
                $bulanan[$month]['pengeluaran'] += $item->jumlah;
                $totalPengeluaran += $item->jumlah;
            }

            $category = $item->category_keuangan?->name ?? 'Tanpa Kategori';
            if (! isset($kategoriMap[$category])) {
                $kategoriMap[$category] = ['pemasukan' => 0, 'pengeluaran' => 0];
            }

            if ($item->jenis === 'masuk') {
                $kategoriMap[$category]['pemasukan'] += $item->jumlah;
            } else {
                $kategoriMap[$category]['pengeluaran'] += $item->jumlah;
            }
        }

        foreach ($kategoriMap as $name => $values) {
            $perKategori[] = [
                'name' => $name,
                'pemasukan' => $values['pemasukan'],
                'pengeluaran' => $values['pengeluaran'],
                'total' => $values['pemasukan'] + $values['pengeluaran'],
            ];
        }

        usort($perKategori, fn ($a, $b) => $b['total'] <=> $a['total']);

        return [
            'bulanan' => array_values($bulanan),
            'perKategori' => $perKategori,
            'totalPemasukan' => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
            'saldo' => $totalPemasukan - $totalPengeluaran,
        ];
    }

    private function presensiReport(int $year): array
    {
        $presensi = Presensi::whereYear('tanggal', $year)->get();

        $bulanan = [];
        $total = ['hadir' => 0, 'izin' => 0, 'sakit' => 0, 'alfa' => 0];

        foreach (self::MONTH_LABELS as $month => $label) {
            $bulanan[$month] = [
                'bulan' => $label,
                'hadir' => 0,
                'izin' => 0,
                'sakit' => 0,
                'alfa' => 0,
            ];
        }

        foreach ($presensi as $item) {
            $month = Carbon::parse($item->tanggal)->month;
            $status = $item->status;

            if (isset($total[$status])) {
                $total[$status]++;
                $bulanan[$month][$status]++;
            }
        }

        $totalAll = array_sum($total);

        return [
            'bulanan' => array_values($bulanan),
            'total' => array_merge($total, ['total' => $totalAll]),
            'kehadiranRate' => $totalAll > 0 ? round($total['hadir'] / $totalAll * 100, 1) : 0,
        ];
    }

    private function suratReport(int $year): array
    {
        $surat = Surat::whereYear('tanggal_surat', $year)->get();

        $bulanan = [];
        $totalMasuk = 0;
        $totalKeluar = 0;

        foreach (self::MONTH_LABELS as $month => $label) {
            $bulanan[$month] = ['bulan' => $label, 'masuk' => 0, 'keluar' => 0];
        }

        foreach ($surat as $item) {
            $month = Carbon::parse($item->tanggal_surat)->month;

            if ($item->jenis === 'masuk') {
                $bulanan[$month]['masuk']++;
                $totalMasuk++;
            } else {
                $bulanan[$month]['keluar']++;
                $totalKeluar++;
            }
        }

        return [
            'bulanan' => array_values($bulanan),
            'totalMasuk' => $totalMasuk,
            'totalKeluar' => $totalKeluar,
            'total' => $totalMasuk + $totalKeluar,
        ];
    }

    private function siswaReport(int $year): array
    {
        $siswa = Siswa::all();

        $siswaLaki = $siswa->where('jenis_kelamin', 'L')->count();
        $siswaPerempuan = $siswa->where('jenis_kelamin', 'P')->count();

        $perStatus = collect([
            'aktif' => $siswa->where('status', 'aktif')->count(),
            'putus' => $siswa->where('status', 'putus')->count(),
            'lulus' => $siswa->where('status', 'lulus')->count(),
        ])->map(fn ($jumlah, $status) => [
            'name' => ucfirst($status),
            'jumlah' => $jumlah,
        ])->values()->all();

        $perKelas = RiwayatKelas::where('riwayat_kelas.status', 'aktif')
            ->join('kelas', 'kelas.id', '=', 'riwayat_kelas.kelas_id')
            ->selectRaw('kelas.name as name, count(*) as jumlah')
            ->groupBy('kelas.id', 'kelas.name')
            ->orderBy('kelas.name')
            ->get()
            ->map(fn ($row) => ['name' => $row->name, 'jumlah' => (int) $row->jumlah])
            ->all();

        $pendaftarBulanan = $this->monthlyCounts(Siswa::whereYear('created_at', $year)->get());

        return [
            'total' => $siswa->count(),
            'perJenisKelamin' => [
                'laki' => $siswaLaki,
                'perempuan' => $siswaPerempuan,
            ],
            'perStatus' => $perStatus,
            'perKelas' => $perKelas,
            'pendaftarBulanan' => $pendaftarBulanan,
        ];
    }

    private function ppdbReport(int $year): array
    {
        $ppdb = Ppdb::all();

        return [
            'total' => $ppdb->count(),
            'perJenisKelamin' => [
                'laki' => $ppdb->where('jenis_kelamin', 'L')->count(),
                'perempuan' => $ppdb->where('jenis_kelamin', 'P')->count(),
            ],
            'pendaftarBulanan' => $this->monthlyCounts(Ppdb::whereYear('created_at', $year)->get()),
        ];
    }

    private function nilaiReport(int $year): array
    {
        $bulanan = [];
        $totalTerinput = 0;

        foreach (self::MONTH_LABELS as $month => $label) {
            $rata = DB::table('detail_nilai')
                ->join('nilai', 'detail_nilai.nilai_id', '=', 'nilai.id')
                ->whereYear('nilai.created_at', $year)
                ->whereMonth('nilai.created_at', $month)
                ->avg('detail_nilai.nilai');

            $count = DB::table('detail_nilai')
                ->join('nilai', 'detail_nilai.nilai_id', '=', 'nilai.id')
                ->whereYear('nilai.created_at', $year)
                ->whereMonth('nilai.created_at', $month)
                ->count();

            $totalTerinput += $count;

            $bulanan[] = [
                'bulan' => $label,
                'rata' => $rata ? round((float) $rata, 2) : null,
            ];
        }

        $mapelRata = DB::table('detail_nilai')
            ->join('nilai', 'detail_nilai.nilai_id', '=', 'nilai.id')
            ->join('mata_pelajaran', 'nilai.mata_pelajaran_id', '=', 'mata_pelajaran.id')
            ->whereYear('nilai.created_at', $year)
            ->selectRaw('mata_pelajaran.name as name, avg(detail_nilai.nilai) as rata')
            ->groupBy('mata_pelajaran.id', 'mata_pelajaran.name')
            ->orderByDesc('rata')
            ->get()
            ->map(fn ($row) => [
                'name' => $row->name,
                'rata' => round((float) $row->rata, 2),
            ])
            ->all();

        return [
            'bulanan' => $bulanan,
            'mapelRata' => $mapelRata,
            'totalTerinput' => $totalTerinput,
        ];
    }

    private function monthlyCounts($collection): array
    {
        $counts = array_fill(1, 12, 0);

        foreach ($collection as $item) {
            $counts[Carbon::parse($item->created_at)->month]++;
        }

        return collect(self::MONTH_LABELS)
            ->map(fn ($label, $month) => [
                'bulan' => $label,
                'jumlah' => $counts[$month],
            ])
            ->values()
            ->all();
    }
}

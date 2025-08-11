<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailNilai;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Siswa;
use App\Models\TahunAkademik;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class NilaiController extends Controller
{
    public function index($id)
    {
        $mapel = MataPelajaran::findOrFail($id);
        $data = Siswa::with(['kelas_aktif.kelas', 'kelas_aktif.nilai_mapel.detail_nilai', 'tahun_akademik'])->whereHas('kelas_aktif', function ($q) use ($mapel) {
            $q->where('kelas_id', $mapel->kelas_id);
        })->latest()->get();

        $kelas = Kelas::get();
        $tahun_akademik = TahunAkademik::get();

        return Inertia::render('nilai/view', [
            'data' => $data,
            'kelas' => $kelas,
            'mapel' => $mapel,
            'tahun_akademik' => $tahun_akademik,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nilai_id' => 'required|exists:nilai,id',
            'nilai' => 'required|numeric|min:0|max:100',
            'jenis' => 'required|in:materi,non-tes,tes',
            'keterangan' => 'required|string|max:255',
        ], []);

        DB::beginTransaction();

        try {
            DetailNilai::create([
                'nilai_id' => $request->nilai_id,
                'nilai' => $request->nilai,
                'jenis' => $request->jenis,
                'keterangan' => $request->keterangan,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Nilai added successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'data' => 'required',
        ], []);

        DB::beginTransaction();

        try {
            foreach ($request->data as $res) {
                $data = DetailNilai::find($res['id']);
                if ($data) {
                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Nilai deleted successfully');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();

            throw ValidationException::class::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }

    public function delete(Request $request)
    {
        DB::beginTransaction();

        try {
            DetailNilai::findOrFail($request->id)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Nilai deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:detail_nilai,id',
            'nilai' => 'required|numeric|min:0|max:100',
            'jenis' => 'required|in:sas,sat',
            'keterangan' => 'required|string|max:255',
        ], []);

        DB::beginTransaction();

        try {
            DetailNilai::findOrFail($request->id)->update([
                'nilai' => $request->nilai,
                'jenis' => $request->jenis,
                'keterangan' => $request->keterangan,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Nilai updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }

    public function detailIndex($id, $nilai_id)
    {

        $siswa = Siswa::whereHas('riwayat_kelas.nilai', function ($query) use ($nilai_id) {
            $query->where('id', $nilai_id);
        })->first();

        $data = DetailNilai::where('nilai_id', $nilai_id)->latest()->get();

        $mapel = MataPelajaran::findOrFail($id);

        return Inertia::render('nilai/detail/view', [
            'data' => $data,
            'mapel' => $mapel,
            'siswa' => $siswa,
            'nilai_id' => $nilai_id,
        ]);
    }

    public function cetak()
    {
        $data = [
            'nama' => 'Albert Al Jazari',
            'nis' => '2023010008',
            'nisn' => '3159384030',
            'semester' => 1,
            'kelas' => '2A',
            'tahun_ajaran' => '2024/2025',
            'mata_pelajaran' => [
                ['no' => 1, 'nama' => 'Pendidikan Agama Islam dan Budi Pekerti', 'nilai' => 85, 'capaian' => 'Sangat Baik dalam memahami ajaran agama'],
                ['no' => 2, 'nama' => 'Pendidikan Pancasila', 'nilai' => 80, 'capaian' => 'Baik dalam memahami nilai-nilai Pancasila'],
                ['no' => 3, 'nama' => 'Bahasa Indonesia', 'nilai' => 75, 'capaian' => 'Cukup aktif dalam berbicara dan menulis'],
                ['no' => 4, 'nama' => 'Matematika', 'nilai' => 90, 'capaian' => 'Sangat baik dalam berhitung dan logika'],
                ['no' => 5, 'nama' => 'PJOK', 'nilai' => 78, 'capaian' => 'Cukup baik dalam aktivitas jasmani'],
                ['no' => 6, 'nama' => 'Seni Musik', 'nilai' => 82, 'capaian' => 'Menunjukkan minat dalam bermain alat musik'],
                ['no' => 7, 'nama' => 'Bahasa Jawa', 'nilai' => 88, 'capaian' => 'Baik dalam membaca dan menulis aksara Jawa'],
                ['no' => 8, 'nama' => 'Baca Tulis Al-Qur\'an (BTA)', 'nilai' => 91, 'capaian' => 'Sangat lancar membaca Al-Qur\'an']
            ],
            'ekskul' => [
                ['nama' => 'Pramuka', 'predikat' => 'A', 'keterangan' => 'Aktif'],
                ['nama' => 'Futsal', 'predikat' => 'B', 'keterangan' => 'Cukup Aktif']
            ],
            'prestasi' => [
                'Juara 1 Lomba Mewarnai',
                'Juara 2 Olimpiade Matematika'
            ],
            'ketidakhadiran' => [
                'sakit' => 1,
                'ijin' => 0,
                'tanpa_keterangan' => 0
            ],
            'wali_kelas' => 'IFTITAH ADELIA, S.Pd.',
            'kepala_sekolah' => 'ERVAN PRASETYO, S.Pd., MOS., MCE.',
            'tanggal_cetak' => '20 Desember 2024'
        ];

        $pdf = Pdf::loadView('rapor.pdf', compact('data'));
        return $pdf->stream('rapor.pdf');
    }
}

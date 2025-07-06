<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CapaianKompetensi;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\RiwayatKelas;
use App\Models\Siswa;
use App\Models\TahunAkademik;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class SiswaController extends Controller
{
    public function index()
    {
        $data = Siswa::with(['kelas_aktif.kelas', 'tahun_akademik'])->where('status', 'aktif')->latest()->get();
        $kelas = Kelas::get();
        $tahun_akademik = TahunAkademik::get();


        return Inertia::render('siswa/view', [
            'data' => $data,
            'kelas' => $kelas,
            'tahun_akademik' => $tahun_akademik,
        ]);
    }

    public function create()
    {
        $kelas = Kelas::get();
        $thnakademik = TahunAkademik::get();

        return Inertia::render('siswa/create', [
            'kelas' => $kelas,
            'thnakademik' => $thnakademik,
        ]);
    }

    public function edit($id)
    {
        $data = Siswa::findOrFail($id);

        return Inertia::render('siswa/create', [
            'siswa' => $data,
        ]);
    }

    public function ubahKelas(Request $request)
    {
        $validasi = [
            'siswa_id' => 'required|exists:siswa,id',
            'kelas_id' => 'required|exists:kelas,id',
            'riwayat_kelas_id' => 'required|exists:riwayat_kelas,id',
            'status' => 'required|in:selesai,ulang',
            'status_siswa' => 'required|in:aktif,putus,lulus',
            'kelas_selanjutnya' => 'nullable|exists:kelas,id'
        ];

        if ($request->status == 'selesai' && $request->status_siswa == 'aktif') {
            $validasi['kelas_selanjutnya'] = 'required|exists:kelas,id';
        }

        $request->validate($validasi, []);

        DB::beginTransaction();

        try {

            $kelasNow = RiwayatKelas::findOrFail($request->riwayat_kelas_id);
            $kelasNow->update([
                'status' => $request->status,
            ]);

            if ($request->status_siswa == 'aktif') {
                if ($request->status == 'selesai') {
                    $kelasNext = RiwayatKelas::create([
                        'siswa_id' => $request->siswa_id,
                        'kelas_id' => $request->kelas_selanjutnya,
                        'status' => 'aktif',
                    ]);

                    $mapel = MataPelajaran::where('kelas_id', $request->kelas_selanjutnya)->get();

                    foreach ($mapel as $item) {
                        $kelasNext->nilai()->create([
                            'mata_pelajaran_id' => $item->id,
                        ]);
                    }
                } else {
                    $kelasNext = RiwayatKelas::create([
                        'siswa_id' => $request->siswa_id,
                        'kelas_id' => $request->kelas_id,
                        'status' => 'aktif',
                    ]);

                    $mapel = MataPelajaran::where('kelas_id', $request->kelas_id)->get();
                    foreach ($mapel as $item) {
                        $kelasNext->nilai()->create([
                            'mata_pelajaran_id' => $item->id,
                        ]);
                    }
                }
            } elseif ($request->status_siswa == 'putus') {
                Siswa::findOrFail($request->siswa_id)->update([
                    'status' => 'putus',
                ]);
            } else {
                Siswa::findOrFail($request->siswa_id)->update([
                    'status' => 'lulus',
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Kelas siswa berhasil diubah');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();

            throw ValidationException::class::withMessages([
                'error' => 'Internal Server Error',
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_akademik_id' => 'required|exists:tahun_akademik,id',
            'nis' => 'required|string|max:20',
            'nisn' => 'required|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'nama_panggilan' => 'required|string|max:50',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|in:Islam,Kristen,Hindu,Buddha,Khonghucu,Khatolik',
            'alamat' => 'required|string|max:255',
            'no_telepon' => 'required|string|max:15',
            'pendidikan_sebelumnya' => 'required|string|max:255',
            'pilihan_seni' => 'nullable|string|max:100',

            // informasi orang tua
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:100',
            'pekerjaan_ibu' => 'nullable|string|max:100',
            'jalan' => 'nullable|string|max:255',
            'kelurahan' => 'nullable|string|max:100',
            'kecamatan' => 'nullable|string|max:100',
            'kabupaten' => 'nullable|string|max:100',
            'provinsi' => 'nullable|string|max:100',

            // informasi wali
            'nama_wali' => 'nullable|string|max:255',
            'pekerjaan_wali' => 'nullable|string|max:100',
            'alamat_wali' => 'nullable|string|max:255',
            'no_telepon_wali' => 'nullable|string|max:15',
        ], [
            'kelas_id.required' => 'Kelas harus dipilih',
        ]);

        DB::beginTransaction();

        try {
            $req = $request->except('kelas_id');

            $siswa = Siswa::create($req);

            $riwayatKelas = $siswa->riwayat_kelas()->create([
                'kelas_id' => $request->kelas_id,
                'status' => 'aktif',
            ]);

            $mapel = MataPelajaran::where('kelas_id', $request->kelas_id)->get();
            foreach ($mapel as $item) {
                $riwayatKelas->nilai()->create([
                    'mata_pelajaran_id' => $item->id,
                ]);
            }

            DB::commit();

            return redirect()->route('siswa.index')->with('success', 'Siswa created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            throw ValidationException::withMessages([
                'message' => $e->getMessage(),
                'error' => 'Internal Server Error',
            ]);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:siswa,id',
            'nis' => 'required|string|max:20',
            'nisn' => 'required|string|max:20',
            'nama_lengkap' => 'required|string|max:255',
            'nama_panggilan' => 'required|string|max:50',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|in:Islam,Kristen,Hindu,Buddha,Khonghucu,Khatolik',
            'alamat' => 'required|string|max:255',
            'no_telepon' => 'required|string|max:15',
            'pendidikan_sebelumnya' => 'required|string|max:255',
            'pilihan_seni' => 'nullable|string|max:100',

            // informasi orang tua
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:100',
            'pekerjaan_ibu' => 'nullable|string|max:100',
            'jalan' => 'nullable|string|max:255',
            'kelurahan' => 'nullable|string|max:100',
            'kecamatan' => 'nullable|string|max:100',
            'kabupaten' => 'nullable|string|max:100',
            'provinsi' => 'nullable|string|max:100',

            // informasi wali
            'nama_wali' => 'nullable|string|max:255',
            'pekerjaan_wali' => 'nullable|string|max:100',
            'alamat_wali' => 'nullable|string|max:255',
            'no_telepon_wali' => 'nullable|string|max:15',

        ]);

        DB::beginTransaction();

        try {
            Siswa::findOrFail($request->id)->update($request->all());

            DB::commit();

            return redirect()->route('siswa.index')->with('success', "Siswa updated successfully.");
        } catch (\Exception $e) {
            DB::rollBack();

            throw ValidationException::withMessages([
                'message' => $e->getMessage(),
                'error' => 'Internal Server Error',
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
                $data = Siswa::find($res['id']);
                if ($data) {
                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Siswa deleted successfully');
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
            Siswa::findOrFail($request->id)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Siswa deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'message' => $e->getMessage(),
                'error' => 'Internal Server Error',
            ]);
        }
    }

    public function generateQRCodePdf(Request $request)
    {
        $request->validate([
            'tahun_akademik' => 'required',
            'kelas' => 'required',
        ]);

        $siswa = Siswa::where('tahun_akademik_id', $request->tahun_akademik)
            ->whereHas('riwayat_kelas', function ($query) use ($request) {
                $query->where('kelas_id', $request->kelas)->where('status', 'aktif');
            })
            ->get();

        // Generate QR PNG base64 untuk setiap siswa
        $qrData = $siswa->map(function ($item) {
            $qrPng = QrCode::format('png')->size(120)->generate($item->nis);
            $qrBase64 = 'data:image/png;base64,' . base64_encode($qrPng);
            return [
                'nama' => $item->nama,
                'nis' => $item->nis,
                'qr' => $qrBase64,
            ];
        });

        $pdf = Pdf::loadView('pdf.qrcode-siswa', [
            'qrData' => $qrData,
            'kelas' => Kelas::find($request->kelas),
            'tahun_akademik' => TahunAkademik::find($request->tahun_akademik),
        ]);
        return $pdf->download('qrcode-siswa.pdf');
    }

    public function cetakRapor($id)
    {

        $siswa = Siswa::with(['kelas_aktif.kelas', 'kelas_aktif.nilai.detail_nilai', 'kelas_aktif.nilai.mata_pelajaran'])
            ->findOrFail($id);

        $capaian = CapaianKompetensi::get();

        $nilai = $siswa->kelas_aktif->nilai->map(function ($item, $key) use ($capaian) {
            $nsum = $item->detail_nilai->where('jenis', 'materi')->avg('nilai') ?? 0;
            $nsat_sas = $item->detail_nilai->where('jenis', '!=', 'materi')->avg('nilai') ?? 0;

            // Ambil nilai materi tertinggi dan keterangannya
            $nilai_materi = $item->detail_nilai->where('jenis', 'materi');

            $nilai_tertinggi = [
                'nilai' => $nilai_materi->max('nilai') ?? 0,
                'keterangan' => $nilai_materi->where('nilai', $nilai_materi->max('nilai'))->first()->keterangan ?? 'Tidak Diketahui',
            ];

            $nilai_terendah = [
                'nilai' => $nilai_materi->min('nilai') ?? 0,
                'keterangan' => $nilai_materi->where('nilai', $nilai_materi->min('nilai'))->first()->keterangan ?? 'Tidak Diketahui',
            ];

            $nr = ($nsum + $nsat_sas) / 2;

            return [
                'no' => $key + 1,
                'nama' => $item->mata_pelajaran->name,
                'nilai' => [
                    'nsum' => $nsum,
                    'nsat_sas' => $nsat_sas,
                    'nr' => $nr,
                    'nilai_tertinggi' => $nilai_tertinggi['nilai'],
                    'nilai_terendah' => $nilai_terendah['nilai'],
                ],
                'capaian' => [
                    'capaian_1' => $capaian->filter(function ($item) use ($nilai_tertinggi) {
                        return $item->min <= $nilai_tertinggi['nilai'] && $item->max >= $nilai_tertinggi['nilai'];
                    })->first()->label . ' pada ' . $nilai_tertinggi['keterangan'] ?? 'Tidak Diketahui',
                    'capaian_2' => $capaian->filter(function ($item) use ($nilai_terendah) {
                        return $item->min <= $nilai_terendah['nilai'] && $item->max >= $nilai_terendah['nilai'];
                    })->first()->label . ' pada ' . $nilai_terendah['keterangan'] ?? 'Tidak Diketahui',
                ],
            ];
        });

        $data = [
            'nama' => $siswa->nama_lengkap,
            'nis' => $siswa->nis,
            'nisn' => $siswa->nisn,
            'semester' => 1, // Assuming semester is fixed for this example
            'kelas' => $siswa->riwayat_kelas->first()->kelas->name ?? 'Tidak Ditemukan',
            'tahun_ajaran' => $siswa->tahun_akademik->name ?? 'Tidak Diketahui',
            'mata_pelajaran' => $nilai,
            'ekskul' => [], // Assuming ekskul data is not available in this example
            'prestasi' => [], // Assuming prestasi data is not available in this example
            'ketidakhadiran' => [
                'sakit' => 0, // Placeholder, replace with actual data if available
                'ijin' => 0, // Placeholder, replace with actual data if available
                'tanpa_keterangan' => 0 // Placeholder, replace with actual data if available
            ],
            'wali_kelas' => $siswa->riwayat_kelas->first()->kelas->wali_kelas ?? 'Tidak Ditemukan',
            'kepala_sekolah' => 'ERVAN PRASETYO, S.Pd., MOS., MCE.', // Assuming fixed kepala sekolah
            'tanggal_cetak' => now()->format('d F Y'),
        ];


        $pdf = Pdf::loadView('rapor.pdf', [
            'data' => $data,
        ]);

        return $pdf->stream('rapor-' . $siswa->nama_lengkap . '.pdf', []);
    }
}

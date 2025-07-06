<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Ppdb;
use App\Models\RiwayatKelas;
use App\Models\Siswa;
use App\Models\TahunAkademik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PpdbController extends Controller
{
    /**
     * Display the PPDB index page.
     */
    public function index()
    {
        return Inertia::render('ppdb/Register', []);
    }

    /**
     * Display the PPDB data index page.
     */
    public function dataIndex()
    {
        $data = Ppdb::latest()->get();
        $kelas = Kelas::get();
        $tahun_akademik = TahunAkademik::get();

        return Inertia::render('ppdb/view', [
            'data' => $data,
            'kelas' => $kelas,
            'tahun_akademik' => $tahun_akademik,
        ]);
    }

    /**
     * Store a new PPDB registration.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nama_panggilan' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|in:Islam,Kristen,Khatolik,Hindu,Buddha,Khonghucu',
            'alamat' => 'required|string',
            'no_telepon' => 'nullable|string|max:20',
            'pendidikan_sebelumnya' => 'nullable|string|max:255',
            'pilihan_seni' => 'nullable|in:-,Seni Musik,Seni Tari,Seni Rupa,Seni Teater,Seni Media',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'jalan' => 'nullable|string',
            'kelurahan' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:255',
            'kabupaten' => 'nullable|string|max:255',
            'provinsi' => 'nullable|string|max:255',
            'nama_wali' => 'nullable|string|max:255',
            'pekerjaan_wali' => 'nullable|string|max:255',
            'alamat_wali' => 'nullable|string',
            'no_telepon_wali' => 'nullable|string|max:20',
        ]);

        try {
            Ppdb::create($validated);

            return back()->with('success', 'Pendaftaran PPDB berhasil disimpan!');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menyimpan pendaftaran: ' . $e->getMessage());
        }
    }

    /**
     * Move PPDB data to Siswa table
     */
    public function moveToSiswa(Request $request)
    {
        $request->validate([
            'ppdb_id' => 'required|exists:ppdb,id',
            'nis' => 'required|string|max:20|unique:siswa,nis',
            'nisn' => 'required|string|max:20|unique:siswa,nisn',
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_akademik_id' => 'required|exists:tahun_akademik,id',
        ], [
            'ppdb_id.required' => 'Data PPDB tidak valid',
            'nis.required' => 'NIS wajib diisi',
            'nis.unique' => 'NIS sudah digunakan',
            'nisn.required' => 'NISN wajib diisi',
            'nisn.unique' => 'NISN sudah digunakan',
            'kelas_id.required' => 'Kelas harus dipilih',
            'tahun_akademik_id.required' => 'Tahun akademik harus dipilih',
        ]);

        DB::beginTransaction();

        try {
            $ppdb = Ppdb::findOrFail($request->ppdb_id);

            // Create siswa from ppdb data
            $siswaData = [
                'nis' => $request->nis,
                'nisn' => $request->nisn,
                'nama_lengkap' => $ppdb->nama_lengkap,
                'nama_panggilan' => $ppdb->nama_panggilan,
                'tempat_lahir' => $ppdb->tempat_lahir,
                'tanggal_lahir' => $ppdb->tanggal_lahir,
                'jenis_kelamin' => $ppdb->jenis_kelamin,
                'agama' => $ppdb->agama,
                'alamat' => $ppdb->alamat,
                'no_telepon' => $ppdb->no_telepon,
                'pendidikan_sebelumnya' => $ppdb->pendidikan_sebelumnya,
                'pilihan_seni' => $ppdb->pilihan_seni,
                'nama_ayah' => $ppdb->nama_ayah,
                'nama_ibu' => $ppdb->nama_ibu,
                'pekerjaan_ayah' => $ppdb->pekerjaan_ayah,
                'pekerjaan_ibu' => $ppdb->pekerjaan_ibu,
                'jalan' => $ppdb->jalan,
                'kelurahan' => $ppdb->kelurahan,
                'kecamatan' => $ppdb->kecamatan,
                'kabupaten' => $ppdb->kabupaten,
                'provinsi' => $ppdb->provinsi,
                'nama_wali' => $ppdb->nama_wali,
                'pekerjaan_wali' => $ppdb->pekerjaan_wali,
                'alamat_wali' => $ppdb->alamat_wali,
                'no_telepon_wali' => $ppdb->no_telepon_wali,
                'tahun_akademik_id' => $request->tahun_akademik_id,
            ];

            $siswa = Siswa::create($siswaData);

            // Create riwayat kelas
            $riwayatKelas = $siswa->riwayat_kelas()->create([
                'kelas_id' => $request->kelas_id,
                'status' => 'aktif',
            ]);

            // Create nilai entries for all mata pelajaran in the class
            $mataPelajaran = MataPelajaran::where('kelas_id', $request->kelas_id)->get();
            foreach ($mataPelajaran as $mapel) {
                $riwayatKelas->nilai()->create([
                    'mata_pelajaran_id' => $mapel->id,
                ]);
            }

            // Delete PPDB data after successful migration
            $ppdb->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Data berhasil dipindahkan ke siswa!');
        } catch (\Exception $e) {
            DB::rollBack();

            throw ValidationException::withMessages([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Delete PPDB data
     */
    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:ppdb,id',
        ]);

        try {
            $ppdb = Ppdb::findOrFail($request->id);
            $ppdb->delete();

            return redirect()->back()->with('success', 'Data PPDB berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }

    /**
     * Delete multiple PPDB data
     */
    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'data' => 'required|array',
            'data.*.id' => 'required|exists:ppdb,id',
        ]);

        DB::beginTransaction();

        try {
            $ids = collect($request->data)->pluck('id');
            Ppdb::whereIn('id', $ids)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Data PPDB berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\RiwayatKelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index()
    {
        $data = Siswa::with(['kelas_aktif.kelas'])->latest()->get();
        $kelas = Kelas::get();

        return Inertia::render('siswa/view', [
            'data' => $data,
            'kelas' => $kelas,
        ]);
    }

    public function create()
    {
        $kelas = Kelas::get();
        return Inertia::render('siswa/create', [
            'kelas' => $kelas,
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

            'kelas_selanjutnya' => 'nullable|exists:kelas,id',
        ];

        if ($request->status == 'selesai') {
            $validasi['kelas_selanjutnya'] = 'required|exists:kelas,id';
        }

        $request->validate($validasi, []);

        DB::beginTransaction();

        try {

            $kelasNow = RiwayatKelas::findOrFail($request->riwayat_kelas_id);
            $kelasNow->update([
                'status' => $request->status,
            ]);

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
}

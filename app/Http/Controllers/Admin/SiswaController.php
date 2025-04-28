<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index()
    {
        $data = Siswa::latest()->get();

        return Inertia::render('siswa/view', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        return Inertia::render('siswa/create');
    }

    public function edit($id)
    {
        $data = Siswa::findOrFail($id);

        return Inertia::render('siswa/create', [
            'siswa' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
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
            Siswa::create($request->all());

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

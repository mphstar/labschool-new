<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailNilai;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class NilaiController extends Controller
{
    public function index($id)
    {
        $data = Siswa::with(['kelas_aktif.kelas', 'kelas_aktif.nilai_mapel.detail_nilai'])->latest()->get();
        $kelas = Kelas::get();

        $mapel = MataPelajaran::findOrFail($id);

        return Inertia::render('nilai/view', [
            'data' => $data,
            'kelas' => $kelas,
            'mapel' => $mapel,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nilai_id' => 'required|exists:nilai,id',
            'nilai' => 'required|numeric|min:0|max:100',
        ], []);

        DB::beginTransaction();

        try {
            DetailNilai::create([
                'nilai_id' => $request->nilai_id,
                'nilai' => $request->nilai,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Nilai added successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
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
        ], []);

        DB::beginTransaction();

        try {
            DetailNilai::findOrFail($request->id)->update([
                'nilai' => $request->nilai,
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
}

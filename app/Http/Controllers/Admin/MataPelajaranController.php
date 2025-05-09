<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Nilai;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MataPelajaranController extends Controller
{
    public function index()
    {
        $data = MataPelajaran::with(['kelas'])->latest()->get();
        $kelas = Kelas::latest()->get();

        return Inertia::render('mata-pelajaran/view', [
            'data' => $data,
            'kelas' => $kelas,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:mata_pelajaran',
            'kategori' => 'required|in:wajib,ekskul',
            'kelas_id' => 'required|exists:kelas,id',
        ], []);

        DB::beginTransaction();

        try {
            $mp = MataPelajaran::create([
                'name' => $request->name,
                'kategori' => $request->kategori,
                'kelas_id' => $request->kelas_id,
            ]);

            // Create a new record in the 'detail_nilai' table for each student in the class
            $siswa = Siswa::with(['kelas_aktif'])->whereHas('kelas_aktif', function ($query) use ($request) {
                $query->where('kelas_id', $request->kelas_id);
            })->get();

            foreach ($siswa as $s) {
                $nl = Nilai::where('riwayat_kelas_id', $s->kelas_aktif->id)->where('mata_pelajaran_id', $mp->id)->first();
                if (!$nl) {
                    Nilai::create([
                        'riwayat_kelas_id' => $s->kelas_aktif->id,
                        'mata_pelajaran_id' => $mp->id,
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Mata pelajaran created successfully');
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
                $data = MataPelajaran::find($res['id']);
                if ($data) {
                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Mata pelajaran deleted successfully');
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
            MataPelajaran::findOrFail($request->id)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Kelas deleted successfully');
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
            'id' => 'required|exists:mata_pelajaran,id',
            'name' => 'required|string|max:255|unique:mata_pelajaran,name,' . $request->id,
            'kategori' => 'required|in:wajib,ekskul',
            'kelas_id' => 'required|exists:kelas,id',
        ], []);

        DB::beginTransaction();

        try {
            $data = MataPelajaran::findOrFail($request->id);
            $data->name = $request->name;
            $data->kategori = $request->kategori;
            $data->kelas_id = $request->kelas_id;
            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Mata pelajaran updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }
}

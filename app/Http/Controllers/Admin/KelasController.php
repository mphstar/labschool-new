<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\RiwayatKelas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        $data = Kelas::with('guru')->latest()->get();
        $guru = User::where('role', 'guru')->get();

        return Inertia::render('kelas/view', [
            'data' => $data,
            'guru' => $guru,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:kelas',
            'user_id' => 'nullable|exists:users,id',
        ], []);

        DB::beginTransaction();

        try {
            Kelas::create([
                'name' => $request->name,
                'user_id' => $request->user_id,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Kelas created successfully');
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
                $data = Kelas::find($res['id']);
                if ($data) {
                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Kelas deleted successfully');
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
            Kelas::findOrFail($request->id)->delete();

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
            'id' => 'required|exists:kelas,id',
            'name' => 'required|string|max:255|unique:kelas,name,' . $request->id,
            'user_id' => 'nullable|exists:users,id',
        ], []);

        DB::beginTransaction();

        try {
            $data = Kelas::findOrFail($request->id);
            $data->name = $request->name;
            $data->user_id = $request->user_id;
            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Kelas updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }

    public function detailPrestasi($kelas_id)
    {
        $kelas = Kelas::with('guru')->findOrFail($kelas_id);

        // Get siswa aktif in this class who have prestasi
        $data = RiwayatKelas::with(['siswa.prestasi', 'siswa.kelas_aktif.kelas'])
            ->where('kelas_id', $kelas_id)
            ->where('status', 'aktif')
            ->whereHas('siswa.prestasi')
            ->get()
            ->map(function ($item) {
                return [
                    'siswa' => $item->siswa,
                    'prestasi' => $item->siswa->prestasi,
                ];
            });

        return Inertia::render('kelas/prestasi', [
            'kelas' => $kelas,
            'data' => $data,
        ]);
    }

    public function detailKenakalan($kelas_id)
    {
        $kelas = Kelas::with('guru')->findOrFail($kelas_id);

        // Get siswa aktif in this class who have kenakalan
        $data = RiwayatKelas::with(['siswa.kenakalan', 'siswa.kelas_aktif.kelas'])
            ->where('kelas_id', $kelas_id)
            ->where('status', 'aktif')
            ->whereHas('siswa.kenakalan')
            ->get()
            ->map(function ($item) {
                return [
                    'siswa' => $item->siswa,
                    'kenakalan' => $item->siswa->kenakalan,
                ];
            });

        return Inertia::render('kelas/kenakalan', [
            'kelas' => $kelas,
            'data' => $data,
        ]);
    }
}

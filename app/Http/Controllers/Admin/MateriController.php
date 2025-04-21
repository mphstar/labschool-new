<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MataPelajaran;
use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MateriController extends Controller
{
    public function index($id)
    {

        $mapel = MataPelajaran::findOrFail($id);

        $data = Materi::where('mata_pelajaran_id', $id)->latest()->get();

        return Inertia::render('materi/view', [
            'data' => $data,
            'mapel' => $mapel,
        ]);
    }

    public function store(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:materi',
        ], [
        ]);

        DB::beginTransaction();

        try {
            Materi::create([
                'name' => $request->name,
                'mata_pelajaran_id' => $id,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Materi created successfully');
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
                $data = Materi::find($res['id']);
                if ($data) {
                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Materi deleted successfully');

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
            Materi::findOrFail($request->id)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Materi deleted successfully');
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
            'id' => 'required|exists:materi,id',
            'name' => 'required|string|max:255',
        ], [
        ]);

        DB::beginTransaction();

        try {
            $data = Materi::findOrFail($request->id);
            $data->name = $request->name;
            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Materi updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }
}

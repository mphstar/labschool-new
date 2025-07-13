<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
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
}

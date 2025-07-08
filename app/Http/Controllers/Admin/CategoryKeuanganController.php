<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CategoryKeuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CategoryKeuanganController extends Controller
{
    public function index()
    {


        $data = CategoryKeuangan::latest()->get();

        return Inertia::render('category-keuangan/view', [
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ], []);

        DB::beginTransaction();

        try {
            CategoryKeuangan::create([
                'name' => $request->name,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Category created successfully');
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
                $data = CategoryKeuangan::find($res['id']);
                if ($data) {
                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Category deleted successfully');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();

            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }

    public function delete(Request $request)
    {
        DB::beginTransaction();

        try {
            CategoryKeuangan::findOrFail($request->id)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Category deleted successfully');
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
            'id' => 'required|exists:category_keuangan,id',
            'name' => 'required|string|max:255',
        ], []);

        DB::beginTransaction();

        try {
            $data = CategoryKeuangan::findOrFail($request->id);
            $data->name = $request->name;
            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Category updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }
}

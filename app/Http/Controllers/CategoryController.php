<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::latest()->get();
        return Inertia::render('category/view', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:category,name',
        ], []);

        DB::beginTransaction();
        try {
            $category = new Category;
            $category->name = $request->name;
            $category->save();

            DB::commit();

            return to_route('category.index');
        } catch (\Throwable $th) {

            DB::rollBack();

            throw ValidationException::class::withMessages([
                'error' => 'Gagal menyimpan kategori',
            ]);
        }
    }
}

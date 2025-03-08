<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->get();
        return Inertia::render('product/view', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'harga_beli' => 'required',
            'harga_jual' => 'required',
            'stok' => 'required',
        ]);

        $product = new Product;
        $product->nama = $request->nama;
        $product->harga_beli = $request->harga_beli;
        $product->harga_jual = $request->harga_jual;
        $product->stok = $request->stok;
        $product->save();



        return to_route('product.index');
    }
}

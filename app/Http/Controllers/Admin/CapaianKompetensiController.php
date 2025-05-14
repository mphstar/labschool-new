<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CapaianKompetensi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CapaianKompetensiController extends Controller
{
    public function index()
    {

        $capaian = CapaianKompetensi::get();

        return Inertia::render('settings/capaian-kompetensi', [
            'capaian' => $capaian,
        ]);
    }

    public function save(Request $request)
    {
        $request->validate([
            'rentang' => 'required|array',
            'rentang.*.id' => 'required|exists:capaian_kompetensi,id',
            'rentang.*.min' => 'required|numeric|min:0|max:100',
            'rentang.*.max' => 'required|numeric|min:0|max:100',
            'rentang.*.label' => 'required|string|max:255',
        ], [
            'rentang.*.id.required' => 'ID is required',
            'rentang.*.min.required' => 'Minimum value is required',
            'rentang.*.max.required' => 'Maximum value is required',
            'rentang.*.label.required' => 'Label is required',
            'rentang.*.min.numeric' => 'Minimum value must be a number',
            'rentang.*.max.numeric' => 'Maximum value must be a number',
            'rentang.*.label.string' => 'Label must be a string',
            'rentang.*.min.min' => 'Minimum value must be at least 0',
            'rentang.*.max.min' => 'Maximum value must be at least 0',
            'rentang.*.min.max' => 'Minimum value must not exceed 100',
            'rentang.*.max.max' => 'Maximum value must not exceed 100',
            'rentang.*.label.max' => 'Label must not exceed 255 characters',

        ]);

        foreach ($request->rentang as $item) {
            CapaianKompetensi::where('id', $item['id'])->update([
                'min' => $item['min'],
                'max' => $item['max'],
                'label' => $item['label'],
            ]);
        }

        return redirect()->back()->with('success', 'Capaian Kompetensi updated successfully');
    }
}

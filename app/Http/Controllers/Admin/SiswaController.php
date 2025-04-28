<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
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
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PengaturanPpdb;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengaturanPpdbController extends Controller
{
    public function index()
    {

        $pengaturan = PengaturanPpdb::first();

        if (!$pengaturan) {
            $pengaturan = new PengaturanPpdb();
            $pengaturan->title = 'Pendaftaran Peserta Didik Baru (PPDB)';
            $pengaturan->description = 'Silakan lengkapi formulir pendaftaran di bawah ini dengan data yang benar';
            $pengaturan->no_rekening = '1234567890';
            $pengaturan->atas_nama = 'Labschool';
            $pengaturan->biaya_pendaftaran = 500000;
            $pengaturan->save();
        }

        return Inertia::render('settings/ppdb', [
            'pengaturan' => $pengaturan,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:pengaturan_ppdb,id',
            'title' => 'required',
            'description' => 'required',
            'no_rekening' => 'required',
            'atas_nama' => 'required',
            'biaya_pendaftaran' => 'required|numeric',
        ]);


        $pengaturan = PengaturanPpdb::first();
        $pengaturan->title = $request->input('title');
        $pengaturan->description = $request->input('description');
        $pengaturan->no_rekening = $request->input('no_rekening');
        $pengaturan->atas_nama = $request->input('atas_nama');
        $pengaturan->biaya_pendaftaran = $request->input('biaya_pendaftaran');

        $pengaturan->save();

        return redirect()->back()->with('success', 'Pengaturan PPDB berhasil diperbarui.');
    }
}

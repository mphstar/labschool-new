<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Surat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SuratController extends Controller
{

    
    public function index()
    {
        $data = Surat::latest()->get();

        return Inertia::render('surat/view', [
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nomor_surat' => 'required|string|max:255',
            'jenis' => 'required|in:masuk,keluar',
            'perihal' => 'required|string|max:255',
            'pihak' => 'required|string|max:255',
            'file_surat' => 'required|file|mimes:pdf,doc,docx|max:4096',
            'tanggal_surat' => 'required|date',
        ], []);

        DB::beginTransaction();

        try {
            $data = new Surat();
            $data->nomor_surat = $request->nomor_surat;
            $data->jenis = $request->jenis;
            $data->perihal = $request->perihal;
            $data->pihak = $request->pihak;
            $data->tanggal_surat = $request->tanggal_surat;



            $file = $request->file('file_surat');
            // Pastikan folder tujuan ada
            $tujuan = public_path('uploads/file_surat');
            if (!file_exists($tujuan)) {
                mkdir($tujuan, 0755, true);
            }

            // Generate nama file dengan timestamp
            $namaFile = now()->format('Ymd_His') . '.' . $file->getClientOriginalExtension();

            // Pindahkan file ke folder public/file_surat
            $file->move($tujuan, $namaFile);

            // Simpan path relatif ke database
            $data->file_surat = 'uploads/file_surat/' . $namaFile;

            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Surat created successfully');
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
                $data = Surat::find($res['id']);
                if ($data) {
                    if ($data->file_surat) {
                        $path = public_path($data->file_surat);
                        if (file_exists($path)) {
                            unlink($path);
                        }
                    }

                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Surat deleted successfully');
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
            $data = Surat::findOrFail($request->id);
            if ($data->file_surat) {
                $path = public_path($data->file_surat);
                if (file_exists($path)) {
                    unlink($path);
                }
            }

            $data->delete();


            DB::commit();

            return redirect()->back()->with('success', 'Surat deleted successfully');
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
            'id' => 'required|exists:surat,id',
            'nomor_surat' => 'required|string|max:255',
            'jenis' => 'required|in:masuk,keluar',
            'perihal' => 'required|string|max:255',
            'pihak' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'file_surat' => $request->hasFile('file_surat') ? 'file|mimes:pdf,doc,docx|max:4096' : 'nullable',
        ], []);

        DB::beginTransaction();

        try {
            $data = Surat::findOrFail($request->id);
            $data->nomor_surat = $request->nomor_surat;
            $data->jenis = $request->jenis;
            $data->perihal = $request->perihal;
            $data->pihak = $request->pihak;
            $data->tanggal_surat = $request->tanggal_surat;


            if ($request->hasFile('file_surat')) {
                if ($data->file_surat) {
                    $path = public_path($data->file_surat);
                    if (file_exists($path)) {
                        unlink($path);
                    }
                }

                $file = $request->file('file_surat');
                // Pastikan folder tujuan ada
                $tujuan = public_path('uploads/file_surat');
                if (!file_exists($tujuan)) {
                    mkdir($tujuan, 0755, true);
                }

                // Generate nama file dengan timestamp
                $namaFile = now()->format('Ymd_His') . '.' . $file->getClientOriginalExtension();
                // Pindahkan file ke folder public/file_surat
                $file->move($tujuan, $namaFile);
                // Simpan path relatif ke database
                $data->file_surat = 'uploads/file_surat/' . $namaFile;
            }


            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Surat updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }
}

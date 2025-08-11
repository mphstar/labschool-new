<?php

namespace App\Http\Controllers\Admin;

use App\Exports\KeuanganExport;
use App\Http\Controllers\Controller;
use App\Models\CategoryKeuangan;
use App\Models\Keuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class KeuanganController extends Controller
{

    public function export(Request $request)
    {
        $categoryId = $request->query('category_id');

        return Excel::download(new KeuanganExport($categoryId), 'keuangan.xlsx');
    }

    public function index()
    {
        $data = Keuangan::with(['category_keuangan'])->latest()->get();
        $categories = CategoryKeuangan::get();

        return Inertia::render('keuangan/view', [
            'data' => $data,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'keterangan' => 'required|string|max:255',
            'jenis' => 'required|in:masuk,keluar',
            'category_keuangan_id' => 'required|exists:category_keuangan,id',
            'tipe_pembayaran' => 'required|in:tunai,transfer',
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096',
            'jumlah' => 'required|integer',
            'tanggal' => 'required|date',
        ], []);

        DB::beginTransaction();

        try {
            $data = new Keuangan();
            $data->keterangan = $request->keterangan;
            $data->jenis = $request->jenis;
            $data->tipe_pembayaran = $request->tipe_pembayaran;
            $data->jumlah = $request->jumlah;
            $data->category_keuangan_id = $request->category_keuangan_id;
            $data->tanggal = $request->tanggal;

            $file = $request->file('bukti_pembayaran');
            // Pastikan folder tujuan ada
            $tujuan = public_path('uploads/bukti_pembayaran');
            if (!file_exists($tujuan)) {
                mkdir($tujuan, 0755, true);
            }

            // Generate nama file dengan timestamp
            $namaFile = now()->format('Ymd_His') . '.' . $file->getClientOriginalExtension();

            // Pindahkan file ke folder public/bukti_pembayaran
            $file->move($tujuan, $namaFile);

            // Simpan path relatif ke database
            $data->bukti_pembayaran = 'uploads/bukti_pembayaran/' . $namaFile;

            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Keuangan created successfully');
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
                $data = Keuangan::find($res['id']);
                if ($data) {
                    if ($data->bukti_pembayaran) {
                        $path = public_path($data->bukti_pembayaran);
                        if (file_exists($path)) {
                            unlink($path);
                        }
                    }

                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Keuangan deleted successfully');
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
            $data = Keuangan::findOrFail($request->id);
            if ($data->bukti_pembayaran) {
                $path = public_path($data->bukti_pembayaran);
                if (file_exists($path)) {
                    unlink($path);
                }
            }

            $data->delete();


            DB::commit();

            return redirect()->back()->with('success', 'Keuangan deleted successfully');
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
            'id' => 'required|exists:keuangan,id',
            'keterangan' => 'required|string|max:255',
            'jenis' => 'required|in:masuk,keluar',
            'category_keuangan_id' => 'required|exists:category_keuangan,id',
            'tipe_pembayaran' => 'required|in:tunai,transfer',
            'bukti_pembayaran' => $request->hasFile('bukti_pembayaran') ? 'image|mimes:jpeg,png,jpg,gif|max:4096' : 'nullable',
            'jumlah' => 'required|integer',
            'tanggal' => 'required|date',
        ], []);

        DB::beginTransaction();

        try {
            $data = Keuangan::findOrFail($request->id);
            $data->keterangan = $request->keterangan;
            $data->jenis = $request->jenis;
            $data->tipe_pembayaran = $request->tipe_pembayaran;
            $data->jumlah = $request->jumlah;
            $data->category_keuangan_id = $request->category_keuangan_id;
            $data->tanggal = $request->tanggal;

            if ($request->hasFile('bukti_pembayaran')) {
                if ($data->bukti_pembayaran) {
                    $path = public_path($data->bukti_pembayaran);
                    if (file_exists($path)) {
                        unlink($path);
                    }
                }

                $file = $request->file('bukti_pembayaran');
                // Pastikan folder tujuan ada
                $tujuan = public_path('uploads/bukti_pembayaran');
                if (!file_exists($tujuan)) {
                    mkdir($tujuan, 0755, true);
                }

                // Generate nama file dengan timestamp
                $namaFile = now()->format('Ymd_His') . '.' . $file->getClientOriginalExtension();
                // Pindahkan file ke folder public/bukti_pembayaran
                $file->move($tujuan, $namaFile);
                // Simpan path relatif ke database
                $data->bukti_pembayaran = 'uploads/bukti_pembayaran/' . $namaFile;
            }


            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Keuangan updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }
}

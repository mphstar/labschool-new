<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Presensi;
use App\Models\RiwayatKelas;
use App\Models\Siswa;
use App\Models\TahunAkademik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PresensiController extends Controller
{
    public function index()
    {
        $data = Presensi::with(['riwayat_kelas.siswa.tahun_akademik', 'riwayat_kelas.kelas'])->latest()->get();
        $kelas = Kelas::get();
        $thnakademik = TahunAkademik::get();

        // Logic to fetch and display attendance data
        return Inertia::render('presensi/view', [
            'data' => $data,
            'kelas' => $kelas,
            'thnakademik' => $thnakademik
        ]);
    }

    public function create()
    {
        // Logic to show the form for creating a new attendance record
        return Inertia::render('presensi/create/view', []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'riwayat_kelas_id' => 'required|exists:riwayat_kelas,id',
            'status' => 'required|in:hadir,izin,sakit,alfa',
            'keterangan' => 'nullable|string|max:255',
            'tanggal' => 'nullable|date',
        ]);

        DB::beginTransaction();

        try {
            // Check if attendance already exists for this student on the given date
            $tanggal = $request->tanggal ? $request->tanggal : now()->format('Y-m-d');

            $existingPresensi = Presensi::where('riwayat_kelas_id', $request->riwayat_kelas_id)
                ->whereDate('tanggal', $tanggal)
                ->first();

            if ($existingPresensi) {
                // Get student name for better error message
                $riwayatKelas = RiwayatKelas::with('siswa')->find($request->riwayat_kelas_id);
                $siswaName = $riwayatKelas->siswa->nama_lengkap ?? 'Siswa';

                DB::rollBack();
                throw ValidationException::withMessages([
                    'riwayat_kelas_id' => 'Presensi untuk ' . $siswaName . ' pada tanggal ' . date('d/m/Y', strtotime($tanggal)) . ' sudah tercatat dengan status: ' . ucfirst($existingPresensi->status),
                ]);
            }

            Presensi::create([
                'riwayat_kelas_id' => $request->riwayat_kelas_id,
                'status' => $request->status,
                'keterangan' => $request->keterangan,
                'tanggal' => $request->tanggal ?? now(),
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Presensi berhasil dicatat');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Terjadi kesalahan saat menyimpan presensi: ' . $e->getMessage(),
            ]);
        }
    }

    public function processQRCode(Request $request)
    {
        $request->validate([
            'qr_data' => 'required|string',
            'status' => 'in:hadir,izin,sakit,alfa',
        ]);

        DB::beginTransaction();

        try {
            // Find student by NIS from QR code
            $siswa = Siswa::where('nis', $request->qr_data)->first();

            if (!$siswa) {

                throw ValidationException::withMessages([
                    'message' => 'Siswa dengan NIS ' . $request->qr_data . ' tidak ditemukan.',
                ]);
            }

            // Get active class record for the student
            $riwayatKelas = RiwayatKelas::where('siswa_id', $siswa->id)
                ->where('status', 'aktif')
                ->first();

            if (!$riwayatKelas) {
                throw ValidationException::withMessages([
                    'message' => 'Siswa tidak memiliki kelas aktif.',
                ]);
            }

            // Check if already marked attendance for today
            $today = now()->format('Y-m-d');
            $existingPresensi = Presensi::where('riwayat_kelas_id', $riwayatKelas->id)
                ->whereDate('tanggal', $today)
                ->first();

            if ($existingPresensi) {

                throw ValidationException::withMessages([
                    'message' => 'Presensi untuk siswa ' . $siswa->nama_lengkap . ' sudah tercatat hari ini (' . $existingPresensi->status . ').',
                ]);

            }

            // Create attendance record
            $presensi = Presensi::create([
                'riwayat_kelas_id' => $riwayatKelas->id,
                'status' => $request->status ?? 'hadir',
                'tanggal' => now(),
            ]);

            DB::commit();

            return redirect()->back()->with(
                'message',
                'Presensi berhasil dicatat untuk ' . $siswa->nama_lengkap,
            );

        } catch (\Exception $e) {
            DB::rollBack();

            throw ValidationException::withMessages([
                'error' => 'Terjadi kesalahan saat memproses QR Code: ' . $e->getMessage(),
            ]);
        }
    }

    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:presensi,id',
        ]);

        DB::beginTransaction();

        try {
            $presensi = Presensi::findOrFail($request->id);
            $presensi->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Presensi berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Terjadi kesalahan saat menghapus presensi: ' . $e->getMessage(),
            ]);
        }
    }

    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'data' => 'required|array',
            'data.*.id' => 'required|exists:presensi,id',
        ]);

        DB::beginTransaction();

        try {
            $ids = collect($request->data)->pluck('id');
            Presensi::whereIn('id', $ids)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Presensi berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Terjadi kesalahan saat menghapus presensi: ' . $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:presensi,id',
            'riwayat_kelas_id' => 'nullable|exists:riwayat_kelas,id',
            'status' => 'required|in:hadir,izin,sakit,alfa',
            'keterangan' => 'nullable|string|max:255',
            'tanggal' => 'nullable|date',
        ]);

        DB::beginTransaction();

        try {
            $presensi = Presensi::findOrFail($request->id);

            // Check for duplicate attendance if riwayat_kelas_id or tanggal is being updated
            $newRiwayatKelasId = $request->riwayat_kelas_id ?? $presensi->riwayat_kelas_id;
            $newTanggal = $request->tanggal ?? $presensi->tanggal;

            $existingPresensi = Presensi::where('riwayat_kelas_id', $newRiwayatKelasId)
                ->whereDate('tanggal', $newTanggal)
                ->where('id', '!=', $request->id) // Exclude current record
                ->first();

            if ($existingPresensi) {
                // Get student name for better error message
                $riwayatKelas = RiwayatKelas::with('siswa')->find($newRiwayatKelasId);
                $siswaName = $riwayatKelas->siswa->nama_lengkap ?? 'Siswa';

                DB::rollBack();
                throw ValidationException::withMessages([
                    'riwayat_kelas_id' => 'Presensi untuk ' . $siswaName . ' pada tanggal ' . date('d/m/Y', strtotime($newTanggal)) . ' sudah tercatat dengan status: ' . ucfirst($existingPresensi->status),
                ]);
            }

            $updateData = [
                'status' => $request->status,
                'keterangan' => $request->keterangan,
                'tanggal' => $request->tanggal ?? $presensi->tanggal,
            ];

            // Only update riwayat_kelas_id if provided
            if ($request->riwayat_kelas_id) {
                $updateData['riwayat_kelas_id'] = $request->riwayat_kelas_id;
            }

            $presensi->update($updateData);

            DB::commit();

            return redirect()->back()->with('success', 'Presensi berhasil diperbarui');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Terjadi kesalahan saat memperbarui presensi: ' . $e->getMessage(),
            ]);
        }
    }

    public function getSiswaByKelas(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
        ]);

        try {
            // Get students with their active class records for the specified class
            $siswa = Siswa::with([
                'riwayat_kelas' => function ($query) use ($request) {
                    $query->where('kelas_id', $request->kelas_id)
                        ->where('status', 'aktif')
                        ->with('kelas');
                }
            ])
                ->whereHas('riwayat_kelas', function ($query) use ($request) {
                    $query->where('kelas_id', $request->kelas_id)
                        ->where('status', 'aktif');
                })
                ->get();

            return response()->json([
                'success' => true,
                'data' => $siswa,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data siswa: ' . $e->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PengaturanWebsite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebsiteController extends Controller
{

    public function index()
    {

        $pengaturan = PengaturanWebsite::first();

        if (!$pengaturan) {
            $pengaturan = new PengaturanWebsite();
            $pengaturan->name = 'Labschool';
            $pengaturan->logo = 'default.png';
            $pengaturan->save();
        }

        return Inertia::render('settings/website', [
            'pengaturan' => $pengaturan,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:pengaturan_website,id',
            'name' => 'required',
            'logo' => $request->hasFile('logo') ? 'nullable|image|mimes:png,jpg,jpeg|max:2048' : '',
            'favicon' => $request->hasFile('favicon') ? 'nullable|image|mimes:png,jpg,jpeg,ico|max:2048' : '',
        ]);


        $pengaturan = PengaturanWebsite::first();

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('images/website/logo');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Delete the previous logo if it exists
            if ($pengaturan->logo && file_exists(public_path($pengaturan->logo))) {
                unlink(public_path($pengaturan->logo));
            }

            $file->move($destinationPath, $filename);
            $pengaturan->logo = 'images/website/logo/' . $filename;
        }

        if ($request->hasFile('favicon')) {
            $file = $request->file('favicon');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('images/website/favicon');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Delete the previous favicon if it exists
            if ($pengaturan->favicon && file_exists(public_path($pengaturan->favicon))) {
                unlink(public_path($pengaturan->favicon));
            }

            $file->move($destinationPath, $filename);
            $pengaturan->favicon = 'images/website/favicon/' . $filename;
        }


        $pengaturan->name = $request->name;
        $pengaturan->save();

        return redirect()->back()->with('success', 'Pengaturan website berhasil diperbarui.');
    }
}

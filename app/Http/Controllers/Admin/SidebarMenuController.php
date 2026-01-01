<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SidebarMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SidebarMenuController extends Controller
{
    public function index()
    {
        $data = SidebarMenu::orderBy('order')->get();

        return Inertia::render('settings/sidebar-menu/view', [
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();

        try {
            SidebarMenu::create([
                'title' => $request->title,
                'url' => $request->url,
                'icon' => $request->icon,
                'order' => $request->order ?? 0,
                'is_active' => $request->is_active ?? true,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Menu created successfully');
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
            'id' => 'required|exists:sidebar_menus,id',
            'title' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();

        try {
            $data = SidebarMenu::findOrFail($request->id);
            $data->title = $request->title;
            $data->url = $request->url;
            $data->icon = $request->icon;
            $data->order = $request->order ?? 0;
            $data->is_active = $request->is_active ?? true;
            $data->save();

            DB::commit();

            return redirect()->back()->with('success', 'Menu updated successfully');
        } catch (\Exception $e) {
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
            SidebarMenu::findOrFail($request->id)->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Menu deleted successfully');
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
        ]);

        DB::beginTransaction();

        try {
            foreach ($request->data as $res) {
                $data = SidebarMenu::find($res['id']);
                if ($data) {
                    $data->delete();
                }
            }
            DB::commit();
            return redirect()->back()->with('success', 'Menus deleted successfully');
        } catch (\Throwable $th) {
            DB::rollBack();

            throw ValidationException::withMessages([
                'error' => 'Internal Server Error',
            ]);
        }
    }
}

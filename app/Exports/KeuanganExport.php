<?php

namespace App\Exports;

use App\Models\Keuangan;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class KeuanganExport implements FromArray, WithColumnFormatting, ShouldAutoSize, WithStyles, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */

    private $categoryId;

    public function __construct($categoryId)
    {
        $this->categoryId = $categoryId;
    }

    public function array(): array
    {
        $data = Keuangan::with(['category_keuangan'])
            ->when($this->categoryId, function ($query) {
                return $query->where('category_keuangan_id', $this->categoryId);
            })
            ->get();

        $array = [];
        foreach ($data as $index => $item) {
            $array[] = [
                'No' => $index + 1,
                'Keterangan' => $item->keterangan,
                'Jenis' => $item->jenis,
                'Tipe Pembayaran' => $item->tipe_pembayaran,
                'Jumlah' => $item->jumlah,
                'Tanggal' => $item->tanggal,
                'Category Keuangan' => $item->category_keuangan->name ?? 'N/A',
            ];
        }

        return $array;
    }

    public function columnFormats(): array
    {
        return [
            'E' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }

    public function headings(): array
    {
        return [
            'No',
            'Keterangan',
            'Jenis',
            'Tipe Pembayaran',
            'Jumlah',
            'Tanggal',
            'Category Keuangan',
        ];
    }
}

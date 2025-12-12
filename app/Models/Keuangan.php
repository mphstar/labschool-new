<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keuangan extends Model
{
    use HasFactory;

    protected $table = 'keuangan';
    protected $guarded = [];

    public function category_keuangan()
    {
        return $this->belongsTo(CategoryKeuangan::class, 'category_keuangan_id');
    }

    protected $casts = [
        'jumlah' => 'integer', // atau 'decimal:0' / 'float'
    ];
}

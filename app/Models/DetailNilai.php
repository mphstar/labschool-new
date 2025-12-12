<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailNilai extends Model
{
    use HasFactory;

    protected $table = 'detail_nilai';
    protected $guarded = [];

    public function nilai()
    {
        return $this->belongsTo(Nilai::class, 'nilai_id');
    }

    protected $casts = [
        'nilai' => 'integer', // atau 'decimal:0' / 'float'
    ];
}

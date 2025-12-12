<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';
    protected $guarded = [];

    public function mata_pelajaran()
    {
        return $this->hasMany(MataPelajaran::class, 'kelas_id', 'id');
    }

    public function guru()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}

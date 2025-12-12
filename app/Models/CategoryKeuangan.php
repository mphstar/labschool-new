<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryKeuangan extends Model
{
    use HasFactory;

    protected $table = 'category_keuangan';
    protected $guarded = [];
}

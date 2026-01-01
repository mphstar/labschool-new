<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SidebarMenu extends Model
{
    protected $fillable = [
        'title',
        'url',
        'icon',
        'order',
        'is_active',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean',
    ];
}

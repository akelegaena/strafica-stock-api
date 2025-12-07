<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $fillable = [
        'action',
        'details',
        'user_id'
    ];

    protected $casts = [
        'details' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


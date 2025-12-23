<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    protected $fillable = [
        'id',
        'nom',
        'email',
        'contact',
        'adresse',
        'ville',
    ];

    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'designation',
        'reference',
        'quantite',
        'categorie_id',
        'fournisseur_id',
        'seuil_min'
    ];

    public function categorie()
    {
        return $this->belongsTo(Category::class);
    }

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function mouvements()
    {
        return $this->hasMany(Mouvement::class);
    }
}

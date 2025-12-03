<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'designation' => $this->designation,
            'reference'   => $this->reference,
            'quantite'    => $this->quantite,
            'seuil_min'   => $this->seuil_min,

            'categorie'   => $this->categorie ? [
                'id' => $this->categorie->id,
                'nom' => $this->categorie->nom,
            ] : null,

            'fournisseur' => $this->fournisseur ? [
                'id' => $this->fournisseur->id,
                'nom' => $this->fournisseur->nom,
            ] : null,
        ];
    }
}

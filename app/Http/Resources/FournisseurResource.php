<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FournisseurResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'      => $this->id,
            'nom'     => $this->nom,
            'email'   => $this->email,
            'contact' => $this->contact,
            'adresse' => $this->adresse,
            'articles_count' => $this->articles->count(),
        ];
    }
}

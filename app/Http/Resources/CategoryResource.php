<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'   => $this->id,
            'nom'  => $this->nom,
            'articles_count' => $this->articles->count(),
        ];
    }
}

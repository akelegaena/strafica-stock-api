<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MouvementResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'type'      => $this->type,
            'quantite'  => $this->quantite,
            'motif'     => $this->motif,
            'article'   => [
                'id'          => $this->article->id,
                'designation' => $this->article->designation,
            ],
            'user'      => [
                'id'   => $this->user->id ?? null,
                'name' => $this->user->name ?? null,
            ],
            'date'      => $this->created_at->format('Y-m-d H:i'),
        ];
    }
}

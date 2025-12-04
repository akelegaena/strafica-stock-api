<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMouvementRequest extends FormRequest
{
    public function authorize()
    {
        return true; // géré plus tard avec les rôles
    }

    public function rules()
    {
        return [
            'type'       => 'required|in:ENTREE,SORTIE',
            'article_id' => 'required|exists:articles,id',
            'quantite'   => 'required|integer|min:1',
            'motif'      => 'nullable|string|max:255',
        ];
    }
}

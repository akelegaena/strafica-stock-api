<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMouvementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'article_id' => 'sometimes|exists:articles,id',
            'type'       => 'sometimes|in:ENTREE,SORTIE',
            'quantite'   => 'sometimes|integer|min:1',
        ];
    }
}

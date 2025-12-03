<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'designation'   => 'required|string|max:255',
            'reference'     => "nullable|string|max:255|unique:articles,reference,{$this->article->id}",
            'quantite'      => 'nullable|integer|min:0',
            'seuil_min'     => 'required|integer|min:0',
            'categorie_id'  => 'nullable|exists:categories,id',
            'fournisseur_id'=> 'nullable|exists:fournisseurs,id',
        ];
    }
}

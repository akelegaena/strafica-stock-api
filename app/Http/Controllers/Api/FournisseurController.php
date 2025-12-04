<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFournisseurRequest;
use App\Http\Requests\UpdateFournisseurRequest;
use App\Http\Resources\FournisseurResource;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    public function index()
    {
        return FournisseurResource::collection(
            Fournisseur::orderBy('nom', 'asc')->paginate(10)
        );
    }

    public function store(StoreFournisseurRequest $request)
    {
        $fournisseur = Fournisseur::create($request->validated());

        return new FournisseurResource($fournisseur);
    }

    public function show(Fournisseur $fournisseur)
    {
        return new FournisseurResource($fournisseur->load('articles'));
    }

    public function update(UpdateFournisseurRequest $request, Fournisseur $fournisseur)
    {
        $fournisseur->update($request->validated());

        return new FournisseurResource($fournisseur->fresh());
    }

    public function destroy(Fournisseur $fournisseur)
    {
        $fournisseur->delete();

        return response()->json(['message' => 'Fournisseur supprimé avec succès.']);
    }
}

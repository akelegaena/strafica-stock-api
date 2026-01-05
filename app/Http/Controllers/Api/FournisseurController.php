<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFournisseurRequest;
use App\Http\Requests\UpdateFournisseurRequest;
use App\Http\Resources\FournisseurResource;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use App\Traits\LogActionTrait;

class FournisseurController extends Controller
{
    use LogActionTrait;

    /**
     * Liste des fournisseurs
     */
    public function index()
    {
        return FournisseurResource::collection(
            Fournisseur::orderBy('nom')->paginate(10)
        );
    }

    /**
     * Ajouter un fournisseur
     */
    public function store(StoreFournisseurRequest $request)
    {
        $fournisseur = Fournisseur::create($request->validated());

        // 🔥 Log
        $this->logAction(
            'FOURNISSEUR_CREATED',
            $fournisseur->toArray(),
            null,
            null
        );

        return new FournisseurResource($fournisseur);
    }

    /**
     * Afficher les détails d’un fournisseur
     */
    public function show(Fournisseur $fournisseur)
    {
        return new FournisseurResource($fournisseur);
    }

    /**
     * Modifier un fournisseur
     */
    public function update(UpdateFournisseurRequest $request, Fournisseur $fournisseur)
    {
        $before = $fournisseur->toArray();

        $fournisseur->update($request->validated());

        // 🔥 Log
        $this->logAction(
            'FOURNISSEUR_UPDATED',
            $fournisseur->fresh()->toArray(),
            $before,
            null
        );

        return new FournisseurResource($fournisseur->fresh());
    }

    /**
     * Supprimer un fournisseur
     */
    public function destroy(Fournisseur $fournisseur)
    {
        $before = $fournisseur->toArray();

        $fournisseur->delete();

        // 🔥 Log
        $this->logAction(
            'FOURNISSEUR_DELETED',
            null,
            $before,
            null
        );

        return response()->json(['message' => 'Fournisseur supprimé avec succès.']);
    }
}

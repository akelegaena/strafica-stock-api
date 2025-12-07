<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMouvementRequest;
use App\Http\Requests\UpdateMouvementRequest;
use App\Http\Resources\MouvementResource;
use App\Models\Mouvement;
use Illuminate\Http\Request;
use App\Traits\LogActionTrait;

class MouvementController extends Controller
{
    use LogActionTrait;

    /**
     * Liste des mouvements
     */
    public function index()
    {
        return MouvementResource::collection(
            Mouvement::with(['article', 'user'])
                ->orderBy('created_at', 'desc')
                ->paginate(10)
        );
    }

    /**
     * Ajouter un mouvement
     */
    public function store(StoreMouvementRequest $request)
    {
        $mouvement = Mouvement::create($request->validated());

        // 🔥 LOG création
        $this->logAction(
            'MOUVEMENT_CREATED',
            $mouvement,
            null,
            $mouvement->toArray()
        );

        return new MouvementResource($mouvement->load(['article', 'user']));
    }

    /**
     * Afficher un mouvement
     */
    public function show(Mouvement $mouvement)
    {
        return new MouvementResource($mouvement->load(['article', 'user']));
    }

    /**
     * Modifier un mouvement
     */
    public function update(UpdateMouvementRequest $request, Mouvement $mouvement)
    {
        $before = $mouvement->toArray();

        $mouvement->update($request->validated());

        // 🔥 LOG modification
        $this->logAction(
            'MOUVEMENT_UPDATED',
            $mouvement,
            $before,
            $mouvement->fresh()->toArray()
        );

        return new MouvementResource($mouvement->fresh()->load(['article', 'user']));
    }

    /**
     * Supprimer un mouvement
     */
    public function destroy(Mouvement $mouvement)
    {
        $before = $mouvement->toArray();

        $mouvement->delete();

        // 🔥 LOG suppression
        $this->logAction(
            'MOUVEMENT_DELETED',
            $mouvement,
            $before,
            null
        );

        return response()->json(['message' => 'Mouvement supprimé avec succès.']);
    }
}

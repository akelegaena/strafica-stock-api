<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMouvementRequest;
use App\Http\Resources\MouvementResource;
use App\Models\Article;
use App\Models\Log;
use App\Models\Mouvement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MouvementController extends Controller
{
    /**
     * Liste les mouvements
     */
    public function index()
    {
        return MouvementResource::collection(
            Mouvement::with(['article', 'user'])->latest()->paginate(10)
        );
    }

    /**
     * Crée un mouvement (ENTREE ou SORTIE)
     */
    public function store(StoreMouvementRequest $request)
    {
        return DB::transaction(function () use ($request) {

            $article = Article::findOrFail($request->article_id);

            // 👉 Gestion des entrées / sorties
            if ($request->type === 'ENTREE') {
                $article->quantite += $request->quantite;
            } else { // SORTIE
                if ($article->quantite < $request->quantite) {
                    return response()->json([
                        'message' => 'Stock insuffisant pour effectuer la sortie.'
                    ], 422);
                }

                $article->quantite -= $request->quantite;
            }

            $article->save();

            // 👉 Création du mouvement
            $mouvement = Mouvement::create([
                'type'       => $request->type,
                'article_id' => $request->article_id,
                'user_id'    => auth()->id(),
                'quantite'   => $request->quantite,
                'motif'      => $request->motif,
            ]);

            // 👉 Log de l'action
            Log::create([
                'action'  => 'MOUVEMENT_' . $request->type,
                'details' => [
                    'article_id' => $article->id,
                    'quantite'   => $request->quantite,
                    'nouveau_stock' => $article->quantite
                ],
                'user_id' => auth()->id(),
            ]);

            return new MouvementResource($mouvement);
        });
    }

    /**
     * Affiche les détails d'un mouvement
     */
    public function show(Mouvement $mouvement)
    {
        return new MouvementResource(
            $mouvement->load(['article', 'user'])
        );
    }
}

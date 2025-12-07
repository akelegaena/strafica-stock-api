<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Traits\LogActionTrait; // ⬅️ AJOUT
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    use LogActionTrait; // ⬅️ AJOUT

    /**
     * Liste paginée des articles
     */
    public function index(Request $request)
    {
        $query = Article::with(['categorie', 'fournisseur']);

        // 🔍 Filtre par catégorie
        if ($request->has('categorie_id')) {
            $query->where('categorie_id', $request->categorie_id);
        }

        // 🔍 Filtre par mot-clé
        if ($request->has('search')) {
            $query->where('designation', 'LIKE', "%{$request->search}%");
        }

        return ArticleResource::collection(
            $query->orderBy('designation', 'asc')->paginate(10)
        );
    }

    /**
     * Ajout d’un nouvel article
     */
    public function store(StoreArticleRequest $request)
    {
        $article = Article::create($request->validated());

        // 👉 LOG DE CREATION
        $this->logAction('ARTICLE_CREATED', [
            'article_id' => $article->id,
            'designation' => $article->designation,
            'categorie_id' => $article->categorie_id,
            'fournisseur_id' => $article->fournisseur_id,
        ]);

        return new ArticleResource($article->load(['categorie', 'fournisseur']));
    }

    /**
     * Détails d’un article
     */
    public function show(Article $article)
    {
        return new ArticleResource($article->load(['categorie', 'fournisseur']));
    }

    /**
     * Modification d’un article
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
        $article->update($request->validated());

        // 👉 LOG DE MODIFICATION
        $this->logAction('ARTICLE_UPDATED', [
            'article_id' => $article->id,
            'changes' => $request->validated(),
        ]);

        return new ArticleResource($article->fresh()->load(['categorie', 'fournisseur']));
    }

    /**
     * Suppression d’un article
     */
    public function destroy(Article $article)
    {
        // 👉 LOG DE SUPPRESSION
        $this->logAction('ARTICLE_DELETED', [
            'article_id' => $article->id,
            'designation' => $article->designation,
        ]);

        $article->delete();

        return response()->json(['message' => 'Article supprimé avec succès.']);
    }
}

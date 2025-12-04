<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
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

        return new ArticleResource($article->fresh()->load(['categorie', 'fournisseur']));
    }

    /**
     * Suppression d’un article
     */
    public function destroy(Article $article)
    {
        $article->delete();

        return response()->json(['message' => 'Article supprimé avec succès.']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Traits\LogActionTrait;

class ArticleController extends Controller
{
    use LogActionTrait;

    /**
     * Liste paginée des articles
     */
    public function index(Request $request)
    {
        $query = Article::with(['categorie', 'fournisseur']);

        if ($request->has('categorie_id')) {
            $query->where('categorie_id', $request->categorie_id);
        }

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

        // 🔥 Log complet
        $this->logAction(
            'ARTICLE_CREATED',
            $article,
            null,
            $article->toArray()
        );

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
        $before = $article->toArray();

        $article->update($request->validated());

        // 🔥 Log complet
        $this->logAction(
            'ARTICLE_UPDATED',
            $article,
            $before,
            $article->fresh()->toArray()
        );

        return new ArticleResource($article->fresh()->load(['categorie', 'fournisseur']));
    }

    /**
     * Suppression d’un article
     */
    public function destroy(Article $article)
    {
        $before = $article->toArray();

        $article->delete();

        // 🔥 Log complet
        $this->logAction(
            'ARTICLE_DELETED',
            $article,
            $before,
            null
        );

        return response()->json(['message' => 'Article supprimé avec succès.']);
    }
}

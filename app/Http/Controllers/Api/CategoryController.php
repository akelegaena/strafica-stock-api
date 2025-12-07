<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Traits\LogActionTrait;

class CategoryController extends Controller
{
    use LogActionTrait;

    /**
     * Liste des catégories
     */
    public function index()
    {
        return CategoryResource::collection(
            Category::orderBy('nom')->paginate(10)
        );
    }

    /**
     * Ajouter une catégorie
     */
    public function store(StoreCategoryRequest $request)
    {
        $categorie = Category::create($request->validated());

        // 🔥 Log
        $this->logAction(
            'CATEGORIE_CREATED',
            $categorie,
            null,
            $categorie->toArray()
        );

        return new CategoryResource($categorie);
    }

    /**
     * Détails d’une catégorie
     */
    public function show(Category $category)
    {
        return new CategoryResource($category);
    }

    /**
     * Modifier une catégorie
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $before = $category->toArray();

        $category->update($request->validated());

        // 🔥 Log
        $this->logAction(
            'CATEGORIE_UPDATED',
            $category,
            $before,
            $category->fresh()->toArray()
        );

        return new CategoryResource($category->fresh());
    }

    /**
     * Supprimer une catégorie
     */
    public function destroy(Category $category)
    {
        $before = $category->toArray();

        $category->delete();

        // 🔥 Log
        $this->logAction(
            'CATEGORIE_DELETED',
            $category,
            $before,
            null
        );

        return response()->json(['message' => 'Catégorie supprimée avec succès.']);
    }
}

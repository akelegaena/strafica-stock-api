<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(
            Category::orderBy('nom', 'asc')->paginate(10)
        );
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return new CategoryResource($category);
    }

    public function show(Category $category)
    {
        return new CategoryResource($category->load('articles'));
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return new CategoryResource($category->fresh());
    }

    public function destroy(Category $category)
    {
        if ($category->articles()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer : catégorie utilisée par des articles.'
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée avec succès.']);
    }
}

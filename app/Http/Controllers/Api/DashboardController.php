<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Fournisseur;
use App\Models\Mouvement;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Totaux
        $totalArticles = Article::count();
        $totalFournisseurs = Fournisseur::count();
        $totalMouvements = Mouvement::count();

        // Stocks faibles
        $stocksFaibles = Article::whereColumn('quantite', '<=', 'seuil_min')->count();

        // Stocks par catégorie
        $stocksParCategorie = Article::select(
            DB::raw('categories.nom as categorie'),
            DB::raw('SUM(articles.quantite) as stock')
        )
        ->join('categories', 'articles.categorie_id', '=', 'categories.id')
        ->groupBy('categories.nom')
        ->get();

        // Mouvements par mois
        $mouvementsParMois = Mouvement::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as mois"),
            DB::raw('SUM(quantite) as total')
        )
        ->groupBy('mois')
        ->orderBy('mois')
        ->get();

        // Alertes
        $alertes = Article::whereColumn('quantite', '<=', 'seuil_min')
            ->select('id', 'designation', 'quantite', 'seuil_min')
            ->get();

        return response()->json([
            'stats' => [
                'articles' => $totalArticles,
                'fournisseurs' => $totalFournisseurs,
                'mouvements' => $totalMouvements,
                'stocks_faibles' => $stocksFaibles,
            ],
            'stocks_par_categorie' => $stocksParCategorie,
            'mouvements_par_mois' => $mouvementsParMois,
            'alertes' => $alertes,
        ]);
    }
}

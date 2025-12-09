<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Category;
use App\Models\Fournisseur;
use App\Models\Article;
use App\Models\Mouvement;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // --- ROLES ---
        $admin = Role::create(['nom' => 'ADMIN']);
        $employe = Role::create(['nom' => 'EMPLOYE']);

        // --- USER ADMIN ---
        $adminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@strafrica.com',
            'password' => bcrypt('admin123'),
            'role_id' => $admin->id,
        ]);

        // --- CATEGORIES ---
        $cat1 = Category::create(['nom' => 'Ordinateurs']);
        $cat2 = Category::create(['nom' => 'Téléphones']);
        $cat3 = Category::create(['nom' => 'Accessoires']);

        // --- FOURNISSEURS ---
        $f1 = Fournisseur::create(['nom' => 'DistriTech']);
        $f2 = Fournisseur::create(['nom' => 'Tech Import']);
        $f3 = Fournisseur::create(['nom' => 'ElectroShop']);

        // --- ARTICLES ---
        $a1 = Article::create([
            'designation' => 'Laptop HP 15',
            'categorie_id' => $cat1->id,
            'fournisseur_id' => $f1->id,
            'quantite' => 10
        ]);

        $a2 = Article::create([
            'designation' => 'iPhone 13',
            'categorie_id' => $cat2->id,
            'fournisseur_id' => $f2->id,
            'quantite' => 5
        ]);

        $a3 = Article::create([
            'designation' => 'Chargeur 65W',
            'categorie_id' => $cat3->id,
            'fournisseur_id' => $f3->id,
            'quantite' => 30
        ]);

        // --- MOUVEMENTS ---
        Mouvement::create([
            'article_id' => $a1->id,
            'user_id' => $adminUser->id,
            'quantite' => 2,
            'type' => 'sortie'
        ]);

        Mouvement::create([
            'article_id' => $a2->id,
            'user_id' => $adminUser->id,
            'quantite' => 1,
            'type' => 'entrée'
        ]);
    }
}

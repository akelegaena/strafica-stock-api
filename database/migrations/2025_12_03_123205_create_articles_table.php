<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('articles', function (Blueprint $table) {
        $table->id();
        $table->string('designation');
        $table->string('reference')->nullable()->unique();
        $table->integer('quantite')->default(0);

        $table->foreignId('categorie_id')->nullable()
              ->constrained('categories')->nullOnDelete();

        $table->foreignId('fournisseur_id')->nullable()
              ->constrained('fournisseurs')->nullOnDelete();

        $table->integer('seuil_min')->default(0);

        $table->timestamps();
    });
}

        public function down()
        {
            Schema::dropIfExists('articles');
        }

};

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
    Schema::create('mouvements', function (Blueprint $table) {
        $table->id();
        $table->enum('type', ['ENTREE', 'SORTIE']);
        $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        $table->integer('quantite');
        $table->text('motif')->nullable();
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('mouvements');
    }

};

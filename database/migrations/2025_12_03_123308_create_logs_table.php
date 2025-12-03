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
    Schema::create('logs', function (Blueprint $table) {
        $table->id();
        $table->string('action');
        $table->json('details')->nullable();
        $table->foreignId('user_id')->nullable()
              ->constrained('users')->nullOnDelete();
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('logs');
    }

};

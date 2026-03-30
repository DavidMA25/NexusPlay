<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_ads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('player_stat_id')->constrained()->cascadeOnDelete();
            $table->string('message', 255);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_ads');
    }
};

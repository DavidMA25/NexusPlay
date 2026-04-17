<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tryout_participants', function (Blueprint $table) {
            $table->id();
            // ID del CPT de WordPress — no es FK a ninguna tabla de Laravel.
            $table->unsignedBigInteger('wp_post_id')->index();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['registered', 'approved', 'rejected'])->default('registered');
            $table->timestamps();

            // Un usuario solo puede inscribirse una vez por tryout.
            $table->unique(['wp_post_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tryout_participants');
    }
};

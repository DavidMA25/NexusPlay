<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_group')->default(false);
            $table->string('group_name', 100)->nullable(); // Solo para grupos
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete(); // Propietario del grupo
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};

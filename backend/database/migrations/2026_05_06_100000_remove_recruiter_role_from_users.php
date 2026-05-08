<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: convert any existing recruiters to player before changing the enum
        DB::table('users')->where('role', 'recruiter')->update(['role' => 'player']);

        // Step 2: change the enum — recruiter removed
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('player', 'admin') NOT NULL DEFAULT 'player'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('player', 'recruiter', 'admin') NOT NULL DEFAULT 'player'");
    }
};

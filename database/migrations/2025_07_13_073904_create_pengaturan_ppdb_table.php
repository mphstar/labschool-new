<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengaturan_ppdb', function (Blueprint $table) {
            $table->id();
            $table->string(column: 'title');
            $table->string(column: 'description')->nullable();
            $table->string(column: 'no_rekening');
            $table->string(column: 'atas_nama')->nullable();
            $table->integer(column: 'biaya_pendaftaran')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaturan_ppdb');
    }
};

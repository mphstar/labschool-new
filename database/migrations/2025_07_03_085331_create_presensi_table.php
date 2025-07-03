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
        Schema::create('presensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('riwayat_kelas_id')
                ->constrained('riwayat_kelas')
                ->onDelete('cascade')->onUpdate('cascade');
            $table->enum('status', ['hadir', 'izin', 'sakit', 'alfa'])
                ->default('hadir');
            $table->text('keterangan')->nullable();
            $table->dateTime('tanggal')->default(now());
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensi');
    }
};

<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // USERS table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname', 30);
            $table->string('lastname', 30);
            $table->string('telephone', 50);
            $table->text('email');
            $table->text('password');
            $table->timestamps();
        });

        // CARS table
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->text('photo1');
            $table->text('photo2');
            $table->string('brand', 30);
            $table->smallInteger('model');
            $table->string('fuel_type', 15);
            $table->float('price');
            $table->string('gearbox', 15);
            $table->boolean('available');
            $table->timestamps();
        });

        // RENTALS table
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->date('rental_date');
            $table->date('return_date');
            $table->float('price');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('car_id')->constrained('cars')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rentals');
        Schema::dropIfExists('cars');
        Schema::dropIfExists('users');
    }
};

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePublishedTestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('published_tests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text("testName");
            $table->text("author");
            $table->integer("authorityLevel");
            $table->integer("questionsAmount");
            $table->integer("usersAttempts");
            $table->dateTime("published_on");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('published_tests');
    }
}

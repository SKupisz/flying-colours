<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Middleware\SignInUpManagement;

Route::get('/', function () {
    if(session()->has("current") && session()->has("name") && session()->has("dbs")) return redirect("/main");
    return view('welcome');
})->middleware(SignInUpManagement::class);

Route::get("/about",function(){
    return view("about");
})->middleware(SignInUpManagement::class);

Route::get("/sign-in",function(){
    return view("signin");
})->middleware(SignInUpManagement::class);

Route::get("/sign-up",function(){
    return view("signup");
})->middleware(SignInUpManagement::class);

Route::get("/main","SignInUpController@launchMainPanel")->middleware(SignInUpManagement::class);

Route::get("/tests","PublicTestsSectionController@launchTestsSection")->middleware(SignInUpManagement::class);
Route::get("/solve/{testId}/","TestOperationsController@launchTestSolving")->middleware(SignInUpManagement::class);

Route::get("/publish", function(){
    return view("publish");
})->middleware(SignInUpManagement::class);

Route::get("/options","SignInUpController@launchOptionsPanel")->middleware(SignInUpManagement::class);

Route::get("/logout","SignInUpController@Logout");


Route::post("/signin","SignInUpController@SignIn");
Route::post("/signup","SignInUpController@SignUp");
Route::post("/publish/tempRow/","PublishingController@ThrowANewRow");
Route::post("/publish/publishTheTest","PublishingController@PublishNewTest");
Route::post("/solve/getTheRow","TestOperationsController@loadTheNextRow");
Route::post("/solve/putTheResults", "TestOperationsController@putTheResultsToDB");
Route::post("/options/support/changeTheNickname","SignInUpController@changeUserNickname");
Route::post("/options/support/changeThePassword","SignInUpController@changeUserPassword");
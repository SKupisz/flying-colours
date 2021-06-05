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

Route::get('/', function () {
    if(session()->has("current") && session()->has("name") && session()->has("dbs")) return redirect("/main");
    return view('welcome');
});

Route::get("/about",function(){
    return view("about");
});

Route::get("/sign-in",function(){
    return view("signin");
});

Route::get("/sign-up",function(){
    return view("signup");
});

Route::get("/main","SignInUpController@launchMainPanel");
Route::get("/publish", function(){
    return view("publish");
});

Route::get("/logout","SignInUpController@Logout");


Route::post("/signin","SignInUpController@SignIn");
Route::post("/signup","SignInUpController@SignUp");

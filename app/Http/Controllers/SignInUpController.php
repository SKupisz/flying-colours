<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SignInUpController extends Controller
{
    public function entities($str){
        return htmlentities($str, ENT_QUOTES, "UTF-8");
    }
    public function redirectWithError($destiny, $message){
        return redirect($destiny)->with("data",["status"=>"error","message"=>$message]);
    }
    public function SignIn(Request $data){
        if($data->has("email") && $data->has("passwd")){
            $email = $this->entities($data->input("email"));
            $passwd = $this->entities($data->input("passwd"));
            try {
                $checkIfExists = DB::table("users")->where("email","=",$email);
                if($checkIfExists->count() != 1) return $this->redirectWithError("/sign-in","Wrong email or password");
                else{
                    $checkIfExists = $checkIfExists->get();
                    $getFinalData = json_decode(json_encode($checkIfExists),true)[0];
                    if(password_verify($passwd,$getFinalData["passwd"])){
                        session(["current" => $email]);
                        return redirect("/main");
                    }
                    else return $this->redirectWithError("/sign-in","Wrong email or password");
                }
            } catch (Illuminate\Database\QueryException $e) {
                return $this->redirectWithError("/sign-in","Connection error. Try later");
            }
        }
        else return redirect("/");
    }
    public function SignUp(Request $data){
        if($data->has("nick") && $data->has("email") && $data->has("passwd") && $data->has("passwd_rep")){
            $nick = $this->entities($data->input("nick"));
            $email = $this->entities($data->input("email"));
            $passwd = $this->entities($data->input("passwd"));
            $passwd_rep = $this->entities($data->input("passwd_rep"));
            if($passwd != $passwd_rep || strlen($passwd) < 10){
                return $this->redirectWithError("/sign-up","Password must be at least 10 characters long");
            }
            $passwd = password_hash($passwd, PASSWORD_DEFAULT);
            try {
                $checkIfEmailRegistered = DB::table("users")->where("email","=",$email)->count();
                if($checkIfEmailRegistered != 0) return $this->redirectWithError("/sign-up","Email already registered");
                $currentDate = new Carbon();
                $currentDate->modify("+15 minutes");
                $dataToPutIn = [
                    "nickname" => $nick,
                    "email" => $email,
                    "passwd" => $passwd,
                    "verification_date" => $currentDate,
                    "is_verified" => 1
                ];
                DB::table("users")->insert($dataToPutIn);
                session(["current"=>$dataToPutIn["email"]]);
                return redirect("/main");
            } catch (Illuminate\Database\QueryException $e) {
                return $this->redirectWithError("/sign-up","Connection error. Try later");
            }
        }
        else return redirect("/sign-up");
    }
    public function Logout(){
        session()->forget("current");
        return redirect("/");
    }
}

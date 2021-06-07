<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class SignInUpController extends Controller
{
    public function entities($str){
        return htmlentities($str, ENT_QUOTES, "UTF-8");
    }
    public function redirectWithError($destiny, $message){
        return redirect($destiny)->with("data",["status"=>"error","message"=>$message]);
    }
    public function factorial($x){
        if($x == 0 || $x == 1) return 1;
        else return $x*$this->factorial($x-1);
    }
    public function toThePowerOf($x,$p){
        if($p == 0) return 1;
        else if($p == 1) return $x;
        else return $x*$x*$this->toThePowerOf($x,$p-2);
    }
    public function userDatabaseName($givenNick,$day1,$day2){
        $operand = $givenNick;
        for($i = 0 ; $i < strlen($operand); $i++){
            $current = ord($operand[$i]);
            $first = intdiv($current,10);
            $second = $current%10;
            $b = $this->factorial($first);
            $x = ($second%7)+2;
            $t = $day1+$day2;
            $sup = $this->toThePowerOf($x,$t-1);
            $b*=$sup;
            $c = $b*$x;
            $c%=65;
            $c+=65;
            if($c < 65 || ($c > 90 && $c < 97) || $c >122){
                $c%=24;
                $c+=65;
            }
            $operand[$i] = chr($c);
        }
        return $operand;
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
                        $helper = (string) $getFinalData["verification_date"];
                        $day1 = (int)$helper[8]; $day2 = (int)$helper[9];
                        $baseForDatabaseName = $this->userDatabaseName($email,$day1, $day2);
                        $user_history_table_name = $baseForDatabaseName."_testsHistory";
                        $user_tests_temp_table = $baseForDatabaseName."_temp";
                        session(["current" => $email, "name" => $getFinalData["nickname"], "dbs" => [$user_history_table_name,$user_tests_temp_table]]);
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
                $currentDate = $currentDate->format("d");
                $day1 = intdiv($currentDate,10); $day2 = $currentDate%10;
                $baseForDatabaseName = $this->userDatabaseName($email,$day1, $day2);
                $user_history_table_name = $baseForDatabaseName."_testsHistory";
                $user_tests_temp_table = $baseForDatabaseName."_temp";
                DB::statement("CREATE TABLE ".$user_history_table_name." ( id INT NOT NULL AUTO_INCREMENT , testID TEXT CHARACTER SET utf8 COLLATE utf8_polish_ci NOT NULL,
                    last_opened_at DATETIME NOT NULL, result INT NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB CHARSET=utf8
                    COLLATE utf8_polish_ci;");
                DB::table("users")->insert($dataToPutIn);
                session(["current" => $dataToPutIn["email"], "name" => $dataToPutIn["nickname"], "dbs" => [$user_history_table_name, $user_tests_temp_table]]);
                return $this->launchMainPanel();
            } catch (Illuminate\Database\QueryException $e) {
                return $this->redirectWithError("/sign-up","Connection error. Try later");
            }
        }
        else return redirect("/sign-up");
    }
    public function Logout(){
        session()->forget("current");
        session()->forget("name");
        session()->forget("dbs");
        return redirect("/");
    }
    public function launchMainPanel(){
        if(session()->has("current") && session()->has("name") && session()->has("dbs")){
            try {
                $history = session()->get("dbs")[0];
                $getTheRecentHistory = DB::table($history)->orderBy("last_opened_at")->take(5)->get();
                $getTheRecentHistory = json_decode(json_encode($getTheRecentHistory),true);
                return view("panel")->with("data",["status" => "done", "recentlyDone" => $getTheRecentHistory, "recentlyPublished" => []]);
            } catch (Illuminate\Database\QueryException $e) {
                return view("panel")->with("data",["status" => "error"]);
            }
            
        }
        else return $this->Logout();
    }
}

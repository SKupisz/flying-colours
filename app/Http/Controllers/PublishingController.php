<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Carbon\Carbon;

use App\Http\Controllers\SignInUpController;

class PublishingController extends Controller
{
    protected $SignInUpController;
    public function __construct(SignInUpController $SignInUpController)
    {
        $this->SignInUpController = $SignInUpController;
    }
    public function generateTestPublicID(){
        if(session()->has("current")){
            $key = new Carbon();
            $key = $key->format('Y-m-d\TH.uP');
            $key .= session()->get("current");
            $finalID = "";
            $forStart = new Carbon();
            $randElem = $forStart->format("s");
            for($i = 0 ; $i < strlen($key); $i++){
                $operand = ord($key[$i]) + $randElem;
                $operand += $this->SignInUpController->factorial($operand % 10);
                $operand = $operand % $this->SignInUpController->factorial((round($operand / 10) % 10));
                $operand%=26;
                $operand+=97;
                $randElem+=$operand; 
                $randElem%=26;
                $finalID.=chr($operand);
            }
            return $finalID;
        }
    }
    public function ThrowANewRow(Request $data){
        if(session()->has("current") && session()->has("name") && session()->has("dbs")){
            if($data->has("questionNumber") && $data->has("questionData")){
                $tempRowsDBName = session()->get("dbs")[1];
                if(!Schema::hasTable($tempRowsDBName)){
                    Schema::create($tempRowsDBName, function(Blueprint $table){
                        $table->bigIncrements('id');
                        $table->text("testID");
                        $table->integer("questionNumber");
                        $table->longText("questionContent");
                        $table->timestamps();
                    });
                }
                
                $questionData = json_decode(json_encode($data->input("questionData"),true));
                $number = $data->input("questionNumber");
                $testID = "";
                if($data->has("testID")) {
                    $testID = $data->input("testID");
                    if(strlen($testID) == 0) $testID = $this->generateTestPublicID();
                }
                else if($number == 1) $testID = $this->generateTestPublicID();
                else return json_encode(["error"]);
                $dataToPutIn = [
                    "testID" => $testID,
                    "questionNumber" => $number,
                    "questionContent" => $questionData
                ];
                try {
                    $checkIfAlreadyExists = DB::table($tempRowsDBName)->where("testID","=",$testID)->where("questionNumber","=",$number);
                    if($checkIfAlreadyExists->count() == 0){
                        DB::table($tempRowsDBName)->insert($dataToPutIn);
                    }
                    else{
                        $checkIfAlreadyExists->update($dataToPutIn);
                    }
                } catch (\Throwable $th) {
                    return json_encode(["error"]);
                }

                return json_encode(["success", $testID, $number]);
            }
            else return json_encode(["error"]);
        }
        else return json_encode(["error"]);
    }
    public function PublishNewTest(Request $data){
        if(session()->has("current") && session()->has("name") && session()->has("dbs")){
            if($data->has("questionsAmount") && $data->has("testID") && $data->has("testName")){
                $howManyQuestions = $data->input("questionsAmount");
                $testID = $data->input("testID");
                $testName = $this->SignInUpController->entities($data->input("testName"));
                try {
                    $tempDatabase = session()->get("dbs")[1];
                    $checkIfIDExists = DB::table($tempDatabase)->where("testID","=",$testID)->orderBy("questionNumber");
                    if($checkIfIDExists->count() == 0) return json_encode("error ".$tempDatabase." ".$testID);
                    else{
                        $checkIfIDExists = json_decode(json_encode($checkIfIDExists->get()),true);
                        if(count($checkIfIDExists) != $howManyQuestions) return json_encode("error");
                        for($i = 0; $i < count($checkIfIDExists); $i++){
                            $operand = json_decode(json_encode($checkIfIDExists[$i]),true);
                            if($operand["questionNumber"] != ($i+1)) return json_encode("error");
                        }
                        if(Schema::hasTable($testID)) return json_encode("error");
                        Schema::create($testID, function(Blueprint $table){
                            $table->bigIncrements("id");
                            $table->json("questionData");
                            $table->timestamps();
                        });
                        for($i = 0 ; $i < count($checkIfIDExists); $i++){
                            $operand = json_decode(json_encode($checkIfIDExists[$i]),true);
                            $questionRow = [
                                "questionData" => $operand["questionContent"]
                            ];
                            DB::table($testID)->insert($questionRow);
                        }
                        $getTheCurrentTime = new Carbon();
                        $dataToPutIn = [
                            "testName" => $testName,
                            "author" => session()->has("current"),
                            "authorityLevel" => 1,
                            "questionsAmount" => $howManyQuestions,
                            "usersAttempts" => 0,
                            "published_on" => $getTheCurrentTime
                        ];
                        DB::table("published_tests")->insert($dataToPutIn);   
                        DB::table($tempDatabase)->where("testID","=",$testID)->delete();                     
                    }
                } catch (\Throwable $th) {
                    return json_encode("error");
                }
                return json_encode("success");
            }
            else return json_encode("error");
        }
        else return json_encode("error");
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\SignInUpController;

class TestOperationsController extends Controller
{
    protected $SignInUpController;
    public function __construct(SignInUpController $SignInUpController)
    {
        $this->SignInUpController = $SignInUpController;
    }
    public function launchTestSolving($testID){
        $toCheck = $this->SignInUpController->entities($testID);
        try {
            $checkIfTheTestExists = DB::table("published_tests")->join("users","users.email","=","published_tests.author")->where("testKey","=",$testID);
            if($checkIfTheTestExists->count() == 0) return view("solving")->with("data",["status"=>"error-id"]);
            else{
                $data = json_decode(json_encode($checkIfTheTestExists->get()),true);
                $recentResult = -1;
                if(session()->has("current") && session()->has("name") && session()->has("dbs")){
                    $history = session()->get("dbs")[0];
                    $currentTime = new Carbon();
                    $checkIfAlreadyWatched = DB::table($history)->where("testID","=",$testID);
                    $toInsert = [
                        "testID" => $testID,
                        "last_opened_at" => $currentTime,
                        "result" => -1
                    ]; 
                    if($checkIfAlreadyWatched->count() == 0){
                        DB::table($history)->insert($toInsert);
                    }
                    else{
                        $getTheRecordID = json_decode(json_encode($checkIfAlreadyWatched->get()),true);
                        $id = $getTheRecordID[0]["id"];
                        $recentResult = $getTheRecordID[0]["result"];
                        if($recentResult != -1) $toInsert["result"] = $recentResult;
                        DB::table($history)->where("id","=",$id)->update($toInsert);
                    }
                }
                $dataToUpdate = $data[0]["usersAttempts"]+1;
                DB::table("published_tests")->where("testKey","=",$testID)->update([
                    "usersAttempts" => $dataToUpdate
                ]);
                return view("solving")->with("data",["status" => "success","quizData" => $data[0], "recentResult" => $recentResult]);
            }
        } catch (\Throwable $th) {
            return view("solving")->with("data",["status"=>"error","code" => $th->getMessage()]);
        }
        return view("solving");
    }
    public function loadTheNextRow(Request $data){
        if($data->has("testID") && $data->has("questionNumber")){
            try {
                $testID = $this->SignInUpController->entities($data->input("testID"));
                $checkIfTheTestExists = DB::table("published_tests")->where("testKey","=",$testID);
                if($checkIfTheTestExists->count() == 0) return json_encode(["error"]);
                $row = $data->input("questionNumber");
                if(gettype($row) != "integer") return json_encode(["error"]);
                $getTheQuestion = DB::table($testID)->where("id","=",$row);
                if($getTheQuestion->count() == 0) return json_encode(["error"]);
                $getTheQuestion = json_decode(json_encode($getTheQuestion->get()),true);
                return json_encode(["success", $getTheQuestion]);
            } catch (\Throwable $th) {
                return json_encode(["error"]);
            }
        }
        else return json_encode(["error"]);
    }
    public function putTheResultsToDB(Request $data){
        if($data->has("testID") && $data->has("results")){
            if(session()->has("current") && session()->has("name") && session()->has("dbs")){
                $testID = $data->input("testID");
                $historyDBName = session()->get("dbs")[0];
                $getTheRecordID = DB::table($historyDBName)->where("testID","=",$testID);
                if($getTheRecordID->count() != 1) return json_encode("error");
                $getTheRecordID = json_decode(json_encode($getTheRecordID->get()),true);
                $idToUpdate = $getTheRecordID[0]["id"];
                $result = $data->input("results");
                $dataToUpdate = [
                    "result" => $result
                ];
                DB::table($historyDBName)->where("id","=",$idToUpdate)->update($dataToUpdate);
                return json_encode("success");
            }
            else return json_encode("success");
        }
        else return json_encode("error");
    }
}

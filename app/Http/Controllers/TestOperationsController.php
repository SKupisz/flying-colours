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
            $checkIfTheTestExists = DB::table("published_tests")->where("testKey","=",$testID);
            if($checkIfTheTestExists->count() == 0) return view("solving")->with("data",["status"=>"error-id"]);
            else{
                $data = json_decode(json_encode($checkIfTheTestExists->get()),true);
                if(session()->has("current") && session()->has("name") && session()->has("dbs")){
                    $history = session()->get("dbs")[0];
                    $currentTime = new Carbon();
                    $toInsert = [
                        "testID" => $testID,
                        "last_opened_at" => $currentTime,
                        "result" => -1
                    ]; 
                    DB::table($history)->insert($toInsert);
                }
                return view("solving")->with("data",["status" => "success","quizData" => $data[0]]);
            }
        } catch (\Throwable $th) {
            return view("solving")->with("data",["status"=>"error","code" => $th->getMessage()]);
        }
        return view("solving");
    }
    public function loadTheNextRow(Request $data){
        if($data->has("testID") && $data->has("questionNumber")){
            $testID = $this->SignInUpController->entities($data->input("testID"));
            $checkIfTheTestExists = DB::table("published_tests")->where("testKey","=",$testID);
            if($checkIfTheTestExists->count() == 0) return json_encode(["error"]);
            $row = $data->input("questionNumber");
            if(gettype($row) != "integer") return json_encode(["error"]);
            $getTheQuestion = DB::table($testID)->where("id","=",$row);
            if($getTheQuestion->count() == 0) return json_encode(["error"]);
            $getTheQuestion = json_decode(json_encode($getTheQuestion->get()),true);
            return json_encode(["success", $getTheQuestion]);
        }
        else return json_encode(["error"]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\SignInUpController;

class PublicTestsSectionController extends Controller
{
    protected $SignInUpController;
    public function __construct(SignInUpController $SignInUpController)
    {
        $this->SignInUpController = $SignInUpController;
    }
    public function launchTestsSection(){
        try {
            $getTheRecentTests = DB::table("published_tests")->where("authorityLevel","=",1)->orderByDesc("published_on")->take(20)->get();
            //$getTheRecentTests = json_decode(json_encode($getTheRecentTests),true);
            return view("tests")->with("data",["status" => "success", "testsData" => $getTheRecentTests]);
        } catch (\Throwable $th) {
            return view("tests")->with("data",["status" => "error"]);
        }
    }
}

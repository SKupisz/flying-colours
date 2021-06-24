<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cookie;

class SignInUpManagement
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        if(!(session()->has("current") && session()->has("name") && session()->has("dbs")) && Cookie::get("data")){
            $helper = json_decode(Cookie::get("data"), true);
            session(["current" => $helper["current"], "name" => $helper["name"], "dbs" => $helper["dbs"]]);
        }

        return $next($request);
    }
}

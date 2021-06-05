@extends('layouts.app')
@section('content')
    {{Form::open(array("url" => "/signup", "class"=>"signin-form block-center"))}}
    <header class="main-header block-center">Sign up</header>
    @if(Session::has("data"))
        <div id="inputs-wrapper" data-error="{{Session::get('data')['message']}}" data-isregistering="true"></div>
    @else
        <div id="inputs-wrapper" data-isregistering="true"></div>
    @endif
    {{Form::close()}}
@endsection
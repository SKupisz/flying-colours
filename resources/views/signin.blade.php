@extends('layouts.app')
@section('content')
    {{Form::open(array("url" => "/signin", "class"=>"signin-form block-center"))}}
    <header class="main-header block-center">Sign in</header>
    @csrf
    @if(Session::has("data"))
        <div id="inputs-wrapper" data-error="{{Session::get('data')['message']}}"></div>
    @else
        <div id="inputs-wrapper"></div>
    @endif
    {{Form::close()}}
@endsection
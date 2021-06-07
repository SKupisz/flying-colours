@extends('layouts.app')
@section('content')
    {{Form::open(array("url" => "/publish/publishTheTest","class" => "publish-container"))}}
        <header class="main-header block-center">Create a test</header>
        <div id="test-creator-wrapper" data-token="{{csrf_token()}}"></div>
    {{Form::close()}}
@endsection
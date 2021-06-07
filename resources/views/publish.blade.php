@extends('layouts.app')
@section('content')
    <header class="main-header block-center">Create a test</header>
    <div id="test-creator-wrapper" data-token="{{csrf_token()}}"></div>
@endsection
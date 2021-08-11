@extends('layouts.app')
@section('content')
    <header class="main-header creating-header block-center">Create a test</header>
    <div id="test-creator-wrapper" data-token="{{csrf_token()}}"></div>
@endsection
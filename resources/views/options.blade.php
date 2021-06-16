@extends('layouts.app')
@section('content')
    @if (isset($data))
        @if ($data["status"] == "success")
            <header class="main-header block-center">Account options</header>
            <div id="options-container" data-token="{{csrf_token()}}"></div>
        @else
            <header class="main-header block-center">Something went wrong. Try later</header>
        @endif
    @else
        <header class="main-header block-center">Something went wrong. Try later</header>
    @endif
@endsection
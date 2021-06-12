@extends('layouts.app')
@section('content')
    <section class="signin-container tests-container">
        <header class="main-header block-center">Public tests</header>
        @if(isset($data))
            @if($data["status"] == "error")
                <header class="error-header block-center">Something went wrong. Try later</header>
            @else
                <div id="quiz-gallery-container" data-content="{{$data["testsData"]}}"></div>
            @endif
        @else
            <header class="error-header block-center">Something went wrong. Try later</header>
        @endif
    </section>
@endsection
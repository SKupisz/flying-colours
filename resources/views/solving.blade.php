@extends('layouts.app')
@section('content')
    <section class="signin-form block-center">
        @if(isset($data))
            @if($data["status"] == "error")
                <header class="main-header block-center">Something went wrong. Try later</header>
            @elseif($data["status"] == "error-id")
                <header class="main-header block-center">Test not found. Check the correction of ID</header>
            @else
                <header class="main-header block-center">{{$data["quizData"]["testName"]}}</header>
                <div id="quiz-solving-container" data-token="{{csrf_token()}}" data-testToken="{{$data["quizData"]["testKey"]}}"
                data-questionAmount="{{$data["quizData"]["questionsAmount"]}}"></div>
            @endif
        @else
            <header class="main-header block-center">Something went wrong. Try later</header>
        @endif
    </section>
@endsection
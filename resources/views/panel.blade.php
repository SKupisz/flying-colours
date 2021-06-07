@extends('layouts.app')
@section('content')
    <div class="history-container">
        @if (isset($data) && session()->has("current") && session()->has("name"))
            @if($data["status"] == "done")
            <header class="main-header block-center">Welcome again, {{session()->get("name")}}</header>
                <section class="main-data-container block-center">
                    <div class="data-wrapper recently-done">
                        @if(count($data["recentlyDone"]) == 0)
                            <header class="recent-header block-center">You haven't approached any test yet</header>
                            <a href="/tests">
                                <button type="button" class="go-to-tests-btn block-center">Find a test</button>
                            </a>
                        @else
                            <header class="recent-header block-center">Approached tests</header>
                        @endif
                    </div>
                    <div class="data-wrapper recently-published">
                        @if(count($data["recentlyPublished"]) == 0)
                        <header class="recent-header block-center">You haven't published any test yet</header>
                        <a href="/publish">
                            <button type="button" class="go-to-tests-btn block-center">Publish a test</button>
                        </a>
                        @else
                            <header class="recent-header published-header block-center">Published tests</header>
                            @foreach ($data["recentlyPublished"] as $item)
                                <a href = "/solve/{{$item["testKey"]}}">
                                    <div class="created-test block-center">
                                        <header class="created-header test-elem">{{substr($item["testName"],0,20)}}</header>
                                    </div>
                                </a>
                            @endforeach
                        @endif
                    </div>
                </section>
            @else
                <header class="main-header block-center">Loading error. Try again</header>
            @endif
        @else
            <header class="main-header block-center">Loading error. Try again</header>
        @endif
    </div>
@endsection
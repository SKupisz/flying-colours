@if(session()->get("current"))
<div id="main-nav-container" data-issignedin="true"></div>
@else
<div id="main-nav-container" data-issignedin="false"></div>
@endif
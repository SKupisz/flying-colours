import React from "react";
import ReactDOM from "react-dom";

export default class Welcome extends React.Component{
    render(){
        return <div className="signin-container welcome-container">
            <header className="main-header block-center">Welcome to Flying Colours</header>
        </div>;
    }
}

if(document.getElementById("welcome-container")){
    const props = Object.assign({},document.getElementById("welcome-container").dataset);
    ReactDOM.render(<Welcome {...props}/>, document.getElementById("welcome-container"));
}
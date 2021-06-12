import React from "react";
import ReactDOM from "react-dom";
import TestLink from "./publicTestsComponents/TestLink";

export default class PublicTest extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            content: JSON.parse(this.props.content)
        };
    }
    render(){
        return <div className = "tests-showing-wrapper block-center">
            {this.state.content.map(elem => <TestLink key = {elem["testKey"]} testID = {elem["testKey"]}
            name = {elem["testName"]} createDate = {elem["published_on"]}/>)}
        </div>;
    }
}

if(document.getElementById("quiz-gallery-container")){
    const props = Object.assign({},document.getElementById("quiz-gallery-container").dataset);
    ReactDOM.render(<PublicTest {...props}/>, document.getElementById("quiz-gallery-container"));
}
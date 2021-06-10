import React from "react";
import {Grid, InputBase} from "@material-ui/core";

import StandardButton from "../publishPanelComponents/StandardButton.js";

export default class OpenNumberQuestion extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <Grid item xs={12}>
            <div className="answer-wrapper block-center">
                <InputBase type = "number" className="answer-content number-content" margin="dense" variant="filled" 
                placeholder="Answer content..." required defaultValue = {this.props.currentQuestionData["answer"]}
                    onChange = {(event) => {this.props.updateNumberAnswer("answer", "", Number(event.target.value));}}/>
            </div>
            {(this.props.currentQuestionData["questionName"].length > 0
             && this.props.currentQuestionData["points"] > 0 && this.props.currentQuestionData["answer"] !== null) ? <StandardButton
             content = "Next question" classes = "go-to-questions-btn block-center" callbackFunction = {this.props.goToNextQuestion}/>
             : ""}
        </Grid>;
    }
}
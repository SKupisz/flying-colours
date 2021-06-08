import React from "react";
import ReactDOM from "react-dom";
import { Grid, Button } from "@material-ui/core";

import StandardButton from "./publishPanelComponents/StandardButton.js";

export default class TestSolvingPanel extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            ifStarted: false,
            currentQuestion: 0,
            testID: this.props.testtoken,
            errorOccured: false,
            questionAmount: Number(this.props.questionamount),
            currentQuestionData: {

            }
        };

        this.startTheGame = this.startTheGame.bind(this);
        this.getTheQuestion = this.getTheQuestion.bind(this);
    }
    startTheGame(){
        this.setState({
            ifStarted: true,
            currentQuestion: 1
        }, () => {
            this.getTheQuestion();
        });
    }
    async getTheQuestion(){
        if(this.state.currentQuestion <= this.state.questionAmount){
            await fetch ("/solve/getTheRow",{
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    testID: this.state.testID,
                    questionNumber: this.state.currentQuestion,
                    _token: this.props.token
                }) 
            }).then(back => back.json())
            .then(data => {
                if(data[0] === "success"){
                    this.setState({
                        currentQuestion: this.state.currentQuestion+1,
                        currentQuestionData: JSON.parse(data[1][0]["questionData"])
                    }, () => {});
                } 
                else{
                    this.setState({
                        errorOccured: true
                    }, () => {});
                }
            });
        }
        else this.setState({
            currentQuestion: this.state.currentQuestion+1
        }, () => {});
    }
    render(){
        return <Grid container className = "test-solving-container block-center">
            {this.state.ifStarted === false ? <StandardButton content = "Start" classes = "start-btn block-center" callbackFunction = {this.startTheGame}/> 
            : this.state.errorOccured === true ? <Grid item xs={12}>
                <header className="error-header block-center">Test got crashed. Try later</header>
            </Grid> : this.state.currentQuestion-1 > this.state.questionAmount ? <Grid item xs={12}>
                <header className = "ending-header block-center">And that's all!</header>
                <Grid item xs={12}>
                    <div className = "result block-center">Your result was: x/y</div>
                </Grid>
                <Grid item xs = {12} className = "options-wrapper">
                    <StandardButton content = "Solve again" classes = "end-option-btn" callbackFunction = {this.startTheGame}/>
                    <a href = "/tests">
                        <Button color="inherit" className = "end-option-btn">
                            Take another test
                        </Button>
                    </a>
                </Grid>
            </Grid> : <Grid item xs={12}>
                    <header className="question-name block-center">{this.state.currentQuestionData["questionName"]}</header>
                    <StandardButton content = "Next question" classes = "next-btn block-center" callbackFunction = {this.getTheQuestion}/>
                </Grid>}
        </Grid>;
    }
}

if(document.getElementById("quiz-solving-container")){
    const props = Object.assign({},document.getElementById("quiz-solving-container").dataset);
    ReactDOM.render(<TestSolvingPanel {...props}/>, document.getElementById("quiz-solving-container"));
}
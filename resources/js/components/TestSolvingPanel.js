import React from "react";
import ReactDOM from "react-dom";
import { Grid, Button } from "@material-ui/core";

import IntroPanel from "./testSolvingComponents/IntroPanel.js";
import StandardButton from "./publishPanelComponents/StandardButton.js";

import CloseAnswerPanel from "./testSolvingComponents/CloseAnswerPanel.js";
import OpenTextAnswerPanel from "./testSolvingComponents/OpenTextAnswerPanel.js";
import OpenNumberAnswerPanel from "./testSolvingComponents/OpenNumberAnswerPanel.js";

import FinishPanel from "./testSolvingComponents/FinishPanel.js";

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

            },
            currentAnswer: null,
            pointsScored: [],
            pointsTotal: 0,
            finalPoints: 0,
            currentlyChosenAnswerInd: -1
        };

        this.startTheGame = this.startTheGame.bind(this);
        this.getTheQuestion = this.getTheQuestion.bind(this);
        this.closeQuestionChoosing = this.closeQuestionChoosing.bind(this);
        this.openQuestionAnswer = this.openQuestionAnswer.bind(this);
        this.openNumberAnswer = this.openNumberAnswer.bind(this);
    }
    startTheGame(){
        this.setState({
            ifStarted: true,
            currentQuestion: 1,
            currentAnswer: null,
            pointsScored: [],
            pointsTotal: 0,
            finalPoints: 0,
            currentlyChosenAnswerInd: -1
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
                    let operand = JSON.parse(data[1][0]["questionData"]);
                    this.setState({
                        currentQuestion: this.state.currentQuestion+1,
                        currentQuestionData: operand,
                        pointsTotal: this.state.pointsTotal+operand["points"]
                    }, () => {
                        if(this.state.currentQuestionData["type"] === "csa" || this.state.currentQuestionData["type"] === "cma"){
                            this.setState({
                                currentAnswer: "",
                                currentlyChosenAnswerInd: (this.state.currentQuestionData["type"] === "csa" || 
                                this.state.currentQuestionData["type"] === "ota") ? -1 : []
                            }, () => {});
                        }
                    });
                } 
                else{
                    this.setState({
                        errorOccured: true
                    }, () => {});
                }
            });
        }
        else{
            let counter = 0;
            for(let i = 0 ; i < this.state.pointsScored.length; i++){
                counter+=this.state.pointsScored[i];
            }
            let finalResult = ((counter/this.state.pointsTotal).toFixed(2))*100;
            await fetch ("/solve/putTheResults",{
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    testID: this.state.testID,
                    results: finalResult,
                    _token: this.props.token
                })
            }).then(back => back.json())
            .then(data => {
                console.log(data);
                if(data === "success") {
                    this.setState({
                        currentQuestion: this.state.currentQuestion+1,
                        finalPoints: counter
                    }, () => {});
                }
                else{
                    this.setState({
                        errorOccured: true
                    }, () => {});
                }
            })
        }
    }
    closeQuestionChoosing(ind, questionType){
        let ifAdding = false;
        if((questionType === "csa" && ind === this.state.currentQuestionData["correctAnswerInd"]) || 
        (questionType === "cma" && this.state.currentQuestionData["correctAnswerInd"].indexOf(ind) !== -1)){
            ifAdding = true;
        }
        
        let operand = this.state.pointsScored;
        let howMuchUp = 0;
        if(questionType === "cma") howMuchUp = this.state.currentQuestionData["points"]/this.state.currentQuestionData["correctAnswerInd"].length;
        if(this.state.currentQuestion-2 === operand.length){
            if(ifAdding) {
                if(questionType === "csa") operand.push(this.state.currentQuestionData["points"]);
                else if(questionType == "cma") operand.push(howMuchUp);
            }
            else operand.push(0);
        }
        else{
            if(questionType === "csa") operand[this.state.currentQuestion-2] = ifAdding ? this.state.currentQuestionData["points"] : 0;
            else if(questionType == "cma") {
                if(ifAdding) operand[this.state.currentQuestion-2]+=howMuchUp;
                else operand[this.state.currentQuestion-2]-=howMuchUp;
            }
        }
        let newCurrentlyChosenAnswerInd = this.state.currentlyChosenAnswerInd;
        if(questionType === "csa"){
            newCurrentlyChosenAnswerInd = ind === this.state.currentlyChosenAnswerInd ? -1 : ind;
        }
        else if(questionType === "cma"){
            if(this.state.currentlyChosenAnswerInd.indexOf(ind) !== -1){
                newCurrentlyChosenAnswerInd = newCurrentlyChosenAnswerInd.filter(elem => {return elem !== ind});
            }
            else newCurrentlyChosenAnswerInd.push(ind);
        }
        this.setState({
            pointsScored: operand,
            currentlyChosenAnswerInd: newCurrentlyChosenAnswerInd
        }, () => {});
    }
    openQuestionAnswer(text){
        let operand = text.trim();
        operand = operand.toLowerCase();
        let correctAnswer = this.state.currentQuestionData["answer"];
        correctAnswer = correctAnswer.toLowerCase();
        let scoredOperand = this.state.pointsScored, ifCorrect = false;
        if(operand === correctAnswer) ifCorrect = true;
        if(this.state.currentQuestion-2 === scoredOperand.length){
            scoredOperand.push(ifCorrect === true ? this.state.currentQuestionData["points"] : 0);
        }
        else{
            scoredOperand[this.state.currentQuestion-2] = ifCorrect === true ? this.state.currentQuestionData["points"] : 0;
        }
        this.setState({
            currentAnswer: text,
            pointsScored: scoredOperand
        }, () => {});
    }
    openNumberAnswer(newNumber){
        let scoredOperand = this.state.pointsScored, ifCorrect = false;
        if(newNumber === this.state.currentQuestionData["answer"]) ifCorrect = true;
        if(this.state.currentQuestion-2 === scoredOperand.length){
            scoredOperand.push(ifCorrect === true ? this.state.currentQuestionData["points"] : 0);
        }
        else{
            scoredOperand[this.state.currentQuestion-2] = ifCorrect === true ? this.state.currentQuestionData["points"] : 0;
        }
        this.setState({
            currentAnswer: newNumber,
            pointsScored: scoredOperand
        }, () => {});
    }
    render(){
        return <Grid container className = "test-solving-container block-center">
            {this.state.ifStarted === false ? <IntroPanel startGameCallback = {this.startTheGame} author = {this.props.author} 
            publishDate = {this.props.published_on} attemptsAmount={this.props.attempts} questionsAmount = {this.state.questionAmount}
            lastResult = {Number(this.props.lastresult)} averageResult = {Number(this.props.average)}/>
            : this.state.errorOccured === true ? <Grid item xs={12}>
                <header className="error-header block-center">Test got crashed. Try later</header>
            </Grid> : this.state.currentQuestion-1 > this.state.questionAmount ? <FinishPanel result={((this.state.finalPoints/this.state.pointsTotal).toFixed(2))*100} 
            restartTheQuiz = {this.startTheGame}/> : <Grid item xs={12}>
                    <header className="question-name block-center">{this.state.currentQuestionData["questionName"]}</header>
                    {this.state.currentQuestionData["type"] === "csa" ? <CloseAnswerPanel data = {this.state.currentQuestionData["answerStack"]}
                    callBack = {this.closeQuestionChoosing} currentChosen = {this.state.currentlyChosenAnswerInd} type = {this.state.currentQuestionData["type"]}/>: 
                    this.state.currentQuestionData["type"] === "cma" ? <CloseAnswerPanel data = {this.state.currentQuestionData["answerStack"]}
                    callBack = {this.closeQuestionChoosing} currentChosen = {this.state.currentlyChosenAnswerInd} type = {this.state.currentQuestionData["type"]}/>: 
                    this.state.currentQuestionData["type"] === "ota" ? <OpenTextAnswerPanel data = {this.state.currentQuestionData}
                    changeTheAnswer = {this.openQuestionAnswer}/> : 
                    this.state.currentQuestionData["type"] === "ona" ? <OpenNumberAnswerPanel data = {this.state.currentQuestionData}
                    changeTheAnswer = {this.openNumberAnswer} /> : ""}
                    <StandardButton content = {this.state.currentQuestion-1 === this.state.questionAmount ? "Submit the results" : "Next question"}
                     classes = "next-btn block-center" callbackFunction = {this.getTheQuestion}/>
                </Grid>}
        </Grid>;
    }
}

if(document.getElementById("quiz-solving-container")){
    const props = Object.assign({},document.getElementById("quiz-solving-container").dataset);
    ReactDOM.render(<TestSolvingPanel {...props}/>, document.getElementById("quiz-solving-container"));
}
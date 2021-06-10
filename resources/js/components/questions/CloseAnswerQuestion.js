import React from "react";
import { Grid } from "@material-ui/core";

import QuestionContent from "../QuestionContent.js";
import StandardButton from "../publishPanelComponents/StandardButton.js";

export default class CloseAnswerQuestion extends React.Component{
    render(){
        return <Grid item xs={12}>
            {this.props.currentQuestionData.answerStack.map((elem, index) => <QuestionContent defaultValue = {elem} chooseAsCorrect = {this.props.selectNewCorrectAnswer} 
                    questionIndex = {index} currentCorrectInd={this.props.currentQuestionData["correctAnswerInd"]}
                    changeQuestionAnswer = {this.props.changeQuestionAnswer}
                    deleteTheAnswer = {this.props.deleteTheAnswer}/>)}
            {(((this.props.currentQuestionData["type"] === "csa" && this.props.currentQuestionData["correctAnswerInd"] !== -1) || (this.props.currentQuestionData["type"] === "cma" && this.props.currentQuestionData["correctAnswerInd"].length > 0)) && this.props.currentQuestionType !== -1 
            && this.props.currentQuestionData["questionName"].length > 0
            && this.props.currentQuestionData["answerStack"].length > 0 && this.props.currentQuestionData["points"] > 0) ? <StandardButton
            content = "Next question" classes = "go-to-questions-btn block-center" callbackFunction = {this.props.goToNextQuestion}/>: ""}
        </Grid>
    }
}
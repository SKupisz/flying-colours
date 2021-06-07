import React from "react";
import { Grid, TextField } from "@material-ui/core";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export default class QuestionContent extends React.Component{
    render(){
        let ifChosen = false;
        if(typeof this.props.currentCorrectInd === "object"){
            if(this.props.currentCorrectInd.indexOf(this.props.questionIndex) !== -1) ifChosen = true;
        }
        else if(typeof this.props.currentCorrectInd === "number" && this.props.currentCorrectInd === this.props.questionIndex) ifChosen = true;
        return <Grid item xs = {12}>
            <div className="answer-wrapper block-center">
            {!ifChosen ? <HighlightOffIcon  onClick = {() => {this.props.chooseAsCorrect(this.props.questionIndex)}} className="answer-icon answer-wrong"/> : 
            <CheckCircleOutlineIcon onClick = {() => {this.props.chooseAsCorrect(this.props.questionIndex);}} className="answer-icon answer-correct"/>}
                <DeleteForeverIcon onClick = {() => {this.props.deleteTheAnswer(this.props.questionIndex);}} className = "answer-icon delete-icon"/>
                <TextField className="answer-content" margin="dense" variant="filled" 
                type = "text" placeholder="Answer content..." required defaultValue = {this.props.defaultValue}
                onChange= {event => {this.props.changeQuestionAnswer(event, this.props.questionIndex);}}/>
            </div>
        </Grid> ;
    }
}

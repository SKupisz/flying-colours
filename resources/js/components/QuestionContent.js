import React from "react";
import { Grid, TextField } from "@material-ui/core";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

export default class QuestionContent extends React.Component{
    render(){
        return <Grid item xs = {12}>
            <div className="answer-wrapper block-center">
            {this.props.currentCorrectInd !== this.props.questionIndex ? <HighlightOffIcon  onClick = {() => {console.log(this.props.currentCorrectInd);this.props.chooseAsCorrect(this.props.questionIndex)}} className="answer-icon answer-wrong"/> : 
            <CheckCircleOutlineIcon onClick = {() => {this.props.chooseAsCorrect(this.props.questionIndex);}} className="answer-icon answer-correct"/>}
                <TextField className="answer-content" margin="dense" variant="filled" 
                type = "text" placeholder="Answer content..." required defaultValue = {this.props.defaultValue}/>
            </div>
        </Grid> ;
    }
}

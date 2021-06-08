import React from "react";
import {Grid, TextField, InputBase, Button} from "@material-ui/core";
import BorderColorIcon from '@material-ui/icons/BorderColor';

export default class OpenTextQuestion extends React.Component{
    constructor(props){
        super(props);

        this.answerRef = React.createRef();
        this.limitRef = React.createRef();

        this.state = {
            lastVersionOfAnswer: this.props.currentQuestionData["answer"],
            lastMaxLimit: this.props.currentQuestionData["answerMaxLength"]["maxLength"]
        };

        this.checkIfItCanWork = this.checkIfItCanWork.bind(this);
        this.sendUpdateRequest = this.sendUpdateRequest.bind(this);
        this.checkIfTheRestrictionsAreCorrect = this.checkIfTheRestrictionsAreCorrect.bind(this);
    }
    sendUpdateRequest(forHelp){
        this.setState({
            lastVersionOfAnswer: forHelp
        }, () => {
            this.props.updateTextAnswer(forHelp);
        });
    }
    checkIfItCanWork(event){
        let forHelp = event.target.value;
        if(this.props.currentQuestionData["answerMaxLength"]["isMax"] === true){
            if(forHelp.length > this.props.currentQuestionData["answerMaxLength"]["maxLength"]){
                this.answerRef.current.childNodes[0].childNodes[0].value = this.state.lastVersionOfAnswer;
            }
            else this.sendUpdateRequest(forHelp);
        }
        else this.sendUpdateRequest(forHelp);
    }
    checkIfTheRestrictionsAreCorrect(){
        let forHelp = this.limitRef.current.childNodes[0].value;
        console.log(typeof forHelp);
        if(typeof Number(forHelp) === "number" && forHelp.indexOf(".") === -1 && forHelp.indexOf(",") === -1){
            forHelp = Number(forHelp);
            if(forHelp < 1 || forHelp > 4000){
                this.limitRef.current.childNodes[0].value = this.state.lastMaxLimit;
            }
            else this.setState({
                lastMaxLimit: forHelp
            }, () => { 
                this.props.changeTheCharsLimit(forHelp); 
            });
        }
        else{
            this.limitRef.current.childNodes[0].value = this.state.lastMaxLimit;
        }
    }
    render(){
        return <Grid item xs={12}>
            <div className="answer-wrapper block-center">
                <BorderColorIcon className = {this.props.currentQuestionData["answerMaxLength"]["isMax"] === false ? "answer-icon answer-wrong" : "answer-icon answer-correct"}
                onClick = {() => {this.props.changeTheLimitState()}}/>
                { this.props.currentQuestionData["answerMaxLength"]["isMax"] === true ? <InputBase type="number" placeholder="How many questions?" required 
                    margin="dense" variant="filled" className="max-length-input block-center" name = "questions-amount"
                    defaultValue = {this.props.currentQuestionData["answerMaxLength"]["maxLength"]}
                    onChange = {() => {this.checkIfTheRestrictionsAreCorrect();}}
                    ref = {this.limitRef}/> : "" }
                <TextField className="answer-content" margin="dense" variant="filled" 
                    type = "text" placeholder="Answer content..." required defaultValue = {this.props.currentQuestionData["answer"]}
                    onChange = {(event) => {this.checkIfItCanWork(event);}} ref = {this.answerRef}/>
            </div>
            {(this.props.currentQuestionData["questionName"].length > 0
            && this.props.currentQuestionData["answer"].length > 0) ? <Grid item xs={12}>
                        <Button variant="contained" 
                        className="go-to-questions-btn block-center" type = "button"
                        onClick = {() => {this.props.goToNextQuestion()}}>
                            Next question
                        </Button>
            </Grid> : ""}
        </Grid>
    }
}
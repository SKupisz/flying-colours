import React from "React";
import ReactDOM from "react-dom";
import {Grid, InputBase, Button, TextField} from "@material-ui/core";
import QuestionContent from "./QuestionContent.js";

export default class TestCreator extends React.Component{
    constructor(props){
        super(props);

        this.singleAnswerRef = React.createRef();
        this.multiAnswerRef = React.createRef();
        this.textAnswerRef = React.createRef();
        this.numberAnswerRef = React.createRef();

        this.state = {
            ifCreatingAllowed: true,
            startedCreating: true,
            currentQuestion: 1,
            howManyQuestions: 1,
            currentQuestionType: -1,
            currentQuestionData: {
                answerStack: ["true", "false"],
                correctAnswerInd: -1
            }
        };

        this.allowNextPhase = this.allowNextPhase.bind(this);
        this.startCreating = this.startCreating.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.pickUpNewQuestionType = this.pickUpNewQuestionType.bind(this);
        this.selectNewCorrectAnswer = this.selectNewCorrectAnswer.bind(this);

        this.tableOfQuestionTypeRefs = [this.singleAnswerRef, this.multiAnswerRef, this.textAnswerRef, this.numberAnswerRef];
    }
    allowNextPhase(event){
        let helper = parseInt(event.target.value);
        if(helper > 0 && Number.isInteger(helper) === true && event.target.value.indexOf(",") === -1 && event.target.value.indexOf(".") === -1){
            this.setState({
                 ifCreatingAllowed: true,
                 howManyQuestions: helper
            }, () => {});
        }
        else this.setState({
            ifCreatingAllowed: false
        }, () => {});
    }
    startCreating(){
        this.setState({
            startedCreating: true
        }, () => {});
    }
    pickUpNewQuestionType(ind){
        this.setState({
            currentQuestionType: this.state.currentQuestionType === ind ? -1 : ind
        }, () => {
            for(let i = 0 ; i < this.tableOfQuestionTypeRefs.length; i++){
                if(i === this.state.currentQuestionType) this.tableOfQuestionTypeRefs[i].current.classList.add("selected-type");
                else this.tableOfQuestionTypeRefs[i].current.classList.remove("selected-type");
            }
        });
    }
    selectNewCorrectAnswer(ind){
        let operand = this.state.currentQuestionData;
        operand["correctAnswerInd"] = ind === operand["correctAnswerInd"] ? -1 : ind;
        this.setState({
            currentQuestionData: operand
        }, () => {console.log(this.state.currentQuestionData["correctAnswerInd"])});
    }
    nextQuestion(){
        this.setState({
            currentQuestion: this.state.currentQuestion+1
        }, () => {});
    }
    render(){
        return <div>
            {this.state.startedCreating === false ? <Grid container className="creator-container block-center">
                <Grid item xs={12}>
                    
                    <InputBase type="number" placeholder="How many questions?" required 
                    margin="dense" variant="filled" className="questions-input block-center" name = "questions-amount"
                    min={1} onChange={(event) => {this.allowNextPhase(event);}}/>

                </Grid>
                {this.state.ifCreatingAllowed === true ? <Grid item xs = {12}>
                    <Button variant="contained" 
                    className="go-to-questions-btn block-center" type = "button"
                    onClick = {() => {this.startCreating()}}>
                        Create the questions
                    </Button>
                </Grid> : ""}
            </Grid> : this.state.currentQuestion <= this.state.howManyQuestions ? <Grid container className="creator-panel block-center">
                    <Grid item xs={12}>
                        <header className="question-header block-center">Question nr {this.state.currentQuestion}</header>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Question" variant="filled" 
                            className = "question-name-input block-center" margin="normal" name="question-name"/>
                    </Grid>
                    <Grid item xs={12}>
                        <header className="question-sub-header block-center">Select type of the questions</header>
                    </Grid>
                    <Grid item xs={12} className="type-container block-center">
                        <Button type="button" variant="contained" className="question-type-btn" ref = {this.singleAnswerRef}
                        onClick = {() => {this.pickUpNewQuestionType(0)}}>Closed-single answer</Button>
                        <Button type="button" variant="contained" className="question-type-btn" ref = {this.multiAnswerRef}
                        onClick = {() => {this.pickUpNewQuestionType(1)}}>Closed-multi answer</Button>
                        <Button type="button" variant="contained" className="question-type-btn" ref = {this.textAnswerRef}
                        onClick = {() => {this.pickUpNewQuestionType(2)}}>Open-text answer</Button>
                        <Button type="button" variant="contained" className="question-type-btn" ref = {this.numberAnswerRef}
                        onClick = {() => {this.pickUpNewQuestionType(3)}}>Open-number answer</Button>
                    </Grid>
                    {this.state.currentQuestionType === -1 ? "" : this.state.currentQuestionType === 0 ?
                    this.state.currentQuestionData.answerStack.map((elem, index) => <QuestionContent defaultValue = {elem} chooseAsCorrect = {this.selectNewCorrectAnswer} 
                    questionIndex = {index} currentCorrectInd={this.state.currentQuestionData["correctAnswerInd"]}/>) : ""}
                    {this.state.currentQuestionData["correctAnswerInd"] !== -1 ? <Grid item xs={12}>
                        <Button variant="contained" 
                        className="go-to-questions-btn block-center" type = "button"
                        onClick = {() => {this.nextQuestion()}}>
                            Next question
                        </Button>
                    </Grid> : ""}
                </Grid> : <Grid container className="creator-panel block-center">
                    <Grid item xs={12}>
                        <header className="question-header block-center">End of Questions</header>
                    </Grid>
                </Grid>}
        </div>
    }
}

if(document.getElementById("test-creator-wrapper")){
    const props = Object.assign({},document.getElementById("test-creator-wrapper").dataset);
    ReactDOM.render(<TestCreator {...props}/>, document.getElementById("test-creator-wrapper"));
}
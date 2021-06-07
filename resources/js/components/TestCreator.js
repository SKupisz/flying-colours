import React from "React";
import ReactDOM from "react-dom";
import {Grid, InputBase, Button, TextField} from "@material-ui/core";
import QuestionTypes from "./QuestionTypes.js";
import CloseAnswerQuestion from "./questions/CloseAnswerQuestion.js";

export default class TestCreator extends React.Component{
    constructor(props){
        super(props);

        this.singleAnswerRef = React.createRef();
        this.multiAnswerRef = React.createRef();
        this.textAnswerRef = React.createRef();
        this.numberAnswerRef = React.createRef();

        this.defaultQuestionModels = [
            {
                type: "csa",
                questionName: "",
                answerStack: ["true", "false"],
                correctAnswerInd: -1 // closed-single-answer
            },
            {
                type: "cma",
                questionName: "",
                answerStack: ["true", "false"],
                correctAnswerInd: [] // closed-multi-answer
            }
        ];

        this.state = {
            ifCreatingAllowed: true,
            startedCreating: true,
            currentQuestion: 1,
            howManyQuestions: 1,
            currentQuestionType: -1,
            currentQuestionData: {
                type: "cma",
                questionName: "",
                answerStack: ["true", "false"],
                correctAnswerInd: -1
            },
            currentTestID: "",
            isEndingOfTheQuiz: false
        };

        this.allowNextPhase = this.allowNextPhase.bind(this);
        this.startCreating = this.startCreating.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.pickUpNewQuestionType = this.pickUpNewQuestionType.bind(this);
        this.selectNewCorrectAnswer = this.selectNewCorrectAnswer.bind(this);
        this.addNewCorrectAnswer = this.addNewCorrectAnswer.bind(this);
        this.sendNextRowData = this.sendNextRowData.bind(this);
        this.previousQuestion = this.previousQuestion.bind(this);
        this.lastPhase = this.lastPhase.bind(this);
        this.finishThePublishing = this.finishThePublishing.bind(this);
        this.changeQuestionAnswer = this.changeQuestionAnswer.bind(this);
        this.changeQuestionName = this.changeQuestionName.bind(this);

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
            currentQuestionData: this.state.currentQuestionType === ind ? {} : this.defaultQuestionModels[ind],
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
        }, () => {});
    }
    addNewCorrectAnswer(ind){
        let operand = this.state.currentQuestionData;
        operand["correctAnswerInd"].indexOf(ind) === -1 ? operand["correctAnswerInd"].push(ind) : operand["correctAnswerInd"] = operand["correctAnswerInd"].filter((elem) => { return elem !== ind;});
        this.setState({
            currentQuestionData: operand
        }, () => {});
    }
    nextQuestion(){
        this.sendNextRowData(this.state.currentQuestionData);
    }
    previousQuestion(){
        this.setState({
            currentQuestion: this.state.currentQuestion-1
        }, () => {});
    }
    async sendNextRowData(dataToSend){
        await fetch("/publish/tempRow",{
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                questionNumber: this.state.currentQuestion,
                questionData: JSON.stringify(dataToSend),
                testID: this.state.currentTestID,
                _token: this.props.token
            })
        }).then(back => back.json())
        .then(data => {
            if(data[0] === "success"){
                this.setState({
                    currentQuestion: this.state.currentQuestion+1,
                    currentTestID: this.state.currentTestID === "" ? data[1] : this.state.currentTestID
                }, () => {});
            }
            else{

            }
        });
    }
    lastPhase(){
        this.setState({
            isEndingOfTheQuiz: !this.state.isEndingOfTheQuiz
        }, () => {});
    }
    changeQuestionAnswer(event, ind){
        let operand = this.state.currentQuestionData, newName = event.target.value;
        operand["answerStack"][ind] = newName;
        this.setState({
            currentQuestionData: operand
        }, () => {});
    }
    changeQuestionName(event){
        let operand = this.state.currentQuestionData, newName = event.target.value;
        operand["questionName"] = newName;
        this.setState({
            currentQuestionData: operand
        }, () => {});
    }
    finishThePublishing(){

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
                            className = "question-name-input block-center" margin="normal" name="question-name"
                            onChange = {event => {this.changeQuestionName(event);}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <header className="question-sub-header block-center">Select type of the questions</header>
                    </Grid>
                    <QuestionTypes refsTable = {this.tableOfQuestionTypeRefs} callBackFunction = {this.pickUpNewQuestionType}/>
                    {this.state.currentQuestionType === -1 ? "" : this.state.currentQuestionType === 0 ?
                    <CloseAnswerQuestion currentQuestionData = {this.state.currentQuestionData} 
                    selectNewCorrectAnswer = {this.selectNewCorrectAnswer}
                    currentQuestionType = {this.state.currentQuestionType}
                    goToNextQuestion = {this.nextQuestion}
                    changeQuestionAnswer = {this.changeQuestionAnswer}/> : this.state.currentQuestionType === 1 ? <CloseAnswerQuestion currentQuestionData = {this.state.currentQuestionData} 
                    selectNewCorrectAnswer = {this.addNewCorrectAnswer}
                    currentQuestionType = {this.state.currentQuestionType}
                    goToNextQuestion = {this.nextQuestion}
                    changeQuestionAnswer = {this.changeQuestionAnswer}/> : ""}
                </Grid> : this.state.isEndingOfTheQuiz === false ? <Grid container className="creator-panel block-center">
                    <Grid item xs={12}>
                        <header className="question-header block-center">End of Questions</header>
                        <Grid item xs={12} className="ending-options-container">
                            <Button variant="contained" 
                            className="ending-phase-btn" type = "button"
                            onClick = {() => {this.previousQuestion()}}>
                                Previous question
                            </Button>
                            <Button variant="contained" 
                            className="ending-phase-btn" type = "button"
                            onClick = {() => {this.lastPhase()}}>
                                Finish creating
                            </Button>
                        </Grid>
                    </Grid>
                </Grid> : <Grid container className = "ending-panel block-center">
                        <header className="ending-header block-center">Final data</header>  
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Test name" variant="filled" 
                                className = "question-name-input block-center" margin="normal" name="test-name"/>  
                        </Grid>   
                        <Grid item xs={12}>
                        <Button variant="contained" 
                            className="finish-btn" type = "button"
                            onClick = {() => {this.finishThePublishing()}}>
                                Publish the quiz
                            </Button>
                        </Grid> 
                </Grid>}
        </div>
    }
}

if(document.getElementById("test-creator-wrapper")){
    const props = Object.assign({},document.getElementById("test-creator-wrapper").dataset);
    ReactDOM.render(<TestCreator {...props}/>, document.getElementById("test-creator-wrapper"));
}
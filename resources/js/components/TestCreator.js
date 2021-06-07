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

        this.state = {
            ifCreatingAllowed: false,
            startedCreating: false,
            currentQuestion: 1,
            howManyQuestions: 1,
            currentQuestionType: -1,
            currentQuestionData: {
                type: "csa",
                questionName: "",
                answerStack: ["answer 1", "answer 2"],
                correctAnswerInd: -1 // closed-single-answer
            },
            currentTestID: "",
            isEndingOfTheQuiz: false,
            quizName: "",
            currentQuestionName: "",
            isPublished: 0
        };

        this.defaultQuestionModels = [
            {
                type: "csa",
                questionName: this.state.currentQuestionName,
                answerStack: ["answer 1", "answer 2"],
                correctAnswerInd: -1 // closed-single-answer
            },
            {
                type: "cma",
                questionName: this.state.currentQuestionName,
                answerStack: ["answer 1", "answer 2"],
                correctAnswerInd: [] // closed-multi-answer
            }
        ];

        this.allowNextPhase = this.allowNextPhase.bind(this);
        this.startCreating = this.startCreating.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.pickUpNewQuestionType = this.pickUpNewQuestionType.bind(this);
        this.selectNewCorrectAnswer = this.selectNewCorrectAnswer.bind(this);
        this.addNewAnswer = this.addNewAnswer.bind(this);
        this.deleteAnswer = this.deleteAnswer.bind(this);
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
        let current = this.state.currentQuestionData, operand = this.defaultQuestionModels[ind];
        if(current["questionName"] !== "") operand["questionName"] = current["questionName"];
        operand["questionName"] = this.state.currentQuestionName;
        this.setState({
            currentQuestionData: this.state.currentQuestionType === ind ? {} : {...operand},
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
                    currentTestID: this.state.currentTestID === "" ? data[1] : this.state.currentTestID,
                    currentQuestionType: -1,
                    currentQuestionData: {}
                }, () => {});
            }
            else{
                console.log("fail");
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
            currentQuestionData: operand,
            currentQuestionName: newName
        }, () => {});
    }
    addNewAnswer(){
        let operand = this.state.currentQuestionData;
        operand["answerStack"].push("answer "+(this.state.currentQuestionData["answerStack"].length+1));
        this.setState({
            currentQuestionData: operand
        }, () => {});
    }
    deleteAnswer(ind){
        let operand = this.state.currentQuestionData;
        operand["answerStack"] = operand["answerStack"].filter((elem,index) => {console.log(index); return index !== ind});
        console.log(operand["answerStack"]);
        this.setState({
            currentQuestionData: operand
        }, () => {});
    }
    giveTheNewName(event){
        let helper = event.target.value;
        this.setState({
            quizName: helper
        }, () => {});
    }
    async finishThePublishing(){
        await fetch("/publish/publishTheTest",{
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                testName: this.state.quizName,
                questionsAmount: this.state.howManyQuestions,
                testID: this.state.currentTestID,
                _token: this.props.token
            })
        }).then(back => back.json())
        .then(data => {
            this.setState({
                isPublished: data === "success" ? 1 : -1
            }, () => {});
        })
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
                    {this.state.currentQuestionType === 0 || this.state.currentQuestionType === 1 ? <Grid item xs = {12}>
                        <Button variant="contained" 
                        className="adding-answer-button block-center" type = "button"
                        onClick = {() => {this.addNewAnswer()}}>
                            Add an answer
                        </Button>
                    </Grid> : ""}
                    {this.state.currentQuestionType === -1 ? "" : this.state.currentQuestionType === 0 ?
                    <CloseAnswerQuestion currentQuestionData = {this.state.currentQuestionData} 
                    selectNewCorrectAnswer = {this.selectNewCorrectAnswer}
                    currentQuestionType = {this.state.currentQuestionType}
                    goToNextQuestion = {this.nextQuestion} deleteTheAnswer = {this.deleteAnswer}
                    changeQuestionAnswer = {this.changeQuestionAnswer}/> : this.state.currentQuestionType === 1 ? <CloseAnswerQuestion currentQuestionData = {this.state.currentQuestionData} 
                    selectNewCorrectAnswer = {this.addNewCorrectAnswer}
                    currentQuestionType = {this.state.currentQuestionType}
                    goToNextQuestion = {this.nextQuestion} deleteTheAnswer = {this.deleteAnswer}
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
                        {this.state.isPublished === 0 ? <Grid item xs={12}>
                            <header className="ending-header block-center">Final data</header>  
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Test name" variant="filled" 
                                    className = "question-name-input block-center" margin="normal" name="test-name"
                                    onChange = {event => {this.giveTheNewName(event);}}/>  
                            </Grid>
                            {this.state.quizName.length > 0 ? <Grid item xs={12}>
                                <Button variant="contained" 
                                    className="finish-btn" type = "button"
                                    onClick = {() => {this.finishThePublishing()}}>
                                    Publish the quiz
                                </Button>
                            </Grid> : ""}
                        </Grid>  : this.state.isPublished === 1 ? <Grid item xs={12}>
                            <header className = "published-header block-center">You've just published the test!</header>
                            <a href = {"/solve/"+this.state.currentTestID}>
                                <Button variant="contained" className="finish-btn" type = "button">
                                    Solve the quiz
                                </Button>
                            </a>
                        </Grid> : <Grid item xs={12}>
                        <header className = "published-header block-center">Something went wrong. Try another time</header>
                        <a href = "/publish">
                                <Button variant="contained" className="finish-btn" type = "button">
                                    Go back
                                </Button>
                            </a>
                        </Grid>}
                </Grid>}
        </div>
    }
}

if(document.getElementById("test-creator-wrapper")){
    const props = Object.assign({},document.getElementById("test-creator-wrapper").dataset);
    ReactDOM.render(<TestCreator {...props}/>, document.getElementById("test-creator-wrapper"));
}
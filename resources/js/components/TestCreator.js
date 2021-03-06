import React from "React";
import ReactDOM from "react-dom";
import {Grid, InputBase, Button, TextField} from "@material-ui/core";

import QuestionsAmount from "./publishPanelComponents/QuestionsAmount.js";
import StandardButton from "./publishPanelComponents/StandardButton.js";
import QuestionTypes from "./QuestionTypes.js";

import CloseAnswerQuestion from "./questions/CloseAnswerQuestion.js";
import OpenTextQuestion from "./questions/OpenTextQuestion.js";
import OpenNumberQuestion from "./questions/OpenNumberQuestion.js";

import EndingPanel from "./publishPanelComponents/EndingPanel.js";
import LastStandDecision from "./publishPanelComponents/LastStandDecision.js";

export default class TestCreator extends React.Component{
    constructor(props){
        super(props);

        this.singleAnswerRef = React.createRef();
        this.multiAnswerRef = React.createRef();
        this.textAnswerRef = React.createRef();
        this.numberAnswerRef = React.createRef();
        this.textGivenAnswerRef = React.createRef();
        this.pointsRef = React.createRef();

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
                correctAnswerInd: -1, // closed-single-answer
                points: 0
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
                correctAnswerInd: -1, // closed-single-answer
                points: 0
            },
            {
                type: "cma",
                questionName: this.state.currentQuestionName,
                answerStack: ["answer 1", "answer 2"],
                correctAnswerInd: [], // closed-multi-answer
                points: 0
            },
            {
                type: "ota",
                questionName: this.state.currentQuestionName,
                answer: "",
                answerMaxLength: {
                    isMax: false,
                    maxLength: 100
                },
                points: 0
            },
            {
                type: "ona",
                questionName: this.state.currentQuestionName,
                answer: 0,
                points: 0
            },
            {
                type: "tga", // text-given answer, works only for english texts
                questionNames: [],
                answers: [],
                points: []
            }
        ];

        this.allowNextPhase = this.allowNextPhase.bind(this);
        this.startCreating = this.startCreating.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.pickUpNewQuestionType = this.pickUpNewQuestionType.bind(this);
        this.selectNewCorrectAnswer = this.selectNewCorrectAnswer.bind(this);
        this.setNewValueOfTheQuestionData = this.setNewValueOfTheQuestionData.bind(this);
        this.addNewAnswer = this.addNewAnswer.bind(this);
        this.deleteAnswer = this.deleteAnswer.bind(this);
        this.addNewCorrectAnswer = this.addNewCorrectAnswer.bind(this);
        this.updateTextAnswer = this.updateTextAnswer.bind(this);
        this.changeTheLimitState = this.changeTheLimitState.bind(this);
        this.changeTextMaxLength = this.changeTextMaxLength.bind(this);
        this.sendNextRowData = this.sendNextRowData.bind(this);
        this.previousQuestion = this.previousQuestion.bind(this);
        this.lastPhase = this.lastPhase.bind(this);
        this.finishThePublishing = this.finishThePublishing.bind(this);
        this.changeQuestionAnswer = this.changeQuestionAnswer.bind(this);
        this.changeQuestionName = this.changeQuestionName.bind(this);
        this.updateTheMaxPoints = this.updateTheMaxPoints.bind(this);
        this.giveTheNewName = this.giveTheNewName.bind(this);

        this.tableOfQuestionTypeRefs = [this.singleAnswerRef, this.multiAnswerRef, this.textAnswerRef, this.numberAnswerRef, this.textGivenAnswerRef];
        this.optionsNames = ["Closed-single", "Closed-multi", "Open-text", "Open-number", "Text given"];
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
        const inputValue = ind.target.value;
        const finalInd = this.optionsNames.indexOf(inputValue);
        if(finalInd === -1){
            this.setState({
                currentQuestionData: {},
                currentQuestionType: -1
            }, () => {});
        }
        else{
            let current = this.state.currentQuestionData, operand = this.defaultQuestionModels[finalInd];
            if(current["questionName"] !== "") operand["questionName"] = current["questionName"];
            operand["questionName"] = this.state.currentQuestionName;
            operand["points"] = this.state.currentQuestionData["points"];
            this.setState({
                currentQuestionData: this.state.currentQuestionType === finalInd ? {} : {...operand},
                currentQuestionType: this.state.currentQuestionType === finalInd ? -1 : finalInd
            }, () => {});
        }
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
    setNewValueOfTheQuestionData(ind, secondInd, newValue){
        let operand = this.state.currentQuestionData;
        if(secondInd === "") operand[ind] = newValue;
        else operand[ind][secondInd] = newValue;
        this.setState({
            currentQuestionData: operand
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
        operand["answerStack"] = operand["answerStack"].filter((elem,index) => {return index !== ind});
        this.setState({
            currentQuestionData: operand
        }, () => {});
    }
    updateTextAnswer(newText){
        let operand = this.state.currentQuestionData;
        operand["answer"] = newText;
        this.setState({
            currentQuestionData: operand
        }, () => {});
    }
    changeTheLimitState(){
        let operand = this.state.currentQuestionData;
        operand["answerMaxLength"]["isMax"] = !operand["answerMaxLength"]["isMax"];
        this.setState({
            currentQuestionData: operand
        }, () => {});
    }
    changeTextMaxLength(newLimit){
        let operand = this.state.currentQuestionData;
        operand["answerMaxLength"]["maxLength"] = newLimit;
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
    updateTheMaxPoints(event){
        let helper = Number(event.target.value);
        if(helper < 0 || Number.isInteger(helper) === false){
            this.pointsRef.current.childNodes[0].value = this.state.currentQuestionData["points"];
        }
        else{
            let operand = this.state.currentQuestionData;
            operand["points"] = helper;
             this.setState({
                currentQuestionData: operand
            }, () => {});
            
        }
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
            {this.state.startedCreating === false ? <QuestionsAmount numberCallback = {this.allowNextPhase} 
            creatingAllowed = {this.state.ifCreatingAllowed} startCallback = {this.startCreating}/> : this.state.currentQuestion <= this.state.howManyQuestions ? <Grid container className="creator-panel block-center">
                    <Grid item xs={12}>
                        <header className="question-header block-center">Question nr {this.state.currentQuestion}</header>
                    </Grid>
                    <QuestionTypes optionsNames = {this.optionsNames} callBackFunction = {this.pickUpNewQuestionType}
                    currentlySelectedType={this.state.currentQuestionType === -1 ? "None" : this.optionsNames[this.state.currentQuestionType]}/>
                    {this.state.currentQuestionType !== -1 && this.state.currentQuestionType !== 4 ? <Grid item xs={12}>
                        <TextField
                            required
                            label="Question" variant="filled" 
                            className = "question-name-input block-center" margin="normal" name="question-name"
                            onChange = {event => {this.changeQuestionName(event);}}/>
                    </Grid> : ""}
                    {this.state.currentQuestionType === 0 || this.state.currentQuestionType === 1 ? <StandardButton content = "Add an answer"
                        classes = "adding-answer-button block-center" callbackFunction={this.addNewAnswer}/> : ""}
                    {this.state.currentQuestionType !== -1 ? <Grid item xs={12}>
                        <InputBase type="number" placeholder="How many points?" required 
                        margin="dense" variant="filled" className="points-input block-center" name = "max-points"
                        onChange={(event) => {this.updateTheMaxPoints(event);}} ref = {this.pointsRef}/>
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
                    changeQuestionAnswer = {this.changeQuestionAnswer}/> : this.state.currentQuestionType === 2 ? <OpenTextQuestion currentQuestionData = {this.state.currentQuestionData}
                    updateTextAnswer = {this.updateTextAnswer}
                    changeTheLimitState = {this.changeTheLimitState}
                    changeTheCharsLimit = {this.changeTextMaxLength}
                    goToNextQuestion = {this.nextQuestion}/> : this.state.currentQuestionType === 3 ? <OpenNumberQuestion currentQuestionData = {this.state.currentQuestionData}
                    updateNumberAnswer = {this.setNewValueOfTheQuestionData}
                    goToNextQuestion = {this.nextQuestion}/> : ""}
                </Grid> : 
                this.state.isEndingOfTheQuiz === false ? <LastStandDecision prevQuestion = {this.previousQuestion} 
                finalizeTheQuiz = {this.lastPhase}/> : <EndingPanel isPublished = {this.state.isPublished}
                changeNameCallback = {this.giveTheNewName} quizName = {this.state.quizName} 
                finishPublishingCallback = {this.finishThePublishing} testID = {this.state.currentTestID}/>}
        </div>
    }
}

if(document.getElementById("test-creator-wrapper")){
    const props = Object.assign({},document.getElementById("test-creator-wrapper").dataset);
    ReactDOM.render(<TestCreator {...props}/>, document.getElementById("test-creator-wrapper"));
}
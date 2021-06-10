import React from "react";
import { Grid, TextField } from "@material-ui/core";

class OpenTextAnswerPanel extends React.Component{
    constructor(props){
        super(props);

        this.textFieldRef = React.createRef();

        this.state = {
            answer: ""
        };

        this.checkIfCanBeAccepted = this.checkIfCanBeAccepted.bind(this);

    }
    checkIfCanBeAccepted(event){
        let helper = event.target.value;
        if(this.props.data["answerMaxLength"]["isMax"] === true && this.props.data["answerMaxLength"]["maxLength"] <= helper.length){
            this.textFieldRef.current.value = this.state.answer;
        } 
        else{
            this.setState({
                answer: helper
            }, () => {this.props.changeTheAnswer(helper);});
        }
    }
    render(){
        return <Grid item xs={12}>
            <div className = "solving-answer-container block-center">
                <TextField
                    required label="Answer" variant="filled"
                    className = "text-answer block-center" margin="normal" name="answer" type = "text" ref = {this.textFieldRef}
                    value = {this.state.answer} onChange = {event => {this.checkIfCanBeAccepted(event);}}/>
            </div>
        </Grid>;
    }
} 

export default OpenTextAnswerPanel;
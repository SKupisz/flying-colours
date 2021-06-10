import React from "react";
import { Grid, InputBase } from "@material-ui/core";

class OpenNumberAnswerPanel extends React.Component{
    constructor(props){
        super(props);

        this.numberInputRef = React.createRef();

        this.state = {
            answer: ""
        };

        this.checkIfCanBeAccepted = this.checkIfCanBeAccepted.bind(this);

    }
    checkIfCanBeAccepted(event){
        let inputValue = event.target.value; 
        let helper = Number(inputValue);
        console.log(typeof helper, inputValue.indexOf("+"));
        if(inputValue.length > 0 && helper !== NaN && inputValue.indexOf("+") === -1 && inputValue.indexOf("-") <= 0){
            this.setState({
                answer: helper
            }, () => {this.props.changeTheAnswer(helper);});
        }
        else {
            this.numberInputRef.current.value = this.state.answer;
        }
    }
    render(){
        return <Grid item xs={12}>
            <div className = "solving-answer-container block-center">
            <InputBase type = "number" className="number-answer block-center" margin="dense" variant="filled" 
                placeholder="Answer content..." ref = {this.numberInputRef} value = {this.state.answer}
                    onChange = {(event) => {this.checkIfCanBeAccepted(event);}}/>
            </div>
        </Grid>;
    }
} 

export default OpenNumberAnswerPanel;
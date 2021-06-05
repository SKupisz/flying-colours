import React from "React";
import ReactDOM from "react-dom";
import {Grid, InputBase, Button} from "@material-ui/core";

export default class TestCreator extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            ifCreatingAllowed: false,
            startedCreating: false,
            currentQuestion: 1
        };

        this.allowNextPhase = this.allowNextPhase.bind(this);
        this.startCreating = this.startCreating.bind(this);
    }
    allowNextPhase(event){
        let helper = parseInt(event.target.value);
        if(helper > 0 && Number.isInteger(helper) === true && event.target.value.indexOf(",") === -1 && event.target.value.indexOf(".") === -1){
            this.setState({
                 ifCreatingAllowed: true
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
            </Grid> : <Grid container className="creator-panel block-center">
                    <Grid item xs={12}>
                        <header className="question-header block-center">Question nr {this.state.currentQuestion}</header>
                    </Grid>
                </Grid>}
        </div>
    }
}

if(document.getElementById("test-creator-wrapper")){
    const props = Object.assign({},document.getElementById("test-creator-wrapper").dataset);
    ReactDOM.render(<TestCreator {...props}/>, document.getElementById("test-creator-wrapper"));
}
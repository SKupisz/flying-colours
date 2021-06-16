import React from "react";
import ReactDOM from "react-dom";
import { Grid, Button } from "@material-ui/core";

import ChangeNickname from "./optionsPanelComponents/changeNickname.js";

export default class OptionsPanel extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentStateOpened: 0,
            currentNickname: "",
            ifFail: false
        };

        this.setTheNewMode = this.setTheNewMode.bind(this);
        this.changeTheCurrentNickname = this.changeTheCurrentNickname.bind(this);
        this.changeTheNickname = this.changeTheNickname.bind(this);
    }
    setTheNewMode(mode){
        this.setState({
            currentStateOpened: this.state.currentStateOpened === mode ? -1 : mode,
            ifSuccess: false,
            ifFail: false
        }, () => {});
    }
    changeTheCurrentNickname(value){
        this.setState({
            currentNickname: value,
            ifFail: false,
            ifSuccess: false
        }, () => {});
    }
    async changeTheNickname(){
        if(this.state.currentNickname.length > 0){
            await fetch("/options/support/changeTheNickname",{
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    newNickname: this.state.currentNickname,
                    _token: this.props.token
                })
            }).then(back => back.json())
            .then(data => {
                console.log(data);
                if(data === "success"){
                    this.setState({
                        ifSuccess: true,
                        currentNickname: ""
                    }, () => {});
                }
                else{
                    this.setState({
                        ifFail: true,
                        currentNickname: ""
                    }, () => {});
                }
            });
        }
    }
    render(){
        return <Grid container className="options-panel-container block-center">
            <Grid item xs={6}>
                <Button variant="contained" className="options-choosing-btn block-center"
                onClick = {() => this.setTheNewMode(1)}>
                    Nickname
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button variant="contained" className="options-choosing-btn block-center"
                onClick = {() => this.setTheNewMode(2)}>
                    Password
                </Button>
            </Grid>
            {this.state.currentStateOpened === 1 ? <ChangeNickname currentInputValue={this.state.currentNickname}
            ifFailed = {this.state.ifFail} ifSuccesed = {this.state.ifSuccess}
            changeTextFunction={this.changeTheCurrentNickname}
            submitFunction={this.changeTheNickname}/> : ""}
        </Grid>;
    }
}

if(document.getElementById("options-container")){
    const props = Object.assign({},document.getElementById("options-container").dataset);
    ReactDOM.render(<OptionsPanel {...props}/>, document.getElementById("options-container"));
}
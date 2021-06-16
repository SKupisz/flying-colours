import React from "react";
import ReactDOM from "react-dom";
import { Grid, Button } from "@material-ui/core";

import ChangeNickname from "./optionsPanelComponents/changeNickname.js";
import ChangePassword from "./optionsPanelComponents/changePassword.js";

export default class OptionsPanel extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentStateOpened: 0,
            currentNickname: "",
            currentPasswd: "",
            currentPasswdRep: "",
            ifFail: false,
            ifSuccess: false
        };

        this.defaultTextReset = {
            ifFail: false,
            ifSuccess: false
        };

        this.setTheNewMode = this.setTheNewMode.bind(this);
        this.changeTheTextProperty = this.changeTheTextProperty.bind(this);
        this.changeTheNickname = this.changeTheNickname.bind(this);
        this.changeThePasswd = this.changeThePasswd.bind(this);
    }
    setTheNewMode(mode){
        let operand = this.defaultTextReset;
        operand["currentStateOpened"] = this.state.currentStateOpened === mode ? -1 : mode;
        this.setState(operand, () => {});
    }
    changeTheTextProperty(operandInd, value){
        let operand = this.defaultTextReset;
        operand[operandInd] = value;
        this.setState(operand, () => {});
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
    async changeThePasswd(){
        await fetch("/options/support/changeThePassword",{
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                newPasswd: this.state.currentPasswd,
                newPasswdRep: this.state.currentPasswdRep,
                _token: this.props.token
            })
        }).then(back => back.json())
        .then(data => {
            console.log(data);
            if(data === "success"){
                this.setState({
                    ifSuccess: true,
                    currentPasswd: "",
                    currentPasswdRep: ""
                }, () => {});
            }
            else{
                this.setState({
                    ifFail: true,
                    currentPasswd: "",
                    currentPasswdRep: ""
                }, () => {});
            }
        });
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
            {this.state.currentStateOpened === 1 ? <ChangeNickname currentInputValue = {this.state.currentNickname}
            ifFailed = {this.state.ifFail} ifSuccesed = {this.state.ifSuccess}
            changeTextFunction = {this.changeTheTextProperty}
            submitFunction = {this.changeTheNickname}/> : 
            this.state.currentStateOpened === 2 ? <ChangePassword currentInputValue = {this.state.currentPasswd}
            currentRepValue = {this.state.currentPasswdRep}
            ifFailed = {this.state.ifFail} ifSuccesed = {this.state.ifSuccess}
            changeTextFunction = {this.changeTheTextProperty}
            submitFunction = {this.changeThePasswd}/> : ""}
        </Grid>;
    }
}

if(document.getElementById("options-container")){
    const props = Object.assign({},document.getElementById("options-container").dataset);
    ReactDOM.render(<OptionsPanel {...props}/>, document.getElementById("options-container"));
}
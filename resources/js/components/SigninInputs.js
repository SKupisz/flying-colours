import React from "react";
import ReactDOM from "react-dom";
import { Grid,  Button } from "@material-ui/core";

import InputComponent from "./SignInComponents/InputComponent.js";

export default class SigninInputs extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            errorMessage: typeof this.props.error === "undefined" ? "" : this.props.error,
            statusOfTheSigningUp: typeof this.props.isregistering === "undefined" ? 0 : 1
        };
    }
    render(){
        return <Grid container className="sign-in-container block-center">
            {this.state.statusOfTheSigningUp === 1 ? 
            <InputComponent labelContent="Nickname" inputName="nick" inputType="text"/>: ""}

            <InputComponent labelContent="Email" inputName="email" inputType="email"/>
            <InputComponent labelContent="Password" inputName="passwd" inputType="password"/>

            {this.state.statusOfTheSigningUp === 1 ? 
            <InputComponent labelContent="Repeat password" inputName="passwd_rep" inputType="password"/> : ""}
            {this.state.errorMessage.length === 0 ? "" : <Grid item xs={12}>
                <div className="error-message block-center">{this.state.errorMessage}</div>
            </Grid>}
            <Grid item xs={12}>
                <Button type = "submit" className = "login-btn block-center">Sign in</Button>
            </Grid>
        </Grid>;
    }
}

if(document.getElementById("inputs-wrapper")){
    const props = Object.assign({},document.getElementById("inputs-wrapper").dataset);
    ReactDOM.render(<SigninInputs {...props}/>, document.getElementById("inputs-wrapper"));
}
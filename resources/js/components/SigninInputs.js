import React from "react";
import ReactDOM from "react-dom";
import { Grid, TextField,  Button } from "@material-ui/core";

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
            {this.state.statusOfTheSigningUp === 1 ?  <Grid item sm={12}>
                <TextField
                required label="Nickname" variant="filled" 
                className = "email-input block-center" margin="normal" name="nick" type = "text"/>
            </Grid>: ""}
            <Grid item sm={12}>
                <TextField
                required label="Email" variant="filled" 
                className = "email-input block-center" margin="normal" name="email" type = "email"/>
            </Grid>
            <Grid item sm={12}>
                <TextField
                required label="Password" variant="filled" 
                className = "email-input block-center" margin="normal" name="passwd" type = "password"/>
            </Grid>
            {this.state.statusOfTheSigningUp === 1 ? <Grid item sm={12}>
                <TextField
                required label="Repeat password" variant="filled" 
                className = "email-input block-center" margin="normal" name="passwd_rep" type = "password"/>
            </Grid>: ""}
            {this.state.errorMessage.length === 0 ? "" : <Grid item sm={12}>
                <div className="error-message block-center">{this.state.errorMessage}</div>
                </Grid>}
            <Grid item sm={12}>
                <Button type = "submit" className = "login-btn block-center">Sign in</Button>
            </Grid>
        </Grid>;
    }
}

if(document.getElementById("inputs-wrapper")){
    const props = Object.assign({},document.getElementById("inputs-wrapper").dataset);
    ReactDOM.render(<SigninInputs {...props}/>, document.getElementById("inputs-wrapper"));
}
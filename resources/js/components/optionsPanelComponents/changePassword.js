import React from "react";
import { Grid, TextField, Button } from "@material-ui/core";

const ChangePassword = ({currentInputValue, currentRepValue, ifFailed, ifSuccesed, changeTextFunction, submitFunction}) => {
    return <Grid item xs={12} className="change-section block-center">
        <header className="item-header block-center">Password</header>
        <Grid item xs={12}>
            <TextField
                required label="New password" variant="filled" value={currentInputValue}
                className = "email-input block-center" margin="normal" name="passwd" type = "password"
                onChange = {event => changeTextFunction("currentPasswd",event.target.value)}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
                required label="Repeat password" variant="filled" value={currentRepValue}
                className = "email-input block-center" margin="normal" name="passwdrep" type = "password"
                onChange = {event => changeTextFunction("currentPasswdRep",event.target.value)}/>
        </Grid>
        {ifFailed ? <Grid item xs={12}>
            <header className = "error-header block-center">Something went wrong. Try later</header>
        </Grid> : ifSuccesed ? <Grid item xs={12}>
            <header className = "error-header success-header block-center">Password successfuly changed</header>
        </Grid> : ""}
        {currentInputValue.length > 0 && currentRepValue.length > 0 && currentInputValue === currentRepValue ? <Grid item xs={12}>
            <Button variant="contained" className="options-choosing-btn block-center"
            onClick = {submitFunction}>
                Save
            </Button>
        </Grid> : ""}
    </Grid>;
};

export default ChangePassword;
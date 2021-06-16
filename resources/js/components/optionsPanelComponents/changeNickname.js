import React from "react";
import { Grid, TextField, Button } from "@material-ui/core";

const ChangeNickname = ({currentInputValue, ifFailed, ifSuccesed, changeTextFunction, submitFunction}) => {
    return <Grid item xs={12} className="change-section block-center">
        <header className="item-header block-center">Nickname</header>
        <Grid item xs={12}>
            <TextField
                required label="New nickname" variant="filled" value={currentInputValue}
                className = "email-input block-center" margin="normal" name="nickname" type = "text"
                onChange = {event => changeTextFunction(event.target.value)}/>
        </Grid>
        {ifFailed ? <Grid item xs={12}>
            <header className = "error-header block-center">Something went wrong. Try later</header>
        </Grid> : ifSuccesed ? <Grid item xs={12}>
            <header className = "error-header success-header block-center">Nickname successfuly changed</header>
        </Grid> : ""}
        {currentInputValue.length > 0 ? <Grid item xs={12}>
            <Button variant="contained" className="options-choosing-btn block-center"
            onClick = {submitFunction}>
                Save
            </Button>
        </Grid> : ""}
    </Grid>;
};

export default ChangeNickname;
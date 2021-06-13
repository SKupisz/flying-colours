import React from "react";
import { Grid, TextField } from "@material-ui/core";

const InputComponent = ({labelContent, inputName, inputType}) => {
    return <Grid item xs={12}>
        <TextField
        required label={labelContent} variant="filled" 
        className = "email-input block-center" margin="normal" name={inputName} type = {inputType}/>
    </Grid>
};

export default InputComponent;
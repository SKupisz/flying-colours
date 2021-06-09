import React from "react";
import {Grid, InputBase} from "@material-ui/core";
import StandardButton from "./StandardButton.js";

const QuestionAmount = ({numberCallback, creatingAllowed, startCallback}) => {
    return <Grid container className="creator-container block-center">
        <Grid item xs={12}>
            
            <InputBase type="number" placeholder="How many questions?" required 
            margin="dense" variant="filled" className="questions-input block-center" name = "questions-amount"
            min={1} onChange={(event) => {numberCallback(event);}}/>

        </Grid>
        {creatingAllowed === true ? <StandardButton content = "Create the questions"
        classes = "go-to-questions-btn block-center" callbackFunction={startCallback}/> : ""}
    </Grid>;
};

export default QuestionAmount;
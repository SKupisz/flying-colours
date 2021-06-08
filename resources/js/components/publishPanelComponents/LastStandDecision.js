import React from "react";
import {Grid, Button} from "@material-ui/core";

const LastStandDecision = ({prevQuestion, finalizeTheQuiz}) => {
    return <Grid container className="creator-panel block-center">
    <Grid item xs={12}>
        <header className="question-header block-center">End of Questions</header>
        <Grid item xs={12} className="ending-options-container">
            <Button variant="contained" 
            className="ending-phase-btn" type = "button"
            onClick = {() => {prevQuestion()}}>
                Previous question
            </Button>
            <Button variant="contained" 
            className="ending-phase-btn" type = "button"
            onClick = {() => {finalizeTheQuiz()}}>
                Finish creating
            </Button>
        </Grid>
    </Grid>
</Grid>
}

export default LastStandDecision;
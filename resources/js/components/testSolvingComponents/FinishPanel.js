import React from "react";
import {Grid, Button} from "@material-ui/core";

import StandardButton from "../publishPanelComponents/StandardButton.js";

const FinishPanel = ({result, restartTheQuiz}) => {
    return <Grid item xs={12}>
        <header className = "ending-header block-center">And that's all!</header>
        <Grid item xs={12}>
            <div className = "result block-center">Your result was: {result}%</div>
        </Grid>
        <Grid item xs = {12} className = "options-wrapper">
            <StandardButton content = "Solve again" classes = "end-option-btn" callbackFunction = {restartTheQuiz}/>
            <a href = "/tests">
                <Button color="inherit" className = "end-option-btn">
                    Take another test
                </Button>
            </a>
        </Grid>
    </Grid>;
}

export default FinishPanel;
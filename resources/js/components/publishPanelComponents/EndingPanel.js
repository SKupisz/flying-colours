import React from "react";
import {Grid, TextField} from "@material-ui/core";

import StandardButton from "./StandardButton.js";
import FinalMessage from "./FinalMessage.js";

const EndingPanel = ({isPublished, changeNameCallback, quizName, finishPublishingCallback, testID}) => {
    console.log(quizName);
    return <Grid container className = "ending-panel block-center">
        {isPublished === 0 ? <Grid item xs={12}>
            <header className="ending-header block-center">Final data</header>  
            <Grid item xs={12}>
                <TextField
                    required value = {quizName}
                    label="Test name" variant="filled" 
                    className = "question-name-input block-center" margin="normal" name="test-name"
                    onChange = {event => {changeNameCallback(event);}}/>  
            </Grid>
            {quizName.length > 0 ? <StandardButton content = "Publish the quiz"
                classes = "finish-btn" callbackFunction={finishPublishingCallback}/> : ""}
        </Grid>  : <FinalMessage resultState={isPublished} 
        textID={testID}/>}
    </Grid>;
};

export default EndingPanel;
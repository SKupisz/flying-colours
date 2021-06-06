import React from "react";
import {Grid, Button} from "@material-ui/core";

const QuestionTypes = ({refsTable, callBackFunction}) => {
    const optionsNames = ["Closed-single", "Closed-multi", "Open-text", "Open-number"];
    return <Grid item xs={12} className="type-container block-center">
        {refsTable.map((currentRef, index) => <Button type="button" variant="contained" className="question-type-btn" ref = {currentRef}
    onClick = {() => {callBackFunction(index)}}>{optionsNames[index]} answer</Button>)}
    </Grid>
}

export default QuestionTypes;
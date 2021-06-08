import React from "react";
import {Grid, Button} from "@material-ui/core";

const FinalMessage = ({resultState, textID}) => {
    if(resultState === 1) return <Grid item xs={12}>
        <header className = "published-header block-center">You've just published the test!</header>
        <a href = {"/solve/"+textID}>
            <Button variant="contained" className="finish-btn" type = "button">
                Solve the quiz
            </Button>
        </a>
    </Grid>;
    else return <Grid item xs={12}>
    <header className = "published-header block-center">Something went wrong. Try another time</header>
    <a href = "/">
            <Button variant="contained" className="finish-btn" type = "button">
                Go back
            </Button>
        </a>
    </Grid>;
};

export default FinalMessage;
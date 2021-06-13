import React from "react";
import {Grid, Button} from "@material-ui/core";

const FinalMessage = ({resultState, textID}) => {
    let headerContent = "Something went wrong. Try another time", 
    finalHref = "/", buttonContent = "Go back";
    if(resultState === 1){
        headerContent = "You've just published the test!";
        finalHref = "/solve/"+textID;
        buttonContent = "Solve the quiz";
    }
    return <Grid item xs={12}>
        <header className = "published-header block-center">{headerContent}</header>
        <a href = {finalHref}>
            <Button variant="contained" className="finish-btn" type = "button">
                {buttonContent}
            </Button>
        </a>
    </Grid>;
};

export default FinalMessage;
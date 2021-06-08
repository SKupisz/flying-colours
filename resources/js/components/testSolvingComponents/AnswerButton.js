import React from "react";
import {Button} from "@material-ui/core";

const AnswerButton = ({content, classes, callbackFunction}) => {
    return <Button variant="contained" 
        className={classes} type = "button"
        onClick = {() => {callbackFunction()}}>
            {content}
        </Button>;
};

export default AnswerButton;
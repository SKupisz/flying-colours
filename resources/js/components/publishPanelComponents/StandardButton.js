import React from "react";
import {Grid, Button} from "@material-ui/core";

const StandardButton = ({content, classes, callbackFunction}) => {
    return <Grid item xs = {12}>
        <Button variant="contained" 
        className={classes} type = "button"
        onClick = {() => {callbackFunction()}}>
            {content}
        </Button>
    </Grid>
};

export default StandardButton;
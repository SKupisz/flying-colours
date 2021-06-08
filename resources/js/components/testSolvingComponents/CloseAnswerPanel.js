import React from "react";
import {Grid} from "@material-ui/core";
import StandardButton from "../publishPanelComponents/StandardButton.js";

const CloseAnswerPanel = ({data, callBack, currentChosen}) => {
    return <Grid item xs={12}>
        <div className = "solving-answer-container block-center">
            {data.map((elem,index) => <StandardButton content = {elem} classes = {index === currentChosen ? "click-option chosen" : "click-option"} callbackFunction = {() => {callBack(index);}}/>)}
        </div>
    </Grid>;
};

export default CloseAnswerPanel;
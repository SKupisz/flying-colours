import React from "react";
import {Grid} from "@material-ui/core";
import StandardButton from "../publishPanelComponents/StandardButton.js";

const detectIfChosen = (ind, currentlyChosen, type) => {
    if(type === "csa"){
        if(ind === currentlyChosen) return true;
        else return false;
    }
    else if(type === "cma"){
        if(typeof currentlyChosen === "object"){
            if(currentlyChosen.indexOf(ind) === -1) return false;
            else return true;
        }
        else return false;
    }
    else return false;
};

const CloseAnswerPanel = ({data, callBack, currentChosen, type}) => {
    return <Grid item xs={12}>
        <div className = "solving-answer-container block-center">
            {data.map((elem,index) => {return <StandardButton content = {elem} key = {"answer"+index}
            classes = {detectIfChosen(index, currentChosen, type) === true ? "click-option chosen" : "click-option"} 
            callbackFunction = {() => {callBack(index, type);}}/>;})}
        </div>
    </Grid>;
};

export default CloseAnswerPanel;
import React from "react";
import {Grid} from "@material-ui/core";

import StandardButton from "../publishPanelComponents/StandardButton.js";

const IntroPanel = ({startGameCallback, author, publishDate, attemptsAmount, questionsAmount, lastResult}) => {
    let finalDate = publishDate.split(" ");
    finalDate[0] = finalDate[0].split("-").reverse().join("/");
    finalDate = finalDate.join(" ");
    return <Grid item xs={12}>
        <Grid item xs = {12}>
            <header className="info-header block-center">Published by {author} on {finalDate}</header>
        </Grid>
        <Grid item xs = {12}>
            <header className="attempts-header block-center">{attemptsAmount === 0 ? "No one has attempted this test yet" : "This test was attempted "+attemptsAmount+(attemptsAmount > 1 ? " times" : " time" )}</header>
        </Grid>
        <Grid item xs = {12}>
            <header className="attempts-header block-center">{lastResult === -1 ? "We don't have your recent result" : "Your recent result was "+lastResult+"%"}</header>
        </Grid>
        <Grid item xs = {12}>
            <header className="questions-header block-center">{questionsAmount+(questionsAmount > 1 ? " questions are" : "question is")} waiting for you</header>
        </Grid>
        <StandardButton content = "Start" classes = "start-btn block-center" callbackFunction = {startGameCallback}/> 
    </Grid>;
}

export default IntroPanel;
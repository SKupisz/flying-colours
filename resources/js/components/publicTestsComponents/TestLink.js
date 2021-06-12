import React from "react";
import { Wave } from "react-animated-text";
import { Button, Typography } from "@material-ui/core";

const TestLink = ({testID, name, createDate}) => {
    let finalName = name, finalDate = createDate.split(" ");
    finalDate = finalDate[0].split("-").reverse().join("/");
    if(name.length > 15) finalName = name.substring(0,12)+"...";
    finalName = finalName.split(" ");
    return <a href={"/solve/"+testID}>
            <Button className="test-button">
                <Typography className = "test-header block-center">
                    {finalName.map(text => <Wave key = {testID+text} text = {text+" "}
                    effect = "verticalFadeIn" iterations = {1}
                    paused = {false} effectDuration = {0.1} delay = {0.1}
                    effectChange = {0.1} effectDelay = {0.1} className = "test-name-word"/>)}
                </Typography>
                <Typography className = "date-header block-center">
                    Published on {finalDate}
                </Typography>
            </Button>
        </a>;
}

export default TestLink;

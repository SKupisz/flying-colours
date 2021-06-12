import React from "react";
import {Button, Typography} from "@material-ui/core";

const TestLink = ({testID, name, createDate}) => {
    let finalName = name, finalDate = createDate.split(" ");
    finalDate = finalDate[0].split("-").reverse().join("/");
    if(name.length > 15) finalName = name.substring(0,12)+"...";
    return <a href={"/solve/"+testID}>
            <Button className="test-button">
                <Typography className = "test-header block-center">
                    {finalName}
                </Typography>
                <Typography className = "date-header block-center">
                    Published on {finalDate}
                </Typography>
            </Button>
        </a>;
}

export default TestLink;

import React from "react";
import {Grid, Button} from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const QuestionTypes = ({optionsNames, callBackFunction, currentlySelectedType}) => {
    return <Grid item xs={12} className="type-container block-center">
        <FormControl>
            <Select
            labelId="demo-simple-select-helper-label"
            className = "type-selecting-input block-center"
            variant="filled" 
            value={currentlySelectedType}
            onChange={callBackFunction}
            >
                <MenuItem value={"None"} className = "type-selecting-option">Select question's type</MenuItem>
                {optionsNames.map((name, index) => <MenuItem value={name} className = "type-selecting-option">{name} answer</MenuItem>)}
            </Select>
        </FormControl>
    </Grid>
}

export default QuestionTypes;
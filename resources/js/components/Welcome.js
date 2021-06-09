import React from "react";
import ReactDOM from "react-dom";
import { Wave } from "react-animated-text";
import { Grid, Button } from "@material-ui/core";

export default class Welcome extends React.Component{
    constructor(props){
        super(props);

        this.data = require("./data/welcome.json");
        this.shortDesc = this.data.shortdesrcibe.split(" ");
    }
    render(){
        return <Grid container xs={12} className="signin-container welcome-container">
            <header className="main-header block-center">Welcome to Flying Colours</header>
            <div className = "short-describe block-center">
                {this.shortDesc.map(elem => <div className = "short-desc-word">
                    <Wave text = {elem+" "}
                    effect = "verticalFadeIn" iterations = {1}
                    paused = {false} effectDuration = {0.5} delay = {0.2}
                    effectChange = {0.5} effectDelay = {1} className = "short-describe-wrapper"/>
                </div>)}
            </div> 
            <Grid item xs={12} className = "buttons-section block-center">
                {this.data.links.map(elem => <a href = {elem["href"]}>
                    <Button variant="contained" 
                    className="section-btn" type = "button">
                        {elem["content"]}
                    </Button>
                </a>)}
            </Grid>
        </Grid>;
    }
}

if(document.getElementById("welcome-container")){
    const props = Object.assign({},document.getElementById("welcome-container").dataset);
    ReactDOM.render(<Welcome {...props}/>, document.getElementById("welcome-container"));
}
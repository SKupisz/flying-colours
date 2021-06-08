import React, {useState} from "react";
import ReactDOM from "react-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Button } from "@material-ui/core";

const ButtonComponent = ({href, hrefClassName, content}) => {
    return  <a href = {href} className = {"item-btn-wrapper "+hrefClassName}>
        <Button color="inherit" className = "item-btn">
            {content}
        </Button>
    </a>;
}

const MainNav = (data) => {

    const [isHidden, setHidden] = useState(true);

        return <AppBar position="static" className = "nav-wrapper">
            <Toolbar className = "main-nav">
                <IconButton edge="start" className="menu-btn" aria-label="menu" color="inherit" onClick = {() => {setHidden(!isHidden);}}>
                    <MenuIcon />
                </IconButton>
                <a href = "/">
                    <Typography className = "service-name" color="inherit">
                        Flying colours
                    </Typography>
                </a>
                <ButtonComponent href = "/tests" hrefClassName = "public-tests-btn non-rwd" content = "Public tests"/>
                <ButtonComponent href = "/about" hrefClassName = "about-btn non-rwd" content = "About the project"/>
                {data["issignedin"] === "false" ? <div className="right-aligned">
                    <ButtonComponent href = "/sign-in" hrefClassName = "login-btn" content = "Sign in"/>
                    <ButtonComponent href = "/sign-up" hrefClassName = "register-btn" content = "Sign up"/>
                </div> : <div className="right-aligned">
                    <ButtonComponent href = "/publish" hrefClassName = "publish-btn" content = "Publish a test"/>
                    <ButtonComponent href = "/logout" hrefClassName = "login-btn" content = "Logout"/>
                    </div>}
            </Toolbar>
            <ButtonComponent href = "/tests" hrefClassName = {isHidden === true ? "public-tests-btn rwd hidden" : "public-tests-btn rwd"} content = "Public tests"/>
            <ButtonComponent href = "/about" hrefClassName = {isHidden === true ? "about-btn rwd hidden" : "about-btn rwd"} content = "About the project"/>
            <ButtonComponent href = "/publish" hrefClassName = {isHidden === true ? "publish-btn rwd-2 hidden" : "publish-btn rwd-2"} content = "Publish a test"/>
            <ButtonComponent href = "/logout" hrefClassName = {isHidden === true ? "login-btn rwd-2 hidden" : "login-btn rwd-2"} content = "Logout"/>
        </AppBar>;

}

if(document.getElementById("main-nav-container")){
    const props = Object.assign({},document.getElementById("main-nav-container").dataset);
    ReactDOM.render(<MainNav {...props}/>,document.getElementById("main-nav-container"));
}
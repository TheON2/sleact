import React from 'react';
import LogIn from '@pages/LogIn';
import SignUp from '@pages/SignUp';
import {Redirect, Route, Switch} from "react-router";

const App = () => {
    return (
        <Switch>
            <Redirect exact path="/" to="/login"/>
            <Route path={"/login"} component={LogIn}/>
            <Route path={"/login"} component={LogIn}/>
        </Switch>
    );
};

export default App;
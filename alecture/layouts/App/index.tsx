import React from 'react';

import {Redirect, Route, Switch} from "react-router";
import loadable from '@loadable/component';
import Workspace from "@layouts/Workspace";

const LogIn = loadable(()=> import('@pages/LogIn'));
const SignUp = loadable(()=> import('@pages/SignUp'));
const Channel = loadable(()=> import('@pages/Channel'));

const App = () => {
    return (
        <Switch>
            <Redirect exact path="/" to="/login"/>
            <Route path={"/login"} component={LogIn}/>
            <Route path={"/signup"} component={SignUp}/>
            <Route path={"/workspace/channel"} component={Channel}/>
        </Switch>
    );
};

export default App;
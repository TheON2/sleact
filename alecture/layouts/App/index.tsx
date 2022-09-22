import React from 'react';

import {Redirect, Route, Switch} from "react-router";
import loadable from '@loadable/component';

const LogIn = loadable(()=> import('@pages/LogIn'));
const SignUp = loadable(()=> import('@pages/SignUp'));
const Channel = loadable(()=> import('@pages/Channel'));
const DirectMessage = loadable(()=> import('@pages/DirectMessage'));
const Workspace = loadable(()=> import('@layouts/Workspace'));

const App = () => {
    return (
        <Switch>
            <Redirect exact path="/" to="/login"/>
            <Route path={"/login"} component={LogIn}/>
            <Route path={"/signup"} component={SignUp}/>
            <Route path={"/workspace/:workspace"} component={Workspace}/>
        </Switch>
    );
};

export default App;
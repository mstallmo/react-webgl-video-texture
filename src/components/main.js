import React from 'react';
import {Route, Switch} from 'react-router-dom';
import HomePage from './home/homePage';
import WebGLCanvas from './canvas/webglCanvas';

const Main = () => (
    <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/canvas" component={WebGLCanvas}/>
    </Switch>
);
export default Main;
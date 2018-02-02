import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app';
import './styles/styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

render ((
    <BrowserRouter>
        <App/>
    </BrowserRouter>), document.getElementById('app')
);

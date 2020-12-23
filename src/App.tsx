import React from 'react';
// @ts-ignore
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "./components/layout/Navbar";
import Home from "./components/pages/Home";

function App() {
    return (
        <Router>
            <div>
                <Navbar/>

                <Switch>
                    <Route exact path="/" component={Home}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;

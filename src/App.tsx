import React from 'react';
// @ts-ignore
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "./components/layouts/Navbar";
import Home from "./components/pages/Home";
import Seats from "./components/pages/Seats";

function App() {
    return (
        <Router>
            <div>
                <Navbar/>

                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/seats/:tripId" component={Seats}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;

import React from "react";
// @ts-ignore
import { Link } from "react-router-dom";
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to='/'>
                    <b>Bus E-ticketing</b>
                </Link>
                <Link className="nav-link text-white" to="/">
                    Home
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;

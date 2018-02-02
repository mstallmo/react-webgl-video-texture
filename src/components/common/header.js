import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <nav>
            <NavLink to="/" activeClassName="active">Home</NavLink>
            {" | "}
            <NavLink to="/canvas" activeClassName="active">WebGL Canvas</NavLink>
        </nav>
    );
};

export default Header;

import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    const navLinkStyles = ({ isActive }) => {
        return {
            borderColor: isActive ? '#000066' : undefined,
            color: isActive ? '#000066' : '#666',
        }
    }

    return (
        <footer className="footer">
            <ul className="uk-tab-bottom uk-child-width-expand uk-tab">  
                <li><NavLink style={navLinkStyles} to="/"><span uk-icon="home"></span><br/>Home</NavLink></li>
                <li><NavLink style={navLinkStyles} to="/orders"><span uk-icon="list"></span><br/>My Trips</NavLink></li>
                <li><NavLink style={navLinkStyles} to="/advise"><span uk-icon="question"></span><br/>Advise</NavLink></li>
                <li><NavLink style={navLinkStyles} to="/address"><span uk-icon="location"></span><br/>Contact</NavLink></li>
            </ul>
        </footer>
    )
}

export default Navbar
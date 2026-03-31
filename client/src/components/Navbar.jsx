import NavbarItem from "./NavbarItem";
import "../styles/Navbar.css";
import { useLocation } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const loggedInNav = {
    "Stats": "/stats",
    "Job Applications": "/job-apps",
    "User": "/user"
};
const loggedOutNav = {
    "Login": "/login",
    "Register": "/register"
}


const Navbar = () => {
    const context = useContext(AuthContext);
    const location = useLocation();
    const checkLocation = (path) => {
        return path === location.pathname;
    }
    return (
        <div className='navbar'>
            <span className="nav-left">
                <NavbarItem title="Job Tracker" destination="/" />
            </span>
            { context?.isAuthenticated && context?.user ? 
                <span className="nav-right">
                    {Object.keys(loggedInNav).map(key => {
                        return <NavbarItem key={key} title={key} destination={loggedInNav[key]} isActive={checkLocation(loggedInNav[key])}/>
                    })}
                </span>
                :
                <span className="nav-right">
                    {Object.keys(loggedOutNav).map(key => {
                        return <NavbarItem key={key} title={key} destination={loggedOutNav[key]} isActive={checkLocation(loggedOutNav[key])}/>
                    })}
                </span>
                    
            }
        </div>
    )
};

export default Navbar;
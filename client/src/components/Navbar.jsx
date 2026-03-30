import NavbarItem from "./NavbarItem";
import "../styles/Navbar.css";

const navItems = {
    "Stats": "/stats",
    "Job Applications": "/job-apps",
    "User": "/user"
};

const Navbar = () => {
    return (
        <div className='navbar'>
            <span className="nav-left">
                <NavbarItem title="Job Tracker" destination="/" />
            </span>
            <span className="nav-right">
                {Object.keys(navItems).map(key => {
                    return <NavbarItem key={key} title={key} destination={navItems[key]} />
                })}
            </span>
        </div>
    )
};

export default Navbar;
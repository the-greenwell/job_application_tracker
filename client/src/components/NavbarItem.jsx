import { Link } from "react-router";
import "../styles/Navbar.css";

const NavbarItem = ({title, destination, isActive}) => {
    return (
        <Link className={`navbar-item${isActive ? " active" : ""}`} to={destination}>{title}</Link>
    )
};

export default NavbarItem;
import { Link } from "react-router";
import "../styles/Navbar.css";

const NavbarItem = ({title, destination}) => {
    return (
        <Link className="navbar-item" to={destination}>{title}</Link>
    )
};

export default NavbarItem;
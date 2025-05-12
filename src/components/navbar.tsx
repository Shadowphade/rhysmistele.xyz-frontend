import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Navbar() {

    const [_hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);

    }, [lastScrollY]);

    return (
        <nav className="main-nav">
            <div className="main-nav-container">
                <h1 className="main-nav-title">Rhys' Web Site</h1>
                <ul className="main-nav-link-list">
                    <li><button onClick={() => {navigate("/");}}> Home </button></li>
                    <li><button onClick={() => {navigate("/projects");}}> Projects </button></li>
                    <li><button onClick={() => {navigate("/articles");}}> Articles </button></li>
                </ul>
            </div>
        </nav>
    )
};

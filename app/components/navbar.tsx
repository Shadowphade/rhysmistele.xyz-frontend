import { useState, useEffect } from "react";


export default function Navbar() {

    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

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
        <nav className=
        {   `fixed
            w-2/3
            items-center
            bg-gray-900
            text-white
            p-4
            transition-transform
            duration-300
            ${ hidden ? "-translate-y-full" : "translate-y-0"}`
        }>
            <div className="container mx-auto flex justify-between">
                <h1 className="text-xl font-bold">Rhys' Web Site</h1>
                <ul className="flex space-x-4">
                    <li>About</li>
                    <li>Articles</li>
                </ul>
            </div>
        </nav>
    )
};

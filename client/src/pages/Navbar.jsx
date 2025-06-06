import React from 'react'
import Logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg" style={{backgroundColor: "#d9f1d2"}}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={Logo} alt="Company Logo" height={20} width={30} />
                    </Link>
                    <div className="flex space-x-4 sm:justify-center">
                        {[
                            ['Home', '/'],
                            ['Abouts', '/Abouts'],
                            ['Login', '/email'],
                            ['Register', '/register'],
                        ].map(([title, url], index) => (
                            <Link key={index} to={url} className="px-3 py-2 font-medium rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                                {title}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
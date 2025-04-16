import React from 'react'
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-stale" style={{backgroundColor :"#d9f1d2"}}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={Logo} alt="Company Logo" height={20} width={30} />
                    </Link>
                    <nav className="flex space-x-4 sm:justify-center">
                        {[
                            ['Home', '/'],
                            ['Abouts', '/Abouts'],
                            ['Login', '/email'],
                            ['Register', '/register'],
                        ].map(([title, url], index) => (
                            <a  key={index} href={url} className="px-3 py-2 font-medium rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">{title}</a>
                        ))}
                    </nav>
                </div>
            </nav>
        </div>
    )
}

export default Navbar

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
                    <nav className="flex sm:justify-center space-x-4">
                        {[
                            ['Home', '/'],
                            ['Abouts', '/Abouts'],
                            ['Login', '/email'],
                            ['Reports', '/reports'],
                        ].map(([title, url], index) => (
                            <a  key={index} href={url} className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">{title}</a>
                        ))}
                    </nav>
                </div>
            </nav>
        </div>
    )
}

export default Navbar

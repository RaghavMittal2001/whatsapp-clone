import React from 'react'
import logo from '../assets/logo.png'
import react from '../assets/react.svg'

function AuthLayout({children}) {
  return (
    <div className='' style={{}}>
    
    <header className='' >
      
      <img src={logo} alt={react} height={290}width={100} className=''/>
    </header>
    <main className="  ">
        {children}
      </main>

    </div>
  )
}

export default AuthLayout

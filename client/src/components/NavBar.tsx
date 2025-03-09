// import React from 'react'
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../redux/useHooks';

const NavBar = () => {

  const theme = useAppSelector((state) => state.theme.currentTheme);
  return (
    <div>
     <header className="flex justify-between items-center bg-gray-600 p-6 text-white fixed w-full">
      <nav className="uppercase pl-2">
      <Link to="/" className="link link-primary">
        chatify
      </Link>
        
      </nav>

      <section className="flex justify-end items-end uppercase">
        profile
      </section>

     </header>
    </div>
  )
}

export default NavBar
 
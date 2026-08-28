import React from 'react'
 import { Outlet } from 'react-router'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const Layout = () => {
  return (
    < > 
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout
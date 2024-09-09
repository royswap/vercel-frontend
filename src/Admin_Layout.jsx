import React from 'react'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'


function Admin_Layout() {
  return (
    <>
    <Sidebar/>
    <Outlet/>
    </>
  )
}

export default Admin_Layout
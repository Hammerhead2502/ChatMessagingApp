import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const ProtectedRoutes = () => {
    const [cookie] = useCookies(["userdata", "token"])
    if(!cookie.token){
       return <Navigate to="/login"/>
    }
  return (
    <Outlet />
  )
}

export default ProtectedRoutes
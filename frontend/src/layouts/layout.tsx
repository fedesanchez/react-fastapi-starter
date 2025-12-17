import { ThemeProvider } from "@/components/theme-provider"
import React from 'react'
import {Outlet} from 'react-router-dom'
// there is a mode-toggle component ready to place anywhere 

function Layout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />  
    </ThemeProvider>  
  )
}

export default Layout

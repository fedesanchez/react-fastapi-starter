import { ThemeProvider } from "@/components/theme-provider"
import React from 'react'
import {Outlet} from 'react-router-dom'
// there is a mode-toggle component ready to place anywhere 

function Layout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Outlet />  
      </div>
    </ThemeProvider>  
  )
}

export default Layout

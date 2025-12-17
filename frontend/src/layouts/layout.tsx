import { ThemeProvider } from "@/components/theme-provider"
import React from 'react'
import { useEffect } from 'react'
import useStore from '@/store/useStore'
import {Outlet} from 'react-router-dom'
// there is a mode-toggle component ready to place anywhere 

function Layout() {
  //const user = useStore((state) => state.user)
  const refreshToken = useStore((state) => state.refreshToken)
  const isAuthenticated = useStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      refreshToken()
    }
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />  
    </ThemeProvider>  
  )
}

export default Layout

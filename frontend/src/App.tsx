

import { Routes, Route } from 'react-router-dom'
import Layout from '@/layouts/layout'

import Index from '@/pages/index'
//import Login from '@/pages/auth/login'
//import Register from '@/pages/auth/register'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index path="" element={<Index />} />
      </Route>
      <Route path="/auth" element={<Layout />}>
        <Route index path="login" element={<Index />} />
        <Route path="register" element={<Index />} />
      </Route>
    </Routes>
  )
}

export default App

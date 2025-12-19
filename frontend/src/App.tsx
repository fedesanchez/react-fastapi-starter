

import { Routes, Route } from 'react-router-dom'
import Layout from '@/layouts/layout'

import IndexPage from '@/pages/index-page'
import LoginPage from '@/pages/auth/login-page'
import SignupPage from '@/pages/auth/signup-page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index path="" element={<IndexPage />} />
      </Route>
      <Route path="/auth" element={<Layout />}>
        <Route index path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Routes>
  )
}

export default App

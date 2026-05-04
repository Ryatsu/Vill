import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmationProvider } from './context/ConfirmationContext'
import ConfirmationModal from './components/ConfirmationModal'
import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import ItemRegister from './pages/ItemRegister'
import Inventory from './pages/Inventory'
import CashOut from './pages/CashOut'
import Login from './pages/Login'
import Signup from './pages/Signup'

function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <ConfirmationProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <ConfirmationModal />
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/inventory"
          element={
            <RequireAuth>
              <Layout>
                <Inventory />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/cash-out"
          element={
            <RequireAuth>
              <Layout>
                <CashOut />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/register"
          element={
            <RequireAuth>
              <Layout>
                <ItemRegister />
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </ConfirmationProvider>
  )
}

export default App
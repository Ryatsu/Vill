import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import ItemRegister from './pages/ItemRegister'
import Inventory from './pages/Inventory'
import CashOut from './pages/CashOut'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/cash-out" element={<CashOut />} />  
          <Route path="/register" element={<ItemRegister />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
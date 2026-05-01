import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg ${
      pathname === path
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`

  return (
    <aside className="w-64 bg-white shadow-md p-5">
      <h2 className="text-xl font-bold mb-6">📦 Inventory</h2>

      <nav className="space-y-2">
        <Link to="/" className={linkClass('/')}>Dashboard</Link>
        <Link to="/register" className={linkClass('/register')}>Register</Link>
        <Link to="/inventory" className={linkClass('/inventory')}>Inventory</Link>
      </nav>
    </aside>
  )
}
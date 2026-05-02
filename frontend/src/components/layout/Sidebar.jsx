import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ open, setOpen }) {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg ${
      pathname === path
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-full w-64 bg-white shadow-md p-5 z-50
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      {/* CLOSE BUTTON (mobile only) */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="text-xl font-bold">viTrack</h2>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>


      <h2 className="text-xl font-bold mb-6 hidden md:block">
        viTrack
      </h2>

      <nav className="space-y-2">
        <Link to="/" onClick={() => setOpen(false)} className={linkClass('/')}>
          Dashboard
        </Link>
        <Link to="/register" onClick={() => setOpen(false)} className={linkClass('/register')}>
          Register
        </Link>
        <Link to="/inventory" onClick={() => setOpen(false)} className={linkClass('/inventory')}>
          Inventory
        </Link>
        <Link to="/cash-out" onClick={() => setOpen(false)} className={linkClass('/cash-out')}>
          Cash Out
        </Link>
      </nav>
    </aside>
  )
}
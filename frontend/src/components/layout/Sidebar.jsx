import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ open, setOpen }) {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg border transition-all duration-100 ${
      pathname === path
        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white border-blue-500 shadow-md'
        : 'text-gray-700 border-transparent hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
    }`

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-full w-64 bg-green-100 shadow-md border-r border-blue-100 z-41
        transform transition-transform duration-300 flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      {/* CLOSE BUTTON (mobile only) */}
      <div className="flex justify-between items-center mb-6 md:hidden p-5">
        <h2 className="text-xl font-bold">viTrack</h2>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>

      <h2 className="hidden md:flex items-center gap-2 text-2xl font-bold px-5 my-6">
        <img src="/vitrack_logo.png" alt="viTrack Logo" className="h-8 w-8" />
        viTrack
      </h2>

      <nav className="space-y-2 flex-1 px-5">
        <Link to="/dashboard" onClick={() => setOpen(false)} className={linkClass('/dashboard')}>
          Dashboard
        </Link>
        {!localStorage.getItem('token') ? (
          <Link to="/" onClick={() => setOpen(false)} className={linkClass('/')}>
            Sign in
          </Link>
        ) : null}
        <Link to="/register" onClick={() => setOpen(false)} className={linkClass('/register')}>
          Manual Sale
        </Link>
        <Link to="/inventory" onClick={() => setOpen(false)} className={linkClass('/inventory')}>
          Inventory
        </Link>
        <Link to="/cash-out" onClick={() => setOpen(false)} className={linkClass('/cash-out')}>
          Cash Out
        </Link>
      </nav>

      {localStorage.getItem('token') ? (
        <div className="p-9 ">
          <button
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/' }}
            className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </aside>
  )
}
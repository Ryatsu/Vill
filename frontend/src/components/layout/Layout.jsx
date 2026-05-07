import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      {/* MOBILE Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      <main className="flex-1 flex flex-col bg-transparent">
        
        {/* MOBILE Mode */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-green-50 text-blue-700">
          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
          >
            ☰
          </button>

          <h1 className="font-bold">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
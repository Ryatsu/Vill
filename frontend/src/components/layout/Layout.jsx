import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">

      {/* MOBILE Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      <main className="flex-1 flex flex-col">
        
        {/* MOBILE Mode */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-green-500 text-gray-700">
          <button
            onClick={() => setOpen(true)}
            className="bg-green-800 text-white px-3 py-2 rounded"
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
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = (() => {
  const base = import.meta.env.VITE_API_URL || ''
  if (!base) return '/api'
  if (base.replace(/\/$/, '').endsWith('/api')) return base.replace(/\/$/, '')
  return base.replace(/\/$/, '') + '/api'
})()

export default function Signup() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      })
      if (!res.ok) throw new Error('Failed to register')
      const data = await res.json()
      localStorage.setItem('token', data.token)
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Create account</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full border p-2 rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" className="w-full border p-2 rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-green-600 text-white py-2 rounded">Create account</button>
        </form>
        <div className="mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

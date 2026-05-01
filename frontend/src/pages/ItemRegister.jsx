import { useState } from 'react'
import { useItems } from '../hooks/useItems'

export default function ItemRegister() {
  const { addItem } = useItems()
  const [form, setForm] = useState({ name: '', price: '', cost: '' })

  const handleSubmit = (e) => {
    e.preventDefault()

    addItem({
      name: form.name,
      price: Number(form.price),
      cost: Number(form.cost),
    })

    setForm({ name: '', price: '', cost: '' })
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Register Item</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">

        <input
          className="w-full border p-2 rounded"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 rounded"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 rounded"
          type="number"
          placeholder="Cost"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
          required
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Add Item
        </button>
      </form>
    </div>
  )
}
import { useState } from 'react'

export default function RegisterModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', price: '', cost: '' })

  const handleSubmit = (e) => {
    e.preventDefault()

    onSave({
      name: form.name,
      price: Number(form.price),
      cost: Number(form.cost),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center animate-fade-in z-50">
      <div className="bg-white p-6 rounded-xl w-96 animate-slide-up">

        <h2 className="text-lg font-bold mb-4">Register Item</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            className="w-full border p-2 rounded"
            placeholder="Item Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Price"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Cost"
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            required
          />

          <div className="flex gap-2">
            <button className="flex-1 bg-blue-500 text-white py-2 rounded">
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
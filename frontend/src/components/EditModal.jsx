import { useState } from 'react'

export default function EditModal({ item, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: item.name,
    price: item.price,
    cost: item.cost,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(item.id, form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center animate-fade-in z-50">
      <div className="bg-white p-6 rounded-xl w-96 animate-slide-up">

        <h2 className="text-lg font-bold mb-4">Edit Item</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />

          <div className="flex gap-2">
            <button className="flex-1 bg-blue-500 text-white py-2 rounded">
              Update
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
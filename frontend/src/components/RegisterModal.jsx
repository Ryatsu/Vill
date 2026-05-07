import { useState } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from '../context/ConfirmationContext'

export default function RegisterModal({ onClose, onSave, items = [] }) {
  const confirm = useConfirm()
  const [form, setForm] = useState({ name: '', price: '', cost: '' })

  const hasDuplicateName = items.some(item => 
    item.name.toLowerCase() === form.name.toLowerCase() && form.name.trim() !== ''
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (hasDuplicateName) {
      toast.error(`Item "${form.name}" already exists!`)
      return
    }

    const confirmed = await confirm({
      title: 'Register Item',
      message: `Add item "${form.name}" to inventory?`,
      confirmText: 'Register',
      cancelText: 'Cancel',
    })
    if (!confirmed) return

    onSave({
      name: form.name,
      price: Number(form.price),
      cost: Number(form.cost),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center animate-fade-in z-42">
      <div className="bg-white p-6 rounded-xl w-96 animate-slide-up">

        <h2 className="text-lg font-bold mb-4">Register Item</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <input
              className="w-full border p-2 rounded"
              placeholder="Item Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            {hasDuplicateName && (
              <p className="text-red-500 text-sm mt-1">Item name already exists</p>
            )}
          </div>

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Cost"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            required
          />

          <div className="flex gap-2">
            <button 
              className={`flex-1 py-2 rounded text-white font-medium transition-colors ${
                hasDuplicateName || !form.name.trim() || !form.price || !form.cost
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={hasDuplicateName || !form.name.trim() || !form.price || !form.cost}
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
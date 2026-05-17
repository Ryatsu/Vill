import { useState } from 'react'
import { useEffect } from 'react'

export default function EditModal({ item, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: item.name,
    price: item.price,
    cost: item.cost,
  })
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    setIsOpening(true)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(item.id, form)
    closeModal()
  }

  const closeModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <div>
      <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-all duration-300 ${isClosing ? 'opacity-0' : isOpening ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white p-6 rounded-xl w-96 transition-all duration-300 ${isClosing ? 'translate-y-[100%]' : isOpening ? 'translate-y-0' : 'translate-y-[100%]'}`}>

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
            <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
              Update
            </button>

            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from '../context/ConfirmationContext'
import LoadingOverlay from '../components/LoadingOverlay'
import { useItems } from '../hooks/useItems'

export default function ItemRegister() {
  const confirm = useConfirm()
  const { items, addItem } = useItems()
  const [form, setForm] = useState({ name: '', price: '', cost: '' })
  const [isProcessing, setIsProcessing] = useState(false)

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

    try {
      setIsProcessing(true)
      await addItem({
        name: form.name,
        price: Number(form.price),
        cost: Number(form.cost),
      })
      toast.success('Item registered successfully!')
      setForm({ name: '', price: '', cost: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to register item')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Register Item</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">

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

        <button 
          className={`w-full py-2 rounded font-medium transition-colors text-white ${
            hasDuplicateName || !form.name.trim() || !form.price || !form.cost
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={hasDuplicateName || !form.name.trim() || !form.price || !form.cost}
        >
          Add Item
        </button>
      </form>

      <LoadingOverlay isOpen={isProcessing} message="Registering item..." />
    </div>
  )
}
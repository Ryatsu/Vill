import { useState } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from '../context/ConfirmationContext'
import { useItems } from '../hooks/useItems'
import RegisterModal from '../components/RegisterModal'
import SkeletonLoader from '../components/SkeletonLoader'
import LoadingOverlay from '../components/LoadingOverlay'
import { createSale } from '../api/saleApi'

export default function Inventory() {
  const confirm = useConfirm()
  const { items, loading, removeItem, addItem, markBought } = useItems()
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [qty, setQty] = useState(1)
  const [showRegister, setShowRegister] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Processing...')

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSell = async () => {
    if (!selectedItem) return
    
    const confirmed = await confirm({
      title: 'Confirm Sale',
      message: `Sell ${qty} of "${selectedItem.name}"?`,
      confirmText: 'Sell',
      cancelText: 'Cancel',
    })
    if (!confirmed) return
    
    try {
      setIsProcessing(true)
      setProcessingMessage('Recording sale...')
      await createSale(selectedItem.id, qty)
      toast.success('Sale recorded successfully!')
      setSearch('')
      setSelectedItem(null)
      setQty(1)
    } catch (err) {
      toast.error(err.message || 'Failed to record sale')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (id, name) => {
    const confirmed = await confirm({
      title: 'Delete Item',
      message: `Are you sure you want to delete "${name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (!confirmed) return
    
    try {
      setIsProcessing(true)
      setProcessingMessage('Deleting item...')
      await removeItem(id)
      toast.success('Item deleted successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to delete item')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBuy = async (id, name) => {
    const confirmed = await confirm({
      title: 'Mark as Bought',
      message: `Mark "${name}" as bought?`,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
    })
    if (!confirmed) return
    
    try {
      setIsProcessing(true)
      setProcessingMessage('Updating item...')
      await markBought(id)
      toast.success('Item updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update item')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddItem = async (item) => {
    try {
      setIsProcessing(true)
      setProcessingMessage('Registering item...')
      await addItem(item)
      toast.success('Item registered successfully!')
      setShowRegister(false)
    } catch (err) {
      toast.error(err.message || 'Failed to register item')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Inventory</h1>
        <div className="bg-white p-6 rounded shadow mb-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4" />
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-100 rounded" />
          </div>
        </div>
        <SkeletonLoader count={3} variant="card" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-3">Sell Item</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Search item..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setSelectedItem(null)
          }}
        />

        <div className="max-h-40 overflow-y-auto border mb-3">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name} - ₱{item.price}
              </div>
            ))
          ) : (
            <div className="p-3 text-center">
              <p>No item found</p>
              <button
                onClick={() => setShowRegister(true)}
                className="text-blue-500 underline"
              >
                Register new item
              </button>
            </div>
          )}
          {/* <div className="grid gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-4 rounded shadow grid gap-2 grid-cols-1 md:grid-cols-3">

                <h3>{item.name}</h3>
                <p>Price: ₱{item.price}</p>
                <p>Cost: ₱{item.cost}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setSelected(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {selectedItem && (
          <div>
            <p>
              <strong>{selectedItem.name}</strong>
            </p>
            <p>Price: ₱{selectedItem.price}</p>

            <input
              type="number"
              value={qty}
              min="1"
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full border p-2 mt-2"
            />

            <p className="mt-2 font-bold">
              Total: ₱{(selectedItem.price * qty).toFixed(2)}
            </p>

            <button
              onClick={handleSell}
              className="w-full bg-green-500 text-white py-2 mt-3"
            >
              Confirm Sale
            </button>
          </div>
        )}

        {showRegister && (
          <RegisterModal
            onClose={() => setShowRegister(false)}
            onSave={handleAddItem}
            items={items}
          />
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
            <p className="text-sm">Price: ₱{item.price}</p>
            <p className="text-sm mb-3">Cost: ₱{item.cost}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleBuy(item.id, item.name)}
                className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Buy
              </button>
              <button
                onClick={() => handleDelete(item.id, item.name)}
                className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <LoadingOverlay isOpen={isProcessing} message={processingMessage} />
    </div>
  )
}
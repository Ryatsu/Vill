import { useState } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from '../context/ConfirmationContext'
import LoadingOverlay from '../components/LoadingOverlay'
import { useItems } from '../hooks/useItems'
import RegisterModal from '../components/RegisterModal'
import { createSale } from '../api/saleApi'

export default function ItemRegister() {
  const confirm = useConfirm()
  const { items, addItem } = useItems()
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Register / Sell Item</h1>

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

      <LoadingOverlay isOpen={isProcessing} message={processingMessage} />
    </div>
  )
}
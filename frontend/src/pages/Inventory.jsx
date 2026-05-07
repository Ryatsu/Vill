import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from '../context/ConfirmationContext'
import { useItems } from '../hooks/useItems'
import RegisterModal from '../components/RegisterModal'
import EditModal from '../components/EditModal'
import SkeletonLoader from '../components/SkeletonLoader'
import LoadingOverlay from '../components/LoadingOverlay'
import { createSale } from '../api/saleApi'

export default function Inventory() {
  const confirm = useConfirm()
  const { items, loading, removeItem, addItem, updateItem } = useItems()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState(search)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [qty, setQty] = useState('1')
  const [cart, setCart] = useState([])
  const [showRegister, setShowRegister] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Processing...')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))
  const pagedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    const newTotal = Math.max(1, Math.ceil(items.length / itemsPerPage))
    if (currentPage > newTotal) setCurrentPage(newTotal)
  }, [items.length])

  // Debounce search input to avoid filtering on every keystroke
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(id)
  }, [searchInput])

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const addToCart = () => {
    if (!selectedItem) return

    const quantity = Number(qty || 0)
    if (!quantity || quantity < 1) return

    setCart(prev => {
      const existing = prev.find(item => item.id === selectedItem.id)
      if (existing) {
        return prev.map(item =>
          item.id === selectedItem.id
            ? { ...item, qty: item.qty + quantity }
            : item
        )
      }

      return [
        ...prev,
        {
          id: selectedItem.id,
          name: selectedItem.name,
          price: selectedItem.price,
          qty: quantity,
        },
      ]
    })

    setSelectedItem(null)
    setQty('1')
    setSearch('')
    setSearchInput('')
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const handleSell = async () => {
    if (cart.length === 0) return
    
    const confirmed = await confirm({
      title: 'Confirm Sale',
      message: `Sell ${cart.length} item${cart.length > 1 ? 's' : ''} for a total of ₱${cartTotal.toFixed(2)}?`,
      confirmText: 'Sell',
      cancelText: 'Cancel',
    })
    if (!confirmed) return
    
    try {
      setIsProcessing(true)
      setProcessingMessage('Recording sale...')
      for (const item of cart) {
        await createSale(item.id, item.qty)
      }
      toast.success('Sale recorded successfully!')
      setSearch('')
      setSearchInput('')
      setSelectedItem(null)
      setQty('1')
      setCart([])
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
      // Clear selectedItem if it's the one being deleted, but keep qty
      if (selectedItem?.id === id) {
        setSelectedItem(null)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete item')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateItem = async (id, form) => {
    try {
      setIsProcessing(true)
      setProcessingMessage('Updating item...')
      await updateItem(id, form)
      toast.success('Item updated successfully!')
      setEditingItem(null)
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
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value)
            setSelectedItem(null)
          }}
        />

        {/* debounce searchInput -> search (1s) */}
        {
          /* place effect near input to debounce updates */
        }

        <div className="max-h-60 overflow-y-auto border border-blue-200 rounded-lg bg-gradient-to-b from-blue-50 to-white mb-3 shadow-sm">
          {filtered.length > 0 ? (
            <div className="divide-y divide-blue-100">
              {filtered.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`
                    px-4 py-3 cursor-pointer transition-all duration-200 ease-out
                    ${selectedItem?.id === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                      : 'hover:bg-blue-100 text-gray-800'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className={`text-xl font-semibold ${selectedItem?.id === item.id ? 'text-white' : 'text-green-600'}`}>
                      ₱{item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-3">No item found</p>
              <button
                onClick={() => setShowRegister(true)}
                className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                + Register new item
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
              onChange={(e) => {
                const value = e.target.value
                setQty(value)
              }}
              className="w-full border p-2 mt-2"
            />

            <p className="mt-2 font-bold">
              Total: ₱{(selectedItem.price * qty).toFixed(2)}
            </p>

            <button
              onClick={addToCart}
              className="w-full bg-green-500 text-white py-2 mt-3"
            >
              Add to Cart
            </button>
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-4 border rounded p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">Current Cart</h3>
              <p className="font-semibold">₱{cartTotal.toFixed(2)}</p>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 bg-white border rounded p-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">₱{item.price} x {item.qty} = ₱{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSell}
              className="w-full bg-green-500 text-white py-2 mt-3 rounded"
            >
              Confirm Cart Sale
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
        {pagedItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
            <p className="text-lg mb-3 ">Price: ₱{item.price}</p>
            {/* <p className="text-sm mb-3">Cost: ₱{item.cost}</p> */}
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(item)}
                className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Edit
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: Math.min(10, totalPages - Math.floor((currentPage - 1) / 10) * 10) }, (_, i) => {
              const page = Math.floor((currentPage - 1) / 10) * 10 + i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
        </div>
      )}

      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleUpdateItem}
        />
      )}
      
      <LoadingOverlay isOpen={isProcessing} message={processingMessage} />
    </div>
  )
}
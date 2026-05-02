import { useState } from 'react'
import { useItems } from '../hooks/useItems'
import EditModal from '../components/EditModal'
import RegisterModal from '../components/RegisterModal'
import { createSale } from '../api/saleApi'

export default function Inventory() {
  const { items, loading, removeItem, updateItem, addItem } = useItems()
  // const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [qty, setQty] = useState(1)
  const [showRegister, setShowRegister] = useState(false)

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSell = async () => {
    if (!selectedItem) return

    await createSale(selectedItem.id, qty)
    setSearch('')
    setSelectedItem(null)
    setQty(1)
  }

  if (loading) return <p>Loading...</p>

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
            onSave={(item) => {
              addItem(item)
              setShowRegister(false)
            }}
          />
        )}
      </div>

      {/* {selected && (
        <EditModal
          item={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateItem}
        />
      )} */}
    </div>
  )
}
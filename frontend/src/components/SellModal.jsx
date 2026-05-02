import { useState } from 'react'
import { createSale } from '../api/saleApi'

export default function SellModal({ items, onClose }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState(1)

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSell = async () => {
    await createSale(selected.id, qty)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">

        <h2 className="text-lg font-bold mb-3">Sell Item</h2>

        <input
          placeholder="Search item..."
          className="w-full border p-2 mb-3"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-40 overflow-y-auto mb-3">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.name} - ₱{item.price}
            </div>
          ))}
        </div>

        {selected && (
          <>
            <p>Selected: {selected.name}</p>

            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full border p-2 mt-2"
            />

            <button
              onClick={handleSell}
              className="mt-3 w-full bg-blue-500 text-white py-2 rounded"
            >
              Confirm Sale
            </button>
          </>
        )}

        <button onClick={onClose} className="mt-3 text-sm text-gray-500">
          Close
        </button>
      </div>
    </div>
  )
}
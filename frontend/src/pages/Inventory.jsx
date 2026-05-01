import { useItems } from '../hooks/useItems'

export default function Inventory() {
  const { items, loading, markBought, removeItem } = useItems()

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => {
          const bought = !!item.dateBought
          const profit = item.price - item.cost

          return (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-lg font-semibold">{item.name}</h3>

              <p className="text-gray-600">Price: ${item.price}</p>
              <p className="text-gray-600">Cost: ${item.cost}</p>

              <p className="text-green-600 font-medium">
                Profit: ${profit.toFixed(2)}
              </p>

              <p className="mt-2">
                Status:
                <span className={bought ? 'text-green-500' : 'text-yellow-500'}>
                  {bought ? ' Bought' : ' Available'}
                </span>
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => markBought(item.id)}
                  disabled={bought}
                  className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                >
                  Buy
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
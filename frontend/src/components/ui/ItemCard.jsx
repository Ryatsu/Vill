export default function ItemCard({ item, onBuy, onDelete }) {
  const profit = item.price - item.cost
  const bought = !!item.dateBought

  return (
    <div className="card">
      <h3>{item.name}</h3>
      <p>Price: ${item.price}</p>
      <p>Cost: ${item.cost}</p>
      <p>Profit: ${profit.toFixed(2)}</p>

      <p>Status: {bought ? 'Bought' : 'Available'}</p>

      <button onClick={() => onBuy(item.id)} disabled={bought}>
        Buy
      </button>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  )
}
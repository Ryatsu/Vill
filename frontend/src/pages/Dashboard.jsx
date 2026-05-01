import { useItems } from '../hooks/useItems'

export default function Dashboard() {
  const { items } = useItems()

  const bought = items.filter(i => i.dateBought).length
  const total = items.length
  const value = items.reduce((sum, i) => sum + Number(i.price || 0), 0)

  const Card = ({ title, value }) => (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Items" value={total} />
        <Card title="Bought" value={bought} />
        <Card title="Available" value={total - bought} />
        <Card title="Total Value" value={`$${value.toFixed(2)}`} />
      </div>
    </div>
  )
}
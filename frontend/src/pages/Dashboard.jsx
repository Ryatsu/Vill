import { useEffect, useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import { useItems } from '../hooks/useItems'
import { getSales } from '../api/saleApi'

export default function Dashboard() {
  const { items } = useItems()
  const [sales, setSales] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDay, setSelectedDay] = useState(null)

  const bought = items.filter(i => i.dateBought).length
  const total = items.length
  const value = items.reduce((sum, i) => sum + Number(i.price || 0), 0)

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await getSales()
        setSales(data)
      } catch (error) {
        console.error(error)
      }
    }

    loadSales()
  }, [])

  const dailySales = useMemo(() => {
    const toDateKey = (value) => {
      const date = new Date(value)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }

    const grouped = sales.reduce((acc, sale) => {
      const saleDate = new Date(sale.date)
      const dayKey = toDateKey(saleDate)

      if (!acc[dayKey]) {
        acc[dayKey] = {
          date: saleDate,
          key: dayKey,
          count: 0,
          total: 0,
          quantity: 0,
          sales: [],
        }
      }

      acc[dayKey].count += 1
      acc[dayKey].quantity += Number(sale.quantity || 0)
      acc[dayKey].total += Number(sale.total || 0)
      acc[dayKey].sales.push(sale)

      return acc
    }, {})

    return Object.values(grouped).sort((a, b) => b.date - a.date)
  }, [sales])

  const todayKey = useMemo(() => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }, [])

  // --- Chart data helpers ---
  const last7Days = useMemo(() => {
    const now = new Date()
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days.push({ key, date: d, total: 0 })
    }

    sales.forEach((s) => {
      const d = new Date(s.recordedAt ?? s.date)
      const key = d.toISOString().slice(0, 10)
      const day = days.find((x) => x.key === key)
      if (day) day.total += Number(s.total || 0)
    })

    return days
  }, [sales])

  const top3ThisMonth = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const map = {}
    sales.forEach((s) => {
      const d = new Date(s.recordedAt ?? s.date)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = s.itemName || s.description || 'Unknown'
        map[key] = (map[key] || 0) + Number(s.quantity || 0)
      }
    })

    return Object.entries(map)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 3)
  }, [sales])

  const monthCostRevenue = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    let revenue = 0
    let cost = 0

    sales.forEach((s) => {
      const d = new Date(s.recordedAt ?? s.date)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const qty = Number(s.quantity || 0)
        revenue += Number(s.total || 0)
        const item = items.find(i => i.id === s.itemId || i.name === s.itemName)
        const unitCost = item ? Number(item.cost || 0) : 0
        cost += unitCost * qty
      }
    })

    return { revenue, cost }
  }, [sales, items])

  const todaySales = dailySales.find((entry) => entry.key === todayKey)
  const visibleSales = selectedDate
    ? dailySales.filter((entry) => entry.key === selectedDate)
    : dailySales.slice(0, 5)

  const formatSaleTime = (value) => {
    if (!value) return 'No time'

    return new Date(value).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const downloadSelectedDayPdf = () => {
    if (!selectedDay) return

    const doc = new jsPDF()
    const margin = 14
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2
    const columns = [
      { label: 'Item', width: 72 },
      { label: 'Qty', width: 16 },
      { label: 'Price', width: 28 },
      { label: 'Total', width: 30 },
      { label: 'Time', width: pageWidth - (72 + 16 + 28 + 30) },
    ]
    const rowHeight = 10
    const headerHeight = 10
    const startY = 44
    let y = startY

    const drawTableHeader = () => {
      let x = margin

      doc.setFillColor(33, 37, 41)
      doc.rect(margin, y - headerHeight + 2, pageWidth, headerHeight, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)

      columns.forEach((column) => {
        doc.text(column.label, x + 2, y)
        x += column.width
      })
    }

    const ensureSpace = (neededHeight) => {
      if (y + neededHeight > 280) {
        doc.addPage()
        y = 18
        drawTableHeader()
        y += 10
      }
    }

    doc.setFontSize(16)
    doc.text('Sales Records', margin, y)

    y += 8
    doc.setFontSize(11)
    doc.text(
      `Date: ${selectedDay.date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}`,
      margin,
      y
    )

    y += 7
    doc.text(`Orders: ${selectedDay.count}`, margin, y)
    y += 7
    doc.text(`Items sold: ${selectedDay.quantity}`, margin, y)
    y += 7
    doc.text(`Daily total: Php ${selectedDay.total.toFixed(2)}`, margin, y)

    y += 10
    drawTableHeader()
    y += 10

    selectedDay.sales.forEach((sale, index) => {
      ensureSpace(rowHeight)

      const rowTop = y - 7
      const rowFill = index % 2 === 0 ? [248, 249, 250] : [236, 240, 244]
      doc.setFillColor(...rowFill)
      doc.rect(margin, rowTop, pageWidth, rowHeight, 'F')
      doc.setDrawColor(221, 226, 231)
      doc.rect(margin, rowTop, pageWidth, rowHeight)
      doc.setTextColor(33, 37, 41)
      doc.setFontSize(12)

      const cells = [
        sale.itemName ?? sale.description ?? 'Item',
        String(sale.quantity ?? 0),
        `Php ${Number(sale.price || 0).toFixed(2)}`,
        `Php ${Number(sale.total || 0).toFixed(2)}`,
        formatSaleTime(sale.recordedAt ?? sale.date),
      ]

      let x = margin
      cells.forEach((cell, cellIndex) => {
        const text = cellIndex === 0 ? doc.splitTextToSize(cell, columns[cellIndex].width - 4) : String(cell)
        doc.text(text, x + 2, y)
        x += columns[cellIndex].width
      })

      y += rowHeight
    })

    doc.save(`sales-${selectedDay.key}.pdf`)
  }

  const LineChart = ({ data, width = 400, height = 120 }) => {
    const max = Math.max(...data.map(d => d.total), 1)
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - (d.total / max) * (height - 10)
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="rounded">
        <polyline fill="none" stroke="#2563eb" strokeWidth="3" points={points} />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width
          const y = height - (d.total / max) * (height - 10)
          return <circle key={d.key} cx={x} cy={y} r="3" fill="#10b981" />
        })}
      </svg>
    )
  }

  const BarList = ({ items }) => (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.name} className="space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">{it.name}</span>
            <span className="text-sm text-gray-600">{it.qty}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded overflow-hidden">
            <div style={{ width: `${Math.min(100, (it.qty / (items[0]?.qty || 1)) * 100)}%` }} className="h-full bg-blue-500" />
          </div>
        </div>
      ))}
    </div>
  )

  const PieChart = ({ cost, revenue, size = 140 }) => {
    const total = cost + revenue || 1
    const costPct = (cost / total) * 100
    const costAngle = (costPct / 100) * 2 * Math.PI
    const largeArc = costPct > 50 ? 1 : 0
    const r = size / 2
    const cx = r
    const cy = r
    const x = cx + r * Math.cos(0 - Math.PI / 2)
    const y = cy + r * Math.sin(0 - Math.PI / 2)
    const x2 = cx + r * Math.cos(costAngle - Math.PI / 2)
    const y2 = cy + r * Math.sin(costAngle - Math.PI / 2)

    const path = `M ${cx} ${cy} L ${x} ${y} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#10b981" opacity="0.12" />
        <path d={path} fill="#ef4444" />
        <circle cx={cx} cy={cy} r={r * 0.55} fill="#fff" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="font-bold">{`₱${revenue.toFixed(0)}`}</text>
      </svg>
    )
  }

  const Card = ({ title, value }) => (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Weekly Sales</p>
          <div className="mt-3">
            <LineChart data={last7Days} />
            <div className="mt-2 text-xs text-gray-500 flex justify-between">
              {last7Days.map(d => (
                <div key={d.key} className="text-center w-1/7">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Top 3 Items (this month)</p>
          <div className="mt-3">
            {top3ThisMonth.length ? <BarList items={top3ThisMonth} /> : <p className="text-sm text-gray-500">No sales this month.</p>}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <p className="text-sm text-gray-500">This Month: Cost vs Revenue</p>
          <div className="mt-4 flex items-center gap-4">
            <PieChart cost={monthCostRevenue.cost} revenue={monthCostRevenue.revenue} />
            <div className="text-sm">
              <p className="text-gray-600">Revenue: <span className="font-semibold">₱{monthCostRevenue.revenue.toFixed(2)}</span></p>
              <p className="text-gray-600">Cost: <span className="font-semibold">₱{monthCostRevenue.cost.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Sales Records</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card
            title="Today Sales"
            value={todaySales ? `₱${todaySales.total.toFixed(2)}` : '₱0.00'}
          />
          <Card
            title="Today Orders"
            value={todaySales ? todaySales.count : 0}
          />
          <Card
            title="Today Qty"
            value={todaySales ? todaySales.quantity : 0}
          />
        </div>

        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="text-sm font-medium text-gray-600">
            View sales by date
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full md:w-56 rounded border p-2"
            />
          </label>

          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate('')}
              className="self-start rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="space-y-3">
          {visibleSales.length > 0 ? (
            visibleSales.map((day) => (
              <div
                key={day.key}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <p className="font-semibold">
                    {day.date.toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {day.count} sale{day.count === 1 ? '' : 's'} · {day.quantity} item{day.quantity === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-lg font-bold">₱{day.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Daily total</p>
                </div>

                <div className="flex items-center justify-start md:justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    View Items
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              {selectedDate ? 'No sales recorded for this date.' : 'No sales recorded yet.'}
            </p>
          )}
        </div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Sold Items</h2>
                <p className="text-sm text-gray-500">
                  {selectedDay.date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

            <div className=" flex justify-end ml-auto gap-2">
              <button
                type="button"
                onClick={downloadSelectedDayPdf}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Download PDF
              </button>
            </div>

              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Card title="Orders" value={selectedDay.count} />
              <Card title="Items Sold" value={selectedDay.quantity} />
              <Card title="Total" value={`₱${selectedDay.total.toFixed(2)}`} />
            </div>

            <div className="space-y-3">
              {selectedDay.sales.map((sale, index) => (
                <div key={`${selectedDay.key}-${sale.id ?? index}`} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">
                        {sale.itemName ?? sale.description ?? 'Item'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {sale.quantity} | Time: {formatSaleTime(sale.recordedAt ?? sale.date)}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="font-bold">₱{Number(sale.total || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        Price: ₱{Number(sale.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
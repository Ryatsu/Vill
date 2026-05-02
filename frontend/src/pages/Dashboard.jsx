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
        <Card title="Total Value" value={`₱${value.toFixed(2)}`} />
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
import { useState } from 'react'
import { useCash } from '../hooks/useCash'

export default function CashOut() {
  const { records, loading, error, add, pay, unpay, remove } = useCash()
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState(null)

  const [form, setForm] = useState({
    type: 'UNPAID_ITEM',
    description: '',
    amount: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    add({
      ...form,
      amount: Number(form.amount),
    })

    setForm({ type: 'UNPAID_ITEM', description: '', amount: '' })
  }

  const formatRecordedAt = (value) => {
    if (!value) return 'No date'

    const date = new Date(value)
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const filteredRecords = records.filter((record) => {
    const query = search.trim().toLowerCase()
    if (!query) return true

    return (
      record.description?.toLowerCase().includes(query) ||
      record.type?.toLowerCase().includes(query) ||
      String(record.amount ?? '').includes(query) ||
      formatRecordedAt(record.recordedAt ?? record.date).toLowerCase().includes(query) ||
      (record.paid ? 'paid' : 'unpaid').includes(query)
    )
  })

  const openConfirm = (record, action) => {
    setConfirm({
      record,
      action,
    })
  }

  const closeConfirm = () => setConfirm(null)

  const runConfirmedAction = async () => {
    if (!confirm) return

    const { record, action } = confirm

    if (action === 'pay') {
      await pay(record.id)
    }

    if (action === 'unpay') {
      await unpay(record.id)
    }

    closeConfirm()
  }

  if (loading) {
    return <p className="text-gray-500">Loading cash records...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cash Records</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border p-2"
        >
          <option value="UNPAID_ITEM">Unpaid Item</option>
          <option value="BORROWED">Borrowed Money</option>
          <option value="LOAN">Loan Given</option>
        </select>

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2"
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full border p-2"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Record
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search details: description, type, amount, date, status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded shadow-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {filteredRecords.slice(0, 7).map(r => (
          <div key={r.id} className="bg-white p-4 rounded shadow flex justify-between">

            <div>
              <p className="font-bold">{r.description}</p>
              <p className="text-sm text-gray-500">{r.type}</p>
              <p>₱{r.amount}</p>
              <p className="text-sm text-gray-500">Recorded at: {formatRecordedAt(r.recordedAt ?? r.date)}</p>
              <p className={r.paid ? 'text-green-500' : 'text-red-500'}>
                {r.paid ? 'Paid' : 'Unpaid'}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {!r.paid && (
                <button
                  type="button"
                  onClick={() => openConfirm(r, 'pay')}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Mark Paid
                </button>
              )}
              {r.paid && (
                <button
                  type="button"
                  onClick={() => openConfirm(r, 'unpay')}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Revert to Unpaid
                </button>
              )}

              {/* <button
                type="button"
                onClick={() => remove(r.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button> */}
            </div>

          </div>
        ))}
        {filteredRecords.length === 0 && (
          <p className="text-gray-500">No records match your search.</p>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-2">
              Confirm {confirm.action === 'pay' ? 'Mark Paid' : 'Revert to Unpaid'}
            </h2>

            <p className="text-gray-600 mb-4">
              Are you sure you want to {confirm.action === 'pay' ? 'mark this record as paid' : 'revert this record to unpaid'}?
            </p>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={closeConfirm}
                className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runConfirmedAction}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
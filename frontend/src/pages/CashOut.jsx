import { useState } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from '../context/ConfirmationContext'
import SkeletonLoader from '../components/SkeletonLoader'
import LoadingOverlay from '../components/LoadingOverlay'
import { useCash } from '../hooks/useCash'

export default function CashOut() {
  const confirm = useConfirm()
  const { records, loading, error, add, pay, unpay, remove } = useCash()
  const [search, setSearch] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Processing...')

  const [form, setForm] = useState({
    type: 'UNPAID_ITEM',
    description: '',
    amount: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setIsProcessing(true)
      setProcessingMessage('Adding record...')
      await add({
        ...form,
        amount: Number(form.amount),
      })
      toast.success('Record added successfully!')
      setForm({ type: 'UNPAID_ITEM', description: '', amount: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to add record')
    } finally {
      setIsProcessing(false)
    }
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

  const handleMarkPaid = async (record) => {
    const confirmed = await confirm({
      title: 'Mark as Paid',
      message: `Mark this record (₱${record.amount}) as paid?`,
      confirmText: 'Mark Paid',
      cancelText: 'Cancel',
    })
    if (!confirmed) return

    try {
      setIsProcessing(true)
      setProcessingMessage('Updating record...')
      await pay(record.id)
      toast.success('Marked as paid!')
    } catch (err) {
      toast.error(err.message || 'Failed to update record')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMarkUnpaid = async (record) => {
    const confirmed = await confirm({
      title: 'Revert to Unpaid',
      message: `Revert this record (₱${record.amount}) to unpaid?`,
      confirmText: 'Revert',
      cancelText: 'Cancel',
    })
    if (!confirmed) return

    try {
      setIsProcessing(true)
      setProcessingMessage('Updating record...')
      await unpay(record.id)
      toast.success('Reverted to unpaid!')
    } catch (err) {
      toast.error(err.message || 'Failed to update record')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cash Records</h1>
        <div className="bg-white p-4 rounded shadow mb-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4" />
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
        <SkeletonLoader count={5} variant="list" />
      </div>
    )
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
                  onClick={() => handleMarkPaid(r)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Mark Paid
                </button>
              )}
              {r.paid && (
                <button
                  type="button"
                  onClick={() => handleMarkUnpaid(r)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Revert to Unpaid
                </button>
              )}
            </div>

          </div>
        ))}
        {filteredRecords.length === 0 && (
          <p className="text-gray-500">No records match your search.</p>
        )}
      </div>

      <LoadingOverlay isOpen={isProcessing} message={processingMessage} />
    </div>
  )
}
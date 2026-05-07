import { useState } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from '../context/ConfirmationContext'
import SkeletonLoader from '../components/SkeletonLoader'
import LoadingOverlay from '../components/LoadingOverlay'
import PartialPaymentModal from '../components/PartialPaymentModal'
import { useCash } from '../hooks/useCash'

export default function CashOut() {
  const confirm = useConfirm()
  const { records, loading, error, add, pay, payPartial, unpay, remove } = useCash()
  const [search, setSearch] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Processing...')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentRecord, setPaymentRecord] = useState(null)

  const [form, setForm] = useState({
    type: 'UNPAID_ITEM',
    personName: '',
    description: '',
    amount: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedName = String(form.personName || '').trim()
    const trimmedDesc = String(form.description || '').trim()
    const trimmedAmount = String(form.amount || '').trim()

    if (!trimmedName || !trimmedDesc || !trimmedAmount) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setIsProcessing(true)
      setProcessingMessage('Adding record...')
      await add({
        ...form,
        personName: trimmedName,
        description: trimmedDesc,
        amount: Number(trimmedAmount),
      })
      toast.success('Record added successfully!')
      setForm({ type: 'UNPAID_ITEM', personName: '', description: '', amount: '' })
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
      record.personName?.toLowerCase().includes(query) ||
      record.description?.toLowerCase().includes(query) ||
      record.type?.toLowerCase().includes(query) ||
      String(record.amount ?? '').includes(query) ||
      formatRecordedAt(record.recordedAt ?? record.date).toLowerCase().includes(query) ||
      (record.paid ? 'paid' : 'unpaid').includes(query)
    )
  })

  const personTotals = filteredRecords.reduce((acc, record) => {
    const key = record.personName?.trim() || 'Unknown'
    if (!acc[key]) {
      acc[key] = { total: 0, paid: 0, remaining: 0, count: 0, paidCount: 0 }
    }

    const recordTotal = Number(record.amount ?? 0)
    const recordPaid = Number(record.paidAmount ?? 0)
    const recordRemaining = recordTotal - recordPaid

    acc[key].total += recordTotal
    acc[key].paid += recordPaid
    acc[key].remaining += recordRemaining
    acc[key].count += 1
    if (record.paid || recordRemaining <= 0) acc[key].paidCount += 1

    return acc
  }, {})

  const totalFilteredAmount = filteredRecords.reduce((sum, record) => sum + Number(record.amount ?? 0), 0)
  const totalPaidAmount = filteredRecords.reduce((sum, record) => sum + Number(record.paidAmount ?? 0), 0)
  const totalRemainingAmount = totalFilteredAmount - totalPaidAmount

  const handleMarkPaid = async (record) => {
    const remaining = Math.max(0, Number(record.amount ?? 0) - Number(record.paidAmount ?? 0))
    const confirmed = await confirm({
      title: 'Mark as Paid',
      message: `Mark remaining balance (₱${remaining.toFixed(2)}) as paid?`,
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

  const handlePayPartial = async (record) => {
    setPaymentRecord(record)
    setPaymentModalOpen(true)
  }

  const handleConfirmPayment = async (amount) => {
    const record = paymentRecord
    if (!record) return

    try {
      setIsProcessing(true)
      setProcessingMessage('Processing payment...')
      const remaining = (record.amount ?? 0) - (record.paidAmount ?? 0)
      await payPartial(record.id, amount)
      setPaymentModalOpen(false)
      setPaymentRecord(null)
      toast.success(`Payment of ₱${amount.toFixed(2)} processed successfully!`)
    } catch (err) {
      toast.error(err.message || 'Failed to process payment')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelPayment = () => {
    setPaymentModalOpen(false)
    setPaymentRecord(null)
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

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Matched records</p>
          <h2 className="text-2xl font-bold">{filteredRecords.length}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total cash out amount</p>
          <h2 className="text-2xl font-bold">₱{totalFilteredAmount.toFixed(2)}</h2>
          <p className="text-xs text-green-600">Paid: ₱{totalPaidAmount.toFixed(2)}</p>
          <p className="text-xs text-red-600">Remaining: ₱{totalRemainingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">People tracked</p>
          <h2 className="text-2xl font-bold">{Object.keys(personTotals).length}</h2>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">

        <input
          placeholder="Person Name"
          value={form.personName}
          onChange={(e) => setForm({ ...form, personName: e.target.value })}
          className="w-full border p-2"
        />

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
          placeholder="Search by person, description, type, amount, date, or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded shadow-sm"
        />
      </div>

      {/* PAID CASH OUT RECORDS TABLE */}
      {filteredRecords.some(r => (r.paidAmount ?? 0) > 0) && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-4">Cash Out Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Person</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-right p-3">Amount Paid</th>
                  <th className="text-left p-3">Date</th> 
                </tr>
              </thead>
              <tbody>
                {filteredRecords
                  .filter(r => (r.paidAmount ?? 0) > 0)
                  .map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{r.personName?.trim() || 'Unknown'}</td>
                      <td className="p-3">{r.description}</td>
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {r.type}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold text-green-600">₱{(r.paidAmount ?? 0).toFixed(2)}</td>
                      <td className="p-3 text-gray-600">{formatRecordedAt(r.recordedAt ?? r.date)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {Object.keys(personTotals).length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-3">Totals By Person</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(personTotals)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 6)
              .map(([name, summary]) => (
                <div key={name} className="border rounded p-3 bg-gray-50">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-gray-600">Records: {summary.count} ({summary.paidCount} settled)</p>
                  <p className="text-sm text-gray-600">Total: ₱{summary.total.toFixed(2)}</p>
                  {summary.remaining > 0 && (
                    <>
                      <p className="text-xs text-green-600">Paid: ₱{summary.paid.toFixed(2)}</p>
                      <p className="text-xs text-red-600">Due: ₱{summary.remaining.toFixed(2)}</p>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {filteredRecords.slice(0, 5).map(r => {
          const remaining = (r.amount ?? 0) - (r.paidAmount ?? 0)
          const isFullyPaid = remaining <= 0
          return (
            <div key={r.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{r.personName?.trim() || 'Unknown person'}</p>
                  <p className="font-bold">{r.description}</p>
                  <p className="text-sm text-gray-500">{r.type}</p>
                  <div className="text-sm mt-2">
                    <p className="font-semibold">Total: ₱{r.amount?.toFixed(2)}</p>
                    {(r.paidAmount ?? 0) > 0 && (
                      <p className="text-green-600">Paid: ₱{(r.paidAmount ?? 0).toFixed(2)}</p>
                    )}
                    {remaining > 0 && (
                      <p className="text-red-600">Remaining: ₱{remaining.toFixed(2)}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Recorded at: {formatRecordedAt(r.recordedAt ?? r.date)}</p>
                  <p className={isFullyPaid ? 'text-green-500 font-semibold' : 'text-red-500'}>
                    {isFullyPaid ? '✓ Paid' : 'Unpaid'}
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {!isFullyPaid && (
                    <>
                      <button
                        type="button"
                        onClick={() => handlePayPartial(r)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Pay Partial
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkPaid(r)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Pay Full
                      </button>
                    </>
                  )}
                  {isFullyPaid && (
                    <button
                      type="button"
                      onClick={() => handleMarkUnpaid(r)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Undo
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {filteredRecords.length === 0 && (
          <p className="text-gray-500">No records match your search.</p>
        )}
      </div>

      <PartialPaymentModal
        isOpen={paymentModalOpen}
        record={paymentRecord}
        onConfirm={handleConfirmPayment}
        onCancel={handleCancelPayment}
        isProcessing={isProcessing}
      />

      <LoadingOverlay isOpen={isProcessing} message={processingMessage} />
    </div>
  )
}
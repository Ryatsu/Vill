import { useState } from 'react'

export default function PartialPaymentModal({ isOpen, record, onConfirm, onCancel, isProcessing }) {
  const [amount, setAmount] = useState('')

  if (!isOpen || !record) return null

  const remaining = (record.amount ?? 0) - (record.paidAmount ?? 0)

  const handleConfirm = () => {
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (Number(amount) > remaining) {
      alert(`Amount cannot exceed remaining balance: ₱${remaining.toFixed(2)}`)
      return
    }

    onConfirm(Number(amount))
    setAmount('')
  }

  const handleCancel = () => {
    setAmount('')
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Partial Payment</h2>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Person: <span className="font-semibold">{record.personName?.trim() || 'Unknown'}</span></p>
          <p className="text-sm text-gray-600 mt-1">Description: <span className="font-semibold">{record.description}</span></p>
          <p className="text-sm text-gray-600 mt-2">
            Total Amount: <span className="font-bold">₱{record.amount?.toFixed(2)}</span>
          </p>
          {(record.paidAmount ?? 0) > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Already Paid: <span className="font-semibold">₱{(record.paidAmount ?? 0).toFixed(2)}</span>
            </p>
          )}
          <p className="text-sm text-red-600 mt-1">
            Remaining: <span className="font-bold">₱{remaining.toFixed(2)}</span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Payment Amount</label>
          <div className="flex items-center border rounded p-2">
            <span className="text-lg mr-2">₱</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={remaining}
              step="0.01"
              min="0.01"
              className="flex-1 outline-none"
              disabled={isProcessing}
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Max: ₱{remaining.toFixed(2)}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || !amount}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}

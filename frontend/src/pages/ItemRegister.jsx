import { useMemo, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from '../context/ConfirmationContext'
import LoadingOverlay from '../components/LoadingOverlay'
import { createManualSale } from '../api/saleApi'

const salePresets = {
  Printing: 5,
  Xerox: 3,
  Load: 50,
  Other: 0,
}

export default function ItemRegister() {
  const confirm = useConfirm()
  const [description, setDescription] = useState('')
  const [descriptionInput, setDescriptionInput] = useState(description)
  const [saleType, setSaleType] = useState('Custom')
  const [qty, setQty] = useState('1')
  const [unitPrice, setUnitPrice] = useState('0')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Processing...')

  const total = useMemo(() => Number(unitPrice || 0) * Number(qty || 0), [qty, unitPrice])

  const saleTypes = Object.keys(salePresets)

  const applyPreset = (type) => {
    setSaleType(type)
    setUnitPrice(salePresets[type])
  }

  // debounce description input to avoid rapid preview updates
  useEffect(() => {
    const id = setTimeout(() => setDescription(descriptionInput), 250)
    return () => clearTimeout(id)
  }, [descriptionInput])

  const handleSubmit = async () => {
    const trimmedDescription = description.trim()
    const quantity = Number(qty || 0)
    const price = Number(unitPrice || 0)

    if (!trimmedDescription) {
      toast.error('Please enter a sale description')
      return
    }

    if (!quantity || quantity < 1) {
      toast.error('Quantity must be at least 1')
      return
    }

    const confirmed = await confirm({
      title: 'Confirm Manual Sale',
      message: `Record ${quantity} x ${trimmedDescription} for ₱${total.toFixed(2)}?`,
      confirmText: 'Save Sale',
      cancelText: 'Cancel',
    })

    if (!confirmed) return

    try {
      setIsProcessing(true)
      setProcessingMessage('Recording manual sale...')
      await createManualSale({
        description: trimmedDescription,
        qty: quantity,
        unitPrice: price,
        saleType,
      })
      toast.success('Manual sale recorded successfully!')
      setDescription('')
      setDescriptionInput('')
      setSaleType('Custom')
      setQty('1')
      setUnitPrice('0')
    } catch (err) {
      toast.error(err.message || 'Failed to record sale')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Flexible pricing</p>
        <h1 className="text-2xl font-bold">Manual Sale</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bg-white p-6 rounded-xl shadow space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="e.g. Printing, Xerox, Load, Laminating"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {saleTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => applyPreset(type)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    saleType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Active type: <span className="font-medium text-gray-700">{saleType}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Record Manual Sale
          </button>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6 rounded-xl shadow space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Preview</p>
            <h2 className="text-xl font-semibold mt-1">{description.trim() || 'No description yet'}</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-slate-300">Type</span>
              <span className="font-medium">{saleType}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-slate-300">Quantity</span>
              <span className="font-medium">{qty}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-slate-300">Unit Price</span>
              <span className="font-medium">₱{Number(unitPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 text-lg">
              <span className="text-slate-300">Total</span>
              <span className="font-bold">₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded-lg bg-white/10 p-4 text-sm text-slate-200">
            Tip: use the preset buttons for common services, then adjust the unit price when the customer needs a custom amount.
          </div>
        </div>
      </div>

      <LoadingOverlay isOpen={isProcessing} message={processingMessage} />
    </div>
  )
}
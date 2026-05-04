import LoadingSpinner from './LoadingSpinner'

export default function LoadingOverlay({ isOpen, message = 'Processing...' }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  )
}

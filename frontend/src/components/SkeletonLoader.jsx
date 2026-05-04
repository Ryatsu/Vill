export default function SkeletonLoader({ count = 3, variant = 'card' }) {
  if (variant === 'card') {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/2" />
            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-gray-300 rounded" />
              <div className="flex-1 h-9 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded shadow animate-pulse flex justify-between">
            <div className="flex-1">
              <div className="h-5 bg-gray-300 rounded mb-2 w-1/3" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/5" />
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <div className="w-24 h-8 bg-gray-300 rounded" />
              <div className="w-24 h-8 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'form') {
    return (
      <div className="bg-white p-6 rounded-xl shadow space-y-4 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-300 rounded w-1/4" />
      </div>
    )
  }

  return null
}

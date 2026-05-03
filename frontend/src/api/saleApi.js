const API = '/api/sales'

export const getSales = async () => {
  const res = await fetch(API)
  if (!res.ok) throw new Error('Failed to fetch sales')
  return res.json()
}

export const createSale = async (itemId, qty) => {
  const res = await fetch(`${API}/${itemId}?qty=${qty}`, {
    method: 'POST'
  })

  if (!res.ok) throw new Error('Failed to record sale')

  return res.json()
}
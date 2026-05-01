import { useEffect, useState } from 'react'
import * as api from '../api/itemApi'

export const useItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const loadItems = async () => {
    setLoading(true)
    const data = await api.getItems()

    data.sort((a, b) => new Date(b.dateRegistered) - new Date(a.dateRegistered))
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const addItem = async (item) => {
    const newItem = await api.createItem(item)
    setItems(prev => [newItem, ...prev])
  }

  const markBought = async (id) => {
    const updated = await api.buyItem(id)
    setItems(prev => prev.map(i => (i.id === id ? updated : i)))
  }

  const removeItem = async (id) => {
    await api.deleteItem(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, addItem, markBought, removeItem }
}
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

  const updateItem = async (id, data) => {
    const res = await fetch(`http://localhost:8080/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const updated = await res.json()

    setItems(prev => prev.map(i => (i.id === id ? updated : i)))
  }

  return { items, loading, addItem, markBought, removeItem, updateItem }
}
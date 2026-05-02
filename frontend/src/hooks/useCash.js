import { useEffect, useState } from 'react'
import * as api from '../api/cashApi'

export const useCash = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getCashRecords()
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cash records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const add = async (record) => {
    const newRecord = await api.createCashRecord(record)
    setRecords(prev => [newRecord, ...prev])
  }

  const pay = async (id) => {
    const updated = await api.markPaid(id)
    setRecords(prev => prev.map(r => r.id === id ? updated : r))
  }

  const unpay = async (id) => {
    const updated = await api.markUnpaid(id)
    setRecords(prev => prev.map(r => r.id === id ? updated : r))
  }

  const remove = async (id) => {
    await api.deleteCash(id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return { records, loading, error, add, pay, unpay, remove, reload: load }
}
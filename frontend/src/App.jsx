import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    price: '',
    cost: '',
  })

  const stats = useMemo(() => {
    const boughtCount = items.filter((item) => item.dateBought).length
    const totalValue = items.reduce((sum, item) => sum + Number(item.price || 0), 0)

    return {
      totalItems: items.length,
      boughtCount,
      availableCount: items.length - boughtCount,
      totalValue,
    }
  }, [items])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('http://localhost:8080/api/items')

      if (!response.ok) {
        throw new Error(`Failed to load items (${response.status})`)
      }

      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  // GET items
  useEffect(() => {
    loadItems()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const registerItem = async (event) => {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch('http://localhost:8080/api/items/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          cost: Number(form.cost),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to register item (${response.status})`)
      }

      const createdItem = await response.json()
      setItems((current) => [createdItem, ...current])
      setForm({ name: '', price: '', cost: '' })
    } catch (err) {
      setError(err.message || 'Failed to register item')
    }
  }

  const markBought = async (itemId) => {
    try {
      setError('')

      const response = await fetch(`http://localhost:8080/api/items/${itemId}/buy`, {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error(`Failed to update item (${response.status})`)
      }

      const updatedItem = await response.json()
      setItems((current) => current.map((item) => (item.id === itemId ? updatedItem : item)))
    } catch (err) {
      setError(err.message || 'Failed to mark item as bought')
    }
  }

  const formatDate = (value) => {
    if (!value) return 'Not set'

    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <main className="item-app">
      <section className="hero card">
        <div>
          <p className="eyebrow">Inventory tracker</p>
          <h1>Register items, track cost, and mark purchases in one place.</h1>
          <p className="hero-copy">
            Capture the item name, selling price, cost, and let the app stamp when it was registered or bought.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span>Total items</span>
            <strong>{stats.totalItems}</strong>
          </div>
          <div className="stat">
            <span>Available</span>
            <strong>{stats.availableCount}</strong>
          </div>
          <div className="stat">
            <span>Bought</span>
            <strong>{stats.boughtCount}</strong>
          </div>
          <div className="stat">
            <span>Total value</span>
            <strong>${stats.totalValue.toFixed(2)}</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <form className="card form-card" onSubmit={registerItem}>
          <div className="section-heading">
            <p className="eyebrow">New item</p>
            <h2>Register an item</h2>
          </div>

          <label>
            Item name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Wireless headset"
              required
            />
          </label>

          <div className="split-fields">
            <label>
              Price
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </label>

            <label>
              Cost
              <input
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </label>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}

          <button className="primary-button" type="submit">
            Register item
          </button>
        </form>

        <section className="card list-card">
          <div className="section-heading list-heading">
            <div>
              <p className="eyebrow">Inventory</p>
              <h2>Registered items</h2>
            </div>
            <button className="ghost-button" type="button" onClick={loadItems}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="muted">Loading items...</p>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <strong>No items yet</strong>
              <p>Use the form to register your first item. It will automatically get a registration date.</p>
            </div>
          ) : (
            <div className="item-list">
              {items.map((item) => {
                const isBought = Boolean(item.dateBought)

                return (
                  <article key={item.id} className="item-card">
                    <div className="item-card-top">
                      <div>
                        <h3>{item.name}</h3>
                        <p className="muted">ID: {item.id}</p>
                      </div>
                      <span className={isBought ? 'badge badge-bought' : 'badge badge-available'}>
                        {isBought ? 'Bought' : 'Available'}
                      </span>
                    </div>

                    <div className="item-meta">
                      <span><strong>Price:</strong> ${Number(item.price || 0).toFixed(2)}</span>
                      <span><strong>Cost:</strong> ${Number(item.cost || 0).toFixed(2)}</span>
                      <span><strong>Registered:</strong> {formatDate(item.dateRegistered)}</span>
                      <span><strong>Bought:</strong> {formatDate(item.dateBought)}</span>
                    </div>

                    <div className="item-actions">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => markBought(item.id)}
                        disabled={isBought}
                      >
                        {isBought ? 'Already bought' : 'Mark as bought'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
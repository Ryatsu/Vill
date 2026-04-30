import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState("")

  // GET users
  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
      .then(res => {
        console.log("STATUS:", res.status)
        return res.json()
      })
  }, [])

  // POST user
  const addUser = () => {
    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(newUser => {
        setUsers([...users, newUser])
        setName("")
      })
      .then(res => {
        console.log("STATUS:", res.status)
        return res.json()
      })
  }

  return (
    <>
      <h1>Users</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={addUser}>Add User</button>

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  )
}

export default App
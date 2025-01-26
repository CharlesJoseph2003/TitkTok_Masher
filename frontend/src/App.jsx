import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResponse(null)
    
    console.log('Sending URL:', url)
    
    try {
      const response = await fetch('http://localhost:5000/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url }),
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      setResponse(data)
    } catch (err) {
      console.error('Error details:', err)
      setError(`Error sending URL to server: ${err.message}`)
    }
  }

  return (
    <div className="App">
      <h1>URL Sender</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL here"
          required
        />
        <button type="submit">Send URL</button>
      </form>
      
      {error && (
        <div className="error">
          <p>{error}</p>
          <p>Make sure both the backend (port 5000) and frontend (port 5173) servers are running.</p>
        </div>
      )}
      {response && (
        <div className="response">
          <h2>Server Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App

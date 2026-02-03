import React, { useState } from 'react'

const App: React.FC = () => {
  const [message, setMessage] = useState('Hello from React!')

  return (
    <div>
      <h1>{message}</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  )
}

export default App

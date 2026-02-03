import React, { useState } from 'react'
import Foo from '../src/react'

const App: React.FC = () => {
  const [message, setMessage] = useState('Hello from React!')

  return (
    <div>
      <Foo message={message} />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  )
}

export default App

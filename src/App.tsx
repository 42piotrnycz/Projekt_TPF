import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Witaj w React!</h1>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Licznik: {count}
        </button>
        <p>
          Edytuj <code>src/App.tsx</code> i zapisz, aby zobaczyć zmiany
        </p>
      </div>
      <p className="read-the-docs">
        Kliknij logo Vite'a, aby dowiedzieć się więcej
      </p>
    </>
  )
}

export default App

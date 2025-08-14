// import React, { useState } from 'react'
// import { api } from '../api.js'
// import { useAuth } from '../context/AuthContext.jsx'

// export default function Register() {
//   const { login } = useAuth()
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [err, setErr] = useState('')

//   const submit = async (e) => {
//     e.preventDefault()
//     setErr('')
//     try {
//       const res = await api('/auth/register', { method: 'POST', body: { name, email, password } })
//       login(res.token, res.user)
//     } catch (e) { setErr(e.message) }
//   }

//   return (
//     <form onSubmit={submit} className="grid gap-3 p-4 bg-gray-50 rounded shadow mt-4">
//       <h3 className="text-lg font-semibold mb-2">Create Account</h3>
//       {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
//       <input className="border rounded px-2 py-1" placeholder='Name' value={name} onChange={e=>setName(e.target.value)} />
//       <input className="border rounded px-2 py-1" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
//       <input className="border rounded px-2 py-1" placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
//       <button className="bg-green-600 text-white rounded px-3 py-1 mt-2 hover:bg-green-700">Register</button>
//     </form>
//   )
// }



import React, { useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await api('/auth/register', { method: 'POST', body: { name, email, password } })
      login(res.token, res.user)
    } catch (e) { setErr(e.message) }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <h3 className="text-2xl font-semibold text-green-700">New User? Register Here</h3>
      {err && <div className="text-red-600 text-sm bg-red-100 p-2 rounded shadow">{err}</div>}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border border-green-300 rounded-lg px-4 py-2 focus:ring-4 focus:ring-green-300 focus:outline-none transition"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border border-green-300 rounded-lg px-4 py-2 focus:ring-4 focus:ring-green-300 focus:outline-none transition"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border border-green-300 rounded-lg px-4 py-2 focus:ring-4 focus:ring-green-300 focus:outline-none transition"
        required
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg py-3 shadow-lg transform hover:scale-105 transition"
      >
        Register
      </button>
    </form>
  )
}

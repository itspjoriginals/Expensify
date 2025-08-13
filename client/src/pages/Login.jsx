import React, { useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await api('/auth/login', { method: 'POST', body: { email, password } })
      login(res.token, res.user)
    } catch (e) { setErr(e.message) }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Login</h3>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <input className="border rounded px-2 py-1" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-2 py-1" placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white rounded px-3 py-1 mt-2 hover:bg-blue-700">Login</button>
    </form>
  )
}

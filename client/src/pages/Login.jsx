// import React, { useState } from 'react'
// import { api } from '../api.js'
// import { useAuth } from '../context/AuthContext.jsx'

// export default function Login() {
//   const { login } = useAuth()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [err, setErr] = useState('')

//   const submit = async (e) => {
//     e.preventDefault()
//     setErr('')
//     try {
//       const res = await api('/auth/login', { method: 'POST', body: { email, password } })
//       login(res.token, res.user)
//     } catch (e) { setErr(e.message) }
//   }

//   return (
//     <form onSubmit={submit} className="grid gap-3 p-4 bg-gray-50 rounded shadow">
//       <h3 className="text-lg font-semibold mb-2">Login</h3>
//       {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
//       <input className="border rounded px-2 py-1" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
//       <input className="border rounded px-2 py-1" placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
//       <button className="bg-blue-600 text-white rounded px-3 py-1 mt-2 hover:bg-blue-700">Login</button>
//     </form>
//   )
// }





import React, { useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next';


export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const { t } = useTranslation();

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await api('/auth/login', { method: 'POST', body: { email, password } })
      login(res.token, res.user)
    } catch (e) { setErr(e.message) }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <h3 className="text-2xl font-semibold text-indigo-800">{t('login')}</h3>
      {err && <div className="text-red-600 text-sm bg-red-100 p-2 rounded shadow">{err}</div>}
      <input
        type="email"
        placeholder={t('email')}
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border border-indigo-300 rounded-lg px-4 py-2 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
        required
      />
      <input
        type="password"
        placeholder={t('password')}
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border border-indigo-300 rounded-lg px-4 py-2 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition"
        required
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 shadow-lg transform hover:scale-105 transition"
      >
        {t('login')}
      </button>
    </form>
  )
}

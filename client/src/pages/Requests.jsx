import React, { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Requests() {
  const { token } = useAuth()
  const [inbox, setInbox] = useState([])
  const [outbox, setOutbox] = useState([])
  const [form, setForm] = useState({ toEmail: '', amount: 0, reason: '' })
  const [err, setErr] = useState('')

  const load = async () => {
    const data = await api('/requests', { token })
    setInbox(data.inbox); setOutbox(data.outbox)
  }
  useEffect(() => { load() }, [])

  const send = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      await api('/requests', { method: 'POST', token, body: { ...form, amount: Number(form.amount) } })
      setForm({ toEmail: '', amount: 0, reason: '' })
      load()
    } catch (e) { setErr(e.message) }
  }

  const accept = async (id) => { await api(`/requests/${id}/accept`, { method:'PATCH', token }); load() }
  const reject = async (id) => {
    const reason = prompt('Rejection reason?') || 'No reason provided'
    await api(`/requests/${id}/reject`, { method:'PATCH', token, body: { rejectionReason: reason } }); load()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Money Requests</h2>
      <form onSubmit={send} className="grid gap-2 max-w-md bg-white rounded shadow p-4 mb-6">
        <b className="mb-1">Send a Request</b>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        <input className="border rounded px-2 py-1" placeholder='To Email' value={form.toEmail} onChange={e=>setForm({...form, toEmail:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder='Amount' type='number' value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder='Reason' value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} />
        <button className="bg-blue-600 text-white rounded px-3 py-1 mt-2 hover:bg-blue-700">Send</button>
      </form>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="flex-1 bg-gray-50 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Inbox</h3>
          <ul className="space-y-2">
            {inbox.map(r => <li key={r._id} className="text-gray-800">
              {r.sender.name} requested ₹{r.amount} — {r.reason} — <i>{r.status}</i>
              {r.status==='pending' && <>
                <button onClick={()=>accept(r._id)} className="ml-2 px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700">Accept</button>
                <button onClick={()=>reject(r._id)} className="ml-2 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600">Reject</button>
              </>}
            </li>)}
          </ul>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Outbox</h3>
          <ul className="space-y-2">
            {outbox.map(r => <li key={r._id} className="text-gray-800">
              To {r.receiver.email} — ₹{r.amount} — {r.reason} — <i>{r.status}</i>
            </li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

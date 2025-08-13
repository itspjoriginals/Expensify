// import React, { useEffect, useState } from 'react'
// import { api } from '../api.js'
// import { useAuth } from '../context/AuthContext.jsx'

// export default function Requests() {
//   const { token } = useAuth()
//   const [inbox, setInbox] = useState([])
//   const [outbox, setOutbox] = useState([])
//   const [form, setForm] = useState({ toEmail: '', amount: 0, reason: '' })
//   const [err, setErr] = useState('')

//   const load = async () => {
//     const data = await api('/requests', { token })
//     setInbox(data.inbox); setOutbox(data.outbox)
//   }
//   useEffect(() => { load() }, [])

//   const send = async (e) => {
//     e.preventDefault()
//     setErr('')
//     try {
//       await api('/requests', { method: 'POST', token, body: { ...form, amount: Number(form.amount) } })
//       setForm({ toEmail: '', amount: 0, reason: '' })
//       load()
//     } catch (e) { setErr(e.message) }
//   }

//   const accept = async (id) => { await api(`/requests/${id}/accept`, { method:'PATCH', token }); load() }
//   const reject = async (id) => {
//     const reason = prompt('Rejection reason?') || 'No reason provided'
//     await api(`/requests/${id}/reject`, { method:'PATCH', token, body: { rejectionReason: reason } }); load()
//   }

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Money Requests</h2>
//       <form onSubmit={send} className="grid gap-2 max-w-md bg-white rounded shadow p-4 mb-6">
//         <b className="mb-1">Send a Request</b>
//         {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
//         <input className="border rounded px-2 py-1" placeholder='To Email' value={form.toEmail} onChange={e=>setForm({...form, toEmail:e.target.value})} />
//         <input className="border rounded px-2 py-1" placeholder='Amount' type='number' value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} />
//         <input className="border rounded px-2 py-1" placeholder='Reason' value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} />
//         <button className="bg-blue-600 text-white rounded px-3 py-1 mt-2 hover:bg-blue-700">Send</button>
//       </form>

//       <div className="flex flex-col md:flex-row gap-6 mt-6">
//         <div className="flex-1 bg-gray-50 rounded-lg shadow p-4">
//           <h3 className="text-lg font-semibold mb-2">Inbox</h3>
//           <ul className="space-y-2">
//             {inbox.map(r => <li key={r._id} className="text-gray-800">
//               {r.sender.name} requested ₹{r.amount} — {r.reason} — <i>{r.status}</i>
//               {r.status==='pending' && <>
//                 <button onClick={()=>accept(r._id)} className="ml-2 px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700">Accept</button>
//                 <button onClick={()=>reject(r._id)} className="ml-2 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600">Reject</button>
//               </>}
//             </li>)}
//           </ul>
//         </div>
//         <div className="flex-1 bg-gray-50 rounded-lg shadow p-4">
//           <h3 className="text-lg font-semibold mb-2">Outbox</h3>
//           <ul className="space-y-2">
//             {outbox.map(r => <li key={r._id} className="text-gray-800">
//               To {r.receiver.email} — ₹{r.amount} — {r.reason} — <i>{r.status}</i>
//             </li>)}
//           </ul>
//         </div>
//       </div>
//     </div>
//   )
// }




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
    setInbox(data.inbox)
    setOutbox(data.outbox)
  }
  useEffect(() => { load() }, [])

  const send = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      await api('/requests', {
        method: 'POST',
        token,
        body: { ...form, amount: Number(form.amount) }
      })
      setForm({ toEmail: '', amount: 0, reason: '' })
      load()
    } catch (e) { setErr(e.message) }
  }

  const accept = async (id) => { 
    await api(`/requests/${id}/accept`, { method: 'PATCH', token })
    load()
  }
  const reject = async (id) => {
    const reason = prompt('Rejection reason?') || 'No reason provided'
    await api(`/requests/${id}/reject`, { 
      method: 'PATCH', 
      token, 
      body: { rejectionReason: reason } 
    })
    load()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">📩 Money Requests</h1>

        {/* Send Request Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 max-w-lg mb-10">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Send a Request</h2>
          {err && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{err}</div>}
          <form onSubmit={send} className="space-y-3">
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder='Recipient Email'
              value={form.toEmail}
              onChange={e => setForm({ ...form, toEmail: e.target.value })}
            />
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder='Amount'
              type='number'
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder='Reason'
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-lg py-2 font-semibold">
              🚀 Send Request
            </button>
          </form>
        </div>

        {/* Inbox / Outbox */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Inbox */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Inbox</h3>
            {inbox.length === 0 ? (
              <p className="text-gray-500">No incoming requests.</p>
            ) : (
              <ul className="space-y-4">
                {inbox.map(r => (
                  <li key={r._id} className="p-4 rounded-lg border border-gray-200 hover:shadow flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">{r.sender.name}</p>
                        <p className="text-sm text-gray-500">{r.reason}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : r.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">₹{r.amount}</p>
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => accept(r._id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-1 font-semibold"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() => reject(r._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-1 font-semibold"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Outbox */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">Outbox</h3>
            {outbox.length === 0 ? (
              <p className="text-gray-500">No sent requests yet.</p>
            ) : (
              <ul className="space-y-4">
                {outbox.map(r => (
                  <li key={r._id} className="p-4 rounded-lg border border-gray-200 hover:shadow flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">To: {r.receiver.email}</p>
                      <p className="text-sm text-gray-500">{r.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">₹{r.amount}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : r.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

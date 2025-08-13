// import React, { useEffect, useState } from 'react'
// import { api } from '../api.js'
// import { useAuth } from '../context/AuthContext.jsx'

// export default function Dashboard() {
//   const { token } = useAuth()
//   const [sources, setSources] = useState([])
//   const [tx, setTx] = useState([])
//   const [form, setForm] = useState({ name: '', initialBalance: 0 })
//   const [newTx, setNewTx] = useState({ sourceId: '', type: 'expense', amount: 0, category: '', description: '' })

//   const load = async () => {
//     const s = await api('/sources', { token })
//     setSources(s)
//     const t = await api('/transactions?limit=20', { token })
//     setTx(t)
//   }
//   useEffect(() => { load() }, [])

//   const createSource = async (e) => {
//     e.preventDefault()
//     await api('/sources', { method: 'POST', body: form, token })
//     setForm({ name: '', initialBalance: 0 })
//     load()
//   }
//   const addTx = async (e) => {
//     e.preventDefault()
//     await api('/transactions', { method: 'POST', token, body: { ...newTx, amount: Number(newTx.amount) } })
//     setNewTx({ sourceId: '', type: 'expense', amount: 0, category: '', description: '' })
//     load()
//   }

//   const total = sources.reduce((s,x)=>s+(x.balance||0),0)

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Dashboard</h2>
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="flex-1 bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-semibold mb-2">Sources</h3>
//           <div className="mb-2 text-gray-700">Total Balance: <span className="font-bold">₹{total}</span></div>
//           <ul className="mb-4 space-y-1">
//             {sources.map(s => <li key={s._id} className="text-gray-800">{s.name} — ₹{s.balance}</li>)}
//           </ul>
//           <form onSubmit={createSource} className="grid gap-2 max-w-xs">
//             <b className="mb-1">Add Source</b>
//             <input className="border rounded px-2 py-1" placeholder='Name (e.g., Father)' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
//             <input className="border rounded px-2 py-1" placeholder='Initial Balance' type='number' value={form.initialBalance} onChange={e=>setForm({...form, initialBalance:e.target.value})} />
//             <button className="bg-blue-600 text-white rounded px-3 py-1 mt-1 hover:bg-blue-700">Create</button>
//           </form>
//         </div>

//         <div className="flex-1 bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-semibold mb-2">Add Transaction</h3>
//           <form onSubmit={addTx} className="grid gap-2">
//             <select className="border rounded px-2 py-1" value={newTx.sourceId} onChange={e=>setNewTx({...newTx, sourceId:e.target.value})}>
//               <option value=''>-- Select Source --</option>
//               {sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//             </select>
//             <select className="border rounded px-2 py-1" value={newTx.type} onChange={e=>setNewTx({...newTx, type:e.target.value})}>
//               <option value='expense'>Expense</option>
//               <option value='income'>Income</option>
//             </select>
//             <input className="border rounded px-2 py-1" placeholder='Amount' type='number' value={newTx.amount} onChange={e=>setNewTx({...newTx, amount:e.target.value})} />
//             <input className="border rounded px-2 py-1" placeholder='Category' value={newTx.category} onChange={e=>setNewTx({...newTx, category:e.target.value})} />
//             <input className="border rounded px-2 py-1" placeholder='Description' value={newTx.description} onChange={e=>setNewTx({...newTx, description:e.target.value})} />
//             <button className="bg-green-600 text-white rounded px-3 py-1 mt-1 hover:bg-green-700">Add</button>
//           </form>

//           <h3 className="mt-6 text-lg font-semibold">Recent Transactions</h3>
//           <ul className="mt-2 space-y-1">
//             {tx.map(t => <li key={t._id} className="text-gray-800">
//               [{t.type}] ₹{t.amount} {t.category} {t.source ? `from ${t.source.name}` : t.sharedFund ? `on fund ${t.sharedFund.name}` : ''}
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

export default function Dashboard() {
  const { token } = useAuth()
  const [sources, setSources] = useState([])
  const [tx, setTx] = useState([])
  const [form, setForm] = useState({ name: '', initialBalance: 0 })
  const [newTx, setNewTx] = useState({ sourceId: '', type: 'expense', amount: 0, category: '', description: '' })

  const load = async () => {
    const s = await api('/sources', { token })
    setSources(s)
    const t = await api('/transactions?limit=20', { token })
    setTx(t)
  }
  useEffect(() => { load() }, [])

  const createSource = async (e) => {
    e.preventDefault()
    await api('/sources', { method: 'POST', body: form, token })
    setForm({ name: '', initialBalance: 0 })
    load()
  }
  const addTx = async (e) => {
    e.preventDefault()
    await api('/transactions', { method: 'POST', token, body: { ...newTx, amount: Number(newTx.amount) } })
    setNewTx({ sourceId: '', type: 'expense', amount: 0, category: '', description: '' })
    load()
  }

  const total = sources.reduce((s, x) => s + (x.balance || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">📊 Dashboard</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sources */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-teal-700">Sources</h2>
              <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
                Total: ₹{total}
              </span>
            </div>
            <ul className="mb-4 space-y-2">
              {sources.map(s => (
                <li key={s._id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-medium text-gray-800">{s.name}</span>
                  <span className="font-semibold text-gray-700">₹{s.balance}</span>
                </li>
              ))}
            </ul>

            {/* Add Source Form */}
            <form onSubmit={createSource} className="space-y-3 mt-auto">
              <b className="block text-gray-700">Add Source</b>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                placeholder='Name (e.g., Salary)'
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                placeholder='Initial Balance'
                type='number'
                value={form.initialBalance}
                onChange={e => setForm({ ...form, initialBalance: e.target.value })}
              />
              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-lg py-2 font-semibold">
                ➕ Create Source
              </button>
            </form>
          </div>

          {/* Add Transaction + Recent Transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Add Transaction</h2>
            <form onSubmit={addTx} className="grid gap-3 mb-8">
              <select
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                value={newTx.sourceId}
                onChange={e => setNewTx({ ...newTx, sourceId: e.target.value })}
              >
                <option value=''>-- Select Source --</option>
                {sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <select
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                value={newTx.type}
                onChange={e => setNewTx({ ...newTx, type: e.target.value })}
              >
                <option value='expense'>Expense</option>
                <option value='income'>Income</option>
              </select>
              <input
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder='Amount'
                type='number'
                value={newTx.amount}
                onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
              />
              <input
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder='Category'
                value={newTx.category}
                onChange={e => setNewTx({ ...newTx, category: e.target.value })}
              />
              <input
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder='Description'
                value={newTx.description}
                onChange={e => setNewTx({ ...newTx, description: e.target.value })}
              />
              <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 font-semibold">
                💾 Add Transaction
              </button>
            </form>

            {/* Recent Transactions */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Transactions</h2>
            <ul className="space-y-3">
              {tx.map(t => (
                <li key={t._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-2 ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.type}
                    </span>
                    <span className="font-medium text-gray-800">{t.category}</span>
                    <span className="text-gray-500 text-sm block">
                      {t.source ? `from ${t.source.name}` : t.sharedFund ? `on fund ${t.sharedFund.name}` : ''}
                    </span>
                  </div>
                  <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{t.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

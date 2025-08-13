// import React, { useEffect, useState } from 'react'
// import { api } from '../api.js'
// import { useAuth } from '../context/AuthContext.jsx'

// export default function SharedFunds() {
//   const { token } = useAuth()
//   const [funds, setFunds] = useState([])
//   const [form, setForm] = useState({ name: '', totalAmount: 0, contributorEmails: '' })
//   const [expense, setExpense] = useState({ id: '', amount: 0, category: '', description: '' })

//   const load = async () => {
//     setFunds(await api('/shared-funds', { token }))
//   }
//   useEffect(() => { load() }, [])

//   const createFund = async (e) => {
//     e.preventDefault()
//     await api('/shared-funds', {
//       method:'POST', token,
//       body: { name: form.name, totalAmount: Number(form.totalAmount), contributorEmails: form.contributorEmails.split(',').map(s=>s.trim()).filter(Boolean) }
//     })
//     setForm({ name: '', totalAmount: 0, contributorEmails: '' })
//     load()
//   }

//   const addExpense = async (e) => {
//     e.preventDefault()
//     await api(`/shared-funds/${expense.id}/expenses`, { method:'POST', token, body: { amount: Number(expense.amount), category: expense.category, description: expense.description } })
//     setExpense({ id: '', amount: 0, category: '', description: '' })
//     load()
//   }

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Shared Funds</h2>
//       <form onSubmit={createFund} className="grid gap-2 max-w-md bg-white rounded shadow p-4 mb-6">
//         <b className="mb-1">Create Fund</b>
//         <input className="border rounded px-2 py-1" placeholder='Name' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
//         <input className="border rounded px-2 py-1" placeholder='Total Amount' type='number' value={form.totalAmount} onChange={e=>setForm({...form, totalAmount:e.target.value})} />
//         <input className="border rounded px-2 py-1" placeholder='Contributors emails (comma separated)' value={form.contributorEmails} onChange={e=>setForm({...form, contributorEmails:e.target.value})} />
//         <button className="bg-blue-600 text-white rounded px-3 py-1 mt-2 hover:bg-blue-700">Create</button>
//       </form>

//       <h3 className="mt-6 text-lg font-semibold">My Funds</h3>
//       <ul className="mt-2 space-y-1">
//         {funds.map(f => <li key={f._id} className="text-gray-800">
//           {f.name} — Remaining <span className="font-bold">₹{f.remainingAmount}</span> / ₹{f.totalAmount}
//         </li>)}
//       </ul>

//       <form onSubmit={addExpense} className="grid gap-2 max-w-md bg-white rounded shadow p-4 mt-6">
//         <b className="mb-1">Add Shared Expense</b>
//         <select className="border rounded px-2 py-1" value={expense.id} onChange={e=>setExpense({...expense, id:e.target.value})}>
//           <option value=''>-- Select Fund --</option>
//           {funds.map(f => <option value={f._id} key={f._id}>{f.name}</option>)}
//         </select>
//         <input className="border rounded px-2 py-1" placeholder='Amount' type='number' value={expense.amount} onChange={e=>setExpense({...expense, amount:e.target.value})} />
//         <input className="border rounded px-2 py-1" placeholder='Category' value={expense.category} onChange={e=>setExpense({...expense, category:e.target.value})} />
//         <input className="border rounded px-2 py-1" placeholder='Description' value={expense.description} onChange={e=>setExpense({...expense, description:e.target.value})} />
//         <button className="bg-green-600 text-white rounded px-3 py-1 mt-2 hover:bg-green-700">Add Expense</button>
//       </form>
//     </div>
//   )
// }





import React, { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function SharedFunds() {
  const { token } = useAuth()
  const [funds, setFunds] = useState([])
  const [form, setForm] = useState({ name: '', totalAmount: 0, contributorEmails: '' })
  const [expense, setExpense] = useState({ id: '', amount: 0, category: '', description: '' })

  const load = async () => {
    setFunds(await api('/shared-funds', { token }))
  }
  useEffect(() => { load() }, [])

  const createFund = async (e) => {
    e.preventDefault()
    await api('/shared-funds', {
      method: 'POST', token,
      body: {
        name: form.name,
        totalAmount: Number(form.totalAmount),
        contributorEmails: form.contributorEmails.split(',').map(s => s.trim()).filter(Boolean)
      }
    })
    setForm({ name: '', totalAmount: 0, contributorEmails: '' })
    load()
  }

  const addExpense = async (e) => {
    e.preventDefault()
    await api(`/shared-funds/${expense.id}/expenses`, {
      method: 'POST', token,
      body: { amount: Number(expense.amount), category: expense.category, description: expense.description }
    })
    setExpense({ id: '', amount: 0, category: '', description: '' })
    load()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">💰 Shared Funds Tracker</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Forms */}
          <div className="space-y-6">
            {/* Create Fund */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-teal-700 mb-4">Create New Fund</h2>
              <form onSubmit={createFund} className="space-y-3">
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder='Fund Name'
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder='Total Amount'
                  type='number'
                  value={form.totalAmount}
                  onChange={e => setForm({ ...form, totalAmount: e.target.value })}
                />
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder='Contributor emails (comma separated)'
                  value={form.contributorEmails}
                  onChange={e => setForm({ ...form, contributorEmails: e.target.value })}
                />
                <button
                  className="bg-teal-500 hover:bg-teal-600 text-white w-full rounded-lg py-2 font-semibold"
                >
                  ➕ Create Fund
                </button>
              </form>
            </div>

            {/* Add Expense */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Add Expense</h2>
              <form onSubmit={addExpense} className="space-y-3">
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  value={expense.id}
                  onChange={e => setExpense({ ...expense, id: e.target.value })}
                >
                  <option value=''>-- Select Fund --</option>
                  {funds.map(f => <option value={f._id} key={f._id}>{f.name}</option>)}
                </select>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder='Amount'
                  type='number'
                  value={expense.amount}
                  onChange={e => setExpense({ ...expense, amount: e.target.value })}
                />
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder='Category'
                  value={expense.category}
                  onChange={e => setExpense({ ...expense, category: e.target.value })}
                />
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder='Description'
                  value={expense.description}
                  onChange={e => setExpense({ ...expense, description: e.target.value })}
                />
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white w-full rounded-lg py-2 font-semibold"
                >
                  💸 Add Expense
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: My Funds */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Funds</h2>
            <ul className="space-y-4">
              {funds.length === 0 ? (
                <p className="text-gray-500">No funds created yet.</p>
              ) : (
                funds.map(f => (
                  <li key={f._id} className="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:shadow">
                    <div>
                      <p className="font-bold text-gray-800">{f.name}</p>
                      <p className="text-sm text-gray-500">Total: ₹{f.totalAmount}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${f.remainingAmount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        ₹{f.remainingAmount} left
                      </p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${f.remainingAmount > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${(f.remainingAmount / f.totalAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

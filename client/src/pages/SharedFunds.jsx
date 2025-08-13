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
      method:'POST', token,
      body: { name: form.name, totalAmount: Number(form.totalAmount), contributorEmails: form.contributorEmails.split(',').map(s=>s.trim()).filter(Boolean) }
    })
    setForm({ name: '', totalAmount: 0, contributorEmails: '' })
    load()
  }

  const addExpense = async (e) => {
    e.preventDefault()
    await api(`/shared-funds/${expense.id}/expenses`, { method:'POST', token, body: { amount: Number(expense.amount), category: expense.category, description: expense.description } })
    setExpense({ id: '', amount: 0, category: '', description: '' })
    load()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Shared Funds</h2>
      <form onSubmit={createFund} className="grid gap-2 max-w-md bg-white rounded shadow p-4 mb-6">
        <b className="mb-1">Create Fund</b>
        <input className="border rounded px-2 py-1" placeholder='Name' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder='Total Amount' type='number' value={form.totalAmount} onChange={e=>setForm({...form, totalAmount:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder='Contributors emails (comma separated)' value={form.contributorEmails} onChange={e=>setForm({...form, contributorEmails:e.target.value})} />
        <button className="bg-blue-600 text-white rounded px-3 py-1 mt-2 hover:bg-blue-700">Create</button>
      </form>

      <h3 className="mt-6 text-lg font-semibold">My Funds</h3>
      <ul className="mt-2 space-y-1">
        {funds.map(f => <li key={f._id} className="text-gray-800">
          {f.name} — Remaining <span className="font-bold">₹{f.remainingAmount}</span> / ₹{f.totalAmount}
        </li>)}
      </ul>

      <form onSubmit={addExpense} className="grid gap-2 max-w-md bg-white rounded shadow p-4 mt-6">
        <b className="mb-1">Add Shared Expense</b>
        <select className="border rounded px-2 py-1" value={expense.id} onChange={e=>setExpense({...expense, id:e.target.value})}>
          <option value=''>-- Select Fund --</option>
          {funds.map(f => <option value={f._id} key={f._id}>{f.name}</option>)}
        </select>
        <input className="border rounded px-2 py-1" placeholder='Amount' type='number' value={expense.amount} onChange={e=>setExpense({...expense, amount:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder='Category' value={expense.category} onChange={e=>setExpense({...expense, category:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder='Description' value={expense.description} onChange={e=>setExpense({...expense, description:e.target.value})} />
        <button className="bg-green-600 text-white rounded px-3 py-1 mt-2 hover:bg-green-700">Add Expense</button>
      </form>
    </div>
  )
}

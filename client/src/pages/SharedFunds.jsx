// import React, { useEffect, useState } from 'react'
// import { api } from '../api.js'
// import { useAuth } from '../context/AuthContext.jsx'
// import { motion, AnimatePresence } from 'framer-motion'
// import CountUp from 'react-countup'
// import EmptyState from '../components/EmptyState.jsx'


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
//       method: 'POST', token,
//       body: {
//         name: form.name,
//         totalAmount: Number(form.totalAmount),
//         contributorEmails: form.contributorEmails.split(',').map(s => s.trim()).filter(Boolean)
//       }
//     })
//     setForm({ name: '', totalAmount: 0, contributorEmails: '' })
//     load()
//   }

//   const addExpense = async (e) => {
//     e.preventDefault()
//     await api(`/shared-funds/${expense.id}/expenses`, {
//       method: 'POST', token,
//       body: { amount: Number(expense.amount), category: expense.category, description: expense.description }
//     })
//     setExpense({ id: '', amount: 0, category: '', description: '' })
//     load()
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Page Heading */}
//         <motion.h1
//           initial={{ opacity: 0, y: -15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center gap-2"
//         >
//           💰 Shared Funds Tracker
//         </motion.h1>

//         <div className="grid lg:grid-cols-2 gap-8">
          
//           {/* Left Column: Forms */}
//           <div className="space-y-6">
//             {/* Create Fund */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition"
//             >
//               <h2 className="text-xl font-semibold text-teal-700 mb-4">Create New Fund</h2>
//               <form onSubmit={createFund} className="space-y-3">
//                 {[
//                   { placeholder: 'Fund Name', key: 'name', type: 'text' },
//                   { placeholder: 'Total Amount', key: 'totalAmount', type: 'number' },
//                   { placeholder: 'Contributor emails (comma separated)', key: 'contributorEmails', type: 'text' }
//                 ].map(input => (
//                   <motion.input
//                     key={input.key}
//                     type={input.type}
//                     placeholder={input.placeholder}
//                     value={form[input.key]}
//                     onChange={e => setForm({ ...form, [input.key]: e.target.value })}
//                     className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
//                     whileFocus={{ scale: 1.02 }}
//                   />
//                 ))}
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.97 }}
//                   className="bg-teal-500 hover:bg-teal-600 text-white w-full rounded-lg py-2 font-semibold"
//                 >
//                   ➕ Create Fund
//                 </motion.button>
//               </form>
//             </motion.div>

//             {/* Add Expense */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition"
//             >
//               <h2 className="text-xl font-semibold text-purple-700 mb-4">Add Expense</h2>
//               <form onSubmit={addExpense} className="space-y-3">
//                 <select
//                   className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                   value={expense.id}
//                   onChange={e => setExpense({ ...expense, id: e.target.value })}
//                 >
//                   <option value=''>-- Select Fund --</option>
//                   {funds.map(f => <option value={f._id} key={f._id}>{f.name}</option>)}
//                 </select>
//                 {['amount', 'category', 'description'].map(fld => (
//                   <motion.input
//                     key={fld}
//                     type={fld === 'amount' ? 'number' : 'text'}
//                     placeholder={fld.charAt(0).toUpperCase() + fld.slice(1)}
//                     value={expense[fld]}
//                     onChange={e => setExpense({ ...expense, [fld]: e.target.value })}
//                     className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                     whileFocus={{ scale: 1.02 }}
//                   />
//                 ))}
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.97 }}
//                   className="bg-purple-500 hover:bg-purple-600 text-white w-full rounded-lg py-2 font-semibold"
//                 >
//                   💸 Add Expense
//                 </motion.button>
//               </form>
//             </motion.div>
//           </div>

//           {/* Right Column: Funds List */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
//           >
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">My Funds</h2>
//             <ul className="space-y-4">
// {funds.length === 0 ? (
//   <EmptyState
//     icon="💰"
//     message="No funds created yet"
//     subMessage="Start by creating a fund to manage shared expenses."
//     color="text-teal-500"
//   />
// ) : (

//                 <AnimatePresence>
//                   {funds.map((f, i) => {
//                     const percentage = (f.remainingAmount / f.totalAmount) * 100
//                     return (
//                       <motion.li
//                         key={f._id}
//                         initial={{ opacity: 0, y: 15 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ delay: i * 0.05 }}
//                         className="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition"
//                       >
//                         <div>
//                           <p className="font-bold text-gray-800">{f.name}</p>
//                           <p className="text-sm text-gray-500">
//                             Total: ₹<CountUp end={f.totalAmount} duration={0.8} />
//                           </p>
//                         </div>
//                         <div className="text-right w-36">
//                           <p className={`font-bold ${f.remainingAmount > 0 ? 'text-green-600' : 'text-red-500'}`}>
//                             ₹<CountUp end={f.remainingAmount} duration={0.8} /> left
//                           </p>
//                           <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
//                             <motion.div
//                               initial={{ width: 0 }}
//                               animate={{ width: `${percentage}%` }}
//                               transition={{ duration: 0.6 }}
//                               className={`h-2 rounded-full ${f.remainingAmount > 0 ? 'bg-green-500' : 'bg-red-500'}`}
//                             />
//                           </div>
//                         </div>
//                       </motion.li>
//                     )
//                   })}
//                 </AnimatePresence>
//               )}
//             </ul>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }




import React, { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import EmptyState from '../components/EmptyState.jsx'
import Toast from '../components/Toast.jsx'

export default function SharedFunds() {
  const { token, setSources } = useAuth()
  const [funds, setFunds] = useState([])
  const [form, setForm] = useState({ name: '', totalAmount: 0, contributorEmails: '' })
  const [expense, setExpense] = useState({ id: '', amount: 0, category: '', description: '' })
  const [toast, setToast] = useState("")

  const load = async () => {
    setFunds(await api('/shared-funds', { token }))
  }
  useEffect(() => { load() }, [])

  const createFund = async (e) => {
    e.preventDefault()
    try {
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
    } catch (err) {
      if (err?.error === 'User(s) not found' && err.notFound) {
        setToast(`User(s) not found: ${err.notFound.join(', ')}`)
      } else {
        setToast("Error creating fund")
      }
    }
  }

  const addExpense = async (e) => {
    e.preventDefault()
    await api(`/shared-funds/${expense.id}/expenses`, {
      method: 'POST', token,
      body: {
        amount: Number(expense.amount),
        category: expense.category,
        description: expense.description
      }
    })
    setExpense({ id: '', amount: 0, category: '', description: '' })
    load()
    // Also reload global sources so Dashboard updates instantly
    const updatedSources = await api('/sources', { token })
    setSources(updatedSources)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* heading */}
        <motion.h1 className="text-4xl font-extrabold mb-8">💰 Shared Funds Tracker</motion.h1>
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Create Fund */}
          <motion.div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl mb-4 text-teal-700">Create New Fund</h2>
            <form onSubmit={createFund} className="space-y-3">
              <input className="border rounded px-3 py-2 w-full" placeholder="Fund Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Total Amount" type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Contributor emails" value={form.contributorEmails} onChange={e => setForm({ ...form, contributorEmails: e.target.value })} />
              <button className="bg-teal-500 text-white py-2 w-full rounded">➕ Create Fund</button>
            </form>
          </motion.div>

          {/* Add Expense */}
          <motion.div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl mb-4 text-purple-700">Add Expense</h2>
            <form onSubmit={addExpense} className="space-y-3">
              <select className="border rounded px-3 py-2 w-full" value={expense.id} onChange={e => setExpense({ ...expense, id: e.target.value })}>
                <option>-- Select Fund --</option>
                {funds.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
              <input className="border rounded px-3 py-2 w-full" placeholder="Amount" type="number" value={expense.amount} onChange={e => setExpense({ ...expense, amount: e.target.value })} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Category" value={expense.category} onChange={e => setExpense({ ...expense, category: e.target.value })} />
              <input className="border rounded px-3 py-2 w-full" placeholder="Description" value={expense.description} onChange={e => setExpense({ ...expense, description: e.target.value })} />
              <button className="bg-purple-500 text-white py-2 w-full rounded">💸 Add Expense</button>
            </form>
          </motion.div>

          {/* My Funds */}
          <motion.div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-xl mb-4">My Funds</h2>
            {funds.length === 0 ? (
              <EmptyState icon="💰" message="No funds created" subMessage="Start by creating a fund." color="text-teal-500" />
            ) : (
              <AnimatePresence>
                {funds.map((f, i) => {
                  const percent = (f.remainingAmount / f.totalAmount) * 100
                  return (
                    <motion.div key={f._id} className="flex justify-between p-4 mb-3 border rounded-lg">
                      <div>
                        <p>{f.name}</p>
                        <p>Total: ₹<CountUp end={f.totalAmount} duration={0.8} /></p>
                      </div>
                      <div className="text-right">
                        <p>₹<CountUp end={f.remainingAmount} duration={0.8} /> left</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                          <motion.div className={f.remainingAmount > 0 ? 'bg-green-500 h-2 rounded-full' : 'bg-red-500 h-2 rounded-full'}
                            initial={{ width: 0 }} animate={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  )
}

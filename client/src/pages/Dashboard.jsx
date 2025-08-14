// import React, { useEffect, useState } from 'react'
// import { api } from '../api.js'
// import { useAuth } from '../context/AuthContext.jsx'
// import { motion, AnimatePresence } from 'framer-motion'
// import CountUp from 'react-countup'
// import EmptyState from '../components/EmptyState.jsx'
// import Toast from '../components/Toast.jsx'

// export default function Dashboard() {
//   const { token } = useAuth()
//   const [sources, setSources] = useState([])
//   const [tx, setTx] = useState([])
//   const [form, setForm] = useState({ name: '', initialBalance: 0 })
//   const [newTx, setNewTx] = useState({ sourceId: '', type: 'expense', amount: 0, category: '', description: '' })
//   const [toast, setToast] = useState("")

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

//   const createFund = async (e) => {
//     e.preventDefault()
//     try {
//       await api('/shared-funds', {
//         method: 'POST', token,
//         body: {
//           name: form.name,
//           totalAmount: Number(form.totalAmount),
//           contributorEmails: form.contributorEmails.split(',').map(s => s.trim()).filter(Boolean)
//         }
//       })
//       setForm({ name: '', totalAmount: 0, contributorEmails: '' })
//       load()
//     } catch (err) {
//       if (err?.error === 'User(s) not found' && err.notFound) {
//         setToast(`User(s) not found: ${err.notFound.join(', ')}`)
//       } else {
//         setToast("Error creating fund")
//       }
//     }
//   }

//   const total = sources.reduce((s, x) => s + (x.balance || 0), 0)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Page Heading */}
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center gap-3"
//         >
//           📊 Dashboard
//         </motion.h1>

//         <div className="grid lg:grid-cols-2 gap-8">
          
//           {/* Sources Card */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col hover:shadow-xl transition"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-teal-700">Sources</h2>
//               <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
//                 Total: ₹<CountUp end={total} duration={1} separator="," />
//               </span>
//             </div>

//             {/* Show empty if no sources */}
//             {sources.length === 0 ? (
//               <EmptyState
//                 icon="💼"
//                 message="No sources yet"
//                 subMessage="Add a source of income or expenses to begin tracking."
//                 color="text-teal-500"
//               />
//             ) : (
//               <div className="mb-4 space-y-3">
//                 <AnimatePresence>
//                   {sources.map(s => {
//                     const percentage = Math.min(100, (s.balance / (s.initialBalance || s.balance || 1)) * 100)
//                     return (
//                       <motion.div
//                         key={s._id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0 }}
//                         className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition"
//                       >
//                         <div className="flex justify-between mb-1">
//                           <span className="font-medium text-gray-800">{s.name}</span>
//                           <span className="font-semibold text-gray-700">
//                             ₹<CountUp end={s.balance} duration={0.8} />
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: `${percentage}%` }}
//                             transition={{ duration: 0.6 }}
//                             className="h-2 bg-teal-500"
//                           />
//                         </div>
//                       </motion.div>
//                     )
//                   })}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* Add Source Form */}
//             <form onSubmit={createSource} className="space-y-3 mt-auto pt-3 border-t">
//               <b className="block text-gray-700">Add Source</b>
//               <input
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
//                 placeholder='Name (e.g., Salary)'
//                 value={form.name}
//                 onChange={e => setForm({ ...form, name: e.target.value })}
//               />
//               <input
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
//                 placeholder='Initial Balance'
//                 type='number'
//                 value={form.initialBalance}
//                 onChange={e => setForm({ ...form, initialBalance: e.target.value })}
//               />
//               <motion.button
//                 whileTap={{ scale: 0.97 }}
//                 whileHover={{ scale: 1.02 }}
//                 className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-lg py-2 font-semibold transition"
//               >
//                 ➕ Create Source
//               </motion.button>
//             </form>
//           </motion.div>

//           {/* Transactions Card */}
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition"
//           >
//             <h2 className="text-xl font-semibold text-purple-700 mb-4">Add Transaction</h2>
//             <form onSubmit={addTx} className="grid gap-3 mb-8">
//               <select
//                 className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                 value={newTx.sourceId}
//                 onChange={e => setNewTx({ ...newTx, sourceId: e.target.value })}
//               >
//                 <option value=''>-- Select Source --</option>
//                 {sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//               </select>
//               <select
//                 className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                 value={newTx.type}
//                 onChange={e => setNewTx({ ...newTx, type: e.target.value })}
//               >
//                 <option value='expense'>Expense</option>
//                 <option value='income'>Income</option>
//               </select>
//               <input
//                 className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                 placeholder='Amount'
//                 type='number'
//                 value={newTx.amount}
//                 onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
//               />
//               <input
//                 className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                 placeholder='Category'
//                 value={newTx.category}
//                 onChange={e => setNewTx({ ...newTx, category: e.target.value })}
//               />
//               <input
//                 className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                 placeholder='Description'
//                 value={newTx.description}
//                 onChange={e => setNewTx({ ...newTx, description: e.target.value })}
//               />
//               <motion.button
//                 whileTap={{ scale: 0.97 }}
//                 whileHover={{ scale: 1.02 }}
//                 className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 font-semibold"
//               >
//                 💾 Add Transaction
//               </motion.button>
//             </form>

//             {/* Recent Transactions */}
//             <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Transactions</h2>
//             {tx.length === 0 ? (
//               <EmptyState
//                 icon="📝"
//                 message="No transactions yet"
//                 subMessage="Add your first transaction to start tracking."
//                 color="text-purple-500"
//               />
//             ) : (
//               <ul className="space-y-3">
//                 <AnimatePresence>
//                   {tx.map(t => (
//                     <motion.li
//                       key={t._id}
//                       initial={{ opacity: 0, y: 15 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:shadow-md transition"
//                     >
//                       <div>
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-2 ${
//                           t.type === 'income'
//                             ? 'bg-green-100 text-green-700'
//                             : 'bg-red-100 text-red-700'
//                         }`}>
//                           {t.type}
//                         </span>
//                         <span className="font-medium text-gray-800">{t.category}</span>
//                         <span className="text-gray-500 text-sm block">
//                           {t.source ? `from ${t.source.name}` : t.sharedFund ? `on fund ${t.sharedFund.name}` : ''}
//                         </span>
//                       </div>
//                       <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
//                         ₹<CountUp end={t.amount} duration={0.8} />
//                       </span>
//                     </motion.li>
//                   ))}
//                 </AnimatePresence>
//               </ul>
//             )}
//           </motion.div>
//         </div>
//       </div>
//       <Toast message={toast} onClose={() => setToast("")} />
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

export default function Dashboard() {
  const { token, sources, setSources } = useAuth(); // ✅ global state
  const [tx, setTx] = useState([])
  const [form, setForm] = useState({ name: '', initialBalance: 0 })
  const [newTx, setNewTx] = useState({ sourceId: '', type: 'expense', amount: 0, category: '', description: '' })
  const [toast, setToast] = useState("")

  const load = async () => {
    const s = await api('/sources', { token })
    setSources(s) // ✅ update global sources
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center gap-3"
        >
          📊 Dashboard
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sources */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold text-teal-700">Sources</h2>
              <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
                Total: ₹<CountUp end={total} duration={1} separator="," />
              </span>
            </div>

            {sources.length === 0 ? (
              <EmptyState icon="💼" message="No sources yet" subMessage="Add a source to begin tracking." color="text-teal-500" />
            ) : (
              <div className="mb-4 space-y-3">
                <AnimatePresence>
                  {sources.map(s => {
                    const percentage = Math.min(100, (s.balance / (s.initialBalance || s.balance || 1)) * 100)
                    return (
                      <motion.div
                        key={s._id}
                        className="bg-gray-50 p-3 rounded-lg shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex justify-between">
                          <span>{s.name}</span>
                          <span>₹<CountUp end={s.balance} duration={0.8} /></span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                          <motion.div
                            className="h-2 bg-teal-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}

            <form onSubmit={createSource} className="space-y-3 border-t pt-3 mt-auto">
              <b>Add Source</b>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="Initial Balance" type="number" value={form.initialBalance} onChange={e => setForm({ ...form, initialBalance: e.target.value })} />
              <button className="bg-teal-500 text-white rounded-lg py-2 w-full">➕ Create</button>
            </form>
          </motion.div>

          {/* Transactions */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Add Transaction</h2>
            <form onSubmit={addTx} className="grid gap-3 mb-8">
              <select className="border rounded-lg px-3 py-2" value={newTx.sourceId} onChange={e => setNewTx({ ...newTx, sourceId: e.target.value })}>
                <option>-- Select Source --</option>
                {sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <select className="border rounded-lg px-3 py-2" value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value })}>
                <option value='expense'>Expense</option>
                <option value='income'>Income</option>
              </select>
              <input className="border rounded-lg px-3 py-2" placeholder="Amount" type="number" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="Category" value={newTx.category} onChange={e => setNewTx({ ...newTx, category: e.target.value })} />
              <input className="border rounded-lg px-3 py-2" placeholder="Description" value={newTx.description} onChange={e => setNewTx({ ...newTx, description: e.target.value })} />
              <button className="bg-purple-500 text-white rounded-lg py-2">💾 Add Transaction</button>
            </form>

            {tx.length === 0 ? (
              <EmptyState icon="📝" message="No transactions yet" subMessage="Add a transaction to see it here." color="text-purple-500" />
            ) : (
              <ul className="space-y-3">
                {tx.map(t => (
                  <li key={t._id} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                    <div>
                      <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>{t.type}</span> {t.category}
                    </div>
                    <div>₹<CountUp end={t.amount} duration={0.8} /></div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  )
}

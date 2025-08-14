import React, { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import EmptyState from '../components/EmptyState.jsx'
import { useTranslation } from 'react-i18next';


export default function Requests() {
  const { token } = useAuth()
  const [inbox, setInbox] = useState([])
  const [outbox, setOutbox] = useState([])
  const [form, setForm] = useState({ toEmail: '', amount: 0, reason: '' })
  const [err, setErr] = useState('')
  const { t } = useTranslation();

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
    const reason = prompt(t('description')) || t('description')
    await api(`/requests/${id}/reject`, { 
      method: 'PATCH', token, 
      body: { rejectionReason: reason } 
    })
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center gap-2"
        >
          📩 {t('requests')}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 max-w-lg mb-10 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-4">{t('sendRequest')}</h2>
          {err && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{err}</div>}
          <form onSubmit={send} className="space-y-3">
            <input
              type="text"
              placeholder={t('email')}
              value={form.toEmail}
              onChange={e => setForm({ ...form, toEmail: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="number"
              placeholder={t('amount')}
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              placeholder={t('description')}
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-lg py-2 font-semibold shadow"
            >
              🚀 {t('sendRequest')}
            </motion.button>
          </form>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inbox */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4 text-green-700">{t('inbox')}</h3>
            {inbox.length === 0 ? (
              <EmptyState icon="📥" message={t('inboxEmpty', { defaultValue: 'Inbox is empty' })} subMessage={t('noIncomingRequests', { defaultValue: 'You have no incoming requests.' })} color="text-green-500" />
            ) : (
              <AnimatePresence>
                <ul className="space-y-4">
                  {inbox.map((r, i) => (
                    <motion.li
                      key={r._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-800">{r.sender.name}</p>
                          <p className="text-sm text-gray-500">{r.reason}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : r.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {t(r.status)}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        ₹<CountUp end={r.amount} duration={0.8} />
                      </p>
                      {r.status === 'pending' && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => accept(r._id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-1 font-semibold"
                          >
                            ✅ {t('accept')}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => reject(r._id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-1 font-semibold"
                          >
                            ❌ {t('reject')}
                          </motion.button>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Outbox */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4 text-purple-700">{t('outbox')}</h3>
            {outbox.length === 0 ? (
              <EmptyState icon="📤" message={t('outboxEmpty', { defaultValue: 'No sent requests' })} subMessage={t('sendRequestToGetStarted', { defaultValue: 'Send a request to get started.' })} color="text-purple-500" />
            ) : (
              <AnimatePresence>
                <ul className="space-y-4">
                  {outbox.map((r, i) => (
                    <motion.li
                      key={r._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{t('email')}: {r.receiver.email}</p>
                        <p className="text-sm text-gray-500">{r.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">
                          ₹<CountUp end={r.amount} duration={0.8} />
                        </p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : r.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {t(r.status)}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

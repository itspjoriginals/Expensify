import React, { useEffect, useState } from 'react'
import AuthProvider, { useAuth } from './context/AuthContext.jsx'
import { api } from './api.js'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Requests from './pages/Requests.jsx'
import SharedFunds from './pages/SharedFunds.jsx'


function Shell() {
  const { token, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  if (!token) return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Multi-Source Expense</h2>
      <Login />
      <hr className="my-6" />
      <Register />
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 font-sans bg-gray-50 rounded-lg shadow">
      <div className="flex gap-3 items-center mb-6">
        <button onClick={() => setTab('dashboard')} className={`px-4 py-2 rounded ${tab==='dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}>Dashboard</button>
        <button onClick={() => setTab('requests')} className={`px-4 py-2 rounded ${tab==='requests' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}>Requests</button>
        <button onClick={() => setTab('funds')} className={`px-4 py-2 rounded ${tab==='funds' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}>Shared Funds</button>
        <button onClick={logout} className="ml-auto px-4 py-2 rounded bg-red-500 text-white transition">Logout</button>
      </div>
      {tab==='dashboard' && <Dashboard />}
      {tab==='requests' && <Requests />}
      {tab==='funds' && <SharedFunds />}
    </div>
  );
}

export default function App() {
  return <AuthProvider><Shell/></AuthProvider>
}

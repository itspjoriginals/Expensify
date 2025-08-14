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
  // if (!token) return (
  //   <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
  //     <h2 className="text-2xl font-bold mb-4 text-center">Multi-Source Expense</h2>
  //     <Login />
  //     <hr className="my-6" />
  //     <Register />
  //   </div>
  // );



if (!token) return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4">
    <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
      
      {/* Left side - Welcome text */}
      <div className="text-center md:text-left space-y-6">
        <h1 className="text-5xl font-extrabold text-indigo-900 drop-shadow-lg">
          Multi-Source Expense Tracker
        </h1>
        <p className="text-lg text-indigo-700 max-w-md mx-auto md:mx-0">
          Track all your expenses from multiple sources, manage shared funds, and send or receive money requests effortlessly.
        </p>
        <p className="italic text-indigo-600">
          New here? Create your account today and take control of your money!
        </p>
      </div>

      {/* Right side - Auth box */}
      <div className="bg-white/90 backdrop-blur-md border border-purple-200 shadow-2xl rounded-3xl p-8 space-y-10">
        
        {/* Login Form */}
        <Login />

        {/* Separator */}
        <div className="flex items-center gap-4">
          <hr className="border-t border-gray-300 flex-1" />
          <span className="text-gray-500">OR</span>
          <hr className="border-t border-gray-300 flex-1" />
        </div>

        {/* Register Form */}
        <Register />
      </div>
    </div>
  </div>
)


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

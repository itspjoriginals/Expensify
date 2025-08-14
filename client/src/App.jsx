import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AuthProvider, { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Requests from "./pages/Requests.jsx";
import SharedFunds from "./pages/SharedFunds.jsx";

function Shell() {
  const { token, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');

  const handleLangToggle = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  // ========================
  // LOGGED OUT VIEW
  // ========================
  if (!token) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4">
      {/* Top bar with language toggle */}
      <div className="w-full flex justify-end mb-6">
        <button
          onClick={handleLangToggle}
          className="px-4 py-2 rounded bg-yellow-400 text-black font-bold shadow"
        >
          {lang === 'en' ? 'हिन्दी' : 'English'}
        </button>
      </div>
      {/* Auth Section */}
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Welcome text */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-5xl font-extrabold text-indigo-900 drop-shadow-lg">
            {t('appTitle')}
          </h1>
          <p className="text-lg text-indigo-700 max-w-md mx-auto md:mx-0">
            {lang === 'en'
              ? 'Track all your expenses from multiple sources, manage shared funds, and send or receive money requests effortlessly.'
              : 'अपने सभी खर्चों को कई स्रोतों से ट्रैक करें, साझा फंड्स का प्रबंधन करें, और आसानी से पैसे के अनुरोध भेजें या प्राप्त करें।'}
          </p>
          <p className="italic text-indigo-600">
            {lang === 'en'
              ? 'New here? Create your account today and take control of your money!'
              : 'नए हैं? आज ही अपना खाता बनाएं और अपने पैसों पर नियंत्रण पाएं!'}
          </p>
        </div>
        {/* Right side - Auth box */}
        <div className="bg-white/90 backdrop-blur-md border border-purple-200 shadow-2xl rounded-3xl p-8 space-y-10">
          <Login />
          <div className="flex items-center gap-4">
            <hr className="border-t border-gray-300 flex-1" />
            <span className="text-gray-500">{lang === 'en' ? 'OR' : 'या'}</span>
            <hr className="border-t border-gray-300 flex-1" />
          </div>
          <Register />
        </div>
      </div>
    </div>
  );

  // ========================
  // LOGGED IN VIEW
  // ========================
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 font-sans bg-gray-50 rounded-lg shadow">
      {/* Controls row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        {/* Tabs */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setTab('dashboard')}
            className={`px-4 py-2 rounded ${tab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
          >
            {t('dashboard')}
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`px-4 py-2 rounded ${tab === 'requests' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
          >
            {t('requests')}
          </button>
          <button
            onClick={() => setTab('funds')}
            className={`px-4 py-2 rounded ${tab === 'funds' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
          >
            {t('sharedFunds')}
          </button>
        </div>
        {/* Actions (Lang + Logout) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLangToggle}
            className="px-4 py-2 rounded bg-yellow-400 text-black font-bold shadow"
          >
            {lang === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded bg-red-500 text-white transition"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {tab === 'dashboard' && <Dashboard />}
      {tab === 'requests' && <Requests />}
      {tab === 'funds' && <SharedFunds />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}

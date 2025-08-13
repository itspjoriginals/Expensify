import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  const login = (tok, usr) => {
    setToken(tok); setUser(usr)
    localStorage.setItem('token', tok)
    localStorage.setItem('user', JSON.stringify(usr))
  }
  const logout = () => {
    setToken(null); setUser(null)
    localStorage.removeItem('token'); localStorage.removeItem('user')
  }

  return <AuthCtx.Provider value={{ token, user, login, logout }}>{children}</AuthCtx.Provider>
}

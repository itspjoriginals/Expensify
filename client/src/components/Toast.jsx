import React from 'react'

export default function Toast({ message, color = 'bg-red-500', onClose }) {
  if (!message) return null
  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow text-white ${color}`}>
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose}>×</button>
    </div>
  )
}

// components/EmptyState.jsx
import { motion } from 'framer-motion'

export default function EmptyState({ icon, message, subMessage, color = 'text-gray-500' }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`text-5xl ${color} mb-4`}
      >
        {icon}
      </motion.div>
      <p className="text-lg font-semibold text-gray-700">{message}</p>
      {subMessage && (
        <p className="text-sm text-gray-500 mt-1">{subMessage}</p>
      )}
    </motion.div>
  )
}

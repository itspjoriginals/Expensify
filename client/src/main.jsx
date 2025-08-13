import React from 'react';
import { createRoot } from 'react-dom/client'; // <-- Correct import
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

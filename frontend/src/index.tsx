import 'core-js/features/array/flat-map';
import 'core-js/features/map';
import 'core-js/features/promise';
import 'core-js/features/set';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const domContainer = document.getElementById('app-root') as HTMLDivElement;
const root = createRoot(domContainer);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

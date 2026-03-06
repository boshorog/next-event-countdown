import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const isEmbedded = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

// When rendered inside a WordPress iframe, ensure the document background is transparent.
if (typeof window !== 'undefined' && isEmbedded()) {
  document.documentElement.classList.add('nxevtcd-embedded');
}

// Look for WordPress root element first, then fallback to default
const rootElement =
  document.getElementById("nxevtcd-root") ||
  document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
}

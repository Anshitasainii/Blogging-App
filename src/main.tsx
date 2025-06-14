import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';


<FontAwesomeIcon icon={faCoffee} />


createRoot(document.getElementById("root")!).render(<App />);

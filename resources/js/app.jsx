import './bootstrap';

import { createRoot } from 'react-dom/client';
import App from "./src/App.jsx";
// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<App/>, root);

     

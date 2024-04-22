import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import ThemeContextProvider from './store/ThemeContextProvider';  // is used to wrap App because of React caveat

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeContextProvider>  
      <App />
    </ThemeContextProvider>
  </React.StrictMode>
);

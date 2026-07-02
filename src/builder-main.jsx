import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const Redirect = () => {
  useEffect(() => {
    window.location.href = '/#estimator';
  }, []);
  
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#050508",
      color: "var(--accent-color)",
      fontSize: "1.1rem",
      fontFamily: "var(--font-display)",
      letterSpacing: "0.05em",
      textTransform: "uppercase"
    }}>
      Redirecting to Project Planner...
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Redirect />
  </React.StrictMode>
)

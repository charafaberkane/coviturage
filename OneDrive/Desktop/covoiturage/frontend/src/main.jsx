import { Global, css, ThemeProvider } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { lightTheme, darkTheme } from './theme';

function Root() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={{ ...theme, toggleDark, isDark }}>
      <Global
        styles={css`
          body {
            background: ${theme.colors.background};
            color: ${theme.colors.text};
            transition: background 0.3s ease, color 0.3s ease;
          }
        `}
      />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

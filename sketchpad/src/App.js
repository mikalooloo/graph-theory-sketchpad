import './App.css';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './components/aesthetic/theme';

export default function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </div>
  );
}

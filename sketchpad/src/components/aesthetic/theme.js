import React, { createContext } from 'react';
import useLocalStorage from '../../apis/useLocalStorage';

export const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  return <ThemeContext.Provider value={{ theme, setTheme }}>{props.children}</ThemeContext.Provider>
}
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#fff',
      main: '#ed873f',
      dark: '#b4805c',
      contrastText: '#545454',
    },
    secondary: {
      light: '#ff7961',
      main: '#5393ff',
      dark: '#ba000d',
      contrastText: '#000',
    },
    mono: {
      light: '#545454',
      main: '#fff',
      dark: '#b4805c',
      contrastText: '#fff',
    }
  },
});

ReactDOM.render(
  // <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
          <App />
      </ThemeProvider>
    </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

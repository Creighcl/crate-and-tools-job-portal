import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider
} from "@react-firebase/auth";

const theme = createMuiTheme({
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
    }
  },
});

const config = {
  apiKey: "AIzaSyBsoQXeqeUqNsFzggQYheaYFFmPdFRjPgQ",
  authDomain: "c-a-t-job-portal.firebaseapp.com",
  databaseURL: "https://c-a-t-job-portal-default-rtdb.firebaseio.com",
  projectId: "c-a-t-job-portal",
  storageBucket: "c-a-t-job-portal.appspot.com",
  messagingSenderId: "390538795524",
  appId: "1:390538795524:web:7b3fdb4112d97d4a8db351",
  measurementId: "G-VXNCVBRN5Z"
};

ReactDOM.render(
  // <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <FirebaseAuthProvider firebase={firebase} {...config}>
          <App />
        </FirebaseAuthProvider>
      </ThemeProvider>
    </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

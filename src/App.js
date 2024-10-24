import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { initializeApp } from 'firebase/app';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from './app-context';
import AuthenticatedRoot from './app/pathing/authed-root';
import AppBar from './app/app-bar';
import SignInBox from './app/sign-in';
import WaitWindow from './app/wait-window';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    display: 'flex',
    flexGrow: 1,
    marginTop: 80
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

let firebaseApp;

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

const App = () => {
  const [accessLevel, setAccessLevel] = useState(-2);
  const classes = useStyles();

  function registerUserAccessLevel(user) {
    if (user === null) { 
      setAccessLevel(0);
      return; 
    }

    get(ref(getDatabase(), `/users/${user.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setAccessLevel(snapshot.val());
        } else {
          setAccessLevel(0);
        }
      });
  }

  useEffect(() => {
    firebaseApp = initializeApp(config);

    onAuthStateChanged(getAuth(), (user) => { registerUserAccessLevel(user); });
// need to unsubscribe too 
  }, []);

  const appContextValue = {
    accessLevel,
    setAccessLevel
  };

  return (
    <div className={classes.rootContainer}>
        <AppContext.Provider value={ appContextValue }>
            { firebaseApp && getAuth().currentUser && (
              <React.Fragment>
                <AppBar />
                
                <main className={classes.content}>
                  <AuthenticatedRoot />
                </main>
              </React.Fragment>
            )}
            { (!firebaseApp || !getAuth().currentUser) && (<SignInBox />) }
      </AppContext.Provider>
    </div>);
};

export default App;

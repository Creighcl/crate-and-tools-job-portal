import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase/app";
import "firebase/auth";
import {
  IfFirebaseAuthed,
  IfFirebaseUnAuthed
} from "@react-firebase/auth";
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

const App = () => {
  const [accessLevel, setAccessLevel] = useState(-2);
  const [hasInited, setHasInited] = useState(false);
  const classes = useStyles();
  const { currentUser } = firebase.auth();

  function getMyAccessLevel() {
    if (firebase.auth().currentUser !== null && accessLevel === -2) {
      const authLevelLookupRef = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`);
      authLevelLookupRef.onDisconnect().cancel();
      authLevelLookupRef.on('value', (snapshot) => {
        setHasInited(true);
        if (snapshot.exists()) {
          setAccessLevel(snapshot.val());
        }
      });
    }
  }

  useEffect(() => {
    getMyAccessLevel();
  }, [currentUser]);


  useEffect(() => {
    setTimeout(() => {
      if (!hasInited) {
        setHasInited(true);
      }
    }, 2000);
  }, []);

  const appContextValue = {
    accessLevel,
    setAccessLevel
  };

  return (
    <div className={classes.rootContainer}>
      { hasInited ? (
        <AppContext.Provider value={ appContextValue }>
          <IfFirebaseAuthed>
              { () => (
                <React.Fragment>
                  <AppBar />
                  <main className={classes.content}>
                    <AuthenticatedRoot />
                  </main>
                </React.Fragment>
              )}
          </IfFirebaseAuthed>
          <IfFirebaseUnAuthed>
              { () => {
                return (<SignInBox />)
              }}
          </IfFirebaseUnAuthed>
        </AppContext.Provider>
      ) : (<WaitWindow />)
      }
    </div>);
};

export default App;

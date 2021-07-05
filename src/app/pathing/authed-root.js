import React, { useContext } from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {
    Switch,
    Route
  } from "react-router-dom";
import {
    IfFirebaseAuthed
} from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import Typography from '@material-ui/core/Typography';
import FirebaseCrud from '../../firebase-crud';
import AppContext from '../../app-context';

const AuthenticatedRoot = () => {
    const { accessLevel } = useContext(AppContext);
  
    if (accessLevel === 0) return (<div>Your access level is 0, an administrator will assign you</div>);

    if (accessLevel === -1) return (<div>ACCOUNT DISABLED</div>);

    if (accessLevel === -2) {
      return (<div>LOADING...</div>);
    }

    if (!accessLevel) return (<div>UNASSIGNED, make a button. When the user clicks it, allow them to set their own access level to '0'</div>);

    return accessLevel > 0 && (<IfFirebaseAuthed>
        {
          () => (
            <Switch>
            <Route path="/accounts">
              <FirebaseCrud definition="ACCOUNTS" />
            </Route>
            <Route path="/places">
              <FirebaseCrud definition="PLACES" />
            </Route>
            <Route path="/billables">
              <FirebaseCrud definition="BILLABLEITEMS" />
            </Route>
            <Route path="/">
              <Breadcrumbs aria-label="breadcrumb" style={ { margin: 24 } }>
                <Typography variant="body1">
                    Portal Home
                </Typography>
              </Breadcrumbs>
            </Route>
          </Switch>
          )
        }
      </IfFirebaseAuthed>);
};

export default AuthenticatedRoot;

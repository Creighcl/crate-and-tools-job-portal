import React, { useContext } from 'react';
import {
    Switch,
    Route
  } from "react-router-dom";
import {
    IfFirebaseAuthed
} from "@react-firebase/auth";
import "firebase/auth";
import FirebaseCrud from '../../firebase-crud';
import AppContext from '../../app-context';
import ActivateAccountBox from '../activate-account';
import StarterComponent from '../starter-component';

const AuthenticatedRoot = () => {
    const { accessLevel } = useContext(AppContext);
  
    
    if (accessLevel === -1) return (<div>ACCOUNT DISABLED</div>);
    
    if (accessLevel === -2) {
      return (<div>LOADING...</div>);
    }
    
    if (accessLevel === 0) {
        return (<IfFirebaseAuthed>
            {
              () => (
                <Switch>
                <Route path="/accounts">
                  <FirebaseCrud definition="ACCOUNTS" />
                </Route>
                <Route path="/">
                    <ActivateAccountBox />
                </Route>
              </Switch>
              )
            }
        </IfFirebaseAuthed>);      
    }

    return accessLevel > 0 && (<IfFirebaseAuthed>
        {
          () => (
            <Switch>
            {/* <Route path="/accounts">
              <FirebaseCrud definition="ACCOUNTS" />
            </Route>
            <Route path="/places">
              <FirebaseCrud definition="PLACES" />
            </Route>
            <Route path="/billables">
              <FirebaseCrud definition="BILLABLEITEMS" />
            </Route> */}
            <Route path="/">
              <StarterComponent />
            </Route>
          </Switch>
          )
        }
      </IfFirebaseAuthed>);
};

export default AuthenticatedRoot;

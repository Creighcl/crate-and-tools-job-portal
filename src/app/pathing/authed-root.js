import React, { useContext } from 'react';
import {
    Switch,
    Route
  } from "react-router-dom";
import CrudDefs from '../../firebase-crud/crud-defs';
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
        return (
          <Switch>
          <Route path="/accounts">
            <FirebaseCrud definition="ACCOUNTS" />
          </Route>
          <Route path="/">
              <ActivateAccountBox />
          </Route>
        </Switch>
        );
    }

    return accessLevel > 0 && (<Switch>
      {
        Object.keys(CrudDefs).map((key) => (
          <Route key={key} path={`/${key.toLowerCase()}`}>
            <FirebaseCrud definition={key} />
          </Route>
        ))
      }
      <Route path="/">
        <StarterComponent />
      </Route>
    </Switch>);
};

export default AuthenticatedRoot;

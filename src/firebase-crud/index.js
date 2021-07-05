import React, { useState, useContext } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {
    Switch,
    Link,
    Route,
    useRouteMatch,
    useHistory
} from 'react-router-dom';
import EditItem from './edit-item';
import CrudList from './list';
import CrudContext from './crud-context';
import ModelTypes from './model-types';
import crudDefinitions from './crud-defs';
import uuid from 'short-uuid';
import AppContext from '../app-context';

const FirebaseCrud = ({ definition }) => {
    const hx = useHistory();
    const { accessLevel } = useContext(AppContext);
    let match = useRouteMatch();

    const [entityState, setXEntityState] = useState({});
    const [formState, setXFormState] = useState({});
    const [crumbs, setCrumbs] = useState([]);

    const providerValue = {
        ...{ fields: [], storageKey: '', crumbs: [] },
        ...crudDefinitions[definition],
        entityState,
        setEntityState,
        setCrumbs,
        formState,
        setFormState,
        hardSetFormState,
        hardSetEntityState
    };
    
    function startNewItem() {
        const { modelType } = providerValue;
        const newid = uuid.generate();
        let newUrl = `${match.url}/${newid}`;
        if (modelType === ModelTypes.USEROWNEDLIST && accessLevel === 1) {
            const { uid } = firebase.auth().currentUser;
            newUrl = `${match.url}/${uid}%2F${newid}`
        }
        hx.push(newUrl);
    }

    function setEntityState(newState) {
        setXEntityState({
            ...entityState,
            ...newState
        });
    }

    function hardSetEntityState(newState) {
        setXEntityState(newState);
    }

    function setFormState(newState) {
        setXFormState({
            ...formState,
            ...newState
        });
    }

    function hardSetFormState(newState) {
        setXFormState(newState);
    }

    const { modelType } = crudDefinitions[definition];

    const canAddItems = modelType === ModelTypes.USEROWNEDLIST || ModelTypes.ENUM;

    const skipList = accessLevel < 2 && modelType === ModelTypes.SOLO;

    return (
        <CrudContext.Provider value={ providerValue }>
            <Breadcrumbs aria-label="breadcrumb" style={ { margin: 24 } }>
                <Link color="inherit" to="/">
                    <Typography variant="body1">
                        Portal Home
                    </Typography>
                </Link>
                {
                    crumbs.map((o) => 
                    o.url ? 
                        (<Link key={o.url} to={o.url}>{o.label}</Link>)
                        : (<span key={ o.url }>{o.label}</span>)
                    )
                }
            </Breadcrumbs>
            <div style={ { margin: 24 } }>
                <Switch>
                    <Route path={`${match.path}/:cruddyid`}>
                        <EditItem /> 
                    </Route>
                    <Route path={`${match.path}`}>
                        {
                            skipList ?
                                <EditItem /> : <CrudList />
                        }
                    </Route>
                </Switch>
            </div>
            {
                canAddItems && (<Fab color="primary" style={ { position: 'fixed', right: 75, bottom: 75 } }>
                <AddIcon onClick={ startNewItem } />
            </Fab>)
            }
        </CrudContext.Provider>
    );
};

export default FirebaseCrud;

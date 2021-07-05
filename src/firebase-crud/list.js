import React, {
    useEffect,
    useState,
    useContext
} from 'react';
import {
    Link,
    useRouteMatch
} from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import CrudContext from './crud-context';
import AppContext from '../app-context';
import ModelTypes from './model-types';

const List = () => {
    let match = useRouteMatch();
    const [userHasAccess, setUserHasAccess] = useState(true);
    const [listState, setListState] = useState([]);
    const {
        storageKey,
        setCrumbs,
        listAccessors,
        crudLabel,
        modelType
    } = useContext(CrudContext);
    const {
        accessLevel
    } = useContext(AppContext);

    
    let dbRef = `/${storageKey}`;
    let snapshotReducer = (snapshot) => { // client userownedlist reducer
        const payload = snapshot.val();
        if (payload === null) return {};

        return Object.keys(payload).reduce((acc, cur) => ({
            ...acc,
            [cur]: {
                ...payload[cur],
                account: uid
            }
        }), {});
    };
    
    if (modelType === ModelTypes.SOLO) { // solo reducer
        snapshotReducer = (snapshot) => snapshot.val() || {};
    }

    let editLinkFn = (id) => `${match.path}/${id}`;
    const { uid } = firebase.auth().currentUser;
    const mayAccessTopLevelList = accessLevel >= 2;
    
    if (mayAccessTopLevelList && modelType === ModelTypes.USEROWNEDLIST) {
        snapshotReducer = (snapshot) => { // employee userownedlist reducer
            const payload = snapshot.val();
            if (payload === null) return {};
            return Object.keys(payload).reduce((acc, cur) => ({
                ...acc,
                ...Object.keys(payload[cur]).map((subkey) => ({
                    [`${cur}%2F${subkey}`]: {
                        ...payload[cur][subkey],
                        account: cur
                    }
                })).reduce((acc, cur) => ({
                    ...acc,
                    ...cur
                }), {})
            }), {});
        };
    }

    if (!mayAccessTopLevelList) {
        dbRef = `/${storageKey}/${uid}`;
        editLinkFn = (id) => `${match.path}/${uid}%2F${id}`;
    }

    useEffect(() => {
        setCrumbs([{ url: '', label: `${crudLabel}s` }])
        let newRef = firebase.database().ref(dbRef);
        newRef.onDisconnect().cancel();
        newRef.on('child_changed', (snapshot) => {
           setListState(snapshotReducer(snapshot));
           // toast external change
        });
        newRef.once('value')
            .then((snapshot) => {
                setUserHasAccess(true);
                setListState(snapshotReducer(snapshot));
            })
            .catch((e) => {
                console.log(e);
                setUserHasAccess(false);
            });
        return () => newRef.off();
    }, [storageKey, crudLabel, setCrumbs, accessLevel]);

    if (!userHasAccess) return (<div>NO ACCESS</div>);

    return (<div>
        <Typography variant="h5">
            All {crudLabel}s
        </Typography>
        <Card>
            <CardContent>
                <Table aria-label={`${crudLabel}s`}>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {
                                listAccessors.map((listAccessor) => (
                                    <TableCell style={ { textTransform: 'capitalize' } } key={ listAccessor } align="right">{ listAccessor }</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {Object.keys(listState).map((k) => (
                        <TableRow key={k}>
                            <TableCell>
                                <Link to={ editLinkFn(k) }>
                                    <EditIcon />
                                </Link>
                            </TableCell>
                            {
                                listAccessors.map((listAccessor) => (
                                    <TableCell key={ listAccessor } align="right">{listState[k][listAccessor]}</TableCell>
                                ))
                            }
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>)
};

export default List;

import React, {
    useEffect,
    useState,
    useContext
} from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import {
    useParams,
    useHistory,
    useRouteMatch
} from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, set, onChildChanged } from 'firebase/database';
import CrudContext from './crud-context';
import FormField from './form-field';
import ModelTypes from './model-types';
import AppContext from '../app-context';

const shallowEqual = (objA, objB) => {
    if (!objA || !objB) {
      return objA === objB
    }
    return !Boolean(
      Object
        .keys(Object.assign({}, objA, objB))
        .find((key) => objA[key] !== objB[key])
    )
};

const NewItemQualifierSelection = () => {
    const hx = useHistory();
    const { params: { routeGroup, recId } } = useRouteMatch('/:routeGroup/:recId');
    const {
        formState: { qualifier }
    } = useContext(CrudContext);

    const okToSubmit = qualifier;
    function continueWithSelection() {
      hx.push(`/${routeGroup}/${qualifier}%2F${recId}`);
    }
    return (<div>
        <FormField
            name="qualifier"
        />
        <Button disabled={ !okToSubmit } onClick={continueWithSelection} color="primary">
            Continue
        </Button>
    </div>);
}

const EditItem = () => {
    const hx = useHistory();
    const { uid } = getAuth().currentUser;
    const match = useRouteMatch('/:routeGroup');
    const [open, setOpen] = useState(false);
    let { cruddyid } = useParams();
    const pseudoLinked = !cruddyid;
    if (pseudoLinked) cruddyid = uid;

    const cruddyIdForUri = cruddyid.replace('%2F', '/');
    const [userHasAccess, setUserHasAccess] = useState(true);
    const {
        formState,
        entityState,
        hardSetEntityState,
        hardSetFormState,
        storageKey,
        setCrumbs,
        crudLabel,
        modelType
    } = useContext(CrudContext);
    const {
        accessLevel
    } = useContext(AppContext);
    const idIsQualified = modelType !== ModelTypes.USEROWNEDLIST || cruddyid.indexOf('%2F') > -1;

    const [fbRef, setFbRef] = useState();

    function goBack() {
        hx.push(match.url);
    }

    function handleClose() {
        setOpen(false);
    }

    function openModal() {
        setOpen(true);
    }

    function deleteItem() {
        handleClose();
        set(
            ref(getDatabase(), fbRef),
            null
        ).then(() => {
            goBack();
        });
        // toast the delete
    }

    useEffect(() => {
        const importNewItemInfo = (info) => {
            hardSetFormState(info);
            hardSetEntityState(info);
        };
        setCrumbs([{ url: match.url, label: `${crudLabel}s` }, { url: '', label: 'This Item' }]);
        
        onChildChanged(
            ref(getDatabase(), `/${storageKey}/${cruddyIdForUri}`),
            (snapshot) => {
                console.log('something changed externally');
            }
        )
        const newRef = `/${storageKey}/${cruddyIdForUri}`;
        get(ref(getDatabase(), newRef)).then((snapshot) => {
            setUserHasAccess(true);
            importNewItemInfo(snapshot.val() || {});
        }).catch(() => {
            setUserHasAccess(false);
        });
        setFbRef(newRef);
        // const refPath = `/${storageKey}/${cruddyIdForUri}`;
        // let newRef = firebase.database().ref(refPath);
        // newRef.onDisconnect().cancel();
        // newRef.on('child_changed', (snapshot) => {
        //    console.log('something changed externally');
        //    // toast external change
        // });
        // newRef.once('value')
        //     .then((snapshot) => { setUserHasAccess(true); importNewItemInfo(snapshot.val() || {}); })
        //     .catch(() => { setUserHasAccess(false); });
        // return () => newRef.off();
    }, [storageKey, cruddyid, accessLevel, uid]); // eslint-disable-line

    function resetForm() {
        hardSetFormState(entityState);
    }

    function onSuccessfulSave() {
        // toast a success
        hardSetEntityState(formState);
        hx.push(match.url);
    }

    function onFailedSave(firebaseResponse) {
        // pluck the error message
        // toast the failure
    }

    function onSaveResponse(resp) {
        if (resp === undefined) {
            onSuccessfulSave();
        } else {
            onFailedSave(resp);
        }
    }

    function saveItem() {
        set(ref(getDatabase(), fbRef), formState)
            .then(onSaveResponse);
    }

    if (!userHasAccess) {
        return (<div>You are not authorized to access this item</div>);
    }

    if (!entityState || entityState == {}){
        return (<div>LOADING</div>);
    }

    if (!idIsQualified) {
        return (<NewItemQualifierSelection />);
    }

    const isSavable = !shallowEqual(formState, entityState);

    return (<CrudContext.Consumer>{ (props) => {
        const { fields = [], crudLabel = 'Item', labelAccessor } = props;

        return (
            <div>
                { !pseudoLinked && (<Button onClick={goBack} color="secondary">Back to List</Button>) }
                <Card>
                    <CardContent>
                        <Typography variant="h5">{formState[labelAccessor] || 'unlabeled'}</Typography>
                        <Typography variant="subtitle1">{ crudLabel }</Typography>
                        <div style={ { padding: 12, width: 400, margin: 'auto', display: 'flex', flexDirection: 'column' } }>
                            { Object.keys(fields).filter(o => o !== 'qualifier').map((fieldName) => (
                                <div key={ fieldName } style={ { width: 400, marginBottom: 12 } }>
                                    <FormField
                                        name={ fieldName }
                                    />
                                </div>
                            )) }
                        </div>
                        <CardActions style={{ width: '100%', textAlign: 'right' }}>
                            <IconButton
                                aria-label="Remove Item"
                                style={ { marginRight: 'auto' } }
                                onClick={ openModal }
                            >
                                <DeleteIcon />
                            </IconButton>
                            <Button disabled={ !isSavable } onClick={ resetForm } size="small" color="secondary">
                                Discard Changes
                            </Button>
                            <Button disabled={ !isSavable } onClick={ saveItem } size="small" color="secondary">
                                Save
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete this item?"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Permanently remove this item from the database. This operation cannot be cancelled or undone.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={deleteItem} variant="outlined" color="primary" autoFocus>
                        DELETE
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    } }</CrudContext.Consumer>);
};

export default EditItem;

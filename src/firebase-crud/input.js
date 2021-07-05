import React, { useContext, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { MenuItem } from '@material-ui/core';
import firebase from "firebase/app";
import "firebase/database";
import CrudContext from './crud-context';
import AppContext from '../app-context';

export const ILookup = ({ fieldInfo }) => {
    const [hasAccess, setHasAccess] = useState(true);
    const {
        setFormState,
        formState
    } = useContext(CrudContext);
    const {
        accessLevel
    } = useContext(AppContext);
    const {
        label,
        lookupKey,
        lookupItemKeyFn,
        lookupItemValueFn,
        name
    } = fieldInfo;
    const [options, setOptions] = useState([]);

    useEffect(() => {
        let newRef = firebase.database().ref(`/${lookupKey}`);
        newRef.onDisconnect().cancel();
        newRef.once('value')
            .then((snapshot) => {
                const payload = snapshot.val();
                const itemKeys = Object.keys(payload);
                const items = itemKeys.map((i) => ({
                    id: i,
                    ...payload[i]
                }));
                
                const newOptions = items.map((i) => ({
                    key: lookupItemKeyFn(i),
                    value: lookupItemValueFn(i)
                }));
                setOptions(newOptions);
                setHasAccess(true);
            })
            .catch(() => {
                setHasAccess(false);
             });
        return () => newRef.off();
    }, [lookupKey, lookupItemKeyFn, lookupItemValueFn, accessLevel]);

    function updateState({ target }) {
        setFormState({ [name]: target.value });
    }

    const hasValueAndOptionsNotLoaded = options.length === 0 && formState[name];
    const optionSet = hasValueAndOptionsNotLoaded ? [{ key: formState[name], value: formState[name] }] : options;

    if (!hasAccess) {
        return (<div>ACCESS ERROR</div>);
    }
    return (<FormControl>
        <InputLabel>{ label }</InputLabel>
        <Select
            onChange={ updateState }
            value={ formState[name] || '' }
            style={{ minWidth: 800 }}
        >
            { optionSet.map((o) => (
                <MenuItem key={ o.key } value={ o.key }>
                    { o.value }
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
};

export const Text = ({ fieldInfo }) => {
    const {
        setFormState,
        formState
    } = useContext(CrudContext);
    const {
        label,
        name
    } = fieldInfo;

    function updateState({ target }) {
        setFormState({ [name]: target.value });
    }

    return (<TextField
        label={ label }
        value={ formState[name] || '' }
        onChange={ updateState }
    />);
};

export const Textarea = ({ fieldInfo }) => {
    const {
        setFormState,
        formState
    } = useContext(CrudContext);
    const {
        label,
        name
    } = fieldInfo;

    function updateState({ target }) {
        setFormState({ [name]: target.value });
    }

    return (<TextField
        multiline
        rowsMax={4}
        label={ label }
        value={ formState[name] || '' }
        onChange={ updateState }
    />);
};

export const Number = ({ fieldInfo }) => {
    const {
        setFormState,
        formState
    } = useContext(CrudContext);
    const {
        label,
        name
    } = fieldInfo;

    function updateState({ target }) {
        setFormState({ [name]: target.value });
    }

    return (<TextField
        type="number"
        label={ label }
        value={ formState[name] || '' }
        onChange={ updateState }
    />);
};

export const SelectOne = ({ fieldInfo }) => {
    const {
        setFormState,
        formState
    } = useContext(CrudContext);
    const {
        label,
        options = [],
        name
    } = fieldInfo;

    function updateState({ target }) {
        setFormState({ [name]: target.value });
    }

    return (<FormControl>
        <InputLabel>{ label }</InputLabel>
        <Select
            onChange={ updateState }
            value={ formState[name] || '' }
            style={{ minWidth: 800 }}
        >
            { options.map((o) => (
                <MenuItem key={ o.key } value={ o.key }>
                    { o.value }
                </MenuItem>
            ))}
        </Select>
    </FormControl>);
};

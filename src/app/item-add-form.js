import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from "firebase/app";
import "firebase/auth";

const DEFAULT_FORM_STATE = {
    nm: '',
    qty: '',
    ea: ''
};

const ItemAddForm = ({ projectKey = 'unspecified project' }) => {
    const [state, setState] = useState(DEFAULT_FORM_STATE);

    function onChange({ target: { name, value } }) {
        setState((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function createNewItemForProject() {
        const { nm, qty, ea } = state;
        if (!nm || !qty || ! ea) return;

        firebase.database()
            .ref(`/open/${projectKey}/${nm}/`)
            .set({ qty, ea }, (error) => {
                if (!error) {
                  setState(DEFAULT_FORM_STATE);
                }
              });

    }
    
    return (
        <form>
            <TextField label="Item Name" variant="outlined" name="nm" value={ state.nm } onChange={ onChange } />
            <TextField type="number" label="Qty" variant="outlined" name="qty" value={ state.qty } onChange={ onChange } />
            <TextField type="number" label="Cost (ea)" variant="outlined" name="ea" value={ state.ea } onChange={ onChange } />
            <Button variant="contained" color="primary" onClick={ createNewItemForProject }>
                Add Item
            </Button>
        </form>
    );
};

export default ItemAddForm;

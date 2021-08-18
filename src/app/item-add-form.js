import React, { useEffect, useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import firebase from "firebase/app";
import "firebase/auth";
import numeral from 'numeral';

const ItemAddForm = ({ projectKey = 'unspecified project' }) => {
    const [state, setState] = useState({});

    function onChange({ target: { name, value } }) {
        setState((prev) => ({
            ...state,
            [name]: value
        }));
    }

    function createNewItemForProject() {
        const { nm, qty, ea } = state;
        if (!nm || !qty || ! ea) return;

        firebase.database().ref(`/open/${projectKey}/${nm}/`).set({ qty, ea });
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

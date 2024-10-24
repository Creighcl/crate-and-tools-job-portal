import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppContext from '../../app-context';

const MenuItem = ({ minAccessLevel = 1, url, label, icon }) => {
    const { accessLevel } = useContext(AppContext);
    return accessLevel >= minAccessLevel && (
        <Link to={ url }>
            <ListItem button>
                <ListItemIcon>{ icon }</ListItemIcon>
                <ListItemText primary={ label } />
            </ListItem>
        </Link>
    );
};

export default MenuItem;

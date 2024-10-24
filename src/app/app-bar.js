import React, { useState, useRef, useContext } from 'react';
import { makeStyles } from '@mui/styles';
import {
    Link
} from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getAuth, signOut } from 'firebase/auth';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AppContext from '../app-context';
import CrudDefs from '../firebase-crud/crud-defs';

const useStyles = makeStyles((theme) => ({
    appBar: {
        height: 80,
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#ffffff'
    },
    buttonTray: {
        margin: 'auto 0'
    },
    buttonStyle: {
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3),
        color: '#545454',
        textDecoration: 'none',
        '&:hover': {
            color: '#ed873f'
        },
      },
  }));

const TopAppBar = () => {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(false);
    const iconRef = useRef(null);
    const { accessLevel } = useContext(AppContext);

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    async function googleSignout() {
        await signOut(getAuth());
        setMenuOpen(false);
    }

    const handleClose = () => {
        setMenuOpen(false)
    };

    const { displayName, photoURL } = getAuth().currentUser;

    if (!getAuth().currentUser) return null;

    return (<AppBar color="mono" className={classes.appBar} position="fixed">
    <Toolbar style={ { maxWidth: 1600, width: '100%', margin: '0 auto', padding: 0 } }>
        <div style={ { padding: '0 6px', display: 'flex', width: '100%' } }>
            <Link to="/">
                <img style={ { height: 70, width: 204, marginTop: 6 } } src="/logo2.png" />
            </Link>
            {
                accessLevel >= 4 && (
                    <div className={classes.buttonTray}>
                        {
                            Object.keys(CrudDefs).map((key) => (
                                <Link key={key} className={classes.buttonStyle} to={`/${key.toLowerCase()}`}>
                                    {CrudDefs[key].crudLabel}
                                </Link>
                            ))
                        }
                    </div>
                )
            }
            <IconButton style={ { marginLeft: 'auto' } } onClick={toggleMenu} ref={iconRef}><Avatar alt={displayName} src={photoURL} /></IconButton>
            <Menu
                id="lock-menu"
                anchorEl={iconRef.current}
                keepMounted
                open={menuOpen}
                onClose={handleClose}
            >
                <div style={{ fontSize: 11, padding: 4 }}>
                Logged in as
                <div style={{ fontWeight: 'bold', borderBottom: '2px solid #545454', marginBottom: 12, paddingBottom: 12 }}>
                    {displayName}
                </div>
                </div>
                <MenuItem
                key="abc"
                onClick={googleSignout}
                >
                Logout
                </MenuItem>
            </Menu>
        </div>
    </Toolbar>
  </AppBar>);
};

export default TopAppBar;

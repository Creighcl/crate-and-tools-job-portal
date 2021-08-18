import React, { useState, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    FirebaseAuthConsumer,
    IfFirebaseAuthed
  } from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
  import {
    Link
  } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AppContext from '../app-context';

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
        await firebase.auth().signOut();
        setMenuOpen(false);
    }

    const handleClose = () => {
        setMenuOpen(false)
    };

    return (<AppBar className={classes.appBar} position="fixed">
    <Toolbar style={ { maxWidth: 1600, width: '100%', margin: '0 auto', padding: 0 } }>
        <div style={ { padding: '0 6px', display: 'flex', width: '100%' } }>
            <Link to="/">
                <img style={ { height: 70, width: 204, marginTop: 6 } } src="/logo2.png" />
            </Link>
            <IfFirebaseAuthed>
                { () => (
                <FirebaseAuthConsumer>
                    {({ user: { photoURL, displayName } }) => {
                    return (
                        <React.Fragment>
                            {
                                accessLevel > 99 && (
                                    <div className={classes.buttonTray}>
                                        <Link className={classes.buttonStyle} to="/accounts">
                                            Accounts
                                        </Link>
                                        <Link className={classes.buttonStyle} to="/places">
                                            Places
                                        </Link>
                                        <Link className={classes.buttonStyle} to="/billables">
                                            Billables
                                        </Link>
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
                        </React.Fragment>
                    );
                    }}
                </FirebaseAuthConsumer>
                )}
            </IfFirebaseAuthed>
        </div>
    </Toolbar>
  </AppBar>);
};

export default TopAppBar;

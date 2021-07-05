import React from 'react';
import Button from '@material-ui/core/Button';
import GoogleIcon from '@material-ui/icons/Google';
import firebase from "firebase/app";
import "firebase/auth";

const SignIn = () => {
    async function googleSignin() {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(googleAuthProvider);
    }

    return (<div style={ { width: 300, padding: 36, margin: '0 auto' } }>
        <img src="/front.png" />
        <Button
            color="primary"
            variant="outlined"
            onClick={googleSignin}
            startIcon={<GoogleIcon color="inherit" />}
            style={ { width: '100%' } }
        >
            Login with Google
        </Button>
    </div>);
};

export default SignIn;

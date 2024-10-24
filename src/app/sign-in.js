import React from 'react';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';

const SignIn = () => {
    async function googleSignin() {
        // const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        await signInWithPopup(getAuth(), new GoogleAuthProvider());
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

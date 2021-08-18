import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const ActivateAccount = () => {

    return (<div style={ { marginTop: 24 } }>
        <div style={ { padding: 32, margin: 'auto', display: 'flex', width: '50vw', maxWidth: 1200, justifyContent: 'space-between', flexWrap: 'wrap' } }>
            <div style={ { flexGrow: 1, textAlign: 'center' } }>
                <img src="/toolbox.png" style={ { width: 'auto' } } />
            </div>
            <div style={ { width: 400, maxWidth: '100%', flexGrow: 1 } }>
                <Typography variant="h2">
                    Almost Ready!
                </Typography>

                <Typography variant="body1">
                    Your account has been created, but your access will be limited until an admin has reviewed your account. While you wait, you can provide additional information about yourself.
                </Typography>
                <div style={ { height: 32 } } />
                <Button variant="outlined" component={Link} color="primary" to="/accounts">
                    Add Contact Information
                </Button>
            </div>
        </div>
    </div>);
};

export default ActivateAccount;

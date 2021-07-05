import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const WaitWindow = () => {
    return (<div style={ { width: 300, padding: 36, margin: '0 auto' } }>
        <img src="/front.png" />
        <div style={ { margin: 'auto', width: 30 } }>
            <CircularProgress color="primary" />
        </div>
    </div>);
};

export default WaitWindow;

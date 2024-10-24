import React from 'react';

const startValues = {
    firebaseApp: null,
    accessLevel: 0,
    setAccessLevel: () => {}
};

export default React.createContext(startValues);

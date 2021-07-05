import React from 'react';

const startValues = {
    storageKey: '',
    crudLabel: '',
    listAccessors: [],
    fields: [],
    formState: {},
    entityState: {},
    setFormState: () => {},
    setEntityState: () => {}
};

export default React.createContext(startValues);

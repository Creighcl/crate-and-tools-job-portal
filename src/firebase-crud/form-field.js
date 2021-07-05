import React, { useContext } from 'react';
import FieldTypes from './field-types';
import CrudContext from './crud-context';
import * as Input from './input';

const FormField = ({ name }) => {
    const ctx = useContext(CrudContext);
    const DEFAULT_FIELD_VALUES = {
        label: name,
        type: FieldTypes.TEXT
    };
    const fieldInfo = {
        name,
        ...DEFAULT_FIELD_VALUES,
        ...ctx.fields[name]
    };

    switch (fieldInfo.type) {
        case FieldTypes.TEXTAREA :
            return (<Input.Textarea fieldInfo={ fieldInfo } />);
        case FieldTypes.NUMBER : 
            return (<Input.Number fieldInfo={ fieldInfo } />);
        case FieldTypes.SELECTONE : 
            return (<Input.SelectOne fieldInfo={ fieldInfo } />);
        case FieldTypes.SELECTMANY :
            return (<div>selectmany</div>);
        case FieldTypes.ILOOKUP :
            return (<Input.ILookup fieldInfo={ fieldInfo } />)
        default :
            return (<Input.Text fieldInfo={ fieldInfo } />);
    };
}

export default FormField;

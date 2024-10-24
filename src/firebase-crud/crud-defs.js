import FieldTypes from './field-types';
import ModelTypes from './model-types';

const definitions = {
    FEATURESIZES: {
        modelType: ModelTypes.ENUM,
        crudLabel: 'Feature Size',
        storageKey: 'featuresizes',
        labelAccessor: 'label',
        listAccessors: ['label', 'description'],
        fields: {
            label: {
                label: 'Size Label',
                type: FieldTypes.TEXT
            },
            description: {
                label: 'Description',
                type: FieldTypes.TEXT
            }
        }
    },
    FEATURES: {
        modelType: ModelTypes.ENUM,
        crudLabel: 'Feature',
        storageKey: 'features',
        labelAccessor: 'label',
        listAccessors: ['label', 'description', 'size'],
        fields: {
            label: {
                label: 'Feature Label',
                type: FieldTypes.TEXT
            },
            description: {
                label: 'Description',
                type: FieldTypes.TEXT
            },
            size: {
                label: 'Size',
                type: FieldTypes.ILOOKUP,
                lookupKey: 'featuresizes',
                lookupItemKeyFn: ({ id }) => id,
                lookupItemValueFn: ({ label }) => label
            }
        }
    },
    ACCOUNTS: {
        modelType: ModelTypes.SOLO,
        crudLabel: 'Account',
        storageKey: 'serviceaccounts',
        labelAccessor: 'label',
        listAccessors: ['label', 'name', 'phone'],
        fields: {
            label: {
                label: 'Account Label',
                type: FieldTypes.TEXT
            },
            name: {
                label: 'Contact Name',
                type: FieldTypes.TEXT
            },
            phone: {
                label: 'Phone Number',
                type: FieldTypes.TEXT
            },
        }
    },
    BILLABLEITEMS: {
        modelType: ModelTypes.ENUM,
        crudLabel: 'Billable Item',
        storageKey: 'billableitems',
        labelAccessor: 'label',
        listAccessors: ['label', 'price', 'description'],
        fields: {
            label: {
                label: 'Item Name',
                type: FieldTypes.TEXT
            },
            price: {
                label: 'Price per unit',
                type: FieldTypes.NUMBER
            },
            description: {
                label: 'Description',
                type: FieldTypes.TEXT
            }
        }
    },
    PLACES: {
        modelType: ModelTypes.USEROWNEDLIST,
        crudLabel: 'Place',
        storageKey: 'places',
        labelAccessor: 'label',
        listAccessors: ['account', 'label', 'address', 'zip'],
        fields: {
            label: {
                label: 'Label',
                type: FieldTypes.TEXT
            },
            address: { // http://maps.google.com/maps?q=210+Louise+Ave,+Nashville,+TN+37203
                label: 'Street Address',
                type: FieldTypes.TEXT
           },
            zip: {
                label: 'Zip',
                type: FieldTypes.NUMBER
            },
            qualifier: {
                label: 'Add Place to Which Account?',
                type: FieldTypes.ILOOKUP,
                lookupKey: 'serviceaccounts',
                lookupItemKeyFn: ({ id }) => id,
                lookupItemValueFn: ({ label, name }) => `${label} (${name})`
            }
        }
    }
};

export default definitions;

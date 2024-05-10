Ext.define('Abraxa.store.damanager.bnc.Function', {
    extend: 'Ext.data.Store',
    alias: 'store.berth.function',

    data: [
        {
            id: 'cargo operations',
            name: 'Cargo operations',
        },
        {
            id: 'bunkering',
            name: 'Bunkering',
        },
        {
            id: 'shelter / layby',
            name: 'Shelter / Layby',
        },
        {
            id: 'waiting / layby',
            name: 'Waiting / Layby',
        },
        {
            id: 'lay up',
            name: 'Lay up',
        },
        {
            id: 'repairs',
            name: 'Repairs',
        },
        {
            id: 'crew change',
            name: 'Crew change',
        },
        {
            id: 'clearance',
            name: 'Clearance',
        },
        {
            id: 'cleaning',
            name: 'Cleaning',
        },
        {
            id: 'delivery / redelivery',
            name: 'Delivery / redelivery',
        },
        {
            id: 'purging',
            name: 'Purging',
        },
        {
            id: 'gassing-up',
            name: 'Gassing-up',
        },
        {
            id: 'towage on floating lines',
            name: 'Towage on floating lines',
        },
        {
            id: 'canal transit',
            name: 'Canal transit',
        },
        {
            id: 'cruise call',
            name: 'Cruise call',
        },
        {
            id: 'dry docking',
            name: 'Dry docking',
        },
        {
            id: 'documentation',
            name: 'Documentation',
        },
        {
            id: 'husbandry',
            name: 'Husbandry',
        },
        {
            id: 'ace',
            name: 'ACE',
        },
        {
            id: 'aes',
            name: 'AES',
        },
        {
            id: 'other',
            name: 'Other',
        },
    ],

    autoLoad: true,

    proxy: {
        type: 'memory',
    },
});

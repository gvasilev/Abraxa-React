Ext.define('Abraxa.store.common.commodity.ImdgClasses', {
    storeId: 'store-imdgclasses',
    extend: 'Ext.data.Store',
    alias: 'store.imdgclasses',
    autoLoad: true,
    fields: ['id', 'name'],
    data: [
        { id: 1, name: 'Explosives' },
        { id: 2, name: 'Gases' },
        { id: 3, name: 'Flammable liquids' },
        {
            id: 4,
            name: 'Flammable solids, substances liable to spontaneous combustion, substances which, in contact with water, emit flammable gases',
        },
        { id: 5, name: 'Oxidizing substances and organic peroxides' },
        { id: 6, name: 'Toxic and infectious substances' },
        { id: 7, name: 'Radioactive material' },
        { id: 8, name: 'Corrosive substances' },
        { id: 9, name: 'Miscellaneous dangerous substances and articles and environmentally hazardous substances' },
        { id: 10, name: 'Unknown' },
    ],
    proxy: {
        type: 'memory',
    },
});

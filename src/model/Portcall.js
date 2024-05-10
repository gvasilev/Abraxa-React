Ext.define('Portcall', {
    extend: 'Abraxa.model.portcall.Portcall',
    fields: [
        {
            name: 'search_index',
            depends: 'updated_at',
            persist: false,
        },
    ],
});

import Env from '../../env.jsx';

Ext.define('Abraxa.store.common.Objects', {
    extend: 'Ext.data.Store',
    alias: 'store.objects',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'objects',
    },
});

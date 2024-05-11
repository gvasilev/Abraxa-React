import Env from '../env.jsx';
import '../model/Component.jsx';

Ext.define('Abraxa.store.Components', {
    extend: 'Ext.data.Store',
    alias: 'store.components',
    model: 'Abraxa.model.Component',
    autoLoad: false,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'components',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});

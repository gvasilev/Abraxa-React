import '../../model/common/Vessel';

Ext.define('Abraxa.store.vessels.Vessels', {
    extend: 'Ext.data.virtual.Store',
    alias: 'store.vessels',
    autoLoad: false,
    pageSize: 100,
    leadingBufferZone: 100,
    model: 'Abraxa.model.common.Vessel',
});

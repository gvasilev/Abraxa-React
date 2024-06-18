import '../../model/chatter/Message';

Ext.define('Abraxa.store.chatter.Messages', {
    extend: 'Ext.data.Store',
    alias: 'store.chatter-messages',
    model: 'Abraxa.model.chatter.Message',
    storeId: 'Chatter.messages',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'chatter_messages/${portcall_id}',
    },
});

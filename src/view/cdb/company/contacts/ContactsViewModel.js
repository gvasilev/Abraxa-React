Ext.define('Abraxa.view.cdb.company.contacts.ContactsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.contacts-viewmodel',
    stores: {
        contacts: {
            source: '{object_record.contacts}',
        },
        departments: {
            source: '{object_record.departments}',
            extraParams: {
                org_id: '{object_record.org_id}',
            },
        },
    },
    formulas: {
        selectedContact: {
            bind: {
                bindTo: '{selectedCompanyContact.selection}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record;
                }
            },
        },
    },
});

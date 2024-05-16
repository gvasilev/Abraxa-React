import './AddContact';

Ext.define('Abraxa.view.cdb.company.contacts.ContactEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'contact.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            slug: 'cdbContacts',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function (me) {
                let record = me.upVM().get('selectedContact');
                if (record) {
                    Ext.create('Abraxa.view.cdb.company.contacts.AddContact', {
                        title: '<div class="a-badge a-badge-person"><i class="md-icon-outlined md-icon-person"></i></div>Edit contact',
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                is_created: false,
                                selectedContact: record,
                            },
                        },
                    }).show();
                }
            },
        },
        {
            text: 'Delete',
            iconCls: 'md-icon-outlined md-icon-delete',
            ui: 'decline',
            slug: 'cdbContactDelete',
            bind: {
                permission: '{userPermissions}',
            },
            separator: true,
            handler: function (me) {
                let container = this.find('contactsRightCard'),
                    organizations = Ext.getCmp('main-viewport').getViewModel().get('organizations'),
                    currentUser = Ext.getCmp('main-viewport').getViewModel().get('currentUser'),
                    record = me.upVM().get('selectedContact'),
                    store = me.upVM().get('contacts');

                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            container.hide();
                            store.remove(record);

                            store.sync({
                                success: function () {
                                    let organization = organizations.getById(record.get('contact_org_id'));
                                    if (organization) {
                                        organization.set('updated_by_user', currentUser.getData());
                                        organization.set('updated_at', new Date());
                                        organization.save();
                                    }
                                    Ext.toast('Record deleted', 1000);
                                },
                            });
                        }
                    },
                    this,
                    [
                        {
                            xtype: 'button',
                            itemId: 'no',
                            margin: '0 8 0 0',
                            text: 'Cancel',
                        },
                        {
                            xtype: 'button',
                            itemId: 'yes',
                            text: 'Delete',
                            ui: 'decline alt',
                            separator: true,
                        },
                    ]
                );
            },
        },
    ],
});

Ext.define('Abraxa.view.cdb.company.CompanyEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'company.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            slug: 'cdb',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function (me) {
                let record = me.upVM().get('selectedCompany'),
                    companyRecordsStore = me.upVM().get('organizations');
                if (record) {
                    Ext.create('Abraxa.view.cdb.forms.AddOrganization', {
                        // title: 'Edit company',
                        title: '<div class="a-badge a-badge-company"><i class="md-icon md-icon-business"></i></div>Edit company',
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                is_created: false,
                                selectedCompany: record,
                            },
                            stores: {
                                parentCompanyStore: companyRecordsStore,
                            },
                        },
                    }).show();
                }
            },
        },
        {
            text: 'Delete',
            slug: 'cdb',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-delete',
            ui: 'decline',
            separator: true,
            handler: function (me) {
                const container = me.find('company-editpanel'),
                    myTasks = Ext.getCmp('main-viewport').getVM().get('myTasks'),
                    agreements = Ext.getCmp('main-viewport').getVM().get('agreements'),
                    taskStore = Ext.getStore('tasks'),
                    companyView = Ext.ComponentQuery.query('[xtype=company]')[0],
                    record = me.upVM().get('selectedCompany');

                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            if (container) container.hide();

                            record.erase({
                                success: function () {
                                    if (myTasks) myTasks.reload();
                                    if (taskStore) taskStore.reload();
                                    if (agreements) agreements.reload();
                                    if (companyView) {
                                        Ext.getCmp('main-viewport').getController().redirectTo('companydatabase');
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
                            ui: 'decline alt',
                            text: 'Delete',
                            separator: true,
                        },
                    ]
                );
            },
        },
    ],
});

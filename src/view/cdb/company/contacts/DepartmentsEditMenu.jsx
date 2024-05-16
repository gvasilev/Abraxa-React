Ext.define('Abraxa.view.cdb.company.contacts.DepartmentsEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'contacts.departments.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Delete',
            ui: 'decline',
            separator: true,
            iconCls: 'md-icon-outlined md-icon-delete',
            slug: 'cdbDepartmentDelete',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let store = me.upVM().get('departments'),
                    container = this.find('departmentsRightCard'),
                    contacts = me.upVM().get('contacts'),
                    record = me.upVM().get('department');

                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            container.hide();

                            store.remove(record);
                            store.sync({
                                success: function () {
                                    let contactRecords = contacts.queryBy(function (rec, id) {
                                        return rec.get('contact_org_department') == record.get('dept_id');
                                    });
                                    if (contactRecords) {
                                        contactRecords.each(function (rec) {
                                            rec.load();
                                        });
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
                        },
                    ]
                );
            },
        },
    ],
});

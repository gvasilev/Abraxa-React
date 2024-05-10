Ext.define('Abraxa.view.cdb.company.contacts.DepartmentsRightCard', {
    extend: 'Ext.Container',
    xtype: 'departments.right.card',
    itemId: 'departmentsRightCard',
    cls: 'a-right-container',
    hidden: true,
    bind: {
        hidden: '{departmentsGrid.selection ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        formulas: {
            dialogTitle: {
                bind: {
                    bindTo: '{departmentsGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return (
                            '<div class="a-badge a-badge-default"><i class="md-icon-outlined">corporate_fare</i></div><div><span class="a-panel-title">' +
                            record.get('dept_name') +
                            '</span></div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '{dialogTitle}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'cdbDepartmentDelete',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (me) {
                                let container = this.find('departmentsRightCard'),
                                    store = me.upVM().get('departments'),
                                    contacts = me.upVM().get('contacts'),
                                    record = me.upVM().get('departmentsGrid.selection');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function () {
                                                    me.upVM().get('organizations').reload();
                                                    let contactRecords = contacts.queryBy(function (rec, id) {
                                                        return (
                                                            rec.get('contact_org_department') == record.get('dept_id')
                                                        );
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
                                            text: 'Delete',
                                            ui: 'decline alt',
                                            separator: true,
                                        },
                                    ]
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (me) {
                                me.up('[xtype=departments\\.right\\.card]').hide();
                                let departmentsGrid = Ext.ComponentQuery.query('[xtype=departments\\.grid]')[0];
                                if (departmentsGrid) departmentsGrid.deselectAll();
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-general-form',
            flex: 1,
            scrollable: 'y',
            items: [
                {
                    xtype: 'formpanel',
                    itemId: 'mainContactForm',
                    defaults: {
                        labelAlign: 'left',
                        clearable: false,
                        ui: 'classic hovered-border',
                        slug: 'cdbDepartments',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        listeners: {
                            blur: function (me) {
                                let record = me.upVM().get('departmentsGrid.selection'),
                                    object_record = me.upVM().get('object_record'),
                                    departments = me.upVM().get('departments'),
                                    currentUser = me.upVM().get('currentUser');
                                if (record.dirty) {
                                    departments.sync({
                                        success: function () {
                                            object_record.set('updated_by_user', currentUser.getData());
                                            object_record.set('updated_at', new Date());
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
                                }
                            },
                        },
                    },

                    items: [
                        {
                            xtype: 'container',
                            // layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    ui: 'field-xl no-border classic',
                                    label: false,
                                    required: true,
                                    clearable: false,
                                    slug: 'cdbDepartments',
                                    bind: {
                                        permission: '{userPermissions}',
                                        value: '{departmentsGrid.selection.dept_name}',
                                    },
                                    placeholder: 'Enter department name',
                                    listeners: {
                                        painted: function (me) {
                                            me.focus();
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.emailfield',
                            cls: 'a-field-icon icon-email icon-rounded',
                            label: 'Email',
                            vtype: 'email',
                            placeholder: 'Enter email address',
                            required: true,
                            bind: {
                                value: '{departmentsGrid.selection.dept_email}',
                            },
                        },
                        {
                            xtype: 'abraxa.phonefield',
                            cls: 'a-field-icon icon-phone icon-rounded',
                            label: 'Phone',
                            bind: {
                                value: '{departmentsGrid.selection.dept_phone}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Address',
                            placeholder: 'Enter address',
                            cls: 'a-field-icon icon-location icon-rounded',
                            bind: {
                                value: '{departmentsGrid.selection.address}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset',
                    html: '',
                },
                {
                    xtype: 'container',
                    margin: '8 12',
                    minHeight: 128,
                    items: [
                        {
                            xtype: 'textareafield',
                            ui: 'classic no-border',
                            cls: 'a-field-icon icon-short',
                            label: false,
                            labelAlign: 'top',
                            slug: 'cdbDepartments',
                            bind: {
                                permission: '{userPermissions}',
                                value: '{departmentsGrid.selection.description}',
                            },
                            placeholder: 'Enter description (optional)',
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('departmentsGrid.selection'),
                                        object_record = me.upVM().get('object_record'),
                                        departments = me.upVM().get('departments'),
                                        currentUser = me.upVM().get('currentUser');
                                    if (record.dirty) {
                                        departments.sync({
                                            success: function () {
                                                object_record.set('updated_by_user', currentUser.getData());
                                                object_record.set('updated_at', new Date());
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

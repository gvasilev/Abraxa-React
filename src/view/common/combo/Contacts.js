Ext.define('Abraxa.view.common.combo.Contacts', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'contacts.combo',
    forceSelection: false,
    selectable: true,
    valueField: 'contact_id',
    displayField: 'contact_full_name',
    label: 'Contacts',
    itemTpl: '<div class="a-person a-icon-round"><i class="material-icons md-18">person</i> {contact_full_name}</div>',
    editable: true,
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
    },
    store: {
        type: 'organization.contacts',
    },
    data: [],
    queryMode: 'local',
    emptyText: 'No contacts available',
    listeners: {
        blur: function (combo, e, eOpts) {
            var value = combo.getInputValue();
            let store = combo.getStore();
            var record = store.query('contact_full_name', value, false, true, true);
            if (record.length == 0 && value) {
                let dialog = this.up('dialog');
                let companyId = null;
                if (store.getFilters() && store.getFilters().items.length === 1) {
                    let filter = store.getFilters().items[0];
                    companyId = filter.getValue();
                }

                Ext.create('Ext.MessageBox', {
                    title: 'Warning',
                    message:
                        'Contact <b>"' + value + '"</b> does not exist in your list. </br> Would you like to add it?',
                    alwaysOnTop: true,
                    bbar: {
                        items: [
                            '->',
                            {
                                xtype: 'button',
                                text: 'Yes',
                                handler: function (me) {
                                    this.up('dialog').destroy();
                                    if (dialog) {
                                        dialog.hide();
                                    }
                                    let modal = Ext.create('Abraxa.view.companydatabase.forms.AddCreateContact', {
                                        viewModel: {
                                            type: 'main.viewport',
                                            stores: {
                                                departaments: {
                                                    type: 'company-departments',
                                                    filters: [
                                                        {
                                                            property: 'dept_org_id',
                                                            operator: '=',
                                                            value: companyId,
                                                            exactMatch: true,
                                                        },
                                                    ],
                                                },
                                            },
                                            data: {
                                                selectedContact: new Abraxa.model.cdb.Contact({
                                                    contact_org_id: companyId,
                                                }),
                                                createFromTabs: false,
                                                isGlobal: true,
                                                combo: combo,
                                            },
                                        },
                                    });
                                    modal.show();
                                    if (dialog) {
                                        modal.on('destroy', function () {
                                            dialog.show();
                                            combo.focus();
                                            combo.select();
                                        });
                                    } else {
                                        modal.on('destroy', function () {
                                            combo.focus();
                                            combo.select();
                                        });
                                    }
                                },
                            },
                            {
                                xtype: 'button',
                                text: 'No',
                                handler: function (me) {
                                    combo.clearValue();
                                    if (combo.getStore().source) {
                                        store.getSource().rejectChanges();
                                    } else {
                                        store.rejectChanges();
                                    }
                                    combo.focus();
                                    this.up('dialog').destroy();
                                },
                            },
                        ],
                    },
                }).show();
            }
        },
        expand: function () {
            let combo = this,
                pickerRecords = combo.getPicker().getItems(),
                buttonExists = pickerRecords.keys.indexOf('addContactButton');
            if (buttonExists === -1) {
                combo.getPicker().add({
                    xtype: 'container',
                    docked: 'bottom',
                    layout: 'hbox',
                    itemId: 'addContactButton',
                    flex: 1,
                    style: 'background-color:#fff',
                    items: [
                        {
                            xtype: 'button',
                            margin: 4,
                            flex: 1,
                            text: 'Add new',
                            ui: 'normal',
                            iconCls: 'md-icon-add',
                            handler: function (me) {
                                let store = combo.getStore();
                                let companyId = null;
                                if (store.getFilters() && store.getFilters().items.length === 1) {
                                    let filter = store.getFilters().items[0];
                                    companyId = filter.getValue();
                                }
                                let dialog = this.up('dialog');
                                if (dialog) {
                                    dialog.hide();
                                }

                                let modal = Ext.create('Abraxa.view.companydatabase.forms.AddCreateContact', {
                                    viewModel: {
                                        type: 'main.viewport',
                                        stores: {
                                            departaments: {
                                                type: 'company-departments',
                                                filters: [
                                                    {
                                                        property: 'dept_org_id',
                                                        operator: '=',
                                                        value: companyId,
                                                        exactMatch: true,
                                                    },
                                                ],
                                            },
                                        },
                                        data: {
                                            selectedContact: new Abraxa.model.ContactDatabase({
                                                contact_org_id: companyId,
                                            }),
                                            createFromTabs: false,
                                            isGlobal: true,
                                            combo: combo,
                                        },
                                    },
                                });
                                modal.show();
                                if (dialog) {
                                    modal.on('destroy', function () {
                                        if (store.source) {
                                            store.getSource().reload();
                                        } else {
                                            store.reload();
                                        }
                                        dialog.show();
                                        combo.focus();
                                        combo.select();
                                    });
                                } else {
                                    modal.on('destroy', function () {
                                        if (store.source) {
                                            store.getSource().reload();
                                        } else {
                                            store.reload();
                                        }
                                        combo.focus();
                                        combo.select();
                                    });
                                }
                            },
                        },
                    ],
                });
            }
        },
    },
});

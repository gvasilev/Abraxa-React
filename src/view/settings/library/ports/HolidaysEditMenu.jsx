import './DuplicateHoliday';

Ext.define('Abraxa.view.settings.library.ports.HolidaysEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'settings.library.holidays.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            iconCls: 'md-icon-outlined md-icon-content-copy',
            slug: 'settingsLibraryHoliday',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (btn, e) {
                let me = this,
                    record = me.upVM().get('holiday'),
                    port = me.upVM().get('portsServerGrid.selection');
                Ext.create('Abraxa.view.settings.library.ports.DuplicateHoliday', {
                    viewModel: {
                        parent: btn.upVM(),
                        data: {
                            port: port,
                            holiday: record,
                            multiple: false,
                        },
                        stores: {
                            filteredPortServed: {
                                source: '{portsServed}',
                                filters: '{portFilter}',
                            },
                        },
                        formulas: {
                            portFilter: {
                                bind: {
                                    bindTo: '{port}',
                                    deep: true,
                                },
                                get: function (port) {
                                    if (port) {
                                        let filteredPortServed = this.get('filteredPortServed');
                                        if (filteredPortServed) filteredPortServed.clearFilter();
                                        return function (rec) {
                                            if (rec.get('port_id') != port.get('port_id')) {
                                                return true;
                                            }
                                        };
                                    } else {
                                        return function (item) {
                                            return true;
                                        };
                                    }
                                },
                            },
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Delete',
            iconCls: 'md-icon-outlined md-icon-delete',
            ui: 'decline',
            separator: true,
            slug: 'settingsLibraryHolidayDelete',
            bind: {
                permission: '{userPermissions}',
                hidden: '{holiday.company_id ? false:true}',
            },
            handler: function (button, el, data) {
                let me = this,
                    record = me.upVM().get('holiday'),
                    portServedRecord = me.upVM().get('portServedRecord'),
                    currentUser = me.upVM().get('currentUser'),
                    store = me.upVM().get('portsServerGrid.selection').holidays();
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this record?',
                    function (answer) {
                        if (answer != 'yes') return;
                        store.remove(record);
                        store.sync({
                            success: function (batch) {
                                portServedRecord.set('updated_by_user', currentUser.getData());
                                portServedRecord.set('updated_at', new Date());
                                portServedRecordd.save();
                                Ext.toast('Record deleted', 1000);
                            },
                        });
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

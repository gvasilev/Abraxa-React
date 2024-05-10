Ext.define('Abraxa.view.settings.library.ports.HolidaysRightCard', {
    extend: 'Ext.Container',
    xtype: 'settings.library.holidays.right.card',
    cls: 'a-right-container',
    hidden: true,
    bind: {
        hidden: '{holidaysGrid.selection && !holidaysGrid.selection.is_checked ? false : true}',
    },
    itemId: 'holidaysRightCard',
    layout: 'vbox',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<div class="a-badge a-badge-default a-badge-rounded"><i class="md-icon-outlined md-16">calendar_today</i></div>{holidaysGrid.selection.description}',
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
                            iconCls: 'md-icon-outlined md-icon-content-copy',
                            ui: 'round tool-round-md',
                            slug: 'settingsLibraryHoliday',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Duplicate',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (btn, e) {
                                let me = this,
                                    record = me.upVM().get('holidaysGrid.selection'),
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
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'settingsLibraryHolidayDelete',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{holidaysGrid.selection.company_id ? false:true}',
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
                            handler: function (item, el, eOpts) {
                                let vm = this.upVM(),
                                    store = vm.get('portsServerGrid.selection').holidays(),
                                    container = this.find('holidaysRightCard'),
                                    portserveRecord = vm.get('portserveRecord'),
                                    currentUser = vm.get('currentUser'),
                                    record = vm.get('holidaysGrid.selection');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                                    portserveRecord.set('updated_at', new Date());
                                                    portserveRecord.save();
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function (batch) {
                                                    Ext.Msg.alert('Something went wrong', 'Could not delete record!');
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
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                let record = this.upVM().get('holidaysGrid.selection'),
                                    grid = Ext.ComponentQuery.query('settings\\.library\\.holidays\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=settings\\.library\\.holidays\\.right\\.card]').hide();
                            },
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
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 24',
            layout: 'vbox',
            scrollable: 'y',
            flex: 1,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
                listeners: {
                    blur: function (me) {
                        let record = me.upVM().get('holidaysGrid.selection'),
                            portserveRecord = me.upVM().get('portserveRecord'),
                            currentUser = me.upVM().get('currentUser');
                        if (record.dirty) {
                            record.save({
                                success: function (rec) {
                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                    portserveRecord.set('updated_at', new Date());
                                    portserveRecord.save();
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
                slug: 'settingsLibraryHoliday',
                bind: {
                    permission: '{userPermissions}',
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border classic',
                    label: false,
                    clearable: false,
                    readOnly: true,
                    bind: {
                        value: '{holidaysGrid.selection.description}',
                    },
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Date',
                    placeholder: 'dd/mm',
                    dateFormat: 'd/m',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-time icon-rounded',
                    bind: {
                        value: '{holidaysGrid.selection.date}',
                        ui: '{holidaysGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{holidaysGrid.selection.company_id ? false : true}',
                    },
                    required: true,
                },
                {
                    xtype: 'selectfield',
                    label: 'Type',
                    placeholder: 'Choose',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Choose type',
                    options: [
                        {
                            value: 'normal',
                            text: 'National',
                        },
                        {
                            value: 'local',
                            text: 'Local',
                        },
                    ],
                    bind: {
                        value: '{holidaysGrid.selection.type}',
                        ui: '{holidaysGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{holidaysGrid.selection.company_id ? false : true}',
                    },
                },
            ],
        },
    ],
});

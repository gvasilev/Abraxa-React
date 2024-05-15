import './CreateEditWorkingTime.jsx';
import './CreateEditPortServices.jsx';
Ext.define('Abraxa.view.settings.library.ports.AdditionalMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.additional.main',
    padding: '0 32',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        stores: {
            portWorkingTimes: {
                source: '{portsServerGrid.selection.working_times}',
            },
            portServices: {
                source: '{portsServerGrid.selection.port_services}',
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'w-50',
            items: [
                {
                    xtype: 'div',
                    margin: '0 0 16 0',
                    html: '<h3>Working time</h3><div class="text-info">Specify the normal office hours of the port.</div>',
                },
                {
                    xtype: 'container',
                    cls: 'a-bordered-list',
                    items: [
                        {
                            xtype: 'abraxa.formlist',
                            bind: {
                                store: '{portWorkingTimes}',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                cls: 'a-list-item',
                                minHeight: 48,
                                flex: 1,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'a-list-values',
                                        flex: 1,
                                        bind: {
                                            html: '<div class="flex-2"><span class="fw-b c-blue-grey">{record.start_day:capitalize}-{record.end_day:capitalize}</span></div><div class="flex-2 hbox"><i class="md-icon-outlined fs-18 c-light-grey mr-8">schedule</i><span class="">{record.start_time:date("H:i")} <span class="text-center c-blue-grey px-16">to</span> {record.end_time:date("H:i")}</span></div>',
                                        },
                                    },

                                    {
                                        xtype: 'container',
                                        cls: 'a-actions-hover',
                                        items: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'md-icon-outlined md-icon-delete',
                                                ui: 'round tool-round-md',
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
                                                    let record = me.upVM().get('record'),
                                                        portserveRecord = me.upVM().get('portserveRecord'),
                                                        currentUser = me.upVM().get('currentUser'),
                                                        store = me.upVM().get('portWorkingTimes');
                                                    Ext.Msg.confirm(
                                                        'Delete',
                                                        'Are you sure you would like to delete this row?',
                                                        function (answer) {
                                                            if (answer != 'yes') return;
                                                            store.remove(record);
                                                            store.sync({
                                                                success: function (err, msg) {
                                                                    portserveRecord.set(
                                                                        'updated_by_user',
                                                                        currentUser.getData()
                                                                    );
                                                                    portserveRecord.set('updated_at', new Date());
                                                                    portserveRecord.save();
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                                failure: function (batch) {
                                                                    var response =
                                                                        batch.operations[0].error.response.responseJson;
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        response.message
                                                                    );
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
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'button',
                    text: 'Add working time',
                    ui: 'normal small',
                    margin: '8 0 0 0',
                    height: 28,
                    iconCls: 'md-icon-add',
                    handler: function (btn, e) {
                        Ext.create('Abraxa.view.settings.library.ports.CreateEditWorkingTime', {
                            viewModel: {
                                parent: btn.upVM(),
                                data: {
                                    editMode: false,
                                    store: btn.upVM().get('portWorkingTimes'),
                                    workingTime: Ext.create('Abraxa.model.settings.port.WorkingTime', {
                                        start_day: 'monday',
                                        end_day: 'monday',
                                        start_time: new Date(new Date().setHours(0, 0, 0, 0)),
                                        end_time: new Date(new Date().setHours(0, 0, 0, 0)),
                                        port_id: btn.upVM().get('portsServerGrid.selection').get('port_id'),
                                        workable_id: btn.upVM().get('portsServerGrid.selection').get('id'),
                                        workable_type: 'App\\Models\\Port\\PortServed',
                                    }),
                                },
                            },
                        }).show();
                    },
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'w-50',
            padding: '24 0 0 0',
            html: '<hr>',
        },
        {
            xtype: 'container',
            cls: 'w-50',
            items: [
                {
                    xtype: 'div',
                    margin: '0 0 16 0',
                    html: '<h3>Services</h3><div class="text-info">List specific services available at the port.</div>',
                },
                {
                    xtype: 'container',
                    cls: 'a-bordered-list',
                    items: [
                        {
                            xtype: 'abraxa.formlist',
                            bind: {
                                store: '{portServices}',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                cls: 'a-list-item',
                                minHeight: 48,
                                flex: 1,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'a-list-values',
                                        flex: 1,
                                        bind: {
                                            html: '<div class="flex-2 hbox"><i class="md-icon md-18 c-green">check</i><span class="ml-12">{record.service_name}</span></div>',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'a-actions-hover',
                                        items: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'md-icon-outlined md-icon-delete',
                                                ui: 'tool-md round',
                                                arrow: false,
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
                                                    let record = me.upVM().get('record'),
                                                        portserveRecord = me.upVM().get('portserveRecord'),
                                                        currentUser = me.upVM().get('currentUser'),
                                                        store = me.upVM().get('portServices');
                                                    Ext.Msg.confirm(
                                                        'Delete',
                                                        'Are you sure you would like to delete this row?',
                                                        function (answer) {
                                                            if (answer != 'yes') return;
                                                            store.remove(record);
                                                            store.sync({
                                                                success: function (err, msg) {
                                                                    portserveRecord.set(
                                                                        'updated_by_user',
                                                                        currentUser.getData()
                                                                    );
                                                                    portserveRecord.set('updated_at', new Date());
                                                                    portserveRecord.save();
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                                failure: function (batch) {
                                                                    var response =
                                                                        batch.operations[0].error.response.responseJson;
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        response.message
                                                                    );
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
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'button',
                    text: 'Add services',
                    ui: 'normal small',
                    margin: '8 0 0 0',
                    height: 28,
                    iconCls: 'md-icon-add',
                    handler: function (btn, e) {
                        Ext.create('Abraxa.view.settings.library.ports.CreateEditPortServices', {
                            viewModel: {
                                parent: btn.upVM(),
                                data: {
                                    editMode: false,
                                    store: btn.upVM().get('portServices'),
                                    portService: Ext.create('Abraxa.model.settings.port.PortService', {
                                        port_id: btn.upVM().get('portsServerGrid.selection').get('port_id'),
                                        serviceable_id: btn.upVM().get('portsServerGrid.selection').get('id'),
                                        serviceable_type: 'App\\Models\\Port\\PortServed',
                                    }),
                                },
                            },
                        }).show();
                    },
                },
            ],
        },
    ],
});

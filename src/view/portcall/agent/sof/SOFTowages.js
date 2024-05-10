Ext.define('Abraxa.view.portcall.sof.SOFTowages', {
    extend: 'Ext.grid.Grid',
    xtype: 'portcall.sof.towages',
    cls: 'abraxa-grid a-sof-towages',
    ui: 'bordered',
    margin: '16 0 0 0',
    scrollable: false,
    emptyText: 'No records available',
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    store: [],
    bind: {
        store: '{towage}',
        plugins: '{gridEditor}',
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    minHeight: 124,
    infinite: false,
    itemConfig: {
        viewModel: true,
    },
    columns: [
        {
            text: '',
            sortable: false,
            menuDisabled: true,
            width: 48,
            cell: {
                cls: 'a-cell-icon',
                encodeHtml: false,
            },
            renderer: function (val) {
                return '<i class="material-icons md-18">swap_horiz</i>';
            },
        },
        {
            text: 'Towages',
            width: 220,
            sortable: false,
            menuDisabled: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function () {
                return '<span class="fw-b">Towage</span>';
            },
        },
        {
            text: '',
            sortable: false,
            menuDisabled: true,
            columns: [
                {
                    dataIndex: 'towage_in_count',
                    editable: true,
                    menuDisabled: true,
                    hideable: false,
                    height: 0,
                    width: 50,
                    editor: {
                        field: {
                            xtype: 'numberfield',
                            ui: 'hovered-border classic',
                            placeholder: '0',
                            clearable: false,
                        },
                        listeners: {
                            complete: function (t, value) {
                                if (value) {
                                    var store = this.upVM().get('towage');
                                    if (store) {
                                        store.sync({
                                            success: function (err, msg) {
                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function (batch) {
                                                var response = batch.operations[0]._response.responseJson;
                                                Ext.Msg.alert('Something went wrong', response.message[0]);
                                            },
                                        });
                                    }
                                }
                            },
                        },
                    },
                    renderer: function (val) {
                        if (val) {
                            return val;
                        } else {
                            return '<div class="a-cell-placeholder">0</div>';
                        }
                    },
                    cell: {
                        cls: 'a-gridcell-editable',
                        encodeHtml: false,
                    },
                },
                {
                    dataIndex: 'towage_in_company',
                    menuDisabled: true,
                    hideable: false,
                    editable: true,
                    height: 0,
                    width: 200,
                    editor: {
                        field: {
                            ui: 'hovered-border classic',
                            xtype: 'organization.combo',
                            placeholder: 'Company',
                        },
                        listeners: {
                            complete: function (t, value) {
                                if (value) {
                                    var store = this.upVM().get('towage'),
                                        record = this.upVM().get('record'),
                                        selection = this.getField().getSelection();

                                    record.set('towage_in_company_name', selection.get('org_name'));
                                    if (store) {
                                        store.sync({
                                            success: function (err, msg) {
                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function (batch) {
                                                var response = batch.operations[0]._response.responseJson;
                                                Ext.Msg.alert('Something went wrong', response.message[0]);
                                            },
                                        });
                                    }
                                }
                            },
                        },
                    },
                    renderer: function (val, record) {
                        if (val) {
                            return record.get('towage_in_company_name');
                        } else {
                            return '<div class="a-cell-placeholder">Company</div>';
                        }
                    },
                    cell: {
                        cls: 'a-gridcell-editable',
                        encodeHtml: false,
                    },
                },
            ],
        },
        {
            text: '',
            sortable: false,
            menuDisabled: true,
            width: 150,
        },
        {
            text: '',
            sortable: false,
            menuDisabled: true,
            columns: [
                {
                    dataIndex: 'towage_out_count',
                    editable: true,
                    menuDisabled: true,
                    sortable: false,
                    hideable: false,
                    height: 0,
                    width: 50,
                    editor: {
                        field: {
                            xtype: 'numberfield',
                            placeholder: '0',
                            ui: 'hovered-border classic',
                            clearable: false,
                        },
                        listeners: {
                            complete: function (t, value) {
                                if (value) {
                                    var store = this.upVM().get('towage');
                                    if (store) {
                                        store.sync({
                                            success: function (err, msg) {
                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function (batch) {
                                                var response = batch.operations[0]._response.responseJson;
                                                Ext.Msg.alert('Something went wrong', response.message[0]);
                                            },
                                        });
                                    }
                                }
                            },
                        },
                    },
                    renderer: function (val) {
                        if (val) {
                            return val;
                        } else {
                            return '<div class="a-cell-placeholder">0</div>';
                        }
                    },
                    cell: {
                        cls: 'a-gridcell-editable',
                        encodeHtml: false,
                    },
                },
                {
                    dataIndex: 'towage_out_company',
                    editable: true,
                    menuDisabled: true,
                    hideable: false,
                    sortable: false,
                    height: 0,
                    width: 200,
                    editor: {
                        field: {
                            xtype: 'organization.combo',
                            placeholder: 'Company',
                            ui: 'hovered-border classic',
                        },
                        listeners: {
                            complete: function (t, value) {
                                if (value) {
                                    var store = this.upVM().get('towage'),
                                        record = this.upVM().get('record'),
                                        selection = this.getField().getSelection();

                                    record.set('towage_out_company_name', selection.get('org_name'));

                                    if (store) {
                                        store.sync({
                                            success: function (err, msg) {
                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function (batch) {
                                                var response = batch.operations[0]._response.responseJson;
                                                Ext.Msg.alert('Something went wrong', response.message[0]);
                                            },
                                        });
                                    }
                                }
                            },
                        },
                    },
                    cell: {
                        cls: 'a-gridcell-editable',
                        encodeHtml: false,
                    },
                },
            ],
        },
        {
            text: '',
            flex: 1,
            dataIndex: '',
            sortable: false,
            menuDisabled: true,
            hideable: false,
            dataIndex: 'comments',
            editor: {
                field: {
                    xtype: 'textfield',
                    placeholder: 'Comment',
                    ui: 'hovered-border classic',
                },
                listeners: {
                    complete: function (t, value) {
                        if (value) {
                            var store = this.upVM().get('towage');
                            if (store) {
                                store.sync({
                                    success: function (err, msg) {
                                        Ext.toast('Record updated', 1000);
                                    },
                                    failure: function (batch) {
                                        var response = batch.operations[0]._response.responseJson;
                                        Ext.Msg.alert('Something went wrong', response.message[0]);
                                    },
                                });
                            }
                        }
                    },
                },
            },
        },
        {
            text: '',
            dataIndex: '',
            sortable: false,
            menuDisabled: true,
            hideable: false,
            bind: {
                hidden: '{nonEditable ? true : false}',
            },
            tools: [
                {
                    xtype: 'button',
                    ui: 'normal-light raised round small',
                    iconCls: 'md-icon-add',
                    zone: 'end',
                    handler: function () {
                        var store = this.upVM().get('towage');
                        store.add({
                            portcall_id: this.upVM().get('object_record.id'),
                        });
                        // bunkersGridStore.sync();
                    },
                    tooltip: {
                        anchorToTarget: true,
                        html: 'Add',
                        align: 'bc-tc?',
                    },
                },
            ],
            cell: {
                align: 'right',
                cls: 'a-cell-actions a-actions-hover',
                tools: [
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-remove-circle-outline',
                        ui: 'round tool-xs',
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
                            var store = this.upVM().get('towage');
                            var record = this.upVM().get('record');
                            Ext.Msg.confirm(
                                'Confirmation',
                                'Are you sure you want to delete this entry?',
                                function (answer) {
                                    if (answer == 'yes') {
                                        store.remove(record);
                                        store.sync({
                                            success: function (err, msg) {
                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function (batch) {
                                                Ext.Msg.alert('Something went wrong', 'Could not delete record!');
                                            },
                                        });
                                    }
                                }
                            );
                        },
                    },
                ],
            },
        },
    ],
});

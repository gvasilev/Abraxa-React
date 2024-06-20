Ext.define('Abraxa.view.common.dialog.berth.ViewBerthDetails', {
    xtype: 'common.dialog.viewBerthDetails',
    extend: 'Ext.Dialog',

    manageBorders: false,
    ui: 'type3 dialog-md',
    modal: true,
    draggable: true,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',

    title: 'Berth',
    closable: true,
    centered: true,
    width: 500,
    minHeight: 500,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    action: 'create', // create, edit

    scrollable: true,

    defaults: {
        labelWidth: 60,
        labelSeparator: '',
    },
    items: [
        {
            xtype: 'container',
            margin: 0,
            defaults: {
                layout: 'vbox',
                margin: '8 8 8 16',
                pack: 'space-between',
            },

            items: [
                // GENERAL DATA
                {
                    xtype: 'container',
                    style: {
                        marginTop: 0,
                    },
                    html: '<div class="h3">General data</div>',
                },

                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                    },
                    defaults: {
                        labelAlign: 'top',
                        ui: 'classic',
                        margin: 10,
                        pack: 'space-between',
                    },

                    items: [
                        {
                            // Name
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'Name',
                            name: 'name',
                            bind: {
                                value: '{berth.name}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                        {
                            // Port
                            xtype: 'displayfield',
                            height: 25,
                            margin: '10 6 0 6',
                            flex: 4,
                            label: 'Port ',
                            name: 'port_id',
                            bind: {
                                value: '{berth.port_name}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                        {
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'Type',
                            name: 'type',
                            bind: {
                                value: '{berth.type}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                    },
                    defaults: {
                        labelAlign: 'top',
                        ui: 'classic',
                        margin: 10,
                        pack: 'space-between',
                    },

                    items: [
                        {
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'Function',
                            name: 'function',
                            bind: {
                                value: '{berth.function}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                        {
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'IMO',
                            name: 'imo',
                            bind: {
                                value: '{berth.imo}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                        {
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'UN Locator code',
                            name: 'un_locator_code',
                            bind: {
                                value: '{berth.un_locator_code}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                    ],
                },

                // ----------------------
                {
                    xtype: 'container',
                    html: '<br>',
                },

                // RESTRICTIONS
                {
                    xtype: 'container',
                    html: '<div class="h3">Restrictions</div>',
                },

                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                    },
                    defaults: {
                        labelAlign: 'top',
                        ui: 'classic',
                        margin: 10,
                        pack: 'space-between',
                    },

                    items: [
                        {
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'Draft',
                            name: 'draft',
                            bind: {
                                value: '{berth.draft}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                        {
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'Air Draft',
                            name: 'air_draft',
                            bind: {
                                value: '{berth.air_draft}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                        {
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'Beam',
                            name: 'beam',
                            bind: {
                                value: '{berth.beam}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                    },
                    defaults: {
                        labelAlign: 'top',
                        ui: 'classic',
                        margin: 10,
                        pack: 'space-between',
                    },

                    items: [
                        {
                            xtype: 'displayfield',
                            flex: 4,
                            label: 'LOA',
                            name: 'loa',
                            bind: {
                                value: '{berth.loa}',
                            },
                            renderer: function (value) {
                                if (value) {
                                    if (typeof value == 'string' && value == '') {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                        {
                            xtype: 'container',
                            flex: 4,
                            label: '',
                            bind: {
                                value: '',
                            },
                        },
                        {
                            xtype: 'container',
                            flex: 4,
                            label: '',
                            bind: {
                                value: '',
                            },
                        },
                    ],
                },

                // DESCRIPTION
                {
                    xtype: 'container',
                    html: '<div class="h3">Description</div>',
                },
                {
                    xtype: 'displayfield',
                    margin: 16,
                    ui: 'classic',
                    maxRows: 5,
                    name: 'description',
                    bind: {
                        value: '{berth.description}',
                    },
                    renderer: function (value) {
                        if (value) {
                            if (typeof value == 'string' && value == '') {
                                return AbraxaConstants.placeholders.emptyValue;
                            } else {
                                return value;
                            }
                        } else {
                            return AbraxaConstants.placeholders.emptyValue;
                        }
                    },
                },

                {
                    xtype: 'container',
                    html: '',
                },
            ],
        },
    ],

    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },

    buttons: [
        {
            text: 'Edit',
            ui: 'default',
            handler: function () {
                var me = this;
                var vm = this.upVM();
                var storeToReload = vm.getData().store;

                var record = {
                    data: vm.getData().berth,
                };

                if (record) {
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'companies/berths/' + record.data.id,
                        method: 'GET',
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                            'Content-Type': 'application/json',
                        },
                        jsonData: {},
                        success: function (response) {
                            var responseData = JSON.parse(response.responseText);
                            var selectedBerthData = storeToReload.getById(record.data.id);

                            me.up('dialog').destroy();
                            Ext.create('Abraxa.view.common.forms.port.AddEditBerthToPortForm', {
                                title: 'Edit Berth',
                                viewModel: {
                                    type: 'main.viewport',
                                    data: {
                                        selectedBerth: selectedBerthData,
                                        portId: record.data.port_id,
                                        portName: record.data.port_name,
                                        store: storeToReload,
                                        action: 'edit',
                                        component: 'viewBerthDetails',
                                    },
                                },
                            }).show();
                        },
                    });
                }
            },
        },
        {
            text: 'Close',
            ui: 'default',
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    ],
});

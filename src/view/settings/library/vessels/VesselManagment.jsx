Ext.define('Abraxa.view.settings.library.vessels.VesselManagment', {
    extend: 'Ext.Container',
    xtype: 'settings.library.vessels.managment',
    padding: '8 24 16 32',
    scrollable: true,
    viewModel: {
        formulas: {
            managingFlag: {
                bind: {
                    bindTo: '{vesselsGrid.selection.managing_owner_data.flag_abbv}',
                    deep: true,
                },
                get: function (flag) {
                    if (flag) {
                        return AbraxaConstants.urls.staticAbraxa + 'flags/1x1/' + flag.toLowerCase() + '.svg';
                    }
                },
            },
            groupFlag: {
                bind: {
                    bindTo: '{vesselsGrid.selection.group_owner_data.flag_abbv}',
                    deep: true,
                },
                get: function (flag) {
                    if (flag) {
                        return AbraxaConstants.urls.staticAbraxa + 'flags/1x1/' + flag.toLowerCase() + '.svg';
                    }
                },
            },
            registeredFlag: {
                bind: {
                    bindTo: '{vesselsGrid.selection.registered_owner_data.flag_abbv}',
                    deep: true,
                },
                get: function (flag) {
                    if (flag) {
                        return AbraxaConstants.urls.staticAbraxa + 'flags/1x1/' + flag.toLowerCase() + '.svg';
                    }
                },
            },
            operatorFlag: {
                bind: {
                    bindTo: '{vesselsGrid.selection.operator_data.flag_abbv}',
                    deep: true,
                },
                get: function (flag) {
                    if (flag) {
                        return AbraxaConstants.urls.staticAbraxa + 'flags/1x1/' + flag.toLowerCase() + '.svg';
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'div',
                            flex: 1,
                            margin: '0 24 0 0',
                            html: '<h2>Manager information</h2>',
                        },
                        {
                            xtype: 'div',
                            flex: 1,
                            margin: '0 0 0 24',
                            html: '<h2>Owner information</h2>',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        wrap: true,
                    },
                    cls: 'a-vessel-data a-management-info',
                    defaults: {
                        xtype: 'container',
                        layout: 'vbox',
                        flex: 1,
                        defaults: {
                            xtype: 'displayfield',
                            ui: 'default',
                            encodeHtml: false,
                            padding: 8,
                            labelAlign: 'left',
                            bodyAlign: 'end',
                            labelWidth: 'auto',
                        },
                    },
                    items: [
                        {
                            //container
                            margin: '0 24 0 0',
                            items: [
                                {
                                    label: 'Manager name',
                                    bind: {
                                        value: '{vesselsGrid.selection.manager_name}',
                                    },
                                    renderer: function (value, item) {
                                        if (value) return value;

                                        return AbraxaConstants.placeholders.emptyValue;
                                    },
                                },
                                {
                                    label: 'Manager address',
                                    cls: 'a-displayfield-address',
                                    bind: {
                                        value: '{vesselsGrid.selection.manager_address}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        }

                                        return value;
                                    },
                                },
                                {
                                    label: 'Manager web site',
                                    bind: {
                                        value: '{vesselsGrid.selection.manager_web}',
                                    },
                                    renderer: function (value, item) {
                                        if (Abraxa.utils.Functions.isValue(value)) {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        }

                                        return value;
                                    },
                                },
                            ],
                        },
                        {
                            //container
                            margin: '0 0 0 24',
                            items: [
                                //displayfield

                                {
                                    label: 'Owner name',
                                    bind: {
                                        value: '{vesselsGrid.selection.owner_name ? vesselsGrid.selection.owner_name : "---"}',
                                    },
                                },
                                {
                                    label: 'Owner address',
                                    cls: 'a-displayfield-address',
                                    bind: {
                                        value: '{vesselsGrid.selection.owner_address ? vesselsGrid.selection.owner_address : "---"}',
                                    },
                                },
                                {
                                    label: 'Owner web site',
                                    bind: {
                                        value: '{vesselsGrid.selection.owner_web ? vesselsGrid.selection.owner_web : "---"}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});

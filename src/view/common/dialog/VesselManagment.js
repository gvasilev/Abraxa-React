Ext.define('Abraxa.view.common.dialog.VesselManagment', {
    extend: 'Ext.Container',
    xtype: 'vessel.main.managment',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    viewModel: {
        formulas: {
            managingFlag: {
                bind: {
                    bindTo: '{vessel.managing_owner.flag_abbv}',
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
                    bindTo: '{vessel.group_owner.flag_abbv}',
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
                    bindTo: '{vessel.registered_owner.flag_abbv}',
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
                    bindTo: '{vessel.operator.flag_abbv}',
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
                                        value: '{vessel.manager_name}',
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
                                        value: '{vessel.manager_address}',
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
                                        value: '{vessel.manager_web}',
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
                                        value: '{vessel.owner_name ? vessel.owner_name : "---"}',
                                    },
                                },
                                {
                                    label: 'Owner address',
                                    cls: 'a-displayfield-address',
                                    bind: {
                                        value: '{vessel.owner_address ? vessel.owner_address : "---"}',
                                    },
                                },
                                {
                                    label: 'Owner web site',
                                    bind: {
                                        value: '{vessel.owner_web ? vessel.owner_web : "---"}',
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

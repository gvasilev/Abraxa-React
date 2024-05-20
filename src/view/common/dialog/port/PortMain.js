import './PortMainViewModel';
import './PortDialogInfo';

Ext.define('Abraxa.view.common.dialog.PortMain', {
    extend: 'Ext.Dialog',
    xtype: 'port.main',
    ui: 'dialog-md type3',
    minWidth: '1180',
    cls: 'a-dialog-color a-dialog-port',
    margin: 0,
    padding: 0,
    maxHeight: '90%',
    height: 768,
    viewModel: {
        type: 'port-main-viewmodel',
    },
    hideAnimation: null,
    layout: 'vbox',
    tbar: {
        ui: 'toolbar-panel-top',
        layout: {
            type: 'hbox',
            align: 'middle',
        },
        items: [
            {
                xtype: 'container',
                minWidth: 360,
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                },
                flex: 1,
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'tool',
                        ui: 'tool-md',
                        iconCls: 'md-icon-close',
                        tooltip: {
                            anchorToTarget: true,
                            html: 'Close',
                            align: 'bc-tc?',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                        },
                        handler: function () {
                            this.up('dialog').destroy();
                        },
                    },
                ],
            },
        ],
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-dialog-bgr',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-img-wrap',
                            items: [
                                {
                                    xtype: 'image',
                                    align: 'stretch',
                                    itemId: 'portImageItemId',
                                    layout: 'fit',
                                    minHeight: 196,
                                    flex: 1,
                                    bind: {
                                        src: '{port.code ? "https://static.abraxa.com/ports/"+port.code+".jpg": "https://static.abraxa.com/images/no-image-port.svg"}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: 'vbox',
                            scrollable: true,
                            defaults: {
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '12 0',
                                defaults: {
                                    xtype: 'displayfield',
                                    ui: 'default',
                                    encodeHtml: false,
                                    cls: 'col-6',
                                    renderer: function (value) {
                                        if (value) {
                                            return value;
                                        } else {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    items: [
                                        {
                                            labelAlign: 'top',
                                            ui: 'field-xl',
                                            cls: 'col-12',
                                            margin: '0 0 12 0',
                                            bind: {
                                                label: '{port.type}',
                                                value: '<div class="hbox"><img data-qtip="{port.country}" data-qalign="bc-tc" height="24" class="a-img-round mr-16" src="https://static.abraxa.com/flags/1x1/{port.flag_abv_2_letters:lowercase}.svg" alt="" />{port.name} <span class="text-uppercase ml-2">({port.flag_abv_2_letters})</span></div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Locode',
                                            bind: {
                                                value: '{port.locode}',
                                            },
                                        },
                                        {
                                            label: 'Timezone',
                                            bind: {
                                                value: '{port.time_zone}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Coordinates',
                                            bind: {
                                                value: '{calculateLatCoordinates}',
                                            },
                                        },
                                        {
                                            label: '&nbsp;',
                                            bind: {
                                                value: '{calculateLonCoordinates}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Season',
                                            cls: 'col-6 a-val-capitalize',
                                            bind: {
                                                value: '{port.season}',
                                            },
                                        },
                                        {
                                            label: 'Water Salinity',
                                            cls: 'col-6 a-val-capitalize',
                                            bind: {
                                                value: '{port.water}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: '(S)ECA',
                                            bind: {
                                                value: '{port.is_seca}',
                                            },
                                        },
                                        {
                                            label: 'Shelter Afforded',
                                            bind: {
                                                value: '{port.shelter_afforded_code}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Harbor Size',
                                            bind: {
                                                value: '{port.harbor_size_code}',
                                            },
                                        },
                                        {
                                            label: 'Harbor Type',
                                            bind: {
                                                value: '{port.harbor_type_code}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'port.dialog.info',
                    flex: 8,
                },
            ],
        },
    ],
    listeners: {
        destroy: function (me) {
            let portServed = Ext.getCmp('main-viewport').getVM().get('portsServed'),
                port = me.upVM().get('port'),
                portRecord = portServed.findRecord('port_id', port.get('id'), 0, false, false, true);

            if (portRecord) {
                portRecord.load();
            }
        },
    },
});

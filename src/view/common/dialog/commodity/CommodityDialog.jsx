Ext.define('Abraxa.view.common.dialog.Commodity', {
    extend: 'Ext.Dialog',
    xtype: 'common.dialog.commodity',
    itemId: 'commodityDialog',
    cls: 'a-dialog-color a-dialog-commodity',
    ui: 'dialog-md type3',
    minWidth: '960',
    maxWidth: '960',
    margin: 0,
    padding: 0,
    tbar: {
        ui: 'toolbar-panel-top',
        layout: {
            type: 'hbox',
            align: 'middle',
        },
        items: [
            {
                xtype: 'div',
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
                        iconCls: 'md-icon-edit',
                        bind: {
                            hidden: '{commodity.company_id ? false:true}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            html: 'Edit',
                            align: 'bc-tc?',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                        },
                        handler: function (btn, e) {
                            let me = this,
                                record = me.upVM().get('commodity');
                            let dialog = Ext.create('Abraxa.view.settings.library.cargoes.AddCargoes', {
                                viewModel: {
                                    parent: btn.upVM(),
                                    data: {
                                        cargo: record,
                                        file: null,
                                        editMode: true,
                                    },
                                    formulas: {
                                        commodityImg: {
                                            bind: {
                                                bindTo: '{commodity}',
                                                deep: true,
                                            },
                                            get: function (selection) {
                                                if (selection) {
                                                    if (selection.get('image_name')) {
                                                        return (
                                                            'https://static.abraxa.com/images/commodities/' +
                                                            selection.get('image_name')
                                                        );
                                                    } else {
                                                        if (selection.get('image_url')) {
                                                            return selection.get('image_url');
                                                        }
                                                        return 'https://static.abraxa.com/images/bgr-no-cargo.svg';
                                                    }
                                                } else {
                                                    return 'https://static.abraxa.com/images/bgr-no-cargo.svg';
                                                }
                                            },
                                        },
                                    },
                                },
                            });
                            dialog.show();
                        },
                    },
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
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-dialog-bgr',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-img-wrap',
                            items: [
                                {
                                    xtype: 'image',
                                    itemId: 'imageHeadCommodity',
                                    align: 'stretch',
                                    layout: 'fit',
                                    minHeight: 196,
                                    flex: 1,
                                    bind: {
                                        src: '{commodityImg}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            defaults: {
                                xtype: 'displayfield',
                                labelAlign: 'left',
                                labelWidth: 180,
                                renderer: function (value, field) {
                                    var label = field.getLabel();
                                    if (value) {
                                        return value;
                                    } else {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    }
                                },
                            },

                            items: [
                                {
                                    labelAlign: 'top',
                                    ui: 'field-xl',
                                    margin: '12 0 16 0',
                                    bind: {
                                        label: '{commodity.type}',
                                        value: '{commodity.name}',
                                    },
                                },
                                {
                                    label: 'UN Number',
                                    bind: {
                                        value: '{commodity.un_number}',
                                    },
                                },
                                {
                                    label: 'Angle of repose',
                                    bind: {
                                        value: '{commodity.angle_of_repose}',
                                    },
                                },
                                {
                                    label: 'SF m3/mt (from)',
                                    bind: {
                                        value: '{commodity.sf_from}',
                                    },
                                },
                                {
                                    label: 'SF m3/mt (to)',
                                    bind: {
                                        value: '{commodity.sf_to}',
                                    },
                                },
                                {
                                    label: 'Humidity Moisture % (from)',
                                    bind: {
                                        value: '{commodity.humidity_moisture_from}',
                                    },
                                },
                                {
                                    label: 'Humidity Moisture % (to)',
                                    bind: {
                                        value: '{commodity.humidity_moisture_to}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    margin: '8 0',
                                    style: 'opacity: 0.4;',
                                    html: '<hr>',
                                },
                                {
                                    label: 'Reference ID',
                                    bind: {
                                        value: '{commodity.reference}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 8,
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'div',
                            padding: '24 32',
                            html: '<div class="h2 mt-0">Description</div>',
                        },
                        {
                            xtype: 'container',
                            padding: '0 32 16 32',
                            flex: 1,
                            maxHeight: 540,
                            scrollable: true,
                            items: [
                                {
                                    xtype: 'div',
                                    minHeight: 150,
                                    cls: 'text-break',
                                    bind: {
                                        html: '{(commodity.description == "") ? "---" : commodity.description}',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    margin: '16 0 0 0',
                                    items: [
                                        {
                                            xtype: 'div',
                                            html: '<h2>Risk factors</h2>',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'text-break',
                                            bind: {
                                                html: '{(commodity.risk_factors == "") ? "---" : commodity.risk_factors}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});

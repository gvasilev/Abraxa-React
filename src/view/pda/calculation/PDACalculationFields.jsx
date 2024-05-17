Ext.define('Abraxa.view.pda.calculation.PDACalculationFields', {
    extend: 'Ext.Container',
    xtype: 'pda.calculation.fields',
    cls: 'a-summary-left-container',
    layout: 'vbox',
    hidden: true,
    items: [
        {
            cls: 'a-portcall-info',
            flex: 1,
            scrollable: true,
            layout: 'vbox',
            items: [
                {
                    xtype: 'div',
                    height: 64,
                    cls: 'a-vessel-title a-bb-100',
                    bind: {
                        html: '{portTitle}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a.a-port-link',
                            fn: function (el) {
                                let portId = el.target.getAttribute('data-portid');
                                if (portId) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .showPortDialogById(portId);
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'container',
                    itemId: 'offerDataFieldsContainer',
                    cls: 'a-data-fields-container',
                    // controller: 'calculation.controller',
                    bind: {
                        items: '{offerDataFields}',
                    },
                    padding: '16 24 8',
                },
            ],
        },
    ],
});

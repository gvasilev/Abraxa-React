Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalDialog', {
    extend: 'Ext.Dialog',
    xtype: 'SuggestTerminalDialog',
    cls: 'a-dialog-fullscreen a-dialog-card-layout',
    scrollable: 'y',
    fullscreen: true,
    // closable: true,
    draggable: false,
    width: '100%',
    height: '100%',
    title: false,
    controller: 'suggests.controller',
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let dialog = Ext.ComponentQuery.query('[xtype=SuggestTerminalDialog]')[0];
            Ext.Msg.confirm(
                'Confirmation',
                'Would you like to discard all changes?',
                function (answer) {
                    if (answer == 'yes') {
                        dialog.destroy();
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
                        enableToggle: true,
                        ui: 'action loading',
                        text: 'Discard',
                    },
                ]
            );
        },
    },
    tools: {
        close: {
            tooltip: {
                showOnTap: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
            },
            handler: function () {
                let dialog = this.up('dialog');
                Ext.Msg.confirm(
                    'Confirmation',
                    'Would you like to discard all changes?',
                    function (answer) {
                        if (answer == 'yes') {
                            dialog.destroy();
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
                            enableToggle: true,
                            ui: 'action loading',
                            text: 'Discard',
                        },
                    ]
                );
            },
        },
    },
    items: [
        {
            xtype: 'div',
            cls: 'a-dialog-card-title a-dialog-has-icon',
            bind: {
                html: "Let's add a Terminal",
            },
        },
        {
            xtype: 'formpanel',
            cls: 'a-dialog-card a-dialog-card-md',
            scrollable: 'y',
            padding: 0,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    minHeight: 64,
                    padding: '0 32',
                    items: [
                        {
                            xtype: 'title',
                            cls: 'fs-18',
                            title: 'Terminal information',
                        },
                        {
                            xtype: 'button',
                            ui: 'default small',
                            iconCls: 'md-icon-collapse-all',
                            text: 'Collapse all',
                            handler: function (me) {
                                let containers = Ext.ComponentQuery.query('[cls~=a-collapsible-trigger]');
                                if (me.getText() == 'Expand all') {
                                    me.setText('Collapse all');
                                    me.setIconCls('md-icon-collapse-all');
                                } else {
                                    me.setText('Expand all');
                                    me.setIconCls('md-icon-expand-all');
                                }
                                Ext.Array.each(containers, function (container) {
                                    container.el.dom.click();
                                });
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-header-info-bar',
                    layout: {
                        type: 'hbox',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-header-info-item',
                            bind: {
                                html: '<div class="a-header-info-title sm-title">Port</div><div class="a-header-info-value">{selectedPort.port_name}</div>',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-header-info-item',
                            bind: {
                                html: '<div class="a-header-info-title sm-title">IMO</div><div class="a-header-info-value">{selectedPort.meta_imo_port_facility_number ? selectedPort.meta_imo_port_facility_number :"<span class=\'a-cell-placeholder\'>---</span>"}</div>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-dialog-card-body',
                    defaults: {
                        clearable: false,
                        labelAlign: 'top',
                        ui: 'classic field-lg',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-info-box a-danger-box errors_div',
                            hidden: true,
                            margin: '0 0 16 0',
                            layout: {
                                type: 'hbox',
                                align: 'start',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<i class="md-icon">emergency_home</i>',
                                },
                                {
                                    xtype: 'div',
                                    html: '',
                                },
                            ],
                        },
                        {
                            xtype: 'textfield',
                            label: 'Terminal name',
                            name: 'Terminal name',
                            labelAlign: 'top',
                            placeholder: 'Enter title',
                            cls: 'a-field-icon icon-warehouse icon-rounded',
                            required: true,
                            bind: {
                                value: '{record.meta_name}',
                            },
                            listeners: {
                                painted: function (me) {
                                    setTimeout(() => {
                                        me.focus();
                                    }, 300);
                                },
                            },
                        },
                        {
                            //General section
                            xtype: 'SuggestTerminalGeneral',
                        },
                        {
                            //Coordinates section
                            xtype: 'SuggestTerminalCoordinates',
                        },
                        {
                            //Additional Terminal Information section
                            xtype: 'SuggestTerminalAdditional',
                        },
                        {
                            //Restrictions section
                            xtype: 'SuggestTerminalRestrictions',
                        },
                        {
                            //Max vessel sizes entries
                            xtype: 'SuggestTerminalMaxVessel',
                        },
                        {
                            //Special goods section
                            xtype: 'SuggestTerminalSpecialGoods',
                        },
                        {
                            //Loading and Discharging Rates section
                            xtype: 'SuggestTerminalLDRates',
                        },
                        {
                            //Storage Capacity section
                            xtype: 'SuggestTerminalStorage',
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        cls: 'a-dialog-card-footer',
        items: [
            {
                xtype: 'container',
                cls: 'a-dialog-card-footer-inner a-dialog-card-footer-inner-md',
                layout: {
                    type: 'vbox',
                    align: 'end',
                    pack: 'space-between',
                },
                items: [
                    {
                        xtype: 'container',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Cancel',
                                margin: '0 8',
                                handler: function (me) {
                                    Ext.Msg.confirm(
                                        'Confirmation',
                                        'Would you like to discard all changes?',
                                        function (answer) {
                                            if (answer == 'yes') {
                                                me.up('dialog').destroy();
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
                                                enableToggle: true,
                                                ui: 'action loading',
                                                text: 'Discard',
                                            },
                                        ]
                                    );
                                },
                            },
                            {
                                xtype: 'button',
                                enableToggle: true,
                                ui: 'action loading terminalSubmission',
                                text: 'Submit for preview',
                            },
                        ],
                    },
                ],
            },
        ],
    },
});

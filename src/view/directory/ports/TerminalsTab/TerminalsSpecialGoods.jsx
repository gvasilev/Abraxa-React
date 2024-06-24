Ext.define('Abraxa.view.directory.ports.TerminalsTab.TerminalsSpecialGoods', {
    extend: 'Ext.Container',
    xtype: 'TerminalsSpecialGoods',
    items: [
        {
            xtype: 'div',
            html: 'Special Goods',
            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right is-collapsed',
            listeners: {
                click: {
                    element: 'element',
                    fn: function fn() {
                        let component = this.component;
                        component.toggleCls('is-collapsed');
                        component.up('container').down('[cls~=a-collapsible-container]').toggleCls('is-collapsed');
                    },
                },
            },
        },
        {
            xtype: 'container',
            cls: 'a-collapsible-container is-collapsed',
            layout: {
                type: 'hbox',
                justify: 'space-between',
            },
            items: [
                {
                    //left container
                    xtype: 'container',
                    margin: '0 32 0 0',
                    flex: 1,
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        //every item is container because of parent defaults
                        {
                            //first row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Hazardous goods',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoCargoDangerousGoodsTerminal}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Radioactive goods',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoCargoRadioactiveTerminal}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    //right container
                    xtype: 'container',
                    margin: '0 0 0 32',
                    flex: 1,
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        //every item is container because of parent defaults
                        {
                            //first row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Livestock',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoCargoLivestockTerminal}',
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

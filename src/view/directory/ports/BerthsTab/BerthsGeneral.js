Ext.define('Abraxa.view.directory.ports.BerthsTab.BerthsGeneral', {
    extend: 'Ext.Container',
    xtype: 'BerthsGeneral',
    items: [
        {
            xtype: 'div',
            html: 'General Information',
            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right',
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
            cls: 'a-collapsible-container',
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
                                    html: 'Alternative Names',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.meta_name_alternatives ? selectedRecord.meta_name_alternatives : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Location Type',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.meta_type ? selectedRecord.meta_type : "<span class=\'a-placeholder\'>---</span>" }',
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
                                    html: 'Operation Status',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.meta_status ? selectedRecord.meta_status : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'ISPS',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{selectedRecord.meta_ISPS ? selectedRecord.meta_ISPS : "<span class=\'a-placeholder\'>---</span>" }',
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

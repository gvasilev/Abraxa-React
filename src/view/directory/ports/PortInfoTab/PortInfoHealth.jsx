Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoHealth', {
    extend: 'Ext.Container',
    xtype: 'PortInfoHealth',
    items: [
        {
            xtype: 'div',
            html: 'Health Information',
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
                                    html: 'Free Pratique',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.quarantine_pratique ? object_record.quarantine_pratique : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Deratting certificate',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.quarantine_deratt_cert ? object_record.quarantine_deratt_cert : "<span class=\'a-placeholder\'>---</span>"}',
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
                                    html: 'Crew vaccination required',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        // TODO: quarantine_crew_vaccination does not exist in DB???
                                        html: '{object_record.quarantine_crew_vaccination ? object_record.quarantine_crew_vaccination : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Other',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.quarantine_other ? object_record.quarantine_other : "<span class=\'a-placeholder\'>---</span>"}',
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

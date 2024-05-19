Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoAdditional', {
    extend: 'Ext.Container',
    xtype: 'PortInfoAdditional',
    items: [
        {
            xtype: 'div',
            html: 'Additional Port Info',
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
                                    html: 'Harbor Size',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.harbor_size_code ? object_record.harbor_size_code : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Harbor Type',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.harbor_type_code ? object_record.harbor_type_code : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Shelter',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.shelter_afforded_code ? object_record.shelter_afforded_code : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Water Salinity',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.info_salinity ? object_record.info_salinity:"<span class=\'a-placeholder\'>---</span>"}',
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
                                    html: 'Water Density',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.info_water_density ? object_record.info_water_density : "<span class=\'a-placeholder\'>---</span>" }',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Noa Deadline',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.info_noa_deadline ? object_record.info_noa_deadline:"<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'US Representative',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.info_us_representative ? object_record.info_us_representative:"<span class=\'a-placeholder\'>---</span>"}',
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

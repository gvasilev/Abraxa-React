Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoGeneral', {
    extend: 'Ext.Container',
    xtype: 'PortInfoGeneral',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'space-between',
    },
    items: [
        //left container for port info
        {
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
                            html: 'Alternative names',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.meta_name_alternatives ? object_record.meta_name_alternatives:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    //second row container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Location type',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.location_type ? object_record.location_type:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    //third row container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Operational Status',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.operational_status ? object_record.operational_status:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    //fourth row container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Region',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.region ? object_record.region:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    //fifth row container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Subregion',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.subregion ? object_record.subregion:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    //sixth row container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Country name',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.countries ? object_record.countries.country_name:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    //seventh row container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'UN Country subdivision',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.countries ? object_record.countries.country_code:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    //eighth row container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'ISPS',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.isps ? object_record.isps:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    //ninth row container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Load lines',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.load_lines ? object_record.load_lines:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
            ],
        },
        //right container for image
        // TODO: Replace "no-image-port.svg" image with the new one
        {
            xtype: 'image',
            cls: 'a-port-image',
            align: 'stretch',
            layout: 'fit',
            flex: 1,
            bind: {
                src: '{portImg}',
            },
        },
    ],
});

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
                                html: '{alternativeNames}',
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
                                html: '{object_record.meta_type ? object_record.meta_type : "<span class=\'a-placeholder\'>---</span>"}',
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
                                html: '{object_record.meta_status ? object_record.meta_status : "<span class=\'a-placeholder\'>---</span>"}',
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
                                html: '{object_record.meta_region ? object_record.meta_region:"<span class=\'a-placeholder\'>---</span>"}',
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
                                html: '{object_record.meta_subregion ? object_record.meta_subregion:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                // sixth row container
                {
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'UN Country subdivision',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.meta_subdivision ? object_record.meta_subdivision :"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                // seventh row container
                {
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'ISPS',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{object_record.meta_isps ? object_record.meta_isps:"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
                {
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Load lines',
                        },
                        {
                            cls: 'a-display-value fw-b',
                            bind: {
                                html: '{getLoadLines}',
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

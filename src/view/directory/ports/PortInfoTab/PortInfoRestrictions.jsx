Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoRestrictions', {
    extend: 'Ext.Container',
    xtype: 'PortInfoRestrictions',
    items: [
        {
            xtype: 'div',
            html: 'Restrictions',
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
                                    html: 'Channel Draft',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{minMaxChannelDraft}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Anchorage Draft',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{minMaxAnchorageDraft}',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Daylight Navigation',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoDaylightNavigation}',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'International Navigation Limits',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{object_record.restriction_inl ? object_record.restriction_inl : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            //sixth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Swell',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoSwell}',
                                    },
                                },
                            ],
                        },
                        {
                            //seventh row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Piracy',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoPiracy}',
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
                                    html: 'War Area',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoWarArea}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'SECA',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoSeca}',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Tides',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoTides}',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'First Port of Entry',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoFirstPortOfEntry}',
                                    },
                                },
                            ],
                        },
                        {
                            //fifth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Armed Guards',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoArmedGuards}',
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

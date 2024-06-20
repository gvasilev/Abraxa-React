Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoCoordinates', {
    extend: 'Ext.Container',
    xtype: 'PortInfoCoordinates',
    items: [
        {
            xtype: 'div',
            html: 'Coordinates',
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
                pack: 'space-between',
            },
            flex: 1,
            defaults: {
                xtype: 'container',
                cls: 'a-display-item',
                flex: 1,
                defaults: {
                    //every container have also defaults
                    xtype: 'div',
                    flex: 1,
                },
            },
            items: [
                //every item is container because of parent defaults
                {
                    //first column container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Location coordinates',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: '{portCoordinates}',
                            },
                        },
                    ],
                },
                {
                    //second column container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Entrance coordinates',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: '{entranceCoordinates}',
                            },
                        },
                    ],
                },
                {
                    //third column container
                    items: [
                        {
                            cls: 'a-display-label',
                            html: 'Pilot station coordinates',
                        },
                        {
                            cls: 'a-display-value',
                            bind: {
                                html: '{pilotStationCoordinates}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

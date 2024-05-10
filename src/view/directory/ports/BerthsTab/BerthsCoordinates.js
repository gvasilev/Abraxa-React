Ext.define('Abraxa.view.directory.ports.BerthsTab.BerthsCoordinates', {
    extend: 'Ext.Container',
    xtype: 'BerthsCoordinates',
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
                                html: '{selectedRecord.coordinates_center ? selectedRecord.coordinates_center.latitude :"<span class=\'a-placeholder\'>---</span>"}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortCoordinates', {
    extend: 'Ext.Container',
    xtype: 'SuggestPortCoordinates',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            html: 'Coordinates',
            ripple: true,
            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-left fs-14',
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
            items: [
                {
                    xtype: 'container',
                    cls: 'a-form-container a-form-3cols',
                    layout: {
                        type: 'hbox',
                        wrap: true,
                    },
                    defaults: {
                        flex: 1,
                        defaults: {
                            labelMinWidth: '70px',
                            labelWidth: '70px',
                            margin: '0 0 8 0',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-title text-uppercase',
                                    html: 'Port Coordinates',
                                },
                                {
                                    xtype: 'Latitudefield',
                                    label: 'Latitude',
                                    name: 'Latitude',
                                    labelAlign: 'left',
                                    ui: 'classic field-md',
                                    placeholder: 'Port Latitude',
                                    bind: {
                                        value: '{record.coordinates_center_latitude}',
                                    },
                                },
                                {
                                    xtype: 'Longitudefield',
                                    name: 'Longitude',
                                    labelAlign: 'left',
                                    ui: 'classic field-md',
                                    placeholder: 'Port Longitude',
                                    bind: {
                                        value: '{record.coordinates_center_longitude}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            margin: '8 16',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-title text-uppercase',
                                    html: 'Entrance Coordinates',
                                },
                                {
                                    xtype: 'Latitudefield',
                                    label: 'Latitude',
                                    labelAlign: 'left',
                                    ui: 'classic field-md',
                                    placeholder: 'Entrance Latitude',
                                    bind: {
                                        value: '{record.coordinates_entrance_latitude}',
                                    },
                                },
                                {
                                    xtype: 'Longitudefield',
                                    labelAlign: 'left',
                                    ui: 'classic field-md',
                                    placeholder: 'Entrance Longitude',
                                    bind: {
                                        value: '{record.coordinates_entrance_longitude}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-title text-uppercase',
                                    html: 'Pilot Station Coordinates',
                                },
                                {
                                    xtype: 'Latitudefield',
                                    label: 'Latitude',
                                    labelAlign: 'left',
                                    ui: 'classic field-md',
                                    placeholder: 'Pilot Station Latitude',
                                    bind: {
                                        value: '{record.coordinates_pilot_station_latitude}',
                                    },
                                },
                                {
                                    xtype: 'Longitudefield',
                                    labelAlign: 'left',
                                    ui: 'classic field-md',
                                    placeholder: 'Pilot Station Longitude',
                                    bind: {
                                        value: '{record.coordinates_pilot_station_longitude}',
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

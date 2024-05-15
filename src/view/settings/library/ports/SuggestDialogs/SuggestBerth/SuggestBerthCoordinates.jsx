import '../../../../../common/filelds/latitude.jsx';
import '../../../../../common/filelds/longtitude.jsx';
Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestBerth.SuggestBerthCoordinates', {
    extend: 'Ext.Container',
    xtype: 'SuggestBerthCoordinates',
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
                            labelMinWidth: '65px',
                            labelWidth: '65px',
                            margin: '0 0 8 0',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-title text-uppercase',
                                    html: 'Berth Coordinates',
                                },
                                {
                                    xtype: 'Latitudefield',
                                    label: 'Latitude',
                                    labelAlign: 'left',
                                    ui: 'classic field-md',
                                    placeholder: 'Latitude',
                                    bind: {
                                        value: '{record.coordinates_center_latitude}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            margin: '8 24',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-title text-uppercase',
                                    html: '&nbsp;',
                                },
                                {
                                    xtype: 'Longitudefield',
                                    label: 'Longitude',
                                    labelAlign: 'left',
                                    ui: 'classic field-md',
                                    placeholder: 'Longitude',
                                    bind: {
                                        value: '{record.coordinates_center_longitude}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'a-field-container',
                        },
                    ],
                },
            ],
        },
    ],
});

Ext.define('Abraxa.view.directory.ports.PortInfoTab.PortInfoServices', {
    extend: 'Ext.Container',
    xtype: 'PortInfoServices',
    items: [
        {
            xtype: 'div',
            html: 'Services',
            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right is-collapsed',
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
            cls: 'a-collapsible-container is-collapsed',
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
                                    html: 'Internet',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesInternet}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Medical Facilities',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesMedicalFacilities}',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Garbage Disposal',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesGarbageDisposal}',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Degaussing',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesDegauss}',
                                    },
                                },
                            ],
                        },
                        {
                            //fifth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Dirty Ballast',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesDirtyBallast}',
                                    },
                                },
                            ],
                        },
                        {
                            //sixth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Steam',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesSteam}',
                                    },
                                },
                            ],
                        },
                        {
                            //seventh row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Wash Water',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesWashWater}',
                                    },
                                },
                            ],
                        },
                        {
                            //eighth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Fumigation',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesFumigation}',
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
                                    html: 'Underwater Inspection',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesUnderwaterInspection}',
                                    },
                                },
                            ],
                        },
                        {
                            //second row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Underwater Cleaning',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesUnderwaterCleaning}',
                                    },
                                },
                            ],
                        },
                        {
                            //third row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Decontainerisation',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesDecontainerisation}',
                                    },
                                },
                            ],
                        },
                        {
                            //fourth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Navigation Repair',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesNavigationRepair}',
                                    },
                                },
                            ],
                        },
                        {
                            //fifth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Electrical Repair',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoSercicesElectricalRepair}',
                                    },
                                },
                            ],
                        },
                        {
                            //sixth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Engine Repair',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesEngineRepair}',
                                    },
                                },
                            ],
                        },
                        {
                            //seventh row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Bunkering',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesBunkering}',
                                    },
                                },
                            ],
                        },
                        {
                            //eighth row container
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Crew Changes',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '{yesNoServicesCrewChanges}',
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

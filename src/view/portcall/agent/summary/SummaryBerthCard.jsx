Ext.define('Abraxa.view.portcall.summary.SummaryBerthCard', {
    extend: 'Abraxa.core.components.Container',
    xtype: 'portcall.summary.berth.card',
    cls: 'a-summary-berth-card',
    items: [
        {
            xtype: 'container',
            cls: 'a-current-berth-card chameleon_portcall_overview_current_berth',
            layout: 'vbox',
            items: [
                {
                    xtype: 'div',
                    cls: 'a-berth-badge',
                    html: '<i class="md-icon-outlined">place</i>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                    },
                    items: [
                        {
                            xtype: 'container',
                            flex: 1.5,
                            items: [
                                {
                                    xtype: 'selectfield',
                                    editable: false,
                                    cls: 'non-editable',
                                    labelAlign: 'top',
                                    valueField: 'id',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    reference: 'currentBerthSelection',
                                    label: 'Current berth',
                                    store: [],
                                    bind: {
                                        store: '{berths}',
                                        value: '{currentBerth}',
                                        label: '{currentBerthSelection.selection.is_current ? "Current berth" : "berth"}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1,
                            bind: {
                                html: '<div class="hbox"><div class="w-100 text-right"><span class="sm-title">Estimated Stay</span><div class="sm-value fs-18 fw-b">{estimatedBerthStay}</div></div></div>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '24 0 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                    },
                    items: [
                        {
                            xtype: 'div',
                            flex: 1,
                            bind: {
                                html: '<div class="hbox"><div class="w-100"><span class="sm-title">ETB</span><div class="sm-value">{berthETB}</div></div></div>',
                            },
                        },
                        {
                            xtype: 'div',
                            flex: 1,
                            bind: {
                                html: '<div class="hbox"><div class="w-100 text-right"><span class="sm-title">ETD</span><div class="sm-value">{berthETD}</div></div></div>',
                            },
                        },
                    ],
                },
                // {
                //     xtype: 'div',
                //     cls: 'a-view-more',
                //     html: '<a  href="javascript:void(0);" class="md-icon-outlined">arrow_right_alt</a>'
                // }
            ],
        },
    ],
});

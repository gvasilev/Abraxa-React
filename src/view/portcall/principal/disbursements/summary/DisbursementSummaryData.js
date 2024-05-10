Ext.define('Abraxa.view.portcall.principal.disbursements.summary.DisbursementSummaryData', {
    extend: 'Ext.Container',
    xtype: 'DisbursementSummaryData',
    flex: 1,
    padding: '16 24',
    cls: 'border-radius bordered',
    items: [
        {
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    html: '<div class="fw-b text-uppercase mb-8">Disbursement details</div>',
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
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Disbursement type',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '<span class="a-status-badge rounded text-uppercase status-{selectedDisbursement.type}">{selectedDisbursement.type:uppercase}</span>',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Disbursement ID',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{selectedDisbursement.group_id}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Status',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '<div class="a-status-badge a-status-md status-{selectedDisbursement.status}" style="height: 24px;">{selectedDisbursement.status:capitalize}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    html: 'Currency',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '<span class="fw-b">{selectedDisbursement.disbursement_currency}</span> <span class="c-blue-grey">({selectedDisbursement.exchange_rate})</span>',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    html: '<div class="fw-b text-uppercase mb-8">Port call details</div>',
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
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    maxWidth: 80,
                                    html: 'Agent',
                                },
                                {
                                    cls: 'a-display-value fw-b',
                                    bind: {
                                        html: '<a href="javascript:void(0)" class="org_name" data-email="{portCallRecord.nomination.lead_agent_email}">{portCallRecord.nomination.lead_agent_name}</a>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let email = el.currentTarget.getAttribute('data-email');
                                                if (email) {
                                                    Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .showTenantByEmail(email, el);
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    maxWidth: 80,
                                    html: 'Port',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '<a href="javascript:void(0)" data-portId="{portCallRecord.port_id}">{portCallRecord.port_name}</a>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let portId = el.currentTarget.getAttribute('data-portId');
                                                if (portId) {
                                                    Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .showPortDialogById(portId);
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    maxWidth: 80,
                                    html: 'АТА',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{portCallRecord.port_ata ? (portCallRecord.port_ata:date("d M Y - H:i")) : "<span class=\'a-placeholder\'>---</span>"}',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    cls: 'a-display-label',
                                    maxWidth: 80,
                                    html: 'ATD',
                                },
                                {
                                    cls: 'a-display-value',
                                    bind: {
                                        html: '{portCallRecord.port_atd ? (portCallRecord.port_atd:date("d M Y - H:i")) : "<span class=\'a-placeholder\'>---</span>"}',
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

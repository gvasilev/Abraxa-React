import './AgentsController';
import '../../../core/components/charts/AbraxaGoogleMap';

Ext.define('Abraxa.view.directory.agents.AgentInfo', {
    extend: 'Ext.Container',
    xtype: 'AgentInfo',
    flex: 1,
    type: 'vbox',
    scrollable: true,
    cls: 'a-agent-profile-body',
    controller: 'AgentsController',
    viewModel: 'AgentDetailsViewModel',
    items: [
        // Directory inner wrapper
        {
            xtype: 'container',
            cls: 'a-directory-inner-wrapper',
            items: [
                // Company info
                {
                    xtype: 'container',
                    cls: 'a-directory-section a-directory-main-section a-non-hoverable',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        // Company details
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
                                    xtype: 'div',
                                },
                            },
                            items: [
                                {
                                    items: [
                                        {
                                            html: 'Country',
                                            cls: 'a-display-label',
                                        },
                                        {
                                            bind: {
                                                html: '{object_record.country || "<span class=\'a-placeholder\'>---</span>" }',
                                            },
                                            cls: 'a-display-value',
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            html: 'Address',
                                            cls: 'a-display-label',
                                        },
                                        {
                                            bind: {
                                                html: '{(object_record.address ? (object_record.city_name ? object_record.city_name + ", " : "") + object_record.address : (object_record.city_name ? object_record.city_name : "<span class=\'a-placeholder\'>---</span>" ))}',
                                            },
                                            cls: 'a-display-value',
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            html: 'Tel',
                                            cls: 'a-display-label',
                                        },
                                        {
                                            bind: {
                                                html: '{object_record.phone || "<span class=\'a-placeholder\'>---</span>"}',
                                            },
                                            cls: 'a-display-value',
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            html: 'Fax',
                                            cls: 'a-display-label',
                                        },
                                        {
                                            bind: {
                                                html: '{object_record.fax || "<span class=\'a-placeholder\'>---</span>"}',
                                            },
                                            cls: 'a-display-value',
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            html: 'E-mail',
                                            cls: 'a-display-label',
                                        },
                                        {
                                            bind: {
                                                // TODO: Implement email link: <a href="mailto:object_record.email">object_record.email</a>
                                                html: '{object_record.email ? "<a href=\'mailto:" + object_record.email + "\'>" + object_record.email + "</a>" : "<span class=\'a-placeholder\'>---</span>"}',
                                            },
                                            cls: 'a-display-value',
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            html: 'Web',
                                            cls: 'a-display-label',
                                        },
                                        {
                                            bind: {
                                                // TODO: Implement website link: <a href="object_record.website" target="_blank">object_record.website</a>
                                                // html: '{object_record.website || "<span class=\'a-placeholder\'>---</span>"}'
                                                html: '{object_record.website ? "<a href=\'http://" + object_record.website + "\' target=\'_blank\'>" + object_record.website + "</a>" : "<span class=\'a-placeholder\'>---</span>"}',
                                            },
                                            cls: 'a-display-value',
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            html: 'VAT',
                                            cls: 'a-display-label',
                                        },
                                        {
                                            bind: {
                                                html: '{object_record.vat || "<span class=\'a-placeholder\'>---</span>"}',
                                            },
                                            cls: 'a-display-value',
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            html: 'Trade Register',
                                            cls: 'a-display-label',
                                        },
                                        {
                                            bind: {
                                                html: '{object_record.trade_reg || "<span class=\'a-placeholder\'>---</span>"}',
                                            },
                                            cls: 'a-display-value',
                                        },
                                    ],
                                },
                            ],
                        },
                        // Do not decode reverse geolocation on client - EXPENSIVE!
                        // TODO: Separate google map styling in css file? (Not so trivial because of the google maps api)
                        {
                            xtype: 'AbraxaGoogleMap',
                            minWidth: 350,
                            minHeight: 217,
                            margin: '0 0 0 32',
                            flex: 1,
                        },
                    ],
                },
                // Ports served
                {
                    xtype: 'container',
                    cls: 'a-directory-section a-non-hoverable a-bb-100',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-section-title',
                            bind: {
                                html: 'Ports served <span class="c-grey fw-n ml-2">({portsServed.length})</span>',
                            },
                        },
                        {
                            xtype: 'componentdataview',
                            cls: 'a-port-served-dataview',
                            store: [],
                            bind: {
                                store: '{portsServed}',
                            },
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            itemConfig: {
                                xtype: 'div',
                                cls: 'a-port-data-item',
                                viewModel: true, // enable per-record binding
                                bind: {
                                    html: '<span class="a-sep-bullet"></span><a href="javascript:void(0);"> {record.port_name} </a>',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: 'a',
                                        fn: function(el) {
                                            let me = this,
                                                cmp = me.component,
                                                portId = cmp.upVM().get('record').get('port_id');

                                            if (portId) {
                                                Abraxa.getApplication()
                                                    .getController('AbraxaController')
                                                    .showPortDialogById(portId);
                                            }
                                        },
                                    },
                                },
                            },
                        },
                        //Section Entrance
                    ],
                },
                // Bank details
                {
                    xtype: 'container',
                    cls: 'a-directory-section a-non-hoverable a-bb-100',
                    layout: 'vbox',
                    // viewModel: true,
                    // bind: {
                    //     store: '{companyBankDetails}',
                    // },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-section-title',
                            // TODO: take last updated from when bank details were last updated/validated from settings
                            // bind: {
                            // html: '<div class="hbox">Bank details <span class="c-grey fs-13 fw-n"><span class="a-sep-bullet"></span>Last updated: 02 Oct 2023</span></div>'
                            html: '<div class="hbox">Bank details</div>',
                            // },
                        },
                        {
                            xtype: 'list',
                            store: [],
                            bind: {
                                store: {
                                    bindTo: '{publicBankDetails}',
                                },
                            },
                            // cls: 'a-bordered-list',
                            layout: {
                                type: 'vbox',
                                // align: 'middle',
                                pack: 'space-between',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                cls: 'a-bank-details-item a-bordered-list',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                items: [
                                    // A bank detail list item
                                    {
                                        xtype: 'container',
                                        margin: '0 32 0 0',
                                        flex: 2,
                                        defaults: {
                                            xtype: 'container',
                                            cls: 'a-display-item',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            defaults: {
                                                xtype: 'div',
                                            },
                                        },
                                        items: [
                                            {
                                                items: [
                                                    {
                                                        html: 'Bank name',
                                                        cls: 'a-display-label',
                                                    },
                                                    {
                                                        bind: {
                                                            html: '{record.bank_name || "<span class=\'a-placeholder\'>---</span>"}',
                                                        },
                                                        cls: 'a-display-value fw-b',
                                                    },
                                                ],
                                            },
                                            {
                                                items: [
                                                    {
                                                        html: 'Currency',
                                                        cls: 'a-display-label',
                                                    },
                                                    {
                                                        bind: {
                                                            html: '{record.currency || "<span class=\'a-placeholder\'>---</span>"}',
                                                        },
                                                        cls: 'a-display-value',
                                                    },
                                                ],
                                            },
                                            {
                                                items: [
                                                    {
                                                        html: 'IBAN',
                                                        cls: 'a-display-label',
                                                    },
                                                    {
                                                        bind: {
                                                            html: '{record.iban || "<span class=\'a-placeholder\'>---</span>"}',
                                                        },
                                                        cls: 'a-display-value',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'container',
                                        margin: '0 32',
                                        flex: 2,
                                        defaults: {
                                            xtype: 'container',
                                            cls: 'a-display-item',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            defaults: {
                                                xtype: 'div',
                                            },
                                        },
                                        items: [
                                            {
                                                items: [
                                                    {
                                                        html: 'SWIFT',
                                                        cls: 'a-display-label',
                                                    },
                                                    {
                                                        bind: {
                                                            html: '{record.swift_number || "<span class=\'a-placeholder\'>---</span>"}',
                                                        },
                                                        cls: 'a-display-value',
                                                    },
                                                ],
                                            },
                                            {
                                                items: [
                                                    {
                                                        html: 'Account No',
                                                        cls: 'a-display-label',
                                                    },
                                                    {
                                                        bind: {
                                                            html: '{record.account_number || "<span class=\'a-placeholder\'>---</span>"}',
                                                        },
                                                        cls: 'a-display-value',
                                                    },
                                                ],
                                            },
                                            {
                                                items: [
                                                    {
                                                        html: 'Beneficiary',
                                                        cls: 'a-display-label',
                                                    },
                                                    {
                                                        bind: {
                                                            html: '{record.beneficiary || "<span class=\'a-placeholder\'>---</span>"}',
                                                        },
                                                        cls: 'a-display-value',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'container',
                                        margin: '0 0 0 32',
                                        flex: 1,
                                    },
                                ],
                            },
                        },
                        //Section Entrance
                    ],
                },
                // About us
                {
                    xtype: 'container',
                    cls: 'a-directory-section a-non-hoverable',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-section-title',
                            html: 'About us',
                        },
                        {
                            xtype: 'div',
                            cls: 'a-info-text',
                            bind: {
                                html: '<p class="m-0">{object_record.notes || "<span class=\'a-placeholder\'>---</span>"}</p> ',
                            },
                        },
                        //Section Entrance
                    ],
                },
            ],
        },
    ],
});

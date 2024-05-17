Ext.define('Abraxa.view.pda.PDADotsMenu', {
    extend: 'Ext.Button',
    xtype: 'pda.dots.menu',
    iconAlign: 'right',
    iconCls: 'md-icon-expand-more',
    ui: 'small',
    cls: 'x-has-menu',
    text: 'More actions',
    margin: '0 0 0 8',
    arrow: false,
    bind: {
        disabled: '{pda.status !== "draft" || nonEditable}',
    },
    tooltip: {
        anchorToTarget: true,
        html: 'More actions',
        align: 'bc-tc?',
        showDelay: 0,
        hideDelay: 0,
        dismissDelay: 0,
        allowOver: false,
        closeAction: 'destroy',
    },
    menu: {
        ui: 'medium has-icons',
        items: [
            {
                text: 'Display',
                testId: 'pdaDotsMenuDisplayButton',
                iconCls: 'md-icon-outlined md-icon-visibility',
                menu: [
                    {
                        xtype: 'menucheckitem',
                        text: 'Accounting code',
                        testId: 'pdaDotsMenuDisplayAccountingCodeButton',
                        iconCls: 'md-icon-outlined md-icon-numbers',
                        hideOnClick: false,
                        bind: {
                            checked: '{pda.show_accounting_code ? true : false}',
                        },
                        handler: function (me) {
                            let pda = me.upVM().get('pda');
                            if (!pda.get('show_accounting_code')) {
                                pda.set('show_accounting_code', 1);
                                pda.save();
                            } else {
                                pda.set('show_accounting_code', 0);
                                pda.save();
                            }
                        },
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Customer code',
                        testId: 'pdaDotsMenuDisplayCustomerCodeButton',
                        hideOnClick: false,
                        iconCls: 'md-icon-outlined md-icon-format-list-numbered',
                        bind: {
                            checked: '{pda.show_customer_code ? true : false}',
                        },
                        handler: function (me) {
                            let pda = me.upVM().get('pda');
                            if (!pda.get('show_customer_code')) {
                                pda.set('show_customer_code', 1);
                                pda.save();
                            } else {
                                pda.set('show_customer_code', 0);
                                pda.save();
                            }
                        },
                    },
                ],
            },
            {
                text: 'Adjustment',
                testId: 'pdaDotsMenuAdjustmentButton',
                iconCls: 'md-icon-outlined md-icon-price-check',
                menu: [
                    {
                        xtype: 'menucheckitem',
                        text: 'VAT',
                        iconCls: 'md-icon-outlined md-icon-price-check',
                        hideOnClick: false,
                        bind: {
                            checked: '{pda.show_vat ? true : false}',
                        },
                        handler: function (me) {
                            let pda = me.upVM().get('pda');
                            if (!pda.get('show_vat')) {
                                pda.set('show_vat', 1);
                                pda.save();
                            } else {
                                pda.set('show_vat', 0);
                                pda.save();
                            }
                        },
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Discount',
                        hideOnClick: false,
                        slug: 'portcallDisbursementAdjustmentDiscount',
                        iconCls: 'md-icon-outlined md-icon-percent',
                        bind: {
                            checked: '{pda.show_discount ? true : false}',
                        },
                        handler: function (me) {
                            let pda = me.upVM().get('pda');
                            if (!pda.get('show_discount')) {
                                pda.set('show_discount', 1);
                                pda.save();
                            } else {
                                pda.set('show_discount', 0);
                                pda.save();
                            }
                        },
                    },
                ],
            },
            {
                text: 'Delete',
                testId: 'pdaDotsMenuDeleteButton',
                ui: 'decline',
                bind: {
                    disabled: '{!disableDelete}',
                },
                separator: true,
                iconCls: 'md-icon-outlined md-icon-delete',
                handler: function (me) {
                    let pda = me.upVM().get('pda'),
                        object_record = me.upVM().get('object_record');
                    Ext.Msg.confirm(
                        'Delete',
                        'Are you sure you want to delete this record?',
                        function (answer) {
                            if (answer == 'yes') {
                                Ext.Ajax.request({
                                    url:
                                        Env.ApiEndpoint +
                                        'inquiry/' +
                                        object_record.get('id') +
                                        '/pda/' +
                                        pda.get('id'),
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': null,
                                    },
                                    success: function (response) {
                                        Ext.toast('Record deleted', 2500);
                                        window.location.hash = 'inquiry/' + object_record.get('id');
                                    },
                                });
                            }
                        },
                        this,
                        [
                            {
                                xtype: 'button',
                                itemId: 'no',
                                margin: '0 8 0 0',
                                text: 'Cancel',
                            },
                            {
                                xtype: 'button',
                                itemId: 'yes',
                                ui: 'decline alt',
                                text: 'Delete',
                                testId: 'pdaDotsMenuConfirmMsgDeleteButton',
                                separator: true,
                            },
                        ]
                    );
                },
            },
            {
                text: 'Debug',
                testId: 'pdaDotsMenuDebugButton',
                ui: 'warning-light',
                separator: true,
                iconCls: 'md-icon-outlined md-icon-report-problem',
                hidden: true,
                bind: {
                    hidden: '{!calculation}',
                },
                handler: function (me) {
                    let calculation = me.upVM().get('calculation');
                    if (calculation) {
                        Ext.create('Ext.Dialog', {
                            closable: true,
                            viewModel: {
                                data: {
                                    calculation: calculation,
                                },
                            },
                            title: 'Debug calculation',
                            items: [
                                {
                                    xtype: 'abraxa.formlist',
                                    flex: 1,
                                    scrollable: true,
                                    bind: {
                                        store: '{calculation.services}',
                                    },
                                    itemConfig: {
                                        viewModel: {
                                            formulas: {
                                                service: {
                                                    bind: {
                                                        bindTo: '{record}',
                                                        deep: true,
                                                    },
                                                    get: function (service) {
                                                        if (
                                                            service &&
                                                            service.get('debug') &&
                                                            Ext.isObject(service.get('debug'))
                                                        ) {
                                                            return service;
                                                        }
                                                        return false;
                                                    },
                                                },
                                                renderDebug: {
                                                    bind: {
                                                        bindTo: '{service.debug}',
                                                        deep: true,
                                                    },
                                                    get: function (debug) {
                                                        if (debug) {
                                                            let items = [];
                                                            Ext.Object.each(debug, function (key, value) {
                                                                if (key != 'stack') {
                                                                    let item = {
                                                                        xtype: 'div',
                                                                        flex: 1,
                                                                        html:
                                                                            '<div class="hbox"><b><i class="a-icon-dot">•</i>' +
                                                                            key +
                                                                            ':</b>&nbsp;<span> ' +
                                                                            value +
                                                                            '</span></div>',
                                                                    };
                                                                    items.push(item);
                                                                }
                                                            });
                                                            return items;
                                                        }
                                                        return [];
                                                    },
                                                },
                                            },
                                        },
                                        xtype: 'container',
                                        padding: '8 16',
                                        layout: 'vbox',
                                        bind: {
                                            hidden: '{service ? false:true}',
                                        },
                                        items: [
                                            {
                                                xtype: 'div',
                                                flex: 1,
                                                bind: {
                                                    html: '<div class="hbox"><div class="a-badge small mr-16 a-badge-services"><i class="md-icon-outlined md-icon-layers"></i></div><div class="ml-12"><div class="fw-b">{service.name}</div></div>',
                                                },
                                            },
                                            {
                                                xtype: 'container',
                                                flex: 1,
                                                bind: {
                                                    items: '{renderDebug}',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                            buttons: [
                                {
                                    text: 'Close',
                                    testId: 'pdaDotsMenuDebugButtonCloseButton',
                                    ui: 'action',
                                    handler: function () {
                                        this.up('dialog').destroy();
                                    },
                                },
                            ],
                        }).show();
                    }
                },
            },
        ],
    },
});

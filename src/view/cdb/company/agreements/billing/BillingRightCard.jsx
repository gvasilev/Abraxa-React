Ext.define('Abraxa.view.cdb.company.agreements.billing.BillingRightCard', {
    extend: 'Ext.Container',
    xtype: 'agreements.billing.right.card',
    itemId: 'billingRightCard',
    testId: 'billingRightCard',
    cls: 'a-right-container',
    hidden: true,
    bind: {
        hidden: '{billingGrid.selection && !billingGrid.selection.is_checked ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        formulas: {
            dialogTitle: {
                bind: {
                    bindTo: '{billingGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return (
                            '<div class="a-badge a-badge-billing"><i class="md-icon-outlined">account_balance_wallet</i></div><div><span class="a-panel-title">' +
                            record.get('billing_name') +
                            '</span></div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
            billing: {
                bind: {
                    bindTo: '{billingGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record;
                    } else {
                        Ext.ComponentQuery.query('[itemId=billingRightCard]')[0].hide();
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '{dialogTitle}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            testId: 'billingRightCardDeleteBtn',
                            ui: 'round tool-round-md',
                            slug: 'cdbAgreementsDirectBillingDelete',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (item, el, eOpts) {
                                let vm = this.upVM(),
                                    store = vm.get('billings'),
                                    container = this.find('billingRightCard'),
                                    record = vm.get('billingGrid.selection');

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                        .getVM()
                                                        .set('newUpdate', new Date());
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function (batch) {
                                                    Ext.Msg.alert('Something went wrong', 'Could not delete record!');
                                                },
                                            });
                                        }
                                    },
                                    this,
                                    [
                                        {
                                            xtype: 'button',
                                            testId: 'billingRightCardDeleteNoBtn',
                                            itemId: 'no',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            testId: 'billingRightCardDeleteYesBtn',
                                            itemId: 'yes',
                                            ui: 'decline alt',
                                            text: 'Delete',
                                        },
                                    ]
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'billingRightCardCloseBtn',
                            handler: function (me) {
                                let record = this.upVM().get('billingGrid.selection'),
                                    grid = Ext.ComponentQuery.query('agreements\\.billing\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=agreements\\.billing\\.right.\\card]').hide();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '8 24',
            scrollable: true,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                slug: 'cdbAgreementsDirectBilling',
                bind: {
                    permission: '{userPermissions}',
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border classic',
                    label: false,
                    placeholder: 'Enter billing name',
                    testId: 'billingRightCardBillingNameField',
                    clearable: false,
                    bind: {
                        value: '{billing.billing_name}',
                    },
                    required: true,
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                        blur: function (me) {
                            let record = me.upVM().get('billing');
                            if (record.dirty) {
                                record.save({
                                    success: function () {
                                        Ext.ComponentQuery.query('[xtype=company]')[0]
                                            .getVM()
                                            .set('newUpdate', new Date());
                                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'ports.served.combo',
                    label: 'Ports',
                    testId: 'billingRightCardPortsField',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-port icon-rounded',
                    multiSelect: true,
                    forceSelection: true,
                    bind: {
                        placeholder: '{billing.port_ids ? null:"All ports"}',
                        value: '{billing.port_ids}',
                    },
                    listeners: {
                        blur: function (me) {
                            let record = me.upVM().get('billing');
                            if (record.dirty) {
                                record.save({
                                    success: function () {
                                        Ext.ComponentQuery.query('[xtype=company]')[0]
                                            .getVM()
                                            .set('newUpdate', new Date());
                                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Port function',
                    testId: 'billingRightCardPortFnField',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    forceSelection: true,
                    clearable: true,
                    placeholder: 'All functions',
                    queryMode: 'local',
                    valueField: 'name',
                    displayField: 'name',
                    bind: {
                        value: '{billing.port_function}',
                    },
                    store: {
                        type: 'berth.function',
                    },
                    listeners: {
                        painted: function (me) {
                            me.setError(null);
                        },
                        blur: function (me) {
                            let record = me.upVM().get('billing');
                            if (record.dirty) {
                                record.save({
                                    success: function () {
                                        Ext.ComponentQuery.query('[xtype=company]')[0]
                                            .getVM()
                                            .set('newUpdate', new Date());
                                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'default.expense.items.combo',
                    label: 'Service',
                    testId: 'billingRightCardServiceField',
                    placeholder: 'Search item',
                    labelAlign: 'left',
                    required: true,
                    cls: 'a-field-icon icon-search icon-rounded',
                    ui: 'classic hovered-border',
                    bind: {
                        value: '{billing.default_expense_item_id}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('billing');
                                record.set('default_expense_item_name', selection.get('name'));
                            }
                        },
                        blur: function (me) {
                            let record = me.upVM().get('billing');
                            if (record.dirty) {
                                record.save({
                                    success: function () {
                                        Ext.ComponentQuery.query('[xtype=company]')[0]
                                            .getVM()
                                            .set('newUpdate', new Date());
                                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'organization.combo',
                    placeholder: 'Choose Company',
                    testId: 'billingRightCardChooseCompanyField',
                    label: 'Vendor',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    floatedPicker: {
                        minWidth: 336,
                        viewModel: {
                            data: {
                                showSuggested: true,
                            },
                        },
                    },
                    bind: {
                        inputValue: '{billing.vendor_name}',
                        value: '{billing.vendor_id}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('billing');
                                record.set('vendor_name', selection.get('org_name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '',
                },
                {
                    xtype: 'container',
                    padding: '4 0',
                    layout: 'hbox',
                    defaults: {
                        slug: 'cdbAgreementsDirectBilling',
                        bind: {
                            permission: '{userPermissions}',
                        },
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            label: 'Percentage',
                            testId: 'billingRightCardPercentageField',
                            labelAlign: 'left',
                            minValue: 0,
                            maxValue: 100,
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-percent icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{billing.percentage}',
                            },
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('billing');
                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                Ext.ComponentQuery.query('[xtype=company]')[0]
                                                    .getVM()
                                                    .set('newUpdate', new Date());
                                                Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '4 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    defaults: {
                        slug: 'cdbAgreementsDirectBilling',
                        bind: {
                            permission: '{userPermissions}',
                        },
                    },
                    items: [
                        {
                            xtype: 'abraxa.datefield',
                            label: 'Validity',
                            testId: 'billingRightCardValidityFromField',
                            labelAlign: 'left',
                            cls: 'a-field-icon icon-date icon-rounded',
                            ui: 'classic hovered-border',
                            clearable: false,
                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                            flex: 1,
                            bind: {
                                value: '{billing.validity_from}',
                            },
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('billing');
                                    if (record.get('validity_to') && record.get('validity_from')) {
                                        if (moment(record.get('validity_from')).isAfter(record.get('validity_to'))) {
                                            record.set('validity_from', null);
                                        }
                                    }
                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                Ext.ComponentQuery.query('[xtype=company]')[0]
                                                    .getVM()
                                                    .set('newUpdate', new Date());
                                                Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            padding: '0 12',
                            html: '-',
                        },
                        {
                            xtype: 'abraxa.datefield',
                            testId: 'billingRightCardValidityToField',
                            width: 140,
                            label: null,
                            labelAlign: 'left',
                            cls: '',
                            ui: 'classic hovered-border',
                            clearable: false,
                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                            bind: {
                                value: '{billing.validity_to}',
                            },
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('billing');
                                    if (record.get('validity_to') && record.get('validity_from')) {
                                        if (moment(record.get('validity_from')).isAfter(record.get('validity_to'))) {
                                            record.set('validity_from', null);
                                        }
                                    }
                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                Ext.ComponentQuery.query('[xtype=company]')[0]
                                                    .getVM()
                                                    .set('newUpdate', new Date());
                                                Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '12 0',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'label',
                            width: 164,
                            html: 'Active',
                            testId: 'billingRightCardActiveLabel',
                            slug: 'cdbAgreementsDirectBillingActivate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'checkboxfield',
                            ui: 'switch icon',
                            testId: 'billingRightCardDirectBillingActiveCheckbox',
                            label: false,
                            checked: true,
                            slug: 'cdbAgreementsDirectBillingActivate',
                            bind: {
                                permission: '{userPermissions}',
                                checked: '{billingGrid.selection.active ? true:false}',
                            },
                            listeners: {
                                check: function (me) {
                                    let record = me.upVM().get('billing');
                                    if (record) {
                                        record.set('active', 1);
                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                        .getVM()
                                                        .set('newUpdate', new Date());
                                                    Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    }
                                },
                                uncheck: function (me) {
                                    let record = me.upVM().get('billing');
                                    if (record) {
                                        record.set('active', 0);
                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                        .getVM()
                                                        .set('newUpdate', new Date());
                                                    Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '',
                },

                {
                    xtype: 'textareafield',
                    testId: 'billingRightCardEnterDesctiptionField',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description (optional)',
                    slug: 'cdbAgreementsDirectBilling',
                    bind: {
                        permission: '{userPermissions}',
                        value: '{billing.description}',
                    },
                    listeners: {
                        blur: function (me) {
                            let record = me.upVM().get('billing');
                            if (record.dirty) {
                                record.save({
                                    success: function () {
                                        Ext.ComponentQuery.query('[xtype=company]')[0]
                                            .getVM()
                                            .set('newUpdate', new Date());
                                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
            ],
        },
    ],
});

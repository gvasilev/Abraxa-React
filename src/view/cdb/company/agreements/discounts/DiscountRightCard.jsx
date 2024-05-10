import '../../../../common/combo/DefaultExpensesCombo.jsx';


Ext.define('Abraxa.view.cdb.company.agreements.discounts.DiscountRightCard', {
    extend: 'Ext.Container',
    xtype: 'agreements.discounts.right.card',
    itemId: 'discountRightCard',
    cls: 'a-right-container',
    hidden: true,
    bind: {
        hidden: '{discountGrid.selection && !discountGrid.selection.is_checked ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        formulas: {
            dialogTitle: {
                bind: {
                    bindTo: '{discountGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return (
                            '<div class="a-badge a-badge-discount"><i class="md-icon-outlined">percent</i></div><div><span class="a-panel-title">' +
                            record.get('discount_name') +
                            '</span></div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
            discount: {
                bind: {
                    bindTo: '{discountGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record;
                    } else {
                        Ext.ComponentQuery.query('[itemId=discountRightCard]')[0].hide();
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
                            ui: 'round tool-round-md',
                            slug: 'cdbAgreementsDiscountDelete',
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
                                    store = vm.get('discounts'),
                                    container = this.find('discountRightCard'),
                                    record = vm.get('discountGrid.selection');
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
                                            itemId: 'no',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
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
                            handler: function (me) {
                                let record = this.upVM().get('discountGrid.selection'),
                                    grid = Ext.ComponentQuery.query('agreements\\.discounts\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=agreements\\.discounts\\.right.\\card]').hide();
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
                slug: 'cdbAgreementsDiscounts',
                bind: {
                    permission: '{userPermissions}',
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border classic',
                    label: false,
                    placeholder: 'Enter discount name',
                    bind: {
                        value: '{discount.discount_name}',
                    },
                    required: true,
                    listeners: {
                        blur: function (me) {
                            let record = me.upVM().get('discount');
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
                    label: 'Port',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-port icon-rounded',
                    multiSelect: true,
                    forceSelection: false,
                    bind: {
                        placeholder: '{discount.port_ids ? null:"All ports"}',
                        value: '{discount.port_ids}',
                    },
                    listeners: {
                        blur: function (me) {
                            let record = me.upVM().get('discount');
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
                        value: '{discount.port_function}',
                    },
                    store: {
                        type: 'berth.function',
                    },
                    listeners: {
                        blur: function (me) {
                            let record = me.upVM().get('discount');
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
                    placeholder: 'Search service',
                    labelAlign: 'left',
                    cls: 'a-field-icon icon-search icon-rounded',
                    ui: 'classic hovered-border',
                    bind: {
                        value: '{discount.default_expense_item_id}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('discount');
                                record.set('default_expense_item_name', selection.get('name'));
                            }
                        },
                        blur: function (me) {
                            let record = me.upVM().get('discount');
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
                    cls: 'divider divider-offset offset-x24',
                    html: '',
                },
                {
                    xtype: 'selectfield',
                    label: 'Type',
                    placeholder: 'Choose type',
                    labelAlign: 'left',
                    reference: 'discountType',
                    required: true,
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    options: [
                        {
                            value: 'percent',
                            text: 'Percent',
                        },
                        {
                            value: 'amount',
                            text: 'Amount',
                        },
                        {
                            value: 'agreement',
                            text: 'Agreement',
                        },
                    ],
                    bind: {
                        value: '{discount.type}',
                    },
                    listeners: {
                        blur: function (me) {
                            let record = me.upVM().get('discount');
                            if (record.dirty) {
                                if (record.get('type') == 'percent') {
                                    record.set('amount', null);
                                }
                                if (record.get('type') == 'amount') {
                                    record.set('percentage', 0);
                                }
                                if (record.get('type') == 'agreement') {
                                    record.set('amount', null);
                                    record.set('percentage', 0);
                                }
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
                    xtype: 'container',
                    padding: '4 0',
                    layout: 'hbox',
                    hidden: true,
                    bind: {
                        hidden: '{discountType.selection.value == "percent" ? false:true}',
                    },
                    defaults: {
                        slug: 'cdbAgreementsDiscounts',
                        bind: {
                            permission: '{userPermissions}',
                        },
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            label: 'Value',
                            labelAlign: 'left',
                            minValue: 0,
                            maxValue: 100,
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-percent icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            required: true,
                            hidden: true,
                            bind: {
                                value: '{discount.percentage}',
                                required: '{discountType.selection.value == "percent" ? true:false}',
                                hidden: '{discountType.selection.value == "percent" ? false:true}',
                            },
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('discount');
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
                    layout: 'hbox',
                    hidden: true,
                    bind: {
                        hidden: '{discountType.selection.value == "amount" ? false:true}',
                    },
                    defaults: {
                        slug: 'cdbAgreementsDiscounts',
                        bind: {
                            permission: '{userPermissions}',
                        },
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            label: 'Ammount',
                            labelAlign: 'left',
                            placeholder: '0,000.00',
                            cls: 'a-append a-append-units',
                            ui: 'classic hovered-border',
                            required: true,
                            hidden: true,
                            bind: {
                                value: '{discount.amount}',
                                required: '{discountType.selection.value == "amount" ? true:false}',
                                hidden: '{discountType.selection.value == "amount" ? false:true}',
                            },
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('discount');
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
                            xtype: 'common-combo-currency',
                            bind: {
                                value: '{discount.currency}',
                                disabled:
                                    '{(currentUserPlan == "starter" || currentUserPlan == "premium") ? true : false}',
                                ui: '{(currentUserPlan == "starter" || currentUserPlan == "premium") ? "viewonly classic" : "hovered-border classic"}',
                            },
                            displayField: 'currency',
                            valueField: 'currency',
                            cls: 'a-prepend non-editable',
                            ui: 'classic hovered-border',
                            editable: false,
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('discount');
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
                        slug: 'cdbAgreementsDiscounts',
                        bind: {
                            permission: '{userPermissions}',
                        },
                    },
                    items: [
                        {
                            xtype: 'abraxa.datefield',
                            flex: 1,
                            label: 'Validity',
                            labelAlign: 'left',
                            cls: 'a-field-icon icon-date icon-rounded',
                            ui: 'classic hovered-border',
                            clearable: false,
                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                            bind: {
                                value: '{discount.validity_from}',
                            },
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('discount');
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
                            width: 140,
                            label: null,
                            labelAlign: 'left',
                            cls: '',
                            ui: 'classic hovered-border',
                            clearable: false,
                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                            bind: {
                                value: '{discount.validity_to}',
                            },
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('discount');
                                    if (record.get('validity_from') && record.get('validity_to')) {
                                        if (moment(record.get('validity_to')).isBefore(record.get('validity_from'))) {
                                            record.set('validity_to', null);
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
                            slug: 'cdbAgreementsDiscountActivate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'checkboxfield',
                            ui: 'switch icon',
                            label: false,
                            checked: true,
                            slug: 'cdbAgreementsDiscountActivate',
                            bind: {
                                permission: '{userPermissions}',
                                checked: '{discountGrid.selection.active ? true:false}',
                            },
                            listeners: {
                                check: function (me) {
                                    let record = me.upVM().get('discount');
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
                                    let record = me.upVM().get('discount');
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
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description (optional)',
                    slug: 'cdbAgreementsDiscounts',
                    bind: {
                        permission: '{userPermissions}',
                        value: '{discount.description}',
                    },
                    listeners: {
                        blur: function (me) {
                            let record = me.upVM().get('discount');
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

Ext.define('Abraxa.view.cdb.company.agreements.discounts.CreateDiscount', {
    extend: 'Ext.Dialog',
    xtype: 'agreements.discounts.create',
    testId: 'agreeDiscountsCreate',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 620,
    minHeight: 580,
    maxHeight: 860,
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    title: '<div class="a-badge a-badge-discount"><i class="md-icon-outlined">percent</i></div>Create discount',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    testId: 'agreeDiscountsCreateForm',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
                            testId: 'agreeDiscountsCreateFormErr',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-dialog-form a-general-form',
                                    maxWidth: 520,
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            testId: 'agreeDiscountsCreateDiscountNameField',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            placeholder: 'Enter discount name',
                                            bind: {
                                                value: '{discount.discount_name}',
                                            },
                                            required: true,
                                            listeners: {
                                                painted: function (me) {
                                                    me.focus();
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'ports.served.combo',
                                            label: 'Port',
                                            testId: 'agreeDiscountsCreatePortField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-port icon-rounded',
                                            multiSelect: true,
                                            forceSelection: true,
                                            bind: {
                                                placeholder: '{discount.port_ids ? null:"All ports"}',
                                                value: '{discount.port_ids}',
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Port function',
                                            testId: 'agreeDiscountsCreatePortFnField',
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
                                                painted: function (me) {
                                                    me.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'default.expense.items.combo',
                                            label: 'Service',
                                            testId: 'agreeDiscountsCreateServiceField',
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
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider divider-offset',
                                            html: '',
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Type',
                                            testId: 'agreeDiscountsCreateTypeField',
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
                                            listeners: {},
                                        },
                                        {
                                            xtype: 'container',
                                            padding: '4 0',
                                            layout: 'hbox',
                                            hidden: true,
                                            bind: {
                                                hidden: '{discountType.selection.value == "percent" ? false:true}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    label: 'Value',
                                                    testId: 'agreeDiscountsCreateValueField',
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
                                                        required:
                                                            '{discountType.selection.value == "percent" ? true:false}',
                                                        hidden: '{discountType.selection.value == "percent" ? false:true}',
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
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    label: 'Amount',
                                                    testId: 'agreeDiscountsCreateAmountField',
                                                    labelAlign: 'left',
                                                    placeholder: '0,000.00',
                                                    cls: 'a-field-icon icon-money icon-rounded a-append a-append-units',
                                                    ui: 'classic hovered-border',
                                                    required: true,
                                                    hidden: true,
                                                    bind: {
                                                        value: '{discount.amount}',
                                                        required:
                                                            '{discountType.selection.value == "amount" ? true:false}',
                                                        hidden: '{discountType.selection.value == "amount" ? false:true}',
                                                    },
                                                },
                                                {
                                                    xtype: 'common-combo-currency',
                                                    testId: 'agreeDiscountsCreateCurrencyField',
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
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                                pack: 'space-between',
                                            },
                                            items: [
                                                {
                                                    xtype: 'abraxa.datefield',
                                                    label: 'Validity',
                                                    testId: 'agreeDiscountsCreateValidityFromField',
                                                    labelAlign: 'left',
                                                    cls: 'a-field-icon icon-date icon-rounded',
                                                    ui: 'classic hovered-border',
                                                    clearable: false,
                                                    placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                                    dateFormat:
                                                        AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                                    flex: 1,
                                                    bind: {
                                                        value: '{discount.validity_from}',
                                                    },
                                                    listeners: {
                                                        blur: function (me) {
                                                            let record = me.upVM().get('discount');
                                                            if (
                                                                record.get('validity_to') &&
                                                                record.get('validity_from')
                                                            ) {
                                                                if (
                                                                    moment(record.get('validity_from')).isAfter(
                                                                        record.get('validity_to')
                                                                    )
                                                                ) {
                                                                    record.set('validity_from', null);
                                                                }
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
                                                    width: 130,
                                                    testId: 'agreeDiscountsCreateValidityToField',
                                                    label: null,
                                                    labelAlign: 'left',
                                                    cls: '',
                                                    ui: 'classic hovered-border',
                                                    clearable: false,
                                                    placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                                    dateFormat:
                                                        AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                                    bind: {
                                                        value: '{discount.validity_to}',
                                                    },
                                                    listeners: {
                                                        blur: function (me) {
                                                            let record = me.upVM().get('discount');
                                                            if (
                                                                record.get('validity_from') &&
                                                                record.get('validity_to')
                                                            ) {
                                                                if (
                                                                    moment(record.get('validity_to')).isBefore(
                                                                        record.get('validity_from')
                                                                    )
                                                                ) {
                                                                    record.set('validity_to', null);
                                                                }
                                                            }
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            margin: '12 0 24 0',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    width: 202,
                                                    html: 'Active',
                                                },
                                                {
                                                    xtype: 'checkboxfield',
                                                    testId: 'agreeDiscountsActiveCheckbox',
                                                    ui: 'switch icon',
                                                    label: false,
                                                    checked: true,
                                                    listeners: {
                                                        check: function (me) {
                                                            let record = me.upVM().get('discount');
                                                            record.set('active', 1);
                                                        },
                                                        uncheck: function (me) {
                                                            let record = me.upVM().get('discount');
                                                            record.set('active', 0);
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider divider-offset',
                                            html: '',
                                        },
                                        {
                                            xtype: 'textareafield',
                                            testId: 'agreeDiscountsDescriptionField',
                                            ui: 'no-border no-underline',
                                            cls: 'a-field-icon icon-short',
                                            placeholder: 'Enter description (optional)',
                                            bind: {
                                                value: '{discount.description}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'agreeDiscountsCancelBtn',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('discount');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Create',
            testId: 'agreeDiscountsCreateBtn',
            enableToggle: true,
            ui: 'action loading',
            handler: function (me) {
                let vm = me.upVM(),
                    dialog = me.up('dialog'),
                    company = vm.get('selectedCompany'),
                    discounts = vm.get('discounts'),
                    discount = vm.get('discount'),
                    form = dialog.down('formpanel');
                if (form.validate()) {
                    form.down('form\\.error').setHtml('').hide().removeCls('error');
                    discount.getProxy().setExtraParams({
                        org_id: company.get('org_id'),
                    });
                    discount.save({
                        success: function (rec) {
                            discounts.add(rec);
                            discounts.commitChanges();
                            Ext.ComponentQuery.query('[xtype=company]')[0].getVM().set('newUpdate', new Date());
                            Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                            dialog.destroy();
                        },
                    });
                } else {
                    me.toggle();
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});

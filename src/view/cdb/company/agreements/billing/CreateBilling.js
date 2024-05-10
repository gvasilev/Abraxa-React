Ext.define('Abraxa.view.cdb.company.agreements.billing.CreateBilling', {
    extend: 'Ext.Dialog',
    xtype: 'agreements.billing.create',
    testId: 'agreementBillingCreate',
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
    title: '<div class="a-badge a-badge-billing"><i class="md-icon-outlined">account_balance_wallet</i></div>Direct billing',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    testId: 'agreementBillingCreateForm',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
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
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            clearable: false,
                                            placeholder: 'Enter billing name',
                                            testId: 'agreementBillingCreateEnterBillingNameField',
                                            bind: {
                                                value: '{billing.billing_name}',
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
                                            label: 'Ports',
                                            testId: 'agreementBillingCreatePortsField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-port icon-rounded',
                                            multiSelect: true,
                                            forceSelection: true,
                                            bind: {
                                                placeholder: '{billing.port_ids ? null:"All ports"}',
                                                value: '{billing.port_ids}',
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Port function',
                                            testId: 'agreementBillingCreatePortFnField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            forceSelection: true,
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
                                            },
                                        },
                                        {
                                            xtype: 'default.expense.items.combo',
                                            label: 'Service',
                                            testId: 'agreementBillingCreateServiceField',
                                            placeholder: 'Search item',
                                            labelAlign: 'left',
                                            required: true,
                                            cls: 'a-field-icon icon-search icon-rounded',
                                            ui: 'classic hovered-border',
                                            bind: {
                                                value: '{billing.default_expense_item_id}',
                                            },
                                            listeners: {
                                                painted: function () {
                                                    this.setError(false);
                                                },
                                                select: function (me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('billing');
                                                        record.set('default_expense_item_name', selection.get('name'));
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'organization.combo',
                                            placeholder: 'Choose Company',
                                            testId: 'agreementBillingCreateChooseCompanyField',
                                            label: 'Vendor',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-business-center icon-rounded',

                                            bind: {
                                                value: '{billing.vendor_id}',
                                            },
                                            floatedPicker: {
                                                minWidth: 324,
                                                viewModel: {
                                                    data: {
                                                        showSuggested: true,
                                                    },
                                                },
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
                                            cls: 'divider divider-offset',
                                            html: '',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            label: 'Percentage',
                                            testId: 'agreementBillingCreatePercentageField',
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
                                                    testId: 'agreementBillingCreateValidityField',
                                                    flex: 1,
                                                    label: 'Validity',
                                                    labelAlign: 'left',
                                                    cls: 'a-field-icon icon-date icon-rounded',
                                                    ui: 'classic hovered-border',
                                                    clearable: false,
                                                    placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                                    dateFormat:
                                                        AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                                    bind: {
                                                        value: '{billing.validity_from}',
                                                    },
                                                    listeners: {
                                                        blur: function (me) {
                                                            let record = me.upVM().get('billing');
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
                                                    label: null,
                                                    labelAlign: 'left',
                                                    cls: '',
                                                    ui: 'classic hovered-border',
                                                    clearable: false,
                                                    placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                                    dateFormat:
                                                        AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                                    testId: 'agreementBillingCreateValiditySecondField',
                                                    bind: {
                                                        value: '{billing.validity_to}',
                                                    },
                                                    listeners: {
                                                        blur: function (me) {
                                                            let record = me.upVM().get('billing');
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
                                                    testId: 'agreementBillingCreateValiditySecondField',
                                                    ui: 'switch icon',
                                                    label: false,
                                                    checked: true,
                                                    listeners: {
                                                        check: function (me) {
                                                            let record = me.upVM().get('billing');
                                                            record.set('active', 1);
                                                        },
                                                        uncheck: function (me) {
                                                            let record = me.upVM().get('billing');
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
                                            ui: 'no-border no-underline',
                                            cls: 'a-field-icon icon-short',
                                            placeholder: 'Enter description (optional)',
                                            testId: 'agreementBillingCreateDescriptionField',
                                            bind: {
                                                value: '{billing.description}',
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
            testId: 'agreementBillingCreateCancelField',
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
            testId: 'agreementBillingCreateCreateField',
            enableToggle: true,
            ui: 'action loading',
            handler: function (me) {
                let vm = me.upVM(),
                    dialog = me.up('dialog'),
                    company = vm.get('selectedCompany'),
                    billings = vm.get('billings'),
                    billing = vm.get('billing');
                form = dialog.down('formpanel');
                if (form.validate()) {
                    form.down('form\\.error').setHtml('').hide().removeCls('error');
                    billing.getProxy().setExtraParams({
                        org_id: company.get('org_id'),
                    });
                    billing.save({
                        success: function (rec) {
                            billings.add(rec);
                            billings.commitChanges();
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

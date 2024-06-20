Ext.define('Abraxa.view.cdb.company.agreements.prefunding.CreatePreFunding', {
    extend: 'Ext.Dialog',
    xtype: 'agreements.prefunding.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    testId: 'agrPrefundingCreate',
    manageBorders: false,
    scrollable: 'y',
    width: 620,
    minHeight: 580,
    maxHeight: '90%',
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    title: '<div class="a-badge a-badge-prefunding"><i class="md-icon-outlined">payments</i></div>Pre-funding',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    testId: 'agrPrefundingCreateForm',
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
                            cls: 'a-dialog-form a-general-form',
                            maxWidth: 520,
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Payment terms',
                                    testId: 'agrPrefundingCreatePaymentTermsField',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-payments icon-rounded non-editable',
                                    required: true,
                                    forceSelection: true,
                                    placeholder: 'Choose type',
                                    queryMode: 'local',
                                    displayField: 'term_name',
                                    reference: '{paymentTermCombo}',
                                    valueField: 'id',
                                    store: {
                                        type: 'payment.terms',
                                    },
                                    bind: {
                                        value: '{prefunding.payment_term_id}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.setError(null);
                                        },
                                        select: function (me, selection) {
                                            if (selection) {
                                                let record = me.upVM().get('prefunding');
                                                record.set('payment_term_name', selection.get('term_name'));
                                                if (selection.get('id') === 3) {
                                                    record.set('percentage', 0);
                                                }
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                    testId: 'agrPrefundingCreatePrefundAdvancedDiv',
                                    hidden: true,
                                    bind: {
                                        hidden: '{preFundingAdvanced ? false : true}',
                                    },
                                    cls: 'divider divider-offset my-4',
                                    html: '',
                                },
                                {
                                    xtype: 'numberfield',
                                    label: 'Percentage',
                                    testId: 'agrPrefundingCreatePercentageField',
                                    labelAlign: 'left',
                                    minValue: 0,
                                    maxValue: 100,
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-percent icon-rounded',
                                    placeholder: '00.00',
                                    clearable: false,
                                    bind: {
                                        value: '{prefunding.percentage}',
                                        // required: '{prefunding.payment_term_id == 3 ? false:true}',
                                        hidden: '{prefunding.payment_term_id == 3 ? true:false}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.setError(null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'container',
                                    hidden: true,
                                    testId: 'agrPrefundingCreateInnerContainer',
                                    bind: {
                                        hidden: '{preFundingAdvanced ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    width: 196,
                                                    html: 'Threshold',
                                                },
                                                {
                                                    xtype: 'container',
                                                    layout: 'hbox',
                                                    defaults: {
                                                        labelAlign: 'left',
                                                        ui: 'classic hovered-border',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'selectfield',
                                                            testId: 'agrPrefundingCreateThresholdField',
                                                            label: null,
                                                            cls: 'a-field-icon icon-functions icon-rounded',
                                                            forceSelection: true,
                                                            placeholder: '>',
                                                            queryMode: 'local',
                                                            valueField: 'operator',
                                                            displayField: 'operator',
                                                            width: 100,
                                                            bind: {
                                                                value: '{prefunding.threshold_operator}',
                                                            },
                                                            options: [
                                                                {
                                                                    id: 1,
                                                                    operator: '<=',
                                                                },
                                                                {
                                                                    id: 2,
                                                                    operator: '>',
                                                                },
                                                            ],
                                                            listeners: {
                                                                painted: function (me) {
                                                                    me.setError(null);
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            padding: '4 0',
                                                            placeholder: '0,000.00',
                                                            testId: 'agrPrefundingCreateThresholdAmmountField',
                                                            width: 140,
                                                            cls: 'a-append a-append-units',
                                                            bind: {
                                                                value: '{prefunding.threshold_amount}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'common-combo-currency',
                                                            bind: {
                                                                value: '{prefunding.threshold_currency}',
                                                                disabled:
                                                                    '{(currentUserPlan == "starter" || currentUserPlan == "premium") ? true : false}',
                                                                ui: '{(currentUserPlan == "starter" || currentUserPlan == "premium") ? "viewonly classic" : "hovered-border classic"}',
                                                            },
                                                            displayField: 'currency',
                                                            valueField: 'currency',
                                                            cls: 'a-prepend non-editable',
                                                            editable: false,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Agency type',
                                            testId: 'agrPrefundingCreateAgencyTypeField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                                            forceSelection: true,
                                            clearable: true,
                                            placeholder: 'Choose type',
                                            queryMode: 'local',
                                            displayField: 'name',
                                            valueField: 'id',
                                            store: {
                                                type: 'agency.types',
                                            },
                                            bind: {
                                                value: '{prefunding.agency_type_id}',
                                            },
                                            listeners: {
                                                painted: function (me) {
                                                    me.setError(null);
                                                },
                                                select: function (me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('prefunding');
                                                        record.set('agency_type_name', selection.get('name'));
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'button',
                                    testId: 'agrPrefundingCreateToggleAdvanced',
                                    margin: '8 60',
                                    ui: 'tool-text-sm normal',
                                    enableToggle: true,
                                    bind: {
                                        text: '{preFundingAdvanced ? "Hide advanced" : "Show advanced"}',
                                        iconCls:
                                            '{preFundingAdvanced ? "md-icon-outlined md-icon-unfold-less" : "md-icon-outlined md-icon-unfold-more"}',
                                    },
                                    handler: function () {
                                        let advancedMode = this.upVM().get('preFundingAdvanced');

                                        if (advancedMode) {
                                            this.upVM().set('preFundingAdvanced', false);
                                        } else {
                                            this.upVM().set('preFundingAdvanced', true);
                                        }
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-dialog-form a-general-form',
                            maxWidth: 520,
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'divider divider-offset my-8',
                                    hidden: true,
                                    bind: {
                                        hidden: '{preFundingAdvanced ? false : true}',
                                    },
                                    html: '',
                                },
                                {
                                    xtype: 'ports.served.combo',
                                    label: 'Port',
                                    testId: 'agrPrefundingCreatePortField',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-port icon-rounded',
                                    multiSelect: true,
                                    forceSelection: true,
                                    bind: {
                                        placeholder: '{prefunding.port_ids ? null:"All ports"}',
                                        value: '{prefunding.port_ids}',
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Port function',
                                    testId: 'agrPrefundingCreatePortFunctionField',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    forceSelection: true,
                                    placeholder: 'All functions',
                                    queryMode: 'local',
                                    valueField: 'name',
                                    displayField: 'name',
                                    bind: {
                                        value: '{prefunding.port_function}',
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
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.datefield',
                                            testId: 'agrPrefundingCreateValidityField',
                                            label: 'Validity',
                                            labelAlign: 'left',
                                            cls: 'a-field-icon icon-date icon-rounded',
                                            ui: 'classic hovered-border',
                                            clearable: false,
                                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            flex: 1,
                                            bind: {
                                                value: '{prefunding.validity_from}',
                                            },
                                            listeners: {
                                                blur: function (me) {
                                                    let record = me.upVM().get('prefunding');
                                                    if (record.get('validity_to') && record.get('validity_from')) {
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
                                            testId: 'agrPrefundingCreateValiditySecondField',
                                            clearable: false,
                                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            bind: {
                                                value: '{prefunding.validity_to}',
                                            },
                                            listeners: {
                                                blur: function (me) {
                                                    let record = me.upVM().get('prefunding');
                                                    if (record.get('validity_from') && record.get('validity_to')) {
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
                                            ui: 'switch icon',
                                            testId: 'agrPrefundingCreateActiveCheckboxField',
                                            checked: true,
                                            label: false,
                                            listeners: {
                                                check: function (me) {
                                                    let record = me.upVM().get('prefunding');
                                                    record.set('active', 1);
                                                },
                                                uncheck: function (me) {
                                                    let record = me.upVM().get('prefunding');
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
                                    testId: 'agrPrefundingCreateEnterDescroptionField',
                                    ui: 'no-border no-underline',
                                    cls: 'a-field-icon icon-short',
                                    placeholder: 'Enter description (optional)',
                                    bind: {
                                        value: '{prefunding.description}',
                                    },
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
            testId: 'agrPrefundingCreateCancelBtn',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('prefunding');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Create',
            testId: 'agrPrefundingCreateCreateBtn',
            enableToggle: true,
            ui: 'action loading',
            handler: function (me) {
                let vm = me.upVM(),
                    dialog = me.up('dialog'),
                    company = vm.get('selectedCompany'),
                    prefundings = vm.get('prefundings'),
                    prefunding = vm.get('prefunding'),
                    form = dialog.down('formpanel');
                if (form.validate()) {
                    form.down('form\\.error').setHtml('').hide().removeCls('error');
                    prefunding.getProxy().setExtraParams({
                        org_id: company.get('org_id'),
                    });
                    prefunding.save({
                        success: function (rec) {
                            prefundings.add(rec);
                            prefundings.commitChanges();
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

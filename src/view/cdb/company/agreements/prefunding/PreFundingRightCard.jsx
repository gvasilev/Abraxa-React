import '../../../../../store/common/PaymentTerms';
import '../../../../../store/common/AgencyTypes';
import '../../../../../store/common/BerthFunction';

Ext.define('Abraxa.view.cdb.company.agreements.prefunding.PrefundingRightCard', {
    extend: 'Ext.Container',
    xtype: 'agreements.prefunding.right.card',
    itemId: 'prefundingRightCard',
    testId: 'prefundingRightCard',
    cls: 'a-right-container',
    hidden: true,
    bind: {
        hidden: '{prefundingGrid.selection && !prefundingGrid.selection.is_checked ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        data: {
            preFundingAdvanced: false,
        },
        formulas: {
            dialogTitle: {
                bind: {
                    bindTo: '{prefundingGrid.selection}',
                    deep: true,
                },
                get: function(record) {
                    if (record) {
                        return (
                            '<div class="a-badge a-badge-prefunding"><i class="md-icon-outlined">payments</i></div><div><span class="a-panel-title">' +
                            record.get('payment_term_name') +
                            '</span></div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
            prefunding: {
                bind: {
                    bindTo: '{prefundingGrid.selection}',
                    deep: true,
                },
                get: function(record) {
                    if (record) {
                        return record;
                    } else {
                        Ext.ComponentQuery.query('[itemId=prefundingRightCard]')[0].hide();
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
                            testId: 'prefundingRightCardDeleteBtn',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'cdbAgreementsPrefundingDelete',
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
                            handler: function(item, el, eOpts) {
                                let vm = this.upVM(),
                                    store = vm.get('prefundings'),
                                    container = this.find('prefundingRightCard'),
                                    record = vm.get('prefundingGrid.selection');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function(answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function(err, msg) {
                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                        .getVM()
                                                        .set('newUpdate', new Date());
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function(batch) {
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
                                            testId: 'prefundingRightCardDeleteNoBtn',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'yes',
                                            testId: 'prefundingRightCardDeleteYesBtn',
                                            ui: 'decline alt',
                                            text: 'Delete',
                                        },
                                    ],
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            testId: 'prefundingRightCardHideBtn',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function(me) {
                                let record = this.upVM().get('prefundingGrid.selection'),
                                    grid = Ext.ComponentQuery.query('agreements\\.prefunding\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=agreements\\.prefunding\\.right.\\card]').hide();
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
            padding: '16 24 0 24',
            scrollable: true,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
                slug: 'cdbAgreementsPreFunding',
                bind: {
                    permission: '{userPermissions}',
                },
                listeners: {
                    blur: function(me) {
                        let record = me.upVM().get('prefundingGrid.selection');
                        if (record.dirty) {
                            record.save({
                                success: function() {
                                    Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'selectfield',
                    label: 'Payment terms',
                    testId: 'prefundingRightCardPaymentTermsField',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-payments icon-rounded non-editable',
                    required: true,
                    forceSelection: true,
                    placeholder: 'Choose type',
                    queryMode: 'local',
                    displayField: 'term_name',
                    valueField: 'id',
                    store: {
                        type: 'payment.terms',
                    },
                    bind: {
                        value: '{prefunding.payment_term_id}',
                    },
                    listeners: {
                        painted: function(me) {
                            me.setError(null);
                        },
                        select: function(me, selection) {
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
                    hidden: true,
                    bind: {
                        hidden: '{preFundingAdvanced ? false : true}',
                    },
                    cls: 'divider divider-offset my-4 offset-x24',
                    html: '',
                },
                {
                    xtype: 'numberfield',
                    label: 'Percentage',
                    testId: 'prefundingRightCardPercentageField',
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
                        painted: function(me) {
                            me.setError(null);
                        },
                    },
                },
                {
                    xtype: 'container',
                    hidden: true,
                    bind: {
                        hidden: '{preFundingAdvanced ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            padding: '4 0',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    width: 156,
                                    html: 'Threshold',
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    defaults: {
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                        slug: 'cdbAgreementsPreFunding',
                                        bind: {
                                            permission: '{userPermissions}',
                                        },
                                        listeners: {
                                            blur: function(me) {
                                                let record = me.upVM().get('prefundingGrid.selection');
                                                if (record.dirty) {
                                                    record.save({
                                                        success: function() {
                                                            Ext.ComponentQuery.query('[xtype=company]')[0]
                                                                .getVM()
                                                                .set('newUpdate', new Date());
                                                            Ext.getCmp('main-viewport')
                                                                .getVM()
                                                                .get('agreements')
                                                                .reload();
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'selectfield',
                                            label: null,
                                            cls: 'a-field-icon icon-functions icon-rounded',
                                            forceSelection: true,
                                            testId: 'prefundingRightCardThresholdOperator',
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
                                                painted: function(me) {
                                                    me.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'numberfield',
                                            placeholder: '0,000.00',
                                            testId: 'prefundingRightCardThresholdAmountField',
                                            width: 140,
                                            cls: 'a-append a-append-units',
                                            bind: {
                                                value: '{prefunding.threshold_amount}',
                                            },
                                        },
                                        {
                                            xtype: 'common-combo-currency',
                                            testId: 'prefundingRightCardCurrencyField',
                                            bind: {
                                                value: '{prefunding.threshold_currency}',
                                                disabled:
                                                    '{(currentUserPlan == "starter" || currentUserPlan == "premium") ? true : false}',
                                                ui: '{(currentUserPlan == "starter" || currentUserPlan == "premium") ? "viewonly classic" : "hovered-border classic"}',
                                            },
                                            displayField: 'name',
                                            valueField: 'name',
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
                            testId: 'prefundingRightCardAgencyTypeField',
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
                            slug: 'cdbAgreementsPreFunding',
                            bind: {
                                permission: '{userPermissions}',
                                value: '{prefunding.agency_type_id}',
                            },
                            listeners: {
                                painted: function(me) {
                                    me.setError(null);
                                },
                                clearicontap: function(me) {
                                    let record = me.upVM().get('prefunding');
                                    record.set('agency_type_name', null);
                                },
                                select: function(me, selection) {
                                    if (selection) {
                                        let record = me.upVM().get('prefunding');
                                        record.set('agency_type_name', selection.get('name'));
                                    }
                                },
                                blur: function(me) {
                                    let record = me.upVM().get('prefundingGrid.selection');
                                    if (record.dirty) {
                                        record.save({
                                            success: function() {
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
        },
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'button',
                    testId: 'prefundingRightCardShowHideAdvanced',
                    margin: '8 12',
                    ui: 'tool-text-sm normal',
                    enableToggle: true,
                    bind: {
                        text: '{preFundingAdvanced ? "Hide advanced" : "Show advanced"}',
                        iconCls:
                            '{preFundingAdvanced ? "md-icon-outlined md-icon-unfold-less" : "md-icon-outlined md-icon-unfold-more"}',
                    },
                    handler: function() {
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
            padding: '0 24',
            defaults: {
                slug: 'cdbAgreementsPreFunding',
                bind: {
                    permission: '{userPermissions}',
                },
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    hidden: true,
                    bind: {
                        hidden: '{preFundingAdvanced ? false : true}',
                    },
                    html: '',
                },
                {
                    xtype: 'ports.served.combo',
                    label: 'Port',
                    testId: 'prefundingRightCardPortsServedField',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-port icon-rounded',
                    multiSelect: true,
                    forceSelection: true,
                    bind: {
                        placeholder: '{prefunding.port_ids ? null:"All ports"}',
                        value: '{prefunding.port_ids}',
                    },
                    listeners: {
                        blur: function(me) {
                            let record = me.upVM().get('prefundingGrid.selection');
                            if (record.dirty) {
                                record.save({
                                    success: function() {
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
                    testId: 'prefundingRightCardPortFnField',
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
                        painted: function(me) {
                            me.setError(null);
                        },
                        blur: function(me) {
                            let record = me.upVM().get('prefundingGrid.selection');
                            if (record.dirty) {
                                record.save({
                                    success: function() {
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
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'abraxa.datefield',
                            label: 'Validity',
                            testId: 'prefundingRightCardValidityField',
                            labelAlign: 'left',
                            cls: 'a-field-icon icon-date icon-rounded',
                            ui: 'classic hovered-border',
                            clearable: false,
                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                            flex: 1,
                            slug: 'cdbAgreementsPreFunding',
                            bind: {
                                permission: '{userPermissions}',
                                value: '{prefunding.validity_from}',
                            },
                            listeners: {
                                blur: function(me) {
                                    let record = me.upVM().get('prefundingGrid.selection');
                                    if (record.get('validity_to') && record.get('validity_from')) {
                                        if (moment(record.get('validity_from')).isAfter(record.get('validity_to'))) {
                                            record.set('validity_from', null);
                                        }
                                    }
                                    if (record.dirty) {
                                        record.save({
                                            success: function() {
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
                            testId: 'prefundingRightCardPreFundingField',
                            label: null,
                            labelAlign: 'left',
                            cls: '',
                            ui: 'classic hovered-border',
                            clearable: false,
                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                            slug: 'cdbAgreementsPreFunding',
                            bind: {
                                permission: '{userPermissions}',
                                value: '{prefunding.validity_to}',
                            },
                            listeners: {
                                blur: function(me) {
                                    let record = me.upVM().get('prefundingGrid.selection');
                                    if (record.get('validity_from') && record.get('validity_to')) {
                                        if (moment(record.get('validity_to')).isBefore(record.get('validity_from'))) {
                                            record.set('validity_to', null);
                                        }
                                    }
                                    if (record.dirty) {
                                        record.save({
                                            success: function() {
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
                    margin: '12 0 24 0',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'label',
                            width: 164,
                            html: 'Active',
                            testId: 'prefundingRightCardActiveLabel',
                            slug: 'cdbAgreementsPrefundingActivate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'checkboxfield',
                            ui: 'switch icon',
                            testId: 'prefundingRightCardActivateCheckbox',
                            label: false,
                            checked: true,
                            slug: 'cdbAgreementsPrefundingActivate',
                            bind: {
                                permission: '{userPermissions}',
                                checked: '{prefundingGrid.selection.active ? true:false}',
                            },
                            listeners: {
                                check: function(me) {
                                    let record = me.upVM().get('prefunding');
                                    if (record) {
                                        record.set('active', 1);
                                        if (record.dirty) {
                                            record.save({
                                                success: function() {
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
                                uncheck: function(me) {
                                    let record = me.upVM().get('prefunding');
                                    if (record) {
                                        record.set('active', 0);
                                        if (record.dirty) {
                                            record.save({
                                                success: function() {
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
                    testId: 'prefundingRightCardDescriptionField',
                    placeholder: 'Enter description (optional)',
                    slug: 'cdbAgreementsPreFunding',
                    bind: {
                        permission: '{userPermissions}',
                        value: '{prefunding.description}',
                    },
                    listeners: {
                        blur: function(me) {
                            let record = me.upVM().get('prefundingGrid.selection');
                            if (record.dirty) {
                                record.save({
                                    success: function() {
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

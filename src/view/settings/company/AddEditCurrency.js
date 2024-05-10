Ext.define('Abraxa.view.settings.company.AddEditCurrency', {
    xtype: 'settings.company.add.edit.currency',
    testId: 'settingsAddEditCurrency',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-currency"><i class="md-icon-outlined">attach_money</i></div>{editMode ? "Edit currency":"Add currency"}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 460,
    minHeight: 280,
    padding: '0 24 0 72',
    controller: 'company.controller',
    items: [
        {
            xtype: 'form.error',
            testId: 'settingsAddEditCurrencyFormErr',
            hidden: true,
            margin: 0,
            padding: 8,
            // showAnimation: 'fadeIn',
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            testId: 'settingsAddEditCurrencyForm',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'common-combo-currency',
                    label: 'Currency',
                    testId: 'settingsAddEditCurrencyChooseCurrencyField',
                    editable: false,
                    placeholder: 'Choose currency',
                    cls: 'a-field-icon icon-rounded icon-money',
                    bind: {
                        value: '{record.currency_id}',
                        store: '{filteredCurrencies}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                me.upVM().get('record').set('currency_name', selection.get('name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'container',
                    margin: '8 0 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            testId: 'settingsAddEditCurrencySetDefaultCheckbox',
                            boxLabel: 'Set as default',
                            bind: {
                                checked: '{record.is_default}',
                                disabled: '{currentUserPlan == "enterprise" ? false:true}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                testId: 'settingsAddEditCurrencyCancelBtn',
                margin: '0 8 0 0',
                handler: function () {
                    this.upVM().get('companyCurrencies').rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                testId: 'settingsAddEditCurrencySaveBtn',
                handler: 'onCurrencyCreate',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
            },
        ],
    },
});

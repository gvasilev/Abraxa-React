Ext.define('Abraxa.view.settings.company.AssignBanksToPublicProfile', {
    xtype: 'AssignBanksToPublicProfile',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: '<div class="a-badge a-badge-bank"><i class="md-icon-outlined">account_balance</i></div>Assign bank account',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    minHeight: 480,
    padding: '0 24',
    controller: 'company.controller',
    layout: 'vbox',
    items: [
        {
            xtype: 'div',
            margin: '0 0 8 0',
            html: '<div class="text-info">Select a bank account to use for your public profile.</div>',
            bind: {
                hidden: '{companyBankDetails.count ? false : true}',
            },
        },
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            flex: 1,
            padding: 0,
            maxHeight: 600,
            scrollable: true,
            layout: 'vbox',
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    // xtype: 'abraxa.formlist',
                    xtype: 'list',
                    flex: 1,
                    bind: {
                        store: '{companyBankDetails}',
                    },
                    emptyText:
                        '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No bank accounts available</span></div></div>',
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        cls: 'a-list-item',
                        minHeight: 56,
                        flex: 1,
                        layout: {
                            type: 'vbox',
                            // align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'container',
                                padding: '12 0',
                                cls: 'a-bb-100',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                items: [
                                    {
                                        xtype: 'checkboxfield',
                                        ui: 'medium',
                                        margin: '0 8 0 0',
                                        bind: {
                                            checked: '{record.is_public}',
                                        },
                                        inputValue: 1,
                                        uncheckedValue: 0,
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-list-values',
                                        flex: 1,
                                        bind: {
                                            html: '<div class="flex-6"><span class=""><span class="fw-b text-truncate hbox" style="max-width: 200px;">{record.bank_name}{record.is_default ? "<i class=\'md-icon c-teal fs-18 ml-8\'>check</i>": ""}</span><span class="sm-title">{record.number_type}: {record.iban}</span></span></div>',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                margin: '0 8 0 0',
                testId: 'assignBankDialogCancelButtonTestId',
                handler: function (thisBtn) {
                    thisBtn.upVM().get('companyBankDetails').rejectChanges();
                    thisBtn.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                text: 'Assign',
                testId: 'assignBankDialogSaveButtonTestId',
                ui: 'action loading',
                handler: function (thisBtn) {
                    let dialog = thisBtn.up('dialog');
                    let store = thisBtn.upVM().get('companyBankDetails');
                    if (store.data.items.filter((el) => el.dirty).length === 0) {
                        Ext.Msg.warning('Not selected account', 'Please select bank account first!');
                        return;
                    }
                    dialog.mask('Saving...');
                    store.sync({
                        success: function (batch, options) {
                            store.reload();
                            dialog.destroy();
                            Ext.toast('Record updated', 1500);
                        },
                        failure: function (batch, options) {
                            var response = batch.operations[0].error.response.responseJson;
                            dialog.unmask();
                            Ext.Msg.alert('Something went wrong', response.message);
                        },
                    });
                },
            },
        ],
    },
});

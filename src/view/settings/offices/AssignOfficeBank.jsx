Ext.define('Abraxa.view.settings.offices.AssignOfficeBank', {
    xtype: 'settings.offices.assign.bank',
    extend: 'Ext.Dialog',
    closable: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-bank"><i class="material-icons-outlined">account_balance</i></div>Assign bank to {officesGrid.selection.office_name}',
    },
    scrollable: 'y',
    width: 540,
    minHeight: 540,
    maxHeight: 860,
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: '16 0',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'container',
            cls: 'a-grid-list',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'list',
                    flex: 1,
                    infinite: true,
                    height: 400,
                    bind: {
                        store: '{banksWithoutOffice}',
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                bank: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (bank) {
                                        if (bank) {
                                            return bank;
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        height: 54,
                        cls: 'myStyle x-list-sortablehandle grabbable a-bb-100',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        padding: '0 24',
                        items: [
                            {
                                xtype: 'checkbox',
                                ui: 'medium',
                                cls: 'assing_bank_in_office',
                                margin: '0 16 0 0',
                            },
                            {
                                xtype: 'div',
                                html: '<div class="a-badge a-badge-bank mr-16"><i class="material-icons-outlined">account_balance</i></div>',
                            },
                            {
                                xtype: 'div',
                                bind: {
                                    html: '<div><div class="fw-b">{bank.bank_name}</div><div class="sm-title">{bank.number_type}: {bank.iban}</div></div>',
                                },
                            },
                            {
                                xtype: 'div',
                                flex: 1,
                                cls: 'text-right fw-b c-teal',
                                bind: {
                                    html: '{bank.currency}',
                                },
                            },
                        ],
                    },
                    emptyText: {
                        xtype: 'container',
                        zIndex: 999,
                        layout: {
                            type: 'vbox',
                        },
                        centered: true,
                        items: [
                            {
                                xtype: 'div',
                                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-832 -520)"><g transform="translate(-2 175)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M14,25H8.667V43.667H14Zm16,0H24.667V43.667H30ZM52.667,49H2v5.333H52.667ZM46,25H40.667V43.667H46ZM27.333,7.027l13.893,7.307H13.44L27.333,7.027m0-6.027L2,14.333v5.333H52.667V14.333Z" transform="translate(865.334 551.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/></g></svg><div class="a-no-content-txt">No bank accounts available</div></div>',
                            },
                        ],
                    },
                    emptyTextDefaults: {
                        xtype: 'emptytext',
                        cls: 'a-empty-text',
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
                handler: function () {
                    this.upVM().get('officeBanks').rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                text: 'Assign',
                testId: 'assignBankToOfficeButtonTestId',
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        vm = me.upVM(),
                        office = me.upVM().get('officesGrid.selection'),
                        store = vm.get('officeBanks');
                    let items = Ext.ComponentQuery.query('checkbox[cls~=assing_bank_in_office][checked="true"]'),
                        selectedItems = [];
                    Ext.each(items, function (item, index) {
                        let isDefault = false;
                        if (store.getCount() === 0 && index === 0) {
                            isDefault = true;
                        }
                        let model = Ext.create('Abraxa.model.office.OfficeBank', {
                            bank_id: item.upVM().get('record').get('id'),
                            office_id: office.get('id'),
                            company_id: office.get('company_id'),
                            is_default: isDefault,
                        });
                        selectedItems.push(model);
                    });
                    if (!selectedItems.length) {
                        this.up('dialog')
                            .down('form\\.error')
                            .setHtml('Please select at least one user')
                            .show()
                            .addCls('error');
                    } else {
                        this.up('dialog').down('form\\.error').hide();
                        store.add(selectedItems);
                        store.sync({
                            success: function (batch, opt) {
                                Ext.toast('Record updated', 1000);
                                store.reload();
                                dialog.destroy();
                            },
                            failure: function (batch, operations) {
                                Ext.Msg.alert('Something went wrong', 'Cannot update office bank!');
                            },
                        });
                    }
                },
            },
        ],
    },
});

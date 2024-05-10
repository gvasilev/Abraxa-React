Ext.define('Abraxa.view.portcall.disbursements.DisbursementDeleteDialog', {
    xtype: 'disbursement.delete.dialog',
    extend: 'Ext.MessageBox',
    modal: true,
    title: 'Delete',
    width: 460,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    closable: true,
    defaults: {
        labelWidth: 100,
        labelSeparator: '',
    },
    padding: '16 24',
    items: [
        {
            html: 'Are you sure you would like to delete this entry?',
        },
        {
            xtype: 'container',
            cls: 'a-info-box a-warning-box',
            margin: '24 0 24 0',
            hidden: true,
            subObject: 'supply',
            bind: {
                hidden: '{expenseItems.length ? false : true}',
                cls: 'a-info-box a-warning-box align-items-start {nonEditable ? "hidden" : ""}',
                objectPermission: '{objectPermissions}',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'hbox',
                    bind: {
                        html: '<div class="a-info-text">There are <strong>Husbanry</strong> items related to this disbursement. Would you like to delete them?</div>',
                    },
                },
                {
                    xtype: 'checkbox',
                    ui: 'large',
                    bodyAlign: 'start',
                    reference: 'deleteExpenses',
                    boxLabel: 'Delete',
                },
            ],
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },
    buttons: [
        {
            text: 'Cancel',
            handler: function (me) {
                let dialog = me.up('dialog');
                dialog.destroy();
            },
            margin: '0 8 0 0',
            ui: 'default',
        },
        {
            text: 'Delete',
            ui: 'decline alt',
            handler: function (me) {
                let store = me.upVM().get('disbursements'),
                    record = me.upVM().get('disbursement'),
                    expenseItems = me.upVM().get('expenseItems'),
                    expenses = me.upVM().get('expenses'),
                    deleteExpenses = me.upVM().get('deleteExpenses').checked,
                    disbursementId = record.get('id'),
                    grid = Ext.ComponentQuery.query('disbursements\\.grid')[0];

                grid.deselectAll();

                store.remove(record);
                store.sync({
                    success: function () {
                        if (expenseItems) {
                            if (deleteExpenses) {
                                expenses.remove(expenseItems);
                            } else {
                                expenses.each(function (expense) {
                                    if (
                                        expense.get('disbursement_id') == disbursementId &&
                                        expense.get('type') == 'financial'
                                    ) {
                                        expenses.remove(expense);
                                    } else if (expense.get('disbursement_id') == disbursementId) {
                                        expense.set('disbursement_id', null);
                                    }
                                });
                            }
                            expenses.sync();
                        }
                        Ext.toast('Record updated');
                        me.up('dialog').destroy();
                    },
                });
            },
        },
    ],
});

Ext.define('Abraxa.view.portcall.PortcallDeleteDialog', {
    extend: 'Ext.MessageBox',
    closable: true,
    title: `<div class="hbox"><div class="a-badge a-badge-danger mr-16 my-8"><i class="material-icons-outlined">delete</i></div>Delete</div>`,
    // message: 'Are you sure you want to permanently delete this Portcall?',
    items: [
        {
            xtype: 'div',
            margin: '0 0 8 48',
            html: '<strong>Would you like to delete this portcall?</strong>',
        },
        {
            xtype: 'div',
            margin: '0 0 8 48',
            html: 'All related objects will be deleted accordingly.',
        },
        {
            xtype: 'div',
            cls: 'a-info-box a-warning-box',
            margin: '12 0 0 48',
            hidden: true,
            bind: {
                hidden: '{showWarning}',
                html: '<i class="material-icons-outlined">report_problem</i><div class="a-info-text">This is an actively shared port call.<br>{record.is_live ? "You" : "Members"} will no longer receive updates after deletion.</div>',
            },
        },
    ],
    buttons: [
        {
            xtype: 'button',
            text: 'Cancel',
            testId: 'portcallDeleteDialogCancelButton',
            handler: function () {
                this.up('dialog').destroy();
            },
        },
        {
            xtype: 'button',
            margin: '0 0 0 8',
            ui: 'decline alt',
            text: 'Delete',
            testId: 'portcallDeleteDialogDeleteButton',
            handler: function (me) {
                let portcalls = Ext.getStore('portcalls'),
                    record = this.upVM().get('record'),
                    recentlyOpened = this.upVM().get('recentlyOpened'),
                    call_from_grid = this.upVM().get('call_from_grid'),
                    accountStore = Ext.getStore('accounts'),
                    disbursementStore = Ext.getStore('disbursements'),
                    paymentStore = Ext.getStore('payments');

                if (call_from_grid) {
                    portcalls.remove(record);
                    portcalls.sync({
                        success: function () {
                            recentlyOpened.reload();
                            if (accountStore) accountStore.reload();
                            if (disbursementStore) disbursementStore.reload();
                            if (paymentStore) paymentStore.reload();
                            me.up('dialog').destroy();
                            Ext.toast('Record deleted', 2500);
                        },
                        failure: function failure(response) {
                            me.up('dialog').destroy();
                            Ext.Msg.alert('Something went wrong', 'Could not delete portcall.');
                        },
                    });
                } else {
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'portcall/' + record.get('id'),
                        method: 'DELETE',
                        headers: {
                            'Content-Type': null,
                        },
                        success: function (response) {
                            recentlyOpened.reload();
                            if (portcalls) {
                                portcalls.remove(record);
                            }
                            me.up('dialog').destroy();
                            Ext.toast('Record deleted', 2500);
                            if (Ext.getCmp('main-viewport').getVM().get('currentUserType') !== 'agent') {
                                Ext.getCmp('main-viewport').getController().redirectTo('operations/port-calls');
                            } else {
                                Ext.getCmp('main-viewport').getController().redirectTo('portcalls');
                            }
                        },
                        failure: function failure(response) {
                            me.up('dialog').destroy();
                            Ext.Msg.alert('Something went wrong', 'Could not delete portcall.');
                        },
                    });
                }
            },
        },
    ],
});

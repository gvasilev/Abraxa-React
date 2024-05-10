Ext.define('Abraxa.view.settings.library.ports.TerminalEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'settings.library.terminals.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function (btn, e) {
                let me = this,
                    terminal = me.upVM().get('terminal'),
                    selectedPort = me.upVM().get('portsServerGrid.selection');
                Ext.create('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalDialog', {
                    viewModel: {
                        data: {
                            record: Ext.create('Abraxa.model.suggestions.Terminal', {
                                id: terminal.get('id'),
                                meta_name: terminal.get('name'),
                                legacy_parent_id: selectedPort.get('port_id'),
                            }),
                        },
                    },
                }).show();
                // Ext.Ajax.request({
                //     url: Env.nomenclatureEndPoint + 'api/registry/v1/terminals-legacy/' + record.get('id'),
                //     method: 'GET',
                //     success: function (response) {
                //         let data = Ext.decode(response.responseText);

                //     },
                //     failure: function failure(response) { },
                // });
            },
        },
        // {
        //     text: 'Edit',
        //     iconCls: 'md-icon-outlined md-icon-edit',
        //     slug: 'settingsLibraryTerminal',
        //     bind: {
        //         permission: '{userPermissions}',
        //         hidden: '{terminal.company_id ? false : true}'
        //     },
        //     handler: function () {
        //         let me = this,
        //             record = me.upVM().get('terminal'),
        //             grid = Ext.ComponentQuery.query('settings\\.library\\.terminals\\.grid')[0];

        //         grid.select(record);
        //     }
        // },
        // {
        //     text: 'Delete',
        //     iconCls: 'md-icon-outlined md-icon-delete',
        //     ui: 'decline',
        //     separator: true,
        //     slug: 'settingsLibraryTerminalDelete',
        //     bind: {
        //         permission: '{userPermissions}',
        //         hidden: '{terminal.company_id ? false:true}'
        //     },
        //     handler: function (button, el, data) {
        //         let me = this,
        //             record = me.upVM().get('terminal'),
        //             portserveRecord = me.upVM().get('portserveRecord'),
        //             currentUser = me.upVM().get('currentUser'),
        //             store = me.upVM().get('portsServerGrid.selection').terminals();
        //         Ext.Msg.confirm(
        //             'Delete',
        //             'Are you sure you would like to delete this record?',
        //             function (answer) {
        //                 if (answer != 'yes') return;
        //                 store.remove(record);
        //                 store.sync({
        //                     success: function (batch) {
        //                         portserveRecord.set('updated_by_user', currentUser.getData());
        //                         portserveRecord.set('updated_at', new Date());
        //                         portserveRecord.save();
        //                         Ext.toast('Record deleted', 1000);
        //                     },
        //                     failure: function (batch) {
        //                         Ext.Msg.alert('Something went wrong', 'Unable to delete this record!');
        //                     }
        //                 });
        //             }, this, [{
        //                 xtype: 'button',
        //                 itemId: 'no',
        //                 margin: '0 8 0 0',
        //                 text: 'Cancel'
        //             }, {
        //                 xtype: 'button',
        //                 itemId: 'yes',
        //                 ui: 'decline alt',
        //                 text: 'Delete'
        //             }]
        //         );
        //     }
        // }
    ],
});

Ext.define('Abraxa.RowEditor', {
    override: 'Ext.grid.rowedit.Editor',

    gotoRecord: function (recordIndex) {
        var me = this,
            store = me.grid.store;

        if (recordIndex >= 0 && recordIndex < store.getCount()) {
            me.plugin.startEdit(store.getAt(recordIndex), 1);
        }
    },
    privates: {
        saveChanges: function (commit) {
            var me = this,
                ret = me.isValid(),
                location = me.activeLocation,
                activeLocation,
                changes,
                message;

            if (ret && me.activeLocation) {
                changes = me.getChanges();

                if (changes) {
                    me.getRecord().set(changes);
                }

                activeLocation = me.activeLocation;
                location.commit = commit;

                location.fireEditEvent('edit', me);

                if (location.commit) {
                    me.commit();
                }

                location.commit = null;
            } else {
                message = me.plugin.getInvalidToastMessage();

                if (message) {
                    let messageBox = Ext.getCmp('editorError');

                    if (!messageBox) {
                        let field = this.getItems().items[1].getItems().items[3];
                        field.addCls('x-focused');
                        field.addCls('x-invalid');
                        // Ext.create('Ext.MessageBox', {
                        //     title: 'Warning',
                        //     id: 'editorError',
                        //     message: 'Pelease fill all required fields.',
                        //     alwaysOnTop: true,
                        //     bbar: {
                        //         items: ['->', {
                        //             xtype: 'button',
                        //             ui: 'normal',
                        //             text: 'OK',
                        //             handler: function (me) {
                        //                 this.up('dialog').destroy();
                        //             }
                        //         }]
                        //     }
                        // }).show();
                    }
                }
            }

            return ret;
        },
    },
});

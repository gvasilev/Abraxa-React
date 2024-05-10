Ext.define('Abraxa.view.profile.AddSignature', {
    extend: 'Ext.Dialog',
    xtype: 'profile.add.edit.signature',
    cls: 'a-dialog-create a-dialog-has-icon',
    bind: {
        title: '<div class="a-badge a-badge-signature"><i class="md-icon-outlined">gesture</i></div>{editMode ? "Edit signature":"Add signature"}',
    },
    tools: {
        close: {
            handler: function () {
                let dialog = this.up('dialog'),
                    record = this.upVM().get('record');
                record.reject();
                dialog.destroy();
            },
        },
    },
    manageBorders: false,
    draggable: false,
    maximizable: false,
    maximized: false,
    minWidth: 640,
    maxWidth: 640,
    width: 640,
    padding: '0 24',
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            padding: 0,
            // defaults: {
            //     clearable: false,
            //     labelAlign: 'left',
            //     ui: 'classic hovered-border',
            // },
            items: [
                {
                    xtype: 'textfield',
                    margin: '0 0 0 48',
                    label: false,
                    clearable: false,
                    placeholder: 'Enter signature name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{record.name}',
                    },
                },
                {
                    xtype: 'div',
                    margin: '0 0 0 48',
                    html: '<hr>',
                },
                {
                    xtype: 'froalaeditor',
                    ui: 'light',
                    cls: 'signature_editor',
                    scrollable: true,
                    shadow: false,
                    border: false,
                    flex: 1,
                    minHeight: 380,
                    margin: '0 0 0 36',
                    editor: {
                        attribution: false,
                        quickInsertEnabled: false,
                        theme: 'dark',
                        imagePaste: true,
                        enter: this.ENTER_BR,
                        toolbarButtons: [
                            'bold',
                            'italic',
                            'underline',
                            'fontFamily',
                            'fontSize',
                            'textColor',
                            'alignLeft',
                            'alignRight',
                            'insertTable',
                            'insertImage',
                            'insertLink',
                        ],
                        fontFamily: {
                            'Arial,sans-serif': 'Arial',
                            'Courier New, Courier': 'Courier New',
                        },
                        toolbarButtons: {
                            moreText: {
                                buttons: [
                                    'bold',
                                    'italic',
                                    'underline',
                                    'fontFamily',
                                    'fontSize',
                                    'textColor',
                                    'clearFormatting',
                                ],
                                buttonsVisible: 3,
                            },
                            moreRich: {
                                buttons: ['insertLink', 'insertImage'],
                                buttonsVisible: 2,
                            },
                            Table: {
                                buttons: ['insertTable'],
                                buttonsVisible: 1,
                            },
                            moreParagraph: {
                                buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
                                buttonsVisible: 1,
                            },
                            moreMisc: {
                                buttons: ['html'],
                                align: 'right',
                                buttonsVisible: 1,
                            },
                        },
                        imageUploadURL: '/server/api/upload_signature_image',

                        // imageUploadParams: {
                        //     id: 'my_editor'
                        // },
                        // events: {
                        //     'image.removed': function ($img) {
                        //         var xhttp = new XMLHttpRequest();
                        //         xhttp.onreadystatechange = function () {

                        //             // Image was removed.
                        //             if (this.readyState == 4 && this.status == 200) {

                        //             }
                        //         };
                        //         xhttp.open("POST", "/server/api/delete_signature_image", true);
                        //         xhttp.send(JSON.stringify({
                        //             src: $img.attr('src')
                        //         }));
                        //     }
                        // }
                    },
                    bind: {
                        value: '{record.signature}',
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
                    this.upVM().get('userSignatures').rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('userSignatures');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('record'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot update user signature!');
                                },
                            });
                            dialog.destroy();
                        } else {
                            store.add(record);
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record created', 1000);
                                    mixpanel.track('Create signature - button');
                                    dialog.destroy();
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot create user signature!');
                                },
                            });
                        }
                    } else {
                        dialog
                            .down('form\\.error')
                            .setHtml('Please fill in all required fields')
                            .show()
                            .addCls('error');
                        me.toggle();
                    }
                },
            },
        ],
    },
});

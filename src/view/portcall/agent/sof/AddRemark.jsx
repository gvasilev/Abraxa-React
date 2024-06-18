Ext.define('Abraxa.view.portcall.sof.AddRemark', {
    xtype: 'add.sof.remarks',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    scrollable: 'y',
    width: 620,
    minHeight: 580,
    maxHeight: '90%',
    padding: 0,
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    manageBorders: false,
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">notes</i></div>Add SOF Remarks',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
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
                            xtype: 'formpanel',
                            cls: 'a-instructions-container',
                            scrollable: false,
                            padding: 0,
                            flex: 1,
                            defaults: {
                                clearable: false,
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    margin: '0 24 0 72',
                                    label: false,
                                    placeholder: 'Enter remark title',
                                    ui: 'field-xl no-border classic',
                                    required: true,
                                    bind: {
                                        value: '{remark.remark_title}',
                                        disabled: '{object_record.is_archived ? true:false}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.focus();
                                            me.setError(false);
                                        },
                                    },
                                },
                                {
                                    xtype: 'froalaeditorfield',
                                    padding: '0 24 0 58',
                                    name: 'test',
                                    cls: 'voyageInstructionsEdtior',
                                    shadow: false,
                                    height: '90%',
                                    flex: 1,
                                    editor: {
                                        autofocus: true,
                                        attribution: false,
                                        quickInsertEnabled: false,
                                        theme: 'royal',
                                        pastePlain: true,
                                        enter: 2,
                                        imagePaste: false,
                                        height: 300,
                                        charCounterCount: false,
                                        toolbarButtons: [
                                            'bold',
                                            'italic',
                                            'underline',
                                            'fontSize',
                                            'backgroundColor',
                                            'textColor',
                                            'formatOL',
                                            'formatUL',
                                        ],
                                    },
                                    bind: {
                                        value: '{remark.remark_text}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            if (
                                                me.upVM().get('object_record') &&
                                                me.upVM().get('object_record').get('is_archived')
                                            ) {
                                                me.setDisabled(true);
                                            }
                                        },
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
            margin: '0 8 0 0',
            handler: function () {
                let remarks = this.upVM().get('remarks');
                if (remarks) {
                    remarks.rejectChanges();
                }
                this.up('dialog').destroy();
            },
        },
        {
            enableToggle: true,
            ui: 'action loading',
            bind: {
                text: '{editMode ? "Save" : "Create"}',
            },
            handler: function (btn) {
                let form = btn.up('dialog').down('formpanel'),
                    record = btn.upVM().get('remark'),
                    remarks = btn.upVM().get('remarks'),
                    editMode = btn.upVM().get('editMode');
                if (form.validate()) {
                    btn.up('dialog').down('form\\.error').hide();
                    if (editMode) {
                        remarks.sync({
                            success: function (rec) {
                                Ext.toast('Record updated', 1000);
                                btn.toggle();
                                btn.up('dialog').destroy();
                            },
                            failure: function (batch, operation) {
                                Ext.Msg.alert('Something went wrong', 'Something went wrong');
                            },
                        });
                    } else {
                        remarks.add(record);
                        remarks.sync({
                            success: function (rec) {
                                Ext.toast('Record created', 1000);
                                btn.toggle();
                                btn.up('dialog').destroy();
                            },
                            failure: function (batch, operation) {
                                Ext.Msg.alert('Something went wrong', 'Something went wrong');
                            },
                        });
                    }
                } else {
                    btn.toggle();
                    btn.up('dialog')
                        .down('form\\.error')
                        .setHtml('Please fill all required fields')
                        .show()
                        .addCls('error');
                }
            },
        },
    ],
});

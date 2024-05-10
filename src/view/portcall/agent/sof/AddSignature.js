Ext.define('Abraxa.view.portcall.sof.AddSignature', {
    xtype: 'add.sof.signature',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    scrollable: 'y',
    width: 540,
    padding: '8 24 24 72',
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    manageBorders: false,
    bind: {
        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">checklist_rtl</i></div>{editMode ? "Edit SOF Signature" : "Add SOF Signature"}',
    },
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
                            xtype: 'textfield',
                            placeholder: 'Enter company',
                            label: 'Company',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-business-center icon-rounded',
                            bind: {
                                value: '{signature.company_name}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Signature label',
                            cls: 'a-field-icon icon-short icon-rounded',
                            ui: 'classic hovered-border',
                            clearable: false,
                            labelAlign: 'left',
                            placeholder: 'Enter signature label',
                            bind: {
                                value: '{signature.signature_label}',
                            },
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
                let signatures = this.upVM().get('signatures');
                if (signatures) {
                    signatures.rejectChanges();
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
                    record = btn.upVM().get('signature'),
                    signatures = btn.upVM().get('signatures'),
                    editMode = btn.upVM().get('editMode');
                if (form.validate()) {
                    btn.up('dialog').down('form\\.error').hide();
                    if (editMode) {
                        if (record.get('type') == 'master') {
                            record.set('is_manual_edit', true);
                        }
                        signatures.sync({
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
                        signatures.add(record);
                        signatures.sync({
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

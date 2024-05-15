Ext.define('Abraxa.view.cdb.company.financials.overview.CreateReportingCurrency', {
    extend: 'Ext.Dialog',
    xtype: 'financials.reporting.currency.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    closable: true,
    centered: true,
    width: 480,
    padding: '0 24 16 72',
    bind: {
        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">attach_money</i></div>{editMode ? "Edit reporting currency":"Set reporting currency"}',
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
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container',
                            items: [
                                {
                                    xtype: 'common-combo-currency',
                                    placeholder: 'Currency',
                                    labelAlign: 'left',
                                    label: 'Currency',
                                    required: true,
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-money icon-rounded',
                                    bind: {
                                        value: '{object_record.preferred_currency}',
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
                var record = this.upVM().get('object_record');
                record.reject();
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Save',
            enableToggle: true,
            ui: 'action loading',
            handler: function (me) {
                let vm = me.upVM(),
                    dialog = me.up('dialog'),
                    object_record = vm.get('object_record'),
                    currentUser = vm.get('currentUser'),
                    form = dialog.down('formpanel');

                if (form.validate()) {
                    form.down('form\\.error').setHtml('').hide().removeCls('error');
                    object_record.set('updated_by_user', currentUser.getData());
                    object_record.set('updated_at', new Date());
                    object_record.save({
                        success: function (rec) {
                            Ext.toast('Record updated', 1000);
                            dialog.destroy();
                        },
                    });
                } else {
                    me.toggle();
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});

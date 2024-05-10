Ext.define('Abraxa.view.settings.library.ports.DuplicateHoliday', {
    extend: 'Ext.Dialog',
    xtype: 'settings.library.ports.duplicate.holiday',
    cls: 'a-dialog-create a-dialog-has-icon',
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">content_copy</i></div>Duplicate holiday',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    minHeight: 320,
    padding: '0 24 0 72',
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
            flex: 1,
            layout: 'vbox',
            margin: 0,
            padding: 0,
            items: [
                {
                    xtype: 'div',
                    html: '<div class="text-info">Duplicate holidays to another port(s)</div>',
                },
                {
                    xtype: 'div',
                    cls: 'my-16',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    defaults: {
                        labelAlign: 'left',
                    },
                    items: [
                        {
                            xtype: 'ports.served.combo',
                            label: 'Port',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-port icon-rounded',
                            multiSelect: true,
                            forceSelection: false,
                            reference: 'portServedCombo',
                            placeholder: 'Choose ports',
                            required: true,
                            bind: {
                                store: '{filteredPortServed}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                margin: '0 8 0 0',
                text: 'Cancel',
                handler: function () {
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                enableToggle: true,
                ui: 'action loading',
                text: 'Duplicate',
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM();
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let currentUser = Ext.Viewport.getViewModel().get('currentUser');
                        let selections = vm.get('portServedCombo.selection'),
                            multiple = vm.get('multiple'),
                            holiday = vm.get('holiday');
                        if (selections) {
                            if (multiple) {
                                holiday.forEach(function (holidayRec, index) {
                                    selections.forEach(function (rec, index) {
                                        let recordData = holidayRec.getData();
                                        delete recordData['id'];
                                        let newRecord = new Abraxa.model.common.Holiday(Object.assign({}, recordData));
                                        newRecord.set('country_id', rec.get('port').country_id);
                                        newRecord.set('company_id', currentUser.get('current_company_id'));
                                        rec.holidays().add(newRecord);
                                        rec.holidays().sync();
                                    });
                                });
                            } else {
                                selections.forEach(function (rec, index) {
                                    let recordData = holiday.getData();
                                    delete recordData['id'];
                                    let newRecord = new Abraxa.model.common.Holiday(Object.assign({}, recordData));
                                    newRecord.set('country_id', rec.get('port').country_id);
                                    newRecord.set('company_id', currentUser.get('current_company_id'));
                                    rec.holidays().add(newRecord);
                                    rec.holidays().sync();
                                });
                            }
                            Ext.toast('Record created', 1000);
                            if (multiple) {
                                Ext.ComponentQuery.query('settings\\.library\\.holidays\\.grid')[0].deselectAll();
                            }
                            dialog.destroy();
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

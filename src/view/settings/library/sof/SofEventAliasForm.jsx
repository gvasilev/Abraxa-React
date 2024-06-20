Ext.define('Abraxa.view.settings.library.sof.SofEventAliasForm', {
    xtype: 'settings.lybrary.sof.event.alias.form',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    cls: 'a-dialog-create a-dialog-has-icon',
    bind: {
        title: '<div class="a-badge a-badge-sof"><i class="material-icons-outlined">timer</i></div>{title}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 500,
    padding: '0 24 0 72',
    viewModel: true,
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
            cls: '',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'textfield',
                    testId: 'eventAliasNameSofEventAliasFormTestId',
                    label: false,
                    placeholder: 'Enter event name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{record.event_alias}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'System name',
                    labelAlign: 'left',
                    disabled: true,
                    ui: 'viewonly classic',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{record.name}',
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Category',
                    placeholder: 'Choose category',
                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                    valueField: 'id',
                    ui: 'viewonly classic',
                    displayField: 'name',
                    disabled: true,
                    reference: 'selectedSofCategory',
                    bind: {
                        store: '{defaultSofEventCategories}',
                        value: '{record.default_sof_event_category_id}',
                    },
                },
                {
                    xtype: 'combobox',
                    label: 'Type',
                    placeholder: 'Choose type',
                    cls: 'a-field-icon icon-short icon-rounded non-editable selected_event_type',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    ui: 'viewonly classic',
                    forceSelection: true,
                    disabled: true,
                    reference: 'selectedEventType',
                    bind: {
                        store: '{defaultSofEventTypes}',
                        value: '{record.default_sof_event_type_id}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Reference ID',
                    placeholder: 'Refenrece ID',
                    cls: 'a-field-icon icon-numbers icon-rounded',
                    bind: {
                        value: '{record.reference}',
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
                handler: function (me) {
                    let vm = me.upVM(),
                        store = vm.get('sofEvents');

                    store.rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                testId: 'SaveButtonTestIdSofEventAliasForm',
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('sofEvents');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('record'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            if (record.dirty) {
                                store.sync({
                                    success: function (batch, opt) {
                                        Ext.toast('Record updated', 1000);
                                        dialog.destroy();
                                    },
                                    failure: function (batch, operations) {
                                        me.toggle();
                                    },
                                });
                            } else {
                                dialog.destroy();
                            }
                        } else {
                            record.save({
                                success: function (rec, operation) {
                                    Ext.toast('Record created', 1000);
                                    store.add(rec);
                                    dialog.destroy();
                                },
                                failure: function (batch, operations) {
                                    me.toggle();
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

Ext.define('Abraxa.view.settings.library.sof.SofEventForm', {
    xtype: 'settings.lybrary.sof.event.form',
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
    padding: '0 24 0 0',
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
            cls: 'a-general-form',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'textfield',
                    label: false,
                    placeholder: 'Enter event name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{record.name}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Category',
                    placeholder: 'Choose category',
                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                    valueField: 'id',
                    displayField: 'name',
                    required: true,
                    reference: 'selectedSofCategory',
                    bind: {
                        store: '{defaultSofEventCategories}',
                        value: '{record.default_sof_event_category_id}',
                    },
                    listeners: {
                        select: function (cmp, selection) {
                            let selectedEventTypeCombo = Ext.ComponentQuery.query('[cls~=selected_event_type]')[0],
                                selectedEventType = cmp.upVM().get('selectedEventType').selection;

                            if (
                                selectedEventType &&
                                selectedEventType.get('default_sof_event_category_id') != selection.get('id')
                            )
                                selectedEventTypeCombo.clearValue();
                        },
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
                    forceSelection: true,
                    required: true,
                    reference: 'selectedEventType',
                    bind: {
                        store: '{defaultSofEventTypes}',
                        value: '{record.default_sof_event_type_id}',
                        disabled: '{selectedSofCategory.value ? false : true}',
                    },
                    listeners: {
                        beforequery: function () {
                            var category_id = this.upVM().get('selectedSofCategory').value;
                            if (category_id) {
                                this.getStore().clearFilter();
                                this.getStore().addFilter({
                                    property: 'default_sof_event_category_id',
                                    value: category_id,
                                    operator: '=',
                                });
                            } else {
                                return false;
                            }
                        },
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
                                        Ext.Msg.alert('Something went wrong', 'Cannot update template!');
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
                                    Ext.Msg.alert('Something went wrong', 'Cannot create template!');
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

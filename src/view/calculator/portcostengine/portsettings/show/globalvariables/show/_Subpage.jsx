import './ViewModel';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.globalvariables.show._Subpage', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.globalvariables.show.subpage',
    flex: 1,
    viewModel: 'calculator.portcostengine.globalvariables.show',
    items: [
        {
            xtype: 'container',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    items: [
                        {
                            xtype: 'title',
                            height: 26,
                            padding: '2 0 0 0',
                            bind: {
                                title: '<div style="height: 30px; padding-top: 1px;"><span class="a-badge-clc">{calcGlobalVariablesList.selection.slug}</span> {calcGlobalVariablesList.selection.label}</div>',
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            right: 16,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-sm round',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    margin: '0 0 0 8',
                                    handler: function(me) {
                                        let record = me.upVM().get('calcGlobalVariablesList').selection;
                                        let store = me.upVM().getParent().getStore('calcglobalvariable');
                                        let selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection');

                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you would like to delete this entry?',
                                            function(answer) {
                                                if (answer === 'yes') {
                                                    store.remove(record);

                                                    store.sync({
                                                        success: function() {
                                                            let list = Ext.ComponentQuery.query(
                                                                'list[reference=calcGlobalVariablesList]',
                                                            )[0];

                                                            if (list.getStore().getCount()) {
                                                                // Auto select the last record in the list
                                                                list.select(
                                                                    list
                                                                        .getStore()
                                                                        .getAt(list.getStore().getCount() - 1),
                                                                );
                                                                me.upVM().set(
                                                                    'subpageXtype',
                                                                    'calculator.portcostengine.portsettings.show.globalvariables.show.subpage',
                                                                );
                                                            } else {
                                                                // Auto select the first nomenclature
                                                                let nomenclatureList = Ext.ComponentQuery.query(
                                                                    'list[reference=nomenclaturesList]',
                                                                )[0];
                                                                nomenclatureList.select(
                                                                    nomenclatureList.getStore().getAt(0),
                                                                );
                                                                me.upVM().set(
                                                                    'subpageXtype',
                                                                    'calculator.portcostengine.portsettings.show.nomenclatures.nomenclaturetree',
                                                                );
                                                            }
                                                            Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                            Ext.toast('Record deleted', 1000);
                                                        },
                                                        failure: function(batch, functions) {
                                                            store.rejectChanges();
                                                        },
                                                    });
                                                }
                                            },
                                            this,
                                            [
                                                {
                                                    xtype: 'button',
                                                    itemId: 'no',
                                                    margin: '0 8 0 0',
                                                    text: 'Cancel',
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'yes',
                                                    text: 'Delete',
                                                    ui: 'decline alt',
                                                    separator: true,
                                                },
                                            ],
                                        );
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            reference: 'globalVariableForm',
            cls: '',
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
                    padding: '24',
                    scrollable: false,
                    flex: 1,
                    layout: {
                        type: 'vbox',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Variable name',
                                    placeholder: 'Variable name',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    ui: 'classic',
                                    required: true,
                                    forceSelection: true,
                                    labelAlign: 'left',
                                    bind: {
                                        value: '{recordCopy.label}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Variable type',
                                    labelAlign: 'left',
                                    placeholder: 'Choose type',
                                    reference: 'variableTypeEdit',
                                    required: true,
                                    ui: 'classic',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    options: [
                                        {
                                            value: 'variable',
                                            text: 'Normal',
                                        },
                                        {
                                            value: 'repeater',
                                            text: 'Repeater',
                                        },
                                    ],
                                    bind: {
                                        value: '{recordCopy.control}',
                                    },
                                    listeners: {
                                        select: function(me, selection) {
                                            if (selection.get('value') === 'variable') {
                                                let recordCopy = me.upVM().get('recordCopy');
                                                recordCopy.set('repeater', null);
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            bind: {
                                hidden: '{variableTypeEdit.selection.value === "repeater" ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Repeater type',
                                    labelAlign: 'left',
                                    placeholder: 'Choose type',
                                    reference: 'repeaterTypeEdit',
                                    ui: 'classic',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    options: [
                                        {
                                            value: 'sum',
                                            text: 'Sum',
                                        },
                                        {
                                            value: 'min',
                                            text: 'Min',
                                        },
                                        {
                                            value: 'max',
                                            text: 'Max',
                                        },
                                    ],
                                    bind: {
                                        value: '{recordCopy.repeater_type}',
                                        required: '{variableTypeEdit.selection.value === "repeater" ? true : false}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            bind: {
                                hidden: '{variableTypeEdit.selection.value === "repeater" ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Repeater source',
                                    labelAlign: 'left',
                                    placeholder: 'Choose source',
                                    reference: 'repeaterSourceEdit',
                                    ui: 'classic',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    displayField: 'label',
                                    valueField: 'slug',
                                    bind: {
                                        value: '{recordCopy.repeater_slug}',
                                        store: '{calcglobalrepeatertype}',
                                        required: '{variableTypeEdit.selection.value === "repeater" ? true : false}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'divider-offset offset-x24',
                            html: '<hr>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h4 class="my-8">Variable formula</h4>',
                                },
                                {
                                    xtype: 'textareafield',
                                    label: false,
                                    placeholder: 'Variable formula',
                                    required: true,
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    ui: 'classic',
                                    labelAlign: 'top',
                                    bind: {
                                        value: '{recordCopy.formula}',
                                    },
                                    validators: function(value) {
                                        let validationRegex = /^[\x20-\x7E]*$/;
                                        if (!validationRegex.test(value)) {
                                            return 'Prohibited character';
                                        }
                                        return true;
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'divider-offset offset-x24',
                            html: '<hr>',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            height: '64',
            padding: '0 24',
            cls: 'a-bt-100',
            layout: {
                type: 'hbox',
                align: 'center',
            },
            docked: 'bottom',
            items: [
                {
                    xtype: 'div',
                    cls: 'text-info',
                    margin: '0 20 0 0',
                    html: 'Last updated',
                },
                {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{calcGlobalVariablesList.selection.updated_by_user}',
                            updated_at: '{calcGlobalVariablesList.selection.updated_at}',
                        },
                    },
                },
                {
                    xtype: 'div',
                    flex: 1,
                },
                {
                    xtype: 'button',
                    ui: 'action loading',
                    text: 'Save',
                    height: 36,
                    handler: function(me) {
                        let record = me.upVM().get('calcGlobalVariablesList').selection;
                        let recordCopy = me.upVM().get('recordCopy');
                        let form = Ext.ComponentQuery.query('container[reference=globalVariableForm]')[0].down(
                            'formpanel',
                        );
                        let store = me.upVM().getParent().getStore('calcglobalvariable');
                        let selectionPort = me.upVM().getParent().get('calculatorPortSettingsGrid.selection');

                        record.set(recordCopy.getData());

                        if (record.dirty) {
                            store.sync({
                                success: function() {
                                    Ext.toast('Record updated', 1000);
                                    Ext.ComponentQuery.query('container[reference=globalVariableForm]')[0]
                                        .down('form\\.error')
                                        .hide()
                                        .removeCls('error');
                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                },
                                failure: function(batch, functions) {
                                    store.rejectChanges();
                                    Ext.ComponentQuery.query('container[reference=globalVariableForm]')[0]
                                        .down('form\\.error')
                                        .setHtml('Please fill all required fields')
                                        .show()
                                        .addCls('error');
                                },
                            });
                        } else {
                            store.rejectChanges();
                        }
                    },
                },
            ],
        },
    ],
});

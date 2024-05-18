import './ViewModel.jsx';
Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.variables.show._Subpage', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.variables.show.subpage',
    viewModel: 'calculator.portcostengine.pricebooks.show.variables.show',
    flex: 1,
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
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-keyboard-backspace',
                                    ui: 'round default',
                                    margin: '0 12 0 0',
                                    handler: function (me) {
                                        me.upVM().set(
                                            'subpageXtype',
                                            'calculator.portcostengine.portsettings.show.pricebooks.show.subpage'
                                        );
                                        let grid = Ext.ComponentQuery.query(
                                            'grid[reference=calculatorPriceBookVariablesGrid]'
                                        )[0];
                                        grid.deselectAll();
                                    },
                                    tooltip: {
                                        anchorToTarget: true,
                                        html: '<span class="tooltip_expand">Back <em>esc</em></span>',
                                        align: 'bc-tc?',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                    },
                                },
                                {
                                    xtype: 'title',
                                    height: 26,
                                    padding: '2 0 0 0',
                                    bind: {
                                        title: '<div style="height: 30px; padding-top: 1px;"><span class="a-badge-clc">{recordCopy.slug}</span> {recordCopy.label}</div>',
                                    },
                                },
                            ],
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
                                    handler: function (me) {
                                        let record = me.upVM().get('templateVariableRecord');
                                        let store = record.store;
                                        let selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection');

                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you would like to delete this entry?',
                                            function (answer) {
                                                if (answer === 'yes') {
                                                    store.remove(record);

                                                    store.sync({
                                                        success: function () {
                                                            me.upVM().set(
                                                                'subpageXtype',
                                                                'calculator.portcostengine.portsettings.show.pricebooks.show.subpage'
                                                            );
                                                            Ext.toast('Record deleted', 1000);
                                                            Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                        },
                                                        failure: function (batch, functions) {
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
                                            ]
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
            reference: 'templateVariableForm',
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
                                    reference: 'templateVariableTypeEdit',
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
                                        select: function (me, selection) {
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
                                hidden: '{templateVariableTypeEdit.selection.value === "repeater" ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Repeater type',
                                    labelAlign: 'left',
                                    placeholder: 'Choose type',
                                    reference: 'templateRepeaterTypeEdit',
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
                                        required:
                                            '{templateVariableTypeEdit.selection.value === "repeater" ? true : false}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            bind: {
                                hidden: '{templateVariableTypeEdit.selection.value === "repeater" ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Repeater source',
                                    labelAlign: 'left',
                                    placeholder: 'Choose source',
                                    ui: 'classic',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    displayField: 'label',
                                    valueField: 'slug',
                                    bind: {
                                        value: '{recordCopy.repeater_slug}',
                                        store: '{calctemplaterepeatertype}',
                                        required:
                                            '{templateVariableTypeEdit.selection.value === "repeater" ? true : false}',
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
                                    validators: function (value) {
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
                            user: '{templateVariableRecord.updated_by_user}',
                            updated_at: '{templateVariableRecord.updated_at}',
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
                    handler: function (me) {
                        let record = me.upVM().get('templateVariableRecord');
                        let recordCopy = me.upVM().get('recordCopy');
                        let form = Ext.ComponentQuery.query('container[reference=templateVariableForm]')[0].down(
                            'formpanel'
                        );
                        let store = record.store;
                        let selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection');

                        record.set(recordCopy.getData());

                        if (record.dirty) {
                            store.sync({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                    Ext.ComponentQuery.query('container[reference=templateVariableForm]')[0]
                                        .down('form\\.error')
                                        .hide()
                                        .removeCls('error');
                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                },
                                failure: function (batch, functions) {
                                    store.rejectChanges();
                                    Ext.ComponentQuery.query('container[reference=templateVariableForm]')[0]
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

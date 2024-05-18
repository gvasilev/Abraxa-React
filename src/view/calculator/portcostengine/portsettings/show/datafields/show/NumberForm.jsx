Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show.NumberForm', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.datafields.show.numberform',
    flex: 1,
    scrollable: true,
    height: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            height: 64,
            cls: 'a-titlebar a-bb-100',
            docked: 'top',
            items: [
                {
                    xtype: 'title',
                    height: 26,
                    padding: '2 0 0 0',
                    bind: {
                        title: '<div style="height: 30px; padding-top: 1px;"><span class="a-badge-clc">{calcDataFieldsList.selection.slug}</span> {calcDataFieldsList.selection.label} <span class="sm-title">({calcDataFieldsList.selection.control} field)</span></div>',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-tools',
                    right: 16,
                    bind: {
                        hidden: '{recordCopy.behaviour.canDelete ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'tool-sm round',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            margin: '0 0 0 8',
                            handler: function (me) {
                                let record = me.upVM().get('calcDataFieldsList').selection;
                                let store = me.upVM().getParent().getStore('calcdatafield');
                                let selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection');

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer === 'yes') {
                                            store.remove(record);

                                            store.sync({
                                                success: function () {
                                                    let list = Ext.ComponentQuery.query(
                                                        'list[reference=calcDataFieldsList]'
                                                    )[0];

                                                    if (list.getStore().getCount()) {
                                                        // Auto select the last record in the list
                                                        list.select(
                                                            list.getStore().getAt(list.getStore().getCount() - 1)
                                                        );
                                                        me.upVM().set(
                                                            'subpageXtype',
                                                            'calculator.portcostengine.portsettings.show.datafields.show.subpage'
                                                        );
                                                    } else {
                                                        // Auto select the first nomenclature
                                                        let nomenclatureList = Ext.ComponentQuery.query(
                                                            'list[reference=nomenclaturesList]'
                                                        )[0];
                                                        nomenclatureList.select(nomenclatureList.getStore().getAt(0));
                                                        me.upVM().set(
                                                            'subpageXtype',
                                                            'calculator.portcostengine.portsettings.show.nomenclatures.nomenclaturetree'
                                                        );
                                                    }
                                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                    Ext.toast('Record deleted', 1000);
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
        {
            xtype: 'container',
            reference: 'numberForm',
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
                                    label: 'Data field label',
                                    placeholder: 'Data field label',
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
                                    xtype: 'textfield',
                                    label: 'Add tooltip',
                                    placeholder: 'Add tooltip',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    ui: 'classic',
                                    labelAlign: 'left',
                                    bind: {
                                        value: '{recordCopy.tooltip}',
                                    },
                                },
                            ],
                        },
                        /*{
                            xtype: 'container',
                            cls: 'a-container-field',
                            layout: {
                                type: 'hbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Transform to slider?',
                                    labelAlign: 'left',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    bind: {
                                        checked: '{recordCopy.showStepper ? true : false}'
                                    },
                                    listeners: {
                                        check: function (me) {
                                            let record = me.upVM().get('recordCopy');
                                            if (record) {
                                                record.set('showStepper', true);
                                            }
                                        },
                                        uncheck: function (me) {
                                            let record = me.upVM().get('recordCopy');
                                            if (record) {
                                                record.set('showStepper', false);
                                            }
                                        }
                                    }
                                }
                            ]
                        },*/
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            bind: {
                                hidden: '{recordCopy.behaviour.canControlMultiply ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Multiply?',
                                    labelAlign: 'left',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    bind: {
                                        checked: '{recordCopy.multiply ? true : false}',
                                    },
                                    listeners: {
                                        check: function (me) {
                                            let record = me.upVM().get('recordCopy');
                                            if (record) {
                                                record.set('multiply', true);
                                            }
                                        },
                                        uncheck: function (me) {
                                            let record = me.upVM().get('recordCopy');
                                            if (record) {
                                                record.set('multiply', false);
                                            }
                                        },
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
                            xtype: 'div',
                            html: '<h4 class="text-uppercase mt-8">Value settings</h4>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    disabled: true,
                                    label: 'Field type',
                                    labelAlign: 'left',
                                    placeholder: 'Field type',
                                    required: true,
                                    ui: 'classic',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    options: [
                                        {
                                            value: 'number',
                                            text: 'Number field',
                                        },
                                        {
                                            value: 'choice',
                                            text: 'Dropdown field',
                                        },
                                        {
                                            value: 'complex',
                                            text: 'Complex field',
                                        },
                                    ],
                                    bind: {
                                        value: '{recordCopy.control}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Default value',
                                    placeholder: 'Default value',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    ui: 'classic',
                                    labelAlign: 'left',
                                    bind: {
                                        value: '{recordCopy.defaultValue}',
                                        hidden: '{recordCopy.behaviour.canSetDefaultValue ? false : true}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    label: 'Min value',
                                    placeholder: 'Min value',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    ui: 'classic',
                                    labelAlign: 'left',
                                    bind: {
                                        value: '{recordCopy.min}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    label: 'Max value',
                                    placeholder: 'Max value',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    ui: 'classic',
                                    labelAlign: 'left',
                                    bind: {
                                        value: '{recordCopy.max}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    label: 'Step',
                                    placeholder: 'Step',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    ui: 'classic',
                                    labelAlign: 'left',
                                    bind: {
                                        value: '{recordCopy.step}',
                                        hidden: '{recordCopy.showStepper ? false : true}',
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
                            xtype: 'div',
                            bind: {
                                hidden: '{(recordCopy.behaviour.isDefault && !recordCopy.behaviour.canHide) ? true : false}',
                            },
                            html: '<h4 class="my-8">Advanced logic</h4>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            bind: {
                                hidden: '{recordCopy.behaviour.canHaveAlias ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Alias',
                                    placeholder: 'Alias',
                                    cls: 'a-field-icon value-text-uppercase icon-short icon-rounded',
                                    ui: 'classic',
                                    labelAlign: 'left',
                                    bind: {
                                        value: '{recordCopy.alias}',
                                    },
                                    validators: function (value) {
                                        let validationRegex = /^(?!_|\d+)(?=.*[A-Za-z])\w{2,}$/;
                                        if (!validationRegex.test(value)) {
                                            return 'Only letters, numbers and underscore are allowed | Minimum 2 characters';
                                        }
                                        return true;
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            bind: {
                                hidden: '{recordCopy.behaviour.canHide ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Hidden?',
                                    labelAlign: 'left',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    bind: {
                                        checked: '{recordCopy.disabled ? true : false}',
                                    },
                                    listeners: {
                                        check: function (me) {
                                            let record = me.upVM().get('recordCopy');
                                            if (record) {
                                                record.set('disabled', true);
                                            }
                                        },
                                        uncheck: function (me) {
                                            let record = me.upVM().get('recordCopy');
                                            if (record) {
                                                record.set('disabled', false);
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            bind: {
                                hidden: '{recordCopy.behaviour.isDefault ? true : false}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Is this question required?',
                                    labelAlign: 'left',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    bind: {
                                        checked: '{recordCopy.required}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-field',
                            margin: '8 0',
                            bind: {
                                hidden: '{recordCopy.behaviour.isDefault ? true : false}',
                            },
                            items: [
                                {
                                    xtype: 'textareafield',
                                    label: 'Visibility formula (rules to appear)',
                                    placeholder: 'e. g. QA * 100 + QB',
                                    cls: 'a-field-icon icon-functions icon-rounded',
                                    ui: 'classic',
                                    labelAlign: 'top',
                                    bind: {
                                        value: '{recordCopy.visibilityFormula}',
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
                            user: '{recordCopy.updated_by_user}',
                            updated_at: '{recordCopy.updated_at}',
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
                        let record = me.upVM().get('calcDataFieldsList').selection;
                        let recordCopy = me.upVM().get('recordCopy');
                        let form = Ext.ComponentQuery.query('container[reference=numberForm]')[0].down('formpanel');
                        let store = me.upVM().getParent().getStore('calcdatafield');
                        let selectionPort = me.upVM().getParent().get('calculatorPortSettingsGrid.selection');

                        record.set(recordCopy.getData());

                        if (record.dirty) {
                            store.sync({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                    Ext.ComponentQuery.query('container[reference=numberForm]')[0]
                                        .down('form\\.error')
                                        .hide()
                                        .removeCls('error');
                                    Abraxa.utils.Functions.updatePortCost(selectionPort);
                                },
                                failure: function (batch, functions) {
                                    store.rejectChanges();
                                    Ext.ComponentQuery.query('container[reference=numberForm]')[0]
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

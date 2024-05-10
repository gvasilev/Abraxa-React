Ext.define(
    'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafields.show.ComplexForm',
    {
        extend: 'Ext.Container',
        xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafields.show.complexform',
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
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'center',
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
                                        'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.subpage'
                                    );
                                    let grid = Ext.ComponentQuery.query(
                                        'grid[reference=calculatorPriceBookServiceDataFieldsGrid]'
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
                                    title: '<div style="height: 30px; padding-top: 1px;"><span class="a-badge-clc">{templateServiceDataFieldRecord.slug}</span> {templateServiceDataFieldRecord.label} <span class="sm-title">({templateServiceDataFieldRecord.control} field)</span></div>',
                                },
                            },
                        ],
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
                                    let record = me.upVM().get('templateServiceDataFieldRecord');
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
                                                            'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.subpage'
                                                        );
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
                reference: 'pbs_complexForm',
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
                                        labelAlign: 'left',
                                        bind: {
                                            value: '{recordCopy.label}',
                                        },
                                    },
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
                                        forceSelection: false,
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
                                        xtype: 'selectfield',
                                        reference: 'pbs_prefix_controlEdit',
                                        forceSelection: false,
                                        label: 'Prefix type',
                                        labelAlign: 'left',
                                        placeholder: 'Prefix type',
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
                                                text: 'Choice field',
                                            },
                                        ],
                                        bind: {
                                            value: '{recordCopy.prefix_control}',
                                        },
                                    },
                                ],
                            },
                            {
                                xtype: 'container',
                                cls: 'a-container-field',
                                bind: {
                                    hidden: '{pbs_prefix_controlEdit.selection.value === "number" ? false : true}',
                                },
                                items: [
                                    /*{
                                    xtype: 'container',
                                    cls: 'a-container-field',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
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
                                                checked: '{recordCopy.prefix_showStepper ? true : false}'
                                            },
                                            listeners: {
                                                check: function (me) {
                                                    let record = me.upVM().get('recordCopy');
                                                    if (record) {
                                                        record.set('prefix_showStepper', true);
                                                    }
                                                },
                                                uncheck: function (me) {
                                                    let record = me.upVM().get('recordCopy');
                                                    if (record) {
                                                        record.set('prefix_showStepper', false);
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },*/
                                    {
                                        xtype: 'textfield',
                                        label: 'Default value',
                                        placeholder: 'Default value',
                                        cls: 'a-field-icon icon-short icon-rounded',
                                        ui: 'classic',
                                        labelAlign: 'left',
                                        bind: {
                                            value: '{recordCopy.prefix_defaultValue}',
                                            hidden: '{recordCopy.prefix_behaviour.canSetDefaultValue ? false : true}',
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
                                            value: '{recordCopy.prefix_min}',
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
                                            value: '{recordCopy.prefix_max}',
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
                                            value: '{recordCopy.prefix_step}',
                                            hidden: '{recordCopy.prefix_showStepper ? false : true}',
                                        },
                                    },
                                ],
                            },
                            {
                                xtype: 'container',
                                cls: 'a-container-field',
                                bind: {
                                    hidden: '{pbs_prefix_controlEdit.selection.value === "choice" ? false : true}',
                                },
                                items: [
                                    {
                                        xtype: 'selectfield',
                                        forceSelection: false,
                                        reference: 'pbs_prefix_optionsSourceEdit',
                                        label: 'Options source',
                                        labelAlign: 'left',
                                        placeholder: 'Options source',
                                        ui: 'classic',
                                        cls: 'a-field-icon icon-short icon-rounded',
                                        bind: {
                                            options: '{prefix_optionSourceDropdownOptions}',
                                            value: '{recordCopy.prefix_source}',
                                            required:
                                                '{pbs_prefix_controlEdit.selection.value === "choice" ? true : false}',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        bind: {
                                            items: '{complexFieldPrefixActiveItemForm}',
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
                                        xtype: 'selectfield',
                                        reference: 'pbs_suffix_controlEdit',
                                        forceSelection: false,
                                        label: 'Suffix type',
                                        labelAlign: 'left',
                                        placeholder: 'Suffix type',
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
                                                text: 'Choice field',
                                            },
                                        ],
                                        bind: {
                                            value: '{recordCopy.suffix_control}',
                                        },
                                    },
                                ],
                            },
                            {
                                xtype: 'container',
                                cls: 'a-container-field',
                                bind: {
                                    hidden: '{pbs_suffix_controlEdit.selection.value === "number" ? false : true}',
                                },
                                items: [
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
                                                checked: '{recordCopy.suffix_showStepper ? true : false}'
                                            },
                                            listeners: {
                                                check: function (me) {
                                                    let record = me.upVM().get('recordCopy');
                                                    if (record) {
                                                        record.set('suffix_showStepper', true);
                                                    }
                                                },
                                                uncheck: function (me) {
                                                    let record = me.upVM().get('recordCopy');
                                                    if (record) {
                                                        record.set('suffix_showStepper', false);
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },*/
                                    {
                                        xtype: 'textfield',
                                        label: 'Default value',
                                        placeholder: 'Default value',
                                        cls: 'a-field-icon icon-short icon-rounded',
                                        ui: 'classic',
                                        labelAlign: 'left',
                                        bind: {
                                            value: '{recordCopy.suffix_defaultValue}',
                                            hidden: '{recordCopy.suffix_behaviour.canSetDefaultValue ? false : true}',
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
                                            value: '{recordCopy.suffix_min}',
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
                                            value: '{recordCopy.suffix_max}',
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
                                            value: '{recordCopy.suffix_step}',
                                            hidden: '{recordCopy.suffix_showStepper ? false : true}',
                                        },
                                    },
                                ],
                            },
                            {
                                xtype: 'container',
                                cls: 'a-container-field',
                                bind: {
                                    hidden: '{pbs_suffix_controlEdit.selection.value === "choice" ? false : true}',
                                },
                                items: [
                                    {
                                        xtype: 'selectfield',
                                        forceSelection: false,
                                        reference: 'pbs_suffix_optionsSourceEdit',
                                        label: 'Options source',
                                        labelAlign: 'left',
                                        placeholder: 'Options source',
                                        ui: 'classic',
                                        cls: 'a-field-icon icon-short icon-rounded',
                                        bind: {
                                            options: '{suffix_optionSourceDropdownOptions}',
                                            value: '{recordCopy.suffix_source}',
                                            required:
                                                '{pbs_suffix_controlEdit.selection.value === "choice" ? true : false}',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        bind: {
                                            items: '{complexFieldSuffixActiveItemForm}',
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
                                bind: {
                                    hidden: '{(recordCopy.behaviour.isDefault && !recordCopy.behaviour.canHide) ? true : false}',
                                },
                                items: [
                                    {
                                        xtype: 'div',
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
                                        layout: {
                                            type: 'hbox',
                                            align: 'center',
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
                                                slug: 'cdbAgreementsDirectBillingActivate',
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
                            let record = me.upVM().get('templateServiceDataFieldRecord');
                            let recordCopy = me.upVM().get('recordCopy');
                            let form = Ext.ComponentQuery.query('container[reference=pbs_complexForm]')[0].down(
                                'formpanel'
                            );
                            let selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection');

                            let store = record.store;

                            record.set(recordCopy.getData());

                            if (record.dirty) {
                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                        Ext.ComponentQuery.query('container[reference=pbs_complexForm]')[0]
                                            .down('form\\.error')
                                            .hide()
                                            .removeCls('error');
                                        Abraxa.utils.Functions.updatePortCost(selectionPort);
                                    },
                                    failure: function (batch, functions) {
                                        store.rejectChanges();
                                        Ext.ComponentQuery.query('container[reference=pbs_complexForm]')[0]
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
    }
);

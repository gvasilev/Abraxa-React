Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show.ChoiceFormCustomFormula', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.datafields.show.choiceformcustomformula',
    viewModel: {
        extend: 'Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show.ViewModel',
        formulas: {
            defaultOptionsDropdownOptions: {
                bind: {
                    optionSourceEdit: '{optionsSourceEdit.value}',
                    recordCopySourceDataChoices: '{recordCopy.sourceDataChoices}',
                },
                get: function (value) {
                    let options = [];

                    // Fixes not having sourceData choices data as array the API
                    if (Array.isArray(value.recordCopySourceDataChoices)) {
                        options = value.recordCopySourceDataChoices;
                    }

                    return options;
                },
            },
            defaultDropdownValue: {
                bind: {
                    bindTo: '{recordCopy.defaultValue}',
                    deep: true,
                },
                get: function (value) {
                    return value;
                },
                set: function (newValue) {
                    if (newValue !== null) {
                        this.set('recordCopy.defaultValue', newValue);
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-container-field',
            items: [
                {
                    xtype: 'grid',
                    infinite: false,
                    ui: 'bordered',
                    cls: 'a-grid-portcostengine-source',
                    minHeight: 300,
                    bind: {
                        store: {
                            data: '{defaultOptionsDropdownOptions}',
                        },
                    },
                    plugins: {
                        gridcellediting: {
                            triggerEvent: 'tap',
                            selectOnEdit: false,
                        },
                    },
                    columns: [
                        {
                            text: 'Label *',
                            flex: 1,
                            bind: {
                                editor: '{optionsSourceEdit.selection.value === "formula" ? "textfield" : false}',
                            },
                            editor: '',
                            sortable: false,
                            menuDisabled: true,
                            resizable: false,
                            hideable: false,
                            draggable: false,
                            dataIndex: 'text',
                        },
                        {
                            text: 'Value *',
                            flex: 1,
                            bind: {
                                editor: '{optionsSourceEdit.selection.value === "formula" ? "textfield" : false}',
                            },
                            sortable: false,
                            menuDisabled: true,
                            resizable: false,
                            hideable: false,
                            draggable: false,
                            dataIndex: 'value',
                        },
                        {
                            text: '',
                            minWidth: 50,
                            sortable: false,
                            menuDisabled: true,
                            resizable: false,
                            draggable: false,
                            bind: {
                                hidden: '{optionsSourceEdit.selection.value === "formula" ? false : true}',
                            },
                            cell: {
                                cls: '',
                                align: 'right',
                                toolDefaults: {
                                    zone: 'end',
                                },
                                tools: [
                                    {
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        ui: 'tool-md round',
                                        tooltip: {
                                            anchorToTarget: true,
                                            align: 'bc-tc?',
                                            html: 'Delete',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            closeAction: 'destroy',
                                        },
                                        handler: function handler(owner, tool) {
                                            let vm = owner.upVM();
                                            let record = tool.record;
                                            let recordIndex = owner.store.indexOf(record);

                                            // Fixes not having sourceData choices data as array the API
                                            let options = Array.isArray(vm.get('recordCopy').get('sourceDataChoices'))
                                                ? vm.get('recordCopy').get('sourceDataChoices')
                                                : [];
                                            let newOptions = options.slice();
                                            newOptions.splice(recordIndex, 1);

                                            vm.get('recordCopy').set('sourceDataChoices', newOptions);
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    items: [
                        {
                            xtype: 'container',
                            bind: {
                                hidden: '{optionsSourceEdit.selection.value === "formula" ? false : true}',
                            },
                            padding: 16,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'normal small',
                                    iconCls: 'md-icon-add',
                                    text: 'Add row',
                                    handler: function (me) {
                                        let vm = me.upVM();

                                        // Fixes not having sourceData choices data as array the API
                                        let options = Array.isArray(vm.get('recordCopy').get('sourceDataChoices'))
                                            ? vm.get('recordCopy').get('sourceDataChoices')
                                            : [];

                                        let newOptions = options.slice();
                                        newOptions.push({
                                            text: '',
                                            value: '',
                                        });

                                        me.upVM().get('recordCopy').set('sourceDataChoices', newOptions);
                                    },
                                },
                            ],
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
            xtype: 'container',
            cls: 'a-container-field',
            bind: {
                hidden: '{recordCopy.behaviour.canSetDefaultValue ? false : true}',
            },
            items: [
                {
                    xtype: 'selectfield',
                    clearable: true,
                    forceSelection: false,
                    label: 'Default option',
                    labelAlign: 'left',
                    placeholder: 'Default option',
                    ui: 'classic',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        store: {
                            data: '{defaultOptionsDropdownOptions}',
                        },
                        value: '{defaultDropdownValue}',
                    },
                },
            ],
        },
    ],
});

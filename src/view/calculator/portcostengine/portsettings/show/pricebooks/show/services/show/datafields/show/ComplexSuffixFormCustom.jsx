Ext.define(
    'Abraxa.view.calculator.portcostengine.pricebooks.show.services.show.datafields.show.ComplexSuffixFormCustom',
    {
        extend: 'Ext.Container',
        xtype: 'calculator.portcostengine.pricebooks.show.services.show.datafields.show.complexsuffixformcustom',
        viewModel: {
            extend: 'Abraxa.view.calculator.portcostengine.pricebooks.show.services.show.datafields.show.ViewModel',
            formulas: {
                suffix_defaultOptionsDropdownOptions: {
                    bind: {
                        optionSourceEdit: '{pbs_suffix_optionsSourceEdit.value}',
                        recordCopySourceDataChoices: '{recordCopy.suffix_sourceDataChoices}',
                    },
                    get: function (value) {
                        let options = [];

                        // Fixes not having sourceData choices data as array the API
                        if (Array.isArray(value.recordCopySourceDataChoices)) {
                            options = value.recordCopySourceDataChoices;
                        }

                        return Ext.create('Ext.data.Store', {
                            data: options,
                        });
                    },
                },
            },
        },
        items: [
            {
                xtype: 'grid',
                infinite: false,
                ui: 'bordered',
                minHeight: 300,
                cls: 'a-grid-portcostengine-source',
                bind: {
                    store: '{suffix_defaultOptionsDropdownOptions}',
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
                            editor: '{pbs_suffix_optionsSourceEdit.selection.value === "manual" ? "textfield" : false}',
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
                            editor: '{pbs_suffix_optionsSourceEdit.selection.value === "manual" ? "textfield" : false}',
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
                            hidden: '{pbs_suffix_optionsSourceEdit.selection.value === "manual" ? false : true}',
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
                                        let options = Array.isArray(
                                            vm.get('recordCopy').get('suffix_sourceDataChoices')
                                        )
                                            ? vm.get('recordCopy').get('suffix_sourceDataChoices')
                                            : [];
                                        let newOptions = options.slice();
                                        newOptions.splice(recordIndex, 1);

                                        vm.get('recordCopy').set('suffix_sourceDataChoices', newOptions);
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
                            hidden: '{pbs_suffix_optionsSourceEdit.selection.value === "manual" ? false : true}',
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

                                    // Fixes not having sourceData data as array the API
                                    let options = Array.isArray(vm.get('recordCopy').get('suffix_sourceDataChoices'))
                                        ? vm.get('recordCopy').get('suffix_sourceDataChoices')
                                        : [];

                                    let newOptions = options.slice();
                                    newOptions.push({
                                        text: '',
                                        value: '',
                                    });

                                    me.upVM().get('recordCopy').set('suffix_sourceDataChoices', newOptions);
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
                xtype: 'container',
                cls: 'a-container-field',
                items: [
                    {
                        xtype: 'selectfield',
                        forceSelection: false,
                        clearable: true,
                        label: 'Default option',
                        labelAlign: 'left',
                        placeholder: 'Default option',
                        ui: 'classic',
                        cls: 'a-field-icon icon-short icon-rounded',
                        bind: {
                            store: '{suffix_defaultOptionsDropdownOptions}',
                            value: '{recordCopy.suffix_defaultValue}',
                            hidden: '{recordCopy.suffix_behaviour.canSetDefaultValue ? false : true}',
                        },
                    },
                ],
            },
        ],
    }
);

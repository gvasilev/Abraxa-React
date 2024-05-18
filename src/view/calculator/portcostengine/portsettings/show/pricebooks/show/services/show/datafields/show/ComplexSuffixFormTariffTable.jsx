Ext.define(
    'Abraxa.view.calculator.portcostengine.pricebooks.show.services.show.datafields.show.ComplexSuffixFormTariffTable',
    {
        extend: 'Ext.Container',
        xtype: 'calculator.portcostengine.pricebooks.show.services.show.datafields.show.complexsuffixformtarifftable',
        viewModel: {
            extend: 'Abraxa.view.calculator.portcostengine.pricebooks.show.services.show.datafields.show.ViewModel',
            formulas: {
                suffix_defaultOptionsDropdownOptions: {
                    bind: {
                        tableEdit: '{recordCopy.suffix_sourceDataTableID}',
                        tableAxisEdit: '{recordCopy.suffix_sourceDataAxis}',
                    },
                    get: function (value) {
                        let options = [];

                        if (value.tableEdit && value.tableAxisEdit) {
                            let tableStore = this.getParent().getParent().getStore('tarifftable');
                            let tableID = value.tableEdit;
                            let table = tableStore.findRecord('id', tableID);
                            let tableValues = [];

                            if (value.tableAxisEdit === '_x' && Array.isArray(table.data.tableData.xAxis.columns)) {
                                let columns = table.data.tableData.xAxis.columns;

                                columns.forEach((column, index) => {
                                    if (column.match && column.match.value) {
                                        tableValues.push(column.match.value);
                                    }
                                });
                            }

                            if (value.tableAxisEdit === '_y' && Array.isArray(table.data.tableData.yAxis.values)) {
                                tableValues = table.data.tableData.yAxis.values;
                            }

                            tableValues.forEach((tableValue, index) => {
                                options.push({
                                    text: tableValue,
                                    value: tableValue,
                                });
                            });
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
                xtype: 'selectfield',
                reference: 'pbs_suffix_tableEdit',
                label: 'Table',
                labelAlign: 'left',
                placeholder: 'Table',
                required: true,
                ui: 'classic',
                cls: 'a-field-icon icon-short icon-rounded',
                queryMode: 'local',
                bind: {
                    store: '{tableDropdownOptions}',
                    value: '{recordCopy.suffix_sourceDataTableID}',
                },
            },
            {
                xtype: 'selectfield',
                label: 'Axis',
                labelAlign: 'left',
                placeholder: 'Axis',
                reference: 'pbs_suffix_tableAxisEdit',
                required: true,
                ui: 'classic',
                cls: 'a-field-icon icon-short icon-rounded',
                bind: {
                    store: '{suffix_tableAxisDropdownOptions}',
                    value: '{recordCopy.suffix_sourceDataAxis}',
                },
            },
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
                        text: 'Label',
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
                        text: 'Value',
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
                                    iconCls: 'md-icon-more-horiz',
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

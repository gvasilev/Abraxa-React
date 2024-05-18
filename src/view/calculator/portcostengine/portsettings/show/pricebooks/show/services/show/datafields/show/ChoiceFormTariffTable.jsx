Ext.define(
    'Abraxa.view.calculator.portcostengine.pricebooks.show.services.show.datafields.show.ChoiceFormTariffTable',
    {
        extend: 'Ext.Container',
        xtype: 'calculator.portcostengine.pricebooks.show.services.show.datafields.show.choiceformtarifftable',
        viewModel: {
            extend: 'Abraxa.view.calculator.portcostengine.pricebooks.show.services.show.datafields.show.ViewModel',
            formulas: {
                defaultOptionsDropdownOptions: {
                    bind: {
                        tableEdit: '{recordCopy.sourceDataTableID}',
                        tableAxisEdit: '{recordCopy.sourceDataAxis}',
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
                        xtype: 'selectfield',
                        reference: 'pbs_tableEdit',
                        label: 'Table',
                        labelAlign: 'left',
                        placeholder: 'Table',
                        required: true,
                        ui: 'classic',
                        cls: 'a-field-icon icon-short icon-rounded',
                        queryMode: 'local',
                        bind: {
                            store: '{tableDropdownOptions}',
                            value: '{recordCopy.sourceDataTableID}',
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
                        label: 'Axis',
                        labelAlign: 'left',
                        placeholder: 'Axis',
                        reference: 'pbs_tableAxisEdit',
                        required: true,
                        ui: 'classic',
                        cls: 'a-field-icon icon-short icon-rounded',
                        bind: {
                            store: '{tableAxisDropdownOptions}',
                            value: '{recordCopy.sourceDataAxis}',
                        },
                    },
                ],
            },
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
                                text: 'Label',
                                flex: 1,
                                bind: {
                                    editor: '{pbs_optionsSourceEdit.selection.value === "manual" ? "textfield" : false}',
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
                                    editor: '{pbs_optionsSourceEdit.selection.value === "manual" ? "textfield" : false}',
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
                                    hidden: '{pbs_optionsSourceEdit.selection.value === "manual" ? false : true}',
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
                                                    vm.get('recordCopy').get('sourceDataChoices')
                                                )
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
                                    hidden: '{pbs_optionsSourceEdit.selection.value === "manual" ? false : true}',
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
                        forceSelection: false,
                        clearable: true,
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
    }
);

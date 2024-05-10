Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show.ComplexPrefixFormTariffTable', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.datafields.show.complexprefixformtarifftable',
    viewModel: {
        extend: 'Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show.ViewModel',
        formulas: {
            prefix_defaultOptionsDropdownOptions: {
                bind: {
                    tableEdit: '{recordCopy.prefix_sourceDataTableID}',
                    tableAxisEdit: '{recordCopy.prefix_sourceDataAxis}',
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
            reference: 'prefix_tableEdit',
            label: 'Table',
            labelAlign: 'left',
            placeholder: 'Table',
            required: true,
            ui: 'classic',
            cls: 'a-field-icon icon-short icon-rounded',
            queryMode: 'local',
            bind: {
                store: '{tableDropdownOptions}',
                value: '{recordCopy.prefix_sourceDataTableID}',
            },
        },
        {
            xtype: 'selectfield',
            label: 'Axis',
            labelAlign: 'left',
            placeholder: 'Axis',
            reference: 'prefix_tableAxisEdit',
            required: true,
            ui: 'classic',
            cls: 'a-field-icon icon-short icon-rounded',
            bind: {
                store: '{prefix_tableAxisDropdownOptions}',
                value: '{recordCopy.prefix_sourceDataAxis}',
            },
        },
        {
            xtype: 'grid',
            infinite: false,
            ui: 'bordered',
            minHeight: 300,
            cls: 'a-grid-portcostengine-source',
            bind: {
                store: '{prefix_defaultOptionsDropdownOptions}',
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
                        editor: '{prefix_optionsSourceEdit.selection.value === "manual" ? "textfield" : false}',
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
                        editor: '{prefix_optionsSourceEdit.selection.value === "manual" ? "textfield" : false}',
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
                        hidden: '{prefix_optionsSourceEdit.selection.value === "manual" ? false : true}',
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
                                    clearable: true,
                                    closeAction: 'destroy',
                                },
                                handler: function handler(owner, tool) {
                                    let vm = owner.upVM();
                                    let record = tool.record;
                                    let recordIndex = owner.store.indexOf(record);

                                    // Fixes not having sourceData choices data as array the API
                                    let options = Array.isArray(vm.get('recordCopy').get('prefix_sourceDataChoices'))
                                        ? vm.get('recordCopy').get('prefix_sourceDataChoices')
                                        : [];
                                    let newOptions = options.slice();
                                    newOptions.splice(recordIndex, 1);

                                    vm.get('recordCopy').set('prefix_sourceDataChoices', newOptions);
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
                        hidden: '{prefix_optionsSourceEdit.selection.value === "manual" ? false : true}',
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
                                let options = Array.isArray(vm.get('recordCopy').get('prefix_sourceDataChoices'))
                                    ? vm.get('recordCopy').get('prefix_sourceDataChoices')
                                    : [];

                                let newOptions = options.slice();
                                newOptions.push({
                                    text: '',
                                    value: '',
                                });

                                me.upVM().get('recordCopy').set('prefix_sourceDataChoices', newOptions);
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
            xtype: 'selectfield',
            forceSelection: false,
            clearable: true,
            label: 'Default option',
            labelAlign: 'left',
            placeholder: 'Default option',
            ui: 'classic',
            cls: 'a-field-icon icon-short icon-rounded',
            bind: {
                store: '{prefix_defaultOptionsDropdownOptions}',
                value: '{recordCopy.prefix_defaultValue}',
                hidden: '{recordCopy.prefix_behaviour.canSetDefaultValue ? false : true}',
            },
        },
    ],
});

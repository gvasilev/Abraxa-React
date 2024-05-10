Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show.ComplexSuffixFormNomenclature', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.datafields.show.complexsuffixformnomenclature',
    viewModel: {
        extend: 'Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show.ViewModel',
        formulas: {
            suffix_defaultOptionsDropdownOptions: {
                bind: {
                    optionSourceEdit: '{suffix_optionsSourceEdit.value}',
                    nomenclatureValueEdit: '{recordCopy.suffix_sourceDataValueType}',
                },
                get: function (value) {
                    let options = [];
                    let source = value.optionSourceEdit;

                    switch (source) {
                        case 'nomenclature_regions':
                            traverseNomenclature(this, 'region', value.nomenclatureValueEdit);

                            break;
                        case 'nomenclature_vessels':
                            traverseNomenclature(this, 'vessel', value.nomenclatureValueEdit);

                            break;
                        case 'nomenclature_cargoes':
                            traverseNomenclature(this, 'cargo', value.nomenclatureValueEdit);

                            break;
                    }

                    function traverseNomenclature(vm, nomenclatureType, nomenclatureValueType) {
                        if (nomenclatureValueType) {
                            let nomenclatureStore = vm.getParent().getParent().getStore('calcnomenclature');
                            let nomenclature = nomenclatureStore.findRecord('type', nomenclatureType);

                            if (nomenclatureValueType === 'parents' && nomenclature) {
                                let categories = nomenclature.data.items.filter(function (item) {
                                    return item.leaf === false;
                                });

                                categories.forEach((category, index) => {
                                    options.push({
                                        text: category.text,
                                        value: category.id,
                                    });
                                });
                            } else if (nomenclatureValueType === 'leafs' && nomenclature) {
                                let children = nomenclature.data.items.filter(function (item) {
                                    return item.leaf === true;
                                });

                                children.forEach((item, index) => {
                                    options.push({
                                        text: item.text,
                                        value: item.id,
                                    });
                                });
                            }
                        }
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
            reference: 'suffix_nomenclatureValueEdit',
            label: 'Usage',
            labelAlign: 'left',
            placeholder: 'Usage',
            required: true,
            ui: 'classic',
            cls: 'a-field-icon icon-short icon-rounded',
            queryMode: 'local',
            bind: {
                store: '{nomenclatureValueTypes}',
                value: '{recordCopy.suffix_sourceDataValueType}',
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
                        editor: '{suffix_optionsSourceEdit.selection.value === "manual" ? "textfield" : false}',
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
                        editor: '{suffix_optionsSourceEdit.selection.value === "manual" ? "textfield" : false}',
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
                        hidden: '{suffix_optionsSourceEdit.selection.value === "manual" ? false : true}',
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
                                    let options = Array.isArray(vm.get('recordCopy').get('suffix_sourceDataChoices'))
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
                        hidden: '{suffix_optionsSourceEdit.selection.value === "manual" ? false : true}',
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
});

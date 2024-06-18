Ext.define('Abraxa.view.common.combo.CostCentersComboPrincipal', {
    extend: 'Ext.field.ComboBox',
    xtype: 'CostCentersComboPrincipal',
    displayField: 'name',
    valueField: 'id',
    secondDisplayField: 'accounting_code',
    hideTrigger: true,
    ui: 'classic',
    clearable: true,
    anyMatch: true,
    padding: 3,
    queryMode: 'local',
    forceSelection: true,
    sourceButtonName: 'Add',
    isSyncing: false,
    expandCollapse: true,
    isSelected: false,
    isAdded: false,
    cleared: false,
    type: '',
    store: [],
    placeholder: AbraxaConstants.placeholders.emptyValue,
    pickerWidth: '180px',
    defaultFocus: null,
    focusOnToFront: false,
    collapse: function () {
        const combo = this;
        if (!this.expandCollapse) return false;

        this._setOrigValue(combo);
// this.callParent();
    },

    //This is a terrible solution if someone find other solution please change it
    //To not to loose fields value
    _setOrigValue: function (combo) {
        setTimeout(() => {
            combo.setInputValue(combo.getViewModel().get('origValue'));
            combo.setValue(combo.getViewModel().get('origValue'));
        }, 0);
    },

    _setStore: function (combo) {
        let filteredStore = [];
        const defaultExpenseItems = combo.ownerCmp.getRecord().get('default_expense_item');

        vm = combo.getViewModel();
        if (
            combo.type === 'customer_cost_center' &&
            defaultExpenseItems &&
            defaultExpenseItems.cost_centers &&
            defaultExpenseItems.cost_centers.length > 0
        ) {
            filteredStore = defaultExpenseItems.cost_centers.filter((el) => el.name);
        } else if (
            combo.type === 'accounting_code' &&
            defaultExpenseItems &&
            defaultExpenseItems.cost_centers &&
            defaultExpenseItems.cost_centers.length > 0
        ) {
            filteredStore = defaultExpenseItems.cost_centers.filter((el) => el.accounting_code);
        }
        combo.getViewModel().set('store', filteredStore);
    },

    _clearFocus: function (isAdd) {
        const combo = this;
        setTimeout(() => {
            this.up('grid')
                .query('CostCentersComboPrincipal')
                .forEach((combo) => {
                    combo.removeCls('x-focused');
                });
            if (isAdd) combo.addCls('x-focused');
        }, 0);
    },

    onFocusLeave: function (e) {
        const gridUpVm = this.up('grid').upVM();
        const latsEnteredCombo = gridUpVm.get('latsEnteredCombo');
        const combo = this;
        if (!combo.isSelected && gridUpVm.get('mouseDownCombo') && !latsEnteredCombo.hasFocus) {
            latsEnteredCombo.focus();
            gridUpVm.set('mouseDownCombo', false);
        }
    },
    triggers: {
        clear: {
            handler: function (combo) {
                combo.setDisabled(true);
                combo.cleared = true;
                combo.setValue(null);
                combo.setInputValue(null);
                const vm = combo.getViewModel();
                vm.set('origValue', null);

                const record = combo.up().ownerCmp.getRecord();
                record.set(combo.type, null);
                combo.getViewModel().set('origValue', null);
                if (record) {
                    record.set('isSelected', false);
                    record.dirty = true;
                    record.modified = record.modified || {};
                    record.modified[combo.type] = null;
                    record.modified['account_number'] = record.get('account_number');
                    record.modified['cost_center_id'] = record.get('cost_center_id');
                    record.modified['customer_cost_center'] = record.get('customer_cost_center');
                    record.modified['customer_cost_center_id'] = record.get('customer_cost_center_id');
                    if (combo.type !== 'customer_cost_center') {
                        record.set('cost_center_accounting_code', null);
                        record.modified['cost_center_accounting_code'] = null;
                        record.set('account_number', null);
                        record.modified['account_number'] = null;
                    }

                    record.set(combo.type, null);
                }
                combo
                    .up('grid')
                    .getStore()
                    .sync({
                        callback: function () {
                            Ext.toast('Record updated', 1000);
                            combo.setDisabled(false);
                            combo.cleared = false;
                            record.set('cleared', true);
                            vm.set('origValue', null);
                            combo.expandCollapse = true;
                            combo.collapse();
                        },
                    });
            },
        },
    },

    viewModel: {
        buttonIsActive: false,
        buttonName: 'Add custom cost center',
        value: null,
        addButtonDisable: true,
        isChanged: false,
        cleared: false,
        store: [],
        formulas: {
            changeValue: {
                bind: {
                    bindTo: '{record}',
                    deep: true,
                },
                get: function (record) {
                    const combo = this.getView();

                    const ownerRecord = combo.ownerCmp.getRecord();

                    if (record.get('cleared')) return;

                    const isSelected = record.get('isSelected');
                    if (isSelected) {
                        if (combo.type === 'customer_cost_center') {
                            combo.setInputValue(record.get('customer_cost_center'));
                        } else {
                            const rec = combo
                                .getStore()
                                .findRecord('name', record.get('customer_cost_center'), 0, false, true, true);
                            const accountingCode = rec ? rec.get('accounting_code') : null;

                            combo.setInputValue(accountingCode);
                            this.set('origValue', accountingCode);
                        }
                        combo.setDisabled(false);
                    } else if (combo.isAdded) {
                        if (combo.type === 'customer_cost_center') {
                            combo.setInputValue(record.get('customer_cost_center'));
                            this.set('origValue', record.get('customer_cost_center'));
                        } else {
                            combo.setInputValue(combo.ownerCmp.getRecord().data.account_number);
                        }
                    } else if (combo.cleared) {
                        combo.setValue(null);
                        combo.setInputValue(null);
                        this.set('origValue', null);
                    }
                },
            },
            initValue: {
                bind: {
                    record: '{record}',
                    store: '{store}',
                },
                get: function (data) {
                    const record = data.record;
                    const combo = this.getView();
                    combo.setStore(data.store);
                    if (combo.type === 'customer_cost_center') {
                        if (record && record.get('customer_cost_center')) {
                            combo.setInputValue(record.get('customer_cost_center'));
                            this.set('origValue', record.get('customer_cost_center'));
                        }
                    } else {
                        if (record && record.get('account_number')) {
                            combo.setInputValue(combo.ownerCmp.getRecord().data.account_number);
                            this.set('origValue', combo.ownerCmp.getRecord().data.account_number);
                        }
                    }
                },
            },
        },
    },
    listeners: {
        painted: function (combo) {
            this._setStore(combo);
        },
        focus: function (combo) {
            combo._clearFocus(true);

            const vm = combo.getViewModel();
            if (combo.getInputValue() && combo.getInputValue() !== '') {
                vm.set('origValue', combo.getInputValue());
            }
        },
        mousedown: function () {
            const gridUpVm = this.up('grid').upVM();
            gridUpVm.set('latsEnteredCombo', this);
            gridUpVm.set('mouseDownCombo', true);
            const combo = this;
            this._setStore(combo);
            const vm = combo.getViewModel();
            if (combo.getInputValue() && combo.getInputValue() !== '') {
                vm.set('origValue', combo.getInputValue());
            }

            combo.expandCollapse = false;
            if (combo.type === 'customer_cost_center') {
                combo.sourceButtonName = 'Add custom cost center';
                combo.viewModel.set('buttonName', 'Add custom cost center');
            } else {
                combo.viewModel.set('buttonName', 'Add custom customer code');
                combo.sourceButtonName = 'Add custom customer code';
            }
            combo.setItemTpl(
                Ext.create(
                    'Ext.XTemplate',
                    '<div style="display: flex; width:' +
                        combo.pickerWidth +
                        '"><div class="_value">{[this.formatValue(values.' +
                        combo.getDisplayField() +
                        ')]}</div> <div style="margin-left: auto;  margin-right: 20px">{[this.qtip(values.description)]}></div></div>',
                    '<div>{[this.formatValue(values.' + combo.secondDisplayField + ')]}</div>',
                    {
                        formatValue: function (value) {
                            return value ? value : AbraxaConstants.placeholders.emptyValue;
                        },
                        qtip: function (value) {
                            if (value) {
                                let description =
                                    '<i  class="align-icon material-icons md-icon-info info-icon-hovered align-icon" data-qtip="' +
                                    value +
                                    '" data-qalign="bc-tc" data-qanchor="true"></i>';

                                return description;
                            } else {
                                return '';
                            }
                        },
                    }
                )
            );

            vm.set('addButtonDisable', true);

            combo.expand();
        },

        keyup: function (combo) {
            const inputValue = combo.getInputValue();
            const vm = combo.upVM();
            combo.isSelected = false;
            if (inputValue && inputValue.length) {
                combo.expandCollapse = false;
                vm.set(
                    'buttonName',
                    '<div style="display: flex; justify-content: space-around"><div style="margin: 3px">Add</div>' +
                        ' <div style="background-color:#EBF8FE; border-radius: 6px; padding: 3px; color: black;">' +
                        inputValue +
                        '</div></div>'
                );
                vm.set('value', inputValue);
                const displayField = combo.getDisplayField();
                const comboStore = combo.getStore();
                const isExist = comboStore.findRecord(displayField, inputValue, 0, false, true, true);
                if (!isExist) {
                    vm.set('addButtonDisable', false);
                }
                combo.expand();
            } else {
                vm.set('buttonName', combo.sourceButtonName);
                vm.set('addButtonDisable', true);
            }
        },

        blur: function (combo) {
            const vm = combo.getViewModel();
            if (vm.get('buttonIsActive')) {
                return false;
            } else {
                this._setOrigValue(combo);
                combo.expandCollapse = true;
                combo.collapse();
            }
        },
    },

    floatedPicker: {
        listeners: {
            painted: function (me, record) {
                const picker = me;
                const combobox = picker.up('combobox');
                const vm = combobox.getViewModel();
                me.setMinWidth(combobox.pickerWidth);
                me.setMaxWidth(combobox.pickerWidth);
                picker.dataItems.forEach((item) => {
                    item.element.on('click', (element) => {
                        const htmlElement = element.delegatedTarget.querySelector('._value');
                        const value = htmlElement ? htmlElement.innerText : '';
                        const gridStore = this.up('grid').getStore();
                        const comboStore = combobox.getStore();

                        combobox.ownerCmp
                            .up()
                            .query('combobox')
                            .forEach((combo) => {
                                combo.setDisabled(true);
                            });

                        const type = combobox.type;
                        const dataIndex = combobox.ownerCmp.dataIndex;
                        const record = comboStore.findRecord(combobox.getDisplayField(), value, 0, false, true, true);
                        const ownerRecord = combobox.up().ownerCmp.getRecord();
                        ownerRecord.set(dataIndex, record.get(combobox.getDisplayField()));
                        ownerRecord.set(type, record.get(combobox.getDisplayField()));
                        ownerRecord.set('isSelected', false);

                        if (ownerRecord) {
                            ownerRecord.modified = ownerRecord.modified || {};
                            delete ownerRecord.data.cleared;
                            const accountingCode = record.get('accounting_code');
                            const id = record.get('id');
                            const name = record.get('name');

                            ownerRecord.set('cost_center_id', id);
                            ownerRecord.modified['cost_center_id'] = id;
                            ownerRecord.set('accounting_code', accountingCode);
                            ownerRecord.modified['accounting_code'] = accountingCode;
                            ownerRecord.set('customer_cost_center', name);
                            ownerRecord.modified['customer_cost_center'] = name;

                            ownerRecord.set('account_number', accountingCode);
                            ownerRecord.modified['account_number'] = ownerRecord;
                            ownerRecord.set('isSelected', true);
                        }

                        if (!combobox.isSyncing) {
                            combobox.isSyncing = true;
                            gridStore.sync({
                                callback: function () {
                                    Ext.toast('Record updated', 1000);
                                    combobox.isSyncing = false;
                                    combobox.setInputValue(record.get(combobox.getDisplayField()));
                                },
                            });
                        }

                        combobox.expandCollapse = true;
                        combobox.collapse();
                        combobox.isSelected = true;
                        combobox.blur();

                        const gridUpVm = this.up('grid').upVM();
                        const latsEnteredCombo = gridUpVm.get('latsEnteredCombo');
                        gridUpVm.set('mouseDownCombo', false);
                        combobox._clearFocus();
                    });
                });
            },
        },

        emptyText: {
            scrollDock: 'end',
            xtype: 'component',
            cls: 'a-bgr-transparent',
            html: '<div class="a-inner"><div class="a-no-content-txt"><div class="fs-13">No results found</div></div></div>',
        },
        minWidth: 280,
        weighted: true,
        items: [
            {
                xtype: 'container',
                docked: 'bottom',
                layout: 'hbox',
                cls: 'a-bt-100',
                style: 'background-color:#fff',
                items: [
                    {
                        xtype: 'button',
                        flex: 1,
                        text: 'Add custom cost center',
                        disabled: true,
                        bind: {
                            html: '{buttonName}',
                            disabled: '{addButtonDisable}',
                        },
                        listeners: {
                            painted: function (button, event) {
                                const vm = button.up('combobox').getViewModel();
                                button.el.dom.addEventListener('mouseover', () => {
                                    vm.set('buttonIsActive', true);
                                });
                                button.el.dom.addEventListener('mouseleave', () => {
                                    vm.set('buttonIsActive', false);
                                });
                            },
                        },
                        ui: 'normal',
                        handler: function (me) {
                            const combo = me.up('combobox');
                            combo.setDisabled(true);
                            combo.isAdded = true;
                            const vm = combo.getViewModel();
                            const dataIndex = combo.ownerCmp.dataIndex;
                            const record = combo.up().ownerCmp.getRecord();

                            combo.isSyncing = true;
                            if (record) {
                                record.set('isSelected', false);
                                record.modified = record.modified || {};
                                if (dataIndex) {
                                    record.set(dataIndex, vm.get('value'));
                                    record.modified[dataIndex] = vm.get('value');
                                } else {
                                    record.set(combo.type, vm.get('value'));
                                    record.modified[combo.type] = vm.get('value');
                                }
                                if (combo.type === 'customer_cost_center') {
                                    delete record.data.account_number;
                                    Ext.Array.remove(record.modified, 'account_number');
                                }
                            }
                            combo.getViewModel().set('origValue', vm.get('value'));
                            this.up('grid')
                                .getStore()
                                .sync({
                                    callback: function () {
                                        Ext.toast('Record updated', 1000);
                                        combo.setInputValue(vm.get('value'));
                                        vm.set('origValue', vm.get('value'));
                                        combo.isSyncing = false;
                                        combo.isAdded = false;
                                        combo.setDisabled(false);
                                        vm.set('value', null);
                                    },
                                });
                            combo.expandCollapse = true;
                            combo.collapse();
                        },
                    },
                ],
            },
        ],
    },
});

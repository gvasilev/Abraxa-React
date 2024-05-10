Ext.define('Abraxa.view.common.combo.CostCentersCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'CostCentersCombo',
    displayField: 'name',
    valueField: 'id',
    secondDisplayField: 'accounting_code',
    hideTrigger: true,
    ui: 'classic',
    clearable: true,
    anyMatch: true,
    bodyPadding: 0,
    queryMode: 'local',
    forceSelection: false,
    sourceButtonName: 'Add',
    isSyncing: false,
    pickerWidth: '230px',
    cachedStore: [],
    maxHeight: 400,
    triggers: {
        clear: {
            handler: function (combo) {
                const viewModel = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0].upVM();
                const pickerAddButton = combo.getPicker().down('button');
                combo.setValue(null);
                combo.setInputValue(null);
                combo.collapse();
                viewModel.set('buttonName', combo.sourceButtonName);
                const record = combo.up().ownerCmp.getRecord();
                const dataIndex = combo.up().ownerCmp.dataIndex;
                record.set(dataIndex, null);
                const constCenterIdStr = 'cost_center_id';
                const customerCostCenterIdStr = 'customer_cost_center_id';
                pickerAddButton.setHtml(viewModel.get('buttonName'));
                pickerAddButton.setDisabled(viewModel.get('addButtonDisable'));
                record.modified = record.modified || {};
                if (combo.getDisplayField() !== 'name') {
                    const customerCostCenter = record.get('customer_cost_center');
                    record.set('customer_cost_center', customerCostCenter);
                    record.modified['customer_cost_center'] = customerCostCenter;
                }
                const costCenterId = record.get('default_expense_item').cost_center_id;
                record.set(constCenterIdStr, costCenterId);
                record.set(customerCostCenterIdStr, null);
                record.modified[constCenterIdStr] = costCenterId;
                record.modified[customerCostCenterIdStr] = null;
                combo
                    .up('grid')
                    .getStore()
                    .sync({
                        callback: function () {
                            Ext.toast('Record updated', 1000);
                        },
                    });
                viewModel.set('addButtonDisable', true);
                combo.cleared = true;
                combo.blur();
            },
        },
    },
    store: [],
    viewModel: {
        formulas: {
            setDisable: {
                bind: {
                    bindTo: '{record}',
                    deep: true,
                },
                get: function (record) {
                    if (record && !record.get('default_expense_item')) {
                        this.getView().setDisabled(true);
                    } else {
                        this.getView().setDisabled(false);
                    }
                },
            },
        },
    },
    expandCollapse: true,
    isSelected: false,
    cleared: false,

    listeners: {
        focus: function (combo) {
            //this is 'accounts-viewmodel':
            const vm = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0].upVM();
            combo.setStore([]);
            combo.getPicker().setStore([]);
            vm.set({
                buttonIsActive: false,
                buttonName: 'Add custom cost center',
                value: combo.getInputValue(),
                addButtonDisable: true,
                isChanged: false,
                cleared: false,
            });
            let sharedCostCenters = [];
            const picker = combo.getPicker();
            combo.expandCollapse = false;
            combo.expand();
            picker.setMasked({
                xtype: 'loadmask',
                style: {
                    zIndex: 9999,
                },
            });
            const selectedDisbursementId = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0]
                .upVM()
                .get('selectedDisbursement')
                .get('id');
            if (!selectedDisbursementId) {
                combo.getStore().setData([]);
                picker.setMasked(false);
                return;
            }

            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'disbursement/' + selectedDisbursementId + '/shared-cost-centers',
                method: 'GET',
                disableCaching: false,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                    'Content-Type': null,
                },

                success: function (response) {
                    const obj = Ext.decode(response.responseText);
                    const serviceId = combo.up().ownerCmp.getRecord().get('id');
                    const sharedCostCentersArray = obj.filter((el) => el.id === serviceId);
                    if (sharedCostCentersArray.length && sharedCostCentersArray[0].shared_cost_centers) {
                        sharedCostCenters = sharedCostCentersArray[0].shared_cost_centers;
                    }

                    const record = combo.up().ownerCmp.getRecord();
                    const vm = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0].upVM();

                    const dataIndex = combo.up().ownerCmp.dataIndex;
                    let filteredStore = [];
                    if (combo.type === 'customer_cost_center' && sharedCostCenters && sharedCostCenters.length) {
                        filteredStore = sharedCostCenters.filter((el) => el.name);
                    } else if (sharedCostCenters && sharedCostCenters.length) {
                        filteredStore = sharedCostCenters.filter((el) => el.accounting_code);
                    }
                    combo.getPicker().setStore(filteredStore);
                    combo.cachedStore = filteredStore;

                    if (vm && vm.data) {
                        vm.set('value', record.get(dataIndex));
                        vm.set('addButtonDisable', true);
                    }

                    picker.setMasked(false);
                    if (picker.getStore().count() === 0) {
                        picker.setStore(combo.cachedStore);
                    }
                    picker.dataItems.forEach((item) => {
                        item.element.on('click', (element) => {
                            const grid = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0];
                            const vm = grid.upVM();
                            const htmlElement = element.delegatedTarget.querySelector('._value');
                            const value = htmlElement ? htmlElement.innerText : '';
                            const gridStore = grid.getStore();
                            const pickerStore = combo.getPicker().getStore();
                            const dataIndex = combo.up().ownerCmp.dataIndex;
                            const record = pickerStore.findRecord(combo.getDisplayField(), value, 0, false, true, true);

                            const ownerRecord = combo.up().ownerCmp.getRecord();
                            combo.isSelected = true;
                            const displayField = combo.getDisplayField();
                            const selectedValue = record.get(displayField);
                            const currentOwnerValue = ownerRecord.get(displayField);
                            const defaultExpenseItem = ownerRecord.get('default_expense_item');

                            ownerRecord.set(displayField, selectedValue);
                            ownerRecord.modified = ownerRecord.modified || {};
                            ownerRecord.modified[dataIndex] = selectedValue;

                            if (displayField === 'accounting_code') {
                                ownerRecord.set('customer_cost_center_id', record.get('id'));
                                ownerRecord.modified['customer_cost_center_id'] = record.get('id');

                                ownerRecord.set('customer_cost_center', record.get('name'));
                                ownerRecord.modified['customer_cost_center'] = record.get('name');

                                const costCenterId = defaultExpenseItem ? defaultExpenseItem.cost_center_id : null;
                                ownerRecord.set('cost_center_id', costCenterId);
                                ownerRecord.modified['cost_center_id'] = costCenterId;

                                ownerRecord.set('account_number', selectedValue);
                                ownerRecord.modified['account_number'] = selectedValue;
                            } else if (displayField === 'name') {
                                ownerRecord.set('customer_cost_center_id', record.get('id'));
                                ownerRecord.modified['customer_cost_center_id'] = record.get('id');

                                const costCenterId = defaultExpenseItem ? defaultExpenseItem.cost_center_id : null;
                                ownerRecord.set('cost_center_id', costCenterId);
                                ownerRecord.modified['cost_center_id'] = costCenterId;

                                const accountingCode = record.get('accounting_code');
                                ownerRecord.set('account_number', accountingCode);
                                ownerRecord.set('customer_cost_center', combo.getValue());
                                ownerRecord.dirty = true;
                                ownerRecord.modified['account_number'] = accountingCode;
                                ownerRecord.modified['customer_cost_center'] = combo.getValue();
                            }

                            if (!combo.isSyncing) {
                                combo.isSyncing = true;
                                gridStore.sync({
                                    callback: function () {
                                        Ext.toast('Record updated', 1000);
                                        combo.isSyncing = false;
                                        vm.set('buttonName', combo.sourceButtonName);
                                        vm.set('addButtonDisable', true);
                                        const pickerAddButton = combo.getPicker().down('button');
                                        pickerAddButton.setHtml(vm.get('buttonName'));
                                        pickerAddButton.setDisabled(vm.get('addButtonDisable'));
                                    },
                                });

                                combo.expandCollapse = true;
                                combo.blur();
                                combo.collapse();
                            }
                        });
                    });
                },
                failure: function failure(response) {
                    combo.setStore([]);
                    picker.setMasked(false);
                    Ext.Msg.warning('Warning', 'Something went wrong. </br> Cannot show shared cost centers.');
                },
            });
        },

        keyup: function (combo) {
            const inputValue = combo.getInputValue();
            const vm = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0].upVM();
            const pickerAddButton = combo.getPicker().down('button');
            combo.isSelected = false;
            combo.expandCollapse = false;
            combo.setStore(combo.cachedStore);
            if (inputValue && inputValue.length) {
                vm.set(
                    'buttonName',
                    '<div class="add-cost-center-button"><div style="margin: 3px">Add</div>' +
                        ' <div class="value">' +
                        inputValue +
                        '</div></div>'
                );
                const displayField = combo.getDisplayField();
                const comboStore = combo.getStore();
                const isExist = comboStore.findRecord(displayField, inputValue, 0, false, true, true);
                if (!isExist) {
                    vm.set('addButtonDisable', false);
                }
            } else {
                const comboStoreData = combo.getStore().getData();
                combo.setStore(comboStoreData.items);
                vm.set('buttonName', combo.sourceButtonName);
                vm.set('addButtonDisable', true);
            }
            pickerAddButton.setHtml(vm.get('buttonName'));
            pickerAddButton.setDisabled(vm.get('addButtonDisable'));
            combo.expand();
        },

        blur: function (combo) {
            const vm = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0].upVM();
            const pickerAddButton = combo.getPicker().down('button');
            if (vm && vm.data && vm.get('value') !== combo.getInputValue() && !vm.get('buttonIsActive')) {
                combo.setInputValue(vm.get('value'));
                combo.expandCollapse = true;
                pickerAddButton.setHtml(combo.sourceButtonName);
                pickerAddButton.setDisabled(true);
                combo.collapse();
                vm.set('buttonIsActive', false);
            } else if (vm && vm.data && !vm.get('buttonIsActive')) {
                pickerAddButton.setHtml(combo.sourceButtonName);
                pickerAddButton.setDisabled(true);
                combo.expandCollapse = true;
                combo.collapse();
            } else if (vm && !vm.data) {
                pickerAddButton.setHtml(combo.sourceButtonName);
                pickerAddButton.setDisabled(true);
                combo.expandCollapse = true;
                combo.collapse();
            }
        },
    },
    collapse: function () {
        if (!this.expandCollapse) return false;
        this.callParent();
    },

    floatedPicker: {
        listeners: {
            painted: function (me, record) {
                const picker = me;
                const combo = picker.ownerCmp;
                me.setMinWidth(combo.pickerWidth);
                me.setMaxWidth(combo.pickerWidth);
            },
        },
        emptyText: {
            scrollDock: 'end',
            xtype: 'component',
            cls: 'a-bgr-transparent',
            html: '<div class="a-inner"><div class="a-no-content-txt"><div class="fs-13">No results found</div></div></div>',
        },
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
                            html: '<div>{buttonName}</div>',
                            disabled: '{addButtonDisable}',
                        },
                        ui: 'normal',
                        listeners: {
                            painted: function (button, event) {
                                const vm = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0].upVM();
                                button.el.dom.addEventListener('mouseover', () => {
                                    vm.set('buttonIsActive', true);
                                });
                                button.el.dom.addEventListener('mouseleave', () => {
                                    vm.set('buttonIsActive', false);
                                });
                            },
                        },
                        handler: function (me) {
                            const combo = me.up('combobox');
                            const grid = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0];
                            const pickerAddButton = combo.getPicker().down('button');
                            const dataIndex = combo.up().ownerCmp.dataIndex;
                            const record = combo.up().ownerCmp.getRecord();
                            const costCenterId = record.get('default_expense_item').cost_center_id;
                            const vm = Ext.ComponentQuery.query('disbursement\\.items\\.grid')[0].upVM();
                            record.set(dataIndex, combo.getInputValue());
                            record.set('cost_center_id', costCenterId);
                            record.modified = record.modified || {};
                            record.modified['cost_center_id'] = costCenterId;

                            record.set('customer_cost_center_id', null);
                            record.modified['customer_cost_center_id'] = null;

                            combo.up('gridcell').setValue(combo.getInputValue());
                            vm.set('buttonName', combo.sourceButtonName);
                            pickerAddButton.setHtml(combo.sourceButtonName);
                            pickerAddButton.setDisabled(true);
                            grid.getStore().sync({
                                callback: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                            combo.expandCollapse = true;
                            combo.collapse();
                            combo.blur();
                        },
                    },
                ],
            },
        ],
    },
});

Ext.define('Abraxa.controller.CalculationController', {
    extend: 'Ext.app.Controller',
    singleton: true,
    id: 'pdacalculationcontroller',
    alias: 'controller.calculation.controller',
    init: function () {
        /* Set up the controller for the Main View */
        /* Then set up a listener for user updates. */
        // this.subscribe('updateOfferDataFields', this.parseOfferDataFields, this);
    },

    listen: {
        controller: {
            '*': {
                buildOfferDataFields: 'transformOfferDataFields',
                buildItemFields: 'transformItemFields',
            },
        },
    },

    transformOfferDataFields: function (input, vm) {
        let fields = input.fields,
            calculation_id = input.calculation_id,
            data = [],
            calculationServices = vm.get('calculationServices'),
            fieldsStore = vm.get('calculation.dataFields'),
            calculation = vm.get('calculation');
        fields.each(function (field) {
            field.getProxy().setExtraParams({
                calculation_id: calculation_id,
            });
            switch (field.get('xtype')) {
                case 'componentdataview':
                    data.push({
                        xtype: 'abraxa.componentdataview',
                        data: field.get('children'),
                        cls: 'offer_data_complex',
                        html: '<div class="a-title-md">' + field.get('label') + '</div>',
                        masked: false,
                        itemConfig: {
                            xtype: field.get('children')[0].xtype,
                            layout: field.get('children')[0].layout,
                            multiply: field.get('multiply'),
                            serviceField: field,
                            cls: 'a-data-field-complex',
                            viewModel: {
                                formulas: {
                                    paresedItems: {
                                        bind: {
                                            bindTo: '{record}',
                                            deep: true,
                                        },
                                        get: function (record) {
                                            if (record) {
                                                let multiply = this.getView().multiply,
                                                    store = record.store,
                                                    index = store.indexOf(record),
                                                    component = this.getView();

                                                record.get('items').unshift({
                                                    xtype: 'label',
                                                    cls: 'c-blue-grey fs-13 mr-16',
                                                    minWidth: 140,
                                                    maxWidth: 140,
                                                    html: field.get('label') + (multiply ? ' ' + (index + 1) : ''),
                                                });
                                                if (multiply) {
                                                    if (index == 0) {
                                                        record.get('items').push({
                                                            xtype: 'button',
                                                            ui: 'small round tool-round normal',
                                                            iconCls: 'md-icon-outlined md-icon-add-circle-outline',
                                                            cls: 'ml-8',
                                                            flex: null,
                                                            focusable: false,
                                                            tabIndex: '-1',
                                                            handler: function (button) {
                                                                let data = JSON.parse(field.get('childrenRaw')),
                                                                    dataCopy = Object.assign({}, data[0]),
                                                                    fieldCopy = Object.assign(
                                                                        {},
                                                                        JSON.parse(JSON.stringify(dataCopy))
                                                                    );

                                                                fieldCopy.items.forEach(function (item) {
                                                                    item.fieldID = Ext.id();
                                                                    item.value = null;
                                                                });
                                                                data.push(fieldCopy);
                                                                field.set('children', data);
                                                                field.save({
                                                                    success: function () {
                                                                        calculation.load();
                                                                        calculationServices.reload();
                                                                        // fieldsStore.load({
                                                                        //     callback: function () {
                                                                        //         // button
                                                                        //         //     .upVM()
                                                                        //         //     .get('calculationServices')
                                                                        //         //     .load();
                                                                        //         calculation.load();
                                                                        //     },
                                                                        // });
                                                                    },
                                                                });
                                                            },
                                                        });
                                                    } else {
                                                        record.get('items').push({
                                                            xtype: 'button',
                                                            ui: 'small round tool-round default',
                                                            iconCls: 'md-icon-outlined md-icon-remove-circle-outline',
                                                            cls: 'ml-8',
                                                            flex: null,
                                                            focusable: false,
                                                            tabIndex: 0,
                                                            handler: function (button) {
                                                                let record = this.upVM().get('record'),
                                                                    store = record.store,
                                                                    index = store.indexOf(record),
                                                                    data = JSON.parse(field.get('childrenRaw'));

                                                                data.splice(index, 1);
                                                                // store.remove(record);

                                                                field.set('children', data);
                                                                field.save({
                                                                    success: function () {
                                                                        calculation.load();
                                                                        calculationServices.reload();
                                                                    },
                                                                });
                                                            },
                                                        });
                                                    }
                                                }

                                                return record.get('items');
                                            }
                                        },
                                    },
                                },
                            },
                            bind: {
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                items: '{paresedItems}',
                            },
                            defaults: {
                                ui: 'classic',
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                flex: 1,
                                bind: {
                                    disabled: '{pda.status !== "draft" || nonEditable}',
                                },
                                forceSelection: true,
                                floatedPicker: {
                                    listeners: {
                                        // select: function (picker) {
                                        //     let subField = picker.ownerCmp;
                                        //     if (subField.xtype === 'button') return;
                                        //     if (subField.dirty) {
                                        //         let fieldID = subField.fieldID,
                                        //             data = JSON.parse(field.get('childrenRaw')),
                                        //             calculationServices = this.upVM().get('calculationServices'),
                                        //             offerDataFields = subField.upVM().get('offerDataFieldsStore');
                                        //         Ext.Object.each(data, function (key, value) {
                                        //             value.items.forEach(function (item) {
                                        //                 if (item.fieldID === fieldID) {
                                        //                     item.value = subField.getValue();
                                        //                 }
                                        //             });
                                        //         });
                                        //         field.set('children', data);
                                        //         if (field.dirty) {
                                        //             field.save({
                                        //                 success: function () {
                                        //                     subField.blur();
                                        //                     offerDataFields.load({
                                        //                         callback: function () {
                                        //                             subField.upVM().get('calculationServices').load();
                                        //                         },
                                        //                     });
                                        //                 },
                                        //             });
                                        //         }
                                        //     }
                                        // },
                                    },
                                },
                            },
                        },
                    });
                    break;
                case 'combobox':
                    data.push({
                        xtype: 'combobox',
                        editable: false,
                        testId: field.get('label') === 'Vessel Type' ? 'calculationItemsVesselTypeCombo' : null,
                        options: field.get('options'),
                        label: field.get('label'),
                        required: field.get('required'),
                        ui: 'classic',
                        placeholder: AbraxaConstants.placeholders.emptyValue,
                        labelAlign: 'left',
                        reference: field.get('reference'),
                        cls: 'a-data-field-dropdown offer_data_field',
                        viewModel: {
                            data: {
                                record: field,
                            },
                        },
                        queryMode: 'local',
                        forceSelection: true,
                        displayField: field.get('options') ? 'text' : 'name',
                        valueField: field.get('options') ? 'value' : 'id',
                        bind: {
                            store: field.get('store') ? '{' + field.get('store').type + '}' : null,
                            value: '{record.value}',
                            disabled: '{pda.status !== "draft" || nonEditable}',
                        },
                    });
                    break;
                default:
                    data.push({
                        xtype: field.get('xtype'),
                        label: field.get('label'),
                        required: field.get('required'),
                        minValue: field.get('minValue'),
                        maxValue: field.get('maxValue'),
                        ui: 'classic',
                        placeholder: AbraxaConstants.placeholders.emptyValue,
                        options: field.get('options'),
                        cls: 'a-data-field-number offer_data_field',
                        labelAlign: 'left',
                        viewModel: {
                            data: {
                                record: field,
                            },
                        },
                        bind: {
                            value: '{record.value}',
                            disabled: '{pda.status !== "draft" || nonEditable}',
                        },
                    });
            }
        });
        this.fireEvent('parseOfferDataFields', data);
    },
    transformItemFields: function (input) {
        let fields = input.fields,
            calculation_id = input.calculation_id,
            vm = input.vm,
            calculation = vm.get('record'),
            service = input.record,
            data = [];

        service.getProxy().setExtraParams({
            calculation_id: calculation_id,
        });

        fields.each(function (field) {
            field.getProxy().setExtraParams({
                calculation_id: calculation_id,
            });
            switch (field.get('xtype')) {
                case 'componentdataview':
                    data.push({
                        xtype: 'abraxa.componentdataview',
                        data: field.get('children'),
                        // html: '<div class="a-title-md">' + field.get('label') + '</div>',
                        masked: false,
                        cls: 'a-bgr-transparent',
                        itemConfig: {
                            xtype: field.get('children')[0].xtype,
                            layout: field.get('children')[0].layout,
                            multiply: field.get('multiply'),
                            viewModel: {
                                formulas: {
                                    paresedItems: {
                                        bind: {
                                            bindTo: '{record}',
                                        },
                                        get: function (record) {
                                            if (record) {
                                                let multiply = this.getView().multiply,
                                                    store = record.store,
                                                    index = store.indexOf(record),
                                                    component = this.getView(),
                                                    fieldsStore = Ext.getStore('offerDataFields');

                                                record.get('items').unshift({
                                                    xtype: 'label',
                                                    cls: 'c-blue-grey fs-13 mr-16',
                                                    minWidth: 140,
                                                    maxWidth: 140,
                                                    html: field.get('label') + (multiply ? ' ' + (index + 1) : ''),
                                                });
                                                if (multiply) {
                                                    if (index == 0) {
                                                        record.get('items').push({
                                                            xtype: 'button',
                                                            ui: 'small round tool-round normal',
                                                            iconCls: 'md-icon-outlined md-icon-add-circle-outline',
                                                            cls: 'ml-16',
                                                            flex: null,
                                                            focusable: false,
                                                            tabIndex: '-1',
                                                            handler: function () {
                                                                let data = JSON.parse(field.get('childrenRaw')),
                                                                    dataCopy = Object.assign({}, data[0]),
                                                                    fieldCopy = Object.assign(
                                                                        {},
                                                                        JSON.parse(JSON.stringify(dataCopy))
                                                                    );

                                                                fieldCopy.items.forEach(function (item) {
                                                                    item.fieldID = Ext.id();
                                                                    item.value = null;
                                                                });
                                                                data.push(fieldCopy);

                                                                field.set('children', data);
                                                                field.set('childrenRaw', JSON.stringify(data));
                                                                if (field.dirty) {
                                                                    let serviceFields = JSON.parse(
                                                                            service.get('fieldsRaw')
                                                                        ),
                                                                        fieldsCopy = Object.assign(
                                                                            {},
                                                                            JSON.parse(JSON.stringify(serviceFields))
                                                                        ),
                                                                        newFields = [];

                                                                    Ext.Object.each(fieldsCopy, function (key, value) {
                                                                        if (value.fieldID === field.get('fieldID')) {
                                                                            value.children = data;
                                                                        }
                                                                        value.childrenRaw = JSON.stringify(
                                                                            value.children
                                                                        );
                                                                        newFields.push(
                                                                            JSON.parse(JSON.stringify(value))
                                                                        );
                                                                    });

                                                                    service.set('offer_fields', newFields);
                                                                    service.set('fieldsRaw', JSON.stringify(newFields));
                                                                    service.save({
                                                                        success: function () {
                                                                            vm.get('calculationServices').reload();
                                                                            Ext.toast('Saved');
                                                                        },
                                                                    });
                                                                }
                                                            },
                                                        });
                                                    } else {
                                                        record.get('items').push({
                                                            xtype: 'button',
                                                            ui: 'small round tool-round default',
                                                            iconCls: 'md-icon-outlined md-icon-remove-circle-outline',
                                                            cls: 'ml-8',
                                                            flex: null,
                                                            focusable: false,
                                                            tabIndex: 0,
                                                            handler: function () {
                                                                let record = this.upVM().get('record'),
                                                                    store = record.store,
                                                                    index = store.indexOf(record),
                                                                    data = JSON.parse(field.get('childrenRaw'));

                                                                data.splice(index, 1);
                                                                // store.remove(record);

                                                                field.set('children', JSON.parse(JSON.stringify(data)));
                                                                field.set('childrenRaw', JSON.stringify(data));

                                                                if (field.dirty) {
                                                                    let serviceFields = JSON.parse(
                                                                            service.get('fieldsRaw')
                                                                        ),
                                                                        fieldsCopy = Object.assign(
                                                                            {},
                                                                            JSON.parse(JSON.stringify(serviceFields))
                                                                        ),
                                                                        newFields = [];

                                                                    Ext.Object.each(fieldsCopy, function (key, value) {
                                                                        if (value.fieldID === field.get('fieldID')) {
                                                                            value.children = data;
                                                                        }
                                                                        value.childrenRaw = JSON.stringify(
                                                                            value.children
                                                                        );
                                                                        newFields.push(
                                                                            JSON.parse(JSON.stringify(value))
                                                                        );
                                                                    });

                                                                    service.set('offer_fields', newFields);
                                                                    service.set('fieldsRaw', JSON.stringify(newFields));
                                                                    service.save({
                                                                        success: function () {
                                                                            vm.get('calculationServices').reload();
                                                                            Ext.toast('Saved');
                                                                        },
                                                                    });
                                                                }
                                                            },
                                                        });
                                                    }
                                                }

                                                record.get('items').forEach((el) => {
                                                    if (el.xtype === 'combobox') el.editable = false;
                                                });

                                                return record.get('items');
                                            }
                                        },
                                    },
                                },
                            },
                            bind: {
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                items: '{paresedItems}',
                            },
                            defaults: {
                                ui: 'hovered-underline',
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                flex: 1,
                                floatedPicker: {
                                    listeners: {
                                        select: function (picker) {
                                            let subField = picker.ownerCmp;
                                            if (subField.dirty) {
                                                let data = JSON.parse(field.get('childrenRaw')),
                                                    fieldCopy = Object.assign({}, JSON.parse(JSON.stringify(data))),
                                                    fieldID = subField.fieldID;

                                                // let fieldID = this.fieldID,
                                                //     data = JSON.parse(field.get('childrenRaw'));

                                                Ext.Object.each(fieldCopy, function (key, value) {
                                                    value.items.forEach(function (item) {
                                                        if (item.fieldID === fieldID) {
                                                            item.value = subField.getValue();
                                                        }
                                                    });
                                                });

                                                field.set('children', fieldCopy);
                                                field.set('childrenRaw', JSON.stringify(fieldCopy));
                                                let fieldData = [];
                                                if (fields.needsSync) {
                                                    fieldData.push(field.getData());
                                                    service.set('offer_fields', fieldData);
                                                    service.set('fieldsRaw', JSON.stringify(fieldData));
                                                    //subField.blur();
                                                    subField.setDisabled(true);
                                                    // subField.up('[itemId=itemsDataFieldsContainer]').setMasked({
                                                    //     xtype: 'loadmask',
                                                    //     message: null,
                                                    // });
                                                    service.save({
                                                        success: function (rec) {
                                                            // subField
                                                            //     .up('[itemId=itemsDataFieldsContainer]')
                                                            //     .setMasked(false);
                                                            vm.get('calculationServices').reload();
                                                            Ext.toast('Saved');
                                                        },
                                                    });
                                                }
                                            }
                                        },
                                    },
                                },
                                listeners: {
                                    focusleave: function (subField) {
                                        if (subField.xtype === 'button' || subField.xtype === 'combobox') return;

                                        if (subField.dirty) {
                                            let data = JSON.parse(field.get('childrenRaw')),
                                                fieldCopy = Object.assign({}, JSON.parse(JSON.stringify(data))),
                                                fieldID = this.fieldID;

                                            // let fieldID = this.fieldID,
                                            //     data = JSON.parse(field.get('childrenRaw'));

                                            Ext.Object.each(fieldCopy, function (key, value) {
                                                value.items.forEach(function (item) {
                                                    if (item.fieldID === fieldID) {
                                                        item.value = subField.getValue();
                                                    }
                                                });
                                            });

                                            field.set('children', fieldCopy);
                                            field.set('childrenRaw', JSON.stringify(fieldCopy));
                                            let fieldData = [];
                                            if (fields.needsSync) {
                                                fieldData.push(field.getData());
                                                service.set('offer_fields', fieldData);
                                                service.set('fieldsRaw', JSON.stringify(fieldData));
                                                subField.setDisabled(true);
                                                // subField.up('[itemId=itemsDataFieldsContainer]').setMasked({
                                                //     xtype: 'loadmask',
                                                //     message: null,
                                                // });
                                                service.save({
                                                    success: function (rec) {
                                                        //     subField
                                                        //         .up('[itemId=itemsDataFieldsContainer]')
                                                        //         .setMasked(false);
                                                        vm.get('calculationServices').reload();
                                                        Ext.toast('Saved');
                                                    },
                                                });
                                            }
                                        }
                                    },
                                },
                            },
                        },
                    });
                    break;
                case 'combobox':
                    data.push({
                        xtype: 'combobox',
                        editable: false,
                        options: field.get('options'),
                        label: field.get('label'),
                        required: field.get('required'),
                        ui: 'hovered-underline',
                        placeholder: AbraxaConstants.placeholders.emptyValue,
                        forceSelection: false,
                        labelAlign: 'left',
                        viewModel: {
                            data: {
                                record: field,
                            },
                        },
                        displayField: 'text',
                        valueField: 'value',
                        bind: {
                            value: '{record.value}',
                        },
                        floatedPicker: {
                            listeners: {
                                select: function (me, selection) {
                                    let combobox = me.ownerCmp,
                                        data = [];

                                    if (fields.needsSync && !combobox.getDisabled()) {
                                        data.push(field.getData());
                                        service.set('offer_fields', data);
                                        service.set('fieldsRaw', JSON.stringify(data));
                                        service.save({
                                            success: function () {
                                                vm.get('calculationServices').reload();
                                                Ext.toast('Saved');
                                            },
                                        });
                                    }
                                },
                            },
                        },
                    });
                    break;
                case 'spinnerfield':
                    data.push({
                        xtype: field.get('xtype'),
                        label: field.get('label'),
                        required: field.get('required'),
                        ui: 'hovered-underline',
                        placeholder: AbraxaConstants.placeholders.emptyValue,
                        options: field.get('options'),
                        labelAlign: 'left',
                        viewModel: {
                            data: {
                                record: field,
                            },
                        },
                        bind: {
                            value: '{record.value}',
                        },
                        listeners: {
                            focusleave: function (field) {
                                let record = this.upVM().get('record');
                                if (record.dirty) {
                                    record.save();
                                }
                            },
                            spin: function () {
                                let record = this.upVM().get('record');
                                if (record.dirty) {
                                    record.save();
                                }
                            },
                        },
                    });
                    break;
                default:
                    data.push({
                        xtype: field.get('xtype'),
                        label: field.get('label'),
                        required: field.get('required'),
                        minValue: field.get('minValue'),
                        maxValue: field.get('maxValue'),
                        ui: 'hovered-underline',
                        placeholder: AbraxaConstants.placeholders.emptyValue,
                        options: field.get('options'),
                        labelAlign: 'left',
                        viewModel: {
                            data: {
                                record: field,
                            },
                        },
                        bind: {
                            value: '{record.value}',
                        },
                        listeners: {
                            focusleave: function (combobox) {
                                let data = [],
                                    record = this.upVM().get('record');
                                if (fields.needsSync) {
                                    data.push(record.getData());
                                    service.set('offer_fields', data);
                                    service.set('fieldsRaw', JSON.stringify(data));
                                    combobox.setDisabled(true);
                                    // combobox.up('[itemId=itemsDataFieldsContainer]').setMasked({
                                    //     xtype: 'loadmask',
                                    //     message: null,
                                    // });
                                    service.save({
                                        success: function () {
                                            combobox.setDisabled(false);
                                            // combobox.up('[itemId=itemsDataFieldsContainer]').setMasked(false);
                                            vm.get('calculationServices').reload();
                                            Ext.toast('Saved');
                                        },
                                        failure: function () {
                                            combobox.setDisabled(false);
                                        },
                                    });
                                }
                            },
                        },
                    });
            }
        });
        this.fireEvent('parseItemFields', data, vm);
    },
});

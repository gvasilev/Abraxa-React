Ext.define('Abraxa.view.portcall.husbandry.supplies.Service', {
    extend: 'Ext.form.Panel',
    xtype: 'husbandry.service',
    testId: 'husbSupplService',
    cls: 'a-bnc-main a-bnc-sof',
    flex: 1,
    scrollable: 'y',
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-dialog-form a-general-form',
            defaults: {
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'default.expense.items.combo',
                    label: 'Service',
                    testId: 'husbSupplServiceServiceCombo',
                    placeholder: 'Choose type',
                    cls: 'a-field-icon icon-short icon-rounded',
                    itemCls: 'a-disb-costs-combo',
                    required: true,
                    clearable: true,
                    reference: 'selectedServiceType',
                    bind: {
                        value: '{record.default_expense_item_id}',
                        store: '{disbItemStore}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('record');
                                record.set('default_expense_item_name', selection.get('name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'accounts.combo',
                    label: 'Billing party',
                    testId: 'husbSupplServiceBillingPartyCombo',
                    forceSelection: true,
                    clearable: true,
                    placeholder: 'Choose Account',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    floatedPicker: {
                        minWidth: 220,
                    },
                    required: true,
                    reference: 'accountsCombo',
                    bind: {
                        value: '{record.account_id}',
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('record');
                                record.set('account_name', selection.get('org_name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Disbursement ID',
                    testId: 'husbSupplServiceDisbursementIDField',
                    placeholder: 'Choose',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded non-editable',
                    subObject: 'supply',
                    disabled: true,
                    valueField: 'name',
                    displayField: 'name',
                    clearable: true,
                    slug: 'portcallServices',
                    store: [],
                    bind: {
                        value: '{record.disbursement_id}',
                        permission: '{userPermissions}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                        objectPermission: '{objectPermissions}',
                        disabled: '{accountsCombo.selection ? false : true}',
                        store: '{disbursementGrouping}',
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Account of',
                    testId: 'husbSupplServiceAccountOfField',
                    editable: true,
                    clearable: true,
                    placeholder: 'Choose',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    slug: 'portcallServices',
                    options: ['Owners costs', 'Charterers costs', 'Shippers costs', 'Agents costs'],
                    bind: {
                        value: '{record.account_of}',
                        inputValue: '{record.account_of}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset',
                    html: '<hr>',
                },
                {
                    xtype: 'unit.field',
                    cls: 'a-field-icon icon-short icon-rounded',
                    testId: 'husbSupplQuantityField',
                    label: 'Quantity',
                    margin: '4 0',
                    decimals: 3,
                    placeholder: '0000.00',
                    valueUnit: null,
                    slug: 'portcallServices',
                    hidden: false,
                    bind: {
                        value: '{record.quantity}',
                        valueUnit: '{record.quantity_unit}',
                        permission: '{userPermissions}',
                        hidden: '{selectedServiceType.selection.amount == 1 ? true:false}',
                        options: '{defaultServiceUnits}',
                        unitFilter: '{selectedServiceType.selection.type.default_units_id}',
                    },
                },
                {
                    xtype: 'container',
                    margin: '4 0',
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                    },
                    layout: 'hbox',
                    hidden: true,
                    bind: {
                        hidden: '{selectedServiceType.selection.amount == 1 ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            flex: 3.5,
                            testId: 'husbSupplQuantityNumberField',
                            label: 'Quantity',
                            placeholder: '0,000.00',
                            cls: 'a-prepend a-field-icon icon-short icon-rounded',
                            slug: 'portcallServices',
                            bind: {
                                value: '{record.quantity}',
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'common-combo-currency',
                            flex: 1,
                            testId: 'husbSupplCurrencyField',
                            label: '',
                            placeholder: 'Currency',
                            forceSelection: true,
                            cls: 'a-append',
                            bind: {
                                value: '{record.quantity_unit}',
                                store: '{companyCurrencies}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'numberfield',
                    placeholder: '0,000.00',
                    itemId: 'charges',
                    label: 'Estimated price',
                    testId: 'husbSupplEstimatedPriceField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    slug: 'portcallServices',
                    bind: {
                        value: '{record.pda_price}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'organization.combo',
                    forceSelection: true,
                    placeholder: 'Choose Company',
                    label: 'Vendor',
                    testId: 'husbSupplVendorField',
                    slug: 'portcallServices',
                    cls: 'a-field-icon icon-business-center icon-rounded',

                    floatedPicker: {
                        minWidth: 288,
                        viewModel: {
                            data: {
                                showSuggested: true,
                            },
                        },
                    },
                    bind: {
                        value: '{record.vendor_id}',
                        permission: '{userPermissions}',
                        // store: '{orgs}'
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('record');
                                record.set('vendor_name', selection.get('org_name'));
                            }
                        },
                        clearicontap: function () {
                            let record = this.upVM().get('record');
                            record.set('vendor_name', null);
                        },
                    },
                },
                {
                    xtype: 'combobox',
                    label: 'Place',
                    placeholder: 'Choose',
                    queryMode: 'local',
                    valueField: 'id',
                    testId: 'husbSupplChoosePlaceField',
                    slug: 'portcallServices',
                    cls: 'a-field-icon icon-place icon-rounded',
                    displayField: 'name',
                    clearable: true,
                    editable: false,
                    bind: {
                        value: '{record.place_id}',
                        store: '{places}',
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('record');
                                record.set('place_name', selection.get('name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'abraxa.datetimefield',
                    label: 'Date',
                    testId: 'husbSupplDateTimeField',
                    cls: 'a-field-icon icon-time icon-rounded',
                    slug: 'portcallServices',
                    bind: {
                        dateTime: '{record.date}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'organization.combo',
                    forceSelection: true,
                    placeholder: 'Choose Company',
                    testId: 'husbSupplDeliveredByField',
                    label: 'Delivered by',
                    slug: 'portcallServices',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    hidden: true,
                    floatedPicker: {
                        minWidth: 288,
                    },
                    bind: {
                        value: '{record.delivered_by}',
                        permission: '{userPermissions}',
                        // store: '{orgs}',
                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 9 || selectedServiceType.selection.default_expense_item_type_id == 15 ? false:true}', // 9,15 = bunkers,supplies
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('record');
                                record.set('delivered_by_name', selection.get('org_name'));
                            }
                        },
                        clearicontap: function () {
                            let record = this.upVM().get('record');
                            record.set('delivered_by_name', null);
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    padding: '4 0',
                    cls: 'a-field-icon icon-short icon-rounded',
                    label: 'Dimensions',
                    testId: 'husbSupplDimensionsField',
                    placeholder: 'Enter dimensions',
                    hidden: true,
                    slug: 'portcallServices',
                    bind: {
                        value: '{record.dimensions}',
                        permission: '{userPermissions}',
                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 15 ? false:true}', // 15 = supplies
                    },
                },
                {
                    xtype: 'textfield',
                    padding: '4 0',
                    cls: 'a-field-icon icon-short icon-rounded',
                    label: 'AWB number',
                    testId: 'husbSupplAWBField',
                    placeholder: 'Enter AWB number',
                    hidden: true,
                    slug: 'portcallServices',
                    bind: {
                        value: '{record.awb_number}',
                        permission: '{userPermissions}',
                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 15 ? false:true}', // 15 = supplies
                    },
                },
                {
                    xtype: 'textfield',
                    padding: '4 0',
                    cls: 'a-field-icon icon-short icon-rounded',
                    label: 'Customs number',
                    testId: 'husbSupplCustomsNumberField',
                    placeholder: 'Customs number',
                    slug: 'portcallServices',
                    hidden: true,
                    bind: {
                        value: '{record.customs_document_number}',
                        permission: '{userPermissions}',
                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 15 ? false:true}', // 15 = supplies
                    },
                },
                {
                    xtype: 'unit.field',
                    padding: '4 0',
                    cls: 'a-field-icon icon-short icon-rounded',
                    label: 'Ordered quantity',
                    testId: 'husbSupplOrderedQuantityField',
                    decimals: 3,
                    placeholder: '0000.00',
                    valueUnit: null,
                    slug: 'portcallServices',
                    matchFieldWidth: true,
                    hidden: true,
                    bind: {
                        value: '{record.ordered_quantity}',
                        valueUnit: '{record.ordered_unit}',
                        permission: '{userPermissions}',
                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 9 ? false:true}', // 9 = bunkers
                        options: '{defaultServiceUnits}',
                    },
                },
            ],
        },
    ],
});

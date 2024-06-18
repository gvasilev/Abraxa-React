import './ServiceLibraryController';
import './AssignCostCenterPopup';

Ext.define('Abraxa.view.settings.library.expenses.ServiceRightPanel', {
    extend: 'Ext.Container',
    xtype: 'ServiceRightPanel',
    cls: 'a-right-container a-supplies-right-container',
    controller: 'ServiceLibraryController',
    hidden: true,
    layout: 'vbox',
    bind: {
        hidden: '{LibraryServicesGrid.selection && !LibraryServicesGrid.selection.is_checked ? false : true}',
    },
    viewModel: {
        stores: {
            serviceCostCenters: {
                source: '{LibraryServicesGrid.selection.cost_centers}',
                filters: '{serviceCostCenterFilter}',
            },
        },
        formulas: {
            selectedService: {
                bind: {
                    bindTo: '{LibraryServicesGrid.selection}',
                },
                get: function (record) {
                    if (record) {
                        return record;
                    }
                },
            },
            dialogTitle: {
                bind: {
                    bindTo: '{LibraryServicesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return (
                            '<div class="a-badge a-badge-' +
                            record.get('category').name +
                            '"><i class="md-icon-outlined"></i></div><div><span class="a-panel-title">' +
                            record.get('system_name') +
                            '</span></div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
            serviceCostCenterFilter: {
                bind: {
                    bindTo: '{LibraryServicesGrid.selection}',
                },
                get: function (selectedService) {
                    if (selectedService) {
                        let store = this.get('serviceCostCenters');
                        if (store) store.clearFilter();

                        return function (item) {
                            if (item.get('id') > 0 && item.get('reference_id') !== 'abraxa_default') return true;
                        };
                    } else {
                        return function (item) {
                            return false;
                        };
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '{dialogTitle}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                let record = this.upVM().get('LibraryServicesGrid.selection'),
                                    grid = Ext.ComponentQuery.query('#LibraryServicesGrid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            flex: 1,
            scrollable: true,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-bb-100',
                    padding: 24,
                    layout: {
                        type: 'vbox',
                    },
                    defaults: {
                        flex: 1,
                        labelAlign: 'left',
                        ui: 'hovered-border classic',
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'System name',
                            disabled: true,
                            bind: {
                                value: '{LibraryServicesGrid.selection.system_name}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Alias name',
                            placeholder: 'Enter alias name',
                            cost_center_value: 'alias_name',
                            bind: {
                                value: '{LibraryServicesGrid.selection.alias_name}',
                            },
                            fieldModelName: 'name',
                            listeners: {
                                focusleave: 'updateCostCenterFields',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Abraxa cost center',
                            disabled: true,
                            bind: {
                                value: '{LibraryServicesGrid.selection.system_name}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Accounting code',
                            placeholder: 'Enter accounting code',
                            cost_center_value: 'accounting_code',
                            bind: {
                                value: '{LibraryServicesGrid.selection.accounting_code}',
                            },
                            fieldModelName: 'accounting_code',
                            listeners: {
                                focusleave: 'updateCostCenterFields',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra',
                    controller: 'CostCenterController',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Cost centers',
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.componentdataview',
                            minHeight: 120,
                            padding: '0 24',
                            bind: {
                                store: '{serviceCostCenters}',
                            },
                            emptyText: {
                                xtype: 'container',
                                controller: 'ServiceLibraryController',
                                zIndex: 999,
                                layout: {
                                    type: 'vbox',
                                },
                                centered: true,
                                html: 'No cost centers assigned',
                                items: [
                                    {
                                        xtype: 'button',
                                        margin: '16 0 0 0',
                                        text: 'Assign my cost center',
                                        iconCls: 'md-icon-add',
                                        ui: 'normal small',
                                        handler: 'assignCostCenterSingle',
                                    },
                                ],
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        subCostCenters: {
                                            bind: {
                                                bindTo: '{record}',
                                            },
                                            get: function (record) {
                                                let costCenterStore = this.get('costCenterStore'),
                                                    costCenter = costCenterStore.getById(record.get('id'));

                                                if (costCenter) {
                                                    let costCenterItems = costCenter.get('items');

                                                    return costCenterItems.filter(function (item) {
                                                        return item.type === 'subCenter';
                                                    });
                                                }
                                                return [];
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                cls: 'bordered border-radius',
                                margin: '0 0 16',
                                padding: '8 22',
                                defaults: {
                                    ui: 'hovered-border classic',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    labelAlign: 'left',
                                },
                                items: [
                                    {
                                        xtype: 'abraxa.titlebar',
                                        margin: '0 -16',
                                        bind: {
                                            title: '<div class="hbox"><div class="a-badge a-badge-default mr-12"><i class="md-icon-outlined">finance_chip</i></div><span class="mr-4 fs-14">{record.name}</span></div>',
                                        },
                                        items: [
                                            {
                                                xtype: 'button',
                                                align: 'right',
                                                iconCls: 'md-icon-delete',
                                                bind: {
                                                    hidden: '{record.reference_id === "abraxa_default"}',
                                                },
                                                tooltip: {
                                                    html: 'Remove from cost center',
                                                    align: 'bc-tc?',
                                                    anchor: true,
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                },
                                                ui: 'round default',
                                                handler: 'removeServiceFromCostCenter',
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'selectfield',
                                        label: 'Sub cost center',
                                        placeholder: 'Select sub cost center',
                                        cls: 'cost_center_field',
                                        cost_center_value: 'subcenter_id',
                                        valueField: 'id',
                                        clearable: true,
                                        bind: {
                                            store: '{subCostCenters}',
                                            value: '{record.subcenter.id}',
                                            inputValue: '{record.subcenter.name}',
                                            disabled: '{record.reference_id === "abraxa_default" ? true:false}',
                                        },
                                    },
                                    {
                                        xtype: 'textfield',
                                        label: 'Accounting code',
                                        cls: 'a-field-icon icon-numbers icon-rounded cost_center_field',
                                        placeholder: 'Enter accounting code',
                                        cost_center_value: 'accounting_code',
                                        bind: {
                                            disabled: '{record.reference_id === "abraxa_default" ? true:false}',
                                        },
                                        viewModel: {
                                            formulas: {
                                                setValue: {
                                                    bind: '{record.accounting_code}',
                                                    get: function (value) {
                                                        this.getView().setValue(value);
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'textareafield',
                                        label: 'Description',
                                        minHeight: 150,
                                        ui: 'no-border no-underline',
                                        cls: 'a-field-icon icon-short cost_center_field',
                                        placeholder: 'Enter description',
                                        cost_center_value: 'description',
                                        viewModel: {
                                            formulas: {
                                                setValue: {
                                                    bind: '{record.description}',
                                                    get: function (value) {
                                                        this.getView().setValue(value);
                                                    },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    padding: '0 0 16 0',
                                    controller: 'ServiceLibraryController',
                                    docked: 'bottom',
                                    bind: {
                                        hidden: '{serviceCostCenters.count ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 24',
                                            text: 'Assign my cost center',
                                            iconCls: 'md-icon-add',
                                            ui: 'normal small',
                                            handler: 'assignCostCenterSingle',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});

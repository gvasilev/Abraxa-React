Ext.define('Abraxa.view.portcall.husbandry.supplies.SuppliesRightCard', {
    extend: 'Ext.Container',
    xtype: 'husbandry.supplies.right.card',
    itemId: 'suppliesRightCard',
    testId: 'suppliesRightCard',
    cls: 'a-right-container a-supplies-right-container',
    hidden: true,
    bind: {
        hidden: '{suppliesGrid.selection && !suppliesGrid.selection.is_checked ? false : true}',
    },
    controller: 'supplies-controller',
    layout: 'vbox',
    viewModel: {
        stores: {
            comments: {
                source: '{notes}',
                filters: '{noteFilter}',
            },
            objectTasks: {
                source: '{tasks}',
                filters: '{taskFilter}',
            },
            disbursementsBillToStore: {
                source: '{accounts}',
            },
            currencyRateStore: {
                source: '{currencyRates}',
            },
            expenseItems: {
                source: '{defaultExpenseItems}',
            },
            invoices: {
                source: '{vouchers}',
                filters: '{invoiceFilter}',
            },
        },
        formulas: {
            invoiceFilter: {
                bind: {
                    bindTo: '{suppliesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('invoices');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (rec.get('expense_id') == record.get('id')) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return false;
                        };
                    }
                },
            },
            noteFilter: {
                bind: {
                    bindTo: '{suppliesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('comments');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('noteable_type') == record.get('model_name') &&
                                rec.get('noteable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            taskFilter: {
                bind: {
                    bindTo: '{suppliesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('objectTasks');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('taskable_type') == record.get('model_name') &&
                                rec.get('taskable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            hideCardIfNotSelection: {
                bind: {
                    bindTo: '{suppliesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (!record) {
                        Ext.ComponentQuery.query('[itemId=suppliesRightCard]')[0].hide();
                    }
                },
            },
            dialogTitle: {
                bind: {
                    bindTo: '{suppliesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return (
                            '<div class="a-badge a-badge-' +
                            record.get('default_expense_item').category.name +
                            '"><i class="md-icon-outlined"></i></div><div><span class="a-panel-title">' +
                            record.get('default_expense_item_name') +
                            '</span><span class="a-panel-id">#SP-' +
                            record.get('id') +
                            '</span></div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
            selectedCategory: {
                bind: {
                    bindTo: '{suppliesGrid.selection.type}',
                    deep: true,
                },
                get: function (type) {
                    if (type) {
                        if (type == 'service') {
                            return 'services';
                        }
                        return type;
                    }
                },
            },
            invoiceAmount: {
                bind: {
                    bindTo: '{suppliesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let vouchers = record.vouchers();
                        if (vouchers.count()) return vouchers.sum('calculated_price');
                    }
                },
            },
            itemTemplate: {
                bind: {
                    bindTo: '{nonEditable}',
                    deep: true,
                },
                get: function (live) {
                    if (live) {
                        return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{name}.{document.extension}</a><span class="sm-title">{document.size}</span></div></div>';
                    }
                    return '<tpl if="document"><div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{name}.{document.extension}</a><span class="sm-title">{document.size}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div></tpl>';
                },
            },
            lockedField: {
                bind: {
                    bindTo: '{suppliesGrid.selection.pda_id}',
                    deep: true,
                },
                get: function (pdaId) {
                    let disbursement = this.get('disbursements').findRecord('id', pdaId);
                    if (disbursement && disbursement.get('status') != 'draft') {
                        return true;
                    } else {
                        return false;
                    }
                },
            },
            disableDisbursementCombo: {
                bind: {
                    lockedField: '{lockedField}',
                    combo: '{accountsCombo.selection}',
                },
                get: function (data) {
                    if (data.lockedField) {
                        return true;
                    } else {
                        if (data.combo) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return true;
                },
            },
            dragListeners: {
                bind: {
                    bindTo: '{userPermissions}',
                    deeP: true,
                },
                get: function (store) {
                    if (store && Object.keys(store).length > 0) {
                        let record = store['portcall'];
                        if (record && record.edit) {
                            return {
                                element: 'element',
                                drop: 'onDrop',
                                dragleave: 'onDragLeaveListItem',
                                dragover: 'onDragOverListItem',
                            };
                        } else {
                            return {};
                        }
                    } else {
                        return {};
                    }
                },
            },
            canAddInvoice: {
                bind: {
                    bindTo: '{userPermissions}',
                    deeP: true,
                },
                get: function (store) {
                    if (store && Object.keys(store).length > 0) {
                        let record = store['portcallSupplyAddInvoice'];
                        if (record && record.edit) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
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
                        {
                            xtype: 'container',
                            subObject: 'supply',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 12',
                                    ui: 'status default',
                                    slug: 'portcallServices',
                                    testId: 'suppliesRightCardStatusBtn',
                                    bind: {
                                        cls: 'status-{suppliesGrid.selection.status}',
                                        text: '{suppliesGrid.selection.status:capitalize}',
                                        permission: '{userPermissions}',
                                    },
                                    menu: {
                                        defaults: {
                                            handler: function (me) {
                                                let selection = me.upVM().get('suppliesGrid.selection');
                                                if (selection) {
                                                    selection.set('status', me.value);
                                                }
                                                if (selection.dirty) {
                                                    selection.getProxy().setExtraParams({
                                                        portcall_id: me.upVM().get('object_record').get('id'),
                                                    });
                                                    selection.save({
                                                        success: function () {
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
                                        },
                                        items: [
                                            {
                                                text: 'New',
                                                value: 'new',
                                            },
                                            {
                                                text: 'Pending',
                                                value: 'pending',
                                            },
                                            {
                                                text: 'Confirmed',
                                                value: 'confirmed',
                                            },
                                            {
                                                text: 'In progress',
                                                value: 'in progress',
                                            },
                                            {
                                                text: 'Delivered',
                                                value: 'delivered',
                                            },
                                            {
                                                text: 'Canceled',
                                                value: 'canceled',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 0 12',
                            hidden: true,
                            testId: 'suppliesRightCardStatusDiv',
                            bind: {
                                hidden: '{editableSupplyPermissions}',
                                html: '<div class="a-status-badge status-xl status-{suppliesGrid.selection.status}">{suppliesGrid.selection.status:capitalize}</div>',
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
                            iconCls: 'md-icon-outlined md-icon-add-task',
                            slug: 'taskCreate',
                            testId: 'suppliesRightCardAddTaskBtn',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{object_record.is_archived ? true : false}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add task',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                let button = this;

                                // Check if a note is already opened
                                if (button.taskOpened) {
                                    return;
                                }

                                button.taskOpened = true;

                                let record = this.upVM().get('suppliesGrid.selection'),
                                    subObjects = this.upVM().get('subObjects'),
                                    subObject = Ext.Array.filter(subObjects, function (rec) {
                                        return rec.id == record.get('id') && rec.model == record.get('model_name');
                                    })[0];

                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            subObjects: this.upVM().get('subObjects'),
                                            selectedSubObject: subObject.id,
                                            relatedObject: true,
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            editMode: false,
                                            taskEdit: false,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: 3,
                                                object_meta_id: this.upVM().get('object_record').get('id'),
                                                taskable_type: this.upVM()
                                                    .get('suppliesGrid.selection')
                                                    .get('model_name'),
                                                taskable_id: this.upVM().get('suppliesGrid.selection').get('id'),
                                                priority: 'normal',
                                            }),
                                        },
                                    },
                                    // Add listeners to reset the flag when the task is closed
                                    listeners: {
                                        destroy: () => {
                                            button.taskOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                // Show the task
                                task.show();
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-more-horiz',
                            ui: 'tool-md round',
                            arrow: false,
                            testId: 'suppliesRightCardMoreActionsBtn',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'More actions',
                                align: 'bc-tc?',
                                closeAction: 'destroy',
                            },
                            menu: {
                                ui: 'medium has-icons',
                                items: [
                                    // {
                                    //     text: 'Remove from balance',
                                    //     iconCls: 'md-icon-outlined md-icon-delete',
                                    // },
                                    {
                                        text: 'Delete',
                                        testId: 'suppliesRightCardDeleteBtn',
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        ui: 'decline',
                                        separator: true,
                                        slug: 'portcallSupplyDelete',
                                        subObject: 'supply',
                                        bind: {
                                            cls: '{nonEditable ? "hidden": ""}',
                                            permission: '{userPermissions}',
                                            objectPermission: '{objectPermissions}',
                                            disabled: '{suppliesGrid.selection.is_locked}',
                                        },
                                        handler: function (item, el, eOpts) {
                                            let vm = this.upVM(),
                                                store = vm.get('expenses'),
                                                container = this.find('suppliesRightCard'),
                                                vouchers = vm.get('vouchers'),
                                                record = vm.get('suppliesGrid.selection');
                                            Ext.Msg.confirm(
                                                'Delete',
                                                'Are you sure you would like to delete this entry?',
                                                function (answer) {
                                                    if (answer == 'yes') {
                                                        container.hide();
                                                        store.remove(record);
                                                        store.sync({
                                                            success: function (err, msg) {
                                                                if (record.vouchers() && record.vouchers().getCount()) {
                                                                    record.vouchers().each(function (rec) {
                                                                        rec.set('expense_id', null);
                                                                    });
                                                                    record
                                                                        .vouchers()
                                                                        .getProxy()
                                                                        .setExtraParams({
                                                                            portcall_id: record.get('portcall_id'),
                                                                        });
                                                                    record.vouchers().sync({
                                                                        success: function () {
                                                                            vouchers.reload();
                                                                        },
                                                                    });
                                                                }
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                            failure: function (batch) {
                                                                Ext.Msg.alert(
                                                                    'Something went wrong',
                                                                    'Could not delete record!'
                                                                );
                                                            },
                                                        });
                                                    }
                                                },
                                                this,
                                                [
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'no',
                                                        testId: 'suppliesRightCardDeleteNoBtn',
                                                        margin: '0 8 0 0',
                                                        text: 'Cancel',
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'yes',
                                                        testId: 'suppliesRightCardDeleteYesBtn',
                                                        ui: 'decline alt',
                                                        text: 'Delete',
                                                    },
                                                ]
                                            );
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'suppliesRightCardExpandCloseBtn',
                            handler: function (me) {
                                let record = this.upVM().get('suppliesGrid.selection'),
                                    grid = Ext.ComponentQuery.query('husbandry\\.supplies\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=husbandry\\.supplies\\.right.\\card]').hide();
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
            cls: 'a-drop-container a-portcall-info',
            padding: '10 0 0 0',
            id: 'dropped-container-supply-drop',
            layout: 'vbox',
            zIndex: '200',
            scrollable: 'y',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    scrollable: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            defaults: {
                                clearable: false,
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                                listeners: {
                                    blur: function (me) {
                                        let record = me.upVM().get('suppliesGrid.selection'),
                                            object_record = me.upVM().get('object_record');
                                        record.getProxy().setExtraParams({
                                            portcall_id: object_record.get('id'),
                                        });
                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'default.expense.items.combo',
                                    label: 'Service',
                                    testId: 'suppliesRightCardServiceTypeCombo',
                                    placeholder: 'Choose type',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    itemCls: 'a-disb-costs-combo',
                                    required: true,
                                    reference: 'selectedServiceType',
                                    slug: 'portcallServices',
                                    bind: {
                                        value: '{suppliesGrid.selection.default_expense_item_id}',
                                        inputValue: '{suppliesGrid.selection.default_expense_item_name}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        objectPermission: '{objectPermissions}',
                                        store: '{expenseItems}',
                                        permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        select: function (me, selection) {
                                            if (selection) {
                                                let record = me.upVM().get('suppliesGrid.selection');
                                                record.set('default_expense_item_name', selection.get('name'));
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'accounts.combo',
                                    forceSelection: true,
                                    disabled: true,
                                    placeholder: 'Choose Billing party',
                                    testId: 'suppliesRightCardBillingPartyCombo',
                                    slug: 'portcallServices',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    floatedPicker: {
                                        minWidth: 220,
                                    },
                                    // required: true,
                                    label: 'Billing party',
                                    reference: 'accountsCombo',
                                    bind: {
                                        value: '{suppliesGrid.selection.account_id}',
                                        permission: '{userPermissions}',
                                        store: '{disbursementsBillToStore}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                    },
                                    listeners: {
                                        select: function (me, selection) {
                                            if (selection) {
                                                let record = me.upVM().get('suppliesGrid.selection');
                                                if (record) {
                                                    record.set('account_name', selection.get('org_name'));
                                                }
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Disbursement ID',
                                    testId: 'suppliesRightCardDisbursementIdCombo',
                                    disabled: true,
                                    placeholder: 'Choose ',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    ui: 'viewonly classic',
                                    readOnly: true,
                                    bind: {
                                        inputValue:
                                            '{suppliesGrid.selection.disbursement_id ? "#"+suppliesGrid.selection.disbursement_id:"---"}',
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Account',
                                    testId: 'suppliesRightCardAccountCombo',
                                    editable: true,
                                    placeholder: 'Choose ',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    slug: 'portcallServices',
                                    options: ['Owners costs', 'Charterers costs', 'Shippers costs', 'Agents costs'],
                                    bind: {
                                        value: '{suppliesGrid.selection.account_of}',
                                        inputValue: '{suppliesGrid.selection.account_of}',
                                        permission: '{userPermissions}',
                                        disabled: '{lockedField}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'divider divider-offset offset-x24',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'unit.field',
                                    padding: '4 0',
                                    label: 'Quantity',
                                    testId: 'suppliesRightCardQuantityField',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    labelAlign: 'left',
                                    slug: 'portcallServices',
                                    subObject: 'supply',
                                    matchFieldWidth: true,
                                    bind: {
                                        value: '{suppliesGrid.selection.quantity}',
                                        valueUnit: '{suppliesGrid.selection.quantity_unit}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        hidden: '{selectedServiceType.selection.amount == 1 ? true:false}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                        disabled: '{lockedField}',
                                        options: '{defaultServiceUnits}',
                                        unitFilter: '{selectedServiceType.selection.type.default_units_id}',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    margin: '4 0',
                                    hidden: true,
                                    defaults: {
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                    },
                                    bind: {
                                        hidden: '{selectedServiceType.selection.amount == 1 ? false:true}',
                                    },
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            label: 'Quantity',
                                            testId: 'suppliesRightCardQuantityField',
                                            placeholder: '0,000.00',
                                            cls: 'a-prepend a-field-icon icon-short icon-rounded',
                                            flex: 3.5,
                                            slug: 'portcallServices',
                                            bind: {
                                                value: '{suppliesGrid.selection.quantity}',
                                                disabled: '{lockedField}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'common-combo-currency',
                                            flex: 1,
                                            label: '',
                                            placeholder: 'Currency',
                                            testId: 'suppliesRightCardCurrencyCombo',
                                            forceSelection: true,
                                            cls: 'a-append',
                                            // store: [],
                                            bind: {
                                                value: '{suppliesGrid.selection.quantity_unit}',
                                                // store: '{currencyRateStore}',
                                                disabled: '{lockedField}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'abraxa.pricefield',
                                    placeholder: '0,000.00',
                                    label: 'Estimated price',
                                    testId: 'suppliesRightCardEstimatedPriceField',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    slug: 'portcallServices',
                                    bind: {
                                        value: '{suppliesGrid.selection.pda_price}',
                                        permission: '{userPermissions}',
                                        disabled: '{lockedField}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                    },
                                },
                                {
                                    xtype: 'abraxa.pricefield',
                                    placeholder: '0,000.00',
                                    label: 'Invoice amount',
                                    testId: 'suppliesRightCardInvoiceAmountField',
                                    disabled: true,
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    bind: {
                                        value: '{invoiceAmount}',
                                        permission: '{userPermissions}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                    },
                                },
                                {
                                    xtype: 'organization.combo',
                                    placeholder: 'Choose Company',
                                    label: 'Vendor',
                                    testId: 'suppliesRightCardVendorCombo',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    slug: 'portcallServices',
                                    subObject: 'supply',
                                    floatedPicker: {
                                        minWidth: 330,
                                        viewModel: {
                                            data: {
                                                showSuggested: true,
                                            },
                                        },
                                    },
                                    bind: {
                                        value: '{suppliesGrid.selection.vendor_id}',
                                        inputValue: '{suppliesGrid.selection.vendor_name}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                        disabled: '{lockedField}',
                                    },
                                    listeners: {
                                        select: function (me, selection) {
                                            if (selection) {
                                                let record = me.upVM().get('suppliesGrid.selection');
                                                record.set('vendor_name', selection.get('org_name'));
                                            }
                                        },
                                        clearicontap: function () {
                                            let record = this.upVM().get('suppliesGrid.selection');
                                            record.set('vendor_name', null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'combobox',
                                    label: 'Place',
                                    testId: 'suppliesRightCardPlaceCombo',
                                    slug: 'portcallServices',
                                    subObject: 'supply',
                                    placeholder: 'Choose',
                                    queryMode: 'local',
                                    labelAlign: 'left',
                                    valueField: 'id',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-place icon-rounded non-editable',
                                    displayField: 'name',
                                    editable: false,
                                    clearable: false,
                                    store: [],
                                    bind: {
                                        value: '{suppliesGrid.selection.place_id}',
                                        store: '{places}',
                                        inputValue: '{suppliesGrid.selection.place_name}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                        disabled: '{lockedField}',
                                    },
                                    listeners: {
                                        select: function (me, selection) {
                                            if (selection) {
                                                let record = me.upVM().get('suppliesGrid.selection');
                                                record.set('place_name', selection.get('name'));
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'abraxa.datetimefield',
                                    label: 'Date',
                                    testId: 'suppliesRightCardDateField',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-time icon-rounded',
                                    slug: 'portcallServices',
                                    subObject: 'supply',
                                    bind: {
                                        dateTime: '{suppliesGrid.selection.date}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                        disabled: '{lockedField}',
                                    },
                                },
                                {
                                    xtype: 'organization.combo',
                                    placeholder: 'Choose Company',
                                    label: 'Delivered by',
                                    testId: 'suppliesRightCardDeliveredByCombo',
                                    slug: 'portcallServices',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    subObject: 'supply',
                                    hidden: true,
                                    floatedPicker: {
                                        minWidth: 330,
                                    },
                                    bind: {
                                        value: '{suppliesGrid.selection.delivered_by}',
                                        inputValue: '{suppliesGrid.selection.delivered_by_name}',
                                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 9 || selectedServiceType.selection.default_expense_item_type_id == 15 ? false:true}', // 9,15 = bunkers,supplies
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                        disabled: '{lockedField}',
                                    },
                                    listeners: {
                                        select: function (me, selection) {
                                            if (selection) {
                                                let record = me.upVM().get('suppliesGrid.selection');
                                                if (record) {
                                                    record.set('delivered_by_name', selection.get('org_name'));
                                                }
                                            }
                                        },
                                        clearicontap: function () {
                                            let record = this.upVM().get('suppliesGrid.selection');
                                            record.set('delivered_by_name', null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    label: 'Dimensions',
                                    testId: 'suppliesRightCardDimensionsField',
                                    placeholder: 'Enter dimensions',
                                    hidden: true,
                                    subObject: 'supply',
                                    slug: 'portcallServices',
                                    bind: {
                                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 15 ? false:true}', // 15 = supplies
                                        value: '{suppliesGrid.selection.dimensions}',
                                        readOnly: '{nonEditable ? true : false}',
                                        objectPermission: '{objectPermissions}',
                                        disabled: '{lockedField}',
                                        permission: '{userPermissions}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    label: 'AWB number',
                                    testId: 'suppliesRightCardAwbNumberField',
                                    placeholder: 'Enter AWB number',
                                    subObject: 'supply',
                                    hidden: true,
                                    slug: 'portcallServices',
                                    bind: {
                                        readOnly: '{nonEditable ? true : false}',
                                        value: '{suppliesGrid.selection.awb_number}',
                                        objectPermission: '{objectPermissions}',
                                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 15 ? false:true}', // 15 = supplies
                                        disabled: '{lockedField}',
                                        permission: '{userPermissions}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    label: 'Customs number',
                                    placeholder: 'Customs number',
                                    testId: 'suppliesRightCardCustomsNumberField',
                                    subObject: 'supply',
                                    slug: 'portcallServices',
                                    hidden: true,
                                    bind: {
                                        value: '{suppliesGrid.selection.customs_document_number}',
                                        readOnly: '{nonEditable ? true : false}',
                                        objectPermission: '{objectPermissions}',
                                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 15 ? false:true}', // 15 = supplies
                                        disabled: '{lockedField}',
                                        permission: '{userPermissions}',
                                    },
                                },
                                {
                                    xtype: 'unit.field',
                                    padding: '4 0',
                                    label: 'Ordered quantity',
                                    testId: 'suppliesRightCardOrderedQuantityField',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    slug: 'portcallServices',
                                    labelAlign: 'left',
                                    subObject: 'supply',
                                    hidden: true,
                                    bind: {
                                        value: '{suppliesGrid.selection.ordered_quantity}',
                                        valueUnit: '{suppliesGrid.selection.ordered_unit}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        hidden: '{selectedServiceType.selection.default_expense_item_type_id == 9 ? false:true}', // 9 = bunkers
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                        disabled: '{lockedField}',
                                        options: '{defaultServiceUnits}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra',
                    // slug: 'portcallSupplyAttachments',
                    // bind: {
                    //     permission: '{userPermissions}',
                    // },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Invoices',
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    multiple: true,
                                    accept: '.pdf',
                                    text: 'Add invoice',
                                    testId: 'suppliesRightCardAddInvoiceBtn',
                                    ui: 'normal small',
                                    iconCls: 'md-icon-outlined md-icon-add',
                                    name: 'files',
                                    slug: 'portcallInvoiceCreate',
                                    subObject: 'disbursements',
                                    hidden: true,
                                    bind: {
                                        cls: '{nonEditable ? "hidden" : ""}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                        hidden: '{invoices.count ? false : true}',
                                    },
                                    handler: function (me) {
                                        let expense = me.upVM().get('suppliesGrid.selection');
                                        Ext.create('Abraxa.view.adocs.CreateFinancialPopup', {
                                            viewModel: {
                                                parent: me.upVM(),
                                                data: {
                                                    object_record: this.upVM().get('object_record'),
                                                    expense: expense,
                                                    currentUser: this.upVM().get('currentUser'),
                                                    userPermissions: this.upVM().get('userPermissions'),
                                                    fromSupply: true,
                                                },
                                            },
                                        }).show();
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-attachments-list',
                            testId: 'suppliesRightCardInvoicesList',
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            minHeight: 240,
                            emptyText: {
                                xtype: 'container',
                                zIndex: 999,
                                layout: {
                                    type: 'vbox',
                                },
                                centered: true,
                                items: [
                                    {
                                        xtype: 'div',
                                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 124 124"><g transform="translate(-9717 -19083)"><g transform="translate(8883 18738)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9005.988 19065.16)"><path d="M776.7,44.84h-19.84a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5h-14.36a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M775.662,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M761.083,83.667h15.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-15.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,83.667Z" fill="#c8d4e6"></path><path d="M761.083,91.187h5.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-5.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,91.187Z" fill="#c8d4e6"></path><path d="M761.083,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652H761.083a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,76.147Z" fill="#c8d4e6"></path><path d="M805.134,97.521a9.366,9.366,0,0,0-17.5-2.5,7.5,7.5,0,0,0,.813,14.95H804.7a6.232,6.232,0,0,0,.437-12.45Zm-6.687,3.7v5h-5v-5H789.7l6.25-6.25,6.25,6.25Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt"><span class="fs-13">Drop files or use the button.</span></div></div>',
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'center',
                                        },
                                        items: [
                                            {
                                                xtype: 'button',
                                                // flex: 1,
                                                multiple: true,
                                                accept: '.pdf',
                                                text: 'Add invoice',
                                                testId: 'suppliesRightCardAddInvoiceBtn',
                                                ui: 'action',
                                                iconCls: 'md-icon-outlined md-icon-add',
                                                name: 'files',
                                                subObject: 'disbursements',
                                                slug: 'portcallInvoiceCreate',
                                                bind: {
                                                    cls: '{nonEditable ? "hidden" : ""}',
                                                    objectPermission: '{objectPermissions}',
                                                    permission: '{userPermissions}',
                                                },
                                                handler: function (me) {
                                                    let expense = me.upVM().get('suppliesGrid.selection');
                                                    Ext.create('Abraxa.view.adocs.CreateFinancialPopup', {
                                                        viewModel: {
                                                            parent: me.upVM(),
                                                            data: {
                                                                object_record: this.upVM().get('object_record'),
                                                                expense: expense,
                                                                currentUser: this.upVM().get('currentUser'),
                                                                userPermissions: this.upVM().get('userPermissions'),
                                                                fromSupply: true,
                                                            },
                                                        },
                                                    }).show();
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            emptyTextDefaults: {
                                xtype: 'emptytext',
                                cls: 'a-empty-text',
                            },
                            itemConfig: {
                                cls: 'a-attachment-item',
                                minWidth: 0,
                                layout: {
                                    type: 'hbox',
                                    pack: 'space-between',
                                },
                            },
                            bind: {
                                store: '{invoices}',
                                itemTpl: '{itemTemplate}',
                            },

                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'div.a-attachment,i.remove_attachment',
                                    fn: function (cmp, a) {
                                        let vm = this.component.upVM(),
                                            supply = this.component.upVM().get('suppliesGrid.selection');
                                        var record = this.component.getSelection();
                                        if (cmp.currentTarget.className == 'a-attachment') {
                                            if (record) {
                                                Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            selectVoucher: record,
                                                            account_id: supply.get('account_id'),
                                                            accounts: vm.get('accounts'),
                                                            nonEditable: vm.get('nonEditable'),
                                                        },
                                                        formulas: {
                                                            selectedVoucher: {
                                                                bind: {
                                                                    bindTo: '{vouchersList.selection}',
                                                                    deep: true,
                                                                },
                                                                get: function (record) {
                                                                    if (record) {
                                                                        return record;
                                                                    }
                                                                },
                                                            },
                                                            loadDodument: {
                                                                bind: {
                                                                    bindTo: '{vouchersList.selection.id}',
                                                                    // deep: true
                                                                },
                                                                get: function (id) {
                                                                    let record = this.get('vouchersList.selection');
                                                                    if (record) {
                                                                        Ext.ComponentQuery.query(
                                                                            '[cls~=pdf-preview]'
                                                                        )[0].setMasked(true);
                                                                        var me = this;
                                                                        let file = record.getDocument(),
                                                                            pdf = record.get('pdf') ? true : false;

                                                                        // return me.getView().getController().previewFile(file);

                                                                        me.getView()
                                                                            .getController()
                                                                            .loadDocument(
                                                                                Env.ApiEndpoint +
                                                                                    'get_pdf/' +
                                                                                    file.get('id')
                                                                            );

                                                                        // if (!pdf) {
                                                                        //     record.loadPDF2().then(function (blob) {
                                                                        //         let test = {
                                                                        //             blob: blob,
                                                                        //             name: record.get('name') + '.' + file.get('extension')
                                                                        //         }
                                                                        //         me.getView().getController().loadDocument(test);
                                                                        //     });
                                                                        // } else {
                                                                        //
                                                                        //     let blob = record.get('pdf');
                                                                        //     let test = {
                                                                        //         blob: blob,
                                                                        //         name: record.get('name') + '.' + file.get('extension')
                                                                        //     }
                                                                        //     me.getView().getController().loadDocument(test);
                                                                        // }
                                                                    }
                                                                },
                                                            },
                                                            canEditPerm: {
                                                                bind: {
                                                                    bindTo: '{disbursementRecord}',
                                                                    deep: true,
                                                                },
                                                                get: function (record) {
                                                                    if (record) {
                                                                        let objectPermissions =
                                                                                this.get('objectPermissions'),
                                                                            nonEditable = this.get('nonEditable'),
                                                                            store = this.get('userPermissions'),
                                                                            result = false;
                                                                        if (record.get('is_locked')) {
                                                                            return false;
                                                                        } else {
                                                                            if (!nonEditable) {
                                                                                if (
                                                                                    store &&
                                                                                    Object.keys(store).length > 0
                                                                                ) {
                                                                                    let record = store['disbursements'];
                                                                                    if (record && record.edit) {
                                                                                        return true;
                                                                                    } else {
                                                                                        return false;
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                if (
                                                                                    objectPermissions &&
                                                                                    objectPermissions['disbursements']
                                                                                ) {
                                                                                    if (
                                                                                        objectPermissions[
                                                                                            'disbursements'
                                                                                        ].can_edit
                                                                                    ) {
                                                                                        result = true;
                                                                                        if (
                                                                                            store &&
                                                                                            Object.keys(store).length >
                                                                                                0
                                                                                        ) {
                                                                                            let record =
                                                                                                store['disbursements'];
                                                                                            if (
                                                                                                record &&
                                                                                                !record.edit
                                                                                            ) {
                                                                                                result = false;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                return result;
                                                                            }
                                                                        }
                                                                    } else {
                                                                        return false;
                                                                    }
                                                                },
                                                            },
                                                            dragListeners: {
                                                                bind: {
                                                                    bindTo: '{userPermissions}',
                                                                    deeP: true,
                                                                },
                                                                get: function (store) {
                                                                    if (store && Object.keys(store).length > 0) {
                                                                        let record = store['portcallInvoiceCreate'];
                                                                        if (record && record.edit) {
                                                                            return {
                                                                                element: 'element',
                                                                                drop: 'onDrop',
                                                                                dragleave: 'onDragLeaveListItem',
                                                                                dragover: 'onDragOverListItem',
                                                                            };
                                                                        } else {
                                                                            return {};
                                                                        }
                                                                    } else {
                                                                        return {};
                                                                    }
                                                                },
                                                            },
                                                            nonEditableForSharing: {
                                                                bind: {
                                                                    bindTo: '{member}',
                                                                    deep: true,
                                                                },
                                                                get: function (member) {
                                                                    if (member && member.get('role') == 'can edit') {
                                                                        this.set('nonEditable', false);
                                                                    }
                                                                },
                                                            },
                                                        },
                                                    },
                                                }).show();
                                            }
                                        }
                                        if (cmp.currentTarget.className.indexOf('remove_attachment') !== -1) {
                                            if (record) {
                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete this invoice?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.ComponentQuery.query(
                                                                window.CurrentUser.get('company').type +
                                                                    'portcall\\.main'
                                                            )[0]
                                                                .getController()
                                                                .deleteVouchers([record]);
                                                        }
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                            testId: 'suppliesRightCardDeleteInvoiceNoBtn',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                            separator: true,
                                                            testId: 'suppliesRightCardDeleteInvoiceYesBtn',
                                                        },
                                                    ]
                                                );
                                            }
                                        }
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-tasks',
                    hidden: true,
                    slug: 'task',
                    bind: {
                        hidden: '{objectTasks.count ? false : true}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            minHeight: 120,
                            testId: 'suppliesRightCardTasksList',
                            bind: {
                                store: '{objectTasks}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-comments',
                    slug: 'portcallNotes',
                    testId: 'suppliesRightCardNotesContainer',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            testId: 'suppliesRightCardCommentsList',
                            minHeight: 120,
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    docked: 'bottom',
                    slug: 'portcallNotes',
                    testId: 'suppliesRightCardCommentsInput',
                    bind: {
                        hidden: '{object_record.is_archived ? true : false}',
                        permission: '{userPermissions}',
                        viewModel: {
                            data: {
                                comments: '{comments}',
                                record: '{suppliesGrid.selection}',
                            },
                        },
                    },
                },
            ],
            bind: {
                listeners: '{dragListeners}',
            },
        },
    ],
});

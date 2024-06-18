import './ConvertDisbursement';
import '../payments/PaymentsListRightCardsDisbursement';

Ext.define('Abraxa.view.portcall.disbursements.DisbursementRightCard', {
    extend: 'Ext.Container',
    xtype: 'disbursement-right-card',
    testId: 'disbursementRightCard',
    cls: 'a-right-container a-disbursements-right-container',
    controller: 'disbursements.uploadcontroller',
    hidden: true,
    bind: {
        hidden: '{selectedDisbursement ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        data: {
            objectPayments: Ext.create('Ext.data.Store', {
                data: [],
            }),
        },
        stores: {
            comments: {
                source: '{notes}',
                filters: '{noteFilter}',
            },
            objectTasks: {
                source: '{tasks}',
                filters: '{taskFilter}',
            },
            approvals: {
                source: '{selectedDisbursement.approvals}',
                extraParams: {
                    disbursement_id: '{selectedDisbursement.id}',
                },
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
            },
            internalApprovals: {
                source: '{selectedDisbursement.approvals}',
                groupField: 'to_company_id',
                extraParams: {
                    disbursement_id: '{selectedDisbursement.id}',
                },
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
                filters: '{internalApprovalFilter}',
            },

            externalApprovals: {
                source: '{selectedDisbursement.approvals}',
                groupField: 'from_company_id',
                extraParams: {
                    disbursement_id: '{selectedDisbursement.id}',
                },
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
                filters: '{externalApprovalFilter}',
            },
            relatedDocuments: {
                source: '{documents}',
                filters: '{disbursementDocumentFilter}',
            },
        },
        formulas: {
            setObjectPayments: {
                bind: {
                    bindTo: '{selectedDisbursement}',
                },
                get: function (selectedDisbursement) {
                    const vm = this;
                    if (!selectedDisbursement) return;
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'disbursement/' + selectedDisbursement.get('id') + '/payments',
                        method: 'GET',
                        success: function (response, opts) {
                            vm.get('objectPayments').loadData(Ext.decode(response.responseText).data);
                        },
                    });
                },
            },
            disbursementDocumentFilter: {
                bind: {
                    bindTo: '{selectedDisbursement}',
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('relatedDocuments');
                        if (store) store.clearFilter();

                        return function (document) {
                            if (
                                document.get('documentable_id') == record.get('id') &&
                                document.get('documentable_type') == record.get('model_name')
                            ) {
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
            paymentsFilter: {
                bind: {
                    bindTo: '{selectedDisbursement}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('objectPayments');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('paymentable_type') === record.get('model_name') &&
                                rec.get('disbursement_group_id') === record.get('group_id')
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
            noteFilter: {
                bind: {
                    bindTo: '{selectedDisbursement}',
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
                    bindTo: '{selectedDisbursement}',
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
            balanceRender: {
                bind: {
                    bindTo: '{selectedDisbursement}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let value = record.get('balance'),
                            currentUserType = this.get('currentUserType'),
                            colorCls = '';
                        if (currentUserType == 'agent') {
                            if (Ext.isNumber(value)) {
                                if (Ext.Number.sign(value) === -1) {
                                    colorCls = 'a-positive-value';
                                }
                                if (Ext.Number.sign(value) === 1) {
                                    colorCls = 'a-negative-value';
                                }
                            }
                        } else {
                            if (Ext.isNumber(value)) {
                                if (Ext.Number.sign(value) === -1) {
                                    colorCls = 'a-negative-value';
                                }
                                if (Ext.Number.sign(value) === 1) {
                                    colorCls = 'a-positive-value';
                                }
                            }
                        }
                        return (
                            '<div class="a-cell-amount ' +
                            colorCls +
                            '">' +
                            record.get('disbursement_currency') +
                            ' ' +
                            Ext.util.Format.number(Math.abs(value), '0,000.00') +
                            '<small class="c-grey fw-n">&nbsp;' +
                            (colorCls == 'a-positive-value'
                                ? '(credit)'
                                : colorCls == 'a-negative-value'
                                  ? '(debit)'
                                  : '') +
                            '</small></div>'
                        );
                    }
                },
            },
            paymentsReceivedTotal: {
                bind: {
                    bindTo: '{objectPayments}',
                    deep: true,
                },
                get: function (store) {
                    let total = 0;
                    store.each(function (rec) {
                        if (rec.get('kind') === 'incoming') total += rec.get('calculated_amount');
                    });
                    return total;
                },
            },
            paymentsReceivedDA: {
                bind: {
                    bindTo: '{objectPayments}',
                    deep: true,
                },
                get: function (store) {
                    let total = 0,
                        selectedDisbursement = this.get('selectedDisbursement');
                    if (selectedDisbursement) {
                        store.each(function (rec) {
                            if (
                                rec.get('kind') === 'incoming' &&
                                rec.get('paymentable_type') === selectedDisbursement.get('model_name') &&
                                rec.get('paymentable_id') === selectedDisbursement.get('id')
                            ) {
                                total += rec.get('calculated_amount');
                            }
                        });
                    }
                    return total;
                },
            },
            internalApprovalFilter: {
                bind: {
                    bindTo: '{currentUser.company.id}',
                },
                get: function (companyId) {
                    let store = this.get('internalApprovals');

                    if (store) store.clearFilter();

                    if (companyId) {
                        return function (record) {
                            if (record.get('from_company_id') == companyId) {
                                return true;
                            }
                        };
                    } else {
                        return function (record) {
                            return false;
                        };
                    }
                },
            },
            externalApprovalFilter: {
                bind: {
                    bindTo: '{currentUser.company.id}',
                },
                get: function (companyId) {
                    let store = this.get('externalApprovals');

                    if (store) store.clearFilter();

                    if (companyId) {
                        return function (record) {
                            if (record.get('to_company_id') == companyId) {
                                return true;
                            }
                        };
                    } else {
                        return function (record) {
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
            testId: 'disbursementRightCardTitleBar',
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
                            testId: 'disbursementRightCardTitle',
                            bind: {
                                title: '<div class="a-badge a-badge-financial"><span class="file-icon-badge file-icon-x32" data-type="{selectedDisbursement.type}" data-icon="money"></span></div><div><span class="a-panel-title">{selectedDisbursement.name}</span><span class="a-panel-id">#{selectedDisbursement.group_id}</span></div>',
                            },
                        },
                        {
                            xtype: 'container',
                            subObject: 'disbursements',
                            testId: 'disbursementRightCardDisbursementsContainer',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 12',
                                    ui: 'status default',
                                    slug: 'portcallDisbursementStatus',
                                    testId: 'disbursementRightCardPortcallDisbursementStatusBtn',
                                    bind: {
                                        cls: 'status-{selectedDisbursement.status}',
                                        text: '{selectedDisbursement.status:capitalize}',
                                        hidden: '{!disableDelete}',
                                        permission: '{userPermissions}',
                                    },
                                    menu: {
                                        defaults: {
                                            handler: function (me) {
                                                let selection = me.upVM().get('selectedDisbursement');
                                                if (selection) {
                                                    selection.set('status', me.value);
                                                }
                                                if (selection.dirty) {
                                                    selection.save({
                                                        success: function () {
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
                                            viewModel: {
                                                formulas: {
                                                    disableStatusButton: function (get) {
                                                        return (
                                                            get('selectedDisbursement.status') ===
                                                            this.getView().getText().toLowerCase()
                                                        );
                                                    },
                                                },
                                            },
                                        },
                                        items: [
                                            {
                                                text: AbraxaConstants.buttons.text.draft,
                                                value: AbraxaConstants.buttons.text.draft.toLowerCase(),
                                                bind: {
                                                    disabled: '{disableStatusButton}',
                                                },
                                            },
                                            {
                                                text: AbraxaConstants.buttons.text.submitted,
                                                value: AbraxaConstants.buttons.text.submitted.toLowerCase(),
                                                bind: {
                                                    disabled: '{disableStatusButton}',
                                                },
                                            },
                                            {
                                                text: AbraxaConstants.buttons.text.pendingApproval,
                                                value: AbraxaConstants.buttons.text.pendingApproval.toLowerCase(),
                                                bind: {
                                                    disabled: '{disableStatusButton}',
                                                },
                                            },
                                            {
                                                text: AbraxaConstants.buttons.text.approved,
                                                value: AbraxaConstants.buttons.text.approved.toLowerCase(),
                                                bind: {
                                                    disabled: '{disableStatusButton}',
                                                },
                                            },
                                            {
                                                text: AbraxaConstants.buttons.text.completed,
                                                value: AbraxaConstants.buttons.text.completed.toLowerCase(),
                                                bind: {
                                                    disabled: '{disableStatusButton}',
                                                },
                                            },
                                            {
                                                text: AbraxaConstants.buttons.text.settled,
                                                value: AbraxaConstants.buttons.text.settled.toLowerCase(),
                                                bind: {
                                                    disabled: '{disableStatusButton}',
                                                    hidden: '{selectedDisbursement.type == "fda" || selectedDisbursement.type == "sda" ? false : true}',
                                                },
                                            },
                                            {
                                                text: AbraxaConstants.buttons.text.rejected,
                                                value: AbraxaConstants.buttons.text.rejected.toLowerCase(),
                                                separator: true,
                                                bind: {
                                                    disabled: '{disableStatusButton}',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 0 12',
                            testId: 'disbursementRightCardStatusBadgeDiv',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                html: '<div class="a-status-badge status-xl status-{selectedDisbursement.status}">{selectedDisbursement.status:capitalize}</div>',
                                hidden: '{disableDelete}',
                            },
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 0 12',
                            testId: 'disbursementRightCardStatusBadgePrincipleDiv',
                            bind: {
                                html: '<div class="a-status-badge status-xl status-{selectedDisbursement.status}">{selectedDisbursement.status:capitalize}</div>',
                                hidden: '{showBadgeForPrincipal}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    testId: 'disbursementRightCardActionsContainer',
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
                            testId: 'disbursementRightCardAddTaskBtn',
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

                                let record = this.upVM().get('selectedDisbursement'),
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
                                                    .get('selectedDisbursement')
                                                    .get('model_name'),
                                                taskable_id: this.upVM().get('selectedDisbursement').get('id'),
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
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-attach-money',
                            slug: 'portcallPayments',
                            testId: 'disbursementRightCardPortcallPaymentsBtn',
                            hidden: true,
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{nonEditable ? true : false}',
                                objectPermission: '{objectPermissions}',
                            },
                            arrow: false,
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add payment',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            menu: {
                                defaults: {
                                    handler: function (me) {
                                        let object_record = me.upVM().get('object_record'),
                                            disbursement = me.upVM().get('selectedDisbursement'),
                                            account = me.upVM().get('selectedAccount'),
                                            payment = Ext.create('Abraxa.model.payment.Payment', {
                                                owner_id: object_record.get('id'),
                                                owner_type: object_record.get('model_name'),
                                                account_id: account ? account.get('id') : null,
                                                org_id: account ? account.get('org_id') : null,
                                                org_name: account ? account.get('org_name') : null,
                                                currency: account
                                                    ? account.get('account_currency')
                                                    : me.upVM().get('currentCompany').get('default_currency'),
                                                account_currency: account ? account.get('account_currency') : null,
                                                from_exchange_rate: 1,
                                                to_exchange_rate: 1,
                                                paymentable_id: disbursement.get('id'),
                                                paymentable_type: disbursement.get('model_name'),
                                                amount: disbursement.get('total_costs'),
                                            });
                                        payment.set('kind', me.paymentType);
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .addPayment(me, payment);
                                    },
                                },
                                items: [
                                    {
                                        iconCls: 'md-icon-add c-green-500',
                                        text: 'Incoming Payment',
                                        paymentType: 'incoming',
                                    },
                                    {
                                        iconCls: 'md-icon-remove c-red',
                                        text: 'Outgoing Payment',
                                        paymentType: 'outgoing',
                                    },
                                    {
                                        iconCls: 'md-icon-credit-score md-icon-outlined c-yellow-500',
                                        text: 'Request Payment',
                                        paymentType: 'requested',
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-more-horiz',
                            ui: 'round tool-round-md',
                            arrow: false,
                            subObject: 'disbursements',
                            testId: 'disbursementRightCardMoreActionsBtn',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
                            menu: {
                                items: [
                                    {
                                        ui: 'success',
                                        iconCls: 'md-icon-outlined md-icon-check-circle',
                                        text: 'Request approval',
                                        testId: 'disbursementRightCardRequestApprovalBtn',
                                        slug: 'portcallDisbursementRequestApproval',
                                        subObject: 'disbursements',
                                        bind: {
                                            // hidden: '{nonEditable ? true : false}',
                                            disabled: '{selectedDisbursement.status != "draft" ? true : false}',
                                            objectPermission: '{objectPermissions}',
                                            permission: '{userPermissions}',
                                        },
                                        handler: function () {
                                            Ext.create('Abraxa.view.approval.SendForApprovalDialog', {
                                                viewModel: {
                                                    parent: this.upVM(),
                                                    data: {
                                                        selectedRecords: [
                                                            this.upVM().get('disbursementsGrid.selection'),
                                                        ],
                                                        approvalMembers: this.upVM().get('disbursementSectionMembers'),
                                                    },
                                                },
                                            }).show();
                                            mixpanel.track('Request approval button clicked (Disbursement)');
                                        },
                                    },
                                    {
                                        text: 'Remove label',
                                        testId: 'disbursementRightCardRemoveLabelBtn',
                                        iconCls: 'md-icon-outlined md-icon-label',
                                        hidden: true,
                                        slug: 'portcallDisbursementApplyLabel',
                                        bind: {
                                            permission: '{userPermissions}',
                                            hidden: '{selectedDisbursement.show_tags ? false : true}',
                                        },
                                        handler: function () {
                                            let disbursement = this.upVM().get('selectedDisbursement');

                                            disbursement.set('show_tags', 0);
                                            disbursement.save();
                                        },
                                    },
                                    {
                                        text: 'Apply label',
                                        testId: 'disbursementRightCardApplyLabelBtn',
                                        iconCls: 'md-icon-outlined md-icon-label',
                                        hidden: true,
                                        slug: 'portcallDisbursementApplyLabel',
                                        bind: {
                                            hidden: '{selectedDisbursement.show_tags ? true : false}',
                                            permission: '{userPermissions}',
                                        },
                                        handler: function () {
                                            let disbursement = this.upVM().get('selectedDisbursement');

                                            disbursement.set('show_tags', 1);
                                            disbursement.save();
                                        },
                                    },
                                    {
                                        text: 'Delete',
                                        ui: 'decline',
                                        separator: true,
                                        slug: 'portcallDisbursementDelete',
                                        testId: 'disbursementRightCardPortcallDisbursementDeleteBtn',
                                        bind: {
                                            permission: '{userPermissions}',
                                            disabled: '{!disableDelete}',
                                        },
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        handler: 'deleteDisbursement',
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'disbursementRightCardExpandCloseBtn',
                            handler: function (me) {
                                let grid = Ext.ComponentQuery.query('disbursements\\.grid')[0];

                                grid.deselectAll();
                                me.up('[xtype=disbursement-right-card]').hide();
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
            cls: 'a-disb-info',
            testId: 'disbursementRightCardDisbursementInfoContainer',
            padding: 0,
            flex: 1,
            scrollable: 'y',
            weighted: true,
            items: [
                {
                    xtype: 'container',
                    testId: 'disbursementRightCardDisbursementInfoInnerContainer',
                    cls: 'a-bb-100',
                    padding: '3 24',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                        align: 'middle',
                    },
                    // hidden: true,
                    defaults: {
                        clearable: false,
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                        listeners: {
                            blur: function (me) {
                                let record = me.upVM().get('selectedDisbursement');
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
                            xtype: 'textfield',
                            label: false,
                            clearable: false,
                            placeholder: 'Disbursement name',
                            testId: 'disbursementRightCardDisbursementNameField',
                            ui: 'field-xl no-border classic',
                            required: true,
                            name: 'name',
                            slug: 'portcallDisbursements',
                            bind: {
                                value: '{selectedDisbursement.name}',
                                permission: '{userPermissions}',
                            },
                            padding: 0,
                            flex: 1,
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'blue-light small',
                                    iconCls: 'md-icon-outlined md-icon-upgrade',
                                    slug: 'portcallDisbursementConvertDA',
                                    margin: '0 0 0 16',
                                    subObject: 'disbursements',
                                    text: 'Convert DA',
                                    testId: 'disbursementRightCardConvertDABtn',
                                    bind: {
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                        hidden: '{showConvert ? false : true}',
                                        cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                                    },
                                    menu: {
                                        minWidth: '220',
                                        cls: 'a-menu-convert-disbursement',
                                        defaults: {
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    delegate: 'div.convert',
                                                    fn: function () {
                                                        let disbursement = this.component
                                                                .upVM()
                                                                .get('selectedDisbursement'),
                                                            oldType = disbursement.get('type'),
                                                            newType = this.component.disbursementType,
                                                            newName = this.component.disbursementName,
                                                            items = this.component.upVM().get('disbursementItems'),
                                                            newDisbursement = disbursement.copy(null),
                                                            disbursementStore = this.component
                                                                .upVM()
                                                                .get('disbursements'),
                                                            disbursementsGrid =
                                                                this.component.find('disbursementsGrid');
                                                        if (!items.getCount()) {
                                                            Ext.create('Ext.MessageBox', {
                                                                ui: 'warning',
                                                                title: 'Convert Cancelled',
                                                                innerCls: 'a-bgr-white',
                                                                message: 'Cannot convert disbursements without items.',
                                                                width: 500,
                                                                dataTitle: 'Warning',
                                                                modal: true,
                                                                draggable: false,
                                                                bbar: {
                                                                    manageBorders: false,
                                                                    items: [
                                                                        '->',
                                                                        {
                                                                            xtype: 'button',
                                                                            ui: 'action',
                                                                            text: 'Ok',
                                                                            handler: function () {
                                                                                this.up('dialog').destroy();
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            }).show();
                                                            return;
                                                        }
                                                        newDisbursement.set('name', newName);
                                                        newDisbursement.set('type', newType);
                                                        newDisbursement.set(oldType + '_id', disbursement.get('id'));
                                                        newDisbursement.set('parent_id', disbursement.get('id'));
                                                        mixpanel.track('Convert DA button');
                                                        Ext.create(
                                                            'Abraxa.view.portcall.disbursements.ConvertDisbursement',
                                                            {
                                                                viewModel: {
                                                                    data: {
                                                                        oldDisbursement: disbursement,
                                                                        record: newDisbursement,
                                                                        disbursementStore: disbursementStore,
                                                                        disbursementsGrid: disbursementsGrid,
                                                                        expenses: items,
                                                                    },
                                                                },
                                                            }
                                                        ).show();
                                                    },
                                                },
                                            },
                                        },
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'h5',
                                                margin: '8 16',
                                                testId: 'disbursementRightCardConvertDADiv',
                                                bind: {
                                                    html: 'Convert disbursement',
                                                },
                                            },
                                            {
                                                xtype: 'container',
                                                padding: '8 16',
                                                cls: 'cursor-pointer a-item',
                                                disbursementType: 'dda',
                                                disbursementName: 'Departure DA',
                                                testId: 'disbursementRightCardConvertDDADiv',
                                                bind: {
                                                    hidden: '{selectedDisbursement.type == "dda" || selectedDisbursement.dda_id ? true : false}',
                                                    html: '<div class="hbox convert"><span class="file-icon-badge file-icon-x32" data-type="dda" data-icon="money"></span><b class="fw-b ml-16">Departure DA</b></div>',
                                                },
                                            },
                                            {
                                                xtype: 'container',
                                                padding: '8 16',
                                                text: 'null',
                                                cls: 'cursor-pointer a-item',
                                                disbursementType: 'fda',
                                                disbursementName: 'Final DA',
                                                testId: 'disbursementRightCardConvertFDADiv',
                                                bind: {
                                                    hidden: '{selectedDisbursement.fda_id ? true : false}',
                                                    html: '<div class="hbox convert"><span class="file-icon-badge file-icon-x32" data-type="fda" data-icon="money"></span><b class="fw-b ml-16">Final DA</b></div>',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    xtype: 'button',
                                    ui: 'blue-light small',
                                    iconCls: 'md-icon-outlined md-icon-attach-money',
                                    slug: 'portcallDisbursementCreateSDA',
                                    margin: '0 0 0 16',
                                    subObject: 'disbursements',
                                    text: 'Create SDA',
                                    testId: 'disbursementRightCardCreateSDABtn',
                                    disbursementType: 'sda',
                                    disbursementName: 'Supplementary DA',
                                    hidden: true,
                                    bind: {
                                        cls: '{nonEditable ? "hidden" : ""}',
                                        hidden: '{selectedDisbursement.type != "fda"}',
                                        objectPermission: '{objectPermissions}',
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (btn) {
                                        let disbursement = btn.upVM().get('selectedDisbursement'),
                                            oldType = disbursement.get('type'),
                                            newType = btn.disbursementType,
                                            newName = btn.disbursementName,
                                            items = null,
                                            newDisbursement = disbursement.copy(null),
                                            disbursementStore = btn.upVM().get('disbursements'),
                                            disbursementsGrid = btn.find('disbursementsGrid');

                                        newDisbursement.set('name', newName);
                                        newDisbursement.set('type', newType);
                                        newDisbursement.set(oldType + '_id', disbursement.get('id'));
                                        newDisbursement.set('parent_id', disbursement.get('id'));

                                        Ext.create('Abraxa.view.portcall.disbursements.ConvertDisbursement', {
                                            viewModel: {
                                                data: {
                                                    oldDisbursement: disbursement,
                                                    record: newDisbursement,
                                                    disbursementStore: disbursementStore,
                                                    disbursementsGrid: disbursementsGrid,
                                                    expenses: items,
                                                },
                                            },
                                        }).show();
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '12 24',
                    cls: 'a-bb-100',
                    customComponentHolderId: 'dicbursementRightCardMain',
                    testId: 'disbursementRightCardMainContainer',
                    bind: {
                        customComponents: '{currentCompany.custom_components}',
                    },
                    defaults: {
                        cls: 'a-field-icon icon-short icon-rounded',
                        labelAlign: 'left',
                        ui: 'hovered-border classic',
                        labelWidth: 140,
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                    },
                    items: [
                        {
                            xtype: 'selectfield',
                            label: 'Disbursement type',
                            testId: 'disbursementRightCardDisbursementTypeField',
                            labelAlign: 'left',
                            disabled: true,
                            valueField: 'value',
                            displayField: 'name',
                            ui: 'viewonly classic',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: {
                                value: '{selectedDisbursement.type}',
                            },
                            options: [
                                {
                                    name: 'Proforma DA',
                                    suggested_name: 'Proforma Disbursement Account',
                                    testId: 'disbursementRightCardProformaDAOption',
                                    value: 'pda',
                                },
                                {
                                    name: 'Departure DA',
                                    suggested_name: 'Departure Disbursement Account',
                                    testId: 'disbursementRightCardDepartureDAOption',
                                    value: 'dda',
                                },
                                {
                                    name: 'Final DA',
                                    suggested_name: 'Final Disbursement Account',
                                    testId: 'disbursementRightCardFinalDAOption',
                                    value: 'fda',
                                },
                                {
                                    name: 'Supplementary DA',
                                    suggested_name: 'Supplementary Disbursement Account',
                                    testId: 'disbursementRightCardSupplementaryDAOption',
                                    value: 'sda',
                                },
                            ],
                        },
                        {
                            xtype: 'textfield',
                            ui: 'viewonly classic',
                            cls: 'a-field-icon icon-short icon-rounded',
                            label: 'Disbursement ID',
                            testId: 'disbursementRightCardDisbursementIDField',
                            disabled: true,
                            bind: {
                                value: '{selectedDisbursement.group_id}',
                            },
                        },
                        {
                            xtype: 'selectfield',
                            label: 'Label',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: 'Choose label',
                            testId: 'disbursementRightCardLabelField',
                            queryMode: 'local',
                            valueField: 'tag_name',
                            displayField: 'tag_name',
                            multiSelect: true,
                            forceSelection: true,
                            hidden: true,
                            slug: 'portcallDisbursementApplyLabel',
                            subObject: 'disbursements',
                            bind: {
                                value: '{selectedDisbursement.tags}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                store: '{defaultDisbursementTags}',
                                hidden: '{selectedDisbursement.show_tags ? false : true}',
                                permission: '{userPermissions}',
                                placeholder: '{selectedDisbursement.tags ? null:"Choose label"}',
                                objectPermission: '{objectPermissions}',
                            },
                            listeners: {
                                focusleave: function () {
                                    let disbursement = this.upVM().get('selectedDisbursement');
                                    disbursement.save({
                                        success: function () {
                                            Ext.toast('Record updated');
                                        },
                                    });
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-disb-data',
                    testId: 'disbursementRightCardDisbursementDataContainer',
                    padding: '8 0',
                    defaults: {
                        cls: 'a-data-item',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'DA costs',
                                    testId: 'disbursementRightCardDACostsLabel',
                                },
                                {
                                    xtype: 'div',
                                    flex: 1,
                                    testId: 'disbursementRightCardDACostsDiv',
                                    // cls: 'fw-b',
                                    bind: {
                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{totalFinal:number("0,000.00")}</b>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'DA payments',
                                    testId: 'disbursementRightCardDAPaymentsLabel',
                                },
                                {
                                    xtype: 'div',
                                    flex: 1,
                                    testId: 'disbursementRightCardDAPaymentsDiv',
                                    bind: {
                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{paymentsReceivedDA:number("0,000.00")}</b>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Total payments',
                                    testId: 'disbursementRightCardTotalPaymentsLabel',
                                },
                                {
                                    xtype: 'div',
                                    flex: 1,
                                    testId: 'disbursementRightCardTotalPaymentsDiv',
                                    bind: {
                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{paymentsReceivedTotal:number("0,000.00")}</b>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Balance to be settled',
                                    testId: 'disbursementRightCardBalanceToBeSettledLabel',
                                },
                                {
                                    xtype: 'div',
                                    flex: 1,
                                    testId: 'disbursementRightCardBalanceToBeSettledDiv',
                                    bind: {
                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{totalFinal:number("0,000.00")}</b>',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    slug: 'portCallCrewingAttachments',
                    testId: 'disbursementRightCardPortCallCrewingAttachmentsContainer',
                    hidden: true,
                    cls: 'a-bt-100',
                    bind: {
                        hidden: '{relatedDocuments.count ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Related documents',
                                    testId: 'disbursementRightCardRelatedDocumentsTitle',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-attachments-list',
                            testId: 'disbursementRightCardAttachmentsList',
                            // deselectable: false,
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            itemConfig: {
                                viewModel: {},
                                cls: 'a-attachment-item',
                                minWidth: 0,
                                layout: {
                                    type: 'hbox',
                                    pack: 'space-between',
                                },
                                bind: {
                                    tpl: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.system_extension ? record.system_extension : record.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.name}.{record.extension}</a><span class="sm-title">{record.size}</span></div></div>',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: 'a.file_name',
                                        fn: function (element, a) {
                                            var cmp = this.component,
                                                vm = cmp.upVM(),
                                                selectedFile = vm.get('record'),
                                                documentForSelectId = selectedFile.get('id'),
                                                documents = vm.get('relatedDocuments'),
                                                userPermissions = vm.get('userPermissions');

                                            let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                                                viewModel: {
                                                    data: {
                                                        documentForSelect: documents.getById(documentForSelectId),
                                                        selectedDocuments: documents,
                                                        needsPanel: false,
                                                        members: vm.get('members'),
                                                        isReadOnly: false,
                                                    },
                                                    formulas: {
                                                        selectedDocument: {
                                                            bind: {
                                                                bindTo: '{documentsList.selection}',
                                                            },
                                                            get: function (record) {
                                                                return record;
                                                            },
                                                        },
                                                        loadDocument: {
                                                            bind: {
                                                                bindTo: '{selectedDocument.id}',
                                                                // deep: true
                                                            },
                                                            get: function (id) {
                                                                let record = this.get('selectedDocument');
                                                                if (record) {
                                                                    Ext.ComponentQuery.query(
                                                                        '[cls~=pdf-preview]'
                                                                    )[0].setMasked(true);
                                                                    var me = this;
                                                                    let file = record,
                                                                        pdf = record.get('pdf') ? true : false;

                                                                    me.getView()
                                                                        .getController()
                                                                        .loadDocument(
                                                                            Env.ApiEndpoint +
                                                                                'get_pdf/' +
                                                                                record.get('id')
                                                                        );
                                                                }
                                                            },
                                                        },
                                                    },
                                                },
                                            });
                                            dialog.show();
                                        },
                                    },
                                },
                            },
                            bind: {
                                store: '{relatedDocuments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-approvals-dialog a-approvals',
                    testId: 'disbursementRightCardApprovalsContainer',
                    bind: {
                        hidden: '{internalApprovals.count ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Approvals</span></div>',
                                    testId: 'disbursementRightCardApprovalsTitle',
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.formlist',
                            cls: 'a-documents-approvals-list',
                            testId: 'disbursementRightCardDocumentsApprovalsList',
                            padding: '0 8',
                            bind: {
                                hidden: '{internalApprovals.count ? false:true}',
                                store: '{internalApprovals}',
                            },
                            // variableHeights: true,
                            groupHeader: {
                                tpl: new Ext.XTemplate('<div>{[this.memberName(values.children[0].data)]}</div>', {
                                    memberName: function (record) {
                                        return (
                                            '<div class="party-item"><div class="sm-function"><i class="md-icon md-18">business</i></div><a href="javascript:void(0);" class="sm-company fw-b">' +
                                            record.to_company.name +
                                            '</a><div class="sm-type">' +
                                            record.to_company.email +
                                            '</div></div>'
                                        );
                                    },
                                }),
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        isLast: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                let store = this.get('internalApprovals'),
                                                    groups = store.getGroups().items,
                                                    index,
                                                    res = false;
                                                Ext.Array.each(groups, function (group) {
                                                    if (group.indexOf(record) + 1 == group.count()) res = true;
                                                });
                                                return res;
                                            },
                                        },
                                        resolveNotes: {
                                            bind: {
                                                bindTo: '{record.status}',
                                            },
                                            get: function (status) {
                                                if (status !== 'pending' && this.get('record.notes.resolve')) {
                                                    return (
                                                        '<p>' +
                                                        this.get('record.notes.resolve').join('</p><p>') +
                                                        '</p>'
                                                    );
                                                }
                                                return this.get('record.notes.cancel');
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                testId: 'disbursementRightCardDocumentsApprovalsListItemContainer',
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'container',
                                        bind: {
                                            cls: 'a-approval-item {isLast && record.status == "pending" ? "x-last" : ""}',
                                        },
                                        margin: '0',
                                        testId: 'disbursementRightCardDocumentsApprovalsListItemInnerContainer',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                        },
                                        items: [
                                            {
                                                xtype: 'displayfield',
                                                testId: 'disbursementRightCardDocumentsApprovalsListItemStatusField',
                                                labelAlign: 'top',
                                                flex: 1,
                                                encodeHtml: false,
                                                bind: {
                                                    value: '<div class="approval-text approval-pending">Sent for approval</div>',
                                                    cls: 'a-approval-note a-approval-reason pending',
                                                    html: '<div class="a-approval-em"><em>{record.notes.create}</em></div>',
                                                },
                                            },
                                            {
                                                xtype: 'public.updated.by',
                                                cls: 'a-approval-avatar',
                                                testId: 'disbursementRightCardDocumentsApprovalsListItemUpdatedByField',
                                                bind: {
                                                    data: {
                                                        user: '{record.created_by_user}',
                                                        updated_at: '{record.created_at}',
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'container',
                                        bind: {
                                            cls: 'a-approval-item {record.status != "pending" && isLast ? "x-last" : ""}',
                                        },
                                        testId: 'disbursementRightCardDocumentsApprovalsListItemInnerContainer2',
                                        margin: '0',
                                        items: [
                                            {
                                                xtype: 'container',
                                                testId: 'disbursementRightCardDocumentsApprovalsListItemInnerContainer3',
                                                hidden: true,
                                                flex: 1,
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                },
                                                bind: {
                                                    hidden: '{record.status != "pending" ? false : true}',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'displayfield',
                                                        testId: 'disbursementRightCardDocumentsApprovalsListItemApprovalReasonField',
                                                        labelAlign: 'top',
                                                        flex: 1,
                                                        encodeHtml: false,
                                                        bind: {
                                                            value: '<div class="approval-text approval-{record.status}">{record.status:capitalize}</div>',
                                                            cls: 'a-approval-note a-approval-reason {record.status}',
                                                            html: '<div class="a-approval-em"><em>{resolveNotes}</em></div>',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'public.updated.by',
                                                        cls: 'a-approval-avatar',
                                                        testId: 'disbursementRightCardDocumentsApprovalsListItemUpdatedByDiv',
                                                        hidden: true,
                                                        bind: {
                                                            hidden: '{record.status !== "canceled"}',
                                                            data: {
                                                                user: '{record.updated_by_user}',
                                                                updated_at: '{record.updated_at}',
                                                            },
                                                        },
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        hidden: true,
                                                        cls: 'hbox',
                                                        testId: 'disbursementRightCardDocumentsApprovalsListItemUpdatedAtDiv',
                                                        bind: {
                                                            hidden: '{record.status === "canceled"}',
                                                            html: '<span class="a-link mr-6 fw-b">{record.to_company.name}</span><span class="a-date no_show">{record.updated_at:date("d M y - H:i")}</span>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                hidden: true,
                                                flex: 1,
                                                bind: {
                                                    hidden: '{record.status == "pending" ? false : true}',
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'end',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        ui: 'danger-light small',
                                                        hidden: true,
                                                        bind: {
                                                            hidden: '{record.to_company_id != currentUser.current_company_id && isLast ? false : true}',
                                                        },
                                                        text: 'Cancel request',
                                                        testId: 'disbursementRightCardDocumentsApprovalsListItemCancelRequestBtn',
                                                        margin: '14 14 0 0',
                                                        arrow: false,
                                                        handler: function (me) {
                                                            Ext.create('Abraxa.view.approval.CancelApprovalDialog', {
                                                                viewModel: {
                                                                    data: {
                                                                        approvable: me
                                                                            .upVM()
                                                                            .get('selectedDisbursement'),
                                                                        recordForApproval: me.upVM().get('record'),
                                                                        approvals: me.upVM().get('approvals'),
                                                                    },
                                                                },
                                                            }).show();
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-approvals-dialog a-approvals',
                    testId: 'disbursementRightCardApprovalsDialogContainer',
                    hidden: false,
                    padding: '0 0 16 0',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    bind: {
                        // hidden: '{objectPayments.count ? false : true}',
                        hidden: '{!is_owner}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            padding: '12 24',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Payments</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'PaymentsListRightCardsDisbursement',
                            minHeight: 120,
                            bind: {
                                store: '{objectPayments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-tasks',
                    testId: 'disbursementRightCardPrivateTasksContainer',
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
                                    testId: 'disbursementRightCardPrivateTasksTitle',
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            testId: 'disbursementRightCardPrivateTasksList',
                            minHeight: 120,
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
                    testId: 'disbursementRightCardPrivateCommentsContainer',
                    margin: 0,
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
                                    testId: 'disbursementRightCardPrivateCommentsTitle',
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            testId: 'disbursementRightCardPrivateCommentsList',
                            minHeight: 120,
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    testId: 'disbursementRightCardPrivateCommentsInput',
                    docked: 'bottom',
                    weight: 1,
                    bind: {
                        hidden: '{object_record.is_archived ? true : false}',
                        viewModel: {
                            data: {
                                comments: '{comments}',
                                record: '{selectedDisbursement}',
                            },
                        },
                    },
                },
                {
                    xtype: 'container',
                    docked: 'bottom',
                    cls: 'a-bt-100',
                    weight: 0,
                    padding: '16 24',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            hidden: true,
                            // hideMode: 'opacity',
                            bind: {
                                hidden: '{recordForApproval ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                    },
                                    bind: {
                                        hidden: '{recordForApproval.status == "pending" ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'confirm alt small',
                                            text: 'Approve',
                                            testId: 'disbursementRightCardApproveBtn',
                                            bind: {
                                                hidden: '{!disableDelete}',
                                            },
                                            cls: 'no_show',
                                            handler: function () {
                                                let approvals = this.upVM().get('approvals');
                                                mixpanel.track('Approval (disb screen) - button');
                                                let dialog = Ext.create(
                                                    'Abraxa.view.portcall.documents.DocumentsApproveDialog',
                                                    {
                                                        viewModel: {
                                                            parent: this.upVM(),
                                                        },
                                                    }
                                                );
                                                dialog.getVM().set('approvals', approvals);
                                                dialog.show();
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'danger outlined small',
                                            text: 'Reject',
                                            testId: 'disbursementRightCardRejectBtn',
                                            bind: {
                                                hidden: '{!disableDelete}',
                                            },
                                            cls: 'no_show',
                                            handler: function () {
                                                let approvals = this.upVM().get('approvals');
                                                let dialog = Ext.create(
                                                    'Abraxa.view.portcall.documents.DocumentsRejectDialog',
                                                    {
                                                        viewModel: {
                                                            parent: this.upVM(),
                                                        },
                                                    }
                                                );
                                                dialog.getVM().set('approvals', approvals);
                                                dialog.show();
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            html: '',
                        },
                        {
                            xtype: 'button',
                            ui: 'action solid',
                            text: 'View disbursement',
                            testId: 'disbursementRightCardViewDisbursementBtn',
                            handler: function () {
                                this.upVM().set('showDetails', true);
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

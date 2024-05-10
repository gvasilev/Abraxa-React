Ext.define('Abraxa.view.wpsfinancial.RightCard', {
    extend: 'Ext.Container',
    xtype: 'wps.financial.right.card',
    testId: 'wpsFinancialRightCard',
    cls: 'a-right-container a-summary-left-container a-disbursements-right-container a-wps-disbursements-right-container',
    hidden: true,
    bind: {
        hidden: '{selectedDisbursement ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        stores: {
            comments: {
                source: '{selectedDisbursement.notes}',
                extraParams: {
                    object_meta_id: '{selectedDisbursement.portcall.id}',
                    object_id: 3,
                },
            },
            tasks: {
                source: '{selectedDisbursement.tasks}',
            },
            payments: {
                source: '{selectedDisbursement.payments}',
            },
            members: {
                source: '{selectedDisbursement.members}',
            },
            internalApprovals: {
                source: '{selectedDisbursement.approvals}',
                groupField: 'assigned_company_id',
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
                extraParams: {
                    model_id: '{selectedDisbursement.id}',
                    model: '{selectedDisbursement.model_name}',
                },
                filters: '{internalApprovalFilter}',
            },
            externalApprovals: {
                source: '{selectedDisbursement.approvals}',
                groupField: 'assigned_company_id',
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
                extraParams: {
                    model_id: '{selectedDisbursement.id}',
                    model: '{selectedDisbursement.model_name}',
                },
                filters: '{externalApprovalFilter}',
            },
            relatedDocuments: {
                source: '{selectedDisbursement.documents}',
            },
        },
        formulas: {
            nomination: {
                bind: {
                    bindTo: '{selectedDisbursement}',
                    deep: true,
                },
                get: function (record) {
                    if (record) return record.get('portcall').nomination;
                },
            },
            portcall: {
                bind: {
                    bindTo: '{selectedDisbursement.portcall}',
                    deep: true,
                },
                get: function (portcall) {
                    if (portcall) return portcall;
                },
            },
            object_record: {
                bind: {
                    bindTo: '{selectedDisbursement.portcall}',
                    deep: true,
                },
                get: function (portcall) {
                    if (portcall) return Ext.create('Ext.data.Model', portcall);
                },
            },
            member: {
                bind: {
                    bindTo: '{members}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        let currentUser = this.get('currentUser');

                        let member = store.queryBy(function (rec, id) {
                            if (rec.get('member'))
                                return rec.get('member').tenant_id == currentUser.get('current_company_id');
                        }).items[0];

                        // if (member && mainVM.get(''))
                        //     mainVM.set('activePortcallTab', 0);
                        if (member) return member.get('member');
                    }
                },
            },
            objectPermissions: {
                bind: {
                    bindTo: '{member}',
                    deep: true,
                },
                get: function (member) {
                    if (member) {
                        let permissions = member.permissions,
                            object_permissions = {};

                        Ext.each(permissions, function (record) {
                            let slug = record.sub_object_slug;
                            object_permissions[slug] = {
                                can_edit: record.can_edit,
                            };
                        });
                        return object_permissions;
                    }
                },
            },
            is_owner: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        if (record.company_id == this.get('currentUser').get('current_company_id')) return true;

                        return false;
                    }
                },
            },
            nonEditable: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (record) {
                    if (record && this.get('currentUser')) {
                        if (
                            record.company_id != this.get('currentUser').get('current_company_id') ||
                            record.is_archived ||
                            record.parent_id
                        )
                            return true;

                        return false;
                    }
                },
            },
            externalApprovalFilter: {
                bind: {
                    bindTo: '{selectedDisbursement}',
                    deep: true,
                },
                get: function (record) {
                    let member = this.get('member'),
                        currentUser = this.get('currentUser'),
                        store = this.get('approvals');

                    if (store) store.clearFilter();

                    if (member) {
                        return function (record) {
                            if (record.get('assigned_company_id') == currentUser.get('current_company_id')) {
                                return true;
                            }
                        };
                    } else {
                        return function (record) {
                            if (
                                record.get('company_id') == currentUser.get('current_company_id') &&
                                record.get('assigned_company_id') != currentUser.get('current_company_id')
                            ) {
                                return true;
                            }
                        };
                    }
                },
            },
            paymentsTotal: {
                bind: {
                    bindTo: '{payments}',
                    deep: true,
                },
                get: function (store) {
                    let data = {
                        outgoing: 0,
                        incoming: 0,
                    };

                    store.each(function (payment) {
                        switch (payment.get('kind')) {
                            case 'outgoing':
                                data.outgoing += parseFloat(payment.get('calculated_amount'));
                                break;
                            case 'incoming':
                                data.incoming += parseFloat(payment.get('calculated_amount'));
                                break;
                        }
                    });
                    return data;
                },
            },
            disbursementSectionMembers: {
                bind: {
                    bindTo: '{members}',
                    deep: true,
                },
                get: function (members) {
                    let data = [];
                    members.each(function (member) {
                        data.push(member.get('member'));
                    });
                    return data;
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 64,
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
                                title: '<div class="a-badge a-badge-financial"><span class="file-icon-badge file-icon-x32" data-type="{selectedDisbursement.type}" data-icon="money"></span></div><div><span class="a-panel-title">{selectedDisbursement.name}</span><span class="a-panel-id">#{selectedDisbursement.group_id}</span></div>',
                            },
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 0 12',
                            bind: {
                                html: '<div class="a-status-badge status-xl status-{selectedDisbursement.status}">{selectedDisbursement.status:capitalize}</div>',
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
                            testId: 'wpsFinancialRightCardAddTaskBtn',
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
                                    object_record = Ext.create(
                                        'Abraxa.model.portcall.Portcall',
                                        this.upVM().get('portcall')
                                    ),
                                    voyage = new Abraxa.model.voyage.Voyage(Object.assign({}, object_record.voyage)),
                                    subObject = Ext.Array.filter(subObjects, function (rec) {
                                        return rec.id == record.get('id') && rec.model == record.get('model_name');
                                    })[0];

                                object_record.setVoyage(voyage);

                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            noShowPortcall: true,
                                            subObjects: this.upVM().get('subObjects'),
                                            selectedSubObject: subObject.id,
                                            relatedObject: false,
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            object_record: object_record,
                                            editMode: false,
                                            taskEdit: false,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: 3,
                                                object_meta_id: this.upVM().get('portcall').id,
                                                taskable_type: this.upVM()
                                                    .get('selectedDisbursement')
                                                    .get('model_name'),
                                                taskable_id: this.upVM().get('selectedDisbursement').get('id'),
                                                ownerable_type: this.upVM().get('portcall').model_name,
                                                ownerable_id: this.upVM().get('portcall').id,
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
                            subObject: 'disbursements',
                            // skipEditPermission: true,
                            hidden: true,
                            slug: 'portcallPayments',
                            testId: 'wpsFinancialRightCardAddPaymentBtn',
                            bind: {
                                hidden: '{!is_owner}',
                                permission: '{userPermissions}',
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
                                        let object_record = me.upVM().get('portcall'),
                                            disbursement = me.upVM().get('selectedDisbursement'),
                                            account = me.upVM().get('selectedDisbursement').getAccount(),
                                            payment = Ext.create('Abraxa.model.payment.Payment', {
                                                owner_id: object_record.id,
                                                owner_type: object_record.model_name,
                                                account_id: account ? account.get('id') : null,
                                                org_id: account ? account.get('org_id') : null,
                                                org_name: account ? account.get('org_name') : null,
                                                currency: account
                                                    ? account.get('account_currency')
                                                    : me.upVM().get('currentCompany').get('default_currency'),
                                                account_currency: account ? account.get('account_currency') : null,
                                                from_exchange_rate: 1,
                                                to_exchange_rate: 1,
                                                exchange_rate: 1,
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
                            testId: 'wpsFinancialRightCardMoreBtn',
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
                                        slug: 'portcallDisbursementRequestApproval',
                                        subObject: 'disbursements',
                                        bind: {
                                            hidden: '{nonEditable ? true : false}',
                                            disabled: '{selectedDisbursement.status != "draft" ? true : false}',
                                            objectPermission: '{objectPermissions}',
                                            permission: '{userPermissions}',
                                        },
                                        handler: function () {
                                            Ext.create('Abraxa.view.approval.SendForApprovalDialog', {
                                                viewModel: {
                                                    parent: this.upVM(),
                                                    data: {
                                                        selectedRecords: [this.upVM().get('selectedDisbursement')],
                                                        approvalMembers: this.upVM().get('disbursementSectionMembers'),
                                                        object_id: 3,
                                                        object_record: Ext.create(
                                                            'Abraxa.model.portcall.Portcall',
                                                            this.upVM().get('portcall')
                                                        ),
                                                    },
                                                },
                                            }).show();
                                            mixpanel.track('Request approval button clicked (Disbursement)');
                                        },
                                    },
                                    {
                                        text: 'Delete',
                                        testId: 'wpsFinancialRightCardDeleteBtn',
                                        ui: 'decline',
                                        separator: true,
                                        slug: 'portcallDisbursementDelete',
                                        bind: {
                                            permission: '{userPermissions}',
                                            disabled: '{!disableDelete}',
                                        },
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        handler: function (me) {
                                            let store = me.upVM().get('selectedDisbursement').store,
                                                disbursement = me.upVM().get('selectedDisbursement'),
                                                expenses = me.upVM().get('selectedDisbursement').expenses(),
                                                allDisbursmentsFromGroup = store.query(
                                                    'group_id',
                                                    disbursement.get('group_id')
                                                );

                                            Ext.Msg.confirm(
                                                'Delete',
                                                'Are you sure you want to delete this item?',
                                                function (answer) {
                                                    if (answer == 'yes') {
                                                        if (
                                                            allDisbursmentsFromGroup.items &&
                                                            allDisbursmentsFromGroup.items.length == 1
                                                        ) {
                                                            //this is the last disbursment from this group detach all expenses
                                                            let allExpensesFromGroup = expenses.query(
                                                                'disbursement_id',
                                                                disbursement.get('group_id')
                                                            );
                                                            if (
                                                                allExpensesFromGroup.items &&
                                                                allExpensesFromGroup.items.length
                                                            ) {
                                                                Ext.Array.each(
                                                                    allExpensesFromGroup.items,
                                                                    function (rec) {
                                                                        rec.set('disbursement_id', null);
                                                                    }
                                                                );
                                                                expenses.sync();
                                                            }
                                                        }
                                                        //detach disbursement
                                                        if (allDisbursmentsFromGroup.items.length) {
                                                            Ext.Array.each(
                                                                allDisbursmentsFromGroup.items,
                                                                function (rec) {
                                                                    rec.set(disbursement.get('type') + '_id', null);
                                                                }
                                                            );
                                                        }

                                                        store.remove(store.getById(disbursement.get('id')));
                                                        store.sync({
                                                            success: function () {
                                                                Ext.toast('Record deleted', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                                this,
                                                [
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'no',
                                                        margin: '0 8 0 0',
                                                        text: 'Cancel',
                                                        testId: 'wpsFinancialRightCardDeleteCancelBtn',
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'yes',
                                                        ui: 'decline alt',
                                                        text: 'Delete',
                                                        separator: true,
                                                        testId: 'wpsFinancialRightCardDeleteConfirmBtn',
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
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'wpsFinancialRightCardExpandCloseBtn',
                            handler: function (me) {
                                let grid = Ext.ComponentQuery.query('wps\\.financial\\.grid')[0];

                                grid.deselectAll();
                                // me.up('[xtype=disbursement-right-card]').hide();
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
            cls: 'a-portcall-info',
            padding: 0,
            flex: 1,
            scrollable: 'y',
            weighted: true,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data a-bb-100',
                    padding: '12 0',
                    defaults: {
                        cls: 'a-data-item',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                    },
                    items: [
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'ETA',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.port_eta:date("d M Y - H:i")}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'ETD',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.port_etd:date("d M Y - H:i")}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Agency type',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{nomination.agency_type_name}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Sub agent',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{nomination.sub_agent_email ? nomination.sub_agent_email :null}">{nomination.sub_agent_name ? nomination.sub_agent_name:"---"}</a></div>',
                                    },
                                    testId: 'wpsFinancialRightCardSubAgentDiv',
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let email = el.currentTarget.getAttribute('data-email');
                                                if (email) {
                                                    let organizations = this.component.upVM().get('organizations'),
                                                        orgRecord = organizations.findRecord(
                                                            'org_email',
                                                            email,
                                                            0,
                                                            false,
                                                            false,
                                                            true
                                                        );
                                                    if (orgRecord) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showOrganizationTooltip(orgRecord.get('org_id'), el);
                                                    } else if (email) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showTenantByEmail(email, el);
                                                    }
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Voyage number',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{nomination.voyage_number}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            bind: {
                                hidden: '{selectedDisbursement.tags ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Label',
                                    width: 139,
                                },
                                {
                                    xtype: 'selectfield',
                                    ui: 'classic hovered-border',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    ui: 'viewonly classic',
                                    placeholder: 'Choose label',
                                    testId: 'wpsFinancialRightCardLabelSelectField',
                                    queryMode: 'local',
                                    valueField: 'tag_name',
                                    displayField: 'tag_name',
                                    multiSelect: true,
                                    forceSelection: true,
                                    readOnly: true,
                                    flex: 1,
                                    store: {
                                        type: 'default.disbursement.tags',
                                        autoLoad: true,
                                    },
                                    bind: {
                                        value: '{selectedDisbursement.tags}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    padding: 0,
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-br-100',
                                    padding: '8 0',
                                    defaults: {
                                        cls: 'a-data-item',
                                        padding: '4 24',
                                        layout: {
                                            type: 'hbox',
                                            align: 'center',
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            cls: 'text-right',
                                            minWidth: 314,
                                            xtype: 'div',
                                            padding: '8 24 16',
                                            html: '<h4 class="my-0 c-grey">Customer balance</h4>',
                                        },
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    html: 'Total costs',
                                                },
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    // cls: 'fw-b',
                                                    cls: 'text-right',
                                                    bind: {
                                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{selectedDisbursement.total_costs:number("0,000.00")}</b>',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            padding: '4 24 12',
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    html: 'Settled amount',
                                                },
                                                {
                                                    xtype: 'div',
                                                    cls: 'text-right',
                                                    flex: 1,
                                                    bind: {
                                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{paymentsTotal.incoming:number("0,000.00")}</b>',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-bt-100 a-data-item',
                                            padding: '16 24 8',
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    html: 'Outstanding balance',
                                                },
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    cls: 'text-right',
                                                    bind: {
                                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b c-blue">{(selectedDisbursement.total_costs - paymentsTotal.incoming):number("0,000.00")}</b>',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: '8 0',
                                    flex: 1,
                                    defaults: {
                                        cls: 'a-data-item text-right',
                                        padding: '4 24',
                                        layout: {
                                            type: 'hbox',
                                            align: 'center',
                                            pack: 'end',
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            flex: 1,
                                            cls: 'text-right',
                                            padding: '8 24 16',
                                            html: '<h4 class="my-0 c-grey">Agency balance</h4>',
                                        },
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    // cls: 'fw-b',
                                                    bind: {
                                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{selectedDisbursement.total_costs:number("0,000.00")}</b>',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            padding: '4 24 12',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    bind: {
                                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{paymentsTotal.outgoing:number("0,000.00")}</b>',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-bt-100 a-data-item',
                                            padding: '16 24 8',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    cls: 'text-right',
                                                    flex: 1,
                                                    bind: {
                                                        html: '<b class="c-light-grey mr-8">{selectedDisbursement.disbursement_currency}</b><b class="fw-b c-blue">{(selectedDisbursement.total_costs - paymentsTotal.outgoing):number("0,000.00")}</b>',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra',
                    slug: 'portCallCrewingAttachments',
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
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-attachments-list',
                            testId: 'wpsFinancialRightCardRelatedDocumentsList',
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
                                                        loadDodument: {
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

                                                                    // if (!pdf) {
                                                                    //     record.loadPDF2().then(function (blob) {
                                                                    //         let test = {
                                                                    //             blob: blob,
                                                                    //             name:
                                                                    //                 record.get('name') +
                                                                    //                 '.' +
                                                                    //                 file.get('extension'),
                                                                    //         };
                                                                    //         me.getView()
                                                                    //             .getController()
                                                                    //             .loadDocument(test);
                                                                    //     });
                                                                    // } else {
                                                                    //
                                                                    //     let blob = record.get('pdf');
                                                                    //     let test = {
                                                                    //         blob: blob,
                                                                    //         name:
                                                                    //             record.get('name') +
                                                                    //             '.' +
                                                                    //             file.get('extension'),
                                                                    //     };
                                                                    //     me.getView().getController().loadDocument(test);
                                                                    // }
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
                    cls: 'a-approvals-dialog a-bt-100',
                    padding: '0 0 16',
                    bind: {
                        hidden: '{externalApprovals.count ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Approvals</span></div>',
                                },
                            ],
                        },
                        // {
                        //     xtype: 'div',
                        //     padding: '0 0 0 24',
                        //     html: '<h5 class="my-0">Internal approvals</h5>',
                        //     bind: {
                        //         hidden: '{internalApprovals.count ? false:true}'
                        //     },
                        // },
                        {
                            xtype: 'div',
                            padding: '0 0 0 24',
                            html: '<h5 class="my-0">External approvals</h5>',
                            bind: {
                                hidden: '{externalApprovals.count ? false:true}',
                            },
                        },
                        {
                            xtype: 'abraxa.formlist',
                            cls: 'a-documents-approvals-list',
                            testId: 'wpsFinancialRightCardApprovalsList',
                            padding: '0 8',
                            bind: {
                                hidden: '{externalApprovals.count ? false:true}',
                                store: '{externalApprovals}',
                            },
                            variableHeights: true,
                            groupHeader: {
                                tpl: new Ext.XTemplate('<div>{[this.memberName(values.children[0].data)]}</div>', {
                                    memberName: function (record) {
                                        let store = Ext.ComponentQuery.query('wps\\.financial\\.right\\.card')[0]
                                                .upVM()
                                                .get('members'),
                                            member = store.getById(record.assigned_company_id);

                                        return (
                                            '<div class="party-item"><div class="sm-function"><i class="md-icon md-18">business</i></div><a href="javascript:void(0);" class="sm-company fw-b">' +
                                            record.company.name +
                                            '</a><div class="sm-type">' +
                                            record.company.email +
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
                                                let store = this.get('externalApprovals'),
                                                    groups = store.getGroups().items,
                                                    index,
                                                    res = false;

                                                Ext.Array.each(groups, function (group) {
                                                    if (group.indexOf(record) + 1 == group.count()) res = true;
                                                });
                                                return res;
                                            },
                                        },
                                        member: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                let store = this.get('members'),
                                                    member = store.getById(record.get('member_id'));
                                                return member;
                                            },
                                        },
                                        icon: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record) {
                                                    let status = record.get('status'),
                                                        icon = 'help_outline',
                                                        color = '#b0bec5';

                                                    switch (status) {
                                                        case 'approved':
                                                            icon = 'check_circle';
                                                            color = '#22b14c';
                                                            break;
                                                        case 'rejected':
                                                            icon = 'cancel';
                                                            color = '#e91e63';
                                                            break;
                                                    }

                                                    return {
                                                        icon: icon,
                                                        color: color,
                                                    };
                                                }
                                            },
                                        },
                                        updatedAtApprovals: {
                                            bind: {
                                                bindTo: '{record.updated_at}',
                                                deep: true,
                                            },
                                            get: function (date) {
                                                if (date) {
                                                    return Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .parseMomentDate(
                                                            date,
                                                            AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                                        );
                                                } else {
                                                    return '';
                                                }
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'container',
                                        bind: {
                                            cls: 'a-approval-item {isLast && record.status == "pending" ? "x-last" : ""}',
                                        },
                                        margin: '0',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                        },
                                        items: [
                                            {
                                                xtype: 'displayfield',
                                                labelAlign: 'top',
                                                testId: 'wpsFinancialRightCardApprovalsListSentForApprovalDisplayField',
                                                flex: 1,
                                                encodeHtml: false,
                                                bind: {
                                                    value: '<div class="approval-text approval-pending">Sent for approval</div>',
                                                    cls: 'a-approval-note a-approval-reason pending',
                                                    html: '<div class="a-approval-em"><em>{record.comment}</em></div>',
                                                },
                                            },
                                            {
                                                xtype: 'public.updated.by',
                                                cls: 'a-approval-avatar',
                                                testId: 'wpsFinancialRightCardApprovalsListSentForApprovalCreatedByField',
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
                                        margin: '0',
                                        items: [
                                            {
                                                xtype: 'container',
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
                                                        labelAlign: 'top',
                                                        flex: 1,
                                                        encodeHtml: false,
                                                        testId: 'wpsFinancialRightCardApprovalsListApprovedDisplayField',
                                                        bind: {
                                                            value: '<div class="approval-text approval-{record.status}">{record.status:capitalize}</div>',
                                                            cls: 'a-approval-note a-approval-reason {record.status}',
                                                            html: '<div class="a-approval-em"><em>{record.status_reason}</em></div>',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'public.updated.by',
                                                        cls: 'a-approval-avatar',
                                                        testId: 'wpsFinancialRightCardApprovalsListApprovedByField',
                                                        bind: {
                                                            data: {
                                                                user: '{record.updated_by_user}',
                                                                updated_at: '{record.updated_at}',
                                                            },
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
                                                        testId: 'wpsFinancialRightCardApprovalsListCancelRequestBtn',
                                                        bind: {
                                                            hidden: '{record.company_id != currentUser.current_company_id ? true : false}',
                                                        },
                                                        text: 'Cancel request',
                                                        margin: '14 14 0 0',
                                                        arrow: false,
                                                        handler: function (me) {
                                                            Ext.create('Abraxa.view.approval.CancelApprovalDialog', {
                                                                viewModel: {
                                                                    data: {
                                                                        recordForApproval: me.upVM().get('record'),
                                                                        approvals: me
                                                                            .upVM()
                                                                            .get('selectedDisbursement.approvals'),
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
                    cls: 'a-bt-100',
                    hidden: false,
                    padding: '0 0 16 0',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    bind: {
                        // hidden: '{objectPayments.count ? false : true}',
                        // hidden: '{!is_owner}',
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
                                    title: '<div><span class="a-panel-title">Payments</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'payments.list',
                            minHeight: 120,
                            testId: 'wpsFinancialRightCardPaymentsList',
                            bind: {
                                store: '{payments}',
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
                        hidden: '{tasks.count ? false : true}',
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
                            testId: 'wpsFinancialRightCardTasksList',
                            minHeight: 120,
                            bind: {
                                store: '{tasks}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-comments',
                    slug: 'portcallNotes',
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
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            minHeight: 120,
                            testId: 'wpsFinancialRightCardCommentsList',
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    testId: 'wpsFinancialRightCardCommentsInput',
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
            ],
        },
    ],
});

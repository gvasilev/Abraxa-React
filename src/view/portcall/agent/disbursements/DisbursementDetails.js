import './DisbursementDotsMenu.js';
import './DisbursementItemsGrid.js';

Ext.define('Abraxa.view.portcall.disbursements.DisbursementDetails', {
    extend: 'Ext.Container',
    xtype: 'disbursement.details',
    itemId: 'disbursementDetails',
    testId: 'disbursementDetails',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    bind: {
        cls: 'a-bgr-white no-shadow',
    },
    // masked: {
    //     xtype: 'object.mask',
    // },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    minHeight: 64,
                    items: [
                        {
                            xtype: 'tool',
                            iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                            margin: '0 16 0 0',
                            ui: 'tool-md',
                            handler: function () {
                                let grid = Ext.ComponentQuery.query('disbursements\\.grid')[0];

                                if (grid) {
                                    grid.deselectAll();
                                    this.upVM().set('showDetails', false);
                                }
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-title',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    margin: '0 12 0 0',
                                    bind: {
                                        html: '<span class="file-icon-badge file-icon-x32" data-type="{selectedDisbursement.type}" data-icon="money"></span>',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<span>{selectedDisbursement.name}</span><em class="a-id">({selectedDisbursement.organization_name})</em>',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-subtitle',
                                            bind: {
                                                html: '<i class="md-icon-outlined md-icon-group"></i><a href="javascript:void(0)">{disbursementMemberCount.length} members</a>',
                                                // hidden: '{nonEditable}'
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    fn: function () {
                                                        let vm = this.component.upVM(),
                                                            menu = Ext.create(
                                                                'Abraxa.view.portcall.MembersPreviewMenu',
                                                                {
                                                                    viewModel: {
                                                                        parent: vm,
                                                                        data: {
                                                                            sectionMembers:
                                                                                vm.get('disbursementSectionMembers'),
                                                                            memberPreviewTitle: vm.get(
                                                                                'disbursementMemberPreviewTitle'
                                                                            ),
                                                                        },
                                                                    },
                                                                }
                                                            );
                                                        menu.showBy(this);
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            subObject: 'disbursements',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 16',
                                    ui: 'status-md default',
                                    // ui: 'status default',
                                    slug: 'portcallDisbursementStatus',
                                    bind: {
                                        cls: 'status-{selectedDisbursement.status}',
                                        text: '{selectedDisbursement.status:capitalize}',
                                        permission: '{userPermissions}',
                                        hidden: '{!disableDelete}',
                                        objectPermission: '{objectPermissions}',
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
                                                text: AbraxaConstants.buttons.text.submited,
                                                value: AbraxaConstants.buttons.text.submited.toLowerCase(),
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
                            xtype: 'container',
                            cls: 'a-bl-100',
                            items: [
                                {
                                    xtype: 'button',
                                    testId: 'disbursementDetailsConvertDABtn',
                                    ui: 'blue-light small',
                                    iconCls: 'md-icon-outlined md-icon-upgrade',
                                    slug: 'portcallDisbursementConvertDA',
                                    margin: '0 0 0 16',
                                    subObject: 'disbursements',
                                    text: 'Convert DA',
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
                                                        const dialog = Ext.create(
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
                                                        );
                                                        dialog.show();
                                                    },
                                                },
                                            },
                                        },
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'h5',
                                                margin: '8 16',
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
                                                testId: 'disbursementDetailsDepartureDAConvertBtn',
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
                                                testId: 'disbursementDetailsFinalDAConvertBtn',
                                                bind: {
                                                    hidden: '{selectedDisbursement.fda_id ? true : false}',
                                                    html: '<div class="hbox convert"><span class="file-icon-badge file-icon-x32" data-type="fda" data-icon="money"></span><b class="fw-b ml-16">Final DA</b></div>',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-bl-100',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'blue-light small',
                                    iconCls: 'md-icon-outlined md-icon-attach-money',
                                    slug: 'portcallDisbursementCreateSDA',
                                    margin: '0 0 0 16',
                                    subObject: 'disbursements',
                                    text: 'Create SDA',
                                    testId: 'disbursementDetailsCreateSDABtn',
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
                        {
                            xtype: 'div',
                            margin: '0 0 0 16',
                            // hidden: true,
                            bind: {
                                hidden: '{editableDisbursementPermissions && disableDelete}',
                                html: '<div class="a-status-badge a-status-md status-{selectedDisbursement.status}">{selectedDisbursement.status:capitalize}</div>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 16',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'indigo-light small',
                                    testId: 'disbursementDetailsUnaccountedBtn',
                                    iconCls: 'md-icon-outlined md-icon-file-download',
                                    margin: '0 0 0 8',
                                    hidden: true,
                                    subObject: 'supply',
                                    menuAlign: 'tr-br?',
                                    bind: {
                                        hidden: '{!selectedDisbursement.availableExpenses.length || selectedDisbursement.is_locked ? true : false}',
                                        text: 'Unaccounted <em>{selectedDisbursement.availableExpenses.length}</em>',
                                        cls: '{nonEditable ? "a-has-counter x-has-menu hidden" : "a-has-counter x-has-menu"}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    menu: {
                                        // minWidth: '320',
                                        maxHeight: 600,
                                        scrollable: true,
                                        cls: 'a-bgr-white',
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'h5',
                                                margin: '8 16',
                                                docked: 'top',
                                                bind: {
                                                    html: 'unaccounted services',
                                                },
                                            },
                                            {
                                                xtype: 'list',
                                                ripple: true,
                                                itemRipple: true,
                                                reference: 'availableExpensesList',
                                                cls: 'a-menu-unaccounted-items availableExpensesList',
                                                scrollable: true,
                                                selectable: {
                                                    mode: 'multi',
                                                },
                                                bind: {
                                                    data: '{selectedDisbursement.availableExpenses}',
                                                },
                                                itemConfig: {
                                                    xtype: 'container',
                                                    flex: 1,
                                                    padding: '8 16',
                                                    cls: 'a-unaccounted-item cursor-pointer',
                                                    viewModel: {},
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'middle',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            cls: 'a-unnaccounted-item-expence',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle',
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'checkbox',
                                                                    ui: 'medium',
                                                                    subObject: 'disbursements',
                                                                    bind: {
                                                                        cls: '{nonEditable ? "hidden" : ""}',
                                                                        checked: '{record.checked}',
                                                                        objectPermission: '{objectPermissions}',
                                                                    },
                                                                },
                                                                {
                                                                    xtype: 'div',
                                                                    margin: '0 8',
                                                                    width: 140,
                                                                    cls: 'text-truncate',
                                                                    bind: {
                                                                        html: '{record.default_expense_item_name}',
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            xtype: 'div',
                                                            cls: 'a-unnaccounted-item-status',
                                                            margin: '0 8',
                                                            width: 90,
                                                            bind: {
                                                                html: '{status}',
                                                            },
                                                            viewModel: {
                                                                formulas: {
                                                                    status: function (get) {
                                                                        let val = get('record.status');
                                                                        return (
                                                                            '<div class="a-status-badge a-status-md status-' +
                                                                            val +
                                                                            '"><span class="text-truncate">' +
                                                                            Ext.String.capitalize(val) +
                                                                            '</span></div>'
                                                                        );
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'div',
                                                            cls: 'a-unnaccounted-item-amount text-right',
                                                            width: 100,
                                                            margin: '0 8',
                                                            bind: {
                                                                html: '{currency} <span class="fw-b">{invoiceAmount:number("0,000.00")}</span>',
                                                            },
                                                            viewModel: {
                                                                formulas: {
                                                                    currency: function (get) {
                                                                        let record = get('record');
                                                                        if (record && record.vouchers().count()) {
                                                                            if (
                                                                                record
                                                                                    .vouchers()
                                                                                    .sum('calculated_price') > 0
                                                                            ) {
                                                                                return record
                                                                                    .vouchers()
                                                                                    .first()
                                                                                    .get('account_currency');
                                                                            }
                                                                            return '';
                                                                        } else {
                                                                            return '';
                                                                        }
                                                                    },

                                                                    invoiceAmount: function (get) {
                                                                        let record = get('record');
                                                                        if (record) {
                                                                            let vouchers = record.vouchers();
                                                                            if (vouchers.count()) {
                                                                                return vouchers.sum('calculated_price');
                                                                            } else {
                                                                                return record.get('pda_final_price');
                                                                            }
                                                                        }
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                                listeners: {
                                                    childtap: function (item, location, eOpts) {
                                                        let record = location.record;

                                                        if (record.get('checked')) {
                                                            record.set('checked', false);
                                                        } else {
                                                            record.set('checked', true);
                                                        }
                                                    },
                                                },
                                            },
                                            {
                                                xtype: 'container',
                                                padding: '8 16',
                                                docked: 'bottom',
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'end',
                                                },
                                                subObject: 'disbursements',
                                                bind: {
                                                    cls: '{nonEditable ? "hidden" : ""}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        ui: 'small action',
                                                        text: 'Add',
                                                        disabled: true,
                                                        bind: {
                                                            disabled:
                                                                '{availableExpensesList.selection ? false : true}',
                                                        },
                                                        handler: function (me) {
                                                            let disbursement = this.upVM().get('selectedDisbursement'),
                                                                items = this.upVM().get(
                                                                    'selectedDisbursement.availableExpenses'
                                                                ),
                                                                store = this.upVM().get('expenses'),
                                                                type = disbursement.get('type');

                                                            Ext.each(items, function (item) {
                                                                if (item.get('checked')) {
                                                                    item.set(
                                                                        'disbursement_id',
                                                                        disbursement.get('group_id')
                                                                    );
                                                                    item.set(type + '_id', disbursement.get('id'));
                                                                    item.set('checked', false);
                                                                    item.set(
                                                                        'currency',
                                                                        disbursement.get('disbursement_currency')
                                                                    );
                                                                }
                                                            });
                                                            me.up('menu').hide();

                                                            store.sync({
                                                                success: function () {
                                                                    Ext.toast('Record updated');
                                                                    me.upVM().set('updateGridItems', new Date());
                                                                    me.upVM()
                                                                        .get('disbursementsGrid.selection')
                                                                        .set('calculation', new Date());
                                                                },
                                                            });
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                        listeners: {
                                            hide: function () {
                                                let items = this.upVM().get('selectedDisbursement.availableExpenses');
                                                Ext.each(items, function (item) {
                                                    item.set('checked', false);
                                                });
                                                Ext.ComponentQuery.query(
                                                    '[cls~=availableExpensesList]'
                                                )[0].deselectAll();
                                            },
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'progress-light color-default small',
                                    iconCls: 'md-icon-outlined md-icon-info',
                                    cls: 'a-has-counter x-has-menu',
                                    hidden: true,
                                    bind: {
                                        hidden: '{accountAgreements.count ? false : true}',
                                        text: 'Agreements <em>{accountAgreements.count}</em>',
                                    },
                                    menu: {
                                        minWidth: '320',
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'h5',
                                                margin: '8 16',
                                                bind: {
                                                    html: 'Agreements',
                                                },
                                            },
                                            {
                                                xtype: 'agreements.list',
                                                bind: {
                                                    store: '{accountAgreements}',
                                                },
                                            },
                                        ],
                                    },
                                    listeners: {
                                        tap: function () {
                                            mixpanel.track('Agreements (disb screen) - button');
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    ui: 'blue-light color-default small',
                                    iconCls: 'md-icon-outlined md-icon-file-copy',
                                    slug: 'portcallInvoices',
                                    skipEditPermission: true,
                                    margin: '0 0 0 8',
                                    subObject: 'disbursements',
                                    bind: {
                                        text: 'Invoices <em>{accountVouchers.count}</em>',
                                        cls: '{nonEditable ? "chameleon_disbursements_manage_payments_button hidden" : ""} a-has-counter',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    handler: function () {
                                        let disbursement = this.upVM().get('selectedDisbursement'),
                                            vouchers = this.upVM().get('accountVouchers'),
                                            vm = this.upVM(),
                                            expenses = vm.get('disbursementExpenses');

                                        Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    selectVoucher: null,
                                                    disbursementRecord: disbursement,
                                                    vouchers: vouchers,
                                                    expenses: expenses,
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

                                                                me.getView()
                                                                    .getController()
                                                                    .loadDocument(
                                                                        Env.ApiEndpoint + 'get_pdf/' + file.get('id')
                                                                    );
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
                                                                let objectPermissions = this.get('objectPermissions'),
                                                                    nonEditable = this.get('nonEditable'),
                                                                    store = this.get('userPermissions'),
                                                                    result = false;
                                                                if (record.get('is_locked')) {
                                                                    return false;
                                                                } else {
                                                                    if (!nonEditable) {
                                                                        if (store && Object.keys(store).length > 0) {
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
                                                                                objectPermissions['disbursements']
                                                                                    .can_edit
                                                                            ) {
                                                                                result = true;
                                                                                if (
                                                                                    store &&
                                                                                    Object.keys(store).length > 0
                                                                                ) {
                                                                                    let record = store['disbursements'];
                                                                                    if (record && !record.edit) {
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
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            // cls: 'a-titlebar',
            subObject: 'disbursements',
            padding: '8 16 8 24',
            bind: {
                objectPermission: '{objectPermissions}',
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'action small',
                            iconCls: 'md-icon-add',
                            slug: 'portcallDisbursementAddItem',
                            testId: 'disbursementDetailsItemSmallBtn',
                            subObject: 'disbursements',
                            bind: {
                                hidden: '{!disbursements.count}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                cls: '{nonEditable ? "hidden" : ""}',
                                disabled: '{selectedDisbursement.status != "draft" ? true : false}',
                            },
                            text: 'Item',
                            handler: function (me) {
                                // me.setDisabled(true);
                                let store = me.upVM().get('expenses'),
                                    grid = Ext.ComponentQuery.query('disbursements\\.items\\.grid')[0],
                                    currentUser = me.upVM().get('currentUser'),
                                    disbursement = me.upVM().get('selectedDisbursement'),
                                    disbursementTypeId = me.upVM().get('selectedDisbursement.type') + '_id',
                                    record = Ext.create('Abraxa.model.portcall.Expense', {
                                        disbursement_id: me.upVM().get('selectedDisbursement.group_id'),
                                        account_id: me.upVM().get('selectedDisbursement.account_id'),
                                        account_name: me.upVM().get('selectedDisbursement.organization_name'),
                                        portcall_id: me.upVM().get('selectedDisbursement.portcall_id'),
                                        [disbursementTypeId]: me.upVM().get('selectedDisbursement.id'),
                                        currency: disbursement.get('disbursement_currency'),
                                        exchange_rate: 1,
                                    });

                                let vouchers = new Abraxa.model.disbursement.Voucher(Object.assign({}, [])),
                                    attachments = new Abraxa.model.portcall.Attachment(Object.assign({}, []));

                                record.vouchers().setData(vouchers);
                                record.attachments().setData(attachments);
                                store.add(record);
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'btn-sm small success',
                            iconCls: 'md-icon-outlined md-icon-check-circle',
                            text: 'Request approval',
                            testId: 'disbursementDetailsRequestApprovalBtn',
                            slug: 'portcallDisbursementRequestApproval',
                            subObject: 'disbursements',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                // hidden: '{nonEditable ? true : false}',
                                disabled: '{selectedDisbursement.status != "draft" ? true : false}',
                                objectPermission: '{objectPermissions}',
                            },
                            handler: function () {
                                mixpanel.track('Request approval (disb screen) - button');
                                Ext.create('Abraxa.view.approval.SendForApprovalDialog', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            selectedRecords: [this.upVM().get('disbursementsGrid.selection')],
                                            approvalMembers: this.upVM().get('disbursementSectionMembers'),
                                        },
                                    },
                                }).show();
                                mixpanel.track('Request approval button clicked (Disbursement)');
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-add',
                            text: 'Document',
                            hidden: true,
                            testId: 'disbursementDetailsDocumentBtn',
                            subObject: 'documents',
                            slug: 'portcallDocuments',
                            margin: '0 0 0 8',
                            bind: {
                                objectPermission: '{objectPermissions}',
                                permission: '{userPermissions}',
                                hidden: '{hideDocumentButton}',
                            },
                            handler: function (me) {
                                mixpanel.track('FDA document (disb screen) - button');
                                let record = me.upVM().get('selectedDisbursement');
                                let selectedAccount = me.upVM().get('selectedAccount');
                                let docForm = Ext.create('Abraxa.view.adocs.FinancialDocumentForm', {
                                    viewModel: {
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            disbursement: record,
                                            disbursementGrouping: this.upVM().get('disbursementGrouping'),
                                            organizations: this.upVM().get('organizations'),
                                            organizationTypesFilter: this.upVM().get('organizationTypesFilter'),
                                            documentTypes: this.upVM().get('documentTypes'),
                                            document_data: {},
                                            subObjects: this.upVM().get('subObjects'),
                                            currentUser: this.upVM().get('currentUser'),
                                            expenses: this.upVM().get('expenses'),
                                            recieptExpenses: this.upVM().get('recieptExpenses'),
                                            accounts: this.upVM().get('accounts'),
                                            bankAccounts: this.upVM().get('bankAccounts'),
                                        },
                                        formulas: {
                                            selectedDisbursementItems: {
                                                bind: {
                                                    bindTo: '{selectedDisbursement.selection}',
                                                    deep: true,
                                                },
                                                get: function (record) {
                                                    if (record) {
                                                        let expenses = this.get('expenses'),
                                                            data = [];

                                                        expenses.each(function (item) {
                                                            if (
                                                                item.get(record.get('type') + '_id') ==
                                                                    record.get('id') &&
                                                                item.get('default_expense_item_id')
                                                            ) {
                                                                item.checked = true;
                                                                data.push(item);
                                                            }
                                                        });
                                                        return data;
                                                    }
                                                },
                                            },
                                            sharedFoldersStore: {
                                                bind: {
                                                    bindTo: '{object_record.folders}',
                                                },
                                                get: function (foldersStore) {
                                                    if (!foldersStore) return [];
                                                    const sharedFolders = foldersStore
                                                        .getData()
                                                        .items.filter((item) => item.get('is_shared') === 1)
                                                        .map((item) => item.getData());
                                                    // sort by name alphabetically
                                                    sharedFolders.sort((a, b) => {
                                                        if (a.name < b.name) return -1;
                                                        if (a.name > b.name) return 1;
                                                        return 0;
                                                    });
                                                    return sharedFolders;
                                                },
                                            },
                                            sharedFoldersFieldHidden: {
                                                bind: '{object_record.folders}',
                                                get: function (foldersStore) {
                                                    if (!foldersStore) return true;
                                                    if (foldersStore.findRecord('is_default', 1)) return true;
                                                    if (foldersStore.findRecord('is_shared', 1)) return false;
                                                    return true;
                                                },
                                            },
                                        },
                                    },
                                });

                                let selectedType = this.upVM()
                                    .get('documentTypes')
                                    .queryBy(function (rec, id) {
                                        return rec.get('slug') == record.get('type');
                                    }).items;
                                if (selectedType.length) {
                                    docForm.upVM().set('document_data.document_type_id', selectedType[0].id);
                                }
                                docForm.upVM().set('document_data.bill_to', selectedAccount.get('id'));
                                docForm.upVM().set('document_data.bill_to_name', record.get('org_name'));
                                docForm.upVM().set('document_data.care_of', selectedAccount.get('co_id'));
                                docForm.show();
                            },
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 8',
                            ui: 'tool-text-sm',
                            testId: 'disbursementDetailsExportBtn',
                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                            slug: 'portcallSupplyExport',
                            text: 'Export',
                            hidden: true,
                        },
                        {
                            xtype: 'disbursement.menu',
                            subObject: 'disbursements',
                            testId: 'disbursementDetailsDisbursementMenu',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'disbursement.items.grid',
        },
        {
            xtype: 'container',
            // docked: 'bottom',
            cls: 'a-total-billed-docked',
            padding: '8 24',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    bind: {
                        html: '<div class="h5">Total disbursement costs</div><div class="a-billed-price"><span class="a-billed-currency">{selectedDisbursement.disbursement_currency}</span><span class="a-billed-amount">{totalFinal:number("0,000.00")}</span><i class="md-icon-outlined">info</i></div>',
                        tooltip: {
                            html:
                                '<div class="a-info-row"><label class="a-info-label">Discount:</label><div class="a-info-data"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-b c-yellow">-{totalDiscount:number("0,000.00")}</b></div></div>' +
                                '<div class="a-info-row"><label class="a-info-label">VAT:</label><div class="a-info-data"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{totalVAT:number("0,000.00")}</b></div></div>' +
                                '<div class="a-info-row"><label class="a-info-label">Final price:</label><div class="a-info-data a-bt-100 pt-8"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-700 fs-16 c-blue">{totalFinal:number("0,000.00")}</b></div></div>',
                            align: 'bc-tc?',
                            cls: 'a-tooltip-balance',
                            ui: 'info-card',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                            anchorToTarget: true,
                        },
                    },
                },
                {
                    flex: 1,
                },
                {
                    xtype: 'container',
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
                                align: 'middle',
                            },
                            bind: {
                                hidden: '{recordForApproval.status == "pending" ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'c-grey',
                                    html: 'Pending your approval:',
                                    margin: '0 16',
                                },
                                {
                                    xtype: 'button',
                                    ui: 'confirm alt',
                                    text: 'Approve',
                                    cls: 'no_show',
                                    handler: function () {
                                        let approvals = this.upVM().get('selectedDisbursement').approvals();
                                        mixpanel.track('Approve (disb screen) - button');
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
                                    ui: 'danger outlined',
                                    text: 'Reject',
                                    cls: 'no_show',
                                    handler: function () {
                                        let approvals = this.upVM().get('selectedDisbursement').approvals(),
                                            dialog = Ext.create(
                                                'Abraxa.view.portcall.documents.DocumentsRejectDialog',
                                                {
                                                    viewModel: {
                                                        parent: this.upVM(),
                                                    },
                                                }
                                            );

                                        mixpanel.track('Reject (disb screen) - button');

                                        dialog.getVM().set('approvals', approvals);
                                        dialog.show();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});

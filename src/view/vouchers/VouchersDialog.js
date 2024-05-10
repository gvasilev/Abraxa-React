Ext.define('Abraxa.view.vouchers.VouchersDialog', {
    extend: 'Ext.Dialog',
    xtype: 'vouchers-dialog',
    controller: 'voucher-controller',
    cls: 'a-dialog-create a-dialog-has-icon a-dialog-docs a-drop-container a-drop-container-dark',
    ui: 'dark',
    padding: 0,
    draggable: false,
    maximizable: false,
    maximized: true,
    manageBorders: false,
    scrollable: true,
    showAnimation: null,
    id: 'dropped-container-vouchers',
    tools: {
        close: {
            handler: function () {
                if (WebViewer.getInstance()) WebViewer.getInstance().UI.dispose();

                this.up('dialog').destroy();
            },
        },
    },
    layout: {
        type: 'hbox',
        align: 'stretch',
    },
    header: {
        padding: '8 16 8 24',
        maxHeight: 64,
        title: {
            width: 0,
            hidden: true,
        },
        items: [
            {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'a-badge a-badge-vouchers mr-16',
                        html: '<i class="material-icons-outlined">file_copy</i>',
                    },
                    {
                        xtype: 'div',
                        html: '<i class="md-icon md-icon-outlined c-red md-18">lock</i>',
                        margin: '4 12 0 -2',
                        hidden: true,
                        bind: {
                            hidden: '{disbursementRecord.is_locked ? false : true}',
                        },
                    },
                    {
                        xtype: 'div',
                        cls: 'c-white',
                        bind: {
                            hidden: '{vouchers.count ? false : true}',
                            html: '<h1>{selectedVoucher.name}.{selectedVoucher.document.extension}</h1>',
                        },
                    },
                    {
                        xtype: 'div',
                        cls: 'c-white',
                        bind: {
                            hidden: '{vouchers.count ? true : false}',
                            html: '<h1>Invoices</h1>',
                        },
                    },
                    {
                        xtype: 'tool',
                        ui: 'dark',
                        iconCls: 'md-icon-edit md-icon-outlined',
                        bind: {
                            hidden: '{vouchers.count && !nonEditable ? false : true}',
                        },
                        margin: '0 16',
                        tooltip: {
                            html: 'Rename',
                            align: 'bc',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                        },
                        handler: function (me) {
                            let record = this.upVM().get('selectedVoucher');

                            Ext.create('Ext.Dialog', {
                                closable: true,
                                alwaysOnTop: 2,
                                viewModel: {
                                    parent: me.upVM(),
                                },
                                title: 'Rename document',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        labelAlign: 'top',
                                        label: 'Name',
                                        ui: '',
                                        placeholder: 'Invoice name',
                                        clearable: false,
                                        required: true,
                                        cls: 'a-field-icon icon-file',
                                        bind: {
                                            value: '{selectedVoucher.name}',
                                        },
                                        listeners: {
                                            painted: function () {
                                                this.focus();
                                            },
                                        },
                                    },
                                ],
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        margin: '0 8 0 0',
                                        handler: function () {
                                            record.reject();
                                            this.up('dialog').destroy();
                                        },
                                    },
                                    {
                                        text: 'Save',
                                        ui: 'action',
                                        handler: function () {
                                            if (record.dirty) {
                                                record.getProxy().setExtraParams({
                                                    portcall_id: record.get('portcall_id'),
                                                });
                                                record.save({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                    failure: function () {
                                                        record.reject();
                                                    },
                                                });
                                            }

                                            this.up('dialog').destroy();
                                        },
                                    },
                                ],
                            }).show();
                        },
                    },
                ],
            },
        ],
    },
    weighted: true,
    flex: 1,
    lbar: {
        xtype: 'container',
        cls: 'a-left-menu vouchers_menu dark a-br-dark',
        stateful: ['width', 'userCls'],
        stateId: 'vouchersLeftMenu',
        reference: 'vouchersLeftMenu',
        publishes: ['userCls'],
        userCls: 'is-expanded',
        scrollable: true,
        ui: 'dark',
        // xtype: 'panel',
        // cls: 'dark rotate_header collapsible_test a-docs-panel border-right',
        // bodyBorder: true,
        // layout: {
        //     type: 'vbox',
        //     align: 'stretch'
        // },
        // title: '<h5>Vouchers</h5>',
        // weight: 1,
        // flex: 1,
        // scrollable: true,
        // collapsible: {
        //     direction: 'left',
        //     // dynamic: true,
        //     // collapsed: true,
        //     collapseAnimation: false,
        //     expandAnimation: false,
        //     tool: {
        //         ui: 'dark',
        //     },
        //     drawer: {
        //         cls: Ext.baseCSSPrefix + 'drawer dark collapsible_test a-docs-panel',
        //         shadow: false
        //         // header: false
        //     }
        // },
        items: [
            {
                xtype: 'container',
                cls: 'a-menu-heading a-bb-dark',
                docked: 'top',
                padding: 16,
                style: 'flex: none',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'space-between',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'sm-heading',
                        margin: '0 16',
                        html: '<h5>INVOICES</h5>',
                    },
                    {
                        xtype: 'button',
                        ui: 'round',
                        iconCls: 'md-icon-outlined md-icon-first-page',
                        focusable: false,
                        bind: {
                            tooltip: {
                                html: '<span class="tooltip_expand">{vouchersLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                                anchor: true,
                                align: 'bc-tc?',
                            },
                        },
                        handler: function () {
                            let panel = Ext.ComponentQuery.query('[cls~=vouchers_menu]')[0],
                                cls = panel.getUserCls() == 'is-expanded';

                            if (cls != '') {
                                panel.setUserCls('');
                            } else {
                                panel.setUserCls('is-expanded');
                            }
                        },
                    },
                ],
            },
            {
                xtype: 'list',
                reference: 'vouchersList',
                style: 'background-color: transparent',
                cls: 'a-list-dark vouchers_list',
                selectable: {
                    deselectable: false,
                },
                scrollable: true,
                flex: 1,
                infinite: false,
                ripple: false,
                itemRipple: false,
                variableHeights: true,
                itemConfig: {
                    viewModel: {},
                    padding: '0 8 0 16',
                    cls: 'cursor-pointer',
                    bind: {
                        tpl: '<div class="hbox"><span class="file-icon-new file-icon-sm-new file-icon-dark" data-type="{record.document.extension}"></span><span class="a-file-name {vouchersLeftMenu.userCls ? "" : "hidden"}">{record.name + "." + record.document.extension}</span></div>',
                        tooltip: {
                            html: '{vouchersLeftMenu.userCls ? "" : record.name + "." + record.document.extension}',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                            // anchorToTarget: false,
                            align: 'l-r?',
                            anchor: true,
                        },
                    },
                },
                bind: {
                    store: '{vouchers}',
                },
                listeners: {
                    painted: function (me) {
                        if (!me.upVM().get('selectVoucher')) {
                            me.select(me.getStore().getAt(0));
                        } else {
                            me.select(me.upVM().get('selectVoucher'));
                        }
                    },
                    select: function (list, record) {
                        list.ensureVisible(record);
                    },
                },
            },
            {
                xtype: 'container',
                padding: 16,
                docked: 'bottom',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'filebutton',
                        flex: 1,
                        multiple: true,
                        accept: '.pdf',
                        text: 'Upload',
                        ui: 'action medium upload',
                        iconCls: 'md-icon-outlined md-icon-cloud-upload',
                        name: 'files',
                        subObject: 'disbursements',
                        slug: 'portcallInvoiceCreate',
                        bind: {
                            permission: '{userPermissions}',
                            cls: '{nonEditable ? "hidden" : ""}',
                            objectPermission: '{objectPermissions}',
                        },
                        // right: 16,
                        // listeners: {
                        //     change: 'uploadFiles',
                        // }
                        listeners: {
                            change: function (me, newValue) {
                                if (newValue) {
                                    var files = this.getFiles(),
                                        uploadController = me.up('dialog').getController(),
                                        len = files.length;

                                    for (var i = 0; i < len; i++) {
                                        files.item(i).split = null;
                                    }
                                    uploadController.upload(files, this);
                                }
                                document.querySelector("input[type='file']").value = '';
                                me.setValue(null);
                            },
                        },
                    },
                    // {
                    //     xtype: 'div',
                    //     margin: '0 0 0 8',
                    //     html: '<div class="sm-title">or drop files here</div>'
                    // }
                ],
            },
        ],
        hidden: true,
        bind: {
            hidden: '{vouchers.count ? false : true}',
        },
    },
    items: [
        {
            xtype: 'container',
            zIndex: 10,
            hidden: true,
            bind: {
                hidden: '{vouchers.count ? true : false}',
            },
            layout: {
                type: 'vbox',
                pack: 'middle',
            },
            centered: true,
            // html: '',
            items: [
                {
                    xtype: 'div',
                    // html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 124"><title>cloud_upload</title><g style="opacity:0.6000000238418579"><circle cx="62" cy="62" r="62" style="fill:#e9ecef;opacity:0.4000000059604645;isolation:isolate"/></g><path d="M82.71,54.52C80.79,44,72.26,36.15,62,36.15c-8.14,0-15.21,5-18.74,12.28-8.48,1-15.07,8.73-15.07,18.13,0,10.06,7.58,18.25,16.91,18.25H81.72c7.78,0,14.09-6.82,14.09-15.21C95.81,61.57,90,55.06,82.71,54.52Zm-15.08,9V75.68H56.37V63.52H47.91L62,48.31,76.09,63.52Z" style="fill:#c8d4e6"/></svg><div class="a-no-content-txt">Drag & Drop here</br><small>- or -</small></div></div>'
                    html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9717 -19083)"><g transform="translate(8883 18738)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9005.988 19065.16)"><path d="M776.7,44.84h-19.84a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5h-14.36a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M775.662,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M761.083,83.667h15.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-15.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,83.667Z" fill="#c8d4e6"></path><path d="M761.083,91.187h5.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-5.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,91.187Z" fill="#c8d4e6"></path><path d="M761.083,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652H761.083a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,76.147Z" fill="#c8d4e6"></path><path d="M805.134,97.521a9.366,9.366,0,0,0-17.5-2.5,7.5,7.5,0,0,0,.813,14.95H804.7a6.232,6.232,0,0,0,.437-12.45Zm-6.687,3.7v5h-5v-5H789.7l6.25-6.25,6.25,6.25Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No invoices available.<span class="fs-13">Drop PDF files or use the button.</span></div></div>',
                },
                {
                    xtype: 'filebutton',
                    cls: 'a-no-content-btn',
                    text: 'Upload invoice',
                    ui: 'action medium',
                    iconCls: 'md-icon-outlined md-icon-cloud-upload',
                    name: 'files',
                    accept: '.pdf',
                    slug: 'portcallInvoiceCreate',
                    subObject: 'disbursements',
                    bind: {
                        // hidden: '{!canEdit}',
                        cls: '{nonEditable ? "hidden" : ""}',
                        permission: '{userPermissions}',
                        objectPermission: '{objectPermissions}',
                    },
                    listeners: {
                        change: function (me, newValue) {
                            if (newValue) {
                                var files = this.getFiles(),
                                    uploadController = me.up('dialog').getController(),
                                    len = files.length;

                                for (var i = 0; i < len; i++) {
                                    files.item(i).split = null;
                                }
                                uploadController.upload(files, this);
                            }
                            document.querySelector("input[type='file']").value = '';
                            me.setValue(null);
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            cls: 'pdf-preview a-docs-main some_stupid_class',
            masked: {
                xtype: 'loadmask',
            },
            items: [
                {
                    xtype: 'container',
                    id: 'pdf-viewer',
                    listeners: {
                        painted: function () {
                            this.up('dialog').getController().loadViewer();
                        },
                    },
                },
            ],
            bind: {
                hidden: '{vouchers.count ? false : true}',
                cls: 'pdf-preview a-docs-main {selectedVoucher.is_locked ? "a-readonly" : ""}',
            },
        },
    ],
    rbar: {
        xtype: 'panel',
        cls: 'dark rotate_header collapsible_test a-docs-panel',
        bodyBorder: true,
        header: {
            title: {
                bind: {
                    text: '{itemTemplate}',
                },
            },
        },
        viewModel: {
            stores: {
                objectPayments: {
                    source: '{payments}',
                    filters: '{paymentsFilter}',
                },
            },
            formulas: {
                paymentsFilter: {
                    bind: {
                        bindTo: '{vouchersList.selection}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            let store = this.get('objectPayments');
                            if (store) store.clearFilter();

                            return function (rec) {
                                if (
                                    rec.get('paymentable_type') == record.get('model_name') &&
                                    rec.get('paymentable_id') == record.get('id')
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
                title: {
                    bind: {
                        bindTo: '{vouchersList.selection}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) return record.get('default_expense_item_name');

                        return 'No item selected';
                    },
                },
                account: {
                    bind: {
                        bindTo: '{service.account_id}',
                        deep: true,
                    },
                    get: function (id) {
                        if (id) {
                            let accounts = this.get('accounts');
                            let record = accounts.getById(id);
                            if (record) {
                                return record;
                            }
                        }
                    },
                },
                showExchangeRate: {
                    bind: {
                        voucher_currency: '{vouchersList.selection.currency}',
                        account_currency: '{account.account_currency}',
                    },
                    get: function (data) {
                        if (data.voucher_currency && data.account_currency) {
                            if (data.voucher_currency != data.account_currency) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return true;
                    },
                },
                service: {
                    bind: {
                        bindTo: '{vouchersList.selection.expense_id}',
                    },
                    get: function (id) {
                        if (id) {
                            let expenses = this.get('expenses');
                            let record = expenses.getById(id);
                            if (record) {
                                return record;
                            }
                        }
                        return false;
                    },
                },
                itemTemplate: {
                    bind: {
                        bindTo: '{service}',
                    },
                    get: function (record) {
                        if (record) {
                            return (
                                '<div class="hbox rotate_title"><div class="a-badge a-badge-' +
                                record.get('default_expense_item').category.name +
                                '"><i></i></div><div class="title_text ml-12"><div class="fw-b c-white">' +
                                record.get('default_expense_item_name') +
                                '</div><div class="sm-title">' +
                                Ext.String.capitalize(record.get('default_expense_item').type.name) +
                                '</div></div>'
                            );
                        }
                        return '<div class="fw-b c-white">Unassigned</div>';
                    },
                },
            },
        },
        maxWidth: 480,
        zIndex: 998,
        layout: {
            type: 'vbox',
            align: 'stretch',
        },
        hidden: true,
        bind: {
            hidden: '{vouchers.count ? false : true}',
            collapsible: {
                direction: 'right',
                // dynamic: true,
                // collapsed: true,
                collapseAnimation: false,
                expandAnimation: false,
                tool: {
                    ui: 'dark',
                },
                drawer: {
                    xtype: 'panel',
                    cls: 'dark rotate_header collapsible_test a-docs-panel',
                    top: 0,
                    left: 0,
                    cls: Ext.baseCSSPrefix + 'drawer dark collapsible_test a-docs-panel',
                    header: false,
                    title: {
                        text: '{itemTemplate}',
                    },
                },
            },
        },
        weight: 1,
        flex: 1,
        scrollable: true,
        items: [
            {
                xtype: 'voucher-item-form',
            },
        ],
    },
    bind: {
        listeners: '{dragListeners}',
    },
});

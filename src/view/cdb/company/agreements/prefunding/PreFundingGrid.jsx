import '../../../../../model/agreements/AgreementPrefunding';
import './CreatePreFunding';
import './PreFundingEditMenu';

Ext.define('Abraxa.view.cdb.company.agreements.prefunding.PreFundingGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'agreements.prefunding.grid',
    flex: 1,
    ui: 'bordered',
    scrollable: true,
    itemId: 'prefundingGrid',
    testId: 'prefundingGrid',
    cls: 'a-detailed-grid a-pre-funding-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'prefundingGrid-grid-state',
    plugins: {
        gridviewoptions: true,
    },
    selectable: {
        headerCheckbox: false,
        mode: 'multi',
        checkbox: true,
        checkboxDefaults: {
            xtype: 'selectioncolumn',
            text: null,
            dataIndex: '',
            subObject: 'supply',
            bind: {
                cls: '{nonEditable ? "hidden" : ""}',
                objectPermission: '{objectPermissions}',
            },
            cell: {
                hideMode: 'opacity',
                bind: {
                    disabled: '{record.is_locked}',
                    hidden: '{record.is_locked}',
                },
            },
            width: 30,
            listeners: {
                checkchange: function(me, rowIndex, checked, record, e, eOpts) {
                    if (checked) {
                        record.set('is_checked', true);
                    } else {
                        record.set('is_checked', false);
                        // Ext.Array.each(selections, function (value, index) {
                        //     if (value.get('id') == record.get('id')) {
                        //         selections.splice(index, 1);
                        //     }
                        // });
                        // me.up('grid').select(selections);
                    }
                },
            },
        },
    },
    bind: {
        store: '{prefundings}',
        hideHeaders: '{prefundings.count ? false : true}',
        // grouped: '{prefundings.count > 1 ? true : false}'
    },
    reference: 'prefundingGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function() {
            let record = this.upVM().get('prefundingGrid.selection'),
                grid = Ext.ComponentQuery.query('agreements\\.prefunding\\.grid')[0];

            if (record) {
                record.reject();
            }
            grid.deselectAll();
        },
    },
    groupHeader: {
        cls: 'a-header-offset-x24',
        tpl: new Ext.XTemplate(
            '<div class="a-header-{[this.parceString(values.name)]}">{[this.parceString(values.name)]} ({count})</div>',
            {
                parceString: function(value) {
                    if (value == '1') {
                        return 'Active';
                    } else {
                        return 'Disabled';
                    }
                },
            },
        ),
    },
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
                testId: 'prefundingGridNoPrefundingsFoundDiv',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-811 -349)"><circle cx="62" cy="62" r="62" transform="translate(811 349)" fill="#e9ecef" opacity="0.4"/><path d="M41.5,26.5V8.5A4.513,4.513,0,0,0,37,4H5.5A4.513,4.513,0,0,0,1,8.5v18A4.513,4.513,0,0,0,5.5,31H37A4.513,4.513,0,0,0,41.5,26.5Zm-4.5,0H5.5V8.5H37ZM21.25,10.75A6.75,6.75,0,1,0,28,17.5,6.741,6.741,0,0,0,21.25,10.75Zm29.25,0V35.5A4.513,4.513,0,0,1,46,40H7.75V35.5H46V10.75Z" transform="translate(847.25 389)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No pre-funding available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Pre-funding',
                testId: 'prefundingGridPrefundBtn',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'cdbAgreementsPrefundingCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function(me) {
                    let record = me.upVM().get('object_record'),
                        currentUser = me.upVM().get('currentUser');
                    Ext.create('Abraxa.view.cdb.company.agreements.prefunding.CreatePreFunding', {
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                preFundingAdvanced: false,
                                selectedCompany: record,
                                prefunding: Ext.create('Abraxa.model.agreements.AgreementPrefunding', {
                                    organization_org_id: record.get('org_id'),
                                    threshold_operator: '>',
                                    threshold_currency: currentUser.getCompany().get('default_currency'),
                                    active: 1,
                                }),
                            },
                        },
                    }).show();
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    itemConfig: {
        height: 56,
        bind: {
            cls: 'a-detailed-item {styleRow}',
        },
        viewModel: {
            formulas: {
                styleRow: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function(record) {
                        if (record) {
                            if (record.get('active')) {
                                return 'item-active';
                            } else {
                                return 'item-inactive';
                            }
                        }
                    },
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            bind: {
                hidden: '{prefundings.count ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    margin: '8 16 8 24',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Pre-funding',
                            testId: 'prefundingGridPrefundSmallBtn',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            height: 30,
                            slug: 'cdbAgreementsPrefundingCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function(me) {
                                let record = me.upVM().get('object_record'),
                                    currentUser = me.upVM().get('currentUser');
                                Ext.create('Abraxa.view.cdb.company.agreements.prefunding.CreatePreFunding', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            preFundingAdvanced: false,
                                            selectedCompany: record,
                                            prefunding: Ext.create('Abraxa.model.agreements.AgreementPrefunding', {
                                                organization_org_id: record.get('org_id'),
                                                threshold_operator: '>',
                                                threshold_currency: currentUser.getCompany().get('default_currency'),
                                                active: 1,
                                            }),
                                        },
                                    },
                                }).show();
                            },
                        },
                        {
                            xtype: 'div',
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'container',
                                    padding: '0 8 0 0',
                                    layout: 'hbox',
                                    hidden: true,
                                    showAnimation: 'fade',
                                    bind: {
                                        cls: '{nonEditable ? "hidden" : ""} a-br-100',
                                        hidden: '{prefundingGrid.selection ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility',
                                            text: 'Enable',
                                            testId: 'prefundingGridEnableBtn',
                                            slug: 'cdbAgreementsPrefundingActivate',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function(me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    prefundings = vm.get('prefundings'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Enable',
                                                    'Are you sure you want to enable this pre-fundings?',
                                                    function(answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function(rec, index) {
                                                                rec.set('active', 1);
                                                            });
                                                            prefundings.sync({
                                                                success: function(err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                                failure: function(batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not enable record!',
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
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'action loading',
                                                            text: 'Enable',
                                                        },
                                                    ],
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility-off',
                                            text: 'Disable',
                                            testId: 'prefundingGridDisableBtn',
                                            slug: 'cdbAgreementsPrefundingActivate',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function(me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    prefundings = vm.get('prefundings'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Disable',
                                                    'Are you sure you want to disable this pre-fundings?',
                                                    function(answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function(rec, index) {
                                                                rec.set('active', 0);
                                                            });
                                                            prefundings.sync({
                                                                success: function(err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
                                                                },
                                                                failure: function(batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not disable record!',
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
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Disable',
                                                        },
                                                    ],
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            text: 'Delete',
                                            testId: 'prefundingGridDeleteBtn',
                                            slug: 'cdbAgreementsPrefundingDelete',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function(me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    prefundings = vm.get('prefundings'),
                                                    selections = grid.getSelections();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete this pre-fundings?',
                                                    function(answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function(rec, index) {
                                                                prefundings.remove(rec);
                                                            });
                                                            prefundings.sync({
                                                                success: function(err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
                                                                },
                                                                failure: function(batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not delete record!',
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
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ],
                                                );
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: '0 8 0 0',
                                    layout: 'hbox',
                                    hidden: true,
                                    showAnimation: 'fade',
                                    bind: {
                                        hidden: '{prefundings.count ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-settings',
                                            text: 'Customize',
                                            testId: 'prefundingGridCustomizeBtn',
                                            margin: '0 0 0 8',
                                            handler: function() {
                                                this.find('prefundingGrid')
                                                    .getPlugin('gridviewoptions')
                                                    .showViewOptions();
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
    ],

    columns: [
        {
            text: 'Item',
            dataIndex: 'payment_term_name',
            cell: {
                encodeHtml: false,
            },
            minWidth: 220,
            flex: 4,
            renderer: function(val, record) {
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-prefunding"><i class="md-icon-outlined">payments</i></div><div class="ml-12"><div class="text-truncate fw-b">' +
                        val +
                        '</div></div></div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Function',
            dataIndex: 'port_function',
            minWidth: 160,
            cell: {
                cls: 'expand a-cell-function',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                if (val) {
                    return '<div class="a-function function-' + val + '"><span>' + val + '</span></div>';
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Agency type',
            dataIndex: 'agency_type_id',
            minWidth: 160,
            cell: {
                encodeHtml: false,
            },
            renderer: function(value, record) {
                if (value) {
                    return record.get('agency_type_name');
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Percentage',
            dataIndex: 'percentage',
            minWidth: 100,
            cell: {
                encodeHtml: false,
            },
            renderer: function(value) {
                if (value) {
                    return '<span class="fw-b c-link">' + value + '%</span>';
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Threshold',
            dataIndex: 'record',
            minWidth: 120,
            cell: {
                cls: 'a-cell-bl a-cell-br',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                if (record) {
                    let threshold_amount = '',
                        threshold_operator = '',
                        threshold_currency = record.get('threshold_currency');
                    if (record.get('threshold_operator') || record.get('threshold_amount')) {
                        threshold_operator = record.get('threshold_operator');
                        threshold_amount = record.get('threshold_amount');
                        return (
                            '<span class="fw-b">' +
                            threshold_operator +
                            ' ' +
                            threshold_currency +
                            ' ' +
                            numeral(threshold_amount).format('0,0.[000]') +
                            '</span>'
                        );
                    } else {
                        return AbraxaConstants.placeholders.emptyValue;
                    }
                }
            },
        },
        {
            text: 'Ports',
            dataIndex: 'port_ids',
            minWidth: 220,
            cell: {
                cls: 'expand a-cell-port',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                if (val) {
                    if (val.length > 1) {
                        return '<span class="a_grid_action">Multiple ports' + ' (' + val.length + ')</span>';
                    } else {
                        let porstsServed = Ext.getCmp('main-viewport').getViewModel().get('portsServed'),
                            portsServedRecord = porstsServed.findRecord('port_id', val[0]);
                        if (portsServedRecord) {
                            return (
                                '<span  class="a_grid_action" data-portid="' +
                                portsServedRecord.get('port_id') +
                                '">' +
                                portsServedRecord.get('port_name') +
                                '</span>'
                            );
                        } else {
                            return AbraxaConstants.placeholders.emptyValue;
                        }
                    }
                } else {
                    return '<span class="a_grid_action">All ports</span>';
                }
            },
        },
        {
            text: 'Validity',
            dataIndex: 'record',
            minWidth: 220,
            hidden: true,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                let validity_from = record.get('validity_from'),
                    validity_to = record.get('validity_to');
                if (validity_from && validity_to) {
                    return (
                        '<span class="hbox"><i class="material-icons-outlined fs-18 c-light-grey mr-8">calendar_today</i>' +
                        moment(validity_from).format('DD/MM/YY') +
                        ' - ' +
                        moment(validity_to).format('DD/MM/YY') +
                        '</span>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Updated by',
            minWidth: 180,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.updated_by_user}',
                            updated_at: '{record.updated_at}',
                        },
                    },
                },
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
            // maxWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        testId: 'prefundingGridMoreActionsTool',
                        slug: 'portcall',
                        bind: {
                            hidden: '{nonEditable}',
                            permission: '{userPermissions}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function handler(owner, tool, e) {
                            let record = tool.record,
                                vm = this.up('grid').upVM();
                            this.up('grid').deselectAll();
                            Ext.create('Abraxa.view.cdb.company.agreements.prefunding.PreFundingEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        prefunding: record,
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function(grid, location) {
            if (location.record && location.columnIndex != 0) {
                location.record.set('is_checked', false);
            }
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
    },
});

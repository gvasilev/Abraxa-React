import './CreateInstructions';
import './InstructionsEditMenu';
import '../../../../../model/cdb/StandardInstructions';
Ext.define('Abraxa.view.cdb.company.agreements.standardInstructions.InstructionsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'agreements.instructions.grid',
    flex: 1,
    ui: 'bordered',
    scrollable: true,
    itemId: 'instructionsGrid',
    testId: 'instructionsGrid',
    cls: 'a-detailed-grid a-instructions-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'instructionsGrid-grid-state',
    plugins: {
        gridviewoptions: true,
    },
    bind: {
        store: '{instructions}',
        hideHeaders: '{instructions.count ? false : true}',
    },
    reference: 'instructionGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    grouped: false,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('instructionGrid.selection'),
                grid = Ext.ComponentQuery.query('agreements\\.instructions\\.grid')[0];

            if (record) {
                record.reject();
            }
            grid.deselectAll();
        },
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
                testId: 'instructionsGridNoInstructionsDiv',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9972 -18910)"><g transform="translate(9138 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(10007 18945)"><path d="M13,33.5H31V38H13Zm0-9H31V29H13ZM26.5,2H8.5A4.513,4.513,0,0,0,4,6.5v36A4.494,4.494,0,0,0,8.477,47H35.5A4.513,4.513,0,0,0,40,42.5v-27Zm9,40.5H8.5V6.5H24.25V17.75H35.5Z" transform="translate(5 2.5)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1.5"/><g transform="translate(18 18)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1"><rect width="8" height="4.5" stroke="none"/><rect x="0.5" y="0.5" width="7" height="3.5" fill="none"/></g></g></g></svg><div class="a-no-content-txt">No instructions available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Instructions',
                testId: 'instructionsGridCreateInstructionsBtn',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'cdbAgreementsInstructionsCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (me) {
                    let record = me.upVM().get('object_record'),
                        currentUser = me.upVM().get('currentUser');
                    Ext.create('Abraxa.view.cdb.company.agreements.standardInstructions.CreateInstructions', {
                        viewModel: {
                            parent: me.upVM(),
                            stores: {
                                files: Ext.create('Ext.data.Store'),
                                berthFunctions: {
                                    type: 'berth.function',
                                },
                            },
                            data: {
                                editMode: false,
                                organization: record,
                                instruction: Ext.create('Abraxa.model.cdb.StandardInstructions', {
                                    owner_id: record.get('org_id'),
                                    owner_type: record.get('model_name'),
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
                    get: function (record) {
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
            cls: 'a-titlebar a-bb-100',
            weight: 2,
            height: 65,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<span>{agreements_menu.selection.title}</span>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            docked: 'top',
            bind: {
                hidden: '{instructions.count ? false : true}',
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
                            text: 'Instructions',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            testId: 'instructionsGridCreateInstructionsSmallBtn',
                            height: 30,
                            slug: 'cdbAgreementsInstructionsCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let record = me.upVM().get('object_record'),
                                    currentUser = me.upVM().get('currentUser');
                                Ext.create(
                                    'Abraxa.view.cdb.company.agreements.standardInstructions.CreateInstructions',
                                    {
                                        viewModel: {
                                            parent: me.upVM(),
                                            stores: {
                                                files: Ext.create('Ext.data.Store'),
                                                berthFunctions: {
                                                    type: 'berth.function',
                                                },
                                            },
                                            data: {
                                                editMode: false,
                                                organization: record,
                                                instruction: Ext.create('Abraxa.model.cdb.StandardInstructions', {
                                                    owner_id: record.get('org_id'),
                                                    owner_type: record.get('model_name'),
                                                }),
                                            },
                                        },
                                    }
                                ).show();
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
                                            testId: 'instructionsGridCreateEnableBtn',
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    prefundings = vm.get('prefundings'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Enable',
                                                    'Are you sure you want to enable this pre-fundings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                rec.set('active', 1);
                                                            });
                                                            prefundings.sync({
                                                                success: function (err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                                failure: function (batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not enable record!'
                                                                    );
                                                                },
                                                            });
                                                        }
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            testId: 'instructionsGridCreateEnableConfirmNoBtn',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            testId: 'instructionsGridCreateEnableConfirmYesBtn',
                                                            itemId: 'yes',
                                                            ui: 'action loading',
                                                            text: 'Enable',
                                                        },
                                                    ]
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility-off',
                                            text: 'Disable',
                                            testId: 'instructionsGridDisableBtn',
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    prefundings = vm.get('prefundings'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Disable',
                                                    'Are you sure you want to disable this pre-fundings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                rec.set('active', 0);
                                                            });
                                                            prefundings.sync({
                                                                success: function (err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
                                                                },
                                                                failure: function (batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not disable record!'
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
                                                    ]
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            text: 'Delete',
                                            testId: 'instructionsGridDeleteBtn',
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    prefundings = vm.get('prefundings'),
                                                    selections = grid.getSelections();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete this pre-fundings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                prefundings.remove(rec);
                                                            });
                                                            prefundings.sync({
                                                                success: function (err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
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
                                                            testId: 'instructionsGridConfirmDeleteNoBtn',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            testId: 'instructionsGridConfirmDeleteYesBtn',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ]
                                                );
                                            },
                                        },
                                    ],
                                },
                                // {
                                //     xtype: 'container',
                                //     padding: '0 8 0 0',
                                //     layout: 'hbox',
                                //     hidden: true,
                                //     showAnimation: 'fade',
                                //     bind: {
                                //         hidden: '{prefundings.count ? false : true}',
                                //     },
                                //     items: [{
                                //         xtype: 'button',
                                //         ui: 'tool-text-sm',
                                //         iconCls: 'md-icon-outlined md-icon-settings',
                                //         text: 'Customize',
                                //         margin: '0 0 0 8',
                                //         handler: function () {
                                //             this.find('prefundingGrid').getPlugin('gridviewoptions').showViewOptions();
                                //         },
                                //     }]
                                // },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Name',
            cls: 'a-column-offset-x32',
            dataIndex: 'title',
            groupable: false,
            minWidth: 220,
            flex: 4,
            cell: {
                cls: 'a-cell-person a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-default a-badge-x32"><i class="material-icons-outlined">description</i></div><div class="ml-12 text-truncate"><a href="javascript:void(0);" class="fw-b">' +
                        value +
                        '</a></div></div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Rules',
            dataIndex: 'auto_update',
            minWidth: 100,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                let str = '<span class="a-cell-placeholder">---</span>';
                if (record && record.rules) {
                    let rules = record.rules();
                    if (rules && rules.count()) {
                        str =
                            '<span class="a-status-badge status-admin a-status-sm status-round">' +
                            rules.count() +
                            '</span>';
                    }
                }
                return str;
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
                        testId: 'instructionsGridMoreActionsTool',
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
                            Ext.create('Abraxa.view.cdb.company.agreements.standardInstructions.InstructionsEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        instruction: record,
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        testId: 'instructionsGridViewDetailsBtn',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
    },
});

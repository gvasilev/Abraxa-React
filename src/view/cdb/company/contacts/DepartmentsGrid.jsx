import './CreateDepartment';
import './DepartmentsEditMenu';
Ext.define('Abraxa.view.cdb.company.contacts.DepartmentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'departments.grid',
    flex: 1,
    ui: 'bordered',
    scrollable: true,
    itemId: 'departmentsGrid',
    testId: 'departmentsGrid',
    cls: 'a-detailed-grid a-departments-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'departments-grid-state',
    plugins: {
        gridviewoptions: true,
    },
    store: [],
    bind: {
        store: '{departments}',
        hideHeaders: '{departments.count ? false : true}',
    },
    reference: 'departmentsGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('departmentsGrid.selection'),
                grid = Ext.ComponentQuery.query('departments\\.grid')[0];

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
                testId: 'departmentsGridNoDepartmentsDiv',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-1012 -640)"><g transform="translate(178 295)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(1042 670)"><path d="M28.667,13.667V3H2V51H55.333V13.667Zm-5.333,32h-16V40.333h16Zm0-10.667h-16V29.667h16Zm0-10.667h-16V19h16Zm0-10.667h-16V8.333h16ZM50,45.667H28.667V19H50ZM44.667,24.333H34v5.333H44.667Zm0,10.667H34v5.333H44.667Z" transform="translate(3.333 5)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/></g></g></svg><div class="a-no-content-txt">No departments available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Department',
                testId: 'departmentsGridDepartmentBtn',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'cdbDepartmentCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (me) {
                    let record = me.upVM().get('object_record'),
                        currentUser = me.upVM().get('currentUser');
                    Ext.create('Abraxa.view.cdb.company.contacts.CreateDepartment', {
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                selectedCompany: record,
                                department: Ext.create('Abraxa.model.cdb.Department', {
                                    dept_org_id: record.get('org_id'),
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
            items: [
                {
                    xtype: 'container',
                    margin: '8 16 8 24',
                    bind: {
                        hidden: '{departments.count ? false : true}',
                    },
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Department',
                            testId: 'departmentsGridDepartmentSmallBtn',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            height: 30,
                            slug: 'cdbDepartmentCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let record = me.upVM().get('object_record'),
                                    currentUser = me.upVM().get('currentUser');
                                Ext.create('Abraxa.view.cdb.company.contacts.CreateDepartment', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            selectedCompany: record,
                                            department: Ext.create('Abraxa.model.cdb.Department', {
                                                dept_org_id: record.get('org_id'),
                                            }),
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

    columns: [
        {
            text: 'Department',
            dataIndex: 'dept_name',
            cls: 'a-column-offset-x24',
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
            flex: 1.5,
            renderer: function (val, record) {
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-default"><i class="md-icon-outlined">corporate_fare</i></div><div class="ml-12"><div class="text-truncate fw-b">' +
                        val +
                        '</div></div></div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Email',
            dataIndex: 'dept_email',
            flex: 1,
            cell: {
                cls: 'expand a-cell-port',
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return (
                        '<div class="a-email c-blue-grey"><i class="md-icon-outlined">mail</i><span class="text-truncate">' +
                        value +
                        '</span></div>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Phone',
            dataIndex: 'dept_phone',
            flex: 1,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return '<div class="a-phone c-blue-grey"><i class="md-icon-outlined">phone</i> ' + value + '</div>';
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Updated by',
            flex: 1,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
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
            maxWidth: 110,
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
                        testId: 'departmentsGridMoreActionsTool',
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
                            Ext.create('Abraxa.view.cdb.company.contacts.DepartmentsEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        department: record,
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        testId: 'departmentsGridViewDetailsBtn',
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
            if (location.record && location.columnIndex != 0) {
                location.record.set('is_checked', false);
            }
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
    },
});

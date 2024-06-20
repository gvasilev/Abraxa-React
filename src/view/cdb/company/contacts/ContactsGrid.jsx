import './AddContact';
import './ContactEditMenu';

Ext.define('Abraxa.view.cdb.company.contacts.ContactsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'contacts.grid',
    flex: 1,
    ui: 'bordered',
    scrollable: true,
    itemId: 'contactsGrid',
    cls: 'abraxa-grid a-offset-grid a-company-contacts-grid contact_grid',
    stateful: ['plugins', 'columns'],
    stateId: 'contacts-grid-state',
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
            grouped: false,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            dataIndex: '',
            cell: {
                hideMode: 'opacity',
            },
            width: 56,
            listeners: {
                checkchange: function (me, rowIndex, checked, record, e, eOpts) {
                    if (checked) {
                        record.set('is_checked', true);
                    } else {
                        record.set('is_checked', false);
                    }
                },
            },
        },
    },
    bind: {
        store: '{contacts}',
        hideHeaders: '{contacts.count ? false : true}',
    },
    reference: 'contactsGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('billingGrid.selection'),
                grid = Ext.ComponentQuery.query('agreements\\.billing\\.grid')[0];

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
                parceString: function (value) {
                    if (value == '1') {
                        return 'Active';
                    } else {
                        return 'Disabled';
                    }
                },
            }
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-1012 -640)"><g transform="translate(178 295)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(1042 670)"><path d="M20.667,23.667a9.333,9.333,0,1,0-9.333-9.333A9.344,9.344,0,0,0,20.667,23.667Zm0-13.333a4,4,0,1,1-4,4A3.995,3.995,0,0,1,20.667,10.333ZM20.8,37H9.387a27.664,27.664,0,0,1,11.28-2.667c.293,0,.613.027.907.027a12.213,12.213,0,0,1,4.373-4.827A31.269,31.269,0,0,0,20.667,29C14.427,29,2,32.12,2,38.333v4H20.667v-4A7.291,7.291,0,0,1,20.8,37Zm19.867-6.667c-4.907,0-14.667,2.693-14.667,8v4H55.333v-4C55.333,33.027,45.573,30.333,40.667,30.333Zm3.227-4.853a6.667,6.667,0,1,0-6.453,0,6.527,6.527,0,0,0,6.453,0Z" transform="translate(3.333 8.333)" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No contacts available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Contact',
                testId: 'contactsGridAddContactButton',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                hideMode: 'opacity',
                slug: 'cdbContactCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (btn, e) {
                    let record = this.upVM().get('object_record'),
                        companyId = record.get('org_id'),
                        vm = this.upVM();
                    mixpanel.track('+ Contact button clicked');
                    Ext.create('Abraxa.view.cdb.company.contacts.AddContact', {
                        viewModel: {
                            parent: vm,
                            data: {
                                selectedContact: new Abraxa.model.cdb.Contact({
                                    contact_org_id: companyId,
                                }),
                                createFromTabs: true,
                                isGlobal: false,
                                selectedCompany: record,
                                is_created: true,
                            },
                            stores: {
                                contacts: record.contacts(),
                                departments: record.departments(),
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
            bind: {
                hidden: '{contacts.count ? false : true}',
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
                            ui: 'action small',
                            height: 30,
                            text: 'Contact',
                            testId: 'contactsGridAddContactButtonSmall',
                            iconCls: 'md-icon-add',
                            slug: 'cdbContactCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (btn, e) {
                                let record = this.upVM().get('object_record'),
                                    companyId = record.get('org_id'),
                                    vm = this.upVM();
                                Ext.create('Abraxa.view.cdb.company.contacts.AddContact', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            selectedContact: new Abraxa.model.cdb.Contact({
                                                contact_org_id: companyId,
                                            }),
                                            createFromTabs: true,
                                            isGlobal: false,
                                            selectedCompany: record,
                                            is_created: true,
                                        },
                                        stores: {
                                            contacts: record.contacts(),
                                            departments: record.departments(),
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
                                        hidden: '{contactsGrid.selection ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            text: 'Delete',
                                            slug: 'cdbContactDelete',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    contacts = vm.get('contacts'),
                                                    selections = grid.getSelections();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete these records?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                contacts.remove(rec);
                                                            });
                                                            contacts.sync({
                                                                success: function (err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
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
                                                    ]
                                                );
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-settings',
                                    text: 'Customize',
                                    margin: '0 0 0 8',
                                    handler: function () {
                                        this.find('contactsGrid').getPlugin('gridviewoptions').showViewOptions();
                                    },
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
            text: 'Name',
            cls: 'a-column-name a-column-offset-x16',
            flex: 1.5,
            dataIndex: 'contact_full_name',
            cell: {
                cls: 'a-cell-person a-cell-nospace a-cell-offset-x16',
                encodeHtml: false,
            },
            grouped: false,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            renderer: function (val, record) {
                return [
                    '<div class="a-person"><i class="md-icon-outlined">person</i><span class="text-truncate fw-b">' +
                        record.data.contact_first_name +
                        ' ' +
                        record.data.contact_last_name +
                        '</span></div>',
                ].join('');
            },
        },
        {
            text: 'Department',
            dataIndex: 'contact_org_department',
            flex: 1,
            grouped: false,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            cell: {
                cls: 'a-cell-department',
                encodeHtml: false,
            },
            renderer: function (val, rec) {
                // if (!val) return '';
                let store = this.upVM().get('departments');
                var record = store.getById(val);
                if (record) {
                    var dept_name = record.get('dept_name');
                    return (
                        '<div class="a-hbox c-blue-grey"><i class="md-icon-outlined">corporate_fare</i>' +
                        dept_name +
                        '</div>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Position',
            dataIndex: 'contact_position',
            flex: 1,
            grouped: false,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            cell: {
                cls: 'a-cell-position',
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Email',
            dataIndex: 'contact_email',
            minWidth: 220,
            flex: 1,
            grouped: false,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            cell: {
                cls: 'a-cell-email',
                encodeHtml: false,
            },
            renderer: function (val) {
                return val
                    ? '<div class="a-email c-blue-grey"><i class="md-icon-outlined">mail</i><span class="text-truncate">' +
                          val +
                          '</span></div>'
                    : '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Phone',
            dataIndex: 'contact_phone',
            flex: 1,
            grouped: false,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            cell: {
                cls: 'a-cell-phone',
                encodeHtml: false,
            },
            renderer: function (val) {
                return val
                    ? '<div class="a-phone c-blue-grey"><i class="md-icon-outlined">phone</i> ' + val + '</div>'
                    : '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: '',
            minWidth: 96,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cls: 'a-column-actions',
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
                            Ext.create('Abraxa.view.cdb.company.contacts.ContactEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        selectedContact: record,
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
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

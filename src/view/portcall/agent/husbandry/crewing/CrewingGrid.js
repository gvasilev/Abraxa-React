Ext.define('Abraxa.view.portcall.husbandry.crewing.CrewingGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'husbandry.crewing.grid',
    testId: 'husbandryCrewingGrid',
    flex: 1,
    ui: 'bordered',
    cls: 'a-detailed-grid a-crewing-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'crewingGrid-grid-state',
    reference: 'crewingGrid',
    controller: 'crewing-controller',
    itemId: 'crewingGrid',
    // scrollToTopOnRefresh: false,
    // loadingText: false,
    plugins: {
        gridviewoptions: true,
    },
    keyMapEnabled: true,
    loadingText: false,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('crewingGrid.selection'),
                grid = Ext.ComponentQuery.query('husbandry\\.crewing\\.grid')[0];

            if (record) {
                record.reject();
                if (record.services()) {
                    record.services().rejectChanges();
                }
            }
            grid.deselectAll();
        },
    },
    selectable: {
        headerCheckbox: false,
        mode: 'multi',
        checkbox: true,
        checkboxDefaults: {
            xtype: 'selectioncolumn',
            text: null,
            dataIndex: '',
            width: 30,
            subObject: 'crewing',
            bind: {
                cls: '{nonEditable ? "hidden" : ""}',
                objectPermission: '{objectPermissions}',
            },
            listeners: {
                checkchange: function (me, rowIndex, checked, record, e, eOpts) {
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
    slug: 'portcallCrewing',
    showNoPermissions: true,
    skipEditPermission: true,
    bind: {
        permission: '{userPermissions}',
        store: '{crewings}',
        cls: '{nonEditable ? "a-crewing-grid-noneditable" : ""} a-detailed-grid a-crewing-grid abraxa-grid',
        // selectable: '{selectableCrewing}',
        hideHeaders: '{crewings.count ? false : true}',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-1012 -640)"><g transform="translate(178 295)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(1042 670)"><path d="M20.667,23.667a9.333,9.333,0,1,0-9.333-9.333A9.344,9.344,0,0,0,20.667,23.667Zm0-13.333a4,4,0,1,1-4,4A3.995,3.995,0,0,1,20.667,10.333ZM20.8,37H9.387a27.664,27.664,0,0,1,11.28-2.667c.293,0,.613.027.907.027a12.213,12.213,0,0,1,4.373-4.827A31.269,31.269,0,0,0,20.667,29C14.427,29,2,32.12,2,38.333v4H20.667v-4A7.291,7.291,0,0,1,20.8,37Zm19.867-6.667c-4.907,0-14.667,2.693-14.667,8v4H55.333v-4C55.333,33.027,45.573,30.333,40.667,30.333Zm3.227-4.853a6.667,6.667,0,1,0-6.453,0,6.527,6.527,0,0,0,6.453,0Z" transform="translate(3.333 8.333)" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No visitors available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Visitor',
                testId: 'husbandryCrewingGridVisitorBtn',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'portcallCrewing',
                subObject: 'crewing',
                bind: {
                    objectPermission: '{objectPermissions}',
                    cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                    permission: '{userPermissions}',
                },
                handler: 'create',
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
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
                            text: 'Visitor',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            testId: 'husbandryCrewingGridVisitorSmallBtn',
                            slug: 'portcallCrewing',
                            subObject: 'crewing',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{crewingsRealCount ? false : true}',
                            },
                            handler: 'create',
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
                                    slug: 'portcall',
                                    subObject: 'crewing',
                                    hidden: true,
                                    showAnimation: 'fade',
                                    bind: {
                                        cls: '{nonEditable ? "hidden" : ""} a-br-100',
                                        permission: '{userPermissions}',
                                        hidden: '{crewingGrid.selection ? false : true}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-assistant',
                                            text: 'Assign service',
                                            arrow: false,
                                            slug: 'portcallCrewingAssignService',
                                            subObject: 'crewing',
                                            bind: {
                                                cls: '{nonEditable ? "hidden" : ""}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    selections = grid.getSelections();
                                                if (selections.length === 0) {
                                                    Ext.Msg.alert('Suggestion', 'Please select at least one member.');
                                                } else {
                                                    let selectedIds = [];
                                                    Ext.each(selections, function (value, index) {
                                                        selectedIds.push(value.get('id'));
                                                    });
                                                    Ext.create(
                                                        'Abraxa.view.portcall.husbandry.crewing.AssignServices',
                                                        {
                                                            viewModel: {
                                                                parent: vm,
                                                                data: {
                                                                    selectedIds: selectedIds,
                                                                    grid: grid,
                                                                    appointmentId: vm.get('object_record').get('id'),
                                                                },
                                                            },
                                                        }
                                                    ).show();
                                                }
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            text: 'Delete',
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    crewings = vm.get('crewings'),
                                                    selections = grid.getSelections();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete this crewings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                crewings.remove(rec);
                                                            });
                                                            crewings.sync({
                                                                success: function (err, msg) {
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
                                    xtype: 'container',
                                    padding: '0 8 0 0',
                                    layout: 'hbox',
                                    slug: 'portcall',
                                    subObject: 'crewing',
                                    showAnimation: 'fade',
                                    bind: {
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            enableToggle: true,
                                            iconCls: 'md-icon-filter-alt md-icon-outlined',
                                            text: 'Filter',
                                            bind: {
                                                hidden: '{crewingsRealCount ? false : true}',
                                            },
                                            handler: function () {
                                                Ext.select('.a-filters').toggleCls('is-hidden');
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-settings',
                                            text: 'Customize',
                                            margin: '0 0 0 8',
                                            bind: {
                                                hidden: '{crewings.count ? false : true}',
                                            },
                                            handler: function () {
                                                this.find('crewingGrid').getPlugin('gridviewoptions').showViewOptions();
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            iconCls: 'md-icon-more-horiz',
                                            ui: 'round tool-sm',
                                            arrow: false,
                                            tooltip: {
                                                anchorToTarget: true,
                                                align: 'bc-tc?',
                                                html: 'More actions',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                closeAction: 'destroy',
                                            },
                                            menu: {
                                                items: [
                                                    {
                                                        xtype: 'upload.button',
                                                        ui: 'menu-item',
                                                        section: 'crewing',
                                                        storeForReload: 'crewings',
                                                        text: 'Import',
                                                        slug: 'portcallCrewingImport',
                                                        bind: {
                                                            cls: '{nonEditable ? "hidden" : ""}',
                                                            permission: '{userPermissions}',
                                                        },
                                                    },
                                                    {
                                                        iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                                        text: 'Export to PDF',
                                                        slug: 'portcallCrewingExport',
                                                        bind: {
                                                            permission: '{userPermissions}',
                                                            hidden: '{crewings.count ? false : true}',
                                                        },
                                                        handler: function (me) {
                                                            let grid = me.up('grid'),
                                                                visibleColumns = grid
                                                                    .getHeaderContainer()
                                                                    .getVisibleColumns(),
                                                                store = grid.getStore(),
                                                                columns = [],
                                                                ids = [];
                                                            Ext.Array.each(visibleColumns, function (value) {
                                                                if (value.getDataIndex()) {
                                                                    columns.push(value.getDataIndex());
                                                                }
                                                            });
                                                            Ext.Array.each(store.getRange(), function (value) {
                                                                ids.push(value.get('id'));
                                                            });
                                                            Abraxa.export.crewing(ids, columns);
                                                            // let record = me.upVM().get('object_record'),
                                                            //     sections = [
                                                            //         'crewing'
                                                            //     ];
                                                            // Abraxa.export.portcall(record.get('id'), sections);
                                                            mixpanel.track('Exported Crewiing/Visitors');
                                                        },
                                                    },
                                                    {
                                                        iconCls: 'md-icon-outlined md-icon-save-alt',
                                                        text: 'Template',
                                                        handler: function () {
                                                            let urlToSend =
                                                                    'https://static.abraxa.com/resources/Crewing%20import%20template.xlsx',
                                                                form = Ext.DomHelper.append(document.body, {
                                                                    tag: 'form',
                                                                    method: 'get',
                                                                    standardSubmit: true,
                                                                    action: urlToSend,
                                                                });
                                                            document.body.appendChild(form);
                                                            form.submit();
                                                            document.body.removeChild(form);
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                //Container za fitri ako se naloji prepravqne!
                {
                    xtype: 'container',
                    cls: 'a-filters a-filters-bordered is-hidden',
                    layout: {
                        type: 'hbox',
                    },
                    items: [
                        {
                            text: 'Type',
                            ui: 'filter round',
                            xtype: 'splitbutton',
                            handler: function () {
                                this.showMenu();
                            },
                            arrowHandler: function () {
                                let button = this,
                                    arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                                    crewings = this.upVM().get('crewings');
                                if (!arrowCls) {
                                    let selected = Ext.ComponentQuery.query(
                                        'menuitem[cls~=taskFilterItem][checked="true"]'
                                    );
                                    Ext.each(selected, function (value, index) {
                                        value.setChecked(false);
                                    });
                                    button.setText('Type');
                                    button.splitArrowElement.removeCls('md-icon-close');
                                    button.splitArrowElement.addCls('x-arrow-el');
                                    button.removeCls('active');
                                    crewings.removeFilter('type');
                                    this.hideMenu();
                                    return;
                                }
                            },
                            menu: {
                                cls: 'filter-menu',
                                defaults: {
                                    cls: 'taskFilterItem',
                                    handler: function (me) {
                                        let button = this.up('button'),
                                            store = this.upVM().get('crewings');
                                        button.setText(this.getText());
                                        button.getMenu().arrowCls = 'delete';
                                        button.splitArrowElement.removeCls('x-arrow-el');
                                        button.splitArrowElement.addCls('md-icon-close');
                                        button.addCls('active');
                                        store.addFilter({
                                            id: 'type',
                                            filterFn: function (record) {
                                                if (record.get('type_name') == me.getValue()) {
                                                    return true;
                                                }
                                            },
                                        });
                                    },
                                },
                                items: [
                                    {
                                        text: 'Crew',
                                        group: 'status',
                                        value: 'Crew',
                                    },
                                    {
                                        text: 'Visitor',
                                        group: 'status',
                                        value: 'Visitor',
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Name',
            dataIndex: 'name',
            cls: 'a-column-name',
            // isHeaderContainer: 'false',
            // items: [{
            //     xtype: 'div',
            //     cls: 'cursor-pointer',
            //     html: '<a><strong>PDA</strong><a/>'
            // }, {
            //     xtype: 'div',
            //     html: '<div class="a-status-badge a-status-sm status-completed">Completed</div>'
            // }],
            cell: {
                cls: 'a-cell-name',
                encodeHtml: false,
            },
            flex: 1,
            minWidth: 220,
            renderer: function renderer(val) {
                return (
                    '<a class="a-person a-person-x30 d-flex" href="javascript:void(0)"><i class="md-icon-outlined">person</i><span class="fw-b text-truncate">' +
                    val +
                    '</span></a>'
                );
            },
        },
        {
            text: 'Email',
            dataIndex: 'email',
            slug: 'portcallCrewing',
            bind: {
                permission: '{userPermissions}',
            },
            cell: {
                cls: 'a-cell-email',
                encodeHtml: false,
            },
            minWidth: 240,
            renderer: function renderer(val) {
                if (val) {
                    // return '<div class="a-status-badge status-xl status-' + val.toLowerCase() + '">' + val + '</div>';
                    return '<div class="a-email"><i class="md-icon-outlined md-18">mail</i>' + val + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Type',
            minWidth: 120,
            dataIndex: 'type_name',
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                return '<div class="a-status-badge a-status-md status-' + val.toLowerCase() + '">' + val + '</div>';
            },
        },
        {
            text: 'Action',
            minWidth: 120,
            dataIndex: 'action_name',
            slug: 'portcallCrewing',
            bind: {
                permission: '{userPermissions}',
            },
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return '<div class="">' + val + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'ISPS cleared',
            minWidth: 120,
            dataIndex: 'isps',
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                let str = '',
                    icon = '';
                if (val == 1) {
                    str = '<div class="a-check"><i class="md-icon-outlined c-green">done</i>Yes</div>';
                } else {
                    str = '<div class="a-check"><i class="md-icon-outlined c-red">close</i>No</div>';
                }
                if (str.length > 0) {
                    return '' + icon + str + ' ';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'ID type',
            minWidth: 120,
            dataIndex: 'id_type',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    // if (val == 'driver license')
                    //     return "<div> Driver's license</div>";

                    if (val != 'eu id card') return '<div class="">' + Ext.String.capitalize(val) + '</div>';

                    return '<div class="">EU ID card</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'ID number',
            minWidth: 120,
            dataIndex: 'id_number',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return '<div class="">' + val + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'COVID-19 cleared',
            minWidth: 140,
            dataIndex: 'covid19',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    if (val == 'yes') {
                        str = '<div class="a-check"><i class="md-icon-outlined c-green">done</i>Yes</div>';
                    } else if (val == 'pending') {
                        str = '<div class="a-check"><i class="md-icon-outlined c-light-grey">timer</i>Pending</div>';
                    } else {
                        str = '<div class="a-check"><i class="md-icon-outlined c-red">close</i>No</div>';
                    }
                    return str;
                }
            },
        },
        {
            text: 'Mobile',
            minWidth: 120,
            dataIndex: 'phone',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return '<div class="">' + val + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Company',
            minWidth: 220,
            dataIndex: 'company',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return '<div class="">' + val + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Vehicle',
            minWidth: 120,
            dataIndex: 'vehicle_type',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return '<div class="">' + Ext.String.capitalize(val) + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Registration plate',
            minWidth: 140,
            dataIndex: 'registration_plate',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return '<div class="">' + val + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Date of birth',
            minWidth: 120,
            dataIndex: 'date_of_birth',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return (
                        '<div class="">' +
                        moment(val).format(AbraxaConstants.formatters.date.dayMonthYearSlash) +
                        '</div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Nationality',
            minWidth: 120,
            dataIndex: 'nationality',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                if (val) {
                    return '<div class="">' + record.get('nationality') + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Rank',
            minWidth: 120,
            dataIndex: 'rank',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return '<div class="">' + val + '</div>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Schengen visa',
            minWidth: 120,
            dataIndex: 'schengen_visa',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                let str = '',
                    icon = '';
                if (val == 1) {
                    str = '<div class="a-check"><i class="md-icon-outlined c-green">done</i>Yes</div>';
                } else {
                    str = '<div class="a-check"><i class="md-icon-outlined c-red">close</i>No</div>';
                }
                if (str.length > 0) {
                    return '' + icon + str + ' ';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
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
                            Ext.create('Abraxa.view.portcall.husbandry.crewing.CrewingEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        crewing: record,
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
                        handler: function () {
                            let record = this.upVM().get('record'),
                                container = this.find('crewingRightCard');
                            if (record) {
                                container.show();
                            }
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childTap: function (me, location) {
            if (location.record && location.columnIndex != 0) {
                location.record.set('is_checked', false);
            }
        },
    },
});

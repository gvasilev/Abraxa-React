import './agent/PortcallsAgentEditMenu';
import './CreatePortcall';
import '../common/Global';

var doubleClickInProgress = false;
Ext.define('Abraxa.view.portcalls.PortcallsGridActive', {
    extend: 'Ext.grid.Grid',
    xtype: 'portcalls.grid.active',
    testId: 'portcallsGridActive',

    flex: 1,
    slug: 'portcallGrid',
    showNoPermissions: true,
    skipEditPermission: true,
    ui: 'bordered',
    infinite: false,
    cls: 'a-detailed-grid abraxa-grid a-porcalls-grid',
    stateful: true,
    stateId: 'portcalls-grid-active',
    itemId: 'portcalls-grid-active',
    collapsible: false,
    pinHeaders: false,
    selectable: {
        deselectable: true,
    },
    plugins: {
        gridfilterbar: {
            hidden: true,
            stateful: true,
            nonStatefulFilters: ['search', 'archived'],
        },
        gridexporter: true,
        gridviewoptions: true,
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 50,
            testId: 'portcallsGridActivePagingToolbar',
            loadPages: true,
            toolbar: {
                bordered: true,
                nextButton: {
                    ui: 'tool-sm round',
                },
                prevButton: {
                    ui: 'tool-sm round',
                },
                listeners: {
                    initialize: function () {
                        this.add({
                            xtype: 'div',
                            margin: '0 16',
                            cls: 'sm-title',
                            bind: {
                                html: '<strong>{totalPortcallsRecords}</strong> records',
                            },
                        });
                        this.add({
                            xtype: 'div',
                            width: '60%',
                        });
                    },
                },
            },
        },
    },
    store: [],
    bind: {
        permission: '{userPermissions}',
        // The store is defined in the Abraxa.view.portcalls.agent.PortcallsAgentViewModel.
        // TODO CORE-2987 Refactor it.
        store: '{portcalls}',
    },
    reference: 'portcallGridActive',
    scrollToTopOnRefresh: false,
    keyMapEnabled: true,
    //    keyMap: {
    //        scope: 'this',
    //        ESC: function () {
    //            let activeGrid = Ext.ComponentQuery.query('[xtype=portcalls\\.grid\\.active]')[0];
    //            activeGrid.deselectAll();
    //        },
    //    },
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-483 -193)"><g transform="translate(-351 -152)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><path d="M351.031,76.42h-2.478V56a3.723,3.723,0,0,0-3.717-3.717H333.618l-.3-.81a6.175,6.175,0,0,0-11.664,0l-.3.81H310.136A3.724,3.724,0,0,0,306.419,56v51.222a3.723,3.723,0,0,0,3.717,3.717h15.519a14.306,14.306,0,0,0,.892,2.478H310.138a6.2,6.2,0,0,1-6.2-6.2V56h0a6.2,6.2,0,0,1,6.2-6.2h9.532a8.638,8.638,0,0,1,15.628,0h9.532a6.2,6.2,0,0,1,6.2,6.2V76.42M313.441,68.8h0a1.652,1.652,0,0,0,1.652,1.652h24.758A1.652,1.652,0,0,0,341.5,68.8h0a1.652,1.652,0,0,0-1.652-1.652H315.093A1.652,1.652,0,0,0,313.441,68.8Zm0,16.52h0a1.652,1.652,0,0,0,1.652,1.652l12.758.06a1.652,1.652,0,0,0,1.652-1.652h0a1.652,1.652,0,0,0-1.652-1.652l-12.758-.06A1.652,1.652,0,0,0,313.441,85.319Zm0,8.26h0a1.652,1.652,0,0,0,1.652,1.652h6.758a1.652,1.652,0,0,0,1.652-1.652h0a1.652,1.652,0,0,0-1.652-1.652h-6.758A1.652,1.652,0,0,0,313.441,93.579Zm0-16.52h0a1.652,1.652,0,0,0,1.652,1.652h18.758a1.652,1.652,0,0,0,1.652-1.652h0a1.652,1.652,0,0,0-1.652-1.652H315.093A1.652,1.652,0,0,0,313.441,77.059ZM351.79,92.97v2h-4v-2Zm0,0v2h-4v-2Zm13-4v22a4.012,4.012,0,0,1-4,4h-22a4.012,4.012,0,0,1-4-4v-22a4.012,4.012,0,0,1,4-4h22A4.012,4.012,0,0,1,364.79,88.97Zm-6,14h-7v1h-4v-1H340.8l-.01,4a2,2,0,0,0,1.99,2h14.01a2,2,0,0,0,2-1.99Zm1-6a2.006,2.006,0,0,0-2-2h-4.01v-2l-2-2h-4l-2,2v2h-3.99a2.006,2.006,0,0,0-2,2v3a2,2,0,0,0,1.99,2h6.01v-2h4v2h6a2.006,2.006,0,0,0,2-2Zm-12-4h4v2h-4ZM327.49,49.8a3.72,3.72,0,1,0,3.71,3.72A3.719,3.719,0,0,0,327.49,49.8Zm1.85,3.72a1.855,1.855,0,1,1,0-.01Z" transform="translate(216.063 175.158)" fill="#c8d4e6"></path></g></svg><div class="a-no-content-txt">No port calls available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Port call',
                testId: 'portcallsGridActiveCreatePortCallBtn',
                slug: 'portcallCreate',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                bind: {
                    permission: '{userPermissions}',
                    handler:
                        '{currentUser.company.type == "agent" ? "createPortcallAgent" : "createPrincipalPortcall"}',
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    itemConfig: {
        height: 58,
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
                        if (record && record.get('status_data')) {
                            return record.get('status_data').string;
                        }
                    },
                },
            },
        },
    },
    columns: [
        {
            text: '',
            dataIndex: 'is_watching',
            cls: 'a-cell-id',
            width: 32,
            hidden: false,
            testId: 'portcallsGridActiveIsWatchingColumn',
            menuDisabled: true,
            resizable: false,
            hideable: false,
            sortable: false,
            editable: false,
            ignore: true,
            cell: {
                encodeHtml: false,
                cls: 'expand',
                forceWidth: true,
                tools: [
                    {
                        xtype: 'div',
                        tooltip: {
                            html: 'Subscribe to start receiving<br> follow up notifications',
                            anchor: true,
                            align: 'b50-t50',
                        },
                        bind: {
                            html: '<div class="a-fav cursor-pointer a_grid_action"><i class="a_grid_action {record.is_watching ? "material-icons c-yellow" : "material-icons-outlined md-inactive"}">{record.is_watching ? "notifications" : "notifications"}</i></div>',
                        },
                    },
                ],
                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.a-fav',
                        fn: function fn() {
                            let record = this.component.getRecord(),
                                recentlyOpened = this.component.up('grid').upVM().get('recentlyOpened'),
                                favourite = record.get('is_watching');
                            if (favourite) {
                                record.set('is_watching', 0);
                            } else {
                                record.set('is_watching', 1);
                            }
                            record.save({
                                success: function () {
                                    recentlyOpened.reload();
                                    Ext.toast('Record updated');
                                },
                            });
                        },
                    },
                },
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: '=',
                dataIndex: 'isFavorites',
                operators: [],
                fieldDefaults: {
                    xtype: 'checkbox',
                    cls: 'a-check-fav a-fav-inquiries a-filter-fav',
                    tooltip: {
                        align: 'bc-tc?',
                        html: 'Subscribed',
                    },
                    addTrigger: function () {
                        return false;
                    },
                },
            },
            ignoreExport: true,
        },
        {
            text: 'File ID',
            testId: 'portcallsGridActiveFileIdColumn',
            dataIndex: 'file_id',
            minWidth: 120,
            hidden: true,
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'File ID',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-file-id',
            },
            groupHeaderTpl: '{name}',
            grouper: {
                groupFn: function (record) {
                    let val = record.getVoyage() ? record.getVoyage().get('file_id') : null;
                    if (val) {
                        return val;
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
                sorterFn: function (record1, record2) {
                    let val1 = record1.get('file_id');
                    let val2 = record2.get('file_id');
                    if (val1 && val2) {
                        return val1.localeCompare(val2);
                    }
                    return 0;
                },
            },
            exportRenderer: true,
            renderer: function renderer(value, record) {
                if (record) {
                    return record.get('file_id');
                }
            },
        },
        {
            dataIndex: 'vessel_name_id',
            text: 'Vessel/ID',
            testId: 'portcallsGridActiveVesselIdColumn',
            minWidth: 180,
            // flex: 1,
            cell: {
                cls: 'expand',
                encodeHtml: false,
                bind: {
                    tpl: '<a data-id="vessel_name" class="a_grid_action a-vessel-name text-truncate" href="javascript:void(0)" title="{record.voyage.vessel_name}">{record.voyage.vessel_name}</a><div class="sm-title">{record.file_id}</div>',
                },
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.a-vessel-name',
                        fn: function fn() {
                            let imo,
                                record = this.component.getRecord();
                            Ext.getCmp('main-viewport').setMasked({
                                xtype: 'viewport.mask',
                            });
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('portcall/' + record.get('id'));
                        },
                    },
                },
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                // value: 'star', // setting a value makes the filter active.
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter vessel',
                    // any Ext.form.field.Text configs accepted
                },
            },
            grouper: {
                groupFn: function (record) {
                    let val = record.getVoyage().get('vessel_name');
                    if (val) {
                        return val;
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
            groupHeaderTpl:
                '<div class="hbox"><i class="md-icon-outlined mr-12">directions_boat</i><a href="javascript.void(0)" class="fw-b">{name:uppercase}</a></div>',
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                let vessel_name = '',
                    id = record.get('file_id');

                if (record.getVoyage().get('vessel_name')) {
                    vessel_name = record.getVoyage().get('vessel_name');
                } else {
                    vessel_name = 'TBN';
                }
                return vessel_name + '/' + id;
            },
        },
        {
            dataIndex: 'status_name',
            minWidth: 100,
            text: 'Status',
            testId: 'portcallsGridActiveStatusColumn',
            slug: 'portcallStatus',
            bind: {
                permission: '{userPermissions}',
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'in',
                // optional configs
                operators: ['in'],
                fieldDefaults: {
                    xtype: 'combobox',
                    ui: 'classic',
                    placeholder: 'Choose',
                    valueField: 'name',
                    displayField: 'name',
                    queryMode: 'local',
                    multiSelect: true,
                    bind: {
                        store: '{portcallAgentStatus}',
                    },
                    listeners: {
                        beforequery: function (me) {
                            let archiveMode = this.up('grid').upVM().get('archiveMode');
                            let store = this.getStore();
                            store.clearFilter();
                            if (archiveMode) {
                                store.addFilter({
                                    property: 'is_archive',
                                    operator: '=',
                                    value: 1,
                                    exactMatch: true,
                                });
                            } else {
                                store.addFilter({
                                    property: 'is_archive',
                                    operator: '=',
                                    value: 0,
                                    exactMatch: true,
                                });
                            }
                        },
                        focusleave: function (me) {
                            //restore default filter for status store
                            let store = me.getStore();
                            let archiveMode = this.up('grid').upVM().get('archiveMode');
                            if (store && !archiveMode) {
                                store.clearFilter();
                                store.addFilter({
                                    property: 'is_archive',
                                    operator: '=',
                                    value: 0,
                                    exactMatch: true,
                                });
                            }
                        },
                    },
                    // any Ext.form.field.Text configs accepted
                },
                serializer: function (value) {
                    return;
                },
            },
            cell: {
                cls: 'expand',
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            grouper: {
                groupFn: function (record) {
                    if (record && record.get('status_data')) return record.get('status_data').sort_order;
                },
            },
            groupHeaderTpl:
                '<div class="a-group-header status-{[values.children[0].data.status_data.string]}">{[values.children[0].data.status_data.name]} ({count})</div>',
            renderer: function (value, record) {
                if (record && record.get('status_data')) {
                    return (
                        '<div class="a-status-badge a-status-md status-' +
                        record.get('status_data').string +
                        '"><span class="text-truncate">' +
                        value +
                        '</span></div>'
                    );
                } else {
                    return '';
                }
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (record && record.get('status_data')) {
                    return record.get('status_data').name;
                } else {
                    return '';
                }
            },
        },
        {
            dataIndex: 'vessel_name',
            text: 'Vessel',
            testId: 'portcallsGridActiveVesselColumn',
            minWidth: 180,
            flex: 1,
            stateId: 'vesse_imo',
            cls: 'a-column-vessel',
            hidden: true,
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                // value: 'star', // setting a value makes the filter active.
                operators: ['like'],
                fieldDefaults: {
                    padding: '0 0 0 24',
                    ui: 'classic',
                    placeholder: 'Enter vessel',

                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand',
                encodeHtml: false,
                bind: {
                    tpl: '<a data-id="vessel_name" class="a_grid_action a-vessel-name text-truncate" href="javascript:void(0)" title="{record.vessel_name}">{record.vessel_name ? record.vessel_name : "TBN" }</a>',
                },
                tools: [
                    {
                        xtype: 'div',
                        cls: 'a-cell-invited cursor-pointer',
                        tooltip: {
                            html: 'Invited',
                            anchor: true,
                            align: 'b50-t50',
                        },
                        hideMode: 'opacity',
                        bind: {
                            hidden: '{record.company_id == currentUser.current_company_id && !record.parent_id  ? true : false}',
                            html: '<i class="material-icons-outlined">device_hub</i>',
                        },
                        zone: 'start',
                    },
                ],
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.a-vessel-name',
                        fn: function fn() {
                            let imo,
                                record = this.component.getRecord();
                            window.location.hash = '#portcall/' + record.get('id');

                            // if (record.get('vessel')) {
                            //     imo = record.get('vessel').id
                            // }
                            // if (record.get('custom_vessel_id')) {
                            //     if (record.get('custom_vessel').company_id != this.component.up('grid').upVM().get('currentUser').get('current_company_id')) {
                            //         imo = record.get('custom_vessel').id;
                            //     }
                            // }
                            // if (imo) {
                            //     Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo);
                            // }
                        },
                    },
                },
            },
            grouper: {
                groupFn: function (record) {
                    return record.getVoyage().get('vessel_name');
                },
            },
            groupHeaderTpl: '{name}',
            sorter: {
                sorterFn: function (a, b) {
                    if (a.getVoyage().get('vessel_name') < b.getVoyage().get('vessel_name')) {
                        return -1;
                    } else if (a.getVoyage().get('vessel_name') > b.getVoyage().get('vessel_name')) {
                        return 1;
                    }

                    return 0;
                },
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record.getVoyage().get('vessel_name')) {
                    return record.getVoyage().get('vessel_name');
                } else {
                    return 'TBN';
                }
            },
        },
        {
            text: 'Port itinerary',
            testId: 'portcallsGridActivePortItineraryColumn',
            dataIndex: 'port_itinerary',
            minWidth: 140,
            cell: {
                cls: 'expand',
                encodeHtml: false,
                actionType: 'prospects',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a',
                        fn: function (el) {
                            if (el.target.classList[1] == 'open_action_center') {
                                Ext.ComponentQuery.query('appointments-grid')[0].getController().loadActionCenter(el);
                            } else if (el.target.classList[1] == 'a-port-eta') {
                                Ext.defer(() => {
                                    if (doubleClickInProgress) return;
                                    let portId = el.currentTarget.getAttribute('data-portid');
                                    if (portId) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showPortDialogById(portId);
                                    }
                                }, 500);
                            }
                        },
                    },
                    dblclick: {
                        element: 'element',
                        delegate: 'a',
                        fn: function (el) {
                            doubleClickInProgress = true;
                            Ext.defer(() => {
                                doubleClickInProgress = false;
                            }, 1000);
                        },
                    },
                },
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '>',
                // optional configs
                dataIndex: 'port_itinerary_date',
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    placeholder: 'Enter port',
                    // any Ext.form.field.Text configs accepted
                },
            },
            sorter: {
                sorterFn: function (a, b) {
                    return a.get('port_eta') < b.get('port_eta') ? -1 : a.get('port_eta') > b.get('port_eta') ? 1 : 0;
                },
            },
            grouper: {
                groupFn: function (record) {
                    if (record.get('port_name')) {
                        return record.get('port_name');
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '<a href="javascript.void(0)">{name}</a>',
            renderer: function (value, record) {
                return Abraxa.utils.Functions.portRenderer(record);
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                let port_function = null;
                if (record && record.getNomination()) {
                    port_function = record.getNomination().get('port_function');
                }
                if (record && port_function) {
                    let eta = 'ETA: ---',
                        date = '',
                        port_requested = '',
                        port_requested_id = '';
                    if (record && record.get('port_name')) {
                        port_requested = record.get('port_name');
                        port_requested_id = record.get('port_id');
                    }
                    if (record.get('port_eta')) {
                        date = moment(record.get('port_eta')).isValid()
                            ? moment(record.get('port_eta')).format('DD MMM - HH:mm')
                            : AbraxaConstants.placeholders.emptyValue;
                        eta = 'ETA: ' + date;
                    }
                    if (record.get('port_ata')) {
                        date = moment(record.get('port_etd')).isValid()
                            ? moment(record.get('port_etd')).format('DD MMM - HH:mm')
                            : AbraxaConstants.placeholders.emptyValue;
                        eta = 'ETD: ' + date;
                    }
                    if (record.get('port_atd')) {
                        date = moment(record.get('port_atd')).isValid()
                            ? moment(record.get('port_atd')).format('DD MMM - HH:mm')
                            : AbraxaConstants.placeholders.emptyValue;
                        eta = 'ATD: ' + date;
                    }
                    return port_requested + ' / ' + eta;
                }
            },
        },
        {
            text: 'Port',
            testId: 'portcallsGridActivePortRequestedColumn',
            minWidth: 140,
            dataIndex: 'port_requested',
            xtype: 'templatecolumn',
            hidden: true,
            tpl: new Ext.XTemplate('{[this.create(values)]}', {
                create: function (values) {
                    let data = AbraxaConstants.placeholders.emptyValue;
                    if (values && values.port_id) {
                        data =
                            '<a href="javascript:void(0)" class="a_grid_action a-port" data-portid="' +
                            values.port_id +
                            '"><span class="text-truncate">' +
                            values.port_name +
                            '</span></a>';
                    }
                    return data;
                },
            }),
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                dataIndex: 'port_name',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter port',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-port',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a',
                        fn: function (el) {
                            let portId = el.currentTarget.getAttribute('data-portid');
                            if (portId) {
                                Abraxa.getApplication().getController('AbraxaController').showPortDialogById(portId);
                            }
                        },
                    },
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (record && record.get('port_name')) {
                    return record.get('port_name');
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Previous port',
            dataIndex: 'previous_port',
            testId: 'portcallsGridActivePreviousPortColumn',
            minWidth: 120,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                dataIndex: 'previous_port',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter port',
                    // any Ext.form.field.Text configs accepted
                },
            },
            grouper: {
                groupFn: function (record) {
                    if (record && record.get('previous_port_name')) {
                        return record.get('previous_port_name');
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '{name}',
            renderer: function (value, record) {
                if (record.get('previous_port')) {
                    return record.get('previous_port');
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Next port',
            testId: 'portcallsGridActiveNextPortColumn',
            dataIndex: 'next_port',
            minWidth: 120,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                dataIndex: 'next_port',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter port',
                    // any Ext.form.field.Text configs accepted
                },
            },
            grouper: {
                groupFn: function (record) {
                    if (record && record.get('next_port_name')) {
                        return record.get('next_port_name');
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '{name}',
            renderer: function (value, record) {
                if (record.get('next_port')) {
                    return record.get('next_port');
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: 'port_eta',
            testId: 'portcallsGridActivePortETAATAColumn',
            text: 'ETA / ATA',
            minWidth: 150,
            hidden: true,
            groupable: false,
            cls: 'a-column-bl a-column-br a-column-bgr',
            cell: {
                cls: 'a-cell-date a-cell-bl a-cell-br a-cell-bgr',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '=',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    cls: 'a-filter-bl a-filter-br a-filter-bgr',
                    // any Ext.form.field.Text configs accepted
                },
            },
            sorter: {
                sorterFn: function (v1, v2) {
                    let date1 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash),
                        date2 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    if (v1.get('port_eta')) {
                        date1 = moment(v1.get('port_eta')).isValid()
                            ? moment(v1.get('port_eta'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (v2.get('port_eta')) {
                        date2 = moment(v2.get('port_eta')).isValid()
                            ? moment(v2.get('port_eta'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (v1.get('port_ata')) {
                        date1 = moment(v1.get('port_ata')).isValid()
                            ? moment(v1.get('port_ata'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (v2.get('port_ata')) {
                        date2 = moment(v2.get('port_ata')).isValid()
                            ? moment(v2.get('port_ata'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    return date1 - date2;
                },
            },
            renderer: function (value, record) {
                let date,
                    eta = AbraxaConstants.placeholders.emptySpan;
                if (record.get('port_eta')) {
                    date = moment(record.get('port_eta')).isValid()
                        ? moment(record.get('port_eta')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                        : AbraxaConstants.placeholders.emptySpan;
                    eta = '<strong class="c-black">' + date + '</strong>';
                }
                if (record.get('port_ata')) {
                    date = moment(record.get('port_ata')).isValid()
                        ? moment(record.get('port_ata')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                        : AbraxaConstants.placeholders.emptySpan;
                    eta = '<span class="c-light">' + date + '</span>';
                }
                return eta;
            },
            exportRenderer: function (value, record) {
                let date,
                    eta = AbraxaConstants.placeholders.emptyValue;
                if (record.get('port_eta')) {
                    date = moment(record.get('port_eta')).isValid()
                        ? moment(record.get('port_eta')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ETA: ' + date;
                }
                if (record.get('port_ata')) {
                    date = moment(record.get('port_ata')).isValid()
                        ? moment(record.get('port_ata')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ATA: ' + date;
                }
                return eta;
            },
        },
        {
            dataIndex: 'port_etd',
            testId: 'portcallsGridActivePortETDATDColumn',
            text: 'ETD / ATD',
            minWidth: 150,
            hidden: true,
            groupable: false,
            cls: 'a-column-br',
            cell: {
                cls: 'a-cell-date a-cell-br',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '=',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    cls: 'a-filter-br',
                    ui: 'classic',
                    placeholder: 'dd/mm/yy',
                    // any Ext.form.field.Text configs accepted
                },
            },
            sorter: {
                sorterFn: function (v1, v2) {
                    let date1 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash),
                        date2 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    if (v1.get('port_etd')) {
                        date1 = moment(v1.get('port_etd')).isValid()
                            ? moment(v1.get('port_etd'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (v2.get('port_etd')) {
                        date2 = moment(v2.get('port_etd')).isValid()
                            ? moment(v2.get('port_etd'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (v1.get('port_atd')) {
                        date1 = moment(v1.get('port_atd')).isValid()
                            ? moment(v1.get('port_atd'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (v2.get('port_atd')) {
                        date2 = moment(v2.get('port_atd')).isValid()
                            ? moment(v2.get('port_atd'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    return date1 - date2;
                },
            },
            renderer: function (value, record) {
                let date,
                    eta = AbraxaConstants.placeholders.emptySpan;
                if (record.get('port_etd')) {
                    date = moment(record.get('port_etd')).isValid()
                        ? moment(record.get('port_etd')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                        : AbraxaConstants.placeholders.emptySpan;
                    eta = '<strong class="c-black">' + date + '</strong>';
                }
                if (record.get('port_atd')) {
                    date = moment(record.get('port_atd')).isValid()
                        ? moment(record.get('port_atd')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                        : AbraxaConstants.placeholders.emptySpan;
                    eta = '<span class="c-light">' + date + '</span>';
                }
                return eta;
            },
            exportRenderer: function (value, record) {
                let date,
                    eta = AbraxaConstants.placeholders.emptyValue;
                if (record.get('port_etd')) {
                    date = moment(record.get('port_etd')).isValid()
                        ? moment(record.get('port_etd')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ETD: ' + date;
                }
                if (record.get('port_atd')) {
                    date = moment(record.get('port_atd')).isValid()
                        ? moment(record.get('port_atd')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24)
                        : AbraxaConstants.placeholders.emptyValue;
                    eta = 'ATD: ' + date;
                }
                return eta;
            },
        },
        {
            text: 'Current berth',
            sortable: false,
            testId: 'portcallsGridActiveCurrentBerthColumn',
            dataIndex: 'current_berth',
            minWidth: 180,
            slug: 'portcallBerthTerminal',
            // groupable: false,
            bind: {
                permission: '{userPermissions}',
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                // value: 'star', // setting a value makes the filter active.
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter berth',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand',
                encodeHtml: false,
                actionType: 'prospects',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.berthLink',
                        fn: function (item, el, eOpts) {
                            var berthId = parseInt(item.currentTarget.getAttribute('data-id'));
                            if (berthId) {
                                Abraxa.getApplication().getController('AbraxaController').showBerthDialogById(berthId);
                            }
                        },
                    },
                },
            },
            grouper: {
                groupFn: function (record) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (record) {
                            return record.get('is_current');
                        }).items[0],
                        label = AbraxaConstants.placeholders.emptyValue;

                    if (currentBerth) {
                        label = currentBerth.get('name');
                    }
                    return label;
                },
            },
            renderer: function (value, record) {
                if (record && record.berths().getCount()) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (record) {
                            return record.get('is_current');
                        }).items[0],
                        label = 'ETB: ',
                        date = AbraxaConstants.placeholders.emptyValue;

                    if (currentBerth) {
                        if (currentBerth.get('etb')) date = moment(currentBerth.get('etb')).format('DD MMM - HH:mm');

                        if (currentBerth.get('berthed')) {
                            label = 'Berthed: ';
                            if (currentBerth.get('etc')) {
                                label = 'ETC: ';
                                date = moment(currentBerth.get('etc')).format('DD MMM - HH:mm');
                            } else {
                                date = moment(currentBerth.get('berthed')).format('DD MMM - HH:mm');
                            }
                        }

                        if (currentBerth.get('completed')) {
                            label = 'Completed: ';
                            if (currentBerth.get('etd')) {
                                label = 'ETD: ';
                                date = moment(currentBerth.get('etd')).format('DD MMM - HH:mm');
                            } else {
                                date = moment(currentBerth.get('completed')).format('DD MMM - HH:mm');
                            }
                        }

                        if (currentBerth.get('departed')) {
                            label = 'Departed: ';
                            date = moment(currentBerth.get('departed')).format('DD MMM - HH:mm');
                        }

                        return (
                            '<div class="text-truncate"><a href="javascript:void(0)" data-id="' +
                            currentBerth.get('berth_id') +
                            '"  data-port="' +
                            record.get('port_id') +
                            '" class="a_grid_action berthLink">' +
                            currentBerth.get('name') +
                            '</a><span class="a-sm-action"><span class="sm-title text-truncate">' +
                            label +
                            date +
                            '</span></span></div>'
                        );
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record && record.berths().getCount()) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (record) {
                            return record.get('is_current');
                        }).items[0],
                        label = 'ETB: ',
                        date = AbraxaConstants.placeholders.emptyValue;

                    if (currentBerth) {
                        if (currentBerth.get('etb')) date = moment(currentBerth.get('etb')).format('DD MMM - HH:mm');

                        if (currentBerth.get('berthed')) {
                            label = 'Berthed: ';
                            if (currentBerth.get('etc')) {
                                label = 'ETC: ';
                                date = moment(currentBerth.get('etc')).format('DD MMM - HH:mm');
                            } else {
                                date = moment(currentBerth.get('berthed')).format('DD MMM - HH:mm');
                            }
                        }

                        if (currentBerth.get('completed')) {
                            label = 'Completed: ';
                            if (currentBerth.get('etd')) {
                                label = 'ETD: ';
                                date = moment(currentBerth.get('etd')).format('DD MMM - HH:mm');
                            } else {
                                date = moment(currentBerth.get('completed')).format('DD MMM - HH:mm');
                            }
                        }
                        if (currentBerth.get('departed')) {
                            label = 'Departed: ';
                            date = moment(currentBerth.get('departed')).format('DD MMM - HH:mm');
                        }
                        return currentBerth.get('name') + ' ' + label + date;
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
        },
        {
            dataIndex: 'current_berth_etb',
            testId: 'portcallsGridActiveCurrentBerthETBBerthedColumn',
            text: 'ETB / Berthed',
            minWidth: 150,
            hidden: true,
            groupable: false,
            cls: 'a-column-bl a-column-br a-column-bgr',
            cell: {
                cls: 'a-cell-date a-cell-bl a-cell-br a-cell-bgr',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '=',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    cls: 'a-filter-bl a-filter-br a-filter-bgr',
                    ui: 'classic',
                    placeholder: 'dd/mm/yy',
                    // any Ext.form.field.Text configs accepted
                },
            },
            sorter: {
                sorterFn: function (v1, v2) {
                    let date1 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash),
                        date2 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);

                    let berths1 = v1.berths(),
                        currentBerth1 = berths1.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    let berths2 = v2.berths(),
                        currentBerth2 = berths2.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth1 && currentBerth1.get('etb')) {
                        date1 = moment(currentBerth1.get('etb')).isValid()
                            ? moment(currentBerth1.get('etb'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth2 && currentBerth2.get('etb')) {
                        date2 = moment(currentBerth2.get('etb')).isValid()
                            ? moment(currentBerth2.get('etb'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth1 && currentBerth1.get('berthed')) {
                        date1 = moment(currentBerth1.get('berthed')).isValid()
                            ? moment(currentBerth1.get('berthed'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth2 && currentBerth2.get('berthed')) {
                        date2 = moment(currentBerth2.get('berthed')).isValid()
                            ? moment(currentBerth2.get('berthed'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    return date1 - date2;
                },
            },
            renderer: function (value, record) {
                if (record && record.berths().getCount()) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth) {
                        let date,
                            eta = AbraxaConstants.placeholders.emptySpan;
                        if (currentBerth.get('etb')) {
                            date = moment(currentBerth.get('etb')).isValid()
                                ? moment(currentBerth.get('etb')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptySpan;
                            eta = '<strong class="c-black">' + date + '</strong>';
                        }
                        if (currentBerth.get('berthed')) {
                            date = moment(currentBerth.get('berthed')).isValid()
                                ? moment(currentBerth.get('berthed')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptySpan;
                            eta = '<span class="c-light">' + date + '</span>';
                        }
                        return eta;
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record && record.berths().getCount()) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth) {
                        let date,
                            eta = AbraxaConstants.placeholders.emptyValue;
                        if (currentBerth.get('etb')) {
                            date = moment(currentBerth.get('etb')).isValid()
                                ? moment(currentBerth.get('etb')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptyValue;
                            eta = 'ETB: ' + date;
                        }
                        if (currentBerth.get('berthed')) {
                            date = moment(currentBerth.get('berthed')).isValid()
                                ? moment(currentBerth.get('berthed')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptyValue;
                            eta = 'Berthed: ' + date;
                        }
                        return eta;
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            dataIndex: 'current_berth_etc',
            testId: 'portcallsGridActiveCurrentBerthETCCompletedColumn',
            text: 'ETC / Completed',
            minWidth: 150,
            hidden: true,
            groupable: false,
            cls: 'a-column-br',
            cell: {
                cls: 'a-cell-date a-cell-br',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '=',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    cls: 'a-filter-br',
                    ui: 'classic',
                    placeholder: 'dd/mm/yy',
                    // any Ext.form.field.Text configs accepted
                },
            },
            sorter: {
                sorterFn: function (v1, v2) {
                    let date1 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash),
                        date2 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);

                    let berths1 = v1.berths(),
                        currentBerth1 = berths1.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    let berths2 = v2.berths(),
                        currentBerth2 = berths2.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth1 && currentBerth1.get('etc')) {
                        date1 = moment(currentBerth1.get('etc')).isValid()
                            ? moment(currentBerth1.get('etc'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth2 && currentBerth2.get('etc')) {
                        date2 = moment(currentBerth2.get('etc')).isValid()
                            ? moment(currentBerth2.get('etc'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth1 && currentBerth1.get('completed')) {
                        date1 = moment(currentBerth1.get('completed')).isValid()
                            ? moment(currentBerth1.get('completed'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth2 && currentBerth2.get('completed')) {
                        date2 = moment(currentBerth2.get('completed')).isValid()
                            ? moment(currentBerth2.get('completed'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    return date1 - date2;
                },
            },
            renderer: function (value, record) {
                if (record && record.berths().getCount()) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth) {
                        let date,
                            eta = AbraxaConstants.placeholders.emptySpan;
                        if (currentBerth.get('etc')) {
                            date = moment(currentBerth.get('etc')).isValid()
                                ? moment(currentBerth.get('etc')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptySpan;
                            eta = '<strong class="c-black">' + date + '</strong>';
                        }
                        if (currentBerth.get('completed')) {
                            date = moment(currentBerth.get('completed')).isValid()
                                ? moment(currentBerth.get('completed')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptySpan;
                            eta = '<span class="c-light">' + date + '</span>';
                        }
                        return eta;
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record && record.berths().getCount()) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth) {
                        let date,
                            eta = AbraxaConstants.placeholders.emptyValue;
                        if (currentBerth.get('etc')) {
                            date = moment(currentBerth.get('etc')).isValid()
                                ? moment(currentBerth.get('etc')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptyValue;
                            eta = 'ETC: ' + date;
                        }
                        if (currentBerth.get('completed')) {
                            date = moment(currentBerth.get('completed')).isValid()
                                ? moment(currentBerth.get('completed')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptyValue;
                            eta = 'Completed: ' + date;
                        }
                        return eta;
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            dataIndex: 'current_berth_etd',
            testId: 'portcallsGridActiveCurrentBerthETDDepartedColumn',
            text: 'ETD / Departed',
            minWidth: 150,
            hidden: true,
            groupable: false,
            cls: 'a-column-br a-column-bgr',
            cell: {
                cls: 'a-cell-date a-cell-br a-cell-bgr',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'date',
                operator: '=',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    cls: 'a-filter-br a-filter-bgr',
                    ui: 'classic',
                    placeholder: 'dd/mm/yy',
                    // any Ext.form.field.Text configs accepted
                },
            },
            sorter: {
                sorterFn: function (v1, v2) {
                    let date1 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash),
                        date2 = moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);

                    let berths1 = v1.berths(),
                        currentBerth1 = berths1.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    let berths2 = v2.berths(),
                        currentBerth2 = berths2.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth1 && currentBerth1.get('etd')) {
                        date1 = moment(currentBerth1.get('etd')).isValid()
                            ? moment(currentBerth1.get('etd'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth2 && currentBerth2.get('etd')) {
                        date2 = moment(currentBerth2.get('etd')).isValid()
                            ? moment(currentBerth2.get('etd'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth1 && currentBerth1.get('departed')) {
                        date1 = moment(currentBerth1.get('departed')).isValid()
                            ? moment(currentBerth1.get('departed'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    if (currentBerth2 && currentBerth2.get('departed')) {
                        date2 = moment(currentBerth2.get('departed')).isValid()
                            ? moment(currentBerth2.get('departed'))
                            : moment('01/01/1900', AbraxaConstants.formatters.date.dayMonthYearSlash);
                    }
                    return date1 - date2;
                },
            },
            renderer: function (value, record) {
                if (record && record.berths().getCount()) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth) {
                        let date,
                            eta = AbraxaConstants.placeholders.emptySpan;
                        if (currentBerth.get('etd')) {
                            date = moment(currentBerth.get('etd')).isValid()
                                ? moment(currentBerth.get('etd')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptySpan;
                            eta = '<strong class="c-black">' + date + '</strong>';
                        }
                        if (currentBerth.get('departed')) {
                            date = moment(currentBerth.get('depareted')).isValid()
                                ? moment(currentBerth.get('departed')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptySpan;
                            eta = '<span class="c-light">' + date + '</span>';
                        }
                        return eta;
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
            exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                if (record && record.berths().getCount()) {
                    let berths = record.berths(),
                        currentBerth = berths.queryBy(function (rec) {
                            return rec.get('is_current');
                        }).items[0];

                    if (currentBerth) {
                        let date,
                            eta = AbraxaConstants.placeholders.emptyValue;
                        if (currentBerth.get('etd')) {
                            date = moment(currentBerth.get('etd')).isValid()
                                ? moment(currentBerth.get('etd')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptyValue;
                            eta = 'ETD: ' + date;
                        }
                        if (currentBerth.get('departed')) {
                            date = moment(currentBerth.get('departed')).isValid()
                                ? moment(currentBerth.get('departed')).format(
                                      AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                  )
                                : AbraxaConstants.placeholders.emptyValue;
                            eta = 'Departed: ' + date;
                        }
                        return eta;
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Agency type',
            testId: 'portcallsGridActiveAgencyTypeIdColumn',
            dataIndex: 'agency_type_id',
            minWidth: 160,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: '=',
                // optional configs
                operators: ['='],
                fieldDefaults: {
                    xtype: 'selectfield',
                    cls: '',
                    ui: 'classic',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    clearable: true,
                    placeholder: 'Choose',
                    bind: {
                        store: {
                            type: 'agency.types',
                        },
                    },
                    // any Ext.form.field.Text configs accepted
                },
            },
            grouper: {
                groupFn: function (record) {
                    if (record && record.getNomination()) {
                        return record.getNomination().get('agency_type_name');
                    }
                    return 'N/A';
                },
            },
            groupHeaderTpl: '{name}',
            sorter: {
                sorterFn: function (a, b) {
                    if (a.getNomination() && b.getNomination()) {
                        if (a.getVoyage().get('vessel_name') < b.getVoyage().get('vessel_name')) {
                            return -1;
                        } else if (a.getVoyage().get('vessel_name') > b.getVoyage().get('vessel_name')) {
                            return 1;
                        }

                        return 0;
                    }
                    return 0;
                },
            },
            renderer: function (value, record) {
                if (record && record.getNomination()) {
                    return record && record.getNomination().get('agency_type_name');
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
            exportRenderer: function (value, record) {
                if (record && record.getNomination()) {
                    return record.getNomination().get('agency_type_name');
                }
            },
        },
        {
            text: 'Function',
            testId: 'portcallsGridActivePortFunctionColumn',
            dataIndex: 'port_function',
            minWidth: 160,
            cell: {
                cls: 'expand a-cell-function',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'in',
                // optional configs
                operators: ['in'],
                fieldDefaults: {
                    xtype: 'combobox',
                    ui: 'classic',
                    placeholder: 'Choose',
                    // valueField: 'full_name',
                    // displayField: 'full_name',
                    queryMode: 'local',
                    multiSelect: true,
                    displayField: 'name',
                    valueField: 'name',
                    bind: {
                        store: {
                            type: 'berth.function',
                        },
                    },
                    // any Ext.form.field.Text configs accepted
                },
            },
            // filterType: {
            //     type: 'string',
            //     operator: '=',
            //     operators: ['='],
            //     fieldDefaults: {
            //         clearable: true,
            //         ui: 'classic',
            //         padding: 3,
            //         xtype: 'combobox',
            //         displayField: 'name',
            //         valueField: 'name',
            //         store: {
            //             type: 'berth.function'
            //         }
            //     }
            // },
            grouper: {
                groupFn: function (record) {
                    if (record.getNomination()) return record.getNomination().get('port_function');

                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
            renderer: function renderer(val, record) {
                if (record && record.getNomination()) {
                    return '<div class="a-function function-' + val + '"><span>' + val + '</span></div>';
                }
            },
        },
        {
            text: 'Cargo',
            testId: 'portcallsGridActiveCargoesColumn',
            minWidth: 140,
            dataIndex: 'cargoes',
            groupable: false,
            slug: 'portcallCargoGeneral',
            bind: {
                permission: '{userPermissions}',
            },
            filterType: {
                dataIndex: 'cargo_string',
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter cargo',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand',
                encodeHtml: false,
                tpl: new Ext.XTemplate(
                    // '<tpl for="record">',
                    '{[this.create(values)]}',
                    {
                        create: function (values) {
                            let cargoes = [];
                            if (values.nomination && values.nomination.cargoes) {
                                cargoes = values.nomination.cargoes;
                            }
                            if (cargoes.length == 1) {
                                let cargo = cargoes[0],
                                    quantity = numeral(cargo.quantity).format('0,0.[000]');

                                let str = '';
                                if (cargo.function) {
                                    switch (cargo.function) {
                                        case 'Loading':
                                            str = 'L';
                                            break;
                                        case 'Discharging':
                                            str = 'D';
                                            break;
                                        case 'Transshipment':
                                            str = 'TS';
                                            break;
                                        case 'Lightering':
                                            str = 'LT';
                                            break;

                                        default:
                                            break;
                                    }
                                }

                                return (
                                    '<div class="a-cargo hbox"><span class="fw-b">' +
                                    quantity +
                                    '</span> ' +
                                    '<span class="mx-4">' +
                                    cargo.unit +
                                    '</span>' +
                                    '<span class="a-function a-function-sm function-' +
                                    cargo.function +
                                    '" title="' +
                                    cargo.function +
                                    '">' +
                                    str +
                                    '</span></div><span><a class="a_grid_action fw-n" href="javascript:void(0)" data-commodityid="' +
                                    cargo.commodity_id +
                                    '">' +
                                    cargo.commodity +
                                    '</a></span>'
                                );
                            } else if (cargoes.length > 1) {
                                return (
                                    '<span class="a-cargo cargo-multiple">Multiple <span class="a-count-badge count-link">' +
                                    cargoes.length +
                                    '</span></span>'
                                );
                            }
                            return AbraxaConstants.placeholders.emptySpan;
                        },
                    }
                    // '</tpl>'
                ),
                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.a_grid_action',
                        fn: function (item, el, eOpts) {
                            var commodity_id = parseInt(item.currentTarget.getAttribute('data-commodityid'));

                            if (commodity_id) Abraxa.Global.showCommodityDialog(commodity_id);
                        },
                    },
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                let cargoes = record.cargoes().getRange();
                if (cargoes) {
                    if (cargoes.length == 1) {
                        let cargo = cargoes[0],
                            bl_unit = '',
                            commodity = '',
                            quantity = numeral(cargo.get('quantity')).format('0,0.[000]');
                        if (cargo.get('unit')) {
                            bl_unit = cargo.get('unit');
                        }
                        if (cargo.get('commodity')) {
                            commodity = cargo.get('commodity');
                        }
                        return quantity + bl_unit + ' ' + commodity;
                    } else if (cargoes.length > 1) {
                        let str = '';
                        record.cargoes().each(function (rec, idx) {
                            let bl_unit = '',
                                commodity = '',
                                comma = ',',
                                quantity = numeral(rec.get('quantity')).format('0,0.[000]');
                            if (rec.get('unit')) {
                                bl_unit = rec.get('unit');
                            }
                            if (rec.get('commodity')) {
                                commodity = rec.get('commodity');
                            }
                            if (idx + 1 == cargoes.length) {
                                comma = '';
                            }
                            str += quantity + bl_unit + ' ' + commodity + comma;
                        });
                        return str;
                    }
                } else {
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
        },
        {
            text: 'Lead agent',
            dataIndex: 'lead_agent',
            testId: 'portcallsGridActiveLeadAgentColumn',
            minWidth: 220,
            hidden: true,
            groupable: false,
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                // value: 'star', // setting a value makes the filter active.
                operators: ['like'],
                dataIndex: 'lead_agent',
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-company',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            var company_id = el.target.getAttribute('data-company_id');
                            let vm = this.component.up('grid').upVM(),
                                organizations = vm.get('organizations'),
                                email = el.currentTarget.getAttribute('data-email');

                            const organizationsStore = Ext.getStore('cdb');

                            if (!organizationsStore) return;

                            organizationsStore.setFilters({
                                id: 'company_id',
                                property: 'org_email',
                                value: email,
                            });

                            organizationsStore.load({
                                callback: function (records, operation, success) {
                                    if (records[0]) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showOrganizationTooltip(company_id, el);
                                    } else if (email) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showTenantByEmail(email, el);
                                    }
                                    this.removeFilter('company_id');
                                },
                            });
                        },
                    },
                },
                encodeHtml: false,
                renderer: function (value, record) {
                    if (value) {
                        var label =
                            '<a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            value.org_id +
                            '" data-email="' +
                            value.org_email +
                            '">' +
                            value.org_name +
                            '</a>';

                        return label;
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                },
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    var value1 =
                            record1.getNomination() && record1.getNomination().get('lead_agent_name')
                                ? record1.getNomination().get('lead_agent_name').toUpperCase()
                                : '\uffff',
                        value2 =
                            record2.getNomination() && record2.getNomination().get('lead_agent_name')
                                ? record2.getNomination().get('lead_agent_name').toUpperCase()
                                : '\uffff';

                    return value1 > value2 ? 1 : value1 < value2 ? -1 : 0;
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                var label = AbraxaConstants.placeholders.emptyValue;
                if (value) {
                    label = value.org_name;
                }

                return label;
            },
        },
        {
            text: 'Appointing party',
            testId: 'portcallsGridActiveAppointingPartyColumn',
            dataIndex: 'appointing_party',
            minWidth: 220,
            groupable: false,
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                dataIndex: 'appointing_party_name',
                // value: 'star', // setting a value makes the filter active.
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-company',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            var company_id = el.target.getAttribute('data-company_id');
                            let vm = this.component.up('grid').upVM(),
                                organizations = vm.get('organizations'),
                                email = el.currentTarget.getAttribute('data-email');

                            const organizationsStore = Ext.getStore('cdb');

                            if (!organizationsStore) return;

                            organizationsStore.setFilters({
                                id: 'company_id',
                                property: 'org_email',
                                value: email,
                            });

                            organizationsStore.load({
                                callback: function (records, operation, success) {
                                    if (records[0]) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showOrganizationTooltip(company_id, el);
                                    } else if (email) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showTenantByEmail(email, el);
                                    }
                                    this.removeFilter('company_id');
                                },
                            });
                        },
                    },
                },
                encodeHtml: false,
                renderer: function (value, record) {
                    if (value) {
                        var label =
                            '<a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            value.org_id +
                            '" data-email="' +
                            value.org_email +
                            '">' +
                            value.org_name +
                            '</a>';

                        return label;
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                },
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    var value1 =
                            record1.getNomination() && record1.getNomination().get('appointing_party_name')
                                ? record1.getNomination().get('appointing_party_name').toUpperCase()
                                : '\uffff',
                        value2 =
                            record2.getNomination() && record2.getNomination().get('appointing_party_name')
                                ? record2.getNomination().get('appointing_party_name').toUpperCase()
                                : '\uffff';

                    return value1 > value2 ? 1 : value1 < value2 ? -1 : 0;
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (value) {
                    return value.org_name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Nominating party',
            testId: 'portcallsGridActiveNominatingPartyColumn',
            dataIndex: 'nominating_party',
            minWidth: 220,
            hidden: true,
            groupable: false,
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                dataIndex: 'nominating_party_name',
                // optional configs
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-company',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            var company_id = el.target.getAttribute('data-company_id');
                            let vm = this.component.up('grid').upVM(),
                                organizations = vm.get('organizations'),
                                email = el.currentTarget.getAttribute('data-email');

                            const organizationsStore = Ext.getStore('cdb');

                            if (!organizationsStore) return;

                            organizationsStore.setFilters({
                                id: 'company_id',
                                property: 'org_email',
                                value: email,
                            });

                            organizationsStore.load({
                                callback: function (records, operation, success) {
                                    if (records[0]) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showOrganizationTooltip(company_id, el);
                                    } else if (email) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showTenantByEmail(email, el);
                                    }
                                    this.removeFilter('company_id');
                                },
                            });
                        },
                    },
                },
                encodeHtml: false,
                renderer: function (value, record) {
                    if (value) {
                        var label =
                            '<a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            value.org_id +
                            '" data-email="' +
                            value.org_email +
                            '">' +
                            value.org_name +
                            '</a>';

                        return label;
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (value) {
                    return value.org_name;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Assigned to',
            testId: 'portcallsGridActiveAssignedToNameColumn',
            dataIndex: 'assigned_to_name',
            minWidth: 180,
            groupable: false,
            slug: 'portcallAssignTo',
            bind: {
                permission: '{userPermissions}',
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'in',
                // optional configs
                operators: ['in'],
                dataIndex: 'assigned_to',
                fieldDefaults: {
                    xtype: 'combobox',
                    testId: 'portcallsGridActiveAssignedToNameChooseCombo',
                    ui: 'classic',
                    placeholder: 'Choose',
                    valueField: 'id',
                    displayField: 'full_name',
                    queryMode: 'local',
                    multiSelect: true,
                    bind: {
                        store: '{users}',
                    },
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-person',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.person_details',
                        fn: function fn(el) {
                            var user = this.component.getRecord().get('assignee');
                            let tipExist = Ext.getCmp('createdByTool');
                            if (tipExist) {
                                tipExist.destroy();
                            }
                            var tooltip_el = Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                                target: el.target,
                                id: 'createdByTool',
                                viewModel: {
                                    data: {
                                        user: user,
                                        clickedElement: el.target,
                                    },
                                },
                            }).showBy(el, 'bc-tc?');
                        },
                    },
                },
            },
            grouper: {
                groupFn: function (record) {
                    let type = record.get('assigned_type');
                    if (type) {
                        var first_name = record.get('assigned_to_first_name');
                        var last_name = record.get('assigned_to_last_name');
                        if (first_name && last_name) {
                            return first_name[0] + '. ' + last_name;
                        }
                    }
                },
            },
            renderer: function (val, record) {
                if (val) {
                    if (record.get('assignee')) {
                        var assigned_to = record.get('assignee').first_name[0] + '.' + record.get('assignee').last_name,
                            user_img = record.get('assignee').profile_image
                                ? '<img height="30" class="a_grid_action" src="' +
                                  record.get('assignee').profile_image +
                                  '"/>'
                                : '<i class="md-icon-outlined a_grid_action">person</i>';
                        return (
                            '<a class="a-person a-icon-round a_grid_action person_details" href="javascript:void(0)">' +
                            user_img +
                            assigned_to +
                            '</a>'
                        );
                    }
                } else {
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                if (record.get('assignee')) {
                    return record.get('assignee').first_name[0] + '. ' + record.get('assignee').last_name;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Voy. number',
            testId: 'portcallsGridActiveVoyageNumberColumn',
            dataIndex: 'voyage_number',
            minWidth: 120,
            hidden: true,
            cell: {
                cls: 'expand',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                // optional configs
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Voy. number',
                    // any Ext.form.field.Text configs accepted
                },
            },
            exportRenderer: true,
            renderer: function (value, record) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Date created',
            dataIndex: 'created_at',
            testId: 'portcallsGridActiveDateCreatedColumn',
            minWidth: 120,
            hidden: true,
            filterType: {
                // required configs
                type: 'date',
                operator: '=',
                // optional configs
                operators: ['=', '>', '<='],
                fieldDefaults: {
                    dateFormat: 'd/m/y',
                    ui: 'classic',
                    placeholder: 'dd/mm/yy',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-date',
            },
            exportRenderer: true,
            renderer: function renderer(value) {
                if (value) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(value, AbraxaConstants.formatters.date.dayAbbrMonYear);
                    // return moment(value).format("D MMM YY");
                }
            },
        },
        {
            text: 'Sub agent',
            testId: 'portcallsGridActiveSubAgentColumn',
            dataIndex: 'sub_agent',
            minWidth: 220,
            hidden: true,
            groupable: false,
            filterType: {
                // required configs
                type: 'string',
                operator: 'like',
                dataIndex: 'sub_agent_name',
                // optional configs
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                    // any Ext.form.field.Text configs accepted
                },
            },
            cell: {
                cls: 'expand a-cell-company',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            var company_id = el.target.getAttribute('data-company_id');
                            let vm = this.component.up('grid').upVM(),
                                organizations = vm.get('organizations'),
                                email = el.currentTarget.getAttribute('data-email');

                            const organizationsStore = Ext.getStore('cdb');

                            if (!organizationsStore) return;

                            organizationsStore.setFilters({
                                id: 'company_id',
                                property: 'org_email',
                                value: email,
                            });

                            organizationsStore.load({
                                callback: function (records, operation, success) {
                                    if (records[0]) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showOrganizationTooltip(company_id, el);
                                    } else if (email) {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .showTenantByEmail(email, el);
                                    }
                                    this.removeFilter('company_id');
                                },
                            });
                        },
                    },
                },
                encodeHtml: false,
                renderer: function (value, record) {
                    if (value) {
                        var label =
                            '<a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                            value.org_id +
                            '" data-email="' +
                            value.org_email +
                            '">' +
                            value.org_name +
                            '</a>';

                        return label;
                    }
                    return AbraxaConstants.placeholders.emptySpan;
                },
            },
            sorter: {
                sorterFn: function (record1, record2) {
                    var value1 =
                            record1.getNomination() && record1.getNomination().get('sub_agent_name')
                                ? record1.getNomination().get('sub_agent_name').toUpperCase()
                                : '\uffff',
                        value2 =
                            record2.getNomination() && record2.getNomination().get('sub_agent_name')
                                ? record2.getNomination().get('sub_agent_name').toUpperCase()
                                : '\uffff';

                    return value1 > value2 ? 1 : value1 < value2 ? -1 : 0;
                },
            },
            exportRenderer: function exportRenderer(value, record, dataIndex, cell, column) {
                var label = AbraxaConstants.placeholders.emptyValue;
                if (value) {
                    label = value.org_name;
                }

                return label;
            },
        },
        {
            text: 'Towage To / From',
            dataIndex: 'towage_to_from',
            testId: 'portcallsGridActivTowageToFromColumn',
            minWidth: 220,
            cls: 'a-column-bordered',
            filterType: {
                type: 'string',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Enter company',
                },
            },
            cell: {
                // cls: 'expand',
                encodeHtml: false,
                cls: 'a-cell-towage a-cell-bordered',
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a',
                        fn: function fn() {
                            let me = this;
                            let record = me.component.getRecord();
                            let berths = record.berths();
                            if (berths.getCount()) {
                                let label_str = '';
                                berths.each(function (berth) {
                                    if (berth.services() && berth.services().getCount()) {
                                        label_str +=
                                            '<div class="a-berth-item"><span class="a-berth-name">' +
                                            berth.get('name') +
                                            '</span>';
                                        berth.services().each(function (service) {
                                            let toBerths = parseInt(service.get('to_num')) || 0;
                                            let fromBerths = parseInt(service.get('from_num')) || 0;
                                            let toCompanyName =
                                                service.get('to_company_name') ||
                                                AbraxaConstants.placeholders.emptyValue;
                                            let fromCompanyName =
                                                service.get('from_company_name') ||
                                                AbraxaConstants.placeholders.emptyValue;
                                            if (toBerths) {
                                                let toTugString = 'tugs';
                                                if (toBerths == 1) {
                                                    toTugString = 'tug';
                                                }
                                                label_str +=
                                                    '<div class="a-towage-item"><i class="md-icon c-green" title="To berth">line_end_arrow_notch</i><span class="a-towage-company"> ' +
                                                    toCompanyName +
                                                    '</span>' +
                                                    '<span class="a-towage-tugs"><span class="a-badge-counter-md">' +
                                                    toBerths +
                                                    '</span> <em>' +
                                                    toTugString +
                                                    '</em></span></div>';
                                            }
                                            if (fromBerths) {
                                                let fromTugString = 'tugs';
                                                if (fromBerths == 1) {
                                                    fromTugString = 'tug';
                                                }
                                                label_str +=
                                                    '<div class="a-towage-item"><i class="md-icon c-red" title="From berth">line_start_arrow_notch</i><span class="a-towage-company"> ' +
                                                    fromCompanyName +
                                                    '</span>' +
                                                    '<span class="a-towage-tugs"><span class="a-badge-counter-md">' +
                                                    fromBerths +
                                                    '</span> <em>' +
                                                    fromTugString +
                                                    '</em></span></div>';
                                            }
                                        });
                                    }
                                    label_str += '</div>';
                                });
                                let tipExist = Ext.getCmp('berthsLabelTooltip');
                                if (tipExist) {
                                    tipExist.destroy();
                                }
                                Ext.create('Ext.tip.ToolTip', {
                                    target: me.component,
                                    delegate: '.towage_vendors',
                                    ui: 'multiple',
                                    manageBorders: false,
                                    anchorToTarget: true,
                                    id: 'berthsLabelTooltip',
                                    autoDestroy: true,
                                    anchor: true,
                                    autoHide: true,
                                    allowOver: true,
                                    closable: false,
                                    showOnTap: true,
                                    listeners: {
                                        beforeshow: function () {
                                            this.setHtml(label_str);
                                        },
                                    },
                                }).show();
                            }
                        },
                    },
                },
            },
            exportRenderer: true,
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
            testId: 'portcallsGridActiveExpandMoreColumn',
            // draggable: false,
            // docked: "right",
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
                            anchor: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function handler(owner, tool, e) {
                            let record = tool.record,
                                vm = this.up('grid').upVM(),
                                currentUserType = vm.get('currentUserType');
                            if (vm.get('archiveMode')) {
                                if (currentUserType == 'agent') {
                                    Ext.create('Abraxa.view.portcalls.agent.PortcallsAgentArchivedMenu', {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                portcall: record,
                                                call_from_grid: true,
                                                is_archived: true,
                                            },
                                        },
                                    }).showBy(this);
                                }
                                if (currentUserType == 'principal') {
                                    Ext.create('Abraxa.view.portcalls.principal.PortcallsPrincipalArchivedMenu', {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                portcall: record,
                                                call_from_grid: true,
                                                is_archived: true,
                                            },
                                        },
                                    }).showBy(this);
                                }
                            } else {
                                if (
                                    record.get('company_id') == vm.get('currentUser').get('current_company_id') &&
                                    !record.get('parent_id')
                                ) {
                                    //full menu
                                    Ext.create('Abraxa.view.portcalls.agent.PortcallsAgentEditMenu', {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                portcall: record,
                                                call_from_grid: true,
                                                is_archived: false,
                                            },
                                        },
                                    }).showBy(this);
                                } else {
                                    //limited menu
                                    Ext.create('Abraxa.view.portcalls.principal.PortcallsPrincipalEditMenu', {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                portcall: record,
                                                call_from_grid: true,
                                                is_archived: false,
                                            },
                                        },
                                    }).showBy(this);
                                }
                            }
                        },
                    },
                    {
                        xtype: 'button',
                        testId: 'portcallsGridActiveViewDetailsButton',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        cls: 'chameleon_view_details_portcall',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            anchor: true,
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function () {
                            let record = this.upVM().get('record');
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('portcall/' + record.get('id'));
                        },
                    },
                ],
            },
        },
    ],
    preventSelectionOnTool: true,
    listeners: {
        childtap: function (grid, location) {
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
        childdoubletap: function (grid, location, eOpts) {
            Ext.getCmp('main-viewport').setMasked({
                xtype: 'viewport.mask',
            });
            let record = location.record;
            if (record) {
                mixpanel.track('Double click on grid active portcall');

                Ext.ComponentQuery.query('portcalls\\.right\\.card')[0].hide();
                Ext.getCmp('main-viewport')
                    .getController()
                    .redirectTo('portcall/' + record.get('id'));
                grid.deselectAll();
            }
        },
        childmouseenter: function (item, location) {
            if (location.column.getDataIndex() == 'cargoes') {
                var label_str = '',
                    cargoes = [];
                if (location.record.getNomination() && location.record.getNomination().cargoes()) {
                    cargoes = location.record.getNomination().cargoes().getRange();
                }
                var selected = Ext.getCmp(location.cell.getId());
                if (cargoes && cargoes.length > 1) {
                    cargoes.forEach(function (cargo) {
                        if (cargo) {
                            let str = '';
                            if (cargo.get('function')) {
                                switch (cargo.get('function')) {
                                    case 'Loading':
                                        str = 'L';
                                        break;
                                    case 'Discharging':
                                        str = 'D';
                                        break;
                                    case 'Transshipment':
                                        str = 'TS';
                                        break;
                                    case 'Lightering':
                                        str = 'LT';
                                        break;

                                    default:
                                        break;
                                }
                            }
                            label_str +=
                                '<div class="a-cargo-item"><div class="a-cargo-title"><span class="a-qty">' +
                                Ext.util.Format.number(cargo.get('quantity'), '0,000.000') +
                                ' ' +
                                cargo.get('unit') +
                                '</span><span class="a-commodity">' +
                                cargo.get('commodity') +
                                '</span><span class="a-function a-function-sm function-' +
                                cargo.get('function') +
                                '" title="' +
                                cargo.get('function') +
                                '">' +
                                str +
                                '</span></div></div>';
                        }
                    });
                    let tipExist = Ext.getCmp('cargoesLabelTooltip');
                    if (tipExist) {
                        tipExist.destroy();
                    }
                    Ext.create('Ext.tip.ToolTip', {
                        target: selected,
                        delegate: '.cargo-multiple',
                        ui: 'multiple',
                        manageBorders: false,
                        anchorToTarget: true,
                        id: 'cargoesLabelTooltip',
                        autoDestroy: true,
                        anchor: true,
                        autoHide: true,
                        allowOver: true,
                        closable: false,
                        showOnTap: true,
                        title: 'Cargoes',
                        listeners: {
                            beforeshow: function () {
                                this.setHtml(label_str);
                            },
                        },
                    });
                }
            }
        },
    },
});

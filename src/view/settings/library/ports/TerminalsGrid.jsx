import './SuggestDialogs/SuggestTerminal/SuggestTerminalDialog';
import '../../../../model/suggestions/Terminal';

Ext.define('Abraxa.view.settings.library.ports.TerminalsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.terminals.grid',
    flex: 1,
    ui: 'bordered',
    cls: 'abraxa-grid a-offset-grid',
    reference: 'terminalsGrid',
    keyMapEnabled: true,
    loadingText: false,
    infinite: false,
    //    keyMap: {
    //        scope: 'this',
    //        ESC: function () {
    //            let record = this.upVM().get('terminalsGrid.selection'),
    //                grid = Ext.ComponentQuery.query('settings\\.library\\.terminals\\.grid')[0];
    //
    //            if (record) {
    //                record.reject();
    //            }
    //            grid.deselectAll();
    //        },
    //    },
    bind: {
        store: '{portServedTerminals}',
    },
    scrollable: 'y',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"> <g id="Group_20500" data-name="Group 20500" transform="translate(-1244 -493)"> <g id="Group_20499" data-name="Group 20499" transform="translate(410 148)" opacity="0.6"> <circle id="Ellipse_776" data-name="Ellipse 776" cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/> </g> <g id="Group_19392" data-name="Group 19392" transform="translate(1278.973 530.676)"> <path id="Path_9902" data-name="Path 9902" d="M50.647,17.459V46.242H45.242V24.621H12.811V46.242H7.405V17.459L29.026,8.811Zm5.405,34.188V13.811L29.026,3,2,13.811V51.647H18.216V30.026H39.837V51.647ZM26.324,46.242H20.918v5.405h5.405Zm5.405-8.108H26.324V43.54h5.405Zm5.405,8.108H31.729v5.405h5.405Z" transform="translate(-2 -3)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> </g> </g> </svg><div class="a-no-content-txt">No terminals available</div></div>',
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    itemConfig: {
        viewModel: true,
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            margin: '16 24 0 32',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                },
                {
                    xtype: 'searchfield',
                    ui: 'hovered-underline',
                    cls: 'a-field-icon icon-search',
                    width: 280,
                    placeholder: 'Search...',
                    clearable: true,
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            var terminals = this.upVM().get('portServedTerminals');
                            if (newValue == '') terminals.removeFilter('search');
                        },
                        action: function (me, newValue, oldValue, eOpts) {
                            const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                            var terminals = this.upVM().get('portServedTerminals');
                            terminals.removeFilter('search');
                            if (query.length > 2) {
                                terminals.addFilter(
                                    new Ext.data.Query({
                                        id: 'search',
                                        source: 'name like "' + query + '"',
                                    })
                                );
                            }
                        },
                    },
                },
                {
                    xtype: 'button',
                    ui: 'normal-light small',
                    iconCls: 'md-icon-add',
                    text: 'Suggest new entry',
                    testId: 'settingsLibrarySuggestNewTerminalBtn',
                    handler: function (me) {
                        const childSettingsMainVM = me.upVM(),
                            selectedPort = childSettingsMainVM.get('portsServerGrid.selection'),
                            currentUser = childSettingsMainVM.get('currentUser');

                        childSettingsMainVM.set('addEditTerminalTitle', AbraxaConstants.titles.addTerminal);

                        Ext.create(
                            'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalDialog',
                            {
                                viewModel: {
                                    parent: childSettingsMainVM,
                                    data: {
                                        selectedPort: selectedPort,
                                        currentUser: currentUser,
                                        record: Ext.create('Abraxa.model.suggestions.Terminal', {
                                            parent_uuid: selectedPort.get('port')?.uuid,
                                        }),
                                    },
                                },
                            }
                        ).show();
                    },
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Terminal',
            dataIndex: 'name',
            flex: 2,
            cls: 'a-column-offset-x32',
            cell: {
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (val, record) {
                if (val) {
                    return (
                        '<div class="vbox"><div class="a-badge a-badge-default"><i class="md-icon-outlined">warehouse</i></div><span class="text-truncate fw-b c-blue ml-16">' +
                        val +
                        '</span></div>'
                    );
                }
            },
        },
        {
            text: 'Type',
            flex: 1,
            dataIndex: 'type',
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    if (val) {
                        if (val == 'ro-ro') {
                            return 'Ro-Ro';
                        } else {
                            return Ext.String.capitalize(val);
                        }
                    }
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'ISPS code',
            dataIndex: 'isps_code',
            flex: 1,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return val;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Berths',
            dataIndex: 'berths',
            flex: 0.5,
            cell: {
                encodeHtml: false,
            },
            renderer: function (record) {
                if (record) {
                    return '<span class="a-status-badge status-admin a-status-sm status-round">' + record + '</span>';
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
                    cls: 'no_show',
                    padding: '0 12',
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
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            toolDefaults: {
                xtype: 'tool',
            },
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-outlined md-icon-edit',
                        ui: 'tool-md round',
                        slug: 'settingsLibraryPortServed',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'Edit',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            anchor: true,
                            closeAction: 'destroy',
                        },
                        handler: function (me) {
                            const childSettingsMainVM = me.upVM(),
                                terminal = childSettingsMainVM.get('record'),
                                currentUser = childSettingsMainVM.get('currentUser'),
                                selectedPort = childSettingsMainVM.get('portsServerGrid.selection');

                            childSettingsMainVM.set('addEditTerminalTitle', AbraxaConstants.titles.editTerminal);

                            Ext.create(
                                'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalDialog',
                                {
                                    viewModel: {
                                        parent: childSettingsMainVM,
                                        data: {
                                            selectedPort: selectedPort,
                                            currentUser: currentUser,
                                            record: Ext.create('Abraxa.model.suggestions.Terminal', {
                                                uuid: terminal.get('uuid'),
                                                meta_name: terminal.get('name'),
                                                parent_uuid: selectedPort.get('port')?.uuid,
                                            }),
                                        },
                                    },
                                }
                            ).show();
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

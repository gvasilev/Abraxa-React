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
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('terminalsGrid.selection'),
                grid = Ext.ComponentQuery.query('settings\\.library\\.terminals\\.grid')[0];

            if (record) {
                record.reject();
            }
            grid.deselectAll();
        },
    },
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
            // {
            //     xtype: 'button',
            //     text: 'Terminal',
            //     iconCls: 'md-icon-add',
            //     cls: 'a-no-content-btn',
            //     ui: 'normal-light medium',
            //     slug: 'settingsLibraryTerminalCreate',
            //     bind: {
            //         permission: '{userPermissions}',
            //     },
            //     handler: function (btn, e) {
            //         Ext.create('Abraxa.view.settings.library.ports.AddTerminal', {
            //             viewModel: {
            //                 parent: btn.upVM(),
            //                 data: {
            //                     editMode: false,
            //                     store: btn.upVM().get('portsServerGrid.selection').terminals(),
            //                     terminal: Ext.create('Abraxa.model.common.Terminal', {
            //                         port_id: btn.upVM().get('portsServerGrid.selection').get('port_id'),
            //                     })
            //                 },
            //             }
            //         }).show();
            //     }
            // }
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
                // {
                //     xtype: 'button',
                //     text: 'Terminal',
                //     testId: 'addTerminalButtonTestIdTerminalGrid',
                //     iconCls: 'md-icon-add',
                //     ui: 'action small',
                //     slug: 'settingsLibraryTerminalCreate',
                //     bind: {
                //         permission: '{userPermissions}',
                //     },
                //     handler: function (btn, e) {
                //         Ext.create('Abraxa.view.settings.library.ports.AddTerminal', {
                //             viewModel: {
                //                 parent: btn.upVM(),
                //                 data: {
                //                     editMode: false,
                //                     store: btn.upVM().get('portsServerGrid.selection').terminals(),
                //                     terminal: Ext.create('Abraxa.model.common.Terminal', {
                //                         port_id: btn.upVM().get('portsServerGrid.selection').get('port_id'),
                //                     })
                //                 },
                //             }
                //         }).show();
                //     }
                // },
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
                            var query = this.getValue().toLowerCase();
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
                    handler: function (me) {
                        let port = me.upVM().get('portsServerGrid.selection'),
                            legacyPort = me.upVM().get('legacyPort'),
                            currentUser = me.upVM().get('currentUser');
                        Ext.create(
                            'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalDialog',
                            {
                                viewModel: {
                                    parent: me.upVM(),
                                    data: {
                                        selectedPort: port,
                                        currentUser: currentUser,
                                        parent_id: legacyPort.uuid,
                                    },
                                    links: {
                                        record: {
                                            type: 'Abraxa.model.suggestions.Terminal',
                                            create: {
                                                legacy_parent_id: port.get('port_id'),
                                                parent_uuid: legacyPort.uuid,
                                            },
                                        },
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
                            let vm = me.upVM(),
                                terminal = me.upVM().get('record'),
                                currentUser = me.upVM().get('currentUser'),
                                selectedPort = me.upVM().get('portsServerGrid.selection');
                            if (Ext.Array.contains(me.upVM().get('userSubmissions'), currentUser.get('email'))) {
                                Ext.Ajax.request({
                                    url:
                                        Env.nomenclatureEndPoint +
                                        'api/registry/v1/terminals-legacy/' +
                                        terminal.get('id'),
                                    method: 'GET',
                                    success: function (response) {
                                        let data = Ext.decode(response.responseText);
                                        delete data['berths'];
                                        if (data.info_work_days) {
                                            data.info_work_days_start = data.info_work_days.start;
                                            data.info_work_days_end = data.info_work_days.end;
                                        }
                                        if (data.info_work_hours) {
                                            data.info_work_hours_start = moment(
                                                data.info_work_hours.start,
                                                'HH:mm'
                                            ).toDate();
                                            data.info_work_hours_end = moment(
                                                data.info_work_hours.end,
                                                'HH:mm'
                                            ).toDate();
                                        }
                                        if (data.coordinates_center) {
                                            data.coordinates_center_latitude = data.coordinates_center.latitude;
                                            data.coordinates_center_longitude = data.coordinates_center.longitude;
                                        }
                                        Ext.create(
                                            'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalDialog',
                                            {
                                                viewModel: {
                                                    parent: me.upVM(),
                                                    data: {
                                                        record: new Abraxa.model.suggestions.Terminal(
                                                            Object.assign({}, data)
                                                        ),
                                                        currentUser: currentUser,
                                                    },
                                                },
                                            }
                                        ).show();
                                    },
                                    failure: function failure(response) {},
                                });
                            } else {
                                Ext.create(
                                    'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalDialog',
                                    {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                record: Ext.create('Abraxa.model.suggestions.Terminal', {
                                                    id: terminal.get('id'),
                                                    meta_name: terminal.get('name'),
                                                    legacy_parent_id: selectedPort.get('port_id'),
                                                }),
                                            },
                                        },
                                    }
                                ).show();
                            }
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

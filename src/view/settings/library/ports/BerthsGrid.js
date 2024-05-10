Ext.define('Abraxa.view.settings.library.ports.BerthsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.berths.grid',
    flex: 1,
    ui: 'bordered',
    cls: 'abraxa-grid a-offset-grid',
    reference: 'berthsGrid',
    keyMapEnabled: true,
    loadingText: false,
    infinite: false,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('berthsGrid.selection'),
                grid = Ext.ComponentQuery.query('settings\\.library\\.berths\\.grid')[0];

            if (record) {
                record.reject();
            }
            grid.deselectAll();
        },
    },
    bind: {
        store: '{portServedBerths}',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-38 -31)"><g transform="translate(-796 -314)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(60 53)"><path d="M30.667,35.333a6.667,6.667,0,1,1,6.667-6.667A6.686,6.686,0,0,1,30.667,35.333Zm20-6c0-12.1-8.833-20.667-20-20.667s-20,8.567-20,20.667c0,7.8,6.5,18.133,20,30.467C44.167,47.467,50.667,37.133,50.667,29.333ZM30.667,2c14,0,26.667,10.733,26.667,27.333q0,16.6-26.667,39.333Q4.017,45.917,4,29.333C4,12.733,16.667,2,30.667,2Z" transform="translate(9.333 4.667)" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No berths available</div></div>',
            },
            // {
            //     xtype: 'button',
            //     text: 'Berth',
            //     iconCls: 'md-icon-add',
            //     cls: 'a-no-content-btn',
            //     ui: 'normal-light medium',
            //     slug: 'settingsLibraryBerthCreate',
            //     bind: {
            //         permission: '{userPermissions}',
            //     },
            //     handler: function (btn, e) {
            //         Ext.create('Abraxa.view.settings.library.ports.AddBerth', {
            //             viewModel: {
            //                 parent: btn.upVM(),
            //                 stores: {
            //                     terminalsPerPort: {
            //                         source: '{portsServerGrid.selection.terminals}'
            //                     }
            //                 },
            //                 data: {
            //                     editMode: false,
            //                     store: btn.upVM().get('portsServerGrid.selection').berths(),
            //                     berth: Ext.create('Abraxa.model.common.Berth', {
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
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                },
                // {
                //     xtype: 'button',
                //     text: 'Berth',
                //     testId: 'settingsLibraryBerthCreateTestId',
                //     iconCls: 'md-icon-add',
                //     ui: 'action small',
                //     slug: 'settingsLibraryBerthCreate',
                //     bind: {
                //         permission: '{userPermissions}',
                //     },
                //     handler: function (btn, e) {
                //         Ext.create('Abraxa.view.settings.library.ports.AddBerth', {
                //             viewModel: {
                //                 parent: btn.upVM(),
                //                 stores: {
                //                     terminalsPerPort: {
                //                         source: '{portsServerGrid.selection.terminals}'
                //                     }
                //                 },
                //                 data: {
                //                     editMode: false,
                //                     store: btn.upVM().get('portsServerGrid.selection').berths(),
                //                     berth: Ext.create('Abraxa.model.common.Berth', {
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
                            var berthStore = this.upVM().get('portServedBerths');
                            if (newValue == '') berthStore.removeFilter('search');
                        },
                        action: function (me, newValue, oldValue, eOpts) {
                            var query = this.getValue().toLowerCase();
                            var berthStore = this.upVM().get('portServedBerths');
                            berthStore.removeFilter('search');
                            if (query.length > 2) {
                                berthStore.addFilter(
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
                            currentUser = me.upVM().get('currentUser');
                        Ext.create(
                            'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestBerth.SuggestBerthDialog',
                            {
                                viewModel: {
                                    parent: me.upVM(),
                                    data: {
                                        selectedPort: port,
                                        currentUser: currentUser,
                                    },
                                    links: {
                                        record: {
                                            type: 'Abraxa.model.suggestions.Berth',
                                            create: true,
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
            text: 'Berth',
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
                        '<div class="vbox"><div class="a-badge a-badge-default"><i class="md-icon-outlined">place</i></div><span class="text-truncate fw-b c-blue ml-16">' +
                        val +
                        '</span></div>'
                    );
                }
            },
        },
        {
            text: 'Terminal',
            flex: 1,
            dataIndex: 'terminal_name',
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
            text: 'Type',
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
            text: 'Updated by',
            flex: 1,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                session: true,
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
                                berth = me.upVM().get('record'),
                                currentUser = me.upVM().get('currentUser'),
                                selectedPort = me.upVM().get('portsServerGrid.selection');
                            if (Ext.Array.contains(me.upVM().get('userSubmissions'), currentUser.get('email'))) {
                                Ext.Ajax.request({
                                    url: Env.nomenclatureEndPoint + 'api/registry/v1/berths-legacy/' + berth.get('id'),
                                    method: 'GET',
                                    success: function (response) {
                                        let data = Ext.decode(response.responseText);
                                        if (data.coordinates_center) {
                                            data.coordinates_center_latitude = data.coordinates_center.latitude;
                                            data.coordinates_center_longitude = data.coordinates_center.longitude;
                                        }
                                        Ext.create(
                                            'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestBerth.SuggestBerthDialog',
                                            {
                                                viewModel: {
                                                    parent: me.upVM(),
                                                    data: {
                                                        selectedPort: selectedPort,
                                                        record: new Abraxa.model.suggestions.Berth(
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
                                    'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestBerth.SuggestBerthDialog',
                                    {
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                selectedPort: selectedPort,
                                                record: Ext.create('Abraxa.model.suggestions.Berth', {
                                                    id: berth.get('id'),
                                                    meta_name: berth.get('name'),
                                                    legacy_parent_id: berth.get('terminal').id,
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

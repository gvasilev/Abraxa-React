Ext.define('Abraxa.view.directory.ports.TerminalsTab.TerminalsMain', {
    extend: 'Ext.Container',
    xtype: 'TerminalsMain',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'grid',
            flex: 1,
            ui: 'bordered',
            cls: 'abraxa-grid a-offset-grid',
            store: [],
            bind: {
                store: '{terminals}',
            },
            // scrollable: 'y',
            emptyText: {
                xtype: 'container',
                zIndex: 9,
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
                cls: 'cursor-pointer',
                padding: '4px 0',
                viewModel: true,
            },
            variableHeights: true,
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    cls: 'a-grid-top-bar',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'text-info c-blue-grey',
                            flex: 1,
                            bind: {
                                html: '<span class="fw-b">{terminals.count} terminals</span> for port {object_record.name}',
                            },
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'classic',
                            cls: 'a-field-icon icon-search',
                            width: 280,
                            placeholder: 'Search terminal',
                            clearable: true,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var terminals = this.upVM().get('terminals');
                                    if (newValue == '') terminals.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    var query = this.getValue().toLowerCase();
                                    var terminals = this.upVM().get('terminals');
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
                            xtype: 'div',
                            flex: 1,
                        },
                    ],
                },
            ],
            columns: [
                {
                    text: 'Terminal name',
                    dataIndex: 'name',
                    flex: 2.5,
                    cls: 'a-column-offset-x0',
                    cell: {
                        cls: 'a-cell-offset-x0',
                        encodeHtml: false,
                    },
                    renderer: function (val, record) {
                        if (val) {
                            return '<span class="text-truncate fw-b c-blue">' + val + '</span>';
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
                    dataIndex: 'berths_count',
                    align: 'center',
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (record) {
                        if (record) {
                            return (
                                '<span class="a-status-badge status-admin a-status-sm status-round">' +
                                record +
                                '</span>'
                            );
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                },
                {
                    text: 'Updated',
                    dataIndex: 'updated_at',
                    formatter: 'date("d M y")',
                    flex: 1,
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
                    if (location.event.target.classList.contains('a_grid_action')) {
                        return false;
                    }
                    Ext.getCmp('main-viewport')
                        .getController()
                        .redirectTo(
                            'port-info/' +
                                grid.upVM().get('object_record.id') +
                                '/' +
                                grid.upVM().get('subTab') +
                                '/' +
                                location.record.get('id')
                        );
                },
            },
        },
    ],
});

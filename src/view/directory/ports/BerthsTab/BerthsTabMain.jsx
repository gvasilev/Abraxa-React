import './BerthsCoordinates.jsx';
import './BerthsGeneral.jsx';
import './BerthsRestrictions.jsx';
import './BerthsRightContent.jsx';
Ext.define('Abraxa.view.directory.ports.BerthsTab.BerthsTabMain', {
    extend: 'Ext.Container',
    xtype: 'BerthsTabMain',
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
            keyMapEnabled: true,
            store: [],
            bind: {
                store: '{berths}',
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
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            cls: 'text-info c-blue-grey',
                            flex: 1,
                            bind: {
                                html: '<span class="fw-b">{berths.count} berths</span> for port {object_record.name}',
                            },
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'classic',
                            cls: 'a-field-icon icon-search',
                            width: 280,
                            placeholder: 'Search berth',
                            clearable: true,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var berthStore = this.upVM().get('berths');
                                    if (newValue == '') berthStore.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    var query = this.getValue().toLowerCase();
                                    var berthStore = this.upVM().get('berths');
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
                            xtype: 'div',
                            flex: 1,
                        },
                    ],
                },
            ],
            columns: [
                {
                    text: 'Berth',
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
                    text: 'Terminal',
                    flex: 1.5,
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
                    dataIndex: 'type',
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
                    text: 'Updated',
                    flex: 1,
                    dataIndex: 'updated_at',
                    cell: {
                        cls: 'a-cell-date',
                        encodeHtml: false,
                    },
                    renderer: function (val) {
                        if (val) {
                            return moment(val, 'YYYY-MM-DD').month(0).from(moment().month(0));
                        }
                        return '<span class="a-cell-placeholder">---</span>';
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
                    if (location.event.target.classList.contains('a_grid_action')) return false;
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
                    grid.upVM().set('subTabId', location.record.get('id'));
                },
            },
        },
    ],
});

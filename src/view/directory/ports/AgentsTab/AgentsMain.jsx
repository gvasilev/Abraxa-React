Ext.define('Abraxa.view.directory.ports.AgentsTab.AgentsMain', {
    extend: 'Ext.Container',
    xtype: 'AgentsMain',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch', // this is needed to stretch grid
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
                store: '{agents}',
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
                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-23973 -22522)"><g transform="translate(23139 22177)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><path d="M41.751,8.834H6.417A4.43,4.43,0,0,0,2,13.25v26.5a4.43,4.43,0,0,0,4.417,4.417H41.751a4.43,4.43,0,0,0,4.417-4.417V13.25A4.43,4.43,0,0,0,41.751,8.834Zm0,30.918H6.417V13.25H41.751ZM6.417,0H41.751V4.417H6.417Zm0,48.585H41.751V53H6.417ZM24.084,26.5a5.521,5.521,0,1,0-5.521-5.521A5.523,5.523,0,0,0,24.084,26.5Zm0-7.729a2.208,2.208,0,1,1-2.208,2.208A2.215,2.215,0,0,1,24.084,18.772ZM35.126,35.313c0-4.616-7.31-6.6-11.042-6.6s-11.042,1.988-11.042,6.6v2.23H35.126ZM17.039,34.23a12.376,12.376,0,0,1,14.112,0Z" transform="translate(24010.916 22557)" fill="#c8d4e6"></path></g></svg><div class="a-no-content-txt">No companies available</div></div>',
                    },
                ],
            },
            emptyTextDefaults: {
                xtype: 'emptytext',
                cls: 'a-empty-text',
            },
            itemConfig: {
                padding: '2px 0',
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
                            xtype: 'div',
                            cls: 'text-info c-blue-grey',
                            flex: 1,
                            bind: {
                                html: '<span class="fw-b">{agents.count} agents</span> for port {object_record.name}',
                            },
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'classic',
                            cls: 'a-field-icon icon-search',
                            width: 280,
                            placeholder: 'Search agent',
                            clearable: true,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var agentsStore = this.upVM().get('agents');
                                    if (newValue == '') agentsStore.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                                    var agentsStore = this.upVM().get('agents');
                                    agentsStore.removeFilter('search');
                                    if (query.length > 2) {
                                        agentsStore.addFilter(
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
                    text: 'Agent name',
                    dataIndex: 'name',
                    flex: 1,
                    cls: 'a-column-offset-x0',
                    cell: {
                        cls: 'a-cell-offset-x0',
                        encodeHtml: false,
                    },
                    renderer: function (val, record) {
                        if (val) {
                            return (
                                '<span class="hbox text-truncate fw-b c-blue">' +
                                val +
                                '<span class="a-verification a-verified ml-4"><i class="a-verification-icon md-icon"></i></span></span>'
                            );
                        }
                    },
                },
                {
                    text: 'Presence',
                    flex: 1,
                    dataIndex: 'id',
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (val, record) {
                        if (val) {
                            let str = this.upVM().get('object_record.name');
                            if (record.get('ports_served').length) {
                                str = str + ' + (' + record.get('ports_served').length + ')';
                            }
                            return '<div class="a-function"><span>' + str + '</span></div>';
                        }
                    },
                },
            ],
        },
    ],
});

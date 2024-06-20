import './CreateRule';

Ext.define('Abraxa.view.settings.users_teams.teams.rules.RulesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.teams.rules.grid',
    cls: 'abraxa-grid a-offset-grid',
    margin: 0,
    ui: 'bordered',
    shadow: false,
    flex: 1,
    hidden: true,
    bind: {
        store: '{rules}',
        hidden: '{teams_tabbar.activeTabIndex == 0 ? false: true}',
        hideHeaders: '{rules.count ? false : true}',
    },
    itemConfig: {
        viewModel: true,
    },
    reference: 'rulesGrid',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-833 -465)"><g transform="translate(-1 120)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M11.936,9.333H38.6l-13.36,16.8ZM4.6,8.293C9.989,15.2,19.936,28,19.936,28V44A2.675,2.675,0,0,0,22.6,46.667h5.333A2.675,2.675,0,0,0,30.6,44V28s9.92-12.8,15.307-19.707A2.661,2.661,0,0,0,43.8,4H6.709A2.661,2.661,0,0,0,4.6,8.293Z" transform="translate(869.73 501.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/></g></svg><div class="a-no-content-txt">No rules available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Rule',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: function (me) {
                    let team = me.upVM().get('teamsGrid.selection');
                    Ext.create('Abraxa.view.settings.users_teams.teams.rules.CreateRule', {
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                editMode: false,
                                record: Ext.create('Abraxa.model.rule.Rule', {
                                    owner_id: team.get('id'),
                                    owner_type: team.get('model_name'),
                                }),
                                team: team,
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
    columns: [
        {
            text: 'Property',
            cls: 'a-column-offset-x32',
            dataIndex: 'property',
            groupable: false,
            flex: 1,
            cell: {
                cls: 'a-cell-person a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    let record = this.upVM().get('ruleTypes').getById(value);
                    if (record) {
                        return (
                            '<div class="hbox"><div class="a-badge a-badge-teams"><i class="material-icons-outlined">filter_alt</i></div><div class="ml-12 fw-b c-blue">' +
                            record.get('name') +
                            '</div></div>'
                        );
                    }
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Condition',
            flex: 0.5,
            dataIndex: 'condition',
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    let str = '';
                    if (value == 'in') {
                        str = 'Equals';
                    }
                    if (value == 'not in') {
                        str = 'Does not equal';
                    }
                    return (
                        '<span class="hbox"><i class="material-icons-outlined fs-18 mr-8">functions</i>' +
                        str +
                        '</span>'
                    );
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Value',
            flex: 2,
            dataIndex: 'value',
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    let type = record.get('property'),
                        store = null,
                        result = [];
                    switch (type) {
                        case 'port_id':
                            result = record.get('port_names');
                            break;
                        case 'port_function':
                            result = value;
                            break;
                        case 'appointing_party_id':
                            result = record.get('organization_names');
                            break;
                        case 'office_id':
                            result = record.get('office_names');
                            break;
                        case 'agency_type_id':
                            store = this.upVM().get('agencyTypes');
                            if (store) {
                                Ext.Array.each(value, function (val) {
                                    let rec = store.getById(val);
                                    if (rec) {
                                        result.push(rec.get('name'));
                                    }
                                });
                            }
                            break;
                        default:
                            break;
                    }
                    if (result && result.length > 0) {
                        return (
                            '<div class="hbox"><i class="material-icons-outlined fs-18 mr-8">short_text</i><span class="fw-b text-truncate">' +
                            result.toString().replace(/,/g, ', ') +
                            '</span></div>'
                        );
                    } else {
                        return AbraxaConstants.placeholders.emptyValue;
                    }
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            dataIndex: '',
            minWidth: 96,
            // flex: 1,
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
                        xtype: 'button',
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        arrow: false,
                        bind: {
                            hidden: '{record.company_id ? false:true}',
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
                        menu: {
                            cls: 'a-main-edit-menu',
                            width: 160,
                            ui: 'has-icons medium',
                            items: [
                                {
                                    text: 'Edit',
                                    iconCls: 'md-icon-outlined md-icon-edit',
                                    handler: function (me) {
                                        let team = me.upVM().get('teamsGrid.selection');
                                        let dialog = Ext.create(
                                            'Abraxa.view.settings.users_teams.teams.rules.CreateRule',
                                            {
                                                viewModel: {
                                                    parent: me.upVM(),
                                                    data: {
                                                        editMode: true,
                                                        record: me.upVM().get('record'),
                                                        team: team,
                                                    },
                                                },
                                            }
                                        );
                                        dialog.show();
                                    },
                                },
                                {
                                    text: 'Delete',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    ui: 'decline',
                                    separator: true,
                                    handler: function (owner, tool, event) {
                                        let store = this.upVM().get('rules'),
                                            record = this.upVM().get('record');
                                        let team = this.upVM().get('teamsGrid.selection');

                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you would like to delete this row?',
                                            function (answer) {
                                                if (answer == 'yes') {
                                                    store.remove(record);
                                                    store.sync({
                                                        success: function () {
                                                            if (team) {
                                                                team.rules().commitChanges();
                                                                team.set('auto_update', new Date());
                                                            }
                                                            Ext.toast('Record deleted', 1000);
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
                    },
                ],
            },
        },
    ],
});

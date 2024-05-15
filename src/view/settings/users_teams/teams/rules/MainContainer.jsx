import './RulesGrid.jsx';
import '../TeamUsersGrid.jsx';
Ext.define('Abraxa.view.settings.users_teams.teams.rules.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.users_teams.teams.rules.main.container',
    layout: 'vbox',
    margin: '0 -32',
    flex: 1,
    scrollable: true,
    viewModel: {
        stores: {
            filteredRules: {
                source: '{ruleTypes}',
                autoLoad: true,
                filters: '{ruleFilter}',
            },
            rulesSource: {
                source: '{ruleTypes}',
            },
            rulesForFilter: {
                source: '{ruleTypes}',
            },
        },
        formulas: {
            ruleFilter: {
                bind: {
                    bindTo: '{rules}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        let currentUserType = this.get('currentUserType');
                        let rules = this.get('filteredRules'),
                            values = store.collect('property');
                        if (rules) rules.clearFilter();
                        return function (rec) {
                            if (
                                !Ext.Array.contains(values, rec.get('id')) &&
                                (rec.get('type') === 'all' || rec.get('type') === currentUserType)
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    padding: '0 32',
                    items: [
                        {
                            xtype: 'button',
                            testId: 'addRuleBtnRulesAndTeamsSettingsTestId',
                            text: 'Rule',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            height: 30,
                            hidden: true,
                            bind: {
                                hidden: '{teams_tabbar.activeTabIndex == 0 ? false: true}',
                            },
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
                        {
                            xtype: 'button',
                            testId: 'addUserBtnRulesAndTeamsSettingsTestId',
                            text: 'Assign users',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            height: 30,
                            hidden: true,
                            bind: {
                                hidden: '{teams_tabbar.activeTabIndex == 1 ? false: true}',
                            },
                            handler: function (me) {
                                let team = me.upVM().get('teamsGrid.selection');
                                Ext.create('Abraxa.view.settings.user_teams.teams.AssignTeamUsers', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            team: team,
                                        },
                                    },
                                }).show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'settings.teams.rules.grid',
                },
                {
                    xtype: 'settings.team.users.grid',
                },
            ],
        },
    ],
});

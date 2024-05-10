Ext.define('Abraxa.view.settings.users_teams.teams.TeamDetails', {
    extend: 'Ext.Container',
    xtype: 'usersettings.teamdetails',
    hidden: true,
    scrollable: true,
    margin: 0,
    flex: 1,
    itemId: 'teamDetalsContainer',
    cls: 'a-settings-main role_settings needs_hide',
    layout: {
        type: 'vbox',
        // align: 'stretch'
    },
    viewModel: {
        data: {
            isInit: true,
        },
        formulas: {
            rules: {
                bind: {
                    bindTo: '{teamsGrid.selection.rules}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        let team = this.get('teamsGrid.selection');
                        if (store.needsSync && this.get('isInit')) {
                            store.commitChanges();
                            this.set('isInit', false);
                        }
                        store.getProxy().setExtraParams({
                            team_id: team.get('id'),
                        });
                        return store;
                    }
                    return new Ext.data.Store({
                        proxy: {
                            type: 'memory',
                        },
                    });
                },
            },
        },
    },
    items: [
        {
            xtype: 'abraxa.titlebar',
            padding: 0,
            margin: '0 -12',
            bind: {
                title: '<div class="hbox"><span class="mr-4">{teamsGrid.selection.name}</span></div>',
            },
            items: [
                {
                    xtype: 'button',
                    margin: '0 16 0 0',
                    align: 'left',
                    iconCls: 'md-icon-keyboard-backspace',
                    ui: 'round default',
                    handler: function () {
                        let upContainer = Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0],
                            downContainer = Ext.ComponentQuery.query('[itemId=teamDetalsContainer]')[0];
                        downContainer.setHidden(true);
                        upContainer.setHidden(false);
                    },
                },
            ],
        },
        {
            xtype: 'textfield',
            clearable: false,
            maxWidth: '50%',
            ui: 'field-xl no-border classic',
            label: false,
            placeholder: 'Enter team name',
            bind: {
                value: '{teamsGrid.selection.name}',
            },
            required: true,
            listeners: {
                painted: function (me) {
                    me.focus();
                },
                blur: function (me) {
                    let record = me.upVM().get('teamsGrid.selection');
                    if (record.dirty) {
                        record.save({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    }
                },
            },
        },
        {
            xtype: 'textareafield',
            maxWidth: '50%',
            ui: 'no-border no-underline',
            cls: 'a-field-icon icon-short',
            placeholder: 'Enter description (optional)',
            bind: {
                value: '{teamsGrid.selection.description}',
            },
            listeners: {
                blur: function (me) {
                    let record = me.upVM().get('teamsGrid.selection');
                    if (record.dirty) {
                        record.save({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    }
                },
            },
        },
        {
            xtype: 'div',
            html: '<hr>',
        },
        {
            xtype: 'container',
            margin: '0 0 24 0',
            cls: 'a-titlebar a-bb-100',
            padding: '0',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'tabbar',
                    height: 64,
                    activeTab: 0,
                    reference: 'teams_tabbar',
                    publishes: {
                        activeTab: true,
                        activeTabIndex: true,
                    },
                    defaults: {
                        ui: 'tab-lg',
                        ripple: false,
                    },
                    items: [
                        {
                            text: 'Rules',
                        },
                        {
                            text: 'Users',
                            testId: 'usersTabSettingsTestId',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'settings.users_teams.teams.rules.main.container',
        },
    ],
});

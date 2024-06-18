import './OfficeGeneralInfo';
import './OfficeUsersGrid';
import './OfficeSettings';

Ext.define('Abraxa.view.settings.offices.OfficeDetails', {
    extend: 'Ext.Container',
    xtype: 'settings.offices.details',
    hidden: true,
    scrollable: true,
    margin: 0,
    flex: 1,
    itemId: 'officeDetalsContainer',
    cls: 'a-settings-main role_settings needs_hide',
    layout: {
        type: 'vbox',
    },
    viewModel: {
        stores: {
            usersWithoutOffice: {
                source: '{users}',
                filters: '{usersOfficeFilter}',
            },
        },
        formulas: {
            officeUsers: {
                bind: {
                    bindTo: '{officesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = record.users();
                        return store;
                    }
                    return new Ext.data.Store({
                        proxy: {
                            type: 'memory',
                        },
                    });
                },
            },
            usersOfficeFilter: {
                bind: {
                    bindTo: '{officesGrid.selection.users}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        let usersWithoutOffice = this.get('usersWithoutOffice'),
                            usersInOffice = [];
                        if (usersWithoutOffice) usersWithoutOffice.clearFilter();
                        store.each(function (rec, index) {
                            if (rec) {
                                usersInOffice.push(rec.get('user_id'));
                            }
                        });
                        return function (rec) {
                            if (!Ext.Array.contains(usersInOffice, rec.get('id'))) {
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
            xtype: 'abraxa.titlebar',
            padding: 0,
            margin: '0 -12',
            bind: {
                title: '<div class="hbox"><span class="mr-4">{officesGrid.selection.office_name}</span></div>',
            },
            items: [
                {
                    xtype: 'button',
                    margin: '0 16 0 0',
                    align: 'left',
                    iconCls: 'md-icon-keyboard-backspace',
                    ui: 'round default',
                    handler: function () {
                        let upContainer = Ext.ComponentQuery.query('[itemId=officesMainContainer]')[0],
                            downContainer = Ext.ComponentQuery.query('[itemId=officeDetalsContainer]')[0];
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
            placeholder: 'Enter office name',
            bind: {
                value: '{officesGrid.selection.office_name}',
            },
            required: true,
            listeners: {
                painted: function (me) {
                    me.focus();
                },
                blur: function (me) {
                    let store = me.upVM().get('companyOffices');
                    store.sync({
                        success: function () {
                            Ext.getCmp('main-viewport').upVM().get('currentCompany').load();
                            Ext.toast('Record updated', 1000);
                        },
                    });
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
                value: '{officesGrid.selection.description}',
            },
            listeners: {
                blur: function (me) {
                    let store = me.upVM().get('companyOffices');
                    store.sync({
                        success: function () {
                            Ext.getCmp('main-viewport').upVM().get('currentCompany').load();
                            Ext.toast('Record updated', 1000);
                        },
                    });
                },
            },
        },
        {
            xtype: 'div',
            html: '<hr>',
        },
        {
            xtype: 'container',
            margin: 0,
            cls: 'a-titlebar a-bb-100',
            padding: 0,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'tabbar',
                    height: 64,
                    padding: 0,
                    activeTab: 0,
                    reference: 'offices_tabbar',
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
                            text: 'General info',
                        },
                        {
                            text: 'Office settings',
                            testId: 'officeSettingsTabTestId',
                        },
                        {
                            text: 'Users',
                            testId: 'officeUsersTabTestId',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'settings.offices.general.info',
        },
        {
            xtype: 'settings.offices.users.grid',
        },
        {
            xtype: 'settings.offices.settings',
        },
    ],
});

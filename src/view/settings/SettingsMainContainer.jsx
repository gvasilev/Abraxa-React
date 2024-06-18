import './users_teams/MainContainer';
import './company/ComapanyMain';
import './automation/AutomationMain';
import './library/LibraryMainContainer';
import './offices/OfficesMain';
import './currencies/CurrenciesMainContainer';
import './workflows/WorkflowsMain';
import './integraions/IntegrationsMain';
import './users_teams/users/UserDetails';
import './users_teams/roles/RoleDetails';
import './automation/templates/task/TemplatesDetails';
import './users_teams/teams/TeamDetails';
import './offices/OfficeDetails';
import './currencies/CurrenciesDetails';

Ext.define('Abraxa.view.settings.SettingsMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.main.container',
    testId: 'settingsMain',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    items: [
        {
            xtype: 'settings.users_teams.main.container',
            account_type: 'all',
            hidden: true,
            slug: 'settings',
            bind: {
                hidden: '{settingsMenu.selection.hash == "users" ? false : true}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.company.main',
            account_type: 'all',
            hidden: true,
            slug: 'settings',
            bind: {
                hidden: '{settingsMenu.selection.hash == "company" ? false : true}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.automation.main',
            account_type: 'all',
            hidden: true,
            bind: {
                hidden: '{settingsMenu.selection.hash == "templates" ? false : true}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.library.main',
            account_type: 'all',
            hidden: true,
            bind: {
                hidden: '{settingsMenu.selection.hash == "library" ? false : true}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.offices.main',
            account_type: 'all',
            hidden: true,
            bind: {
                hidden: '{settingsMenu.selection.hash == "offices" ? false : true}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.currencies.main',
            account_type: 'all',
            hidden: true,
            bind: {
                hidden: '{settingsMenu.selection.hash == "currencies" ? false : true}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.workflows.main',
            account_type: 'all',
            hidden: true,
            bind: {
                hidden: '{settingsMenu.selection.hash == "workflows" ? false : true}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.integrations.main',
            account_type: 'all',
            hidden: true,
            bind: {
                hidden: '{settingsMenu.selection.hash == "integrations" ? false : true}',
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'usersettings.userdetails',
            slug: 'settings',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'usersettings.roledetails',
            slug: 'settings',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.templates.details',
            slug: 'settings',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'usersettings.teamdetails',
            slug: 'settings',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.offices.details',
            slug: 'settings',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'settings.currencies.details',
            slug: 'settings',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});

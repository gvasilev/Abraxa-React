import './users_teams/MainContainer.jsx';
import './company/ComapanyMain.jsx';
import './automation/AutomationMain.jsx';
import './library/LibraryMainContainer.jsx';
import './offices/OfficesMain.jsx';
import './currencies/CurrenciesMainContainer.jsx';
import './workflows/WorkflowsMain.jsx';
import './integraions/IntegrationsMain.jsx';
import './users_teams/users/UserDetails.jsx';
import './users_teams/roles/RoleDetails.jsx';
import './automation/templates/task/TemplatesDetails.jsx';
import './users_teams/teams/TeamDetails.jsx';
import './offices/OfficeDetails.jsx';
import './currencies/CurrenciesDetails.jsx';
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

import './CompaniesGrid';
import './CompaniesEditPanel';

Ext.define('Abraxa.view.cdb.company.CompanyView', {
    extend: 'Ext.Container',
    xtype: 'cdb.companyview',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    skipEditPermission: true,
    showNoPermissions: true,
    slug: 'cdb',
    bind: {
        permission: '{userPermissions}',
    },
    items: [
        {
            xtype: 'companiesgrid',
            flex: 1,
        },
        {
            xtype: 'company.editpanel',
        },
    ],
});

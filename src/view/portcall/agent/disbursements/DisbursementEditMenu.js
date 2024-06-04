import './DisbursementsUploadController';

Ext.define('Abraxa.view.portcall.disbursements.DisbursementEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcall.disbursement.edit.menu',
    controller: 'disbursements.uploadcontroller',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Delete',
            slug: 'portcallDisbursementDelete',
            ui: 'decline',
            bind: {
                disabled: '{!disableDelete}',
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: 'deleteDisbursement',
        },
    ],
});

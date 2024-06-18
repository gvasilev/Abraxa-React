Ext.define('Abraxa.view.settings.workflows.InvitationApprovalsContent', {
    extend: 'Ext.Container',
    xtype: 'InvitationApprovalsContent',
    padding: 32,
    hidden: true,
    cls: 'a-dialog-card a-dialog-card-last',
    items: [
        {
            xtype: 'div',
            cls: 'h5',
            html: 'Invitation actions',
        },
        {
            xtype: 'div',
            cls: 'h3',
            html: 'Then accept automatically',
        },
        {
            xtype: 'container',
            cls: 'a-dialog-card-info a-form-show',
            items: [
                {
                    xtype: 'div',
                    cls: 'a-info-box',
                    html: '<i class="md-icon">info</i>The system will automatically accept the invitation and notify the companies listed above',
                },
            ],
        },
    ],
});

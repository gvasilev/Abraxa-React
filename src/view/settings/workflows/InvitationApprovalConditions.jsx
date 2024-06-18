Ext.define('Abraxa.view.settings.workflows.InvitationApprovalConditions', {
    extend: 'Ext.Container',
    xtype: 'InvitationApprovalConditions',
    padding: 32,
    hidden: true,
    cls: 'a-dialog-card',
    items: [
        {
            xtype: 'div',
            cls: 'h5',
            html: 'Invitation conditions',
        },
        {
            xtype: 'div',
            cls: 'h3',
            html: 'When invitation status is Pending',
        },
        {
            xtype: 'container',
            cls: 'a-dialog-card-form',
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'combobox',
                    cls: 'a-field-icon icon-business icon-rounded',
                    placeholder: 'Choose company',
                    label: 'And only if company is',
                    labelAlign: 'left',
                    valueField: 'id',
                    displayField: 'name',
                    flex: 1,
                    store: {
                        type: 'AgentsStore',
                    },
                    multiSelect: true,
                    bind: {
                        value: '{workflow.invitation_companies}',
                    },
                },
            ],
        },
    ],
});

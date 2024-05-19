Ext.define('Abraxa.view.voyage.SuccessfullyAppointDialog', {
    extend: 'Ext.Dialog',
    xtype: 'SuccessfullyAppointDialog',
    ui: 'dialog-md type3',
    cls: 'a-dialog-success',
    margin: 0,
    padding: 0,
    closable: false,
    tools: {
        close: {
            tooltip: {
                showOnTap: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
            },
            handler: function () {
                let dialog = this.up('dialog');
                Ext.getCmp('main-viewport').getController().redirectTo('#operations/voyage-planner');
                dialog.destroy();
            },
        },
    },
    draggable: false,
    manageBorders: false,
    minWidth: 420,
    maxWidth: 420,
    minHeight: 240,
    items: [
        {
            xtype: 'container',
            flex: 1,
            showAnimation: 'pop',
            layout: {
                type: 'vbox',
                pack: 'middle',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'text-center',
                    style: 'margin: 0 auto',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="none"/><path d="M50.24,28.8A21.457,21.457,0,1,1,34.7,8.191L38.9,3.983A26.323,26.323,0,0,0,28.8,2,26.8,26.8,0,1,0,55.6,28.8M17.839,23.655,14.06,27.46,26.12,39.52l26.8-26.8L49.141,8.914,26.12,31.936Z" transform="translate(3.36 3.36)" fill="#009688"/></svg>',
                    width: 180,
                },
                {
                    xtype: 'div',
                    margin: '16 0 0 0',
                    cls: 'text-center a-success-heading',
                    html: '<h1 class="m-0">Your appointment request has been sent to</h1>',
                },
                {
                    xtype: 'div',
                    cls: 'a-success-company',
                    flex: 1,
                    bind: {
                        html: '<div class="hbox"><span class="fw-b a-link fs-16">{nomination.lead_agent_name}</span><i class="md-icon md-filled c-teal ml-2 md-16">verified_user</i></div><div class="c-blue-grey fs-13">{nomination.lead_agent_email}</div>',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'text-center a-success-text',
                    margin: '16 0',
                    padding: '0 32 8 32',
                    html: '<span style="font-size: 12px; color: #6B7C93; line-height: 1.4;">You will receive an e-mail & system notification once the requested party has accepted your request.</span>',
                },
                {
                    xtype: 'div',
                    margin: '0 48',
                    cls: 'a-divider',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    padding: '24 0',
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'action',
                            text: 'Back to voyage',
                            handler: function (me) {
                                Ext.getCmp('main-viewport').getController().redirectTo('#operations/voyage-planner');
                                me.up('dialog').destroy();
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

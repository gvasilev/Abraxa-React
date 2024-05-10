Ext.define('Abraxa.view.voyage.AppointPreview', {
    extend: 'Ext.Dialog',
    xtype: 'AppointPreview',
    cls: 'a-dialog-fullscreen a-dialog-appointment-preview a-dialog-card-layout',
    scrollable: 'y',
    fullscreen: true,
    closable: false,
    tools: {
        close: {
            cls: 'close_dialog_tool',
            ui: 'tool-lg round',
            handler: function () {
                let dialog = this.up('dialog');
                dialog.destroy();
            },
        },
    },
    draggable: false,
    width: '100%',
    height: '100%',
    title: false,
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            items: [
                {
                    xtype: 'container',
                    margin: '0 0 16 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'center',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'default outlined',
                            iconCls: 'md-icon-print md-icon-outlined',
                            cls: 'print_preview',
                            text: 'Print',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    width: 1080,
                    cls: 'a-dialog-card',
                    style: 'margin: 8px auto;',
                    items: [
                        {
                            xtype: 'container',
                            bodyCls: 'abx-blank-body',
                            cls: 'main_content',
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        cls: 'a-dialog-card-footer',
        layout: {
            type: 'hbox',
            pack: 'center',
        },
        items: [
            {
                xtype: 'div',
                flex: 1,
            },
            {
                xtype: 'button',
                enableToggle: true,
                bind: {
                    hidden: '{proceedAppointment && activePortcall.is_locked_for_editing ? true:false}',
                },
                ui: 'action loading',
                cls: 'appoint_agent',
                text: 'Appoint agent',
            },
            {
                xtype: 'container',
                cls: 'a-item-appointment-container text-left',
                padding: '0 16',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                hidden: true,
                bind: {
                    hidden: '{!pendingAgent}',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'a-item-appointment-icon mr-12',
                        html: '<i class="md-icon md-18 c-yellow">schedule</i>',
                    },
                    {
                        xtype: 'container',
                        cls: 'a-item-appointment-info-container',
                        items: [
                            {
                                cls: 'c-blue-grey fs-12',
                                html: 'Pending appointment ',
                            },
                            {
                                cls: 'a-link',
                                bind: {
                                    html: '{pendingAgent.lead_agent_name}',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                xtype: 'container',
                cls: 'a-item-appointment-container text-left',
                padding: '0 16',
                hidden: true,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                bind: {
                    hidden: '{!appointedAgent}',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'a-item-appointment-icon mr-12',
                        html: '<i class="md-icon md-18 c-green">check</i>',
                    },
                    {
                        xtype: 'container',
                        cls: 'a-item-appointment-info-container',
                        items: [
                            {
                                cls: 'c-blue-grey fs-12',
                                html: 'Appointed agent ',
                            },
                            {
                                cls: 'a-link',
                                bind: {
                                    html: '{appointedAgent.lead_agent_name}',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
});

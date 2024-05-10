Ext.define('Abraxa.view.directory.agents.AgentPublicProfile', {
    extend: 'Ext.Container',
    xtype: 'AgentPublicProfile',
    reference: 'AgentPublicProfile',
    cls: 'a-directory-inner-container a-agent-profile-container',
    layout: 'vbox',
    flex: 1,
    items: [
        // Agent profile header
        {
            xtype: 'container',
            cls: 'a-agent-profile-header',
            docked: 'top',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                // Agent profile title
                {
                    xtype: 'container',
                    cls: 'a-agent-profile-title',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'tool',
                            iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                            ui: 'tool-lg',
                            handler: function () {
                                Ext.getCmp('main-viewport').getController().redirectTo('directory');
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'hbox',
                            bind: {
                                html: '{verifiedStatusHtml}',
                            },
                        },
                    ],
                },
                // Agent profile company logo
                {
                    xtype: 'image',
                    testId: 'settingsCompProfileLogoImgCmp',
                    itemId: 'originalCompanyLogo',
                    cls: 'a-agent-profile-logo',
                    bind: {
                        src: '{selectedCompanyLogo}',
                    },
                    mode: 'image',
                    align: 'center',
                },
            ],
        },
        {
            xtype: 'AgentInfo',
        },
    ],
});

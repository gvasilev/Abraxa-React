import './ChatterMessages';
import './ChatterInput';

Ext.define('Abraxa.view.chatter.ChatterMain', {
    extend: 'Ext.Container',
    xtype: 'chatter',
    // cls: 'a-chatter',
    slug: 'portcallPublicBoard',
    bind: {
        cls: 'a-chatter chameleon_chatter',
        permission: '{userPermissions}',
    },
    padding: 0,
    bodyPadding: 0,
    title: false,
    header: false,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    manageBorders: false,
    // border: false,
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-titlebar',
            items: [
                {
                    xtype: 'div',
                    margin: '0 0 0 12',
                    html: '<i class="material-icons-outlined">group</i>',
                },
                {
                    xtype: 'title',
                    title: 'Public board',
                    bind: {
                        title: '{selectedChat.selection ? selectedChat.selection.org_name : "Public board"}',
                    },
                },
                // {
                //     xtype: 'tabbar',
                //     cls: 'a-chatter-tabs',
                //     // activeTab: 0,
                //     items: [{
                //             title: 'Message board',
                //             bind: {
                //                 title: '{selectedChat.selection ? selectedChat.selection.org_name : "Message board"}'
                //             }
                //         },
                //         // {
                //         //     iconCls: 'md-icon-outlined md-icon-chat-bubble-outline',
                //         // }
                //     ]
                // }
            ],
        },
        {
            xtype: 'chatter.messages',
        },
        {
            xtype: 'chatter.input',
        },
    ],
});

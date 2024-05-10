Ext.define('Abraxa.view.profile.ProfileMainContainer', {
    extend: 'Ext.Container',
    xtype: 'profile.main.container',
    bodyCls: 'a-main-container a-profile',
    flex: 1,
    layout: 'vbox',
    viewModel: 'profile-viewmodel',
    controller: 'profile.controller',
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'container',
            cls: 'a-user-heading',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-user-image',
                    items: [
                        {
                            xtype: 'image',
                            itemId: 'imageHead',
                            bind: {
                                src: '{userProfileImage}',
                            },
                            mode: 'image',
                            align: 'center',
                        },
                        {
                            xtype: 'filefield',
                            ui: 'default',
                            cls: 'a-edit-image',
                            accept: 'image',
                            name: 'pic',
                            itemId: 'imgField',
                            listeners: {
                                change: 'onFileChange',
                            },
                        },
                        {
                            xtype: 'button',
                            cls: 'a-delete-image',
                            iconCls: 'md-icon-close',
                            ui: 'round default',
                            right: 0,
                            tooltip: {
                                showOnTap: true,
                                html: 'Remove image',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                this.find('imageHead').setSrc(
                                    AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image.svg'
                                );
                                let record = this.upVM().get('currentUser');
                                if (record) {
                                    record.set('profile_image', '');
                                    record.save({
                                        success: function (batch, opt) {
                                            Ext.toast('Record updated', 1000);
                                        },
                                        failure: function (batch, operations) {
                                            Ext.Msg.alert('Something went wrong', 'Cannot update user');
                                        },
                                    });
                                }
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                    },
                    defaults: {
                        listeners: {
                            blur: function (me) {
                                let record = me.upVM().get('currentUser');
                                if (record.dirty) {
                                    record.save({
                                        success: function () {
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
                                }
                            },
                        },
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            margin: '0 4 0 0',
                            ui: 'field-xl no-border classic',
                            textAlign: 'right',
                            label: false,
                            clearable: false,
                            placeholder: 'First name',
                            bind: {
                                value: '{currentUser.first_name}',
                            },
                            required: true,
                            tooltip: {
                                showOnTap: true,
                                html: 'Edit First name',
                                align: 'b100-r20',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                                anchor: true,
                            },
                        },
                        {
                            xtype: 'textfield',
                            margin: '0 0 0 4',
                            ui: 'field-xl no-border classic',
                            label: false,
                            clearable: false,
                            placeholder: 'Last name',
                            bind: {
                                value: '{currentUser.last_name}',
                            },
                            tooltip: {
                                showOnTap: true,
                                html: 'Edit Last name',
                                align: 'b0-l20',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                                anchor: true,
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'center',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-status-badge a-has-icon status-active rounded',
                                    html: '<i class="material-icons-outlined">done</i><span>Active</span>',
                                },
                            ],
                        },
                        {
                            xtype: 'tabbar',
                            border: true,
                            manageBorders: false,
                            height: 64,
                            padding: '0 8',
                            animateIndicator: false,
                            activeTab: 0,
                            style: 'border-bottom-width: 1px; border-bottom-style: solid;',
                            defaults: {
                                ui: 'tab-lg',
                                ripple: false,
                            },
                            items: [
                                {
                                    text: 'Personal profile',
                                    type: 'personal.main',
                                },
                                {
                                    text: 'Security',
                                    type: 'security',
                                },
                                {
                                    text: 'Email signature',
                                    type: 'signature',
                                },
                                {
                                    text: 'Session history',
                                    type: 'signature',
                                },
                            ],
                            listeners: {
                                activeTabchange: function (me, value) {
                                    let activeTab = me.getActiveTab(),
                                        profileCardContainer = Ext.ComponentQuery.query('#profileCardContainer')[0];
                                    profileCardContainer.setActiveItem(this.items.indexOf(activeTab));
                                },
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            scrollable: true,
            itemId: 'profileCardContainer',
            layout: {
                type: 'card',
                // animation: 'slide'
            },
            items: [
                {
                    xtype: 'profile.main',
                },
                {
                    xtype: 'profile.security',
                },
                {
                    xtype: 'profile.signature',
                },
                {
                    xtype: 'profile.session.history',
                },
            ],
        },
    ],
});

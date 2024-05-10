Ext.define('Abraxa.view.notes.NotesNotify', {
    extend: 'Ext.Container',
    xtype: 'notes.notify',
    cls: 'a-notify',
    flex: 1,
    margin: '0 16 0 0',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start',
    },
    items: [
        {
            xtype: 'container',
            cls: 'notify_users',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-notify-title',
                    html: '<span class="sm-title">Subscribers</span>',
                },
                {
                    xtype: 'list',
                    cls: 'a-notify-users dataview-horizontal',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    bind: {
                        store: '{object_record.watching}',
                    },
                    scrollable: false,
                    inline: {
                        wrap: false,
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                user: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        if (record) {
                                            let store = this.get('users'),
                                                user = store.queryBy(function (rec, id) {
                                                    return rec.get('id') == record.get('user_id');
                                                }).items[0];
                                            if (user) {
                                                let abbr = user.get('first_name')[0] + '.' + user.get('last_name'),
                                                    abbr2l = user.get('first_name')[0] + user.get('last_name')[0];

                                                let image =
                                                    '<div class="a-person a-icon-round"><span class="a-int" style="background-color:#3F51B5;">' +
                                                    abbr2l +
                                                    '</span></div>';

                                                if (user.get('profile_image'))
                                                    image =
                                                        '<div class="a-person a-icon-round"><img data-id="last_updated_by_appointments" class="a-profile-image" height="28" src="' +
                                                        user.get('profile_image') +
                                                        '"></div>';

                                                return {
                                                    user_name: abbr,
                                                    image: image,
                                                };
                                            }
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'div',
                        cls: 'a-user',
                        bind: {
                            html: '{user.image}',
                            tooltip: {
                                anchorToTarget: true,
                                align: 'bc-tc?',
                                html: '{user.user_name}',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                closeAction: 'destroy',
                            },
                        },
                    },
                    listeners: {
                        childtap: function (me, location) {
                            let vm = this.upVM();
                            if (location.record) {
                                let tipExist = Ext.getCmp('createdByTool');
                                if (tipExist) {
                                    tipExist.destroy();
                                }
                                let userData = location.record.getData();
                                if (location.record.get('user')) {
                                    userData = location.record.get('user');
                                }
                                Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                                    target: location.item,
                                    id: 'createdByTool',
                                    viewModel: {
                                        data: {
                                            user: userData,
                                            clickedElement: location.item,
                                        },
                                    },
                                }).showBy(location.item, 'bc-tc?');
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                    margin: '0 6 0 0',
                    html: '<div class="notify_empty hbox"><i class="md-icon md-icon-outlined md-18" style="color: rgba(176, 190, 197, 0.8); font-weight: 100;">person</i></div>',
                    hidden: true,
                    bind: {
                        hidden: '{object_record.watching.length ? true : false}',
                    },
                    tooltip: {
                        anchorToTarget: true,
                        align: 'bc-tc?',
                        html: 'No subscribers',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                },
                {
                    xtype: 'button',
                    margin: '0 0 0 4',
                    ui: 'tool-sm round',
                    hidden: true,
                    bind: {
                        hidden: '{editMode ? false : true}',
                    },
                    tooltip: {
                        anchorToTarget: true,
                        align: 'bc-tc?',
                        html: 'Add user',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                    iconCls: 'md-icon-add md-icon-outlined',
                    handler: function () {
                        this.up('[xtype=notes\\.notify]').down('[cls=notify_users]').hide();
                        this.up('[xtype=notes\\.notify]').down('[cls~=notify_combobox]').show();
                        this.up('[xtype=notes\\.notify]').down('[cls~=notify_combobox]').focus();
                    },
                },
            ],
        },
        {
            xtype: 'subscribers-combo',
        },
    ],
});

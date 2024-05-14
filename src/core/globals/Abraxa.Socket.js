Ext.define('Abraxa.Socket', {
    singleton: true,

    init: function (company_id) {
        if (Env.useSSENotifications === true) {
            let socket;

            let connect = function (onNotificationReceive, onError) {
                socket = new EventSource(new URL('/broadcast/sse/', Env.SSEEventSource) + company_id);
                socket.addEventListener('message', (ev) => {
                    onNotificationReceive(JSON.parse(ev.data));
                });
                socket.onerror = onError;
            };
            connect(this.onNotificationReceive, function () {
                socket.close();
            });
            setInterval(() => {
                if (socket.readyState == EventSource.CLOSED) {
                    console.log('reconnecting to SSE');
                    connect(this.onNotificationReceive, function () {
                        socket.close();
                    });
                }
            }, 10000);
        } else {
            this.socket = io('/company-' + company_id, {
                forceNew: true,
            });
            this.socket.on('connect', this.onConnect);
            this.socket.on('chatter', this.onChatterReceive);
            this.socket.on('notification', this.onNotificationReceive);
        }
    },

    onConnect: function () {
        let user = Ext.Viewport.getViewModel().get('currentUser').get('full_name');
        this.emit('userOnline', user);
    },

    onChatterReceive: function (messageData) {
        let store = Ext.getStore('Chatter.messages'),
            currentUser = Ext.Viewport.getViewModel().get('currentUser');

        if (messageData.created_by !== currentUser.get('id') && store) store.reload();
    },

    onNotificationReceive: function (messageData) {
        const portcallStore = Ext.getStore('portcalls');
        const globalViewModel = Ext.Viewport.getViewModel();
        const currentUser = globalViewModel.get('currentUser');
        const mainViewport = Ext.getCmp('main-viewport');
        const activeItem = mainViewport.getActiveItem();
        const vm = activeItem.getViewModel();
        const object_record = vm ? vm.get('object_record') : null;
        const object_id = vm ? vm.get('object_id') : null;
        const object_meta_id = vm ? vm.get('object_meta_id') : null;
        const invitationStore = vm ? vm.get('invitations') : [];
        const myTasks = vm ? vm.get('myTasks') : [];
        const myMentions = vm ? vm.get('myMentions') : [];
        const announcements = vm ? vm.get('announcements') : [];
        const recentlyOpened = vm ? vm.get('recentlyOpened') : [];
        const notificationStore = vm ? vm.get('notifications') : [];

        const showNotificationMessage = function () {
            const notification_popup = Ext.getCmp('notification');

            if (notification_popup) {
                notification_popup.destroy();
            }

            var notification = Ext.create('Abraxa.view.notification.NotificationMessage', {
                viewModel: {
                    data: {
                        notification: messageData,
                    },
                },
            }).show();
            setTimeout(function () {
                notification.destroy();
            }, 3000);
        };

        if (currentUser.get('current_company_id') === messageData.company_id) {
            let reloadNotificationStore = true;
            if (object_record && object_record.get('id') === messageData.notifiable_id) {
                if (messageData.new_portcall_id) {
                    window.location.hash = '#portcall/' + messageData.new_portcall_id;
                    if (Ext.getStore('portcalls')) {
                        Ext.getStore('portcalls').reload();
                    }
                    return;
                }
            }

            if (messageData.type === 'chatter_message' || messageData.type === 'chatter_message_internal') {
                let store = Ext.getStore('Chatter.messages'),
                    currentUser = Ext.Viewport.getViewModel().get('currentUser');

                if (store && messageData.sender_user_id !== currentUser.get('id')) {
                    store.reload();
                }
            }

            switch (messageData.type) {
                case 'portcall_invitation':
                case 'portcall_invitation_principal':
                    if (invitationStore) {
                        invitationStore.load({
                            callback: function () {
                                showNotificationMessage();
                            },
                        });
                    }
                    break;
                case 'portcall_invitation_update':
                    if (object_record && object_record.get('id') === messageData.notifiable_id) object_record.load();

                    if (invitationStore) invitationStore.load();

                    if (Ext.getStore('portcalls')) {
                        Ext.getStore('portcalls').reload();
                    }

                    showNotificationMessage();
                    break;
                case 'in_system':
                case 'mention':
                case 'task':
                case 'announcement':
                case 'mention_default':
                    reloadNotificationStore = false;
                    if (currentUser.get('id') === messageData.user_id) {
                        if (object_record) object_record.load();

                        showNotificationMessage();

                        if (messageData.type === 'task' && myTasks) myTasks.load();

                        if (messageData.type === 'mention' || (messageData.type === 'mention_default' && myMentions))
                            myMentions.load();

                        if (messageData.type === 'announcement' && announcements) announcements.load();
                        reloadNotificationStore = true;
                    }
                    break;
                case 'record_update':
                    let recordStore = Ext.getStore(messageData.store);
                    if (
                        object_record &&
                        object_meta_id === messageData.notifiable_id &&
                        object_id === messageData.object_id
                    ) {
                        if (currentUser.get('id') !== messageData.user.id) {
                            object_record.load();

                            if (object_record.get('is_archived')) {
                                let archivedStore = Ext.getStore('portcallsClosed');
                                let record = recordStore.getById(messageData.notifiable_id);
                                if (record && archivedStore) {
                                    archivedStore.add(record);
                                }
                            }

                            let abbr = messageData.user.first_name[0] + messageData.user.last_name[0],
                                name = messageData.user.first_name[0] + '.' + messageData.user.last_name,
                                img =
                                    '<div class="part_abbr a-badge-abbr"><span class="a-int">' + abbr + '</span></div>';

                            if (messageData.user.profile_image && messageData.user.profile_image !== '') {
                                img =
                                    '<div class="part_abbr a-badge-abbr a-badge-img"><img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                    messageData.user.profile_image +
                                    '"></div>';
                            }

                            //Check if there is a loaded disbursment and reload
                            Ext.Object.each(vm.children, function (key, child) {
                                if (child.type === 'DisbursementsViewModelPrincipal') {
                                    child.get('selectedDisbursement').load();
                                }
                            });

                            var notification = Ext.create('Ext.Dialog', {
                                modal: false,
                                height: 40,
                                minWidth: 100,
                                maxWidth: 256,
                                bottom: 32,
                                left: 0,
                                right: 0,
                                cls: 'a-sheet',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'hbox',
                                        html: img,
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-sheet-message',
                                        html:
                                            '<strong style="margin-left: 8px;" class="text-truncate a-max-width-70">' +
                                            name +
                                            '</strong>&nbsp;updated this record',
                                    },
                                ],
                                showAnimation: {
                                    type: 'slide',
                                    direction: 'top',
                                },
                                hideAnimation: 'fadeOut',
                                listeners: {
                                    initialize: function () {
                                        this.getHideAnimation().on({
                                            animationend: function () {
                                                this.destroy();
                                            },
                                            scope: this,
                                        });
                                    },
                                },
                            }).show();

                            setTimeout(function () {
                                notification.destroy();
                            }, 2000);
                        }
                        if (recordStore) {
                            let record = recordStore.getById(messageData.notifiable_id);
                            if (record) {
                            }
                        }
                    } else {
                        if (recordStore && currentUser.get('id') !== messageData.user.id) {
                            let record = recordStore.getById(messageData.notifiable_id);
                            if (record) {
                                //dirty fix when record load store missing and have error
                                //Row.js?_dc=1640789807814:507 Uncaught TypeError: Cannot read properties of null (reading 'store')
                                //with small delay we dont have problem but is dirty hack..
                                var loadDelay = new Ext.util.DelayedTask(function () {
                                    record.load();
                                });
                                loadDelay.delay(1000);
                                let archivedStore = Ext.getStore('portcallsClosed');
                                if (record.get('is_archived') && archivedStore) {
                                    archivedStore.add(record);
                                }
                            }
                        }
                    }
                    reloadNotificationStore = false;

                    break;
                case 'remove_portcall_member':
                    showNotificationMessage();
                    if (messageData.notifiable_id && messageData.portcall_id) {
                        if (
                            vm.get('routeHash') &&
                            vm.get('routeHash') === '#portcall' &&
                            vm.get('object_meta_id') &&
                            vm.get('object_meta_id') === messageData.portcall_id
                        ) {
                            window.location.hash = '#portcall/' + messageData.notifiable_id;
                        }
                    }
                    if (recentlyOpened) recentlyOpened.load();
                    if (portcallStore) portcallStore.reload();

                    break;
                case 'member_access':
                    if (object_record && object_record.get('id') === messageData.notifiable_id) {
                        if (messageData.type === 'member_access') {
                            Ext.create('Ext.MessageBox', {
                                ui: 'warning',
                                testId: 'permissionsUpdateMemberAccessMsgbox',
                                title: 'Permissions update',
                                innerCls: 'a-bgr-white',
                                message: 'Your permissions for this portcall have changed. <br>Please reload the page.',
                                width: 300,
                                dataTitle: 'Warning',
                                modal: true,
                                draggable: false,
                                bbar: {
                                    manageBorders: false,
                                    items: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            iconCls: 'md-icon-refresh',
                                            ui: 'action',
                                            text: 'Reload',
                                            testId: 'permissionsUpdateMemberAccessMsgboxReloadBtn',
                                            handler: function () {
                                                window.history.replaceState(
                                                    {},
                                                    '',
                                                    '#portcall/' + object_record.get('id')
                                                );
                                                window.location.reload();
                                            },
                                        },
                                    ],
                                },
                            }).show();
                            let els = document.getElementsByClassName('x-mask');
                            Ext.Array.each(els, function (el) {
                                el.classList.add('a-blurred');
                            });
                        }
                    } else {
                        showNotificationMessage();
                    }

                    break;
                case 'reload_tasks':
                    reloadNotificationStore = false;
                    if (currentUser.get('id') === messageData.user_id && myTasks) {
                        myTasks.load();
                        reloadNotificationStore = true;
                    }
                    break;

                case 'port_news':
                    Ext.fireEvent('updateNewPortNewsCount');
                    reloadNotificationStore = true;

                    if (Ext.getStore('portNewsStore')) {
                        Ext.getStore('portNewsStore').reload();
                    }

                    showNotificationMessage();
                    break;

                case 'reload_notes':
                    if (currentUser.get('id') === messageData.user_id && myMentions) {
                        myMentions.load();
                    }
                    break;
                case 'reload_public_board':
                    if (currentUser.get('id') !== messageData.user_id) {
                        let store = Ext.getStore('Chatter.messages');
                        if (object_record && object_record.get('id') === messageData.room_id && store) {
                            store.reload({
                                success: function () {
                                    Ext.toast('Public board has been updated', 1500);
                                },
                            });
                        }
                    }
                    break;
                case 'reload_aprovals':
                    if (object_record && object_record.get('id') === messageData.notifiable_id) {
                        let foders = object_record.folders(),
                            folder_files = [];

                        foders.each(function (folder) {
                            Array.prototype.push.apply(folder_files, folder.documents().getRange());
                        });

                        Ext.each(folder_files, function (file) {
                            if (file.get('id') === messageData.document_id) {
                                file.load();
                            }
                        });
                    }
                    break;
                case 'reload_store':
                    let data = messageData,
                        user_id = currentUser.get('id'),
                        store = Ext.getStore(data.store);
                    if (data.user_id !== user_id && store) {
                        switch (data.action) {
                            case 'create':
                                let Model = Abraxa.model[data.model][Ext.String.capitalize(data.model)];
                                Model.load(data.value, {
                                    callback: function (record) {
                                        store.add(record);
                                    },
                                });
                                Ext.toast(
                                    Ext.String.capitalize(data.model) +
                                        ' ' +
                                        data.hash +
                                        '-' +
                                        data.value +
                                        ' has been created',
                                    1500
                                );
                                break;

                            case 'delete':
                                let record = store.getById(data.value);
                                store.remove(record);
                                Ext.toast(
                                    Ext.String.capitalize(data.model) +
                                        ' ' +
                                        data.hash +
                                        '-' +
                                        data.value +
                                        ' has been deleted',
                                    1500
                                );
                                break;

                            case 'update':
                                let rec = store.getById(data.value);
                                if (rec) {
                                    rec.load({
                                        success: function (rec) {
                                            Ext.toast(
                                                Ext.String.capitalize(data.model) +
                                                    ' ' +
                                                    data.hash +
                                                    '-' +
                                                    data.value +
                                                    ' has been updated',
                                                1500
                                            );
                                            const voyagesGrid = Ext.ComponentQuery.query('[itemId=voyagesGrid]')[0];
                                            if (voyagesGrid) {
                                                if (voyagesGrid.isVisible(true)) {
                                                    const voyagesMainViewModel = voyagesGrid
                                                        .up('VoyagePrincipalMain')
                                                        .getViewModel();
                                                    const currentVoyage = voyagesMainViewModel.get('currentVoyage');
                                                    if (
                                                        currentVoyage &&
                                                        currentVoyage.get('id') === messageData.value
                                                    ) {
                                                        voyagesMainViewModel.set('currentVoyage', null);
                                                    }
                                                }
                                                voyagesGrid.refresh();
                                            }
                                            const portCallGrids = Ext.ComponentQuery.query(
                                                '[itemId^=PortCallsPricipalGrid]'
                                            );
                                            if (portCallGrids.length > 0) {
                                                portCallGrids.forEach((grid) => {
                                                    grid.refresh();
                                                });
                                            }
                                        },
                                    });
                                }
                                break;
                            case 'reload':
                                if (store) {
                                    store.reload();
                                }
                                break;
                        }
                    }
                    reloadNotificationStore = false;
                    return;
                case 'teams_rules_change':
                    if (messageData.user_id === currentUser.get('id')) {
                        if (Ext.getCmp('permission_dialog')) {
                            Ext.getCmp('permission_dialog').destroy();
                        }

                        Ext.create('Ext.MessageBox', {
                            ui: 'warning',
                            id: 'permission_dialog',
                            title: 'Permissions update',
                            testId: 'permissionsUpdateTeamsRulesMsgbox',
                            innerCls: 'a-bgr-white',
                            message: 'Your permissions have been changed. <br>Please reload the page.',
                            width: 300,
                            dataTitle: 'Warning',
                            modal: true,
                            draggable: false,
                            bbar: {
                                manageBorders: false,
                                items: [
                                    '->',
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-refresh',
                                        ui: 'action',
                                        text: 'Reload',
                                        testId: 'permissionsUpdateTeamsRulesMsgboxReloadBtn',
                                        handler: function () {
                                            window.location.reload();
                                        },
                                    },
                                ],
                            },
                        }).show();
                        let els = document.getElementsByClassName('x-mask');
                        Ext.Array.each(els, function (el) {
                            el.classList.add('a-blurred');
                        });
                    }
                    break;
                case 'user_offices_change':
                    if (messageData.user_id === currentUser.get('id')) {
                        if (currentUser.offices()) {
                            currentUser.offices().reload();
                        }
                    }
                    break;
                case 'user_suspended':
                    if (messageData.user_id === currentUser.get('id')) {
                        if (Ext.getCmp('user_suspend_dialog')) {
                            Ext.getCmp('user_suspend_dialog').destroy();
                        }
                        Ext.getApplication().logout();
                        Ext.create('Ext.MessageBox', {
                            ui: 'warning',
                            id: 'user_suspend_dialog',
                            title: 'Account suspended',
                            innerCls: 'a-bgr-white',
                            message: 'Your account has been suspended, please contact your system administrator.',
                            width: 300,
                            dataTitle: 'Warning',
                            modal: true,
                            draggable: false,
                            bbar: {
                                manageBorders: false,
                                items: [
                                    '->',
                                    {
                                        xtype: 'button',
                                        ui: 'action',
                                        text: 'Ok',
                                        handler: function () {
                                            this.up('dialog').destroy();
                                        },
                                    },
                                ],
                            },
                        }).show();
                        let els = document.getElementsByClassName('x-mask');
                        Ext.Array.each(els, function (el) {
                            el.classList.add('a-blurred');
                        });
                    }
                    break;
                case 'force_logout':
                    if (Ext.getCmp('force_logout_dialog')) {
                        Ext.getCmp('force_logout_dialog').destroy();
                    }

                    Ext.create('Ext.MessageBox', {
                        ui: 'warning',
                        id: 'force_logout_dialog',
                        title: 'Security update',
                        innerCls: 'a-bgr-white',
                        message: 'Your organization security settings have changed. <br>Please logout.',
                        dataTitle: 'Warning',
                        modal: true,
                        draggable: false,
                        closable: false,
                        bbar: {
                            manageBorders: false,
                            items: [
                                '->',
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-exit-to-app',
                                    ui: 'action',
                                    text: 'Logout',
                                    handler: function () {
                                        Ext.getApplication().logout();
                                    },
                                },
                            ],
                        },
                    }).show();
                    let els = document.getElementsByClassName('x-mask');
                    Ext.Array.each(els, function (el) {
                        el.classList.add('a-blurred');
                    });
                    break;
                case 'approval_request':
                    if (messageData.user_ids && messageData.user_ids.length > 0) {
                        if (
                            messageData.user_ids.includes(currentUser.get('id')) &&
                            messageData.company_id === currentUser.get('current_company_id')
                        ) {
                            if (object_record && object_record.get('id') === messageData.notifiable_id) {
                                object_record.load();
                            }
                            let disbursement;

                            Object.keys(vm.children).forEach(function (key) {
                                if (vm.children[key].type === 'DisbursementsViewModelPrincipal')
                                    disbursement = vm.children[key].get('selectedDisbursement');
                            });

                            if (disbursement && disbursement.get('id') === messageData.disbursement_id) {
                                disbursement.load();
                            }

                            showNotificationMessage();
                            reloadNotificationStore = true;
                        }
                    }
                    break;
                case 'new_organization':
                    reloadNotificationStore = false;
                    if (currentUser.get('id') === messageData.user_id) {
                        if (object_record) object_record.load();

                        showNotificationMessage();
                        reloadNotificationStore = true;
                    }
                    break;
                default:
                    reloadNotificationStore = false;
                    if (messageData.user_ids && messageData.user_ids.length > 0) {
                        if (messageData.user_ids.includes(currentUser.get('id'))) {
                            if (object_record && object_record.get('id') === messageData.notifiable_id) {
                                object_record.load();
                            }

                            showNotificationMessage();
                            reloadNotificationStore = true;
                        }
                    }
            }
            if (notificationStore && reloadNotificationStore) notificationStore.load();
        }
    },
});

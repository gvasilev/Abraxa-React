Ext.define('Abraxa.view.operations.VoyagePrincipal.TasksListVoaygePrincipal', {
    extend: 'Abraxa.core.AbraxaFormList',
    xtype: 'TasksListVoaygePrincipal',
    // variableHeights: true,
    cls: 'a-task-list',
    scrollable: true,
    selectable: {
        deselectable: true,
    },
    // infinite: true,
    emptyText:
        '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No tasks available</span></div></div>',
    itemConfig: {
        xtype: 'container',
        // flex: 1,
        width: '100%',
        height: 54,
        cls: 'a-task-row',
        viewModel: {
            formulas: {
                buttonStatus: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        let status = record.get('status'),
                            ui = '',
                            icon = '',
                            tooltip = '';

                        if (status == 'to-do') {
                            icon = 'md-icon-play-arrow';
                            ui = 'default-light';
                            tooltip = 'To-Do';
                        } else if (status == 'in progress') {
                            icon = 'md-icon-timer md-icon-outlined';
                            ui = 'progress';
                            tooltip = 'In Progress';
                        } else {
                            icon = 'md-icon-check';
                            ui = 'completed';
                            tooltip = 'Completed';
                        }

                        return {
                            icon: icon,
                            ui: ui,
                            tooltip: tooltip,
                        };
                    },
                },
                timeAgo: {
                    bind: {
                        bindTo: '{record.updated_at}',
                        deep: true,
                    },
                    get: function (date) {
                        if (!date) return AbraxaConstants.placeholders.emptyValue;
                        return Abraxa.utils.Functions.timeAgo(date);
                    },
                },
                isDone: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        let status = record.get('status');

                        if (status == 'completed') {
                            return true;
                        }

                        return false;
                    },
                },
                completed_by: {
                    bind: {
                        bindTo: '{record.status}',
                        deep: true,
                    },
                    get: function (status) {
                        if (status == 'completed') {
                            let storeUsers = this.get('users');
                            let recordUser = this.get('record').get('updated_by_user');
                            let user_img = recordUser.profile_image
                                ? '<img class="a-badge a-badge-person" style="margin-right: 12px; width: 30px; height: 30px;" src="' +
                                  recordUser.profile_image +
                                  '"/>'
                                : '<i class="md-icon-outlined">person</i>';
                            if (recordUser) {
                                return {
                                    name: recordUser.first_name[0] + '.' + recordUser.last_name,
                                    user: new Abraxa.model.common.User(recordUser),
                                    userImg: user_img,
                                };
                            }
                        }
                    },
                },
                assigned_to: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        let user = record.get('assigned_to'),
                            users = this.get('users'),
                            assigned_to = users.queryBy(function (rec, id) {
                                return rec.get('id') == user;
                            }).items[0],
                            img = AbraxaConstants.placeholders.emptyValue;

                        if (assigned_to) {
                            let abbr = assigned_to.get('first_name')[0] + assigned_to.get('last_name')[0],
                                name = assigned_to.get('first_name')[0] + '.' + assigned_to.get('last_name'),
                                img =
                                    '<div class="hbox"><div class="part_abbr a-badge-abbr" style="margin-right: 8px;"><span class="a-int">' +
                                    abbr +
                                    '</span></div><a href="javascript:void(0)">' +
                                    name +
                                    '</a></div>';
                            if (assigned_to.get('profile_image') && assigned_to.get('profile_image') != '') {
                                img =
                                    '<div class="hbox"><div class="a-person a-icon-round no_show"><img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                    assigned_to.get('profile_image') +
                                    '"></div><a href="javascript:void(0)">' +
                                    name +
                                    '</a></div>';
                            }

                            return img;
                        }
                    },
                },
            },
        },
        layout: {
            type: 'hbox',
            align: 'middle',
        },

        items: [
            {
                xtype: 'button',
                cls: 'a-task-status-button',
                slug: 'task',
                bind: {
                    iconCls: '{buttonStatus.icon} md-icon-outlined',
                    ui: '{buttonStatus.ui} round outlined',
                    permission: '{userPermissions}',
                    disabled: '{object_record.is_archived ? true : false}',
                    tooltip: {
                        anchorToTarget: true,
                        html: '{buttonStatus.tooltip}',
                        align: 'bc-tc?',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        allowOver: false,
                        closeAction: 'destroy',
                    },
                },
                handler: function (button) {
                    button.setDisabled(true);

                    let record = this.upVM().get('record'),
                        status = record.get('status'),
                        mainTasks = Ext.getStore('tasks'),
                        store = this.up('list').getStore();

                    if (status == 'to-do') {
                        record.set('status', 'in progress');
                    } else if (status == 'in progress') {
                        record.set('status', 'completed');
                    } else {
                        record.set('status', 'to-do');
                    }
                    record.save({
                        success: function () {
                            if (mainTasks) {
                                mainTasks.add(record);
                                mainTasks.commitChanges();
                            }
                            Ext.fireEvent('changeTaskVoyagePrincipalStatus');
                            button.setDisabled(false);
                            Ext.toast('Record updated', 1000);
                        },
                    });
                },
            },
            {
                xtype: 'component',
                flex: 1.25,
                cls: 'a-task-name task-name',
                bind: {
                    // html: '{record.name} <span class="a-task-comments">4 <svg viewBox="0 0 24 24"><path d="M4.2,24.1c-0.2,0-0.3,0-0.5-0.1c-0.3-0.2-0.5-0.5-0.5-0.9v-5.2C1.1,16.1,0,13.7,0,11c0-5,4-9,9-9h6c5,0,9,4,9,9 c0,5-4,9-9,9h-4.1l-6.3,3.9C4.5,24,4.3,24.1,4.2,24.1z M9,4c-3.9,0-7,3.1-7,7c0,2.2,1,4.2,2.8,5.6C5,16.8,5.2,17,5.2,17.4v3.9 l5-3.1c0.2-0.1,0.3-0.2,0.5-0.2H15c3.9,0,7-3.1,7-7c0-3.9-3.1-7-7-7H9z"></path></svg></span><span class="a-task-attachments"><svg viewBox="0 0 32 32"><path d="M25.811,4.064c-3.905-3.904-10.235-3.904-14.14,0l-4.24,4.24l1.41,1.41l4.25-4.24c3.043-3.203,8.107-3.333,11.31-0.29s3.333,8.107,0.29,11.31c-0.094,0.099-0.191,0.196-0.29,0.29l-10.61,10.59c-1.986,1.918-5.152,1.863-7.07-0.123c-1.871-1.938-1.871-5.01,0-6.947l10.61-10.59c0.781-0.781,2.049-0.781,2.83,0s0.781,2.049,0,2.83l-7.07,7.07l1.41,1.42l7.07-7.07c1.563-1.563,1.563-4.097,0-5.66s-4.097-1.563-5.66,0l-10.6,10.61c-2.734,2.734-2.734,7.166,0,9.9s7.166,2.734,9.9,0l0,0l10.6-10.61C29.715,14.299,29.715,7.969,25.811,4.064z"></path></svg></span>',
                    html: '{record.name}',
                },
            },
            {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'space-between',
                },
                bind: {
                    hidden: '{!isDone}',
                },
                items: [
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'component',
                                bind: {
                                    html: '<span>{completed_by.userImg}</span>',
                                },
                            },
                            {
                                xtype: 'component',
                                cls: 'a-task-completed-by',
                                bind: {
                                    html: `<a class="completed_by" href="javascript:void(0)"><strong class="no-show">{completed_by.name}</strong></a>`,
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'component',
                        cls: 'text-right',
                        bind: {
                            html: `<span class="sm-title">{timeAgo}</span>`,
                        },
                    },
                ],
            },
        ],
        listeners: {
            click: {
                element: 'element',
                delegate: 'a.completed_by',
                fn: function (el) {
                    let user = this.component.upVM().get('completed_by.user');
                    let tipExist = Ext.getCmp('createdByTool');
                    if (tipExist) {
                        tipExist.destroy();
                    }
                    if (user) {
                        var tooltip_el = Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                            id: 'createdByTool',
                            viewModel: {
                                data: {
                                    user: user.getData(),
                                    clickedElement: el.target,
                                },
                            },
                        }).showBy(el);
                    }
                },
            },
        },
    },
    listeners: {
        childtap: function (cmp, item) {
            if (item.source.target.tagName == 'BUTTON' || item.source.target.classList.contains('no-show')) return;

            // Ext.ComponentQuery.query('internal\\.tasks\\.panel')[0].show(null);
            Ext.getCmp('main-viewport').getVM().set('selectedTask', item.record);
            Ext.ComponentQuery.query('tasks\\.right\\.container')[0].show();
        },
    },
});

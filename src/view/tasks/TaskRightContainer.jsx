import '../../core/components/AbraxaDiv';
import '../../core/components/combo/SubObjects';
import '../common/combo/User';
import '../../core/components/fields/DateTimeField';
import '../comments/CommentsList';

Ext.define('Abraxa.view.tasks.TaskRightContainer', {
    extend: 'Ext.Sheet',
    xtype: 'tasks.right.container',
    testId: 'tasksRightContainer',
    cls: 'a-notification-center a-bgr-white',
    bodyCls: 'a-bgr-white',
    width: 540,
    side: 'right',
    displayed: false,
    hideOnMaskTap: true,
    flex: 1,
    scrollable: 'y',
    header: false,
    collapsible: false,
    weighted: true,
    modal: false,
    controller: 'task-controller',
    hideMode: 'offsets',
    margin: '73 0 0 0',
    toggle: function () {
        if (this.isVisible()) {
            // Ext.query('[class=x-mask]')[0].classList.remove('no-opacity');
            this.hide();
        } else {
            this.show();
            // Ext.query('[class=x-mask]')[0].classList.add('no-opacity');
        }
    },
    showAnimation: {
        type: 'slide',
        direction: 'bottom',
    },
    hideAnimation: {
        type: 'slideOut',
        direction: 'right',
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        formulas: {
            objectRender: {
                bind: {
                    bindTo: '{object_record}',
                    deep: true,
                },
                get: function (record) {
                    if (record && (record.get('model_name') || record.model_name)) {
                        if (record.data) {
                            let object_type = record.get('model_name'),
                                html = '';

                            var str = object_type;
                            var n = str.lastIndexOf('\\');
                            var result = str.substring(n + 1);

                            switch (result) {
                                case 'Portcall':
                                    html =
                                        '<div class="x-chip a-chip-app"><i class="md-icon-outlined">business_center</i><div class="x-text-el">' +
                                        record.getVoyage().get('vessel_name') +
                                        ' <span class="sm-title">(' +
                                        record.get('file_id') +
                                        ')</span></div></div>';
                                    break;

                                case 'Organization':
                                    html =
                                        '<div class="x-chip a-chip-company"><i class="abraxa-icon-cdb"></i><div class="x-text-el">' +
                                        record.get('org_name') +
                                        ' <span class="sm-title">(CDB-' +
                                        record.get('org_id') +
                                        ')</span></div></div>';
                                    break;
                            }
                            return html;
                        } else {
                            let object_type = record.model_name,
                                html = '';

                            var str = object_type;
                            var n = str.lastIndexOf('\\');
                            var result = str.substring(n + 1);

                            switch (result) {
                                case 'Portcall':
                                    html =
                                        '<div class="x-chip a-chip-app"><i class="md-icon-outlined">business_center</i><div class="x-text-el">' +
                                        record.voyage.vessel_name +
                                        ' <span class="sm-title">(' +
                                        record.file_id +
                                        ')</span></div></div>';
                                    break;

                                case 'Organization':
                                    html =
                                        '<div class="x-chip a-chip-company"><i class="abraxa-icon-cdb"></i><div class="x-text-el">' +
                                        record.org_name +
                                        ' <span class="sm-title">(CDB-' +
                                        record.org_id +
                                        ')</span></div></div>';
                                    break;
                            }
                            return html;
                        }
                    }
                },
            },
            comments: {
                bind: {
                    bindTo: '{selectedTask}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = record.comments();
                        store.getProxy().setExtraParams({
                            object_type: 'task',
                            object_meta_id: record.get('id'),
                        });
                        return store;
                    }
                },
            },
            completed_by: {
                bind: {
                    bindTo: '{selectedTask.status}',
                    deep: true,
                },
                get: function (status) {
                    if (status == 'completed') {
                        let storeUsers = this.get('users');
                        let recordUser = this.get('selectedTask').get('updated_by_user');

                        if (recordUser) {
                            return {
                                name: recordUser.first_name[0] + '.' + recordUser.last_name,
                                user: new Abraxa.model.common.User(recordUser),
                            };
                        }
                    }
                },
            },
            created_by: {
                bind: {
                    bindTo: '{selectedTask}',
                    deep: true,
                },
                get: function (task) {
                    if (!task || !task.data) return;

                    let storeUsers = this.get('users');
                    if (!storeUsers || !storeUsers.data) return;

                    let recordUser = storeUsers.getById(task.get('created_by'));
                    if (!recordUser || !recordUser.data) return;

                    let user_img = recordUser.get('profile_image')
                        ? '<img class="a-badge a-badge-person" style="margin-right: 12px; width: 30px; height: 30px;" src="' +
                          recordUser.get('profile_image') +
                          '"/>'
                        : '<i class="md-icon-outlined">person</i>';

                    let createdByObj = {
                        img: '<a class="a-person" href="javascript:void(0)">' + user_img + '</a>',
                        name: recordUser.get('first_name')[0] + '.' + recordUser.get('last_name'),
                        user: recordUser,
                    };

                    return createdByObj;
                },
            },
            selectedSubObject: {
                bind: {
                    bindTo: '{selectedTask}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let taskable_type = record.get('taskable_type'),
                            taskable_id = record.get('taskable_id'),
                            subObjects = this.get('subObjects'),
                            subObject;
                        if (subObjects && subObjects.data) {
                            subObject = Ext.Array.filter(subObjects, function (rec) {
                                return rec.id == taskable_id && rec.model == taskable_type;
                            })[0];
                        }

                        if (subObject) {
                            this.set('relatedObject', true);
                            return subObject.id;
                        }
                    }
                },
            },
            taskLikes: {
                bind: {
                    bindTo: '{selectedTask}',
                    deep: true,
                },
                get: function (record) {
                    if (record) return record.likes();
                },
            },
            taskLikeTooltip: {
                bind: {
                    bindTo: '{selectedTask.likes}',
                    deep: true,
                },
                get: function (likes) {
                    let html = 'Like';
                    if (likes && likes.getCount()) {
                        html = '<strong>Liked by</strong>';
                        let currentUser = this.get('currentUser'),
                            users = this.get('users'),
                            user = likes.queryBy(function (rec, id) {
                                return rec.get('created_by') == currentUser.get('id');
                            }).items[0],
                            others = likes.queryBy(function (rec, id) {
                                return rec.get('created_by') != currentUser.get('id');
                            }).items;

                        if (user) {
                            html += '<br>You';
                        }
                        if (others) {
                            Ext.each(others, function (u) {
                                let usr = users.queryBy(function (rec, id) {
                                    return rec.get('id') == u.get('created_by');
                                }).items[0];
                                if (usr) {
                                    html += '<br>' + usr.get('first_name')[0] + '.' + usr.get('last_name');
                                }
                            });
                        }
                    }
                    return html;
                },
            },
            updatedAtDateFormated: {
                bind: {
                    bindTo: '{selectedTask.updated_at}',
                    deep: true,
                },
                get: function (updatedAt) {
                    if (updatedAt) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(updatedAt, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    } else {
                        return '';
                    }
                },
            },
            createdAtDateFormated: {
                bind: {
                    bindTo: '{selectedTask.created_at}',
                    deep: true,
                },
                get: function (createdAt) {
                    if (createdAt) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(createdAt, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    } else {
                        return '';
                    }
                },
            },
            currentStore: {
                bind: {
                    bindTo: '{selectedTask}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.store;
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 64,
            items: [
                // {
                //     xtype: 'title',
                //     bind: {
                //         title: "<div class='hbox'><div class='a-badge a-badge-notes'><i class='md-icon-outlined md-icon-task-alt'></i></div><div><span class='a-panel-title text-truncate' style='width: 260px;'>{selectedTask.name}</span><span class='sm-title'>#TSK-{selectedTask.id}</span></div></div>"
                //     },
                // },
                {
                    xtype: 'button',
                    ui: 'status status-md default',
                    slug: 'task',
                    testId: 'tasksRightContainerTasksMenu',
                    bind: {
                        permission: '{userPermissions}',
                        text: '{selectedTask.status}',
                        cls: 'status-{selectedTask.status}',
                        disabled: '{object_record.is_archived ? true : false}',
                    },
                    menu: {
                        items: [
                            {
                                text: 'To-Do',
                                status: 'to-do',
                                handler: function (me) {
                                    let record = this.upVM().get('selectedTask'),
                                        mainTasks = Ext.getStore('tasks'),
                                        button = me.up('button');
                                    if (button.getText() != this.getText()) {
                                        mixpanel.track('Select changed', {
                                            Type: 'Select',
                                            Target: 'Status select',
                                            Tag: 'Secondary event',
                                        });

                                        record.set('status', this.status);
                                        if (record && record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.fireEvent('changeTaskVoyagePrincipalStatus');
                                                    // if (mainTasks) {
                                                    //     mainTasks.add(record);
                                                    //     mainTasks.commitChanges();
                                                    // }
                                                    mixpanel.track('Record edited', {
                                                        Type: 'Task',
                                                        Target: 'Right panel',
                                                        Tag: 'Primary event',
                                                    });
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    }
                                },
                            },
                            {
                                text: 'In Progress',
                                status: 'in progress',
                                handler: function (me) {
                                    let record = this.upVM().get('selectedTask'),
                                        mainTasks = Ext.getStore('tasks'),
                                        button = me.up('button');
                                    if (button.getText() != this.getText()) {
                                        mixpanel.track('Select changed', {
                                            Type: 'Select',
                                            Target: 'Status select',
                                            Tag: 'Secondary event',
                                        });

                                        record.set('status', this.status);
                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.fireEvent('changeTaskVoyagePrincipalStatus');

                                                    // if (mainTasks) {
                                                    //     mainTasks.add(record);
                                                    //     mainTasks.commitChanges();
                                                    // }
                                                    mixpanel.track('Record edited', {
                                                        Type: 'Task',
                                                        Target: 'Right panel',
                                                        Tag: 'Primary event',
                                                    });
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    }
                                },
                            },
                            {
                                text: 'Completed',
                                status: 'completed',
                                handler: function (me) {
                                    let record = this.upVM().get('selectedTask'),
                                        mainTasks = Ext.getStore('tasks'),
                                        button = me.up('button');
                                    if (button.getText() != this.getText()) {
                                        mixpanel.track('Select changed', {
                                            Type: 'Select',
                                            Target: 'Status select',
                                            Tag: 'Secondary event',
                                        });

                                        record.set('status', this.status);
                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.fireEvent('changeTaskVoyagePrincipalStatus');

                                                    // if (mainTasks) {
                                                    //     mainTasks.add(record);
                                                    //     mainTasks.commitChanges();
                                                    // }
                                                    mixpanel.track('Record edited', {
                                                        Type: 'Task',
                                                        Target: 'Right panel',
                                                        Tag: 'Primary event',
                                                    });
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    }
                                },
                            },
                        ],
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-thumb-up md-icon-outlined',
                            ui: 'default round small',
                            iconAlign: 'right',
                            cls: 'like_button',
                            hidden: false,
                            hideMode: 'opacity',
                            slug: 'task',
                            testId: 'tasksRightContainerTasksSmallBtn',
                            bind: {
                                permission: '{userPermissions}',
                                text: '{taskLikes.count ? taskLikes.count : null}',
                                ui: '{taskLikes.count ? "normal round small" : "default round small"}',
                                // hidden: '{likes.count || hovered ? false : true}',
                                iconCls: 'md-icon-thumb-up {taskLikes.count ? "" : "md-icon-outlined"}',
                                tooltip: {
                                    html: '{taskLikeTooltip}',
                                    showOnTap: true,
                                    align: 'bc-tc?',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                },
                            },
                            handler: function (btn) {
                                let likes = btn.upVM().get('taskLikes'),
                                    vm = btn.upVM(),
                                    record = btn.upVM().get('selectedTask'),
                                    currentUser = btn.upVM().get('currentUser'),
                                    like = likes.queryBy(function (rec, id) {
                                        return rec.get('created_by') == currentUser.get('id');
                                    }).items[0];

                                mixpanel.track('Button clicked', {
                                    Type: 'Button',
                                    Target: 'Like task button',
                                    Tag: 'Secondary event',
                                });

                                if (like) {
                                    likes.remove(like);
                                    likes.sync();
                                    mixpanel.track('Record unliked', {
                                        Type: 'Task',
                                        Target: 'Right panel',
                                        Tag: 'Primary event',
                                    });
                                } else {
                                    likes.add({
                                        object_id: vm.get('object_id'),
                                        object_meta_id: vm.get('object_meta_id'),
                                        likable_type: record.get('model_name'),
                                        likable_id: record.get('id'),
                                    });
                                    likes.sync();
                                    mixpanel.track('Record liked', {
                                        Type: 'Task',
                                        Target: 'Right panel',
                                        Tag: 'Primary event',
                                    });
                                }
                            },
                        },
                        {
                            xtype: 'filebutton',
                            height: 34,
                            ui: 'round tool-sm',
                            text: '',
                            accept: '.pdf,.doc,.docs,.xls,.xlsx,.txt,.zip,.jpeg,.pjpeg,.jpeg,.pjpeg,.png,.gif',
                            iconCls: 'md-icon-attach-file',
                            slug: 'task',
                            testId: 'tasksRightContainerAttachFileBtn',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{object_record.is_archived ? true : false}',
                            },
                            tooltip: {
                                showOnTap: true,
                                html: 'Attach file',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            listeners: {
                                change: function (me, newValue) {
                                    if (newValue) {
                                        mixpanel.track('Button clicked', {
                                            Type: 'Button',
                                            Target: 'Attach file button',
                                            Tag: 'Secondary event',
                                        });

                                        var files = this.getFiles(),
                                            len = files.length,
                                            ext,
                                            record = me.upVM().get('selectedTask'),
                                            fileStore = record.attachments(),
                                            controller = me.up('tasks\\.right\\.container').getController(),
                                            totalSize = 0;

                                        for (var i = 0; i < len; i++) {
                                            totalSize += files.item(i).size;
                                            ext = files.item(i).name.split('.').pop();
                                            let record = {
                                                document: {
                                                    extension: ext,
                                                    original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
                                                    file: files.item(i),
                                                    size: files.item(i).size,
                                                },
                                            };
                                            fileStore.add(record);
                                        }
                                        fileStore.needsSync = false;
                                        if (totalSize > 10 * 1024 * 1024) {
                                            Ext.create('Ext.MessageBox', {
                                                ui: 'warning',
                                                title: 'Upload Cancelled',
                                                innerCls: 'a-bgr-white',
                                                message:
                                                    'Your file(s) payload size (' +
                                                    (totalSize / 1024 / 1024).toFixed(2) +
                                                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                                                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />',
                                                width: 500,
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
                                            document.querySelector("input[type='file']").value = '';
                                            me.setValue(null);
                                            return;
                                        }
                                        controller.upload(fileStore, record).then(function (result) {
                                            if (result) {
                                                Ext.toast('File uploaded', 1000);
                                                record.load({
                                                    success: function () {
                                                        let mainTasks = Ext.getStore('tasks');
                                                        mixpanel.track('Record created', {
                                                            Type: 'Attachment',
                                                            Target: 'Right panel',
                                                            Tag: 'Primary event',
                                                        });
                                                        // if (mainTasks) {
                                                        //     mainTasks.add(record);
                                                        //     mainTasks.commitChanges();
                                                        // }
                                                    },
                                                });
                                            } else {
                                                fileStore.remove(fileStore.last());
                                                Ext.Msg.warning(
                                                    'Unsupported file format',
                                                    'The file format you are trying to upload is not supported'
                                                );
                                            }
                                        });
                                        controller.clearFileUpload(me.element.id);
                                    }
                                    document.querySelector("input[type='file']").value = '';
                                    me.setValue(null);
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'taskDelete',
                            testId: 'tasksRightContainerTaskDeleteBtn',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{object_record.is_archived ? true : false}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (item, el, eOpts) {
                                mixpanel.track('Button clicked', {
                                    Type: 'Button',
                                    Target: 'Delete task button',
                                    Tag: 'Secondary event',
                                });

                                let vm = this.upVM(),
                                    store = vm.get('tasks') || vm.get('currentStore'),
                                    container = this.up('tasks\\.right\\.container'),
                                    record = vm.get('selectedTask');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you want to delete this task?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            vm.set('selectedTask', null);
                                            let mainTasks = Ext.getStore('tasks');
                                            store.remove(record);
                                            Ext.Ajax.request({
                                                url: Env.ApiEndpoint + 'task/' + record.get('id'),
                                                method: 'DELETE',
                                                success: function (response) {
                                                    Ext.fireEvent('addDeleteTaskEvent');
                                                    mixpanel.track('Record deleted', {
                                                        Type: 'Task',
                                                        Target: 'Right panel',
                                                        Tag: 'Primary event',
                                                    });

                                                    Ext.toast('Record deleted');
                                                },
                                            });

                                            //Doesn't work if task is created now, nothing to sync with BE!!!
                                            // store.sync({
                                            //     success: function (rec, operation) {
                                            //         Ext.fireEvent('changeTaskVoyagePrincipalStatus', record, 'delete');
                                            //         // if (mainTasks) {
                                            //         //     mainTasks.remove(record);
                                            //         //     mainTasks.commitChanges();
                                            //         // }
                                            //         mixpanel.track('Record deleted', {
                                            //             Type: 'Task',
                                            //             Target: 'Right panel',
                                            //             Tag: 'Primary event',
                                            //         });

                                            //         Ext.toast('Record deleted');
                                            //     },
                                            // });
                                        }
                                    },
                                    this,
                                    [
                                        {
                                            xtype: 'button',
                                            itemId: 'no',
                                            margin: '0 8 0 0',
                                            testId: 'tasksRightContainerTaskDeleteConfirmCancelBtn',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'yes',
                                            ui: 'decline alt',
                                            text: 'Delete',
                                            testId: 'tasksRightContainerTaskDeleteConfirmDeleteBtn',
                                            separator: true,
                                        },
                                    ]
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'tasksRightContainerCloseEscBtn',
                            handler: function (me) {
                                let list = Ext.ComponentQuery.query('[cls~=a-task-list]')[0],
                                    grid = Ext.ComponentQuery.query('tasks\\.grid')[0];

                                if (list) list.deselectAll();

                                if (grid) grid.deselectAll();

                                this.upVM().set('selectedTask', null);
                                me.up('[xtype=tasks\\.right\\.container]').hide();

                                mixpanel.track('Button clicked', {
                                    Type: 'Button',
                                    Target: 'Close right panel button',
                                    Tag: 'Secondary event',
                                });

                                mixpanel.track('Right panel closed', {
                                    Type: 'Right panel',
                                    Target: 'Task right panel',
                                    Tag: 'Primary event',
                                });
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-portcall-info',
            layout: 'vbox',
            flex: 1,
            scrollable: 'y',
            items: [
                {
                    xtype: 'formpanel',
                    testId: 'tasksRightContainerForm',
                    padding: '16 24',
                    cls: 'task_form',
                    items: [
                        {
                            xtype: 'textareafield',
                            label: false,
                            clearable: false,
                            placeholder: 'Task name',
                            testId: 'tasksRightContainerFormTaskNameField',
                            ui: 'field-xl no-border classic',
                            required: true,
                            slug: 'task',
                            bind: {
                                value: '{selectedTask.name}',
                                disabled:
                                    '{selectedTask.status == "completed" || object_record.is_archived ? true : false}',
                                permission: '{userPermissions}',
                            },
                            listeners: {
                                painted: function () {
                                    this.focus();
                                },
                                change: function () {
                                    if (this.initialConfig.height) return;
                                    if (!this.inputElement.dom.style.overflow)
                                        this.inputElement.dom.style.overflow = 'hidden';
                                    this.setHeight(1);
                                    var reqHeight = this.inputElement.dom.scrollHeight;
                                    this.setHeight(reqHeight + 2);
                                    return;
                                },
                                blur: function () {
                                    let record = this.upVM().get('selectedTask'),
                                        mainTasks = Ext.getStore('tasks');

                                    if (record && record.dirty) {
                                        record.save({
                                            success: function () {
                                                // if (mainTasks) {
                                                //     mainTasks.add(record);
                                                //     mainTasks.commitChanges();
                                                // }
                                                mixpanel.track('Record edited', {
                                                    Type: 'Task',
                                                    Target: 'Right panel',
                                                    Tag: 'Primary event',
                                                });
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            margin: '8 0',
                            cls: 'a-general-form',
                            defaults: {
                                clearable: false,
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                                listeners: {
                                    blur: function (me) {},
                                },
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    height: 42,
                                    style: 'margin-top: 4px; padding-bottom: 4px;',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'start',
                                    },
                                    hidden: true,
                                    bind: {
                                        hidden: '{selectedTask.ownerable_id && object_record ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            cls: 'c-blue-grey fs-13 mr-16',
                                            width: 140,
                                            html: 'Record',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-note-subheader',
                                            bind: {
                                                html: '{objectRender}',
                                            },
                                            // listeners: {
                                            //     click: {
                                            //         element: 'element',
                                            //         fn: function () {
                                            //             let object_record = this.component.upVM().get('object_record');

                                            //             window.location.hash = '#portcall/' + object_record.id;
                                            //         }
                                            //     }
                                            // }
                                        },
                                    ],
                                },
                                {
                                    xtype: 'subobjects.combo',
                                    margin: '0 0 4 0',
                                    hidden: true,
                                    placeholder: 'Choose record',
                                    clearable: true,
                                    forceSelection: true,
                                    slug: 'task',
                                    bind: {
                                        disabled: '{relatedObject ? true : false}',
                                        readOnly: '{object_record.is_archived ? true : false}',
                                        value: '{selectedSubObject}',
                                        hidden: '{routeHash == "#taskmanager" || "#operations" ? true : false}',
                                        permission: '{userPermissions}',
                                        store: {
                                            data: '{subObjects}',
                                        },
                                    },
                                    label: 'Related to',
                                    testId: 'tasksRightContainerFormRelatedToCombo',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    // cls: 'a-subobject-combo',
                                    listeners: {
                                        change: function (me, newValue, oldValue, eOpts) {
                                            if (!newValue) {
                                                let record = this.upVM().get('selectedTask');

                                                if (record) {
                                                    record.set('taskable_type', null);
                                                    record.set('taskable_id', null);
                                                    record.set('sub_object_name', null);
                                                }
                                            }
                                        },
                                        select: function (cmp, value) {
                                            let record = this.upVM().get('selectedTask');

                                            if (record) {
                                                record.set('taskable_type', value.get('model'));
                                                record.set('taskable_id', value.get('id'));
                                                record.set('sub_object_name', value.get('name'));
                                            }
                                        },
                                        blur: function () {
                                            let record = this.upVM().get('selectedTask');

                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        let mainTasks = Ext.getStore('tasks');
                                                        // if (mainTasks) {
                                                        //     mainTasks.add(record);
                                                        //     mainTasks.commitChanges();
                                                        // }
                                                        mixpanel.track('Record edited', {
                                                            Type: 'Task',
                                                            Target: 'Right panel',
                                                            Tag: 'Primary event',
                                                        });
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'user.combo',
                                    flex: 1,
                                    editable: false,
                                    placeholder: 'Choose assignee',
                                    label: 'Assigned to',
                                    testId: 'tasksRightContainerFormAssignedToCombo',
                                    ui: 'classic hovered-border non-editable',
                                    cls: 'a-field-icon icon-person icon-rounded',
                                    slug: 'task',
                                    clearable: true,
                                    bind: {
                                        value: '{selectedTask.assigned_to}',
                                        disabled: '{selectedTask.status == "completed" ? true : false}',
                                        readOnly: '{object_record.is_archived ? true : false}',
                                        // readOnly: '{object_record.is_archived ? true : false}',
                                        permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        select: function (me, selection) {
                                            let record = this.upVM().get('selectedTask');

                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        let mainTasks = Ext.getStore('tasks');
                                                        // if (mainTasks) {
                                                        //     mainTasks.add(record);
                                                        //     mainTasks.commitChanges();
                                                        // }
                                                        mixpanel.track('Record edited', {
                                                            Type: 'Task',
                                                            Target: 'Right panel',
                                                            Tag: 'Primary event',
                                                        });
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                        clearIconTap: function (me) {
                                            let record = this.upVM().get('selectedTask');

                                            record.set('assigned_to', null);

                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        let mainTasks = Ext.getStore('tasks');
                                                        // if (mainTasks) {
                                                        //     mainTasks.add(record);
                                                        //     mainTasks.commitChanges();
                                                        // }
                                                        mixpanel.track('Record edited', {
                                                            Type: 'Task',
                                                            Target: 'Right panel',
                                                            Tag: 'Primary event',
                                                        });
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Priority',
                                    placeholder: 'Choose priority',
                                    testId: 'tasksRightContainerFormPriorityCombo',
                                    displayField: 'name',
                                    valueField: 'value',
                                    cls: 'a-field-icon icon-flag icon-rounded non-editable',
                                    options: [
                                        {
                                            name: 'Normal',
                                            value: 'normal',
                                        },
                                        {
                                            name: 'High',
                                            value: 'high',
                                        },
                                    ],
                                    slug: 'task',
                                    bind: {
                                        value: '{selectedTask.priority}',
                                        disabled: '{selectedTask.status == "completed" ? true : false}',
                                        readOnly: '{object_record.is_archived ? true : false}',
                                        permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        select: function (me, selection) {
                                            let record = this.upVM().get('selectedTask');

                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        let mainTasks = Ext.getStore('tasks');
                                                        // if (mainTasks) {
                                                        //     mainTasks.add(record);
                                                        //     mainTasks.commitChanges();
                                                        // }
                                                        mixpanel.track('Record edited', {
                                                            Type: 'Task',
                                                            Target: 'Right panel',
                                                            Tag: 'Primary event',
                                                        });
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'abraxa.datetimefield',
                                    label: 'Due date',
                                    testId: 'tasksRightContainerFormDueDateCombo',
                                    cls: 'a-field-icon icon-calendar icon-rounded',
                                    slug: 'task',
                                    bind: {
                                        disabled: '{selectedTask.status == "completed" ? true : false}',
                                        readOnly: '{object_record.is_archived ? true : false}',
                                        dateTime: '{selectedTask.due_date}',
                                        permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        focusleave: function () {
                                            let record = this.upVM().get('selectedTask');

                                            if (record.dirty) {
                                                record.save({
                                                    success: function () {
                                                        let mainTasks = Ext.getStore('tasks');
                                                        // if (mainTasks) {
                                                        //     mainTasks.add(record);
                                                        //     mainTasks.commitChanges();
                                                        // }
                                                        mixpanel.track('Record edited', {
                                                            Type: 'Task',
                                                            Target: 'Right panel',
                                                            Tag: 'Primary event',
                                                        });
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-history a-task-history',
                    padding: 24,
                    // bind: {
                    //     hidden: '{selectedTask.overdue ? false : true}',
                    // },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-list-item a-created',
                            bind: {
                                html: '{created_by.img}<a class="created_by" href="javascript:void(0)"><strong>{created_by.name}</strong></a>&nbsp;created this task.<span class="sm-title">{createdAtDateFormated}</span>',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-list-item a-overdue',
                            hidden: true,
                            bind: {
                                hidden: '{selectedTask.overdue ? false : true}',
                                html: '<div class="a-icon-overdue mr-12"><i class="md-icon-outlined">timer_off</i></div>Task overdue.<span class="sm-title">{selectedTask.due_date:date("d M - H:i")}</span>',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-list-item a-completed',
                            hidden: true,
                            bind: {
                                hidden: '{selectedTask.status == "completed" ? false : true}',
                                html: '<div class="a-icon-completed mr-12"><i class="material-icons">check</i></div><a class="completed_by" href="javascript:void(0)"><strong>{completed_by.name}</strong></a>&nbsp;completed this task.<span class="sm-title">{updatedAtDateFormated}</span>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra',
                    hidden: true,
                    bind: {
                        hidden: '{selectedTask.attachments.count > 0 ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Attachments',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-attachments-list',
                            testId: 'tasksRightContainerAttachmentsList',
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            itemConfig: {
                                cls: 'a-attachment-item',
                                minWidth: 0,
                                viewModel: true,
                                layout: {
                                    type: 'hbox',
                                    pack: 'space-between',
                                },
                                slug: 'task',
                                bind: {
                                    permission: '{userPermissions}',
                                    tpl: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.document.name}.{record.document.extension}</a><span class="sm-title">{record.document.size}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: 'div.a-attachment,i.remove_attachment',
                                        fn: function (cmp, a) {
                                            mixpanel.track('Button clicked', {
                                                Type: 'Button',
                                                Target: 'Delete attachemnt button',
                                                Tag: 'Secondary event',
                                            });

                                            let ids = [],
                                                controller = this.component
                                                    .up('tasks\\.right\\.container')
                                                    .getController(),
                                                record = this.component.upVM().get('record'),
                                                recordId = record.getData().id,
                                                documents = [];

                                            var store = this.component.upVM().get('selectedTask.attachments');

                                            store.each(function (attachment) {
                                                documents.push(attachment.getDocument());
                                            });

                                            if (cmp.currentTarget.className == 'a-attachment') {
                                                var document = record.getDocument();
                                                if (document) {
                                                    Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .previewFile(this.component, document, documents, record);
                                                }
                                            }
                                            if (cmp.currentTarget.className.indexOf('remove_attachment') !== -1) {
                                                ids.push(recordId);
                                                store.remove(record);
                                                controller.deleteFiles(ids, record);

                                                mixpanel.track('Record attachment deleted', {
                                                    Type: 'Task',
                                                    Target: 'Right panel',
                                                    Tag: 'Primary event',
                                                });

                                                Ext.toast('Record updated', 1000);
                                            }
                                        },
                                    },
                                },
                            },

                            bind: {
                                store: '{selectedTask.attachments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-public-comments',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Comments',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            minHeight: 120,
                            testId: 'tasksRightContainerCommentsList',
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    docked: 'bottom',
                    testId: 'tasksRightContainerCommentsInput',
                    bind: {
                        hidden: '{object_record.is_archived ? true : false}',
                        viewModel: {
                            data: {
                                comments: '{comments}',
                                record: '{selectedTask}',
                            },
                        },
                    },
                },
            ],
        },
    ],
});

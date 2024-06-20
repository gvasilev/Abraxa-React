import '../../../../core/components/Abraxa.EmailField';
import '../../../tasks/AddTaskPopup';
import './ContactEditMenu';

Ext.define('Abraxa.view.cdb.company.contacts.ContactsRightCard', {
    extend: 'Ext.Container',
    xtype: 'contacts.right.card',
    testId: 'contactsRightCard',
    itemId: 'contactsRightCard',
    cls: 'a-right-container',
    hidden: true,
    bind: {
        hidden: '{contactsGrid.selection && !contactsGrid.selection.is_checked ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        stores: {
            comments: {
                source: '{notes}',
                filters: '{noteFilter}',
            },
            objectTasks: {
                source: '{tasks}',
                filters: '{taskFilter}',
            },
        },
        formulas: {
            noteFilter: {
                bind: {
                    bindTo: '{contactsGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('comments');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('noteable_type') == record.get('model_name') &&
                                rec.get('noteable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            taskFilter: {
                bind: {
                    bindTo: '{contactsGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('objectTasks');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('taskable_type') == record.get('model_name') &&
                                rec.get('taskable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<div class="a-badge a-badge-person"><i class="md-icon-outlined md-icon-person"></i></div><div><span class="a-panel-title">{contactsGrid.selection.contact_first_name} {contactsGrid.selection.contact_last_name}</span><span class="a-panel-id">#CN-{contactsGrid.selection.contact_id}</span></div>',
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
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-outlined md-icon-task-alt',
                            slug: 'task',
                            testId: 'contactsRightCardAddTaskBtn',
                            permissionCreate: true,
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add task',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                let button = this;

                                // Check if a note is already opened
                                if (button.taskOpened) {
                                    return;
                                }

                                button.taskOpened = true;

                                let record = this.upVM().get('contactsGrid.selection'),
                                    subObjects = this.upVM().get('subObjects'),
                                    subObject = Ext.Array.filter(subObjects, function (rec) {
                                        return rec.id == record.get('id') && rec.model == record.get('model_name');
                                    })[0];

                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            subObjects: this.upVM().get('subObjects'),
                                            selectedSubObject: subObject.id,
                                            relatedObject: true,
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            editMode: false,
                                            taskEdit: false,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: 2,
                                                object_meta_id: this.upVM().get('object_record').get('id'),
                                                taskable_type: this.upVM()
                                                    .get('contactsGrid.selection')
                                                    .get('model_name'),
                                                taskable_id: this.upVM().get('contactsGrid.selection').get('id'),
                                                priority: 'normal',
                                            }),
                                        },
                                    },
                                    // Add listeners to reset the flag when the task is closed
                                    listeners: {
                                        destroy: () => {
                                            button.taskOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                // Show the task
                                task.show();
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'cdbContactDelete',
                            testId: 'contactsRightCardDeleteBtn',
                            bind: {
                                permission: '{userPermissions}',
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
                            handler: function (me) {
                                let container = this.find('contactsRightCard'),
                                    companyRecord = me.upVM().get('object_record'),
                                    record = me.upVM().get('contactsGrid.selection');
                                store = companyRecord.contacts();

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function () {
                                                    me.upVM().get('organizations').reload();
                                                    Ext.toast('Record deleted', 1000);
                                                },
                                            });
                                        }
                                    },
                                    this,
                                    [
                                        {
                                            xtype: 'button',
                                            itemId: 'no',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'yes',
                                            text: 'Delete',
                                            ui: 'decline alt',
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
                            testId: 'contactsRightCardExpandCloseBtn',
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
                            handler: function (me) {
                                me.up('[xtype=contacts\\.right\\.card]').hide();
                                let companyContactsGrid = Ext.ComponentQuery.query('[cls~=contact_grid]')[0];
                                if (companyContactsGrid) companyContactsGrid.deselectAll();
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-general-form',
            flex: 1,
            scrollable: 'y',
            items: [
                {
                    xtype: 'formpanel',
                    itemId: 'mainContactForm',
                    testId: 'contactsRightCardMainContactForm',
                    defaults: {
                        labelAlign: 'left',
                        clearable: false,
                        ui: 'classic hovered-border',
                        slug: 'cdbContacts',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        listeners: {
                            blur: function (me) {
                                let record = me.upVM().get('contactsGrid.selection'),
                                    object_record = me.upVM().get('object_record'),
                                    currentUser = me.upVM().get('currentUser');
                                if (record.dirty) {
                                    record.save({
                                        success: function () {
                                            object_record.set('updated_by_user', currentUser.getData());
                                            object_record.set('updated_at', new Date());
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
                                }
                            },
                        },
                    },

                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    ui: 'field-xl no-border classic',
                                    label: false,
                                    required: true,
                                    clearable: false,
                                    bind: {
                                        value: '{contactsGrid.selection.contact_first_name}',
                                    },
                                    placeholder: 'First name',
                                    testId: 'contactsRightCardFirstNameField',
                                    listeners: {
                                        painted: function (me) {
                                            me.focus();
                                        },
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    ui: 'field-xl no-border classic',
                                    label: false,
                                    required: true,
                                    clearable: false,
                                    placeholder: 'Last name',
                                    testId: 'contactsRightCardLastNameField',
                                    bind: {
                                        value: '{contactsGrid.selection.contact_last_name}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.emailfield',
                            cls: 'a-field-icon icon-email icon-rounded',
                            label: 'Email',
                            vtype: 'email',
                            placeholder: 'Enter email address',
                            testId: 'contactsRightCardEmailField',
                            required: true,
                            bind: {
                                value: '{contactsGrid.selection.contact_email}',
                            },
                        },
                        {
                            xtype: 'abraxa.phonefield',
                            cls: 'a-field-icon icon-phone icon-rounded',
                            label: 'Phone',
                            testId: 'contactsRightCardPhoneField',
                            bind: {
                                value: '{contactsGrid.selection.contact_phone}',
                            },
                        },
                        {
                            xtype: 'abraxa.phonefield',
                            cls: 'a-field-icon icon-phone icon-rounded',
                            label: 'Mobile',
                            testid: 'contactsRightCardMobileField',
                            bind: {
                                value: '{contactsGrid.selection.contact_mobile}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            cls: 'a-field-icon icon-public icon-rounded',
                            label: 'Skype',
                            testId: 'contactsRightCardSkypeField',
                            placeholder: 'Skype name',
                            bind: {
                                value: '{contactsGrid.selection.contact_skype}',
                            },
                        },
                        {
                            xtype: 'organization.combo',
                            cls: 'a-field-icon icon-business-center icon-rounded',
                            label: 'Company',
                            testId: 'contactsRightCardCompanyField',
                            required: true,
                            floatedPicker: {
                                minWidth: 330,
                            },
                            bind: {
                                value: '{contactsGrid.selection.contact_org_id}',
                                inputValue: '{object_record.org_name}',
                                hidden: '{createFromTabs === true || isGlobal === true  ? true:false}',
                            },
                            reference: 'company_combo',
                            placeholder: 'Choose company',
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    if (!oldValue) return;
                                    // this.find('dept-combo').clearValue();
                                },
                            },
                        },
                        {
                            xtype: 'textfield',
                            cls: 'a-field-icon icon-short icon-rounded',
                            label: 'Position',
                            testId: 'contactsRightCardPositionField',
                            placeholder: 'Choose position',
                            bind: {
                                value: '{contactsGrid.selection.contact_position}',
                            },
                        },
                        {
                            xtype: 'combobox',
                            cls: 'a-field-icon icon-corporate-fare icon-rounded',
                            label: 'Department',
                            queryMode: 'local',
                            valueField: 'dept_id',
                            displayField: 'dept_name',
                            placeholder: 'Choose department',
                            testId: 'contactsRightCardDepartmentField',
                            itemId: 'dept-combo',
                            slug: 'cdbDepartments',
                            editable: false,
                            clearable: true,
                            bind: {
                                value: '{contactsGrid.selection.contact_org_department}',
                                store: '{departments}',
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset',
                    html: '',
                },
                {
                    xtype: 'container',
                    margin: '8 12',
                    minHeight: 128,
                    items: [
                        {
                            xtype: 'textareafield',
                            ui: 'classic no-border',
                            cls: 'a-field-icon icon-short',
                            label: false,
                            labelAlign: 'top',
                            slug: 'cdbContacts',
                            bind: {
                                value: '{contactsGrid.selection.contact_description}',
                                permission: '{userPermissions}',
                            },
                            placeholder: 'Short description',
                            testId: 'contactsRightCardDescriptionField',
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('contactsGrid.selection'),
                                        object_record = me.upVM().get('object_record'),
                                        currentUser = me.upVM().get('currentUser');
                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                object_record.set('updated_by_user', currentUser.getData());
                                                object_record.set('updated_at', new Date());
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-tasks',
                    hidden: true,
                    slug: 'task',
                    bind: {
                        hidden: '{objectTasks.count ? false : true}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            testId: 'contactsRightCardTasksList',
                            minHeight: 120,
                            bind: {
                                store: '{objectTasks}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-comments',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            testId: 'contactsRightCardCommentsList',
                            minHeight: 120,
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    testId: 'contactsRightCardCommentsInput',
                    docked: 'bottom',
                    bind: {
                        hidden: '{object_record.is_archived ? true : false}',
                        viewModel: {
                            data: {
                                comments: '{comments}',
                                record: '{contactsGrid.selection}',
                            },
                        },
                    },
                },
            ],
        },
    ],
});

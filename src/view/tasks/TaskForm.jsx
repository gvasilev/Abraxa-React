import '../../core/components/combo/Objects';
import '../../core/components/combo/Portcall';

Ext.define('Abraxa.view.tasks.TaskForm', {
    extend: 'Ext.Container',
    xtype: 'tasks.form',
    testId: 'tasksForm',
    cls: 'a-form-create-task',
    items: [
        {
            xtype: 'formpanel',
            margin: 0,
            padding: 0,
            cls: 'task_form',
            items: [
                {
                    xtype: 'textareafield',
                    minHeight: 32,
                    ui: 'field-xl no-border classic',
                    label: false,
                    clearable: false,
                    placeholder: 'Task name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    testId: 'tasksFormTaskNameField',
                    bind: {
                        value: '{record.name}',
                    },
                    listeners: {
                        painted: function () {
                            this.focus();
                        },
                        change: function () {
                            if (this.initialConfig.height) return;
                            if (!this.inputElement.dom.style.overflow) this.inputElement.dom.style.overflow = 'hidden';
                            this.setHeight(1);
                            var reqHeight = this.inputElement.dom.scrollHeight;
                            this.setHeight(reqHeight + 2);
                            return;
                        },
                    },
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'start',
                    },
                    bind: {
                        hidden: '{noShowPortcall}',
                    },
                    margin: '8 0',
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
                                hidden: '{object_record ? false : true}',
                            },
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            bind: {
                                hidden: '{object_record ? true : false}',
                            },

                            items: [
                                {
                                    xtype: 'objects.combo',
                                    hidden: true,
                                    ui: 'classic hovered-border',
                                    placeholder: 'Category',
                                    testId: 'tasksFormCategoryCombo',
                                    width: 52,
                                    matchFieldWidth: false,
                                },
                                {
                                    xtype: 'portcall.combo',
                                    // label: 'Record',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                    flex: 1,
                                    reference: 'portcallCombo',
                                    testId: 'tasksFormPortcallCombo',
                                    listeners: {
                                        select: function (cmp, value) {
                                            let record = this.upVM().get('record');

                                            record.set('taskable_type', value.get('model_name'));
                                            record.set('taskable_id', value.get('id'));
                                            record.set('ownerable_type', value.get('model_name'));
                                            record.set('ownerable_id', value.get('id'));
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'subobjects.combo',
                    margin: '0 0 4 0',
                    hidden: false,
                    placeholder: 'Choose record',
                    clearable: true,
                    forceSelection: true,
                    // hidden: true,
                    bind: {
                        hidden: '{noSubObjects ? true : false}',
                        disabled: '{relatedObject ? true : false}',
                        value: '{selectedSubObject}',
                        store: {
                            data: '{subObjects}',
                        },
                    },
                    label: 'Related to',
                    testId: 'tasksFormRelatedToCombo',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    // cls: 'a-subobject-combo',
                    listeners: {
                        painted: function () {
                            if (this.getStore() && this.upVM().get('selectedSubObject')) {
                                this.setValue(this.upVM().get('selectedSubObject'));
                            }
                        },
                        change: function (me, newValue, oldValue, eOpts) {
                            if (!newValue) {
                                let record = this.upVM().get('record');

                                if (record) {
                                    record.set('taskable_type', null);
                                    record.set('taskable_id', null);
                                    record.set('sub_object_name', null);
                                }
                            }
                        },
                        select: function (cmp, value) {
                            let record = this.upVM().get('record');

                            record.set('taskable_type', value.get('model'));
                            record.set('taskable_id', value.get('id'));
                            record.set('sub_object_name', value.get('name'));
                        },
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-general-form',
                    margin: '0 0 8 0',
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
                            xtype: 'user.combo',
                            flex: 1,
                            editable: false,
                            placeholder: 'Choose assignee',
                            label: 'Assigned to',
                            testId: 'tasksFormAssignedToCombo',
                            clearable: true,
                            ui: 'classic hovered-border non-editable',
                            cls: 'a-field-icon icon-person icon-rounded',
                            bind: {
                                store: '{users}',
                                value: '{record.assigned_to}',
                            },
                        },
                        {
                            xtype: 'selectfield',
                            label: 'Priority',
                            testId: 'tasksFormPriorityCombo',
                            placeholder: 'Choose priority',
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
                            bind: {
                                value: '{record.priority}',
                            },
                        },
                        {
                            xtype: 'abraxa.datetimefield',
                            testId: 'tasksFormDueDateField',
                            label: 'Due date',
                            cls: 'a-field-icon icon-time icon-rounded',
                            bind: {
                                dateTime: '{record.due_date}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

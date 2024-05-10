Ext.define('Abraxa.view.task.ApplyTaskTemplate', {
    extend: 'Ext.Dialog',
    closable: true,
    width: 720,
    height: '80%',
    maxHeight: 800,
    layout: 'vbox',
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: 0,
    title: '<div class="a-badge a-badge-apply-template"><i class="material-icons-outlined">playlist_add_check</i></div>Apply Task template',
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'container',
            cls: 'a-general-form',
            items: [
                {
                    xtype: 'template.combo',
                    placeholder: 'Choose template',
                    width: 250,
                    ui: 'field-xl no-border classic',
                    cls: 'task_template_selection a-cursor-pointer',
                    reference: 'selectedTemplate',
                    required: true,
                    editable: false,
                    slug: 'template',
                    templateType: 'task',
                    bind: {
                        store: '{taskTemplates}',
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        clearicontap: function () {
                            this.up('dialog').down('grid').getStore().removeAll();
                        },
                    },
                },
                {
                    xtype: 'div',
                    margin: '0 0 24 0',
                    cls: 'text-info',
                    bind: {
                        html: '<p class="text-info">{selectedTemplate.selection.description}</p>',
                    },
                },
            ],
        },
        {
            xtype: 'grid',
            cls: 'a-offset-grid abraxa-grid a-bt-100',
            ui: 'bordered',
            bind: {
                store: '{templateItems}',
            },
            flex: 1,
            columns: [
                {
                    text: 'Task',
                    cls: 'a-column-offset-x24',
                    dataIndex: 'name',
                    groupable: false,
                    flex: 3,
                    editable: true,
                    cell: {
                        cls: 'a-cell-person a-cell-offset-x24',
                        encodeHtml: false,
                    },
                    editor: {
                        field: {
                            ui: 'classic',
                            clearable: false,
                            xtype: 'textfield',
                            bind: {
                                value: '{record.name}',
                            },
                        },
                        listeners: {
                            complete: function (editor) {
                                let store = editor.upVM().get('templateItems');
                                if (store) {
                                    store.sync({
                                        success: function (batch, opt) {
                                            Ext.toast('Record updated', 1000);
                                        },
                                        failure: function (batch, operations) {
                                            Ext.Msg.alert('Something went wrong', 'Cannot update template item!');
                                        },
                                    });
                                }
                            },
                        },
                    },
                    renderer: function (value) {
                        if (value) {
                            return '<div class="text-truncate fw-b c-blue">' + value + '</div>';
                        }
                    },
                },
                {
                    text: 'Priority',
                    dataIndex: 'priority',
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                    },
                    editor: {
                        field: {
                            xtype: 'selectfield',
                            label: 'Priority',
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
                        listeners: {
                            complete: function (editor) {
                                let store = editor.upVM().get('templateItems');
                                if (store) {
                                    store.sync({
                                        success: function (batch, opt) {
                                            Ext.toast('Record updated', 1000);
                                        },
                                        failure: function (batch, operations) {
                                            Ext.Msg.alert('Something went wrong', 'Cannot update template item!');
                                        },
                                    });
                                }
                            },
                        },
                    },
                    renderer: function renderer(value) {
                        if (value) {
                            if (value == 'high')
                                return (
                                    '<span class="a-status-badge rounded status-high no-border">' +
                                    Ext.String.capitalize(value) +
                                    '</span>'
                                );
                            else {
                                // return Ext.String.capitalize(value);
                                return (
                                    '<span class="a-status-badge rounded status-normal no-border">' +
                                    Ext.String.capitalize(value) +
                                    '</span>'
                                );
                            }
                        }
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function () {
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                ui: 'action',
                text: 'Apply',
                handler: function (cmp) {
                    let vm = this.upVM(),
                        template_name = Ext.ComponentQuery.query('[cls~=task_template_selection]')[0],
                        newTasks = [],
                        dialog = cmp.up('dialog'),
                        tasks = vm.get('tasks');

                    if (template_name.validate()) {
                        this.up('dialog').down('form\\.error').hide();
                        let template = vm.get('selectedTemplate.selection'),
                            items = vm.get('templateItems');
                        items.each(function (item) {
                            let data = item.getData();
                            data.object_id = vm.get('object_id');
                            data.object_meta_id = vm.get('object_record').get('id');
                            data.taskable_id = vm.get('object_record').get('id');
                            data.taskable_type = vm.get('object_record').get('model_name');

                            newTasks.push(data);
                        });

                        if (tasks.count()) {
                            Ext.Msg.confirm(
                                '<div class="hbox"><div class="a-badge a-badge-warning mr-16 my-8"><i class="material-icons-outlined">report_problem</i></div>Warning</div>',
                                'Applying this template will replace all current tasks.',
                                function (answer) {
                                    if (answer == 'yes') {
                                        Ext.Ajax.request({
                                            url:
                                                Env.ApiEndpoint +
                                                'task-template/' +
                                                template.get('id') +
                                                '/' +
                                                vm.get('object_record').get('id') +
                                                '/apply',
                                            method: 'POST',
                                            jsonData: {
                                                tasks: newTasks,
                                            },
                                            success: function (response) {
                                                Ext.toast('Record updated', 1500);
                                                vm.get('object_record').load();
                                                dialog.destroy();
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
                                        ui: 'action alt',
                                        text: 'OK',
                                        separator: true,
                                    },
                                ]
                            );
                            // Ext.Msg.confirm(
                            //     'Confirmation',
                            //     'Are you sure you want to apply this template?<br>All current tasks will be replaced.',
                            //     function (answer) {
                            //         if (answer == 'yes') {
                            //             Ext.Ajax.request({
                            //                 url: Env.ApiEndpoint + 'task_template/apply/3/' + vm.get('object_record').get('id'),
                            //                 method: 'POST',
                            //                 jsonData: {
                            //                     tasks: newTasks
                            //                 },
                            //                 success: function (response) {
                            //                     Ext.toast('Record updated', 1500);
                            //                     vm.get('object_record').load();
                            //                     dialog.destroy();
                            //                 }
                            //             });
                            //         }
                            //     }
                            // );
                        } else {
                            Ext.Ajax.request({
                                url:
                                    Env.ApiEndpoint +
                                    'task-template/' +
                                    template.get('id') +
                                    '/' +
                                    vm.get('object_record').get('id') +
                                    '/apply',
                                method: 'POST',
                                jsonData: {
                                    tasks: newTasks,
                                },
                                success: function (response) {
                                    Ext.toast('Record updated', 1500);
                                    vm.get('object_record').load();
                                    cmp.up('dialog').destroy();
                                },
                            });
                        }
                    } else {
                        this.up('dialog')
                            .down('form\\.error')
                            .setHtml('Please select a template')
                            .show()
                            .addCls('error');
                    }
                },
            },
        ],
    },
});

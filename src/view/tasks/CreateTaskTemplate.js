Ext.define('Abraxa.view.task.CreateTaskTemplate', {
    extend: 'Ext.Dialog',
    closable: true,
    title: '<div class="a-badge a-badge-save-template"><i class="material-icons-outlined">playlist_add</i></div>New Task Template',
    width: 720,
    height: '80%',
    maxHeight: 800,
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: 0,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
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
            padding: 24,
            cls: 'a-bb-100',
            layout: {
                type: 'vbox',
            },
            items: [
                {
                    xtype: 'textfield',
                    cls: 'task_template_name',
                    label: false,
                    clearable: false,
                    placeholder: 'Template name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{template.name}',
                    },
                    listeners: {
                        painted: function () {
                            this.focus();
                        },
                    },
                },
                {
                    xtype: 'div',
                    html: '<hr>',
                },
                {
                    xtype: 'textareafield',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description',
                    bind: {
                        value: '{template.description}',
                    },
                },
                {
                    xtype: 'div',
                    html: '<hr>',
                },
                {
                    xtype: 'office.combo',
                    clearable: false,
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    flex: 1,
                    bind: {
                        store: '{offices}',
                        value: '{template.office_id}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                this.upVM().get('template').set('office_name', selection.get('office_name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                    html: '<hr>',
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-grid-list',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'div',
                    cls: 'a-grid-titles a-bb-100',
                    html: '<div class="ml-8 flex-3" >Task</div><div class="flex-1" style="margin-left: 80px;">Priority</div>',
                },
                {
                    xtype: 'list',
                    flex: 1,
                    lazy: true,
                    infinite: true,
                    bind: {
                        store: '{tasks}',
                    },
                    variableHeights: true,
                    itemsFocusable: true,
                    plugins: {
                        sortablelist: true,
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                priority: {
                                    bind: {
                                        bindTo: '{record.priority}',
                                        deep: true,
                                    },
                                    get: function (priority) {
                                        if (priority == 'high')
                                            return (
                                                '<span class="a-status-badge rounded status-high no-border">' +
                                                Ext.String.capitalize(priority) +
                                                '</span>'
                                            );
                                        else {
                                            // return Ext.String.capitalize(value);
                                            return (
                                                '<span class="a-status-badge rounded status-normal no-border">' +
                                                Ext.String.capitalize(priority) +
                                                '</span>'
                                            );
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        cls: 'myStyle task_template_item x-list-sortablehandle grabbable a-bb-100',
                        minHeight: 48,
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        padding: '0 0 0 16',
                        items: [
                            {
                                xtype: 'div',
                                margin: '0 12 0 0',
                                html: '<i class="md-icon-outlined fs-16 cursor-drag">drag_indicator</i>',
                            },
                            {
                                xtype: 'checkbox',
                                checked: true,
                                ui: 'medium',
                                margin: '0 8 0 0',
                            },
                            {
                                xtype: 'div',
                                flex: 3,
                                bind: {
                                    html: '{record.name}',
                                },
                            },
                            {
                                xtype: 'div',
                                flex: 1,
                                margin: '0 0 0 16',
                                bind: {
                                    html: '{priority}',
                                },
                            },
                        ],
                        getRecordIndex: function () {
                            return this.up('list').getStore().indexOf(this.upVM().get('record'));
                        },
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
                handler: function () {
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                ui: 'action',
                text: 'Create',
                handler: function (cmp) {
                    let template = this.upVM().get('template'),
                        template_name = Ext.ComponentQuery.query('[cls~=task_template_name]')[0];
                    if (template_name.validate()) {
                        this.up('dialog').down('form\\.error').hide();
                        let items = Ext.ComponentQuery.query('[cls~=task_template_item]'),
                            templateItems = [];

                        Ext.each(items, function (item, index) {
                            if (item.down('checkbox').getChecked())
                                templateItems.push({
                                    name: item.upVM().get('record').get('name'),
                                    order_id: index + 1,
                                    priority: item.upVM().get('record').get('priority'),
                                });
                        });
                        if (!templateItems.length) {
                            this.up('dialog')
                                .down('form\\.error')
                                .setHtml('Please select at least one task')
                                .show()
                                .addCls('error');
                        } else {
                            this.up('dialog').down('form\\.error').hide();
                            template.set('items', templateItems);

                            template.save({
                                success: function () {
                                    cmp.up('dialog').destroy();
                                    Ext.toast('Template created', 1500);
                                },
                            });
                        }
                    } else {
                        this.up('dialog')
                            .down('form\\.error')
                            .setHtml('Please set a template name')
                            .show()
                            .addCls('error');
                    }
                },
            },
        ],
    },
});

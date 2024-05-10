Ext.define('Abraxa.view.portcall.sof.ApplySOFTemplate', {
    extend: 'Ext.Dialog',
    closable: true,
    minWidth: 1024,
    height: '80%',
    maxHeight: 800,
    layout: 'vbox',
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: 0,
    title: '<div class="a-badge a-badge-apply-template"><i class="material-icons-outlined">playlist_add_check</i></div>Apply SOF template',
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
                    reference: 'selectedTemplate',
                    templateType: 'sof',
                    cls: 'a-field-icon icon-rounded icon-business-center task_template_selection',
                    required: true,
                    editable: false,
                    bind: {
                        store: '{taskTemplates}',
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
                        html: '{selectedTemplate.selection.description}',
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
            selectable: false,
            columns: [
                {
                    dataIndex: 'default_sof_event_id',
                    cls: 'a-column-offset-x24',
                    text: 'Event',
                    sortable: false,
                    editable: true,
                    menuDisabled: true,
                    flex: 1,
                    minWidth: 240,
                    cell: {
                        cls: 'a-cell-offset-x24',
                        encodeHtml: false,
                    },
                    editor: {
                        field: {
                            xtype: 'sof.general.events',
                            padding: '0 4',
                            ui: 'classic hovered-border',
                            placeholder: 'Event name',
                            bind: {
                                store: '{sofEvents}',
                            },
                            listeners: {
                                select: function (cmp, selection) {
                                    if (cmp.parent) {
                                        let grid = cmp.up('grid'),
                                            record = grid.getSelection();
                                        record.set('event_name', selection.get('name'));
                                    }
                                },
                                keydown: function (cmp, e) {
                                    let key = e.event.key,
                                        shiftKey = e.shiftKey;

                                    if (key == 'Tab' && shiftKey) {
                                        let grid = cmp.up('grid'),
                                            record = grid.getSelection(),
                                            editor = grid.getPlugin(),
                                            store = grid.getStore(),
                                            index = store.indexOf(record);

                                        if (index != 0) {
                                            editor.startEdit(index - 1, 1);
                                            grid.select(index - 1);
                                        }
                                    }
                                },
                            },
                        },
                        listeners: {
                            complete: function (editor) {
                                let store = this.upVM().get('templateItems');
                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            },
                        },
                    },
                    renderer: function (value, record) {
                        if (value) {
                            if (record && record.get('event')) {
                                let cls = '';
                                switch (record.get('event').type.default_sof_event_category_id) {
                                    case 1:
                                        cls = 'sof-event';
                                        break;
                                    case 4:
                                        cls = 'sof-working';
                                        break;
                                    case 5:
                                        cls = 'sof-stoppage';
                                        break;
                                    case 3:
                                        cls = 'sof-shifting';
                                        break;
                                    case 2:
                                        cls = 'sof-waiting';
                                        break;
                                    default:
                                        cls = 'sof-miscellaneous';
                                }
                                return (
                                    '<div class="hbox"><div class="a-badge-sof ' +
                                    cls +
                                    '"></div><span>' +
                                    record.get('event_name') +
                                    '</span>'
                                );
                            } else {
                                return '<span class="a-cell-placeholder">Event name</span>';
                            }
                        }
                        return AbraxaConstants.placeholders.emptyValue;
                    },
                },
                {
                    text: 'Event comment',
                    dataIndex: 'event_comment',
                    sortable: false,
                    menuDisabled: true,
                    editable: true,
                    flex: 1,
                    minWidth: 240,
                    editor: {
                        field: {
                            ui: 'classic',
                            placeholder: AbraxaConstants.placeholders.emptyValue,
                            xtype: 'textfield',
                        },
                        listeners: {
                            complete: function (editor) {
                                let store = this.upVM().get('templateItems');
                                store.sync({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            },
                        },
                    },
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (value, record) {
                        if (!value) return '<span class="a-cell-placeholder">---</span>';

                        return value;
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
                ui: 'action loading',
                enableToggle: true,
                text: 'Apply',
                handler: function (cmp) {
                    let vm = this.upVM(),
                        template_name = Ext.ComponentQuery.query('[cls~=task_template_selection]')[0],
                        newItems = [],
                        dialog = cmp.up('dialog'),
                        object_record = vm.get('object_record'),
                        sof = object_record.sof().getData().getAt(0),
                        gridItems = vm.get('gridItems');
                    if (template_name.validate()) {
                        this.up('dialog').down('form\\.error').hide();
                        let template = vm.get('selectedTemplate.selection'),
                            items = vm.get('templateItems');

                        if (!items.count()) {
                            Ext.Msg.alert('Oops', 'The template contains no items. Please select another template.');
                            return;
                        }
                        items.each(function (item) {
                            let data = item.getData();
                            data.sof_id = sof.get('id');
                            data.default_sof_event_category_id = item.get('event')
                                ? item.get('event').type.default_sof_event_category_id
                                : 0;
                            newItems.push(data);
                        });
                        if (gridItems.count()) {
                            Ext.Msg.confirm(
                                '<div class="hbox"><div class="a-badge a-badge-warning mr-16 my-8"><i class="material-icons-outlined">report_problem</i></div>Warning</div>',
                                'Applying this template will replace all current items.',
                                function (answer) {
                                    if (answer == 'yes') {
                                        Ext.Ajax.request({
                                            url:
                                                Env.ApiEndpoint +
                                                'sof_template/apply/3/' +
                                                vm.get('object_record').get('id'),
                                            method: 'POST',
                                            jsonData: {
                                                newItems: newItems,
                                                sof_id: sof.get('id'),
                                            },
                                            success: function (response) {
                                                Ext.toast('Record updated', 1500);
                                                object_record.load();
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
                                url: Env.ApiEndpoint + 'sof_template/apply/3/' + vm.get('object_record').get('id'),
                                method: 'POST',
                                jsonData: {
                                    newItems: newItems,
                                    sof_id: sof.get('id'),
                                },
                                success: function (response) {
                                    Ext.toast('Record updated', 1500);
                                    object_record.load();
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

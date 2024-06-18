Ext.define('Abraxa.view.portcall.sof.CreateSOFTemplate', {
    extend: 'Ext.Dialog',
    closable: true,
    title: '<div class="a-badge a-badge-save-template"><i class="material-icons-outlined">playlist_add</i></div>New SOF Template',
    minWidth: 1024,
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
                    cls: 'sof_template_name',
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
                    html: '<div class="ml-8" style="width: 310px;">Event</div><div class="flex-15">Event comment</div><div class="flex-1">Portcall status</div><div class="flex-1">Port itinerary</div><div class="flex-1">Berth itinerary</div>',
                },
                {
                    xtype: 'list',
                    flex: 1,
                    lazy: true,
                    infinite: true,
                    bind: {
                        store: '{items}',
                    },
                    variableHeights: true,
                    itemsFocusable: true,
                    plugins: {
                        sortablelist: true,
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                status: {
                                    bind: {
                                        bindTo: '{record.portcall_status_id_trigger}',
                                        deep: true,
                                    },
                                    get: function (status_id) {
                                        if (status_id) {
                                            let store = this.get('portcallAgentStatus'),
                                                record = store.getById(status_id);
                                            if (record) {
                                                return record.get('name');
                                            }
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        height: 48,
                        cls: 'myStyle sof_template_item x-list-sortablehandle grabbable a-bb-100',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        padding: '0 0 0 16',
                        items: [
                            {
                                xtype: 'div',
                                margin: '0 12 0 0',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
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
                                width: 240,
                                bind: {
                                    html: '{record.event_name}',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-grid-comment',
                                flex: 1.5,
                                margin: '0 0 0 16',
                                bind: {
                                    html: '{record.event_comment ? record.event_comment : "<span>Comment</span>"}',
                                },
                            },
                            {
                                xtype: 'combobox',
                                flex: 1,
                                margin: '0 8',
                                ui: 'classic hovered-border',
                                placeholder: 'Status',
                                valueField: 'id',
                                displayField: 'name',
                                queryMode: 'local',
                                bind: {
                                    store: '{portcallAgentStatus}',
                                    value: '{record.portcall_status_trigger}',
                                },
                            },
                            {
                                xtype: 'selectfield',
                                flex: 1,
                                margin: '0 8 0 8',
                                ui: 'classic hovered-border',
                                placeholder: 'Port itinerary',
                                valueField: 'value',
                                displayField: 'text',
                                queryMode: 'local',
                                bind: {
                                    value: '{record.port_itinerary_trigger}',
                                },
                                options: [
                                    {
                                        text: 'ATA',
                                        value: 'port_ata',
                                    },
                                    {
                                        text: 'ATD',
                                        value: 'port_atd',
                                    },
                                ],
                            },
                            {
                                xtype: 'selectfield',
                                flex: 1,
                                margin: '0 16 0 8',
                                ui: 'classic hovered-border',
                                placeholder: 'Berth itinerary',
                                valueField: 'value',
                                displayField: 'text',
                                queryMode: 'local',
                                bind: {
                                    value: '{record.berth_itinerary_trigger}',
                                },
                                options: [
                                    {
                                        text: 'Berthed',
                                        value: 'berthed',
                                    },
                                    {
                                        text: 'Completed',
                                        value: 'completed',
                                    },
                                    {
                                        text: 'Departed',
                                        value: 'departed',
                                    },
                                ],
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
                margin: '0 8 0 0',
                text: 'Cancel',
                handler: function () {
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                ui: 'action loading',
                enableToggle: true,
                text: 'Create',
                handler: function (cmp) {
                    let template = this.upVM().get('template'),
                        template_name = Ext.ComponentQuery.query('[cls~=sof_template_name]')[0];
                    if (template_name.validate()) {
                        this.up('dialog').down('form\\.error').hide();
                        let items = Ext.ComponentQuery.query('[cls~=sof_template_item]'),
                            templateItems = [];

                        Ext.each(items, function (item, index) {
                            if (item.down('checkbox').getChecked())
                                templateItems.push({
                                    event_name: item.upVM().get('record').get('event_name'),
                                    default_sof_event_id: item.upVM().get('record').get('default_sof_event_id'),
                                    event_comment: item.upVM().get('record').get('event_comment'),
                                    portcall_status_trigger: item.upVM().get('record').get('portcall_status_trigger'),
                                    port_itinerary_trigger: item.upVM().get('record').get('port_itinerary_trigger'),
                                    berth_itinerary_trigger: item.upVM().get('record').get('berth_itinerary_trigger'),
                                    order_id: index + 1,
                                });
                        });
                        if (!templateItems.length) {
                            this.up('dialog')
                                .down('form\\.error')
                                .setHtml('Please select at least one item')
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

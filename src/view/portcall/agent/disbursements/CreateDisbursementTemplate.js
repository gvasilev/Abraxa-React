Ext.define('Abraxa.view.portcall.disbursements.CreateDisbursementTemplate', {
    extend: 'Ext.Dialog',
    closable: true,
    title: '<div class="a-badge a-badge-save-template"><i class="material-icons-outlined">playlist_add</i></div>New Disbursement Template',
    width: 1024,
    minHeight: '80%',
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
                    cls: 'disbursement_template_name',
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
                        select: function () {
                            let selection = this.getSelection();
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
                    html: '<div class="ml-8" style="width: 350px;">Main Port Costs</div><div class="flex-1 justify-content-end">PDA</div><div class="flex-2">Comment</div>',
                },
                {
                    xtype: 'list',
                    flex: 1,
                    infinite: true,
                    grouped: false,
                    height: 400,
                    bind: {
                        store: '{items}',
                    },
                    plugins: {
                        sortablelist: true,
                    },
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        height: 48,
                        cls: 'myStyle disbursement_template_item x-list-sortablehandle grabbable a-bb-100',
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
                                html: '<i class="md-icon-outlined cursor-drag">drag_indicator</i>',
                            },
                            {
                                xtype: 'checkbox',
                                checked: true,
                                ui: 'medium',
                                margin: '0 8 0 0',
                            },
                            {
                                xtype: 'div',
                                cls: 'text-truncate',
                                width: 284,
                                bind: {
                                    html: '{record.default_expense_item_name}',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'fw-b text-right',
                                flex: 1,
                                padding: '0 12',
                                bind: {
                                    html: '{record.pda_price:number("0,000.00")}',
                                },
                            },
                            {
                                xtype: 'div',
                                flex: 2,
                                padding: '0 12',
                                bind: {
                                    html: '{record.comment ? record.comment : "<span class=\'a-cell-placeholder\'>---</span>"}',
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
                margin: '0 8 0 0',
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
                        template_name = Ext.ComponentQuery.query('[cls~=disbursement_template_name]')[0];
                    if (template_name.validate()) {
                        this.up('dialog').down('form\\.error').hide();
                        let items = Ext.ComponentQuery.query('[cls~=disbursement_template_item]'),
                            templateItems = [];
                        Ext.each(items, function (item, index) {
                            if (item.down('checkbox').getChecked())
                                templateItems.push({
                                    default_expense_item_name: item
                                        .upVM()
                                        .get('record')
                                        .get('default_expense_item_name'),
                                    default_expense_item_id: item.upVM().get('record').get('default_expense_item_id'),
                                    pda_price: item.upVM().get('record').get('pda_price'),
                                    comment: item.upVM().get('record').get('comment'),
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

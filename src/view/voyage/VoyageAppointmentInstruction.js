Ext.define('Abraxa.view.voyage.VoyageAppointmentInstruction', {
    extend: 'Ext.Container',
    xtype: 'VoyageAppointmentInstruction',
    cls: 'a-collapsible-container',
    padding: '0 0 24 0',
    items: [
        // Instructions List
        {
            xtype: 'abraxa.formlist',
            cls: 'a-instructions-list',
            itemRipple: false,
            layout: 'vbox',
            selectable: {
                deselectable: false,
            },
            bind: {
                store: '{activePortcall.instructions}',
            },
            // Instruction Item
            itemConfig: {
                viewModel: true,
                xtype: 'container',
                cls: 'a-instruction-item',
                layout: {
                    type: 'hbox',
                    align: 'start',
                },
                items: [
                    // Instruction Handle
                    // {
                    //     xtype: 'div',
                    //     cls: 'a-instruction-handle',
                    // },
                    // Instruction Card
                    {
                        xtype: 'container',
                        cls: 'a-instruction-card',
                        items: [
                            // Instruction Header
                            {
                                xtype: 'container',
                                cls: 'a-instruction-header',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'space-between',
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        ui: 'classic field-lg filled-light',
                                        placeholder: 'Enter instruction title',
                                        width: 400,
                                        height: 42,
                                        bind: {
                                            value: '{record.title}',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'a-header-actions',
                                        bind: {
                                            hidden: '{activePortcall.is_locked_for_editing}',
                                        },
                                        items: [
                                            {
                                                xtype: 'filebutton',
                                                ui: 'tool-md round',
                                                text: '',
                                                iconCls: 'md-icon md-icon-attach-file-add attach_file',
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    anchor: true,
                                                    html: 'Attach files',
                                                    align: 'bc-tc?',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    allowOver: false,
                                                    closeAction: 'destroy',
                                                },
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'tool-md round',
                                                iconCls: 'md-icon md-icon-delete delete_instruction',
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    anchor: true,
                                                    html: 'Delete instruction',
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
                            // Instruction Body
                            {
                                xtype: 'container',
                                cls: 'a-instruction-body',
                                items: [
                                    // Instruction Froala
                                    {
                                        xtype: 'container',
                                        cls: 'a-instruction-froala',
                                        items: [
                                            {
                                                xtype: 'froalaeditorfield',
                                                ui: 'froala-classic',
                                                margin: 0,
                                                label: false,
                                                disabled: false,
                                                shadow: false,
                                                flex: 1,
                                                labelAlign: 'top',
                                                editor: {
                                                    attribution: false,
                                                    quickInsertEnabled: false,
                                                    theme: 'royal',
                                                    pastePlain: true,
                                                    // enter: this.ENTER_BR,
                                                    imagePaste: false,
                                                    height: 180,
                                                    charCounterCount: false,
                                                    toolbarButtons: [
                                                        'bold',
                                                        'italic',
                                                        'underline',
                                                        'fontSize',
                                                        'backgroundColor',
                                                        'textColor',
                                                        'formatOL',
                                                        'formatUL',
                                                    ],
                                                },
                                                bind: {
                                                    value: '{record.description}',
                                                },
                                                listeners: {
                                                    initialize: function () {
                                                        this.on('show', function (me) {
                                                            if (me.getEditor()) {
                                                                me.getEditor().edit['on']();
                                                                if (!me.upVM().get('record').get('description')) {
                                                                    me.getEditor().html.set('');
                                                                }
                                                                if (
                                                                    me.upVM().get('activePortcall') &&
                                                                    me
                                                                        .upVM()
                                                                        .get('activePortcall')
                                                                        .get('is_locked_for_editing')
                                                                ) {
                                                                    me.getEditor().edit['off']();
                                                                }
                                                            }
                                                        });
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            // Instruction Footer
                            {
                                xtype: 'container',
                                cls: 'a-instruction-footer',
                                bind: {
                                    hidden: '{record.attachments.count ? false : true}',
                                },
                                items: [
                                    // Instruction Attachments
                                    {
                                        xtype: 'list',
                                        cls: 'a-attachment-list',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            wrap: true,
                                        },
                                        bind: {
                                            store: '{record.attachments}',
                                        },
                                        itemConfig: {
                                            viewModel: true,
                                            xtype: 'div',
                                            cls: 'a-attachment-item',
                                            bind: {
                                                html: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.document.extension}"></div><div><a href="javascript:void(0);">{record.name}.{record.document.extension}</a><span class="sm-title">{record.document.size}</span></div><span style="cursor: pointer;">{!activePortcall.is_locked_for_editing ? "<i class=\\"remove_attachment material-icons md-14\\" style=\\"position: absolute; right:4px; top:4px;\\">close</i>":""}</span></div>',
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    delegate: 'i.remove_attachment',
                                                    fn: function (cmp, a) {
                                                        let store = this.component.up('list').getStore();
                                                        let fileStore = this.component.upVM().get('files');
                                                        let record = this.component.getRecord();
                                                        store.remove(record);
                                                        store.remove(fileStore);
                                                    },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    ],
});

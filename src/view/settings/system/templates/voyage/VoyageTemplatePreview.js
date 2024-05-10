Ext.define('Abraxa.view.settings.system.templates.voyage.VoyageTemplatePreview', {
    extend: 'Ext.Container',
    xtype: 'settings.voyage.template.preview',
    showAnimation: 'slide',
    layout: {
        type: 'hbox',
    },
    width: '90%',
    style: 'margin: 0 auto 6px',
    shadow: false,
    // scrollable: true,
    // cls: 'overflow-y',
    items: [
        {
            xtype: 'container',
            width: 48,
            items: [
                {
                    ui: 'round tool-round',
                    xtype: 'button',
                    margin: '62 8 8 0',
                    iconCls: 'md-icon-keyboard-backspace',
                    right: 0,
                    handler: function () {
                        Ext.ComponentQuery.query('settings\\.voyage\\.templates')[0].setHidden(false);
                        Ext.ComponentQuery.query('settings\\.voyage\\.template\\.preview')[0].setHidden(true);
                    },
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 8',
            width: '90%',
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    margin: '0 0 6 8',
                    items: [
                        {
                            xtype: 'textfield',
                            clearable: false,
                            flex: 1,
                            ui: 'title',
                            margin: '8 0',
                            bind: {
                                value: '{voyageTemplateGrid.selection.name}',
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Add clause',
                            margin: '14 8 0 16',
                            iconCls: 'md-icon-add',
                            ui: 'confirm raised round btn-normal',
                            arrow: false,
                            menuAlign: 'tr-br?',
                            menu: {
                                width: 280,
                                padding: '16 0 0 0',
                                items: [
                                    {
                                        xtype: 'settings.voyage.clause.combo',
                                        forceSelection: true,
                                        labelAlign: 'top',
                                        ui: 'classic',
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'end',
                                        },
                                        flex: 1,
                                        items: [
                                            {
                                                xtype: 'button',
                                                text: 'Insert',
                                                handler: function (btn) {
                                                    let editor = Ext.ComponentQuery.query(
                                                            'settings\\.voyage\\.template\\.preview'
                                                        )[0]
                                                            .down('froalaeditor')
                                                            .getEditor(),
                                                        clauseCombo = btn
                                                            .up('menu')
                                                            .down('settings\\.voyage\\.clause\\.combo'),
                                                        selection = clauseCombo.getSelection();

                                                    if (selection) {
                                                        editor.html.insert(selection.get('content'));
                                                        clauseCombo.clearValue();
                                                    }
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'abraxa.container',
                    height: 'calc(100vh - 228px)',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                    },
                    style: 'margin : 0px auto',
                    items: [
                        {
                            xtype: 'froalaeditor',
                            flex: 1,
                            cls: 'border-radius',
                            editor: {
                                autofocus: true,
                                attribution: false,
                                quickInsertEnabled: false,
                                height: 300,
                                imagePaste: false,
                                editorClass: 'a-fr-document',
                                // documentReady: true,
                                // toolbarButtons: {
                                //     'moreText': {
                                //         'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting']
                                //     },
                                //     'moreParagraph': {
                                //         'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote']
                                //     }
                                // }
                            },
                            bind: {
                                value: '{voyageTemplateGrid.selection.content}',
                            },
                        },
                        {
                            xtype: 'panel',
                            docked: 'bottom',
                            maxHeight: '324',
                            title: 'Attachments',
                            collapsed: true,
                            padding: '0 8 8 8',
                            scrollable: true,
                            layout: 'vbox',
                            ui: 'panel type1 no-border-radius',
                            cls: 'a-bt-100',
                            header: {
                                // cls: 'a-bb-100',
                                title: {
                                    margin: '0 0 0 36',
                                },
                            },
                            tools: [
                                {
                                    xtype: 'button',
                                    text: 'Add attachment',
                                    ui: 'round btn-sm normal',
                                    iconCls: 'md-icon-attach-file',
                                    margin: 0,
                                    handler: function () {
                                        this.up('panel').down('list').getStore().add({});
                                    },
                                },
                            ],
                            titleCollapse: true,
                            collapsible: {
                                direction: 'bottom',
                                dynamic: true,
                                tool: {
                                    left: 6,
                                },
                            },
                            items: [
                                {
                                    xtype: 'list',
                                    layout: {
                                        type: 'hbox',
                                        wrap: true,
                                    },
                                    cls: 'a-voyage-attachments',
                                    store: [
                                        {
                                            firstName: 'Peter_pan.pdf',
                                            ext: 'xls',
                                        },
                                        {
                                            firstName: 'Raymond_Shnitz.pdf',
                                            ext: 'pdf',
                                        },
                                        {
                                            firstName: 'Egon_Targaryen.pdf',
                                            ext: 'png',
                                        },
                                    ],

                                    itemTpl:
                                        '<div class="a-attachments"><div class="file-icon-new file-icon-sm" data-type="{ext}"></div>&nbsp;&nbsp;<div><a class="file_name" href="javascript:void(0);">{firstName}</a><br><span>145kb</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-18" style="position: absolute; right:0; top:4px;">close</i></span></div>',
                                    itemConfig: {
                                        style: 'border-radius: 3px; background-color: #F8F9FA; border: 1px solid #E7EAEE',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'space-between',
                                        },
                                        maxWidth: '32.3%',
                                        minWidth: '32.2%',
                                        padding: 0,
                                        margin: '4',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'overflow-y',
                    flex: 1,
                    style: 'margin : 0px auto',
                    padding: '12 0',
                    layout: {
                        type: 'hbox',
                        pack: 'end',
                    },
                    items: [
                        {
                            xtype: 'button',
                            width: 80,
                            ui: 'round raised',
                            text: 'Save',
                            handler: function () {
                                let store = this.upVM().get('voyageTemplates');
                                store.sync({
                                    success: function (res) {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

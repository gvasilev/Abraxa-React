Ext.define('AbraxaLive.view.settings.voyage.clauses.Create', {
    extend: 'Ext.Dialog',
    xtype: 'settings.voyage.clauses.create',
    bind: {
        title: '{clauseRecord ? "Edit" : "Create"} Voyage Clause',
    },
    minWidth: 380,
    closable: true,
    padding: 0,
    maximizable: true,
    height: 840,
    width: 680,
    items: [
        {
            xtype: 'formpanel',
            padding: 0,
            ui: 'no-border-radius',
            items: [
                {
                    xtype: 'form.error',
                    docked: 'top',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    showAnimation: 'fadeIn',
                },
                {
                    xtype: 'container',
                    padding: 16,
                    defaults: {
                        labelAlign: 'top',
                        // ui: 'classic'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Name',
                            name: 'name',
                            ui: 'title',
                            required: true,
                            clearable: false,
                            margin: 0,
                            bind: {
                                value: '{clauseRecord.name}',
                            },
                        },
                        {
                            xtype: 'froalaeditorfield',
                            cls: 'voyageInstructionsEdtior',
                            shadow: false,
                            flex: 1,
                            name: 'content',
                            margin: 0,
                            editor: {
                                autofocus: true,
                                attribution: false,
                                quickInsertEnabled: false,
                                theme: 'royal',
                                height: 570,
                                imagePaste: false,
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
                                value: '{clauseRecord.content}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            handler: function () {
                this.up('dialog').destroy();
            },
            ui: 'default',
        },
        {
            text: 'Create',
            hidden: true,
            bind: {
                hidden: '{clauseRecord ? true : false}',
            },
            handler: function (btn) {
                let form = this.up('dialog').down('formpanel');

                if (form.validate()) {
                    let store = btn.lookupViewModel().get('voyageClause');
                    store.add(form.getValues());
                    store.sync({
                        success: function (batch, opt) {
                            Ext.toast('Record created', 1000);
                            btn.up('dialog').destroy();
                        },
                    });
                } else {
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
        {
            text: 'Save',
            hidden: true,
            bind: {
                hidden: '{clauseRecord ? false : true}',
            },
            handler: function (btn) {
                let form = this.up('dialog').down('formpanel');
                if (form.validate()) {
                    let store = btn.lookupViewModel().get('voyageClause');
                    store.sync({
                        success: function (batch, opt) {
                            Ext.toast('Record updated', 1000);
                            btn.up('dialog').destroy();
                        },
                    });
                } else {
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});

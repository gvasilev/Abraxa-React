Ext.define('Abraxa.view.inquiry.inquiryDetails.ProformaInstructions', {
    extend: 'Ext.Container',
    xtype: 'proforma.instructions',
    cls: 'instructions_container a-instructions-container',
    hidden: true,
    flex: 1,
    bind: {
        hidden: '{inquiryMenu.selection.tab == "instructions" ? false : true}',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-titlebar a-bb-100',
            weight: 2,
            height: 64,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: 'Instructions',
                    },
                },
            ],
        },
        {
            xtype: 'froalaeditorfield',
            cls: 'voyageInstructionsEdtior fr-view-fix',
            shadow: false,
            labelAlign: 'left',
            ui: 'classic hovered-border',
            flex: 1,
            margin: '-1 0 0 0',
            editor: {
                autofocus: true,
                attribution: false,
                quickInsertEnabled: false,
                theme: 'royal',
                pastePlain: true,
                enter: this.ENTER_BR,
                imagePaste: false,
                height: 300,
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
                // toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', 'insertImage', 'insertLink', 'insertFile', '|', 'help', '|', 'html', ],
                // toolbarButtons: {
                //     'moreText': {
                //         'buttons': ['subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting']
                //     },
                //     'moreParagraph': {
                //         'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'textColor', 'backgroundColor', 'alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote']
                //     },
                // }
            },
            bind: {
                value: '{instruction.description}',
            },
            listeners: {
                focusleave: function (me) {
                    let store = this.upVM().get('object_record').instructions();
                    store.sync({
                        success: function () {
                            Ext.toast('Record updated', 1000);
                        },
                    });
                },
            },
        },
    ],
});

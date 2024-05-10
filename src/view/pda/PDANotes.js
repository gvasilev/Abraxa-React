Ext.define('Abraxa.view.pda.PDANotes', {
    extend: 'Ext.Container',
    xtype: 'pda.notes',
    cls: 'instructions_container a-instructions-container',
    layout: 'vbox',
    hidden: true,
    flex: 1,
    items: [
        {
            xtype: 'froalaeditorfield',
            viewModel: {
                formulas: {
                    setFloaraEidtorDisabled: function (get) {
                        const pdaStaus = get('pda.status');
                        const view = this.getView();
                        if (pdaStaus != 'draft') {
                            //This timeout is here because of froala editor, which set contenteditable attribute to true
                            setTimeout(() => {
                                view.el.query('.fr-element')[0].setAttribute('contenteditable', false);
                                view.el.query('button').forEach((button) => button.classList.add('fr-disabled'));
                            }, 0);
                        } else {
                            view.el.query('.fr-element')[0].setAttribute('contenteditable', true);
                            view.el.query('button').forEach((button) => button.classList.remove('fr-disabled'));
                        }
                    },
                },
            },
            cls: 'voyageInstructionsEdtior fr-view-fix',
            flex: 1,
            margin: '-1 0 0 0',
            shadow: false,
            labelAlign: 'left',
            ui: 'classic hovered-border',
            height: '100%',
            flex: 1,
            bind: {
                disabled: '{nonEditable}',
                value: '{pda.note}',
            },
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
            listeners: {
                'froala.blur': function (me) {
                    let html = this.getEditor().html.get(),
                        object_record = me.upVM().get('object_record'),
                        pda = me.upVM().get('pda');

                    pda.set('note', html);
                    if (pda.dirty) {
                        pda.save({
                            success: function (record, operation) {
                                Abraxa.utils.Functions.updateInquiry(object_record);
                                Ext.toast('Record updated');
                            },
                        });
                    }
                },
            },
        },
    ],
});

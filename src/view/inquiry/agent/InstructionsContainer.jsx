Ext.define('Abraxa.view.inquiry.agent.InstructionsContainer', {
    extend: 'Ext.Container',
    xtype: 'inquiry.instructions.container',
    cls: 'instructions_container a-instructions-container',
    hidden: true,
    showAnimation: {
        type: 'slide',
        direction: 'left',
    },
    flex: 1,
    scrollable: false,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'textfield',
            margin: '0 24 0 64',
            label: false,
            placeholder: 'Enter title',
            ui: 'field-xl no-border classic',
            required: true,
            bind: {
                value: '{instruction.title}',
            },
        },
        {
            xtype: 'container',
            flex: 1,
            items: [
                {
                    xtype: 'froalaeditor',
                    padding: '0 24 0 48',
                    cls: 'voyageInstructionsEdtior',
                    shadow: false,
                    height: '100%',
                    editor: {
                        autofocus: true,
                        attribution: false,
                        quickInsertEnabled: false,
                        theme: 'royal',
                        pastePlain: true,
                        enter: 2,
                        imagePaste: false,
                        height: 300,
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
                },
            ],
        },
    ],
});

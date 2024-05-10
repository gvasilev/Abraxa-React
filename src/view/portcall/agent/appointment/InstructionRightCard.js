Ext.define('Abraxa.view.portcall.appointment.InstructionRightCard', {
    extend: 'Ext.Container',
    xtype: 'instruction.right.card',
    itemId: 'dropped-portcall-right-instructions',
    layout: 'vbox',
    scrollable: 'y',
    controller: 'portcall-instruction-controller',
    flex: 1,
    viewModel: {
        formulas: {
            dialogTitle: {
                bind: {
                    bindTo: '{selectedInstruction}',
                },
                get: function (selection) {
                    if (selection) {
                        return '<div><span class="a-panel-title">' + selection.get('title') + '</span></div>';
                    }
                },
            },
        },
    },
    zIndex: '200',
    cls: 'a-drop-container',
    id: 'dropped-portcall-right-instructions',
    items: [
        {
            xtype: 'container',
            // cls: 'a-cdb-overview',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    flex: 1,
                    cls: 'a-bb-100',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            minHeight: 64,
                            items: [
                                {
                                    xtype: 'tool',
                                    iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                                    margin: '0 12 0 0',
                                    ui: 'tool-md',
                                    handler: function (me) {
                                        let record = me.upVM().get('selectedInstruction');
                                        if (record.dirty) {
                                            record.reject();
                                        }
                                        me.upVM().set('selectedInstruction', null);
                                    },
                                },
                                {
                                    xtype: 'title',
                                    bind: {
                                        title: '{dialogTitle}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-actions',
                            padding: '0 16 0 0',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    ui: 'tool round tool-md',
                                    slug: 'portcallVoyInstructions',
                                    bind: {
                                        permission: '{userPermissions}',
                                        cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                                    },
                                    tooltip: {
                                        anchorToTarget: true,
                                        align: 'bc-tc?',
                                        html: 'Delete',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        closeAction: 'destroy',
                                    },
                                    handler: function (button, el, data) {
                                        Ext.Msg.confirm(
                                            'Confirmation',
                                            'Are you sure you want to delete this record?',
                                            function (answer) {
                                                if (answer == 'yes') {
                                                    let store = button.upVM().get('instructions'),
                                                        record = this.upVM().get('selectedInstruction');
                                                    store.remove(record);
                                                    store.sync({
                                                        success: function () {
                                                            button.upVM().set('selectedInstruction', null);
                                                            Ext.toast('Record deleted', 1000);
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
                                                    enableToggle: true,
                                                    ui: 'decline alt loading',
                                                    text: 'Delete',
                                                },
                                            ]
                                        );
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-instructions-container',
            flex: 1,
            scrollable: 'y',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'textfield',
                    margin: '0 24',
                    label: false,
                    placeholder: 'Enter title',
                    ui: 'field-xl no-border classic',
                    required: true,
                    slug: 'portcallVoyInstructions',
                    bind: {
                        permission: '{userPermissions}',
                        value: '{selectedInstruction.title}',
                        readOnly: '{nonEditable ? true : false}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                        blur: function (me) {
                            let record = me.upVM().get('selectedInstruction');
                            if (record.dirty && record.get('title').length > 0) {
                                record.save({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'froalaeditor',
                    padding: '0 24 0 8',
                    cls: 'voyageInstructionsEdtior fr-view-x16',
                    shadow: false,
                    height: '90%',
                    flex: 1,
                    required: true,
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
                        value: '{selectedInstruction.description}',
                        disabled: '{nonEditable ? true : false}',
                    },
                    listeners: {
                        painted: function (me) {
                            if (
                                me.upVM().get('object_record') &&
                                !me.upVM().get('userPermissions').portcallVoyInstructions.edit
                            ) {
                                me.setDisabled(true);
                            }
                        },
                        'froala.blur': function (me) {
                            let record = me.upVM().get('selectedInstruction');
                            if (record.dirty && record.get('title').length > 0) {
                                record.save({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x0',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-titlebar',
                            html: '<div class="x-title my-16 mx-24">Attachments</div>',
                        },
                        {
                            xtype: 'list',
                            padding: '0 24 8 24',
                            margin: '0 -4',
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            bind: {
                                hidden: '{selectedInstruction.attachments.count ? false : true}',
                                store: '{selectedInstruction.attachments}',
                            },
                            cls: 'a-voyage-attachments',

                            itemConfig: {
                                cls: 'a-attachment-item',
                                margin: '0 4 8 4',
                                minWidth: 0,
                                viewModel: {
                                    formulas: {
                                        itemTpl: {
                                            bind: {
                                                bindTo: '{record.document}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                let document = record;
                                                let nonEditable = this.get('nonEditable');
                                                if (nonEditable) {
                                                    return (
                                                        '<div class="a-attachment-inner"><div class="file-icon-new file-icon-sm-new" data-type="' +
                                                        document.getData().extension +
                                                        '"></div><div><a class="file_name" href="javascript:void(0);">' +
                                                        document.getData().name +
                                                        '.' +
                                                        document.getData().extension +
                                                        '</a><span class="sm-title">' +
                                                        document.getData().size +
                                                        ' kb</span></div></div>'
                                                    );
                                                } else {
                                                    if (this.get('userPermissions').portcallVoyInstructions.edit) {
                                                        return (
                                                            '<div class="a-attachment-inner"><div class="file-icon-new file-icon-sm-new" data-type="' +
                                                            document.getData().extension +
                                                            '"></div><div><a class="file_name" href="javascript:void(0);">' +
                                                            document.getData().name +
                                                            '.' +
                                                            document.getData().extension +
                                                            '</a><span class="sm-title">' +
                                                            document.getData().size +
                                                            ' kb</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>'
                                                        );
                                                    } else {
                                                        return (
                                                            '<div class="a-attachment-inner"><div class="file-icon-new file-icon-sm-new" data-type="' +
                                                            document.getData().extension +
                                                            '"></div><div><a class="file_name" href="javascript:void(0);">' +
                                                            document.getData().name +
                                                            '.' +
                                                            document.getData().extension +
                                                            '</a><span class="sm-title">' +
                                                            document.getData().size +
                                                            ' kb</span></div></div>'
                                                        );
                                                    }
                                                }
                                            },
                                        },
                                    },
                                },
                                layout: {
                                    type: 'hbox',
                                    pack: 'space-between',
                                },
                                bind: {
                                    tpl: '{itemTpl}',
                                },
                            },
                            listeners: {
                                childtap: function (me, selection, events) {
                                    var store = me.getStore();
                                    let record = selection.record;
                                    var selectedInstruction = me.upVM().get('selectedInstruction'),
                                        controller = me.up('[xtype=instruction\\.right\\.card]').getController(),
                                        ids = [];
                                    if (selection.sourceElement.classList.contains('remove_attachment')) {
                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you would like to delete this entry?',
                                            function (answer) {
                                                if (answer != 'yes') return;
                                                store.remove(record);
                                                ids.push(record.get('id'));
                                                controller.deleteFiles(ids, selectedInstruction);
                                                Ext.toast('Record updated', 1000);
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
                                                    ui: 'decline alt',
                                                    text: 'Delete',
                                                    separator: true,
                                                },
                                            ]
                                        );
                                    } else {
                                        if (record) {
                                            var selectedFile = record.getDocument(),
                                                documents = [];

                                            store.each(function (attachment) {
                                                documents.push(attachment.getDocument());
                                            });

                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .previewFile(me, selectedFile, documents);

                                            return;
                                        }
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'filebutton',
                            multiple: true,
                            margin: '0 24 8 24',
                            ui: 'normal-light medium',
                            iconCls: 'md-icon-outlined md-icon-cloud-upload',
                            ui: 'blue-light',
                            name: 'files',
                            text: 'Upload',
                            slug: 'portcallVoyInstructions',
                            controller: 'portcall-instruction-controller',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                                permission: '{userPermissions}',
                            },
                            listeners: {
                                change: function (me, newValue) {
                                    if (newValue) {
                                        var uploadController = me.getController(),
                                            nomination = me.upVM().get('nomination'),
                                            record = me.upVM().get('selectedInstruction');
                                        uploadController.uploadFiles(me, record, nomination);
                                    }
                                    document.querySelector("input[type='file']").value = '';
                                    me.setValue(null);
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x0 mb-0',
                    html: '<hr>',
                },
                {
                    xtype: 'public.updated.by',
                    margin: '16 24 8 24',
                    maxWidth: 164,
                    bind: {
                        data: {
                            user: '{selectedInstruction.updated_by_user}',
                            updated_at: '{selectedInstruction.updated_at}',
                        },
                    },
                },
            ],
        },
    ],
    listeners: {
        element: 'element',
        drop: 'onDropRight',
        dragleave: 'onDragLeaveListItemRight',
        dragover: 'onDragOverListItemRight',
        hide: function (me) {
            console.log(me);
        },
    },
});

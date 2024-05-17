import './InstructionController';

Ext.define('Abraxa.view.portcall.appointment.AddInstructions', {
    xtype: 'appointment.add.instructions',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    scrollable: 'y',
    width: 620,
    height: '90%',
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    controller: 'portcall-instruction-controller',
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">description</i></div>Add instructions',
    manageBorders: false,
    tools: {
        attach: {
            xtype: 'filebutton',
            margin: '0 0 0 8',
            ui: 'round tool-sm toggle',
            text: '',
            accept: '.pdf,.doc,.docs,.xls,.xlsx,.txt,.zip,.jpeg,.pjpeg,.jpeg,.pjpeg,.png,.gif',
            iconCls: 'md-icon-attach-file',
            tooltip: {
                showOnTap: true,
                html: 'Attach file',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            listeners: {
                change: function (me, newValue) {
                    if (newValue) {
                        var files = this.getFiles(),
                            len = files.length,
                            ext,
                            fileStore = me.upVM().get('files'),
                            totalSize = 0;

                        let size = function (size) {
                            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                            if (size == 0) return '0 Byte';
                            var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                            return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
                        };

                        for (var i = 0; i < len; i++) {
                            totalSize += files.item(i).size;
                        }
                        if (totalSize > 10 * 1024 * 1024) {
                            Ext.create('Ext.MessageBox', {
                                ui: 'warning',
                                title: 'Upload Cancelled',
                                innerCls: 'a-bgr-white',
                                message:
                                    'Your file(s) payload size (' +
                                    (totalSize / 1024 / 1024).toFixed(2) +
                                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />',
                                width: 500,
                                dataTitle: 'Warning',
                                modal: true,
                                draggable: false,
                                bbar: {
                                    manageBorders: false,
                                    items: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            ui: 'action',
                                            text: 'Ok',
                                            handler: function () {
                                                this.up('dialog').destroy();
                                            },
                                        },
                                    ],
                                },
                            }).show();
                            fileField = document.getElementById(me.id);
                            // get the file upload parent element
                            parentNod = fileField.parentNode;
                            // create new element
                            tmpForm = document.createElement('form');
                            parentNod.replaceChild(tmpForm, fileField);
                            tmpForm.appendChild(fileField);
                            tmpForm.reset();
                            parentNod.replaceChild(fileField, tmpForm);
                            document.querySelector("input[type='file']").value = '';
                            me.setValue(null);
                            return;
                        }
                        for (var i = 0; i < len; i++) {
                            ext = files.item(i).name.split('.').pop();
                            let record = {
                                ext: ext,
                                firstName: files.item(i).name.split('.').shift(),
                                file: files.item(i),
                                size: size(totalSize),
                            };
                            fileStore.add(record);
                        }
                    }
                    document.querySelector("input[type='file']").value = '';
                    me.up('dialog').getController().clearFileUpload(me.element.id);
                    me.setValue(null);
                },
            },
        },
    },
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">description</i></div>Add instructions',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            zIndex: '200',
            id: 'dropped-create-instructions',
            cls: 'a-drop-container',
            items: [
                {
                    xtype: 'formpanel',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'formpanel',
                            cls: 'a-instructions-container',
                            reference: 'instructionForm',
                            scrollable: false,
                            padding: 0,
                            flex: 1,
                            defaults: {
                                clearable: false,
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    margin: '0 24 0 72',
                                    label: false,
                                    placeholder: 'Enter title',
                                    ui: 'field-xl no-border classic',
                                    bind: {
                                        value: '{instruction.title}',
                                        disabled: '{object_record.is_archived ? true:false}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.focus();
                                        },
                                    },
                                },
                                {
                                    xtype: 'froalaeditorfield',
                                    padding: '0 24 0 58',
                                    name: 'test',
                                    cls: 'voyageInstructionsEdtior',
                                    shadow: false,
                                    height: '90%',
                                    flex: 1,
                                    editor: {
                                        autofocus: true,
                                        attribution: false,
                                        quickInsertEnabled: false,
                                        theme: 'royal',
                                        pastePlain: true,
                                        enter: 2,
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
                                    },
                                    bind: {
                                        value: '{instruction.description}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            if (
                                                me.upVM().get('object_record') &&
                                                me.upVM().get('object_record').get('is_archived')
                                            ) {
                                                me.setDisabled(true);
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'divider divider-offset offset-x0',
                                    bind: {
                                        hidden: '{files.count ? false:true}',
                                    },
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'container',
                                    bind: {
                                        hidden: '{files.count ? false:true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'a-titlebar',
                                            html: '<div class="x-title my-16 mx-24">Attachments</div>',
                                        },
                                        {
                                            xtype: 'list',
                                            margin: '0 -4',
                                            padding: '0 24',
                                            layout: {
                                                type: 'hbox',
                                                wrap: true,
                                            },
                                            bind: {
                                                store: '{files}',
                                            },
                                            cls: 'a-voyage-attachments',
                                            itemTpl:
                                                '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{ext}"></div><div><a class="file_name" href="javascript:void(0);">{firstName}</a><span class="sm-title">{size}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>',
                                            itemConfig: {
                                                cls: 'a-attachment-item',
                                                margin: '0 4 8 4',
                                                minWidth: 0,
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'space-between',
                                                },
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    delegate: 'i.remove_attachment',
                                                    fn: function (cmp, a) {
                                                        var store = this.component.getStore();
                                                        var record = this.component.getSelection();
                                                        store.remove(record);
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
            ],
            listeners: {
                element: 'element',
                drop: 'onDrop',
                dragleave: 'onDragLeaveListItem',
                dragover: 'onDragOverListItem',
            },
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('instruction');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            enableToggle: true,
            ui: 'action loading',
            bind: {
                text: '{editMode ? "Save" : "Create"}',
                disabled: '{instruction.dirty ? false:true}',
            },
            handler: 'onCreate',
        },
    ],
});

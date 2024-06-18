Ext.define('Abraxa.view.cdb.company.agreements.standardInstructions.CreateInstructions', {
    extend: 'Ext.Dialog',
    xtype: 'agreements.instructions.create',
    testId: 'agreementsInstructionsCreate',
    cls: 'a-dialog-create a-dialog-has-icon',
    controller: 'instruction-controller',
    manageBorders: false,
    scrollable: 'y',
    width: 620,
    minHeight: 580,
    maxHeight: '90%',
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    tools: {
        attach: {
            xtype: 'filebutton',
            testId: 'agreementsInstructionsCreateAttachFileBtn',
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
                        if (totalSize > 5 * 1024 * 1024) {
                            Ext.create('Ext.MessageBox', {
                                ui: 'warning',
                                title: 'Upload Cancelled',
                                innerCls: 'a-bgr-white',
                                message:
                                    'Your file(s) payload size (' +
                                    (totalSize / 1024 / 1024).toFixed(2) +
                                    ' MB) <br /> is exceeding the maximum allowed size (5 MB) per upload. </br>' +
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
                                            testId: 'agreementsInstructionsCreateUploadCancelledOKBtn',
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
            testId: 'agreementsInstructionsCreateDroppedCreateInstructionsBtn',
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
                            testId: 'agreementsInstructionsCreateFormError',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'formpanel',
                            testId: 'agreementsInstructionsCreateFormPanel',
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
                                    testId: 'agreementsInstructionsCreateEnterTitleField',
                                    ui: 'field-xl no-border classic',
                                    required: true,
                                    bind: {
                                        value: '{instruction.title}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.focus();
                                        },
                                    },
                                },
                                {
                                    xtype: 'froalaeditorfield',
                                    testId: 'agreementsInstructionsCreateFroalaEditorField',
                                    padding: '0 24 0 58',
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
                                        // enter: FroalaEditor.2,
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
                                            testId: 'agreementsInstructionsCreateFilesList',
                                            padding: '0 24 0 24',
                                            margin: '0 -4',
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
                                {
                                    xtype: 'div',
                                    cls: 'divider divider-offset offset-x0',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-titlebar',
                                    html: '<div class="x-title my-16 mx-24">Rules</div>',
                                },
                                {
                                    xtype: 'container',
                                    margin: '0 24 16 24',
                                    bind: {
                                        hidden: '{instruction.rules.count ? false:true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'list',
                                            bind: {
                                                store: '{instruction.rules}',
                                            },
                                            itemConfig: {
                                                viewModel: true,
                                                xtype: 'container',
                                                cls: 'a-bb-100',
                                                padding: '8 0',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'combobox',
                                                        width: 160,
                                                        ui: 'viewonly classic',
                                                        cls: 'a-field-icon icon-filter icon-rounded',
                                                        placeholder: 'Choose',
                                                        testId: 'agreementsInstructionsCreateChooseCombo',
                                                        label: null,
                                                        labelAlign: 'left',
                                                        valueField: 'id',
                                                        required: true,
                                                        disabled: true,
                                                        readOnly: true,
                                                        displayField: 'name',
                                                        queryMode: 'local',
                                                        store: {
                                                            data: [
                                                                {
                                                                    id: 'port_id',
                                                                    name: 'Port',
                                                                },
                                                                {
                                                                    id: 'port_function',
                                                                    name: 'Port function',
                                                                },
                                                                {
                                                                    id: 'agency_type_id',
                                                                    name: 'Agency type',
                                                                },
                                                            ],
                                                        },
                                                        bind: {
                                                            value: '{record.property}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'combobox',
                                                        maxWidth: 150,
                                                        ui: 'classic hovered-border',
                                                        cls: 'a-field-icon icon-functions icon-rounded',
                                                        placeholder: 'Choose condition',
                                                        testId: 'agreementsInstructionsCreateChooseConditionCombo',
                                                        label: null,
                                                        labelAlign: 'left',
                                                        valueField: 'id',
                                                        required: true,
                                                        displayField: 'name',
                                                        queryMode: 'local',
                                                        store: {
                                                            data: [
                                                                {
                                                                    id: 'in',
                                                                    name: 'Equals (=)',
                                                                },
                                                            ],
                                                        },
                                                        bind: {
                                                            value: '{record.condition}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'ports.served.combo',
                                                        flex: 1,
                                                        label: null,
                                                        labelAlign: 'left',
                                                        ui: 'classic hovered-border',
                                                        cls: 'a-field-icon icon-port icon-rounded',
                                                        multiSelect: true,
                                                        forceSelection: true,
                                                        placeholder: 'Choose ports',
                                                        testId: 'agreementsInstructionsCreateChoosePortsCombo',
                                                        bind: {
                                                            value: '{record.value}',
                                                            hidden: '{record.property == "port_id" ? false:true}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'selectfield',
                                                        flex: 1,
                                                        label: null,
                                                        labelAlign: 'left',
                                                        ui: 'classic hovered-border',
                                                        cls: 'a-field-icon icon-short icon-rounded',
                                                        placeholder: 'Choose function',
                                                        testId: 'agreementsInstructionsCreateChooseFunctionCombo',
                                                        queryMode: 'local',
                                                        valueField: 'name',
                                                        displayField: 'name',
                                                        multiSelect: true,
                                                        hidden: true,
                                                        bind: {
                                                            value: '{record.value}',
                                                            store: '{berthFunctions}',
                                                            hidden: '{record.property == "port_function"  ? false:true}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'selectfield',
                                                        flex: 1,
                                                        label: null,
                                                        labelAlign: 'left',
                                                        ui: 'classic hovered-border',
                                                        cls: 'a-field-icon icon-short icon-rounded',
                                                        placeholder: 'Choose agency type',
                                                        testId: 'agreementsInstructionsCreateChooseAgencyTypeCombo',
                                                        multiSelect: true,
                                                        forceSelection: false,
                                                        displayField: 'name',
                                                        valueField: 'id',
                                                        store: {
                                                            type: 'agency.types',
                                                        },
                                                        bind: {
                                                            value: '{record.value}',
                                                            hidden: '{record.property == "agency_type_id"  ? false:true}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        margin: '0 0 0 8',
                                                        ui: 'small round tool-round',
                                                        iconCls: 'md-icon-outlined md-icon-remove-circle-outline',
                                                        testId: 'agreementsInstructionsCreateRemoveRowBtn',
                                                        tooltip: {
                                                            anchorToTarget: true,
                                                            html: 'Remove',
                                                            align: 'bc-tc?',
                                                            showDelay: 0,
                                                            hideDelay: 0,
                                                            dismissDelay: 0,
                                                            allowOver: false,
                                                            closeAction: 'destroy',
                                                        },
                                                        handler: function (owner, tool, event) {
                                                            let store = this.upVM().get('instruction').rules(),
                                                                record = this.upVM().get('record');

                                                            Ext.Msg.confirm(
                                                                'Delete',
                                                                'Are you sure you would like to delete this row?',
                                                                function (answer) {
                                                                    if (answer == 'yes') {
                                                                        store.remove(record);
                                                                    }
                                                                },
                                                                this,
                                                                [
                                                                    {
                                                                        xtype: 'button',
                                                                        testId: 'agreementsInstructionsCreateRemoveRowCancelBtn',
                                                                        itemId: 'no',
                                                                        margin: '0 8 0 0',
                                                                        text: 'Cancel',
                                                                    },
                                                                    {
                                                                        xtype: 'button',
                                                                        itemId: 'yes',
                                                                        ui: 'decline alt',
                                                                        testId: 'agreementsInstructionsCreateRemoveRowDeleteBtn',
                                                                        text: 'Delete',
                                                                    },
                                                                ]
                                                            );
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'button',
                                    text: 'Add rule',
                                    testId: 'agreementsInstructionsCreateAddRuleBtn',
                                    ui: 'normal small',
                                    margin: '0 0 0 24',
                                    height: 28,
                                    iconCls: 'md-icon-add',
                                    menu: {
                                        defaults: {
                                            handler: function (btn) {
                                                let store = this.upVM().get('instruction').rules(),
                                                    selectedInstruction = this.upVM().get('instruction'),
                                                    record = Ext.create('Abraxa.model.cdb.InstructionRule', {
                                                        owner_id: selectedInstruction.get('id'),
                                                        owner_type: selectedInstruction.get('model_name'),
                                                        property: btn.property,
                                                        condition: 'in',
                                                    });
                                                store.add(record);
                                            },
                                            listeners: {
                                                painted: function (me) {
                                                    let store = this.upVM().get('instruction').rules();
                                                    me.setDisabled(false);
                                                    if (store.getCount()) {
                                                        let record_exists = store.queryBy(function (rec, id) {
                                                            return rec.get('property') == me.property;
                                                        }).items;
                                                        if (record_exists.length) {
                                                            me.setDisabled(true);
                                                        }
                                                    }
                                                },
                                            },
                                        },
                                        items: [
                                            {
                                                text: 'Port',
                                                testId: 'agreementsInstructionsCreateAddRulePortBtn',
                                                property: 'port_id',
                                            },
                                            {
                                                text: 'Port function',
                                                testId: 'agreementsInstructionsCreateAddRulePortFunctionBtn',
                                                property: 'port_function',
                                            },
                                            {
                                                text: 'Agency type',
                                                testId: 'agreementsInstructionsCreateAgencyTypeBtn',
                                                property: 'agency_type_id',
                                            },
                                        ],
                                    },
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
            testId: 'agreementsInstructionsCreateCancelBtn',
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
            testId: 'agreementsInstructionsCreateSaveBtn',
            bind: {
                text: '{editMode ? "Save" : "Create"}',
            },
            handler: 'onCreate',
        },
    ],
});

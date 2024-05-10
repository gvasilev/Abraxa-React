Ext.define('Abraxa.view.cdb.company.agreements.standardInstructions.InstructionsRightCard', {
    extend: 'Ext.Container',
    xtype: 'agreements.instructions.right.card',
    itemId: 'instructionsRightCard',
    testId: 'instructionsRightCard',
    controller: 'instruction-controller',
    viewModel: {
        stores: {
            berthFunctions: {
                type: 'berth.function',
            },
            rules: {
                source: '{selectedInstruction.rules}',
                extraParams: {
                    instruction_id: '{selectedInstruction.id}',
                    org_id: '{object_record.org_id}',
                },
                pageParam: false,
                startParam: false,
                limitParam: false,
            },
        },
        formulas: {
            dialogTitle: {
                bind: {
                    bindTo: '{instructionGrid.selection}',
                },
                get: function (selection) {
                    if (selection) {
                        return '<div><span class="a-panel-title">' + selection.get('title') + '</span></div>';
                    }
                },
            },
        },
    },
    flex: 1,
    weighted: true,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    zIndex: '200',
    id: 'dropped-right-instructions',
    cls: 'a-drop-container',
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

                                        let grid = Ext.ComponentQuery.query('agreements\\.instructions\\.grid')[0];
                                        if (record && record.dirty) {
                                            record.reject();
                                        }
                                        if (grid) {
                                            grid.deselectAll();
                                        }
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
                                    testId: 'instructionsRightCardDeleteBtn',
                                    slug: 'cdbAgreementsStandardInstructionsDelete',
                                    bind: {
                                        permission: '{userPermissions}',
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
                                                        container = this.find('instructionsRightCard'),
                                                        record = this.upVM().get('instructionGrid.selection');
                                                    store.remove(record);
                                                    store.sync({
                                                        success: function () {
                                                            container.hide();
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
                                                    testId: 'instructionsRightCardDeleteNoBtn',
                                                    margin: '0 8 0 0',
                                                    text: 'Cancel',
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'yes',
                                                    testId: 'instructionsRightCardDeleteYesBtn',
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
            defaults: {
                slug: 'cdbAgreementsStandardInstructions',
                bind: {
                    permission: '{userPermissions}',
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    testId: 'instructionsRightCardEnterTitleField',
                    margin: '0 24',
                    label: false,
                    placeholder: 'Enter title',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{selectedInstruction.title}',
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
                                        Ext.ComponentQuery.query('[xtype=company]')[0]
                                            .getVM()
                                            .set('newUpdate', new Date());
                                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'froalaeditor',
                    testId: 'instructionsRightCardFroalaEditorField',
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
                    },
                    listeners: {
                        'froala.blur': function (me) {
                            let record = me.upVM().get('selectedInstruction');
                            if (record.dirty && record.get('title').length > 0) {
                                record.save({
                                    success: function () {
                                        Ext.ComponentQuery.query('[xtype=company]')[0]
                                            .getVM()
                                            .set('newUpdate', new Date());
                                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
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
                            testId: 'instructionsRightCardAttachmentsList',
                            padding: '0 24 8 24',
                            margin: '0 -4',
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            slug: 'cdbAgreementsStandardInstructions',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{selectedInstruction.attachments.count ? false : true}',
                                store: '{selectedInstruction.attachments}',
                            },
                            cls: 'a-voyage-attachments',
                            itemConfig: {
                                cls: 'a-attachment-item',
                                margin: '0 4 8 4',
                                minWidth: 0,
                                layout: {
                                    type: 'hbox',
                                    pack: 'space-between',
                                },
                                viewModel: {},
                                bind: {
                                    tpl: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.document.name}.{record.document.extension}</a><span class="sm-title">{record.document.size}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>',
                                },
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'div.a-attachment,i.remove_attachment',
                                    fn: function (cmp, a) {
                                        var store = this.component.getStore();
                                        var record = this.component.getSelection(),
                                            selectedInstruction = this.component.upVM().get('selectedInstruction'),
                                            controller = this.component.find('instructionsRightCard').getController(),
                                            ids = [];
                                        if (cmp.currentTarget.className == 'a-attachment') {
                                            if (record) {
                                                var selectedFile = record.getDocument(),
                                                    documents = [];

                                                store.each(function (attachment) {
                                                    documents.push(attachment.getDocument());
                                                });

                                                Abraxa.getApplication()
                                                    .getController('AbraxaController')
                                                    .previewFile(this.component, selectedFile, documents);

                                                return;
                                            }
                                        }
                                        if (cmp.currentTarget.className.indexOf('remove_attachment') !== -1) {
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
                                                        testId: 'instructionsRightCardAttachmentsDeleteNoBtn',
                                                        margin: '0 8 0 0',
                                                        text: 'Cancel',
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'yes',
                                                        testId: 'instructionsRightCardAttachmentsDeleteYesBtn',
                                                        ui: 'decline alt',
                                                        text: 'Delete',
                                                        separator: true,
                                                    },
                                                ]
                                            );
                                        }
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'filebutton',
                            testId: 'instructionsRightCardFilesUploadBtn',
                            multiple: true,
                            margin: '0 24 8 24',
                            ui: 'normal-light medium',
                            iconCls: 'md-icon-outlined md-icon-cloud-upload',
                            ui: 'blue-light',
                            name: 'files',
                            text: 'Upload',
                            slug: 'cdbAgreementsStandardInstructions',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            listeners: {
                                change: function (me, newValue) {
                                    if (newValue) {
                                        var uploadController = me.find('instructionsRightCard').getController(),
                                            record = me.upVM().get('selectedInstruction');
                                        uploadController.uploadFiles(me, record);
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
                        hidden: '{rules.count ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'abraxa.componentdataview',
                            bind: {
                                store: '{rules}',
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
                                defaults: {
                                    slug: 'cdbAgreementsStandardInstructions',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                },
                                items: [
                                    {
                                        xtype: 'combobox',
                                        width: 220,
                                        ui: 'viewonly classic',
                                        cls: 'a-field-icon icon-filter icon-rounded',
                                        placeholder: 'Choose',
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
                                        maxWidth: 160,
                                        ui: 'classic hovered-border',
                                        cls: 'a-field-icon icon-functions icon-rounded',
                                        placeholder: 'Choose condition',
                                        testId: 'instructionsRightCardChooseConditionBtn',
                                        label: null,
                                        labelAlign: 'left',
                                        flex: 1,
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
                                        testId: 'instructionsRightCardChoosePortsBtn',
                                        bind: {
                                            value: '{record.value}',
                                            hidden: '{record.property == "port_id" ? false:true}',
                                            required: '{record.property == "port_id" ? true:false}',
                                        },
                                        listeners: {
                                            blur: function (me) {
                                                let record = me.upVM().get('record'),
                                                    organization = me.upVM().get('object_record');
                                                record.getProxy().setExtraParams({
                                                    org_id: organization.get('org_id'),
                                                    instruction_id: record.get('owner_id'),
                                                });
                                                if (record.dirty) {
                                                    record.save({
                                                        success: function () {
                                                            Ext.ComponentQuery.query('[xtype=company]')[0]
                                                                .getVM()
                                                                .set('newUpdate', new Date());
                                                            Ext.getCmp('main-viewport')
                                                                .getVM()
                                                                .get('agreements')
                                                                .reload();
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
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
                                        testId: 'instructionsRightCardChooseFunctionBtn',
                                        queryMode: 'local',
                                        valueField: 'name',
                                        displayField: 'name',
                                        multiSelect: true,
                                        forceSelection: false,
                                        hidden: true,
                                        bind: {
                                            value: '{record.value}',
                                            store: '{berthFunctions}',
                                            hidden: '{record.property == "port_function"  ? false:true}',
                                            required: '{record.property == "port_function"  ? true:false}',
                                        },
                                        listeners: {
                                            blur: function (me) {
                                                let record = me.upVM().get('record'),
                                                    organization = me.upVM().get('object_record');
                                                record.getProxy().setExtraParams({
                                                    org_id: organization.get('org_id'),
                                                    instruction_id: record.get('owner_id'),
                                                });
                                                if (record.dirty) {
                                                    record.save({
                                                        success: function () {
                                                            Ext.ComponentQuery.query('[xtype=company]')[0]
                                                                .getVM()
                                                                .set('newUpdate', new Date());
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'selectfield',
                                        flex: 1,
                                        label: null,
                                        labelAlign: 'left',
                                        multiSelect: true,
                                        forceSelection: true,
                                        queryMode: 'local',
                                        ui: 'classic hovered-border',
                                        cls: 'a-field-icon icon-short icon-rounded',
                                        placeholder: 'Choose agency type',
                                        testId: 'instructionsRightCardChooseAgencyTypeBtn',
                                        displayField: 'name',
                                        valueField: 'id',
                                        store: {
                                            type: 'agency.types',
                                        },
                                        bind: {
                                            value: '{record.value}',
                                            hidden: '{record.property == "agency_type_id"  ? false:true}',
                                            required: '{record.property == "agency_type_id"  ? true:false}',
                                        },
                                        listeners: {
                                            blur: function (me) {
                                                let record = me.upVM().get('record'),
                                                    organization = me.upVM().get('object_record');
                                                record.getProxy().setExtraParams({
                                                    org_id: organization.get('org_id'),
                                                    instruction_id: record.get('owner_id'),
                                                });
                                                if (record.dirty) {
                                                    record.save({
                                                        success: function () {
                                                            Ext.ComponentQuery.query('[xtype=company]')[0]
                                                                .getVM()
                                                                .set('newUpdate', new Date());
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        margin: '0 0 0 8',
                                        ui: 'small round tool-round',
                                        iconCls: 'md-icon-outlined md-icon-remove-circle-outline',
                                        testId: 'instructionsRightCardRemoveRowBtn',
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
                                            let store = this.upVM().get('rules'),
                                                record = this.upVM().get('record');

                                            Ext.Msg.confirm(
                                                'Delete',
                                                'Are you sure you would like to delete this row?',
                                                function (answer) {
                                                    if (answer == 'yes') {
                                                        store.remove(record);
                                                        store.sync({
                                                            success: function () {
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
                                                        testId: 'instructionsRightCardRemoveRowNoBtn',
                                                        margin: '0 8 0 0',
                                                        text: 'Cancel',
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'yes',
                                                        testId: 'instructionsRightCardRemoveRowYesBtn',
                                                        ui: 'decline alt',
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
                    xtype: 'container',
                    margin: '0 24 16 24',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add rule',
                            ui: 'normal small',
                            height: 28,
                            iconCls: 'md-icon-add',
                            slug: 'cdbAgreementsStandardInstructions',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            menu: {
                                defaults: {
                                    handler: function (btn) {
                                        let store = this.upVM().get('rules'),
                                            selectedInstruction = this.upVM().get('selectedInstruction'),
                                            record = Ext.create('Abraxa.model.cdb.InstructionRule', {
                                                owner_id: selectedInstruction.get('id'),
                                                owner_type: selectedInstruction.get('model_name'),
                                                property: btn.property,
                                                condition: 'in',
                                            });
                                        store.add(record);
                                        store.sync({
                                            success: function (err, msg) {
                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function (batch) {
                                                var response = batch.operations[0].error.response.responseJson;
                                                Ext.Msg.alert('Something went wrong', response.message);
                                            },
                                        });
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            let store = this.upVM().get('rules');
                                            me.setDisabled(false);
                                            if (store.getCount()) {
                                                record_exists = store.queryBy(function (rec, id) {
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
                                        property: 'port_id',
                                    },
                                    {
                                        text: 'Port function',
                                        property: 'port_function',
                                    },
                                    {
                                        text: 'Agency type',
                                        property: 'agency_type_id',
                                    },
                                ],
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
                    margin: '16 24 16 24',
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
    },
});

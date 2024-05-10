Ext.define('Abraxa.view.portcalls.CreatePortcall', {
    extend: 'Ext.Dialog',
    testId: 'portcallsCreatePortcall',
    xtype: 'portcalls.create.portcall',
    cls: 'a-dialog-create a-dialog-create-portcall a-dialog-has-icon',
    controller: 'portcalls-agent-create-controller',
    manageBorders: false,
    minWidth: 640,
    maxWidth: 640,
    height: '90%',
    showAnimation: 'pop',
    padding: 0,
    layout: 'vbox',
    tools: {
        back: {
            xtype: 'tool',
            margin: 0,
            ui: 'tool round',
            hidden: true,
            left: 16,
            bind: {
                hidden: '{visibleInstruction || visibleTemplates || visibleDistriGroups ? false : true}',
            },
            cls: 'backTool',
            testId: 'portcallsCreateBackTool',
            iconCls: 'md-icon-keyboard-backspace',
            handler: function (me) {
                me.down('[xtype=portcalls\\.instructions\\.container]').hide();
                me.upVM().set('visibleInstruction', false);
                me.down('[xtype=portcalls\\.template\\.container]').hide();
                me.upVM().set('visibleTemplates', false);
                me.upVM().set('visibleDistriGroups', false);
                if (me.down('[itemId=showVoyageInstructions]').getPressed()) {
                    me.down('[itemId=showVoyageInstructions]').toggle();
                }
                if (me.down('[itemId=showTemplates]').getPressed()) {
                    me.down('[itemId=showTemplates]').toggle();
                }
            },
        },
        close: {
            testId: 'portcallsCreateCloseTool',
            tooltip: {
                showOnTap: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                let dialog = this.up('dialog'),
                    record = this.upVM().get('object_record');
                if (record.phantom || record.dirty || record.cargoes().needsSync) {
                    Ext.Msg.confirm(
                        'Confirmation',
                        'Would you like to discard all changes?',
                        function (answer) {
                            if (answer == 'yes') {
                                record.cargoes().rejectChanges();
                                record.reject();
                                dialog.destroy();
                            }
                        },
                        this,
                        [
                            {
                                xtype: 'button',
                                itemId: 'no',
                                testId: 'portcallsCreateCloseConfirmNoBtn',
                                margin: '0 8 0 0',
                                text: 'Cancel',
                            },
                            {
                                xtype: 'button',
                                itemId: 'yes',
                                testId: 'portcallsCreateCloseConfirmYesBtn',
                                enableToggle: true,
                                ui: 'action loading',
                                text: 'Discard',
                            },
                        ]
                    );
                } else {
                    dialog.destroy();
                }
            },
        },
        showVoyageInstructions: {
            xtype: 'button',
            ui: 'round tool-sm toggle',
            enableToggle: true,
            text: '',
            itemId: 'showInstructionsButton',
            testId: 'portcallsCreateShowInstructionsBtn',
            slug: 'portcallVoyInstructions',
            bind: {
                hidden: '{editMode}',
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-description',
            cls: 'chameleon_create_portcall_attach_file',
            tooltip: {
                showOnTap: true,
                html: 'Voyage instructions',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            listeners: {
                tap: function (me, newValue) {
                    if (me.upVM().get('visibleInstruction')) {
                        me.up('dialog').down('[xtype=portcalls\\.instructions\\.container]').hide();
                        me.upVM().set('visibleInstruction', false);
                        if (me.getPressed()) {
                            me.toggle();
                        }
                    } else {
                        if (me.upVM().get('visibleTemplates')) {
                            me.up('dialog').down('[xtype=portcalls\\.template\\.container]').hide();
                            if (me.up('dialog').down('[itemId=showTemplates]').getPressed()) {
                                me.up('dialog').down('[itemId=showTemplates]').toggle();
                            }
                            me.upVM().set('visibleTemplates', false);
                        }
                        me.up('dialog').down('[xtype=portcalls\\.instructions\\.container]').show();
                        me.upVM().set('visibleInstruction', true);
                    }
                },
            },
        },
        attach: {
            xtype: 'filebutton',
            margin: '0 0 0 8',
            ui: 'round tool-sm toggle',
            text: '',
            slug: 'portcallCreateAttachments',
            testId: 'portcallsCreateCreateAttachmentBtn',
            bind: {
                hidden: '{editMode}',
                permission: '{userPermissions}',
            },
            accept: '.pdf,.doc,.docs,.xls,.xlsx,.txt,.zip,.jpeg,.pjpeg,.jpeg,.pjpeg,.png,.gif',
            iconCls: 'md-icon-attach-file',
            cls: 'chameleon_create_portcall_attach_file',
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
                    me.setValue(null);
                },
            },
        },
        showTemplates: {
            xtype: 'button',
            ui: 'round tool-sm toggle',
            testId: 'portcallsCreateShowTemplatesBtn',
            margin: '0 2 0 8',
            enableToggle: true,
            text: '',
            itemId: 'showTemplatesButton',
            slug: 'portcallCreateAdvanced',
            bind: {
                hidden: '{currentUserType == "principal" ? true:false}',
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-settings',
            cls: 'chameleon_create_portcall_attach_file',
            tooltip: {
                showOnTap: true,
                html: 'Advanced',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            listeners: {
                tap: function (me, newValue) {
                    let currentUserPlan = me.upVM().get('currentUserPlan');
                    if (currentUserPlan == 'starter') {
                        Ext.create('Abraxa.view.main.UpgradeDialog').show();
                        me.toggle();
                    } else {
                        if (me.upVM().get('visibleTemplates')) {
                            me.up('dialog').down('[xtype=portcalls\\.template\\.container]').hide();
                            me.upVM().set('visibleTemplates', false);
                            if (me.getPressed()) {
                                me.toggle();
                            }
                        } else {
                            if (me.upVM().get('visibleInstruction')) {
                                me.up('dialog').down('[xtype=portcalls\\.instructions\\.container]').hide();
                                if (me.up('dialog').down('[itemId=showVoyageInstructions]').getPressed()) {
                                    me.up('dialog').down('[itemId=showVoyageInstructions]').toggle();
                                }
                                me.upVM().set('visibleInstruction', false);
                            }
                            me.up('dialog').down('[xtype=portcalls\\.template\\.container]').show();
                            let templateStore = me.upVM().get('templates');
                            if (templateStore) {
                                templateStore.load();
                            }
                            me.upVM().set('visibleTemplates', true);
                        }
                    }
                },
            },
        },
    },
    draggable: false,
    maximizable: false,
    maximized: false,
    items: [
        {
            xtype: 'form.error',
            testId: 'portcallsCreateFormErrorCmp',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'container',
            zIndex: '200',
            id: 'dropped-container-create',
            cls: 'a-drop-container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    testId: 'portcallsCreateCreatePortcallForm',
                    flex: 1,
                    reference: 'createPortcallAgent',
                    cls: 'portcall_create_form',
                    scrollable: 'y',
                    layout: 'vbox',
                    defaultFocus: '[xtype=vessel\\.combo]',
                    items: [
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container a-dialog-wrap',
                            showAnimation: {
                                type: 'slide',
                                direction: 'right',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'chameleon_create_portcall_general_data a-create-general',
                                    items: [
                                        {
                                            //General data
                                            xtype: 'vessel.combo',
                                            testId: 'portcallsCreateVesselCombo',
                                            margin: '0 40 -2 0',
                                            ui: 'field-xl no-border classic',
                                            itemId: 'vesselCombo',
                                            cls: 'a-field-icon icon-search vessel_combo_create',
                                            label: false,
                                            bind: {
                                                value: '{voyage_data.vessel_imo}',
                                                inputValue: '{voyage_data.vessel_name}',
                                                disabled: '{associated ? true : false}',
                                            },
                                            listeners: {
                                                painted: function (me) {
                                                    me.focus();
                                                    var record = me.upVM().get('voyage_data');
                                                    if (record) {
                                                        if (record.get('vessel_name')) {
                                                            me.setInputValue(record.get('vessel_name'));
                                                        }
                                                    }
                                                },
                                                select: function () {
                                                    let selection = this.getSelection(),
                                                        voyage_data = this.upVM().get('voyage_data');

                                                    if (selection) {
                                                        voyage_data.set({
                                                            vessel_imo: selection.get('imo'),
                                                            vessel_name: selection.get('name'),
                                                        });
                                                        if (selection.get('company_id')) {
                                                            voyage_data.set({
                                                                custom_vessel_id: selection.get('id'),
                                                            });
                                                        } else {
                                                            voyage_data.set({
                                                                custom_vessel_id: null,
                                                            });
                                                        }
                                                    }
                                                },
                                            },
                                            required: true,
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider mt-0',
                                            html: '',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-heading',
                                            html: '<div class="a-badge a-badge-general"><i class="md-icon-outlined">edit_note</i></div><div class="fw-b ml-16">General info</div>',
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-dialog-form a-general-form',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-system-left',
                                                    flex: 1,
                                                    slug: 'portcallFileID',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            testId: 'portcallsCreateFileIDField',
                                                            label: 'File ID',
                                                            labelAlign: 'left',
                                                            ui: 'classic hovered-border',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            clearable: false,
                                                            placeholder: 'File ID',
                                                            required: true,
                                                            bind: {
                                                                disabled: '{customSequence.portcall ? true : false}',
                                                                hidden: '{currentUserType == "principal" ? true:false}',
                                                                required:
                                                                    '{currentUserType == "principal" ? false:true}',
                                                                placeholder:
                                                                    '{customSequence.portcall ? customSequence.portcall_placeholder : "File ID"}',
                                                                value: '{object_record.file_id}',
                                                            },
                                                            listeners: {
                                                                painted: function () {
                                                                    this.setError(false);
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-field-assign',
                                                    flex: 1,
                                                    layout: 'hbox',
                                                    slug: 'portcallAssignTo',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'div',
                                                            cls: 'a-assign-image',
                                                            left: 203,
                                                            bind: {
                                                                html: '{assignedToImage}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'user.combo',
                                                            flex: 1,
                                                            label: 'Assign to',
                                                            testId: 'portcallsCreateAssignToField',
                                                            placeholder: 'Choose assignee',
                                                            labelAlign: 'left',
                                                            clearable: true,
                                                            reference: 'usersCombo',
                                                            ui: 'classic hovered-border non-editable',
                                                            bind: {
                                                                cls: '{usersCombo.selection ? "a-field-icon icon-rounded":"a-field-icon icon-person icon-rounded"}',
                                                                value: '{object_record.assigned_to}',
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'abraxa.datetimefield',
                                                    label: 'ETA',
                                                    testId: 'portcallsCreateETAField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-time icon-rounded',
                                                    bind: {
                                                        dateTime: '{object_record.port_eta}',
                                                    },
                                                    required: true,
                                                    listeners: {
                                                        focusleave: function (me) {
                                                            var record = this.upVM().get('object_record');
                                                            record.set({
                                                                port_eta: me.getValue(),
                                                            });
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'port.combo',
                                                    label: 'Port',
                                                    testId: 'portcallsCreatePortField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-port icon-rounded',
                                                    required: false,
                                                    hidden: true,
                                                    placeholder: 'Choose port',
                                                    bind: {
                                                        value: '{object_record.port_id}',
                                                        hidden: '{currentUserType == "principal" ? false:true}',
                                                        required: '{currentUserType == "principal" ? true:false}',
                                                    },
                                                    listeners: {
                                                        painted: function (me) {
                                                            me.setError(false);
                                                            var record = this.upVM().get('object_record');
                                                            if (record) {
                                                                if (record.get('port_name')) {
                                                                    this.setInputValue(record.get('port_name'));
                                                                }
                                                            }
                                                        },
                                                        select: function () {
                                                            if (this.getSelection()) {
                                                                let record = this.upVM().get('object_record');
                                                                record.set(
                                                                    'port_name',
                                                                    this.getSelection().get('port_name')
                                                                );
                                                                if (this.getSelection().get('code')) {
                                                                    record.set(
                                                                        'port_code',
                                                                        this.getSelection().get('code')
                                                                    );
                                                                }
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'ports.served.combo',
                                                    label: 'Port name',
                                                    testId: 'portcallsCreatePortNameField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-port icon-rounded',
                                                    required: false,
                                                    hidden: true,
                                                    placeholder: 'Choose port',
                                                    bind: {
                                                        value: '{object_record.port_id}',
                                                        hidden: '{currentUserType == "principal" ? true:false}',
                                                        required: '{currentUserType == "principal" ? false:true}',
                                                    },
                                                    listeners: {
                                                        painted: function (me) {
                                                            me.setError(false);
                                                        },
                                                        select: function () {
                                                            if (this.getSelection()) {
                                                                let record = this.upVM().get('object_record');
                                                                record.set(
                                                                    'port_name',
                                                                    this.getSelection().get('port_name')
                                                                );
                                                                if (
                                                                    this.getSelection().get('port') &&
                                                                    this.getSelection().get('port').code
                                                                ) {
                                                                    record.set(
                                                                        'port_code',
                                                                        this.getSelection().get('port').code
                                                                    );
                                                                }
                                                            }
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider',
                                            html: '',
                                        },
                                        {
                                            xtype: 'container',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true:false}',
                                            },
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                                pack: 'space-between',
                                            },
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    bind: {
                                                        hidden: '{currentUserType == "principal" ? true:false}',
                                                    },
                                                    cls: 'a-heading',
                                                    html: '<div class="a-badge a-badge-nomination"><i class="md-icon-outlined">business_center</i></div><div class="fw-b ml-16">Nomination info</div>',
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-dialog-form a-general-form',
                                            items: [
                                                {
                                                    //hidden for principal
                                                    xtype: 'organization.combo',
                                                    label: 'Appointing party',
                                                    testId: 'portcallsCreateAppointingPartyField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                                    placeholder: 'Choose Company',
                                                    required: true,
                                                    hidden: false,
                                                    floatedPicker: {
                                                        minWidth: 308,
                                                    },
                                                    bind: {
                                                        value: '{nomination.appointing_party_id}',
                                                        inputValue: '{nomination.appointing_party_name}',
                                                        hidden: '{currentUserType == "principal" ? true:false}',
                                                        required: '{currentUserType == "principal" ? false:true}',
                                                    },
                                                    listeners: {
                                                        select: function () {
                                                            let selection = this.getSelection(),
                                                                record = this.upVM().get('nomination');
                                                            record.set(
                                                                'appointing_party_name',
                                                                selection.get('org_name')
                                                            );
                                                            record.set(
                                                                'appointing_party_email',
                                                                selection.get('org_email')
                                                            );
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    labelAlign: 'left',
                                                    slug: 'portcallNominationVoyageNumber',
                                                    label: 'Voy. number',
                                                    testId: 'portcallsCreateVoyNumField',
                                                    placeholder: 'Voyage number',
                                                    bind: {
                                                        value: '{nomination.voyage_number}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'organization.combo',
                                                    label: 'Nominating party',
                                                    testId: 'portcallsCreateNomPartyField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                                    placeholder: 'Choose Company',
                                                    required: true,
                                                    floatedPicker: {
                                                        minWidth: 308,
                                                    },
                                                    bind: {
                                                        value: '{nomination.nominating_party_id}',
                                                        inputValue: '{nomination.nominating_party_name}',
                                                        hidden: '{currentUserType == "principal" ? true:false}',
                                                        required: '{currentUserType == "principal" ? false:true}',
                                                    },
                                                    listeners: {
                                                        select: function () {
                                                            let selection = this.getSelection(),
                                                                record = this.upVM().get('nomination');
                                                            record.set(
                                                                'nominating_party_name',
                                                                selection.get('org_name')
                                                            );
                                                            record.set(
                                                                'nominating_party_email',
                                                                selection.get('org_email')
                                                            );
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Nomination reference',
                                                    testId: 'portcallsCreateNomRefField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    clearable: false,
                                                    slug: 'portcallNominationReference',
                                                    placeholder: 'Nomination reference',
                                                    bind: {
                                                        value: '{nomination.nomination_reference}',
                                                        hidden: '{currentUserType == "principal" ? true:false}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                                {
                                                    xtype: 'abraxa.datetimefield',
                                                    label: 'Date received',
                                                    testId: 'portcallsCreateDateReceivedField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-time icon-rounded',
                                                    slug: 'portcallNominationDateReceived',
                                                    bind: {
                                                        dateTime: '{nomination.date_received}',
                                                        hidden: '{currentUserType == "principal" ? true:false}',
                                                        permission: '{userPermissions}',
                                                    },
                                                    listeners: {
                                                        focusleave: function (me) {
                                                            var record = this.upVM().get('nomination');
                                                            record.set({
                                                                date_received: me.getValue(),
                                                            });
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'Port function',
                                                    testId: 'portcallsCreatePortFnField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    required: true,
                                                    forceSelection: true,
                                                    placeholder: 'Function',
                                                    queryMode: 'local',
                                                    valueField: 'name',
                                                    displayField: 'name',
                                                    bind: {
                                                        value: '{nomination.port_function}',
                                                    },
                                                    store: {
                                                        type: 'berth.function',
                                                    },
                                                },
                                                {
                                                    xtype: 'selectfield',
                                                    label: 'Agency type',
                                                    testId: 'portcallsCreateAgencyTypeField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    placeholder: 'Choose agency type',
                                                    valueField: 'id',
                                                    displayField: 'name',
                                                    autoFocus: false,
                                                    disabled: false,
                                                    required: true,
                                                    store: {
                                                        type: 'agency.types',
                                                    },
                                                    bind: {
                                                        value: '{nomination.agency_type_id}',
                                                    },
                                                    listeners: {
                                                        select: function () {
                                                            let selection = this.getSelection(),
                                                                record = this.upVM().get('nomination');
                                                            record.set('agency_type_name', selection.get('name'));
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'container',
                                                    flex: 1,
                                                    bind: {
                                                        hidden: '{currentUserType == "principal" ? true:false}',
                                                    },
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'middle',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'selectfield',
                                                            label: 'My role',
                                                            testId: 'portcallsCreateMyRoleField',
                                                            labelAlign: 'left',
                                                            ui: 'classic hovered-border',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            autoFocus: false,
                                                            disabled: false,
                                                            slug: 'portcallNominationAgencyStructure',
                                                            flex: 1,
                                                            options: [
                                                                {
                                                                    value: 'lead agent',
                                                                    text: 'Lead agent',
                                                                },
                                                                {
                                                                    value: 'sub agent',
                                                                    text: 'Sub agent',
                                                                },
                                                            ],
                                                            bind: {
                                                                value: '{nomination.company_role}',
                                                                permission: '{userPermissions}',
                                                            },
                                                            listeners: {
                                                                select: function (me, selection) {
                                                                    if (selection.get('value') == 'sub agent') {
                                                                        let nomination = me.upVM().get('nomination'),
                                                                            company = me
                                                                                .upVM()
                                                                                .get('currentUser')
                                                                                .getCompany();

                                                                        nomination.set('lead_agent_id', null);
                                                                        nomination.set('lead_agent_name', null);
                                                                        nomination.set('lead_agent_email', null);
                                                                        nomination.set(
                                                                            'sub_agent_id',
                                                                            company.get('id')
                                                                        );
                                                                        nomination.set(
                                                                            'sub_agent_name',
                                                                            company.get('name')
                                                                        );
                                                                        nomination.set(
                                                                            'sub_agent_email',
                                                                            company.get('email')
                                                                        );
                                                                        Ext.ComponentQuery.query(
                                                                            '[cls~=use_sub_agent]'
                                                                        )[0].setChecked(true);
                                                                    } else {
                                                                        let nomination = me.upVM().get('nomination'),
                                                                            company = me
                                                                                .upVM()
                                                                                .get('currentUser')
                                                                                .getCompany();

                                                                        nomination.set('sub_agent_id', null);
                                                                        nomination.set('sub_agent_name', null);
                                                                        nomination.set('sub_agent_email', null);
                                                                        nomination.set(
                                                                            'lead_agent_id',
                                                                            company.get('id')
                                                                        );
                                                                        nomination.set(
                                                                            'lead_agent_name',
                                                                            company.get('name')
                                                                        );
                                                                        nomination.set(
                                                                            'lead_agent_email',
                                                                            company.get('email')
                                                                        );
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'checkbox',
                                                            cls: 'use_sub_agent',
                                                            margin: '0 0 0 16',
                                                            labelAlign: 'right',
                                                            label: 'Sub agent',
                                                            testId: 'portcallsCreateSubAgentCheckbox',
                                                            labelCls: 'ml-8',
                                                            labelWidth: 78,
                                                            labelMinWidth: 78,
                                                            slug: 'portcallNominationAgencyStructure',
                                                            bind: {
                                                                disabled: '{nomination.company_role == "sub agent"}',
                                                                permission: '{userPermissions}',
                                                            },
                                                            listeners: {
                                                                check: function (me) {
                                                                    me.upVM().set('hubStructure', true);
                                                                },
                                                                uncheck: function (me) {
                                                                    me.upVM().set('hubStructure', false);
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'organization.combo',
                                                    label: 'Lead agent',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-business-center icon-rounded',
                                                    placeholder: 'Choose Company',
                                                    testId: 'portcallsCreateLeadAgentField',
                                                    // hidden: true,
                                                    // required: true,
                                                    bind: {
                                                        value: '{nomination.lead_agent_id}',
                                                        inputValue: '{nomination.lead_agent_name}',
                                                        hidden: '{hubStructure && nomination.company_role != "lead agent" ? false:true}',
                                                        required: '{currentUserType == "principal" ? true:false}',
                                                    },
                                                    floatedPicker: {
                                                        minWidth: 308,
                                                        viewModel: {
                                                            data: {
                                                                showSuggested: true,
                                                            },
                                                        },
                                                        listeners: {
                                                            select: function () {
                                                                let selection = this.getSelection(),
                                                                    record = this.upVM().get('nomination');
                                                                record.set(
                                                                    'lead_agent_name',
                                                                    selection.get('org_name')
                                                                );
                                                                record.set(
                                                                    'lead_agent_email',
                                                                    selection.get('org_email')
                                                                );
                                                            },
                                                        },
                                                    },
                                                    listeners: {
                                                        painted: function (me) {
                                                            me.setError(false);
                                                        },
                                                        show: function (me) {
                                                            me.setError(false);
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'organization.combo',
                                                    label: 'Sub agent',
                                                    testId: 'portcallsCreateSubAgentField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-business-center icon-rounded sub_agent',
                                                    placeholder: 'Choose Company',
                                                    hidden: true,
                                                    slug: 'portcallNominationAgencyStructure',
                                                    floatedPicker: {
                                                        viewModel: {
                                                            data: {
                                                                showSuggested: true,
                                                            },
                                                        },
                                                    },
                                                    bind: {
                                                        value: '{nomination.sub_agent_id}',
                                                        inputValue: '{nomination.sub_agent_name}',
                                                        hidden: '{hubStructure && nomination.company_role != "sub agent" ? false:true}',
                                                        required:
                                                            '{(hubStructure && currentUserType != "principal"  && nomination.company_role != "sub agent" ) ? true : false}',
                                                        permission: '{userPermissions}',
                                                    },
                                                    listeners: {
                                                        painted: function (me) {
                                                            me.setError(false);
                                                        },
                                                        show: function (me) {
                                                            me.setError(false);
                                                        },
                                                    },
                                                    floatedPicker: {
                                                        minWidth: 308,
                                                        listeners: {
                                                            select: function () {
                                                                let selection = this.getSelection(),
                                                                    record = this.upVM().get('nomination');
                                                                record.set('sub_agent_name', selection.get('org_name'));
                                                                record.set(
                                                                    'sub_agent_email',
                                                                    selection.get('org_email')
                                                                );
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Hub reference',
                                                    testId: 'portcallsCreateHubRefField',
                                                    labelAlign: 'left',
                                                    ui: 'classic hovered-border',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    clearable: false,
                                                    placeholder: 'Hub reference',
                                                    hidden: true,
                                                    slug: 'portcallNominationAgencyStructure',
                                                    bind: {
                                                        value: '{nomination.hub_reference}',
                                                        hidden: '{(hubStructure && currentUserType != "principal") ? false:true}',
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                            ], //End general data
                                        },
                                        {
                                            // Cargo data
                                            xtype: 'container',
                                            cls: 'a-dialog-form-list',
                                            items: [
                                                {
                                                    xtype: 'abraxa.formlist',
                                                    scrollable: false,
                                                    itemId: 'createCargo',
                                                    testId: 'portcallsCreateCargoList',
                                                    variableHeights: true,
                                                    bind: {
                                                        store: {
                                                            bindTo: '{object_record.cargoes}',
                                                            deep: true,
                                                        },
                                                    },
                                                    itemConfig: {
                                                        xtype: 'container',
                                                        cls: 'cargoData a-cargo-item',
                                                        testId: 'cargoContainer',
                                                        viewModel: {
                                                            data: {
                                                                showReceiver: true, // Means false it is reversely mistaken everywhere, true means false for show Receiver and vice versa. Must correct carefully
                                                            },
                                                            formulas: {
                                                                recordIndex: function recordIndex(get) {
                                                                    var store = get('object_record.cargoes');
                                                                    if (store) {
                                                                        return store.indexOf(get('record'));
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'container',
                                                                items: [
                                                                    {
                                                                        xtype: 'container',
                                                                        cls: 'a-titlebar',
                                                                        items: [
                                                                            {
                                                                                xtype: 'title',
                                                                                cls: 'a-title-md',
                                                                                margin: '0 0 0 -8',
                                                                                bind: {
                                                                                    title: "<span class='a-cargo-title'>Cargo {recordIndex + 1}</span>",
                                                                                },
                                                                            },
                                                                            {
                                                                                xtype: 'container',
                                                                                margin: '0 -16 0 0',
                                                                                cls: 'a-tools',
                                                                                items: [
                                                                                    {
                                                                                        xtype: 'button',
                                                                                        iconCls: 'md-icon-close',
                                                                                        ui: 'round tool-sm',
                                                                                        arrow: false,
                                                                                        testId: 'portcallsCreateCargoRemoveBtn',
                                                                                        slug: 'portcallCargoDelete',
                                                                                        bind: {
                                                                                            permission:
                                                                                                '{userPermissions}',
                                                                                        },
                                                                                        tooltip: {
                                                                                            showOnTap: true,
                                                                                            html: 'Remove',
                                                                                            align: 'bc-tc?',
                                                                                            showDelay: 0,
                                                                                            hideDelay: 0,
                                                                                            dismissDelay: 0,
                                                                                            allowOver: false,
                                                                                            closeAction: 'destroy',
                                                                                        },
                                                                                        handler: function handler(me) {
                                                                                            me.up('dialog')
                                                                                                .down(
                                                                                                    '[itemId=createCargo]'
                                                                                                )
                                                                                                .getStore()
                                                                                                .remove(
                                                                                                    this.upVM().get(
                                                                                                        'record'
                                                                                                    )
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
                                                                cls: 'a-cargo-form',
                                                                defaults: {
                                                                    labelAlign: 'left',
                                                                    ui: 'classic hovered-border',
                                                                },
                                                                items: [
                                                                    {
                                                                        xtype: 'unit.field',
                                                                        testId: 'portcallsCreateQuantityField',
                                                                        decimals: 3,
                                                                        placeholder: '0000.00',
                                                                        required: true,
                                                                        slug: 'portcallCargoGeneral',
                                                                        cls: 'a-field-icon icon-short icon-rounded',
                                                                        label: 'Quantity',
                                                                        bind: {
                                                                            value: '{record.quantity}',
                                                                            valueUnit: '{record.unit}',
                                                                            disabled:
                                                                                '{object_record.parent_id ? true : false}',
                                                                            permission: '{userPermissions}',
                                                                            options: '{defaultCargoUnits}',
                                                                        },
                                                                    },
                                                                    {
                                                                        xtype: 'commodity.combo',
                                                                        label: 'Commodity',
                                                                        testId: 'portcallsCreateComodityField',
                                                                        required: true,
                                                                        clearable: true,
                                                                        valueField: 'id',
                                                                        displayField: 'name',
                                                                        placeholder: 'Choose commodity',
                                                                        cls: 'a-field-icon icon-short icon-rounded',
                                                                        slug: 'portcallCargoGeneral',
                                                                        floatedPicker: {
                                                                            minWidth: 220,
                                                                        },
                                                                        triggers: {
                                                                            search: null,
                                                                        },
                                                                        bind: {
                                                                            value: '{record.commodity_id}',
                                                                            permission: '{userPermissions}',
                                                                        },
                                                                        listeners: {
                                                                            change: function (combo, value, eOpts) {
                                                                                if (value && value != '') {
                                                                                    // All cargoes as cargoes array
                                                                                    var allCargoesRecord = combo
                                                                                        .upVM()
                                                                                        .get('record');
                                                                                    var selection =
                                                                                        combo.getSelection();
                                                                                    if (selection) {
                                                                                        var commodity_name =
                                                                                            selection.get('name');
                                                                                        allCargoesRecord.set(
                                                                                            'commodity',
                                                                                            commodity_name
                                                                                        );
                                                                                    }
                                                                                }
                                                                            },
                                                                            painted: function () {
                                                                                let record = this.upVM().get('record');

                                                                                if (record.get('commodity')) {
                                                                                    this.setInputValue(
                                                                                        record.get('commodity')
                                                                                    );
                                                                                }
                                                                            },
                                                                        },
                                                                    },
                                                                    {
                                                                        xtype: 'selectfield',
                                                                        valueField: 'name',
                                                                        displayField: 'name',
                                                                        queryMode: 'local',
                                                                        placeholder: 'Choose operation',
                                                                        testId: 'portcallsChooseOperationField',
                                                                        required: true,
                                                                        cls: 'a-field-icon icon-short icon-rounded non-editable',
                                                                        label: 'Operation',
                                                                        slug: 'portcallCargoGeneral',
                                                                        bind: {
                                                                            value: '{record.function}',
                                                                            permission: '{userPermissions}',
                                                                        },
                                                                        options: [
                                                                            'Loading',
                                                                            'Discharging',
                                                                            'Transshipment',
                                                                            'Lightering',
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    xtype: 'button',
                                                    margin: '8 0 8 32',
                                                    testId: 'portcallsCreatePortcallAddCargo',
                                                    text: 'Cargo',
                                                    itemId: 'create-add-cargo',
                                                    ui: 'normal small',
                                                    slug: 'portcallAppointmentCargo',
                                                    iconCls: 'md-icon-add',
                                                    cls: 'chameleong_create_portcall_add_cargo',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                    },
                                                    handler: function handler(me) {
                                                        mixpanel.track('Add cargo - create portcall');
                                                        const createCargo = me
                                                            .up('dialog')
                                                            .down('[itemId=createCargo]');
                                                        const store = createCargo ? createCargo.getStore() : null;
                                                        if (store) {
                                                            store.add({});
                                                        } else {
                                                            Ext.Msg.warning(
                                                                ' Oops, Something went wrong.',
                                                                'Please refresh the page.'
                                                            );
                                                        }
                                                    },
                                                },
                                            ], // End cargo data
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                //Attachments data
                {
                    xtype: 'portcalls.attachment.container',
                },
                //End attachments data
                //Instructions data
                {
                    xtype: 'portcalls.instructions.container',
                },
                //End instructions data
                //Templates
                {
                    xtype: 'portcalls.template.container',
                },
                //End template
            ],
            bind: {
                listeners: '{dragListeners}',
            },
        },
    ],
    bbar: {
        items: [
            {
                xtype: 'notes.notify',
                viewModel: {
                    data: {
                        editMode: true,
                    },
                },
            },
            {
                enableToggle: true,
                ui: 'action loading',
                cls: 'chameleon_create_portcall_create_save',
                testId: 'createPortcallSaveButton',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                    hidden: '{visibleInstruction || visibleTemplates ? true:false}',
                },
                handler: function (me) {
                    me.up('dialog').getController().onCreate(me, false);
                },
            },
        ],
    },
    listeners: {
        destroy: function (me) {
            let record = me.upVM().get('object_record'),
                editMode = me.upVM().get('editMode');
            if (editMode && record) {
                record.reject();
                record.cargoes().rejectChanges();
            }
        },
    },
});

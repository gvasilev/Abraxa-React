Ext.define('Abraxa.view.mail.SendmailEditor', {
    extend: 'Ext.form.Panel',
    manageBorders: false,
    xtype: 'sendmail-editor',
    cls: 'sendmail-editor a-mail-editor',
    testId: 'sendMailEditor',
    bodyPadding: 0,
    flex: 1,
    title: '<span class="pl-8">New email</span>',
    tools: {
        maximize: {
            tooltip: {
                anchorToTarget: true,
                html: 'Maximize',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                this.up('dialog').maximize(null);
                Ext.ComponentQuery.query('[cls=mail-restore-tool]')[0].show();
                this.up('dialog').setStyle('border-radius: 0;');
                this.hide();
            },
            cls: 'mail-maximize-tool',
        },
        restore: {
            tooltip: {
                anchorToTarget: true,
                html: 'Restore',
                testId: 'sendMailEditorRestoreTooltip',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                this.up('dialog').restore(null);
                Ext.ComponentQuery.query('[cls=mail-maximize-tool]')[0].show();
                this.up('dialog').setStyle('border-radius: 5px;');
                this.hide();
            },
            cls: 'mail-restore-tool',
        },
        close: {
            tooltip: {
                anchorToTarget: true,
                html: 'Close',
                testId: 'sendMailEditorCloseTooltip',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
    weighted: true,
    items: [
        {
            xtype: 'container',
            cls: 'a-mail-toolbar',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-mail-toolbar-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-mail-label',
                            width: 78,
                            // hidden: false,
                            // hideMode: 'opacity',
                            // bind: {
                            //     hidden: '{currentCompany.custom_email_server ? false:true}',
                            // },
                            html: 'From:',
                        },
                        {
                            xtype: 'div',
                            bind: {
                                hidden: '{currentCompany.custom_email_server ? true:false}',
                            },
                            html: 'no-reply@abraxa.com',
                        },
                        {
                            xtype: 'combobox',
                            testId: 'sendMailEditorEmailServerField',
                            padding: '0 12 0 0',
                            flex: 2,
                            cls: '',
                            label: '',
                            displayField: 'email',
                            valueField: 'id',
                            queryMode: 'local',
                            name: 'mail_from',
                            editable: false,
                            cls: 'non-editable',
                            hideMode: 'opacity',
                            hidden: false,
                            bind: {
                                store: '{emailSettings}',
                                hidden: '{currentCompany.custom_email_server ? false:true}',
                            },
                            listeners: {
                                painted: function (me) {
                                    let store = me.getStore();
                                    if (store) {
                                        let value = true;
                                        // if (me.upVM().get('currentUser').get('current_office_id')) {
                                        //     value = 1;
                                        // }
                                        let defaultRecord = store.findRecord('is_default', value, false, false, true);
                                        if (defaultRecord) {
                                            me.setValue(defaultRecord.get('id'));
                                        }
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'sendmail-signature-combo',
                            testId: 'sendMailEditorSignatureField',
                            width: 268,
                            margin: '0 12 0 0',
                            padding: '5 0 5 12',
                            style: 'border-left: 1px solid #e9ecef;',
                            clearable: true,
                            listeners: {
                                select: function (item, rec) {
                                    if (rec.get('signature')) {
                                        item.upVM().set('signature', rec.get('signature'));
                                    }
                                },
                                clearicontap: function (item) {
                                    item.upVM().set('signature', '');
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-mail-toolbar-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-mail-label',
                            width: 72,
                            html: 'To:',
                        },
                        {
                            xtype: 'common-distribution-email-combo',
                            testId: 'sendMailEditorSelectedEmailsField',
                            cls: 'a-mail-recipients',
                            flex: 1,
                            multiSelect: true,
                            selectOnTab: true,
                            itemId: 'selectedEmails',
                            required: true,
                            autoComplete: false,
                            name: 'mail_to',
                            minChars: 1,
                            label: '',
                            placeholder: 'Enter email or company',
                            bind: {
                                store: '{companiesWithContacts}',
                            },
                        },
                        {
                            xtype: 'button',
                            testId: 'sendMailEditorChooseDistroField',
                            ui: 'normal',
                            margin: '0 4',
                            iconCls: 'md-icon-outlined md-icon-group-add',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Choose distribution group',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            menu: {
                                cls: 'filter-menu a-distribution-menu',
                                testId: 'sendMailEditorChooseDistroMenu',
                                minWidth: '220',
                                listeners: {
                                    painted: function (me) {
                                        let store = me.upVM().get('distribution_groups'),
                                            data = store.getData().getRange(),
                                            items = [];
                                        Ext.each(data, function (value) {
                                            let item = {
                                                xtype: 'menuitem',
                                                testId: 'sendMailEditorChooseDistroMenuItem',
                                                cls: 'a-distribution-menu-item',
                                                html:
                                                    '<div class="hbox"><div class="a-badge a-badge-distribution"><i class="md-icon-outlined md-icon-group"></i></div>' +
                                                    value.get('name') +
                                                    '</div>',
                                                record: value,
                                                handler: function (me) {
                                                    let combo = me.up('dialog').down('[itemId=selectedEmails]'),
                                                        subjectField = me.up('dialog').down('[itemId=emailSubject]'),
                                                        record = me.getRecord();
                                                    if (combo.getValue()) {
                                                        Ext.Msg.confirm(
                                                            '<div class="hbox"><div class="a-badge a-badge-warning mr-16 my-8"><i class="material-icons-outlined">report_problem</i></div>Warning</div>',
                                                            'Applying the selected group will discard your<br>current recipients!<br><br>' +
                                                                '<b>Would you like to apply the distribution group?</b>',
                                                            function (answer) {
                                                                if (answer == 'yes') {
                                                                    combo.setValue(record.get('dist_emails'));
                                                                    subjectField.setValue(record.get('email_subject'));
                                                                }
                                                            },
                                                            this,
                                                            [
                                                                {
                                                                    xtype: 'button',
                                                                    itemId: 'no',
                                                                    testId: 'sendMailEditorChooseDistroMenuConfirmNoBtn',
                                                                    margin: '0 8 0 0',
                                                                    text: 'Cancel',
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    itemId: 'yes',
                                                                    testId: 'sendMailEditorChooseDistroMenuConfirmYesBtn',
                                                                    ui: 'action alt',
                                                                    text: 'OK',
                                                                    separator: true,
                                                                },
                                                            ]
                                                        );
                                                    } else {
                                                        combo.setValue(record.get('dist_emails'));
                                                        subjectField.setValue(record.get('email_subject'));
                                                    }
                                                },
                                            };
                                            items.push(item);
                                        });
                                        let item = {
                                            xtype: 'button',
                                            margin: '8 0 0 0',
                                            iconCls: 'md-icon-add',
                                            ui: 'normal small',
                                            text: 'Add group',
                                            testId: 'sendMailEditorChooseDistroMenuAddGroupBtn',
                                            // slug: 'reportAddDistributionGroup',
                                            // bind: {
                                            //     permission: '{userPermissions}',
                                            // },
                                            handler: function (me) {
                                                let object_record = me.upVM().get('object_record');
                                                Ext.create('Abraxa.view.mail.AddEditDistributionGroup', {
                                                    viewModel: {
                                                        parent: me.upVM(),
                                                        data: {
                                                            title: 'Create distribution group',
                                                            editMode: false,
                                                            fromPortcall: false,
                                                            record: Ext.create(
                                                                'Abraxa.model.distributionGroup.DistributionGroup',
                                                                {
                                                                    distributable_type: object_record.get('model_name'),
                                                                    distributable_id: object_record.get('id'),
                                                                    dist_emails: null,
                                                                }
                                                            ),
                                                        },
                                                    },
                                                }).show();
                                            },
                                        };
                                        items.push(item);
                                        me.setItems(items);
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            margin: '0 8',
                            cls: 'a-sep',
                        },
                        {
                            xtype: 'button',
                            text: 'Cc',
                            testId: 'sendMailEditorCCBtn',
                            ui: 'tool toggle',
                            enableToggle: true,
                            margin: '0 4',
                            handler: function () {
                                var container = Ext.ComponentQuery.query('container[cls~=reporting_cc_container]');
                                if (container[0].isVisible()) {
                                    container[0].hide();
                                } else {
                                    container[0].show();
                                }
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Bcc',
                            testId: 'sendMailEditorBCCBtn',
                            ui: 'tool toggle',
                            enableToggle: true,
                            margin: '0 16 0 4',
                            handler: function () {
                                var container = Ext.ComponentQuery.query('container[cls~=reporting_bcc_container]');
                                if (container[0].isVisible()) {
                                    container[0].hide();
                                } else {
                                    container[0].show();
                                }
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'cc-container a-mail-toolbar-row reporting_cc_container',
                    hidden: true,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-mail-label',
                            width: 72,
                            html: 'Cc:',
                        },
                        {
                            xtype: 'common-distribution-email-combo',
                            testId: 'sendMailEditorMailCCField',
                            selectOnTab: true,
                            flex: 1,
                            multiSelect: true,
                            name: 'mail_cc',
                            autoComplete: false,
                            itemId: 'mailCCfield',
                            placeholder: 'Enter email or company',
                            cls: '',
                            label: '',
                            bind: {
                                store: '{companiesWithContacts}',
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'normal',
                            testId: 'sendMailEditorChooseDistroMenuBtn',
                            margin: '0 16',
                            iconCls: 'md-icon-outlined md-icon-group-add',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Choose distribution group',
                                testId: 'sendMailEditorChooseDistroMenuTooltip',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            menu: {
                                cls: 'filter-menu',
                                testId: 'sendMailEditorChooseDistroFilterMenu',
                                minWidth: '220',
                                listeners: {
                                    painted: function (me) {
                                        let store = me.upVM().get('distribution_groups'),
                                            data = store.getData().getRange(),
                                            items = [];
                                        Ext.each(data, function (value) {
                                            let item = {
                                                xtype: 'menuitem',
                                                text: value.get('name'),
                                                record: value,
                                                handler: function (me) {
                                                    let combo = me.up('dialog').down('[itemId=mailCCfield]'),
                                                        subjectField = me.up('dialog').down('[itemId=emailSubject]'),
                                                        record = me.getRecord();
                                                    if (combo.getValue()) {
                                                        Ext.Msg.confirm(
                                                            '<div class="hbox"><div class="a-badge a-badge-warning mr-16 my-8"><i class="material-icons-outlined">report_problem</i></div>Warning</div>',
                                                            'Applying the selected group will discard your<br>current recipients!<br><br>' +
                                                                '<b>Would you like to apply the distribution group?</b>',
                                                            function (answer) {
                                                                if (answer == 'yes') {
                                                                    combo.setValue(record.get('dist_emails'));
                                                                    subjectField.setValue(record.get('email_subject'));
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
                                                                    ui: 'action alt',
                                                                    text: 'OK',
                                                                    separator: true,
                                                                },
                                                            ]
                                                        );
                                                    } else {
                                                        combo.setValue(record.get('dist_emails'));
                                                        subjectField.setValue(record.get('email_subject'));
                                                    }
                                                },
                                            };
                                            items.push(item);
                                        });
                                        let item = {
                                            xtype: 'button',
                                            margin: '8 0 0 0',
                                            iconCls: 'md-icon-add',
                                            ui: 'normal small',
                                            text: 'Add group',
                                            testId: 'sendMailEditorAddGroupBtn',
                                            // slug: 'reportAddDistributionGroup',
                                            // bind: {
                                            //     permission: '{userPermissions}',
                                            // },
                                            handler: function (me) {
                                                let object_record = me.upVM().get('object_record');
                                                Ext.create('Abraxa.view.mail.AddEditDistributionGroup', {
                                                    viewModel: {
                                                        parent: me.upVM(),
                                                        data: {
                                                            title: 'Create distribution group',
                                                            editMode: false,
                                                            fromPortcall: false,
                                                            record: Ext.create(
                                                                'Abraxa.model.distributionGroup.DistributionGroup',
                                                                {
                                                                    distributable_type: object_record.get('model_name'),
                                                                    distributable_id: object_record.get('id'),
                                                                    dist_emails: null,
                                                                }
                                                            ),
                                                        },
                                                    },
                                                }).show();
                                            },
                                        };
                                        items.push(item);
                                        me.setItems(items);
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'bcc-container a-mail-toolbar-row reporting_bcc_container',
                    hidden: true,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-mail-label',
                            width: 72,
                            html: 'Bcc:',
                        },
                        {
                            xtype: 'common-distribution-email-combo',
                            selectOnTab: true,
                            flex: 1,
                            name: 'mail_bcc',
                            autoComplete: false,
                            itemId: 'mailBccField',
                            testId: 'sendMailEditorMailBCCField',
                            placeholder: 'Enter email or company:',
                            cls: '',
                            label: '',
                            bind: {
                                store: '{companiesWithContacts}',
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'normal',
                            margin: '0 16',
                            testId: 'sendMailEditorChooseDistroGroupBtn',
                            iconCls: 'md-icon-outlined md-icon-group-add',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Choose distribution group',
                                testId: 'sendMailEditorChooseDistroGroupBtnTooltip',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            menu: {
                                cls: 'filter-menu',
                                minWidth: '220',
                                testId: 'sendMailEditorChooseDistroGroupBtnMenu',
                                listeners: {
                                    painted: function (me) {
                                        let store = me.upVM().get('distribution_groups'),
                                            data = store.getData().getRange(),
                                            items = [];
                                        Ext.each(data, function (value) {
                                            let item = {
                                                xtype: 'menuitem',
                                                text: value.get('name'),
                                                record: value,
                                                handler: function (me) {
                                                    let combo = me.up('dialog').down('[itemId=mailBccField]'),
                                                        subjectField = me.up('dialog').down('[itemId=emailSubject]'),
                                                        record = me.getRecord();
                                                    if (combo.getValue()) {
                                                        Ext.Msg.confirm(
                                                            '<div class="hbox"><div class="a-badge a-badge-warning mr-16 my-8"><i class="material-icons-outlined">report_problem</i></div>Warning</div>',
                                                            'Applying the selected group will discard your<br>current recipients!<br><br>' +
                                                                '<b>Would you like to apply the distribution group?</b>',
                                                            function (answer) {
                                                                if (answer == 'yes') {
                                                                    combo.setValue(record.get('dist_emails'));
                                                                    subjectField.setValue(record.get('email_subject'));
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
                                                                    ui: 'action alt',
                                                                    text: 'OK',
                                                                    separator: true,
                                                                },
                                                            ]
                                                        );
                                                    } else {
                                                        combo.setValue(record.get('dist_emails'));
                                                        subjectField.setValue(record.get('email_subject'));
                                                    }
                                                },
                                            };
                                            items.push(item);
                                        });
                                        let item = {
                                            xtype: 'button',
                                            margin: '8 0 0 0',
                                            iconCls: 'md-icon-add',
                                            ui: 'normal small',
                                            text: 'Add group',
                                            testId: 'sendMailEditorAddGroupSmallBtn',
                                            // slug: 'reportAddDistributionGroup',
                                            // bind: {
                                            //     permission: '{userPermissions}',
                                            // },
                                            handler: function (me) {
                                                let object_record = me.upVM().get('object_record');
                                                Ext.create('Abraxa.view.mail.AddEditDistributionGroup', {
                                                    viewModel: {
                                                        parent: me.upVM(),
                                                        data: {
                                                            title: 'Create distribution group',
                                                            editMode: false,
                                                            fromPortcall: false,
                                                            record: Ext.create(
                                                                'Abraxa.model.distributionGroup.DistributionGroup',
                                                                {
                                                                    distributable_type: object_record.get('model_name'),
                                                                    distributable_id: object_record.get('id'),
                                                                    dist_emails: null,
                                                                }
                                                            ),
                                                        },
                                                    },
                                                }).show();
                                            },
                                        };
                                        items.push(item);
                                        me.setItems(items);
                                    },
                                },
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            docked: 'top',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            cls: 'a-mail-toolbar-row',
            items: [
                {
                    xtype: 'container',
                    padding: '0 24',
                    flex: 8,
                    style: 'border-right: 1px solid #e9ecef; height: 100%',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            testId: 'sendMailEditorSubjectField',
                            cls: 'a-mail-subject',
                            placeholder: 'Subject',
                            clearable: false,
                            required: true,
                            flex: 1,
                            itemId: 'emailSubject',
                            name: 'mail_subject',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '6 12',
                    // flex: 4,
                    width: 280,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'sendmail-template-combo',
                            testId: 'sendMailEditorSubjectTemplateCombo',
                            name: 'template_id',
                            clearable: true,
                            bind: {
                                hidden: '{object_id == 6 ? true:false}',
                            },
                            listeners: {
                                select: function (item, rec) {
                                    let froalaEditor = item.up('dialog').down('[xtype=froalaeditorfield]'),
                                        subjectField = item.up('dialog').down('[itemId=emailSubject]');
                                    mixpanel.track('Template dropdown - reporting');
                                    if (rec.get('is_editable')) {
                                        froalaEditor.setValue('');
                                        this.upVM().set('htmlTemplate', true);
                                        this.upVM().set('template_html', rec.get('html'));
                                        // froalaEditor.setDisabled(false);
                                    }
                                    if (rec.get('subject')) {
                                        subjectField.setValue(rec.get('subject'));
                                    }
                                },
                                clearicontap: function () {
                                    let froalaEditor = this.up('dialog').down('[xtype=froalaeditorfield]'),
                                        subjectField = this.up('dialog').down('[itemId=emailSubject]');

                                    this.upVM().set('htmlTemplate', false);
                                    this.upVM().set('template_html', null);
                                    froalaEditor.setHtml('');
                                    subjectField.clearValue();
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round default',
                            testId: 'sendMailEditorSubjectTemplateRenameDeleteBtn',
                            iconCls: 'md-icon-more-horiz',
                            width: 34,
                            hidden: true,
                            arrow: false,
                            bind: {
                                hidden: '{selectedTemplate.value ? false : true}',
                            },
                            menuAlign: 'tr-br?',
                            menu: {
                                items: [
                                    {
                                        testId: 'sendMailEditorSubjectTemplateRenameMenuItem',
                                        text: 'Rename',
                                    },
                                    {
                                        testId: 'sendMailEditorSubjectTemplateDeleteMenuItem',
                                        text: 'Delete',
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'sendmail',
            width: '100%',
            scrollable: true,
            height: '100%',
            bind: {
                hidden: '{htmlTemplate ? true : false}',
            },
            items: [
                {
                    xtype: 'froalaeditorfield',
                    testId: 'sendMailEditorFroalaEditorField',
                    ui: 'light',
                    cls: 'voyageInstructionsEdtior',
                    scrollable: true,
                    shadow: false,
                    border: false,
                    flex: 1,
                    minHeight: 250,
                    // maxHeight: 250,
                    name: 'template_html',
                    height: '100%',
                    hidden: false,
                    bind: {
                        value: '<div style="padding-left: 8px; padding-right: 8px;"><br><div style="pointer-events: none !important;">{signature}</div></div>',
                    },
                    editor: {
                        autofocus: true,
                        attribution: false,
                        quickInsertEnabled: false,
                        theme: 'royal',
                        pastePlain: true,
                        enter: 2,
                        imagePaste: false,
                        height: 300,
                        htmlUntouched: false,
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
                },
            ],
        },
        {
            xtype: 'div',
            testId: 'sendMailEditorSendMailContainer',
            cls: 'sendmail',
            width: '100%',
            scrollable: true,
            height: '100%',
            hidden: true,
            bind: {
                hidden: '{htmlTemplate ? false : true}',
                html: '<div contenteditable="true" class="email_body">{template_html}<table><tbody><tr><td style="padding:0 16px;">{signature}</td></tr></tbody></table></div>',
            },
        },
        {
            xtype: 'container',
            testId: 'sendMailEditorAttachmentsContainer',
            docked: 'bottom',
            weight: 2,
            cls: 'a-attachments-panel',
            viewModel: {
                formulas: {
                    attachmentCount: {
                        bind: {
                            bindTo: '{attachments}',
                            deep: true,
                        },
                        get: function (store) {
                            return store.getCount();
                        },
                    },
                },
            },
            bind: {
                hidden: '{attachmentCount ? false : true}',
            },
            flex: 1,
            items: [
                {
                    xtype: 'list',
                    testId: 'sendMailEditorAttachmentsList',
                    cls: 'attachment-list',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch',
                        wrap: true,
                    },
                    viewModel: true,
                    emptyText: 'No attachments',
                    minHeight: 0,
                    ui: 'simple-list',
                    disableSelection: true,
                    itemInnerCls: 'attachment',
                    itemTpl:
                        '<div class="a-attachments"><div class="file-icon-new file-icon-sm" data-type="{extension}"></div><a class="file_name" href="javascript:void(0);">{name}.{extension}</a><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; top: 6px;">close</i></span></div>',
                    itemConfig: {
                        xtype: 'simplelistitem',
                        testId: 'sendMailEditorAttachmentsListItem',
                        cls: 'a-attachment-item',
                        minWidth: 0,
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a,i',
                                fn: function (me, element, eOpts) {
                                    let component = this.component,
                                        itemRecord = component.getRecord(),
                                        controller = component.up('dialog').getController();

                                    if (element.nodeName == 'I') {
                                        component.up('list').getStore().remove(itemRecord);
                                    }
                                    if (element.nodeName == 'A') {
                                        controller.previewFile(itemRecord); // fix preview attachment in estiamtes grid
                                    }
                                },
                            },
                        },
                    },
                    scrollable: true,
                    bind: {
                        store: {
                            bindTo: '{attachments}',
                            deep: true,
                        },
                    },
                },
            ],
        },
    ],
    bbar: {
        xtype: 'toolbar',
        testId: 'sendMailEditorSnippetsToolbar',
        height: 64,
        weight: 1,
        ui: 'toolbar-panel-bottom',
        padding: 0,
        flex: 1,
        border: true,
        layout: {
            type: 'hbox',
            pack: 'space-between',
        },
        items: [
            {
                xtype: 'container',
                flex: 1,
                padding: '4 0 4 12',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'start',
                },
                items: [
                    {
                        xtype: 'button',
                        testId: 'sendMailEditorSnippetsToolbarBtn',
                        iconCls: 'md-icon-text-snippet',
                        bind: {
                            hidden: '{selectedMail ? true:false}',
                            cls: '{object_id == 6 ? "hidden" : ""}',
                        },
                        text: 'Snippets',
                        margin: '0 8 0 0',
                        menu: {
                            minWidth: 280,
                            testId: 'sendMailEditorSnippetsToolbarBtnMenu',
                            cls: 'a-bgr-white',
                            items: [
                                {
                                    xtype: 'div',
                                    testId: 'sendMailEditorSnippetsToolbarBtnMenuEmailSnippetsDiv',
                                    cls: 'h5',
                                    margin: '16 16 8',
                                    docked: 'top',
                                    bind: {
                                        html: 'Email snippets',
                                    },
                                },
                                {
                                    xtype: 'list',
                                    testId: 'sendMailEditorSnippetsAvailableList',
                                    ripple: true,
                                    itemRipple: true,
                                    reference: 'availableSnippets',
                                    scrollable: true,
                                    selectable: {
                                        mode: 'MULTI',
                                    },
                                    groupHeader: {
                                        tpl: '{name:uppercase}',
                                        disabled: true,
                                        style: 'pointer-events:none;',
                                    },
                                    bind: {
                                        store: '{mailSnippets}',
                                    },
                                    itemConfig: {
                                        viewModel: {},
                                        padding: '8 16',
                                        xtype: 'menucheckitem',
                                        testId: 'sendMailEditorSnippetsAvailableListMenuCheckItem',
                                        bind: {
                                            text: '{record.name}',
                                        },
                                    },
                                },
                                {
                                    xtype: 'container',
                                    padding: '8 16',
                                    docked: 'bottom',
                                    layout: {
                                        type: 'hbox',
                                        pack: 'end',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'small action',
                                            text: 'Add',
                                            testId: 'sendMailEditorSnippetsAvailableListMenuAddSmallBtn',
                                            disabled: true,
                                            bind: {
                                                disabled: '{availableSnippets.selection ? false : true}',
                                            },
                                            handler: function (me) {
                                                const selectedSnippets = Ext.ComponentQuery.query(
                                                    '[reference=availableSnippets]'
                                                )[0].getSelections();

                                                if (selectedSnippets.length) {
                                                    let froalaEditor = me
                                                            .up('dialog')
                                                            .down('[xtype=froalaeditorfield]'),
                                                        html = '';

                                                    Ext.each(selectedSnippets, function (snippet, index) {
                                                        if (index > 0) {
                                                            html += '<br>';
                                                        }
                                                        html += snippet.get('content');
                                                        if (index == selectedSnippets.length - 1) {
                                                            html += '<br>';
                                                        }
                                                    });
                                                    froalaEditor.setValue('');
                                                    me.upVM().set('htmlTemplate', true);
                                                    me.upVM().set('template_html', html);
                                                    Ext.ComponentQuery.query(
                                                        '[reference=availableSnippets]'
                                                    )[0].deselectAll();
                                                    me.up('menu')
                                                        .query('menucheckitem')
                                                        .forEach(function (item) {
                                                            item.setChecked(false);
                                                        });
                                                    me.up('menu').hide();
                                                }
                                            },
                                        },
                                    ],
                                },
                            ],
                            listeners: {
                                hide: function () {},
                            },
                        },
                        handler: function (me) {
                            let sendMailModal = Ext.ComponentQuery.query('#sendmail-popup')[0],
                                mainVM = sendMailModal.getVM();
                            Ext.create('Abraxa.view.mail.SendmailFiles', {
                                viewModel: {
                                    parent: mainVM,
                                },
                            }).show();
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-attach-file',
                        bind: {
                            hidden: '{selectedMail ? true:false}',
                        },
                        ui: '',
                        text: 'Attach files',
                        testId: 'sendMailEditorAttachFilesBtn',
                        margin: '0 16 0 0',
                        itemId: 'add-attachment',
                        handler: function (me) {
                            let sendMailModal = Ext.ComponentQuery.query('#sendmail-popup')[0],
                                mainVM = sendMailModal.getVM();
                            Ext.create('Abraxa.view.mail.SendmailFiles', {
                                viewModel: {
                                    parent: mainVM,
                                },
                            }).show();
                        },
                    },
                    {
                        xtype: 'button',
                        cls: 'd-none',
                        iconCls: 'md-icon-link',
                        ui: 'raised round',
                        testId: 'sendMailEditorRaisedRoundDoneBtn',
                        margin: '0 12 0 0',
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-remove-circle-outline',
                        ui: 'raised round decline',
                        text: 'discard',
                        testId: 'sendMailEditorDiscardBtn',
                        hidden: true,
                        bind: {
                            hidden: '{selectedMail.is_draft ? false : true}',
                            cls: '{object_id == 6 ? "hidden" : ""}',
                        },
                        handler: function () {
                            var me = this;
                            Ext.Msg.confirm(
                                'Discard draft',
                                'Are you sure you want delete this message?',
                                function (answer) {
                                    if (answer == 'yes') {
                                        var list = Ext.ComponentQuery.query('mail-list')[0];
                                        var listStore = list.getStore();
                                        var record = listStore.findRecord(
                                            'id',
                                            me.lookupViewModel().get('selectedMail.id')
                                        );

                                        listStore.removeAt(listStore.indexOf(record));
                                        // srecord.remove()
                                        listStore.sync({
                                            success: function () {
                                                Ext.toast('Record deleted', 1000);
                                                list.refresh();
                                            },
                                        });
                                    }
                                }
                            );
                        },
                    },
                    {
                        xtype: 'container',
                        bind: {
                            hidden: '{object_id == 6 ? true:false}',
                        },
                        cls: 'a-mail-footer-check',
                        items: [
                            {
                                xtype: 'checkbox',
                                testId: 'sendMailEditorPDFReportCheckbox',
                                ui: 'medium',
                                name: 'attach_portcall_pdf',
                                boxLabel: 'PDF report',
                            },
                        ],
                    },
                ],
            },
            {
                xtype: 'container',
                margin: '0 16 0 0',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'end',
                },
                items: [
                    {
                        xtype: 'container',
                        cls: 'required_fields',
                        testId: 'sendMailEditorRequiredFieldsContainer',
                        hidden: true,
                        right: 164,
                        html: '<div class="col"><div class="alert-warning alert-danger"><i class="material-icons md-icon-info md-18 red"></i>Please fill in all required fields.</div></div>',
                        showAnimation: {
                            type: 'popIn',
                            direction: 'right',
                        },
                    },
                    {
                        xtype: 'button',
                        text: 'Cancel',
                        testId: 'sendMailEditorCancelBtn',
                        ui: 'default',
                        margin: '0 8 0 0',
                        handler: function () {
                            this.up('dialog').destroy();
                        },
                    },
                    {
                        xtype: 'button',
                        testId: 'sendMailEditorSendBtn',
                        text: 'Send',
                        itemId: 'mail-send',
                        slug: 'portcallReportSend',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        ui: 'action',
                        // iconCls: 'md-icon-send',
                        // margin: '0 8 0 0',
                        handler: 'sendMessage',
                    },
                ],
            },
        ],
    },
    listeners: {
        painted: function () {
            if (this.up('dialog').getMaximized()) {
                this.down('[cls=mail-maximize-tool]').hide();
                this.down('[cls=mail-restore-tool]').show();
            } else {
                this.down('[cls=mail-maximize-tool]').show();
                this.down('[cls=mail-restore-tool]').hide();
            }
        },
    },
});

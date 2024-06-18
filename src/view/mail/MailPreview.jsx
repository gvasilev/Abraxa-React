Ext.define('Abraxa.view.mail.MailPreview', {
    extend: 'Ext.Container',
    xtype: 'mail-preview',
    cls: 'a-mail-preview',
    scrollable: true,
    viewModel: {
        formulas: {
            userInitials: {
                bind: {
                    bindTo: '{selectedMail}',
                    deep: true,
                },
                get: function (record) {
                    if (record) return record.user.abbr;
                },
            },
            mailTo: {
                bind: {
                    bindTo: '{selectedMail}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        var mailAddresses = [];
                        var mail_to = Ext.JSON.decode(JSON.stringify(record.mail_to));
                        Ext.Array.each(mail_to, function (item) {
                            mailAddresses.push({
                                email: item,
                            });
                        });
                        return mailAddresses;
                    }
                },
            },
            mailToCc: {
                bind: {
                    bindTo: '{selectedMail}',
                    deep: true,
                },
                get: function (record) {
                    var mailAddresses = [];
                    if (record) {
                        var mail_cc = Ext.JSON.decode(JSON.stringify(record.mail_cc));
                        Ext.Array.each(mail_cc, function (item) {
                            mailAddresses.push({
                                email: item,
                            });
                        });
                    }
                    return mailAddresses;
                },
            },
            mailToBcc: {
                bind: {
                    bindTo: '{selectedMail}',
                    deep: true,
                },
                get: function (record) {
                    var mailAddresses = [];
                    if (record) {
                        var mail_bcc = Ext.JSON.decode(JSON.stringify(record.mail_bcc));
                        Ext.Array.each(mail_bcc, function (item) {
                            mailAddresses.push({
                                email: item,
                            });
                        });
                    }
                    return mailAddresses;
                },
            },
            attachmentCount: {
                bind: {
                    bindTo: '{selectedMailFiles}',
                    deep: true,
                },
                get: function (store) {
                    return store.getCount();
                },
            },
            createdByImg: {
                bind: {
                    bindTo: '{selectedMail.user}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('users'),
                            me = this;
                        let userRecord = store.getById(record.id),
                            str = '';
                        if (userRecord) {
                            if (userRecord.get('profile_image')) {
                                userImage = userRecord.get('profile_image');
                                str =
                                    '<div class="a-person a-icon-round"><img class="a-profile-image a-user" src="' +
                                    userImage +
                                    '" width="24" alt="" /></div><span class="fw-b">' +
                                    userRecord.get('first_name')[0] +
                                    '. ' +
                                    userRecord.get('last_name') +
                                    '</span>';
                            } else {
                                str =
                                    '<div class="a-person a-icon-round"><span class="a-int a-user">' +
                                    userRecord.get('first_name')[0] +
                                    userRecord.get('last_name')[0] +
                                    '</span></div><span class="fw-b">' +
                                    userRecord.get('first_name')[0] +
                                    '. ' +
                                    userRecord.get('last_name') +
                                    '</span>';
                            }
                        }
                        return str;
                    }
                },
            },
            createdAtFormat: {
                bind: {
                    bindTo: '{selectedMail.created_at}',
                    deep: true,
                },
                get: function (createdAtFormat) {
                    if (createdAtFormat) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(createdAtFormat, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    } else {
                        return '';
                    }
                },
            },
        },
    },
    flex: 1,
    items: [
        {
            xttype: 'container',
            height: 64,
            docked: 'top',
            cls: 'a-bb-100',
            padding: '0 16',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'button',
                    iconCls: 'md-icon-keyboard-backspace',
                    ui: 'tool round',
                    left: 12,
                    handler: function () {
                        var mailList = Ext.ComponentQuery.query('mail-list')[0];

                        if (mailList.getSelection()) mailList.getSelectable().deselect(mailList.getSelection());
                        if (this.upVM().get('attachments')) {
                            this.upVM().get('attachments').setData([]);
                        }
                        Ext.ComponentQuery.query('mail-preview')[0].hide();
                        Ext.ComponentQuery.query('sendmail-editor')[0].show();
                    },
                },
                {
                    xtype: 'title',
                    flex: 1,
                    margin: '0 0 0 48',
                    style: 'font-size: 16px; font-weight: 500;',
                    bind: {
                        title: {
                            bindTo: '{selectedMail.mail_subject}',
                            deep: true,
                        },
                    },
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'x-paneltool',
                            items: [
                                {
                                    xtype: 'tool',
                                    type: 'maximize',
                                    handler: function () {
                                        this.up('dialog').maximize(null);
                                        this.up('container').down('[cls=mail-restore-tool]').show();
                                        this.up('dialog').setStyle('border-radius: 0;');
                                        this.hide();
                                    },
                                    cls: 'mail-maximize-tool',
                                },
                                {
                                    xtype: 'tool',
                                    type: 'restore',
                                    handler: function () {
                                        this.up('dialog').restore(null);
                                        this.up('container').down('[cls=mail-maximize-tool]').show();
                                        this.up('dialog').setStyle('border-radius: 5px;');
                                        this.hide();
                                    },
                                    cls: 'mail-restore-tool',
                                },
                                {
                                    xtype: 'tool',
                                    type: 'close',
                                    handler: function () {
                                        this.up('dialog').destroy();
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
            docked: 'top',
            flex: 1,
            layout: {
                type: 'hbox',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-mail-toolbar',
                    docked: 'top',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-mail-toolbar-row',
                            padding: '0 24',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            bind: {
                                html: '<div class="hbox">{createdByImg}<span class="ml-4 c-grey">on {createdAtFormat}</span></div>',
                            },
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
                                    width: 64,
                                    html: 'To:',
                                },
                                {
                                    xtype: 'list',
                                    cls: 'a-mail-chip-list',
                                    flex: 1,
                                    selectable: false,
                                    // layout: {
                                    //     type: 'hbox',
                                    //     pack: 'start',
                                    //     align: 'stretch',
                                    //     wrap: true
                                    // },
                                    padding: '8 0 0 0',
                                    inline: true,
                                    viewModel: true,
                                    emptyText: '',
                                    itemInnerCls: 'mail-address',
                                    itemTpl: '<div class="x-chip"><div class="x-text-el">{email}</div></div>',
                                    itemConfig: {
                                        xtype: 'simplelistitem',
                                        minWidth: 0,
                                        margin: '0 4',
                                    },
                                    bind: {
                                        store: '{mailTo}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'cc-container a-mail-toolbar-row',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            bind: {
                                hidden: '{mailToCc.length > 0 ? false:true}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-mail-label',
                                    width: 64,
                                    html: 'Cc:',
                                },
                                {
                                    xtype: 'list',
                                    cls: 'a-mail-chip-list',
                                    flex: 1,
                                    selectable: false,
                                    // layout: {
                                    //     type: 'hbox',
                                    //     pack: 'start',
                                    //     align: 'stretch',
                                    //     wrap: true
                                    // },
                                    padding: '8 0 0 0',
                                    inline: true,
                                    viewModel: true,
                                    emptyText: '',
                                    // ui: 'simple-list',
                                    itemInnerCls: 'mail-address',
                                    itemTpl: '<div class="x-chip"><div class="x-text-el">{email}</div></div>',
                                    itemConfig: {
                                        xtype: 'simplelistitem',
                                        minWidth: 0,
                                        margin: '0 4',
                                    },
                                    bind: {
                                        store: '{mailToCc}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'bcc-container a-mail-toolbar-row',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            bind: {
                                hidden: '{mailToBcc.length > 0 ? false:true}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-mail-label',
                                    width: 64,
                                    html: 'Bcc:',
                                },
                                {
                                    xtype: 'list',
                                    cls: 'a-mail-chip-list',
                                    flex: 1,
                                    selectable: false,
                                    inline: true,
                                    // layout: {
                                    //     type: 'hbox',
                                    //     pack: 'start',
                                    //     align: 'stretch',
                                    //     wrap: true
                                    // },
                                    padding: '8 0 0 0',
                                    viewModel: true,
                                    emptyText: '',
                                    itemInnerCls: 'mail-address',
                                    itemTpl: '<div class="x-chip"><div class="x-text-el">{email}</div></div>',
                                    itemConfig: {
                                        xtype: 'simplelistitem',
                                        minWidth: 0,
                                        margin: '0 4',
                                    },
                                    bind: {
                                        store: '{mailToBcc}',
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
            cls: 'a-attachments-panel',
            docked: 'bottom',
            hidden: true,
            bind: {
                hidden: '{attachmentCount ? false : true}',
            },
            items: [
                {
                    xtype: 'label',
                    html: '<h5 class="m-0">ATTACHMENTS</h5>',
                },
                {
                    xtype: 'list',
                    cls: 'attachment-list',
                    margin: '8 0',
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
                        '<div class="a-attachments"><div class="file-icon-new file-icon-sm" data-type="{document.extension}"></div><a class="file_name" href="javascript:void(0);">{name}.{document.extension}</a></div>',
                    itemConfig: {
                        style: 'border-radius: 6px;',
                        xtype: 'simplelistitem',
                        minWidth: 0,
                        padding: 0,
                        margin: '4 2 4 2',
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a',
                                fn: function (me, element, eOpts) {
                                    let component = this.component,
                                        itemRecord = component.getRecord(),
                                        controller = component.up('dialog').getController();
                                    itemRecord.getDocument().set('nonEditable', true);
                                    itemRecord.getDocument().set('name', itemRecord.get('name'));

                                    controller.previewFile(itemRecord.getDocument());
                                },
                            },
                        },
                    },
                    scrollable: true,
                    bind: {
                        store: {
                            bindTo: '{selectedMailFiles}',
                            deep: true,
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-mail-preview-content',
            flex: 1,
            bind: {
                cls: 'a-mail-preview-content {selectedMail.template_id ? "":"a-mail-plain-text"}',
                html: '<div class="email_body">{selectedMail.mail_content}</div>',
            },
        },
    ],
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

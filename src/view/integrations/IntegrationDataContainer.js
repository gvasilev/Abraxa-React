Ext.define('Abraxa.view.integrations.IntegrationDataContainer', {
    extend: 'Ext.Panel',
    xtype: 'integration.data.container',
    shadow: false,
    bordered: false,
    manageBorders: false,
    flex: 1,
    cls: 'integration_sheet',
    scrollable: 'y',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        formulas: {
            selectedMessage: {
                bind: {
                    bindTo: '{mailList.selection}',
                },
                get: function (message) {
                    if (message) {
                        return message;
                    }
                    return null;
                },
            },
            integrationData: {
                bind: {
                    bindTo: '{integrations}',
                    deep: true,
                },
                get: function (store) {
                    if (store && store.getCount()) {
                        var data = store.getAt(0).get('integration_data');
                        return data;
                    }
                    return null;
                },
            },
            messages: {
                bind: {
                    bindTo: '{integrationData}',
                },
                get: function (data) {
                    let messages = [];
                    if (data && data.messages.length > 0) {
                        data.messages.forEach(function (message) {
                            messages.push({
                                id: message.id,
                                subject: message.attributes.subject,
                                body: message.attributes.bodyHtml,
                                date: message.attributes.sentAt,
                                from: message.attributes.from,
                                to: message.attributes.to,
                                attachments: message.attachments,
                            });
                        });
                    }
                    messages.sort((a, b) => new Date(b.date) - new Date(a.date));
                    return messages;
                },
            },
            attachments: {
                bind: {
                    bindTo: '{integrationData}',
                },
                get: function (data) {
                    let attachments = [],
                        convertSize = function (size) {
                            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                            if (size == 0) return '0 Byte';
                            var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                            return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
                        };
                    if (data && data.messages.length > 0) {
                        data.messages.forEach(function (message) {
                            if (message.attachments.length > 0) {
                                message.attachments.forEach(function (attachment) {
                                    attachments.push({
                                        name: attachment.attributes.name,
                                        extension: attachment.attributes.name.split('.').pop(),
                                        public_download: attachment.meta.publicDownload,
                                        download: attachment.meta.download,
                                        size: convertSize(attachment.attributes.size),
                                    });
                                });
                            }
                        });
                    }
                    return attachments;
                },
            },
        },
    },
    masked: {
        xtype: 'loadmask',
        message: 'Loading data...',
        indicator: true,
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 64,
            docked: 'top',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: "<div class='hbox'><div class='a-obj-logo' style='width:32px; height:32px; border-radius:5px;'><img src='{integrationList.selection.integration.logo}' width='32px' style='border-radius:5px;'></div><div><span class='a-panel-title text-truncate ml-16' style='width: 260px;'>{integrationList.selection.integration.name}</span></div></div>",
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-close md-icon-outlined',
                            handler: function (me) {
                                me.up('panel').hide();
                                me.up('panel').mask();
                                Ext.ComponentQuery.query('[xtype=integrations\\.panel]')[0].down('list').deselectAll();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            hidden: true,
            bind: {
                hidden: '{!integrationData || selectedMessage}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-info',
                    layout: 'vbox',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                // {
                                //     xtype: 'container',
                                //     cls: 'a-titlebar',
                                //     items: [
                                //         {
                                //             xtype: 'title',
                                //             title: 'General',
                                //         },
                                //     ],
                                // },
                                {
                                    xtype: 'container',
                                    cls: 'a-portcall-data',
                                    margin: '8 24 16',
                                    defaults: {
                                        labelAlign: 'left',
                                        cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                        labelWidth: 120,
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            label: 'Job tag',
                                            encodeHtml: false,
                                            bind: {
                                                value: '{integrationData.data.attributes.name}',
                                            },
                                            renderer: function (value) {
                                                return (
                                                    "<div class='hbox'><div><span class='a-status-badge a-status-md status-appointed'>" +
                                                    value +
                                                    '</span></div></div>'
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'displayfield',
                                            label: 'Vessel',
                                            bind: {
                                                value: '{integrationData.data.attributes.attributes.vesselName}',
                                            },
                                        },
                                        {
                                            xtype: 'displayfield',
                                            label: 'Type',
                                            bind: {
                                                value: '{integrationData.data.attributes.type:capitalize}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-portcall-extra',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Messages',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'list',
                                    cls: 'a-mail-list sendmail-history sedna_mails',
                                    itemCls: 'a-mail-item',
                                    reference: 'mailList',
                                    layout: {
                                        type: 'hbox',
                                        wrap: true,
                                    },
                                    selectable: {
                                        mode: 'single',
                                        deselectable: true,
                                    },
                                    itemConfig: {
                                        padding: '8',
                                        viewModel: {},
                                        tpl: new Ext.XTemplate(
                                            '<div class="a-mail-header"><div class="a-recipients"><strong>To: </strong>{[this.toEmails(values.to)]}</div><div class="a-mail-icons"{[this.hasFiles(values.attachments)]}</div></div>' +
                                                '<div class="a-mail-subject">{subject}</div>' +
                                                '<div class="a-mail-date"><span class="sm-date">{[this.dateFormat(values.date)]}</span></div>',
                                            {
                                                hasFiles: function (files) {
                                                    if (files.length > 0) {
                                                        return '><i class="material-icons md-18">attach_file</i>';
                                                    } else {
                                                        return '>';
                                                    }
                                                },
                                                toEmails: function (value) {
                                                    var mail_to = Ext.JSON.decode(JSON.stringify(value));
                                                    let mail = mail_to[0].replace(/[<>]/g, '');
                                                    if (mail_to.length > 1) {
                                                        return (
                                                            '<span class="a-recipient">' +
                                                            mail +
                                                            ' <b>+' +
                                                            (mail_to.length - 1) +
                                                            '</b></span>'
                                                        );
                                                    } else {
                                                        return '<span class="a-recipient">' + mail + '</span>';
                                                    }
                                                },
                                                dateFormat: function (date) {
                                                    if (date) {
                                                        return Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .parseMomentDate(
                                                                date,
                                                                AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                                            );
                                                    } else {
                                                        return '';
                                                    }
                                                },
                                            }
                                        ),
                                    },
                                    bind: {
                                        store: '{messages}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            // hidden: true,
                            cls: 'a-portcall-extra',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Attachments',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'list',
                                    cls: 'a-attachments-list',
                                    margin: '0 16',
                                    layout: {
                                        type: 'hbox',
                                        wrap: true,
                                    },
                                    itemConfig: {
                                        cls: 'a-attachment-item-new attachment-with-buttons',
                                        width: '50%',
                                        xtype: 'container',
                                        padding: 8,
                                        minWidth: 0,
                                        viewModel: {},
                                        layout: {
                                            type: 'hbox',
                                            pack: 'space-between',
                                        },
                                        items: [
                                            {
                                                bind: {
                                                    html: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.name}</a><span class="sm-title">{record.size}</span></div></div>',
                                                },
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'mini',
                                                text: 'Save',
                                                iconCls: 'md-icon-file-download md-icon-outlined',
                                                cls: 'attachment_button',
                                                bottom: 4,
                                                right: 4,
                                                tooltip: {
                                                    html: 'Save to Documents',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    align: 'tc-bc?',
                                                },
                                            },
                                        ],
                                    },
                                    bind: {
                                        store: '{attachments}',
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
            hidden: false,
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            height: '100%',
            hidden: true,
            bind: {
                hidden: '{integrationData}',
            },
            items: [
                {
                    xtype: 'container',
                    centered: true,
                    layout: {
                        type: 'vbox',
                    },
                    items: [
                        {
                            xtype: 'div',
                            html: '<div class="a-inner"><div class="a-no-content-txt">No job tag available</div></div>',
                        },
                        {
                            xtype: 'button',
                            text: 'Job tag',
                            cls: 'a-no-content-btn',
                            ui: 'indigo-light medium',
                            iconCls: 'md-icon-add',
                            hideMode: 'opacity',
                            handler: function (btn, e) {},
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'sedna.mail.preview',
            hidden: true,
            hideMode: 'offsets',
            showAnimation: {
                type: 'slide',
                direction: 'left',
                duration: 250,
            },
            flex: 1,
            scrollable: true,
            bind: {
                hidden: '{mailList.selection ? false : true}',
            },
        },
    ],
});

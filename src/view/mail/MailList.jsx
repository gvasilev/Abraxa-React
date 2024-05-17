Ext.define('Abraxa.view.mail.MailList', {
    extend: 'Ext.dataview.List',
    xtype: 'mail-list',
    cls: 'a-mail-list sendmail-history a-bb-100',
    ui: 'bordered',
    flex: 1,
    itemCls: 'a-mail-item',
    border: true,
    scrollable: true,
    reference: 'selectedMail',
    infinite: false,
    height: '63%',
    // variableHeights: true,
    emptyText: 'No messages yet',
    viewModel: {
        stores: {
            // emails: {
            //     type: 'sendmail.emails',
            //     autoLoad: false,
            //     // proxy: {
            //     //     extraParams: {
            //     //         object_id: '{transformObjectId}',
            //     //         object_meta_id: '{transformObjectMetaId}'
            //     //     }
            //     // },
            //     // updateProxy: function (proxy) {
            //     //     if (proxy) {
            //     //         proxy.onAfter('extraparamschanged', this.load, this);
            //     //     }
            //     // },
            //     sorters: [{
            //             property: 'id',
            //             direction: 'DESC'
            //         },
            //         {
            //             property: 'date(created_at)',
            //             direction: 'ASC'
            //         },
            //     ],
            //     grouper: {
            //         property: 'created_at',
            //         direction: 'DESC',
            //         groupFn: function (record) {
            //             var date = moment(record.get('created_at'), "YYYY-MM-DD HH:mm");
            //             // if (moment().isSame(date, 'd'))
            //             //     return 'Today';
            //             return moment(record.get('created_at'), "YYYY-MM-DD HH:mm").format('YYYY-MM-DD');
            //         }
            //     },
            //     filters: [
            //         new Ext.data.Query({
            //             id: 'draft',
            //             source: 'is_draft = "0"'
            //         })
            //     ]
            // }
        },
        formulas: {
            // loadAttachments: {
            //     bind: {
            //         bindTo: '{selectedMail.selection}',
            //         deep: true
            //     },
            //     get: function (selection) {
            //         if (selection)
            //             Ext.getStore('mail-attachments').load({
            //                 id: selection.id
            //             });
            //     }
            // },
        },
    },
    groupHeader: {
        tpl: new Ext.XTemplate('{[this.checkDate(values)]} ({count})', {
            checkDate: function (values) {
                var date = moment(values.name, 'YYYY-MM-DD HH:mm');
                if (moment().isSame(date, 'd')) return 'Today';

                return moment(values.name, 'YYYY-MM-DD HH:mm').format('dddd');
            },
        }),
    },
    itemConfig: {
        border: true,
    },
    itemTpl: new Ext.XTemplate(
        '<div class="a-mail-header"><div class="a-recipients"><strong>To: </strong>{[this.toEmails(values.mail_to)]}</div><div class="a-mail-icons"{[this.hasFiles(values.files)]}</div></div>' +
            '<div class="a-mail-subject">{mail_subject}</div>' +
            '<div class="a-mail-date"><span class="sm-date">{[this.dateFormat(values.created_at)]}</span></div>',
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
                if (mail_to.length > 1) {
                    return '<span class="a-recipient">' + mail_to[0] + ' <b>+' + (mail_to.length - 1) + '</b></span>';
                } else {
                    return '<span class="a-recipient">' + mail_to[0] + '</span>';
                }
                //
            },
            dateFormat: function (date) {
                if (date) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(date, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                } else {
                    return '';
                }
            },
        }
    ),
    tooltip: {
        delegate: '.c-yellow',
        ui: 'info-card',
        html: 'Mail could not be sent',
        autoCreate: true,
        anchorToTarget: true,
        anchor: true,
        anchorPosition: 'left',
        style: 'border-radius: 3px',
        showDelay: 0,
        hideDelay: 0,
        dismissDelay: 0,
        allowOver: false,
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {},
        },
        align: 'bc-tc?',
    },
    store: [],
    bind: {
        store: {
            bindTo: '{amails}',
            deep: true,
        },
    },
    listeners: {
        childtap: function (item, location) {
            var record = location.record.getData();
            if (record.is_draft) {
                Ext.ComponentQuery.query('sendmail-editor')[0]
                    .show()
                    .setTitle('<span style="color: rgb(0, 86, 146)">Draft Message</span>')
                    .lookupViewModel()
                    .set({
                        selectedMail: record,
                        selectedMailFiles: location.record.files(),
                    });
                Ext.ComponentQuery.query('[name=mail_to]')[0].setValue(Ext.JSON.decode(record.mail_to));
                Ext.ComponentQuery.query('[name=mail_cc]')[0].setValue(Ext.JSON.decode(record.mail_cc));
                Ext.ComponentQuery.query('[name=mail_bcc]')[0].setValue(Ext.JSON.decode(record.mail_bcc));
                Ext.ComponentQuery.query('[name=mail_subject]')[0].setValue(record.mail_subject);
                Ext.ComponentQuery.query('mail-preview')[0].hide();
            } else {
                Ext.ComponentQuery.query('sendmail-editor')[0].hide();
                var mailPreview = Ext.ComponentQuery.query('mail-preview')[0];
                let documents = [];
                location.record.files().each(function (file) {
                    documents.push(file.getDocument());
                });
                mailPreview
                    .show()
                    .lookupViewModel()
                    .set({
                        selectedMail: record,
                        selectedMailFiles: location.record.files(),
                        attachments: new Ext.data.Store({
                            data: documents,
                        }),
                    });
            }
        },
        select: function () {
            this.upVM().set('htmlTemplate', false);
        },
    },
});

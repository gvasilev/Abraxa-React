Ext.define('Abraxa.view.mail.MailListInbox', {
    extend: 'Ext.dataview.List',
    xtype: 'mail-list-inbox',
    cls: 'sendmail-history',
    flex: 1,
    itemCls: 'a-mail-list',
    border: true,
    scrollable: true,
    reference: 'selectedMail',
    infinite: false,
    height: '100%',
    variableHeights: true,
    emptyText: 'No messages yet',
    viewModel: {
        stores: {
            inbox: {
                type: 'sendmail.inbox',
                autoLoad: true,
                proxy: {
                    extraParams: {
                        object_id: '{object_id}',
                        object_meta_id: '{object_meta_id}',
                    },
                },
                updateProxy: function (proxy) {
                    if (proxy) {
                        proxy.onAfter('extraparamschanged', this.load, this);
                    }
                },
                sorters: [
                    {
                        property: 'id',
                        direction: 'DESC',
                    },
                    {
                        property: 'date(created_at)',
                        direction: 'ASC',
                    },
                ],
                grouper: {
                    property: 'created_at',
                    direction: 'DESC',
                    groupFn: function (record) {
                        var date = moment(record.get('created_at'), 'YYYY-MM-DD HH:mm');
                        // if (moment().isSame(date, 'd'))
                        //     return 'Today';

                        return moment(record.get('created_at'), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
                    },
                },
            },
        },
        // formulas: {
        //     loadAttachments: {
        //         bind: {
        //             bindTo: '{selectedMail.selection}',
        //             deep: true
        //         },
        //         get: function (selection) {
        //             if (selection)
        //                 Ext.getStore('mail-attachments').load({
        //                     id: selection.id
        //                 });
        //         }
        //     },
        // }
    },
    pinnedHeader: {
        shadow: false,
    },
    groupHeader: {
        // tpl: '{name:date("l")} ({count})'
        tpl: new Ext.XTemplate('{[this.checkDate(values)]} ({count})', {
            checkDate: function (values) {
                var date = moment(values.name, 'YYYY-MM-DD HH:mm');
                if (moment().isSame(date, 'd')) return 'Today';

                return moment(values.name, 'YYYY-MM-DD HH:mm').format('dddd');
            },
        }),
    },
    itemConfig: {
        padding: 0,
        cls: 'a-bb-100 a-cursor-pointer',
    },
    itemTpl: new Ext.XTemplate(
        '<div class="notification-item">' +
            '<div class="notification-header"><span class="sm-title"><tpl if="is_draft"><i class="material-icons md-18">drafts</i><tpl elseif="!is_sent"><i class="material-icons md-18 c-yellow">error_outline</i><tpl else><i class="material-icons md-18">email</i></tpl>{mail_subject}</span><span><tpl if="is_flagged"><i class="material-icons md-18 c-red">flag</i></tpl><tpl if="mail_has_attachments"><i class="material-icons md-18">attach_file</i></tpl></span></div>' +
            '<div class="notification-body"><div class="sm-desc">{mail_short_content}</b></div></div>' +
            '<div class="notification-footer"><span class="sm-info"><tpl if="!is_draft"><span class="sm-label">From: </span>&nbsp;&nbsp;{mail_from_name}</tpl></span><span class="sm-date">{[this.dateFormat(created_at)]}</span></div>' +
            '</div>',
        {
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
    bind: {
        store: {
            bindTo: '{inbox}',
            deep: true,
        },
    },
    listeners: {
        childtap: function (item, location) {
            var record = location.record.getData();
            // if (record.is_draft) {
            //     Ext.ComponentQuery.query('sendmail-editor')[0].show()
            //         .setTitle('<span style="color: rgb(0, 86, 146)">Draft Message</span>')
            //         .lookupViewModel()
            //         .set({
            //             selectedMail: record
            //         });
            //     Ext.ComponentQuery.query('[name=mail_to]')[0].setValue(Ext.JSON.decode(record.mail_to));
            //     Ext.ComponentQuery.query('[name=mail_cc]')[0].setValue(Ext.JSON.decode(record.mail_cc));
            //     Ext.ComponentQuery.query('[name=mail_bcc]')[0].setValue(Ext.JSON.decode(record.mail_bcc));
            //     // Ext.ComponentQuery.query('[name=mail_dl]')[0].setValue(Ext.JSON.decode(record.mail_dl));
            //     Ext.ComponentQuery.query('[name=mail_subject]')[0].setValue(record.mail_subject);
            //     // var dt = new Date(record.created_at);
            //     Ext.ComponentQuery.query('mail-preview')[0].hide();
            //     froala.html.set(record.mail_content);
            // } else {
            Ext.ComponentQuery.query('sendmail-editor')[0].hide();
            var mailPreview = Ext.ComponentQuery.query('mail-preview')[0];
            mailPreview.show().lookupViewModel().set({
                selectedMail: record,
                selectedMailFiles: location.record.files(),
            });
            // }
        },
    },
});

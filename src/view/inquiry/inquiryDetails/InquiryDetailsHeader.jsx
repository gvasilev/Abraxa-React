import './InquiryInfoDialog';
import '../../mail/Sendmail';

Ext.define('Abraxa.view.inquiry.inquiryDetails.InquiryDetailsHeader', {
    extend: 'Ext.Container',
    xtype: 'inquiry.details.header',
    layout: 'vbox',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-main-titlebar',
            items: [
                {
                    xtype: 'div',
                    itemId: 'mainTitle',
                    cls: 'a-main-title has-dropdown',
                    bind: {
                        html: '<h1>{object_record.voyage.vessel_name}</h1>',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function fn() {
                                let menu = Ext.create('Abraxa.view.main.RecentlyOpenedMenu', {
                                    viewModel: {
                                        parent: Ext.getCmp('main-viewport').getViewModel(),
                                    },
                                });
                                menu.showBy(this);
                            },
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-main-id',
                    bind: {
                        html: '{object_record.inquiry_id}',
                    },
                    tooltip: {
                        html: 'Inquiry overview',
                        anchor: true,
                        anchorToTarget: true,
                        align: 't50-b50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function fn() {
                                let inquiry = this.component.upVM().get('object_record'),
                                    dialog = Ext.create('Abraxa.view.inquiry.inquiryDetails.InquiryInfoDialog', {
                                        viewModel: {
                                            parent: this.component.upVM(),
                                        },
                                    });
                                if (inquiry) {
                                    dialog.getVM().set('inquiry', inquiry);
                                    dialog.show();
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'tool',
                    cls: 'a-main-subscribe',
                    bind: {
                        iconCls:
                            '{object_record.is_watching ? "md-icon-notifications c-yellow" : "md-icon-outlined md-icon-notifications"}',
                    },
                    // ui: 'tool-sm',
                    tooltip: {
                        html: 'Subscribe to start receiving<br> follow up notifications',
                        anchor: true,
                        anchorToTarget: true,
                        align: 't50-b50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                    handler: function(me) {
                        let record = me.upVM().get('object_record'),
                            favorite = record.get('is_watching');
                        if (favorite) {
                            record.set('is_watching', 0);
                        } else {
                            record.set('is_watching', 1);
                        }
                    },
                },
                {
                    xtype: 'tool',
                    cls: 'a-main-more',
                    // ui: 'tool-sm',
                    iconCls: 'md-icon-more-horiz',
                    bind: {
                        hidden: '{nonEditable}',
                    },
                    tooltip: {
                        html: 'More actions',
                        anchor: true,
                        anchorToTarget: true,
                        align: 't50-b50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                    handler: function handler(owner, tool, e) {
                        let vm = this.upVM(),
                            record = vm.get('object_record');
                        if (record) {
                            Ext.create('Abraxa.view.inquiry.agent.InquiryEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        inquiry: record,
                                        call_from_grid: false,
                                        is_archived: false,
                                    },
                                },
                            }).showBy(this);
                        }
                    },
                },
                {
                    xtype: 'container',
                    // subObject: 'general',
                    // bind: {
                    //     objectPermission: '{objectPermissions}',
                    //     cls: '{nonEditable ? "hidden" : ""}'
                    // },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'status-md default',
                            bind: {
                                text: '{object_record.status_string}',
                                cls: 'a-main-status status-{object_record.status_string}',
                                hidden: '{nonEditable}',
                            },
                            menu: {
                                defaults: {
                                    handler: function() {
                                        const record = this.upVM().get('object_record'),
                                            status_id = this.statusId;
                                        record.set('status', status_id);

                                        record.save({
                                            success: function() {
                                                Ext.toast('Record updated', 1000);
                                                mixpanel.track('Portcall status change');
                                            },
                                        });
                                    },
                                },
                                items: [
                                    {
                                        text: 'Draft',
                                        statusId: 1,
                                    },
                                    {
                                        text: 'In progress',
                                        statusId: 2,
                                    },
                                    {
                                        text: 'Submitted',
                                        statusId: 3,
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'div',
                            hidden: true,
                            bind: {
                                html: '<div class="a-status-badge status-xl status-{object_record.status_string}">{object_record.status_string:capitalize}</div>',
                                hidden: '{!nonEditable}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'public.updated.by',
                    cls: 'a-main-updated',
                    hidden: true,
                    bind: {
                        hidden: '{object_record.updated_by ? false : true}',
                        data: {
                            user: '{object_record.updated_by_user}',
                            updated_at: '{object_record.updated_at}',
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-main-right',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'verified.div',
                },
                {
                    xtype: 'container',
                    cls: 'a-main-shared',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-mail',
                            ui: 'normal small outlined',
                            margin: '0 16 0 0',
                            tooltip: {
                                html: 'Report via email',
                                anchor: true,
                                showDelay: 0,
                                hideDelay: 0,
                                align: 'bc-tc?',
                            },
                            text: 'Email',
                            cls: 'chameleon_portcall_report_button',
                            handler: function(me) {
                                let inquiryVM = null,
                                    attachmentData = [],
                                    companyVerified = this.upVM().get('currentCompany').get('verified');
                                if (Ext.ComponentQuery.query('inquiry\\.main')[0]) {
                                    inquiryVM = Ext.ComponentQuery.query('inquiry\\.main')[0].getVM();
                                }
                                if (Ext.ComponentQuery.query('pda\\.layout')[0]) {
                                    inquiryVM = Ext.ComponentQuery.query('pda\\.layout')[0].getVM();
                                    let pda = inquiryVM.get('pda');
                                    attachmentData.push({
                                        name: pda.get('name'),
                                        extension: 'pdf',
                                        object_id: 6,
                                        object_meta_id: me.upVM().get('object_record').get('id'),
                                        nonEditable: true,
                                        shouldGenerate: true,
                                        modelType: 'inquiryOffer',
                                        modelId: pda.get('id'),
                                    });
                                }
                                mixpanel.track('Report button (main header)');
                                Ext.create('Abraxa.view.mail.Sendmail', {
                                    viewModel: {
                                        parent: inquiryVM,
                                        data: {
                                            object_record: me.upVM().get('object_record'),
                                            object_id: 6,
                                            object_meta_id: me.upVM().get('object_record').get('id'),
                                            currentUser: me.upVM().get('currentUser'),
                                            signature: me.upVM().get('currentUser').get('signature')
                                                ? me.upVM().get('currentUser.signature.signature')
                                                : '',
                                            companyVerified: companyVerified,
                                        },
                                        stores: {
                                            attachments: Ext.create('Ext.data.Store', {
                                                proxy: {
                                                    type: 'memory',
                                                },
                                                data: attachmentData,
                                            }),
                                            documentsForAmail: {
                                                source: '{object_record.documents}',
                                            },
                                        },
                                        formulas: {
                                            emailSettings: {
                                                bind: {
                                                    bindTo: '{currentUser}',
                                                    deep: true,
                                                },
                                                get: function(user) {
                                                    let emails = [];
                                                    if (user) {
                                                        if (user.get('current_office_id')) {
                                                            let officeEmails = user.getOffice().emails();
                                                            Ext.Array.each(
                                                                officeEmails.getData().items,
                                                                function(email) {
                                                                    let emailModel = email.get('email');
                                                                    emailModel.is_default = email.get('is_default');
                                                                    emails.push(emailModel);
                                                                },
                                                            );
                                                        } else {
                                                            let company = this.get('currentCompany');
                                                            let officeEmails = company.get('email_settings');
                                                            Ext.Array.each(officeEmails, function(email) {
                                                                emails.push(email);
                                                            });
                                                        }
                                                    }
                                                    return emails;
                                                },
                                            },
                                        },
                                    },
                                }).show();
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

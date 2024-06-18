Ext.define('Abraxa.view.portcall.payments.InitCreate', {
    extend: 'Ext.Container',
    xtype: 'init.create.container',
    layout: 'vbox',
    hidden: true,
    bind: {
        hidden: '{payments.count ? true:false}',
    },
    flex: 1,
    zIndex: 999,
    centered: true,
    items: [
        {
            xtype: 'div',
            html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No payments available</div></div>',
        },
        {
            xtype: 'button',
            cls: 'a-no-content-btn',
            text: 'Payment',
            slug: 'portcallPayments',
            disabled: false,
            bind: {
                permission: '{userPermissions}',
                hidden: '{nonEditable ? true : false}',
                disabled: '{accountMainCombo.selection ? false:true}',
            },
            ui: 'normal-light medium',
            iconCls: 'md-icon-add',
            menu: {
                items: [
                    {
                        iconCls: 'md-icon-credit-score md-icon-outlined c-yellow-500',
                        text: 'Request payment',
                        handler: function (me) {
                            let object_record = me.upVM().get('object_record'),
                                account = me.upVM().get('account'),
                                payment = Ext.create('Abraxa.model.payment.Payment', {
                                    owner_id: object_record.get('id'),
                                    owner_type: object_record.get('model_name'),
                                    account_id: account ? account.get('id') : null,
                                    org_id: account ? account.get('org_id') : null,
                                    org_name: account ? account.get('org_name') : null,
                                    currency: account
                                        ? account.get('account_currency')
                                        : me.upVM().get('currentCompany').get('default_currency'),
                                    account_currency: account ? account.get('account_currency') : null,
                                    from_exchange_rate: 1,
                                    to_exchange_rate: 1,
                                });
                            payment.set('kind', 'requested');
                            Abraxa.getApplication().getController('AbraxaController').addPayment(me, payment);
                        },
                    },
                    {
                        iconCls: 'md-icon-add c-green-500',
                        text: 'Incoming payment',
                        handler: function (me) {
                            let object_record = me.upVM().get('object_record'),
                                account = me.upVM().get('account'),
                                payment = Ext.create('Abraxa.model.payment.Payment', {
                                    owner_id: object_record.get('id'),
                                    owner_type: object_record.get('model_name'),
                                    account_id: account ? account.get('id') : null,
                                    org_id: account ? account.get('org_id') : null,
                                    org_name: account ? account.get('org_name') : null,
                                    currency: account
                                        ? account.get('account_currency')
                                        : me.upVM().get('currentCompany').get('default_currency'),
                                    account_currency: account ? account.get('account_currency') : null,
                                    from_exchange_rate: 1,
                                    to_exchange_rate: 1,
                                    to_type: 'App\\Models\\CompanyBankDetails',
                                });
                            payment.set('kind', 'incoming');
                            Abraxa.getApplication().getController('AbraxaController').addPayment(me, payment);
                        },
                    },
                    {
                        iconCls: 'md-icon-remove c-red',
                        text: 'Outgoing payment',
                        handler: function (me) {
                            let object_record = me.upVM().get('object_record'),
                                account = me.upVM().get('account'),
                                payment = Ext.create('Abraxa.model.payment.Payment', {
                                    owner_id: object_record.get('id'),
                                    owner_type: object_record.get('model_name'),
                                    account_id: account ? account.get('id') : null,
                                    org_id: account ? account.get('org_id') : null,
                                    org_name: account ? account.get('org_name') : null,
                                    currency: account
                                        ? account.get('account_currency')
                                        : me.upVM().get('currentCompany').get('default_currency'),
                                    account_currency: account ? account.get('account_currency') : null,
                                    from_exchange_rate: 1,
                                    to_exchange_rate: 1,
                                });
                            payment.set('kind', 'outgoing');
                            Abraxa.getApplication().getController('AbraxaController').addPayment(me, payment);
                        },
                    },
                ],
            },
            listeners: {
                tap: function () {
                    mixpanel.track('Payments (central) - button');
                },
            },
        },
    ],
});

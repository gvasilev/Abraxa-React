Ext.define('Abraxa.view.cdb.Compliance', {
    extend: 'Ext.Container',
    xtype: 'cdb.copany.compliance',
    testId: 'cdbCompliance',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    items: [
        {
            cls: 'a-container-premium errorHandler',
            maxWidth: 540,
            bind: {
                hidden: '{currentUserPlan == "starter" ? false:true}',
            },
            items: [
                {
                    xtype: 'div',
                    padding: '16 48',
                    cls: 'text-center',
                    html: '<div class="h1">Premium feature</div><p class="a-txt">The ultimate all-in-one package for companies that need to handle port calls with confidence.</p>',
                },
                {
                    xtype: 'div',
                    margin: '16 0 24 -12',
                    cls: 'text-center',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="416" height="248" viewBox="0 0 416 248"><g transform="translate(-533 -328)"><rect width="242" height="158" rx="8" transform="translate(533 328)" fill="#fbe3c9" opacity="0.4"/><rect width="400" height="232" rx="8" transform="translate(549 344)" fill="#fff"/><rect width="64" height="8" rx="4" transform="translate(741 384)" fill="#f3c46b"/><rect width="64" height="8" rx="4" transform="translate(741 528)" fill="#ecf0f1"/><rect width="64" height="8" rx="4" transform="translate(637 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(637 528)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 432)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 480)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 528)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 432)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 480)" fill="#b0bec5" opacity="0.24"/><g transform="translate(333 85)"><rect width="40" height="40" rx="8" transform="translate(240 283)" fill="#ffb74d"/><g transform="translate(248 291)"><path d="M0,0H24V24H0Z" fill="none"/><path d="M20,6H17.82A2.993,2.993,0,0,0,12.5,3.35l-.5.67-.5-.68A2.994,2.994,0,0,0,6.18,6H4A1.985,1.985,0,0,0,2.01,8L2,19a1.993,1.993,0,0,0,2,2H20a1.993,1.993,0,0,0,2-2V8A1.993,1.993,0,0,0,20,6ZM15,4a1,1,0,1,1-1,1A1,1,0,0,1,15,4ZM9,4A1,1,0,1,1,8,5,1,1,0,0,1,9,4ZM20,19H4V17H20Zm0-5H4V8H9.08L7,10.83,8.62,12,11,8.76,12,7.4l1,1.36L15.38,12,17,10.83,14.92,8H20Z" fill="#fff"/></g></g></g></svg>',
                },
                {
                    xtype: 'button',
                    margin: '16 0',
                    ui: 'premium large',
                    text: 'Upgrade to Premium',
                    testId: 'cdbComplianceUpgradePremiumBtn',
                    handler: function () {
                        window.open('https://www.abraxa.com/pricing/');
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            minHeight: 64,
            docked: 'top',
            bind: {
                hidden: '{currentUserPlan == "starter" ? true:false}',
            },
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<span>Compliance information</span>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            padding: '16 28',
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'cdbCompliance',
            bind: {
                permission: '{userPermissions}',
                hidden: '{currentUserPlan == "starter" ? true:false}',
            },
            cls: 'a-general-form',
            maxWidth: 540,
            defaults: {
                labelAlign: 'left',
                margin: '4 0',
                clearable: false,
                ui: 'classic hovered-border',
                slug: 'cdbCompliance',
                bind: {
                    permission: '{userPermissions}',
                },
                listeners: {
                    focusleave: function () {
                        let record = this.upVM().get('object_record.compliance'),
                            object_record = this.upVM().get('object_record'),
                            currentUser = this.upVM().get('currentUser');
                        if (record.dirty) {
                            record.save({
                                success: function () {
                                    object_record.set('updated_at', new Date());
                                    record.set('updated_by_user', currentUser.getData());
                                    Ext.toast('Record updated');
                                },
                            });
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'selectfield',
                    testId: 'cdbComplianceStatusField',
                    label: 'Status',
                    valueField: 'value',
                    displayField: 'name',
                    cls: 'a-compliance-combo hbox',
                    placeholder: 'Choose status',
                    slug: 'cdbComplianceVerified',
                    bind: {
                        permission: '{userPermissions}',
                        value: '{object_record.compliance.status}',
                    },
                    itemTpl:
                        '<div class="combo-item hbox">' +
                        '<div class="mini-icon round bordered" data-type="{value}"><i></i></div>' +
                        '<div>{name}</div>' +
                        '</div>',
                    options: [
                        {
                            name: 'Not verified',
                            value: 'not verified',
                        },
                        {
                            name: 'Pending',
                            value: 'pending',
                        },
                        {
                            name: 'Blocked',
                            value: 'blocked',
                        },
                        {
                            name: 'Verified',
                            value: 'verified',
                        },
                    ],
                    listeners: {
                        initialize: function () {
                            this.on('select', function (me, record) {
                                this.beforeInputElement.set({
                                    'data-type': record.get('value'),
                                });
                            });
                            // this.on('change', function (me, record) {

                            //     if (!me.getValue()) {
                            //         this.beforeInputElement.set({
                            //             "data-type": ""
                            //         });
                            //     }
                            // })
                        },
                    },
                },
                {
                    xtype: 'abraxa.datetimefield',
                    label: 'Expiration date',
                    testId: 'cdbComplianceExpDateField',
                    cls: 'a-field-icon icon-date icon-rounded',
                    slug: 'cdbComplianceExpirationDate',
                    bind: {
                        permission: '{userPermissions}',
                        dateTime: '{object_record.compliance.expiration_date}',
                    },
                    listeners: {
                        focusleave: function (me) {
                            let object_record = me.upVM().get('object_record');
                            let record = object_record.getCompliance();
                            record.set({
                                expiration_date: me.getValue(),
                            });
                        },
                        blur: function (me) {
                            let record = me.upVM().get('object_record.compliance'),
                                object_record = me.upVM().get('object_record'),
                                currentUser = me.upVM().get('currentUser');
                            if (record.dirty) {
                                record.save({
                                    success: function () {
                                        object_record.set('updated_at', new Date());
                                        record.set('updated_by_user', currentUser.getData());
                                        Ext.toast('Record updated');
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-file-data',
                    defaults: {
                        cls: 'a-data-item',
                        height: 42,
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Created by',
                                    cls: 'c-blue-grey fs-13',
                                    width: 162,
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    bind: {
                                        data: {
                                            user: '{object_record.compliance.created_by_user}',
                                            updated_at: '{object_record.compliance.created_at}',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Updated by',
                                    testId: 'cdbComplianceUpdatedByLabel',
                                    cls: 'c-blue-grey fs-13',
                                    width: 162,
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    testId: 'cdbComplianceUpdatedByChatter',
                                    bind: {
                                        data: {
                                            user: '{object_record.compliance.updated_by_user}',
                                            updated_at: '{object_record.compliance.updated_at}',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Verified by',
                                    testId: 'cdbComplianceVerifiedByLabel',
                                    cls: 'c-blue-grey fs-13',
                                    width: 162,
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    testId: 'cdbComplianceVerifiedByChatter',
                                    hidden: true,
                                    bind: {
                                        hidden: '{object_record.compliance.verified_by ? false : true}',
                                        data: {
                                            user: '{object_record.compliance.verified}',
                                            updated_at: '{object_record.compliance.verified_at}',
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'hbox a-field-icon icon-rounded icon-person',
                                    bind: {
                                        hidden: '{object_record.compliance.verified_by ? true : false}',
                                        html: '<div class="x-before-input-el"></div><div class="a-placeholder ml-4">Not verified</div>',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'textfield',
                    testId: 'cdbComplianceTeamRegisteringField',
                    label: 'Team registering',
                    placeholder: 'example@domain.com',
                    cls: 'a-field-icon icon-email icon-rounded',
                    bind: {
                        value: '{object_record.compliance.team_registering}',
                    },
                },
            ],
        },
    ],
});

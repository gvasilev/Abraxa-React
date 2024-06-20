import '../../../core/components/AbraxaTimeZoneCombo';
import './AddEditBank';

Ext.define('Abraxa.view.settings.company.SystemSettings', {
    extend: 'Ext.Container',
    xtype: 'settings.company.systems.settings',
    scrollable: true,
    cls: 'a-settings-main w-50',
    hidden: true,
    bind: {
        hidden: '{mainCompanyTabbar.activeTabIndex == 1 ? false: true}',
    },
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'div',
                    html: '<h1 class="fw-n">System settings</h1>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">These system preferences will be applied centrally for your <br> organization’s account.</p>',
                },
                {
                    xtype: 'div',
                    padding: '16 0 0 0',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'div',
                            margin: '0 0 16 0',
                            html: '<h3>Timezone</h3><div class="text-info">Setting up your time zone helps you localize your port calls and several other tools within Abraxa.</div>',
                        },
                        {
                            xtype: 'timezone.combo',
                            testId: 'settingsCompanyTimeZoneTestId',
                            label: null,
                            placeholder: 'Choose',
                            triggers: {
                                search: false,
                            },
                            ui: 'non-editable classic',
                            showNoPermissions: true,
                            slug: 'settingsCompanyTimeZone',
                            bind: {
                                permission: '{userPermissions}',
                                value: '{currentCompany.timezone_id}',
                            },
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('currentCompany');
                                    if (record.dirty) {
                                        Ext.create('Ext.MessageBox', {
                                            title: 'Warning',
                                            ui: 'warning',
                                            modal: false,
                                            message:
                                                'Changing the time zone setting will affect all users. Do you want to proceed?<p class="c-grey">Note: Applying this setting requires a system reload.</p>',
                                            zIndex: 9999,
                                            bbar: {
                                                items: [
                                                    '->',
                                                    {
                                                        xtype: 'button',
                                                        text: 'Cancel',
                                                        handler: function (me) {
                                                            record.reject();
                                                            this.up('dialog').destroy();
                                                        },
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        testId: 'settingsCompanyTimeZoneChangeTestId',
                                                        text: 'Change',
                                                        margin: '0 0 0 8',
                                                        ui: 'action',
                                                        handler: function (me) {
                                                            record.save({
                                                                success: function (batch, opt) {
                                                                    window.location.reload();
                                                                },
                                                            });
                                                        },
                                                    },
                                                ],
                                            },
                                        }).show();
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    padding: '24 0 0 0',
                    html: '<hr>',
                },
                {
                    xtype: 'div',
                    margin: '0 0 16 0',
                    html: '<h3>Bank information</h3><div class="text-info">Set up your bank account details for documents where you<br>can show your bank information (i.e. invoices).</div>',
                    // slug: 'settingsCompanyBankInformation',
                    // bind: {
                    //     permission: '{userPermissions}',
                    // },
                },
                {
                    xtype: 'container',
                    cls: 'a-bordered-list',
                    slug: 'settingsCompanyBankInformation',
                    showNoPermissions: true,
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-list-titles',
                            html: '<div class="flex-6">Name</div><div class="flex-1">Currency</div><div class="a-actions-hover"></div>',
                        },
                        {
                            xtype: 'abraxa.formlist',
                            bind: {
                                store: '{companyBankDetails}',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                cls: 'a-list-item',
                                minHeight: 56,
                                flex: 1,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'a-list-values',
                                        flex: 1,
                                        bind: {
                                            html: '<div class="flex-6"><div class="a-badge a-badge-bank mr-12"><i class="md-icon-outlined">account_balance</i></div><span class=""><span class="fw-b text-truncate hbox" style="max-width: 200px;">{record.bank_name}{record.is_default ? "<i class=\'md-icon c-teal fs-18 ml-8\'>check</i>": ""}</span><span class="sm-title">{record.number_type}: {record.iban}</span></span></div><div class="flex-1 fw-b c-teal">{record.currency}</div>',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'a-actions-hover',
                                        items: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'md-icon-outlined md-icon-edit',
                                                ui: 'round tool-round-md',
                                                slug: 'settingsCompanyBankInformation',
                                                bind: {
                                                    permission: '{userPermissions}',
                                                },
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    html: 'Edit',
                                                    align: 'bc-tc?',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    allowOver: false,
                                                    closeAction: 'destroy',
                                                },
                                                handler: function (me) {
                                                    let company = me.upVM().get('currentCompany'),
                                                        disableDefault = false;

                                                    model = me.upVM().get('record');
                                                    model.getProxy().setExtraParams({
                                                        company_id: company.get('id'),
                                                    });
                                                    if (model.get('is_default')) {
                                                        disableDefault = true;
                                                    }
                                                    let dialog = Ext.create(
                                                        'Abraxa.view.settings.company.AddEditBank',
                                                        {
                                                            title: 'Edit bank',
                                                            viewModel: {
                                                                parent: me.upVM(),
                                                                data: {
                                                                    record: model,
                                                                    disableDefault: disableDefault,
                                                                    editMode: true,
                                                                },
                                                            },
                                                        }
                                                    );
                                                    dialog.show();
                                                },
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'round tool-round',
                                                iconCls: 'md-icon-outlined md-icon-delete',
                                                slug: 'settingsCompanyBankDelete',
                                                bind: {
                                                    permission: '{userPermissions}',
                                                    disabled: '{record.is_default}',
                                                },
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    html: 'Delete',
                                                    align: 'bc-tc?',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    allowOver: false,
                                                    closeAction: 'destroy',
                                                },
                                                handler: function (me) {
                                                    let store = me.upVM().get('companyBankDetails'),
                                                        offices = me.upVM().get('companyOffices'),
                                                        currentUser = me.upVM().get('currentUser'),
                                                        currentCompany = me.upVM().get('currentCompany'),
                                                        record = me.upVM().get('record');
                                                    Ext.Msg.confirm(
                                                        'Delete',
                                                        'Are you sure you would like to delete this entry?<br>All offices banks will be unassigned.',
                                                        function (answer) {
                                                            if (answer == 'yes') {
                                                                store.remove(record);
                                                                store.sync({
                                                                    success: function () {
                                                                        offices.reload();
                                                                        if (
                                                                            currentUser.getOffice() &&
                                                                            currentUser.getOffice().banks()
                                                                        ) {
                                                                            currentUser
                                                                                .getOffice()
                                                                                .banks()
                                                                                .remove(record);
                                                                            currentUser
                                                                                .getOffice()
                                                                                .banks()
                                                                                .commitChanges();
                                                                            currentUser.set('update_user', new Date());
                                                                        } else {
                                                                            if (
                                                                                currentCompany &&
                                                                                currentCompany.banks()
                                                                            ) {
                                                                                currentCompany.banks().remove(record);
                                                                                currentCompany.banks().commitChanges();
                                                                                currentUser.set(
                                                                                    'update_user',
                                                                                    new Date()
                                                                                );
                                                                            }
                                                                        }
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
                                                                margin: '0 8 0 0',
                                                                text: 'Cancel',
                                                            },
                                                            {
                                                                xtype: 'button',
                                                                itemId: 'yes',
                                                                ui: 'decline alt',
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
                        },
                    ],
                },
                {
                    xtype: 'button',
                    text: 'Add bank',
                    testId: 'settingsCompanyBankCreateTestId',
                    ui: 'normal small',
                    margin: '8 0 0 0',
                    height: 28,
                    iconCls: 'md-icon-add',
                    slug: 'settingsCompanyBankCreate',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    handler: function (me) {
                        let record = me.upVM().get('currentCompany'),
                            disableDefault = false,
                            model = Ext.create('Abraxa.model.settings.CompanyBankDetails', {
                                company_id: record.get('id'),
                                number_type: 'IBAN',
                            });

                        model.getProxy().setExtraParams({
                            company_id: record.get('id'),
                        });
                        if (me.upVM().get('companyBankDetails').getCount() === 0) {
                            model.set('is_default', true);
                            disableDefault = true;
                        }
                        let dialog = Ext.create('Abraxa.view.settings.company.AddEditBank', {
                            viewModel: {
                                parent: me.upVM(),
                                data: {
                                    record: model,
                                    disableDefault: disableDefault,
                                    editMode: false,
                                },
                            },
                        });

                        dialog.show();
                    },
                },
                {
                    xtype: 'container',
                    bind: {
                        hidden: '{currentUserType === "principal" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            padding: '16 0 0 0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 16 0',
                            html: '<h3>Preferred HUB agent</h3><div class="text-info">Choose a port agent that will be automatically assigned as the default HUB nomination.</div>',
                        },
                        {
                            xtype: 'combobox',
                            ui: 'classic filled-light',
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search agent',
                            forceSelection: true,
                            valueField: 'id',
                            displayField: 'name',
                            reference: 'preferredAgentCombo',
                            queryMode: 'local',
                            bind: {
                                store: '{agentsStore}',
                                hidden: '{currentUser.preferred_hub_agent_id ? true:false}',
                                value: '{currentUser.preferred_hub_agent_id}',
                            },
                            listeners: {
                                select: 'addPreferredHubAgent',
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-bordered-list',
                            hideMode: 'opacity',
                            bind: {
                                hidden: '{currentUser.preferred_hub_agent_id ? false:true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-list-item',
                                    minHeight: 56,
                                    flex: 1,
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'a-list-values',
                                            flex: 1,
                                            bind: {
                                                html: '<div class="flex-6"><div class="a-badge a-badge-office mr-12"><i class="md-icon-outlined">maps_home_work</i></div><span class="">{preferredAgentCombo.selection.name}<span class="fw-b text-truncate hbox" style="max-width: 200px;">{preferredAgentCombo.selection.email}</span><span class="sm-title"></span></span>',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-actions-hover',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    ui: 'round tool-round',
                                                    iconCls: 'md-icon-outlined md-icon-delete',
                                                    tooltip: {
                                                        anchorToTarget: true,
                                                        html: 'Delete',
                                                        align: 'bc-tc?',
                                                        showDelay: 0,
                                                        hideDelay: 0,
                                                        dismissDelay: 0,
                                                        allowOver: false,
                                                        closeAction: 'destroy',
                                                    },
                                                    handler: 'removePreferredHubAgent',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});

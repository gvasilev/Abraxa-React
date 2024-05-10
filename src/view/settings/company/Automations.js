Ext.define('Abraxa.view.settings.company.Automations', {
    extend: 'Ext.Container',
    xtype: 'settings.company.automations',
    testId: 'settingsCompAutomations',
    scrollable: true,
    cls: 'a-settings-main w-50',
    hidden: true,
    bind: {
        hidden: '{mainCompanyTabbar.activeTabIndex == 2  ? false: true}',
    },
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'div',
                    html: '<h1 class="fw-n">Automations</h1>',
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
                    bind: {
                        hidden: '{currentUserType == "principal" ? true : false}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            margin: '0 0 16 0',
                            bind: {
                                html: '<div class="hbox"><div class="h3">Incremental numbering</div>{(currentUserPlan == "starter") ? "<div class=\\"a-premium-link\\" style=\\"margin-left: 12px; margin-top: 14px;\\"><i class=\\"far fa-gem\\"></i>Premium feature</div>":""}</div><div class="text-info">Configure your custom File IDs in line with your organizational requirements and standards. Alternatively, your File IDs can be manually specified per individual port call.</div>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'div',
                                    fn: function (el) {
                                        let currentUserPlan = this.component.upVM().get('currentUserPlan');
                                        if (currentUserPlan == 'starter') {
                                            Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                        }
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'togglefield',
                            testId: 'settingsCompAutomationsToggleField',
                            right: 0,
                            top: 4,
                            reference: 'customFileNumberingEnabled',
                            publishes: ['value'],
                            disabled: true,
                            slug: 'settingsCompanyIncrementalNumbering',
                            bind: {
                                permission: '{userPermissions}',
                                value: '{currentCompany.custom_file_number}',
                                disabled: '{currentUserPlan == "starter" ? true : false}',
                            },
                            listeners: {
                                change: function (el, value) {
                                    let record = this.upVM().get('currentCompany');
                                    record.set('custom_file_number', value);
                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                Ext.Toast('Settings updated');
                                            },
                                        });
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-bordered-list',
                    padding: 16,
                    showNoPermissions: true,

                    slug: 'settingsCompanyIncrementalNumbering',
                    bind: {
                        hidden: '{currentUserType == "principal" ? true : false}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'formpanel',
                            testId: 'settingsCompAutomationsForm',
                            cls: 'a-general-form',
                            padding: 0,
                            flex: 1,
                            layout: {
                                type: 'hbox',
                            },
                            defaults: {
                                clearable: false,
                                labelAlign: 'top',
                                ui: 'field-xl hovered-underline',
                                disabled: true,
                                slug: 'settingsCompanyIncrementalNumbering',
                                bind: {
                                    permission: '{userPermissions}',
                                    disabled: '{customFileNumberingEnabled.value ? false : true}',
                                },
                                listeners: {
                                    // blur: 'onEmailSave',
                                    painted: function () {
                                        if (this._required) this.setError(null);
                                    },
                                    disabledchange: function () {
                                        if (this._required) this.setError(null);
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    testId: 'settingsCompPrfxField',
                                    placeholder: 'PRX-',
                                    // label: 'Prefix',
                                    name: 'prefix',
                                    width: 120,
                                    // cls: 'a-field-icon icon-rounded icon-person',
                                    bind: {
                                        value: '{customFileNumber.prefix}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    placeholder: '000000',
                                    testId: 'settingsCompSeqField',
                                    inputType: 'number',
                                    name: 'sequence',
                                    required: true,
                                    maxWidth: 140,
                                    bind: {
                                        value: '{customFileNumber.sequence}',
                                    },
                                },
                                {
                                    xtype: 'textfield',
                                    placeholder: '-SFX',
                                    testId: 'settingsCompSFXField',
                                    name: 'suffix',
                                    width: 120,
                                    bind: {
                                        value: '{customFileNumber.suffix}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'a-list-titles justify-content-start',
                            html: '<div class="px-12" style="width: 120px;">Prefix</div><div class="px-12" style="width: 140px;">Sequence</div><div class="px-12" style="width: 120px;">Suffix</div>',
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            margin: '16 0 0 0',
                            padding: 0,
                            required: false,
                            layout: {
                                type: 'hbox',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox sm-title pl-12',
                                    bind: {
                                        html: '<span>Preview:</span>&nbsp;<strong>{customFileNumber.prefix}{customFileNumber.sequence}{customFileNumber.suffix}</strong>',
                                    },
                                },
                                {
                                    xtype: 'button',
                                    text: 'Save',
                                    testId: 'settingsCompSaveBtn',
                                    ui: 'solid action',
                                    handler: 'onFileNumberSave',
                                    slug: 'settingsCompanyIncrementalNumbering',
                                    bind: {
                                        permission: '{userPermissions}',
                                        disabled:
                                            '{customFileNumberingEnabled.value && customFileNumber.dirty ? false : true}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});

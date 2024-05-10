Ext.define('Abraxa.view.settings.offices.OfficeSettings', {
    extend: 'Ext.Container',
    xtype: 'settings.offices.settings',
    hidden: true,
    scrollable: true,
    margin: 0,
    flex: 1,
    bind: {
        hidden: '{offices_tabbar.activeTabIndex == 1 ? false: true}',
    },
    viewModel: {
        stores: {
            banksWithoutOffice: {
                source: '{companyBankDetails}',
                filters: '{banksOfficeFilter}',
            },
            emailsWithoutOffice: {
                source: '{emailSettings}',
                filters: '{emailOfficeFilter}',
            },
            customFileNumbers: {
                source: '{officesGrid.selection.custom_file_numbers}',
            },
        },
        formulas: {
            officeBanks: {
                bind: {
                    bindTo: '{officesGrid.selection}',
                },
                get: function (record) {
                    if (record) {
                        let store = record.banks();
                        store.getProxy().setExtraParams({
                            company_id: record.get('company_id'),
                            office_id: record.get('id'),
                        });
                        return store;
                    }
                    return new Ext.data.Store({
                        proxy: {
                            type: 'memory',
                        },
                    });
                },
            },
            officeEmails: {
                bind: {
                    bindTo: '{officesGrid.selection}',
                },
                get: function (record) {
                    if (record) {
                        let store = record.emails();
                        store.getProxy().setExtraParams({
                            company_id: record.get('company_id'),
                            office_id: record.get('id'),
                        });
                        return store;
                    }
                    return new Ext.data.Store({
                        proxy: {
                            type: 'memory',
                        },
                    });
                },
            },
            banksOfficeFilter: {
                bind: {
                    bindTo: '{officesGrid.selection.banks}',
                },
                get: function (store) {
                    if (store) {
                        let banksWithoutOffice = this.get('banksWithoutOffice'),
                            banksInOffice = [];
                        if (banksWithoutOffice) banksWithoutOffice.clearFilter();
                        store.each(function (rec, index) {
                            if (rec) {
                                banksInOffice.push(rec.get('bank_id'));
                            }
                        });
                        return function (rec) {
                            if (!Ext.Array.contains(banksInOffice, rec.get('id'))) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            emailOfficeFilter: {
                bind: {
                    bindTo: '{officesGrid.selection.emails}',
                },
                get: function (store) {
                    if (store) {
                        let emailsWithoutOffice = this.get('emailsWithoutOffice'),
                            emailsInOffice = [];
                        if (emailsWithoutOffice) emailsWithoutOffice.clearFilter();
                        store.each(function (rec, index) {
                            if (rec) {
                                emailsInOffice.push(rec.get('email_settings_id'));
                            }
                        });
                        return function (rec) {
                            if (!Ext.Array.contains(emailsInOffice, rec.get('id'))) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            hideCustomFileIdOptions: {
                bind: {
                    bindTo: '{customFileNumbers}',
                    deep: true,
                },
                get: function (store) {
                    let data = {
                        portcall: false,
                        disbursement: false,
                    };
                    if (store) {
                        store.each(function (record) {
                            if (record.get('numerable_type') == 'portcall') data.portcall = true;

                            if (record.get('numerable_type') == 'disbursement') data.disbursement = true;
                        });
                    }
                    return data;
                },
            },
        },
    },
    cls: 'role_settings',
    items: [
        {
            xtype: 'container',
            cls: 'w-50',
            minWidth: 640,
            items: [
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
                                html: '<div class="hbox"><div class="h3">Automated numbering</div>{(currentUserPlan == "starter") ? "<div class=\\"a-premium-link\\" style=\\"margin-left: 12px; margin-top: 14px;\\"><i class=\\"far fa-gem\\"></i>Premium feature</div>":""}</div><div class="text-info">Configure automated ID sequences in line with your organizational requirements and standards.</div>',
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
                            right: 0,
                            top: 4,
                            reference: 'customOfficeFileNumberingEnabled',
                            publishes: ['value'],
                            disabled: true,
                            bind: {
                                value: '{officesGrid.selection.custom_file_number}',
                                disabled: '{currentUserPlan == "starter" ? true : false}',
                            },
                            listeners: {
                                change: function (el, value) {
                                    let record = this.upVM().get('officesGrid.selection');
                                    if (record) {
                                        record.set('custom_file_number', value);
                                        if (record.dirty) {
                                            record.save({
                                                success: function () {
                                                    Ext.toast('Settings updated');
                                                },
                                            });
                                        }
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'abraxa.componentdataview',
                    // minHeight: 90,
                    // emptyText: 'No automated sequences setup.',
                    bind: {
                        store: '{customFileNumbers}',
                        hidden: '{currentUserType == "principal" ? true : false}',
                    },
                    itemConfig: {
                        viewModel: {},
                        xtype: 'container',
                        margin: '16 0 0 0',
                        items: [
                            {
                                xtype: 'container',
                                cls: 'a-bordered-list custom_file_number',
                                padding: '8 16',
                                items: [
                                    {
                                        xtype: 'container',
                                        docked: 'top',
                                        cls: 'a-bb-100',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'space-between',
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'a-titlebar',
                                                padding: '0 16',
                                                items: [
                                                    {
                                                        xtype: 'title',
                                                        bind: {
                                                            title:
                                                                '<div class="hbox"><div class="a-badge a-badge-{record.numerable_type}"><i></i></div>' +
                                                                '<div class="a-panel-title fw-b ml-12 fs-14">{record.numerable_type:capitalize} ID</div></div>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                padding: '0 16',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'div',
                                                        cls: 'sm-title fs-13',
                                                        margin: '0 16 0 0',
                                                        bind: {
                                                            hidden: '{record.prefix ? false : true}',
                                                            html: '<span>Preview:</span>&nbsp;<strong class="c-blue">{record.prefix}{record.sequence}{record.suffix}</strong>',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        ui: 'tool round tool-md',
                                                        tooltip: {
                                                            html: 'Delete',
                                                            showDelay: 0,
                                                            hideDelay: 0,
                                                            align: 'tc-bc?',
                                                        },
                                                        iconCls: 'md-icon-outlined md-icon-delete',
                                                        handler: function (btn) {
                                                            let record = btn.upVM().get('record'),
                                                                store = btn.upVM().get('customFileNumbers');

                                                            Ext.Msg.confirm(
                                                                'Delete',
                                                                'Are you sure you would like to delete this sequence?<br>Existing records will keep their sequence number.',
                                                                function (answer) {
                                                                    if (answer != 'yes') return;
                                                                    store.remove(record);
                                                                    store.sync({
                                                                        success: function () {
                                                                            Ext.toast('Sequence deleted');
                                                                        },
                                                                    });
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
                                                                        testId: 'deleteSequenceButtonTestIdSettingsConfirm',
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
                                    {
                                        xtype: 'formpanel',
                                        cls: 'a-general-form',
                                        padding: 0,
                                        flex: 1,
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'space-between',
                                        },
                                        items: [
                                            {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                defaults: {
                                                    clearable: false,
                                                    labelAlign: 'top',
                                                    ui: 'field-xl hovered-underline',
                                                    disabled: true,
                                                    bind: {
                                                        disabled:
                                                            '{customOfficeFileNumberingEnabled.value ? false : true}',
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
                                                        cls: 'testIdPrefixFakeClassOfficeSettings',
                                                        placeholder: 'PRX-',
                                                        // label: 'Prefix',
                                                        name: 'prefix',
                                                        width: 120,
                                                        // cls: 'a-field-icon icon-rounded icon-person',
                                                        bind: {
                                                            value: '{record.prefix}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'testIdSequenceFakeClassOfficeSettings',
                                                        placeholder: '000000',
                                                        inputType: 'number',
                                                        name: 'sequence',
                                                        required: true,
                                                        maxWidth: 140,
                                                        bind: {
                                                            value: '{record.sequence}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        cls: 'testIdSuffixFakeClassOfficeSettings',
                                                        placeholder: '-SFX',
                                                        name: 'suffix',
                                                        width: 120,
                                                        bind: {
                                                            value: '{record.suffix}',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'button',
                                                cls: 'testIdSaveSequenceFakeClassOfficeSettings',
                                                text: 'Save',
                                                ui: 'solid action',
                                                bind: {
                                                    disabled:
                                                        '{customOfficeFileNumberingEnabled.value && record.dirty ? false : true}',
                                                },
                                                handler: function (btn) {
                                                    let form = btn
                                                        .up('container[cls~=custom_file_number]')
                                                        .down('formpanel');
                                                    record = btn.upVM().get('record');

                                                    //update
                                                    if (form.validate()) {
                                                        let values = form.getValues(),
                                                            regExp = /^0[0-9].*$/;

                                                        record.set(
                                                            'pad',
                                                            regExp.test(values.sequence) ? values.sequence.length : null
                                                        );
                                                        record.save({
                                                            success: function (batch, opt) {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                            failure: function (batch, operations) {
                                                                Ext.Msg.alert(
                                                                    'Something went wrong',
                                                                    'Cannot update settings!'
                                                                );
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-list-titles justify-content-start',
                                        html: '<div class="px-12" style="width: 120px;">Prefix</div><div class="px-12" style="width: 140px;">Sequence</div><div class="px-12" style="width: 120px;">Suffix</div>',
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    xtype: 'button',
                    testId: 'addSequenceButtonTestIdSettings',
                    text: 'Add sequence',
                    ui: 'normal small',
                    margin: '8 0 0 0',
                    height: 28,
                    iconCls: 'md-icon-add',
                    // arrow: false,
                    bind: {
                        hidden: '{currentUserType == "principal" ? true : false}',
                        disabled:
                            '{(hideCustomFileIdOptions.portcall && hideCustomFileIdOptions.disbursement) || !customOfficeFileNumberingEnabled.value ? true : false}',
                    },
                    menu: {
                        defaults: {
                            handler: function (btn) {
                                let store = this.upVM().get('customFileNumbers'),
                                    office = this.upVM().get('officesGrid.selection');

                                store.add({
                                    numerable_type: btn.type,
                                    office_id: office.get('id'),
                                });
                            },
                        },
                        items: [
                            {
                                text: 'File ID',
                                testId: 'addSequenceButtonTestIdSettingsFileId',
                                type: 'portcall',
                                bind: {
                                    hidden: '{hideCustomFileIdOptions.portcall}',
                                },
                            },
                            {
                                text: 'Disbursement ID',
                                testId: 'addSequenceButtonTestIdSettingsDisbursementId',
                                type: 'disbursement',
                                bind: {
                                    hidden: '{hideCustomFileIdOptions.disbursement}',
                                },
                            },
                        ],
                    },
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'w-50',
            minWidth: 640,
            padding: '24 0 0 0',
            html: '<hr>',
        },
        {
            xtype: 'container',
            cls: 'w-50',
            minWidth: 640,
            items: [
                {
                    xtype: 'div',
                    margin: '0 0 16 0',
                    html: '<h3>Bank information</h3><div class="text-info">Set up your bank account details for documents where you<br>can show your bank information (i.e. invoices).</div>',
                },
                {
                    xtype: 'container',
                    cls: 'a-bordered-list',
                    items: [
                        {
                            xtype: 'div',
                            hidden: true,
                            bind: {
                                hidden: '{officeBanks.count ? false:true}',
                            },
                            cls: 'a-list-titles',
                            html: '<div class="flex-6">Name</div><div class="flex-1">Currency</div><div class="a-actions-hover"></div>',
                        },
                        {
                            xtype: 'abraxa.formlist',
                            bind: {
                                store: '{officeBanks}',
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
                                            html: '<div class="flex-6"><div class="a-badge a-badge-bank mr-12"><i class="md-icon-outlined">account_balance</i></div><span class=""><span class="fw-b text-truncate hbox" style="max-width: 200px;">{record.bank.bank_name}{record.is_default ? "<i class=\'md-icon c-teal fs-18 ml-8\'>check</i>": ""}</span><span class="sm-title">{record.bank.number_type}: {record.bank.iban}</span></span></div><div class="flex-1 fw-b c-teal">{record.bank.currency}</div>',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'a-actions-hover',
                                        items: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'md-icon-more-horiz',
                                                ui: 'tool-md round',
                                                hidden: false,
                                                bind: {
                                                    hidden: '{record.is_default ? true:false}',
                                                },
                                                arrow: false,
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    align: 'bc-tc?',
                                                    html: 'More actions',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    closeAction: 'destroy',
                                                },
                                                menu: {
                                                    cls: 'a-main-edit-menu',
                                                    ui: 'has-icons medium',
                                                    items: [
                                                        {
                                                            text: 'Set as default',
                                                            hidden: true,
                                                            bind: {
                                                                hidden: '{record.is_default ? true:false}',
                                                            },
                                                            iconCls: 'md-icon-outlined md-icon-done-all',
                                                            handler: function (me) {
                                                                Ext.Msg.confirm(
                                                                    'Confirmation',
                                                                    'Are you sure you want to set as default bank?',
                                                                    function (answer) {
                                                                        if (answer == 'yes') {
                                                                            let store = me.upVM().get('officeBanks'),
                                                                                record = me.upVM().get('record'),
                                                                                defaultRecord = store.findRecord(
                                                                                    'is_default',
                                                                                    true,
                                                                                    0,
                                                                                    false,
                                                                                    false,
                                                                                    true
                                                                                );
                                                                            if (defaultRecord) {
                                                                                defaultRecord.set('is_default', false);
                                                                            }
                                                                            record.set('is_default', 1);
                                                                            store.sync({
                                                                                success: function () {
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
                                                                            text: 'No',
                                                                        },
                                                                        {
                                                                            xtype: 'button',
                                                                            itemId: 'yes',
                                                                            enableToggle: true,
                                                                            ui: 'normal loading',
                                                                            text: 'Yes',
                                                                        },
                                                                    ]
                                                                );
                                                            },
                                                        },
                                                        {
                                                            text: 'Unassign',
                                                            iconCls: 'md-icon-outlined md-icon-delete',
                                                            ui: 'decline',
                                                            hidden: false,
                                                            bind: {
                                                                hidden: '{record.is_default ? true:false}',
                                                            },
                                                            separator: true,
                                                            handler: function (button, el, data) {
                                                                Ext.Msg.confirm(
                                                                    'Unassign',
                                                                    'Do you want to unassign this bank?',
                                                                    function (answer) {
                                                                        if (answer == 'yes') {
                                                                            let store = button
                                                                                    .upVM()
                                                                                    .get('officeBanks'),
                                                                                record = this.upVM().get('record');
                                                                            store.remove(record);
                                                                            store.sync({
                                                                                success: function () {
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
                                                                            enableToggle: true,
                                                                            ui: 'decline alt loading',
                                                                            text: 'Unassign',
                                                                        },
                                                                    ]
                                                                );
                                                            },
                                                        },
                                                    ],
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
                    testId: 'addBankButtonTestIdSettings',
                    text: 'Assign bank account',
                    ui: 'normal small',
                    margin: '8 0 0 0',
                    height: 28,
                    iconCls: 'md-icon-add',
                    handler: function (me) {
                        Ext.create('Abraxa.view.settings.offices.AssignOfficeBank', {
                            viewModel: {
                                parent: me.upVM(),
                            },
                        }).show();
                    },
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'w-50',
            minWidth: 640,
            padding: '24 0 0 0',
            html: '<hr>',
        },
        {
            xtype: 'container',
            cls: 'w-50',
            minWidth: 640,
            items: [
                {
                    xtype: 'div',
                    margin: '0 0 16 0',
                    html: '<h3>Email accounts</h3><div class="text-info">Setting up your email settings allows you to send emails via your own domain (i.e. reporting email).</div>',
                },
                {
                    xtype: 'container',
                    cls: 'a-bordered-list',
                    items: [
                        {
                            xtype: 'div',
                            hidden: true,
                            bind: {
                                hidden: '{officeEmails.count ? false:true}',
                            },
                            cls: 'a-list-titles',
                            html: '<div class="flex-3">Email</div>',
                        },
                        {
                            xtype: 'abraxa.formlist',
                            bind: {
                                store: '{officeEmails}',
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
                                            html: '<div class="flex-3"><div class="a-badge a-badge-email mr-12"><i class="md-icon-outlined">alternate_email</i></div><span class="fw-b text-truncate">{record.email.email}</span>{record.is_default ? "<i class=\'md-icon c-teal fs-18 ml-8\'>check</i>": ""}</div>',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'a-actions-hover',
                                        items: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'md-icon-more-horiz',
                                                ui: 'tool-md round',
                                                arrow: false,
                                                hidden: false,
                                                bind: {
                                                    hidden: '{record.is_default ? true:false}',
                                                },
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    align: 'bc-tc?',
                                                    html: 'More actions',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    closeAction: 'destroy',
                                                },
                                                menu: {
                                                    cls: 'a-main-edit-menu',
                                                    ui: 'has-icons medium',
                                                    items: [
                                                        {
                                                            text: 'Set as default',
                                                            hidden: true,
                                                            bind: {
                                                                hidden: '{record.is_default ? true:false}',
                                                            },
                                                            iconCls: 'md-icon-outlined md-icon-done-all',
                                                            handler: function (me) {
                                                                Ext.Msg.confirm(
                                                                    'Confirmation',
                                                                    'Are you sure you want to set as default email?',
                                                                    function (answer) {
                                                                        if (answer == 'yes') {
                                                                            let store = me.upVM().get('officeEmails'),
                                                                                record = me.upVM().get('record'),
                                                                                defaultRecord = store.findRecord(
                                                                                    'is_default',
                                                                                    true,
                                                                                    0,
                                                                                    false,
                                                                                    false,
                                                                                    true
                                                                                );
                                                                            if (defaultRecord) {
                                                                                defaultRecord.set('is_default', false);
                                                                            }
                                                                            record.set('is_default', 1);
                                                                            store.sync({
                                                                                success: function () {
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
                                                                            text: 'No',
                                                                        },
                                                                        {
                                                                            xtype: 'button',
                                                                            itemId: 'yes',
                                                                            enableToggle: true,
                                                                            ui: 'normal loading',
                                                                            text: 'Yes',
                                                                        },
                                                                    ]
                                                                );
                                                            },
                                                        },
                                                        {
                                                            text: 'Unassign',
                                                            iconCls: 'md-icon-outlined md-icon-delete',
                                                            ui: 'decline',
                                                            hidden: false,
                                                            bind: {
                                                                hidden: '{record.is_default ? true:false}',
                                                            },
                                                            separator: true,
                                                            handler: function (button, el, data) {
                                                                Ext.Msg.confirm(
                                                                    'Unassign',
                                                                    'Do you want to unassign this email?',
                                                                    function (answer) {
                                                                        if (answer == 'yes') {
                                                                            let store = button
                                                                                    .upVM()
                                                                                    .get('officeEmails'),
                                                                                record = this.upVM().get('record');
                                                                            store.remove(record);
                                                                            store.sync({
                                                                                success: function () {
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
                                                                            enableToggle: true,
                                                                            ui: 'decline alt loading',
                                                                            text: 'Unassign',
                                                                        },
                                                                    ]
                                                                );
                                                            },
                                                        },
                                                    ],
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
                    testId: 'addEmailButtonTestIdSettings',
                    text: 'Assign email',
                    ui: 'normal small',
                    margin: '8 0 0 0',
                    height: 28,
                    iconCls: 'md-icon-add',
                    handler: function (me) {
                        Ext.create('Abraxa.view.settings.offices.AssignOfficeEmail', {
                            viewModel: {
                                parent: me.upVM(),
                            },
                        }).show();
                    },
                },
            ],
        },
    ],
});

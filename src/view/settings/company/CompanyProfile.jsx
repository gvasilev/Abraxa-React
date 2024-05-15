import '../../../core/components/AbraxaCountryCombo.jsx';
import '../../../core/components/Abraxa.CityCombo.jsx';
import '../../../core/components/Abraxa.EmailField.jsx';
import './AssignBanksToPublicProfile.jsx';
Ext.define('Abraxa.view.settings.company.CompanyProfile', {
    extend: 'Ext.Container',
    xtype: 'settings.company.profile',
    testId: 'settingsCompProfile',
    hidden: true,
    bind: {
        hidden: '{mainCompanyTabbar.activeTabIndex == 0 ? false: true}',
    },
    flex: 1,
    layout: 'vbox',
    scrollable: true,
    items: [
        {
            xtype: 'container',
            cls: 'a-company-footer',
            docked: 'bottom',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                    bind: {
                        // TODO: Check why currentCompany.updated_at is not updated.
                        html: '<span class="text-info">Last updated:</span> {currentCompany.updated_at:date("d M Y")}',
                    },
                },
                {
                    xtype: 'button',
                    ui: 'action',
                    enableToggle: true,
                    text: 'Save',
                    role: 'donebutton',
                    handler: function (me) {
                        let record = me.upVM().get('currentCompany');
                        if (record.dirty) {
                            record.save({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function failure() {
                                    Ext.Msg.alert('Something went wrong', 'Could not update company.');
                                },
                            });
                        }
                        // Ext.toast('Form saved', 1500);
                        // TODO: What to do here, store is already synced?

                        // let store = me.upVM().get('companyBankDetails'),
                        //     currentUser = me.upVM().get('currentUser'),
                        //     record = me.upVM().get('record');

                        // console.log('Save!!!!!!!!');
                        // console.log(record);
                        // console.log(store);

                        // store.sync({
                        //     success: function () {
                        //         currentUser.set(
                        //             'update_user',
                        //             new Date()
                        //         );
                        //         Ext.toast('Bank removed from public profile', 1500);
                        //     },
                        //     failure: function (batch, operations) {
                        //         Ext.Msg.alert('Something went wrong', 'Cannot update user');
                        //     }
                        // });
                    },
                },
            ],
        },
    ],
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    cls: 'a-settings-main w-75',
                    items: [
                        {
                            xtype: 'div',
                            html: '<h1 class="fw-n">Company profile</h1>',
                        },
                        {
                            xtype: 'div',
                            html: '<p class="text-info mt-0">Set your company details & logo for places where you can show your branding.<br>These changes will help you quickly choose brand options when creating public facing content (i.e. reporting e-mails).</p>',
                        },
                        {
                            xtype: 'container',
                            cls: 'bordered border-radius',
                            padding: '0 24',
                            slug: 'settingsCompanyProfile',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h3 class="mt-16">Company verification</h3><div class="text-info">In an effort to keep Abraxa a safe and clean place for its users, we need to verify your company.<br>Please fill in your company information and we will do our best to verify your company as soon as possible.</div>',
                                },
                                {
                                    xtype: 'container',
                                    padding: '16 0',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'verified.div',
                                            right: null,
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'hbox',
                                            marin: '16 0 0 0',
                                            hidden: true,
                                            bind: {
                                                hidden: '{currentCompany.verified ? false:true}',
                                            },
                                            html: '<div class="a-status-badge rounded filled a-has-icon status-verified"><i class="md-icon">verified_user</i><span>Verified company</span></div>',
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Verify',
                                            testId: 'settingsCompProfileVerifyBtn',
                                            hidden: false,
                                            bind: {
                                                hidden: '{(pendingValidation == "verified" || pendingValidation == "pending") ? true:false}',
                                            },
                                            ui: 'action',
                                            handler: function (me) {
                                                let vm = this.upVM(),
                                                    currentCompany = vm.get('currentCompany'),
                                                    dialog = Ext.create('Abraxa.view.settings.company.VerifyCompany', {
                                                        viewModel: {
                                                            parent: vm,
                                                            data: {
                                                                record: Ext.create(
                                                                    'Abraxa.model.settings.company.Verification',
                                                                    {
                                                                        company_id: currentCompany.get('id'),
                                                                        company_name: currentCompany.get('name'),
                                                                        registered_name: currentCompany.get('name'),
                                                                        country: currentCompany.get('country'),
                                                                        city: currentCompany.get('city'),
                                                                        company_email: currentCompany.get('email'),
                                                                        full_registered_address:
                                                                            currentCompany.get('address'),
                                                                        vat_number: currentCompany.get('vat'),
                                                                    }
                                                                ),
                                                                file: null,
                                                                is_global: false,
                                                                uploadedFile: null,
                                                            },
                                                        },
                                                    });
                                                dialog.show();
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            showNoPermissions: true,
                            testId: 'settingsCompProfileContainer',
                            slug: 'settingsCompanyProfile',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-company-heading',
                                    layout: {
                                        type: 'hbox',
                                        // align: 'middle'
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    cls: 'fw-b fs-14 mb-16',
                                                    html: 'Company logo',
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-company-logo',
                                                    items: [
                                                        {
                                                            xtype: 'image',
                                                            testId: 'settingsCompProfileLogoImgCmp',
                                                            itemId: 'originalCompanyLogo',
                                                            bind: {
                                                                src: '{selectedCompanyLogo}',
                                                            },
                                                            mode: 'image',
                                                            align: 'center',
                                                        },
                                                        {
                                                            xtype: 'filefield',
                                                            testId: 'settingsCompProfileUploadLogoField',
                                                            ui: 'default',
                                                            cls: 'a-edit-image',
                                                            accept: 'image',
                                                            name: 'originalLogo',
                                                            slug: 'settingsCompanyProfile',
                                                            bind: {
                                                                permission: '{userPermissions}',
                                                            },
                                                            listeners: {
                                                                change: 'uploadFile',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            testId: 'settingsCompProfileDeleteLogoField',
                                                            cls: 'a-delete-image',
                                                            iconCls: 'md-icon-close',
                                                            ui: 'round default',
                                                            slug: 'settingsCompanyProfile',
                                                            bind: {
                                                                permission: '{userPermissions}',
                                                            },
                                                            tooltip: {
                                                                showOnTap: true,
                                                                html: 'Remove image',
                                                                align: 'bc-tc?',
                                                                showDelay: 0,
                                                                hideDelay: 0,
                                                                dismissDelay: 0,
                                                                allowOver: false,
                                                                closeAction: 'destroy',
                                                            },
                                                            handler: function () {
                                                                let record = this.upVM().get('currentCompany');
                                                                if (record) {
                                                                    record.set('logo', '');
                                                                    record.save({
                                                                        success: function (batch, opt) {
                                                                            Ext.toast('Record updated', 1000);
                                                                        },
                                                                        failure: function (batch, operations) {
                                                                            Ext.Msg.alert(
                                                                                'Something went wrong',
                                                                                'Cannot update user'
                                                                            );
                                                                        },
                                                                    });
                                                                }
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            margin: '0 0 0 32',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    cls: 'text-center',
                                                    cls: 'fw-b fs-14 mb-16',
                                                    html: 'Square logo',
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-company-badge',
                                                    layout: {
                                                        type: 'vbox',
                                                        align: 'center',
                                                        pack: 'center',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'image',
                                                            itemId: 'squareCompanyLogo',
                                                            testId: 'settingsCompProfileSquareLogoImgCmp',
                                                            bind: {
                                                                src: '{selectedCompanySquareLogo}',
                                                            },
                                                            mode: 'image',
                                                            align: 'center',
                                                            height: 80,
                                                            width: 80,
                                                        },
                                                        {
                                                            xtype: 'filefield',
                                                            testId: 'settingsCompProfileUploadSquareLogoField',
                                                            ui: 'default',
                                                            cls: 'a-edit-image',
                                                            accept: 'image',
                                                            name: 'squareCompanyLogo',
                                                            slug: 'settingsCompanyProfile',
                                                            bind: {
                                                                permission: '{userPermissions}',
                                                            },
                                                            listeners: {
                                                                change: 'uploadFile',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            cls: 'a-delete-image',
                                                            testId: 'settingsCompProfileDeleteSquareLogoField',
                                                            right: 0,
                                                            top: 0,
                                                            iconCls: 'md-icon-close',
                                                            ui: 'round default',
                                                            slug: 'settingsCompanyProfile',
                                                            bind: {
                                                                permission: '{userPermissions}',
                                                            },
                                                            tooltip: {
                                                                showOnTap: true,
                                                                html: 'Remove image',
                                                                align: 'bc-tc?',
                                                                showDelay: 0,
                                                                hideDelay: 0,
                                                                dismissDelay: 0,
                                                                allowOver: false,
                                                                closeAction: 'destroy',
                                                            },
                                                            handler: function () {
                                                                let record = this.upVM().get('currentCompany');
                                                                if (record) {
                                                                    record.set('square_logo', '');
                                                                    record.save({
                                                                        success: function (batch, opt) {
                                                                            Ext.toast('Record updated', 1000);
                                                                        },
                                                                        failure: function (batch, operations) {
                                                                            Ext.Msg.alert(
                                                                                'Something went wrong',
                                                                                'Cannot update user'
                                                                            );
                                                                        },
                                                                    });
                                                                }
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
                                    cls: 'a-company-general-data general_data_container',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            cls: 'a-field-company-name',
                                            ui: 'field-xl no-border classic',
                                            label: 'Company name',
                                            clearable: false,
                                            placeholder: 'Company name',
                                            testId: 'settingsCompProfileCompanyNameField',
                                            bind: {
                                                value: '{currentCompany.name}',
                                            },
                                            disabled: true,
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-general-form',
                                            defaults: {
                                                clearable: false,
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                                listeners: {
                                                    blur: function (me) {
                                                        let record = me.upVM().get('currentCompany');
                                                        if (record.dirty) {
                                                            record.save({
                                                                success: function () {
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                                failure: function failure() {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not update company.'
                                                                    );
                                                                },
                                                            });
                                                        }
                                                    },
                                                },
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    height: 42,
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'middle',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            width: 160,
                                                            style: 'color: #607d8b',
                                                            html: 'Type',
                                                        },
                                                        {
                                                            xtype: 'div',
                                                            bind: {
                                                                cls: 'a-status-badge rounded a-status-{currentCompany.type} no-border',
                                                                html: '{currentCompany.type:capitalize}',
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'country.combo',
                                                    label: 'Country',
                                                    testId: 'settingsCompProfileCountryField',
                                                    placeholder: 'Choose country',
                                                    cls: 'a-field-icon icon-rounded icon-public',
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.country}',
                                                    },
                                                    triggers: {
                                                        search: false,
                                                    },
                                                    listeners: {
                                                        change: function (el, countryId, oldValue) {
                                                            let cityStore = Ext.getStore('cityStore');
                                                            if (countryId) {
                                                                cityStore
                                                                    .getProxy()
                                                                    .setUrl(
                                                                        Env.ApiEndpoint +
                                                                            'countries/' +
                                                                            countryId +
                                                                            '/cities'
                                                                    );
                                                                cityStore.load();
                                                            } else {
                                                                el.upVM().get('currentCompany').set('city', null);
                                                                el.upVM().get('currentCompany').set('city_name', null);
                                                            }
                                                        },
                                                        select: function (me, selection) {
                                                            if (selection) {
                                                                if (
                                                                    me
                                                                        .upVM()
                                                                        .get('currentCompany')
                                                                        .get('country_name') !=
                                                                    selection.get('country_name')
                                                                ) {
                                                                    me.upVM()
                                                                        .get('currentCompany')
                                                                        .set(
                                                                            'country_name',
                                                                            selection.get('country_name')
                                                                        );
                                                                }
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'city.combo',
                                                    label: 'City',
                                                    testId: 'settingsCompProfileCityField',
                                                    placeholder: 'Enter city',
                                                    required: false,
                                                    disabled: false,
                                                    cls: 'a-field-icon icon-rounded icon-location_city',
                                                    triggers: {
                                                        search: false,
                                                    },
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.city}',
                                                    },
                                                    listeners: {
                                                        select: function (me, selection) {
                                                            if (selection) {
                                                                me.upVM()
                                                                    .get('currentCompany')
                                                                    .set('city_name', selection.get('city_name'));
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Address',
                                                    testId: 'settingsCompProfileAddressField',
                                                    placeholder: 'Company address',
                                                    cls: 'a-field-icon icon-rounded icon-location',
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.address}',
                                                    },
                                                },
                                                {
                                                    xtype: 'abraxa.phonefield',
                                                    label: 'Phone',
                                                    testId: 'settingsCompProfilePhoneField',
                                                    placeholder: 'Phone number',
                                                    cls: 'a-field-icon icon-rounded icon-phone',
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.phone}',
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Fax',
                                                    testId: 'settingsCompProfileFaxField',
                                                    placeholder: 'Fax number',
                                                    cls: 'a-field-icon icon-rounded icon-print',
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.fax}',
                                                    },
                                                },
                                                {
                                                    xtype: 'abraxa.emailfield',
                                                    label: 'Email',
                                                    testId: 'settingsCompProfileEmailField',
                                                    placeholder: 'Email address',
                                                    cls: 'a-field-icon icon-rounded icon-email',
                                                    disabled: true,
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.email}',
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Website',
                                                    testId: 'settingsCompProfileWebsiteField',
                                                    cls: 'a-field-icon icon-rounded icon-link',
                                                    placeholder: 'http://',
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.website}',
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'VAT',
                                                    testId: 'settingsCompProfileVATField',
                                                    cls: 'a-field-icon icon-rounded icon-short',
                                                    placeholder: 'Enter VAT',
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.vat}',
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    label: 'Trage reg.',
                                                    testId: 'settingsCompProfileTradeReqField',
                                                    cls: 'a-field-icon icon-rounded icon-short',
                                                    placeholder: 'Enter Trade reg.',
                                                    slug: 'settingsCompanyProfile',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        value: '{currentCompany.trade_reg}',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    bind: {
                                        hidden: '{currentUserType == "principal" ? true : false}',
                                    },
                                    cls: 'a-company-bank-accounts',
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'fw-b fs-16 mb-16',
                                            html: 'Bank accounts',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'text-info mb-8',
                                            html: 'Set up your bank accounts details as visible to others.',
                                        },
                                        {
                                            xtype: 'list',
                                            bind: {
                                                store: {
                                                    bindTo: '{publicBankDetails}',
                                                },
                                            },
                                            itemConfig: {
                                                viewModel: true,
                                                xtype: 'container',
                                                cls: 'a-bordered-list a-bank-details-item',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                    pack: 'space-between',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-display-item',
                                                        margin: '0 8 0 0',
                                                        flex: 1.5,
                                                        layout: {
                                                            type: 'vbox',
                                                        },
                                                        defaults: {
                                                            xtype: 'div',
                                                        },
                                                        items: [
                                                            {
                                                                html: 'Bank name',
                                                                cls: 'a-display-label fs-12',
                                                            },
                                                            {
                                                                cls: 'a-display-value fw-b',
                                                                bind: {
                                                                    html: '{record.bank_name || "<span class=\'a-placeholder\'>---</span>"}',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-display-item',
                                                        margin: '0 8 0 0',
                                                        flex: 1,
                                                        layout: {
                                                            type: 'vbox',
                                                        },
                                                        defaults: {
                                                            xtype: 'div',
                                                        },
                                                        items: [
                                                            {
                                                                html: 'Currency',
                                                                cls: 'a-display-label fs-12',
                                                            },
                                                            {
                                                                cls: 'a-display-value fw-b',
                                                                bind: {
                                                                    html: '{record.currency || "<span class=\'a-placeholder\'>---</span>"}',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-display-item',
                                                        margin: '0 8 0 0',
                                                        flex: 1.5,
                                                        layout: {
                                                            type: 'vbox',
                                                        },
                                                        defaults: {
                                                            xtype: 'div',
                                                        },
                                                        items: [
                                                            {
                                                                html: 'IBAN',
                                                                cls: 'a-display-label fs-12',
                                                            },
                                                            {
                                                                cls: 'a-display-value',
                                                                bind: {
                                                                    html: '{record.iban || "<span class=\'a-placeholder\'>---</span>"}',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-bank-details-actions',
                                                        flex: 1,
                                                        layout: {
                                                            type: 'hbox',
                                                            align: 'middle',
                                                            pack: 'end',
                                                        },
                                                        items: [
                                                            // TODO: Expires is currently postponed.

                                                            // {
                                                            //     xtype: 'container',
                                                            //     layout: {
                                                            //         type: 'hbox',
                                                            //         align: 'middle',
                                                            //     },
                                                            //     items: [
                                                            //         {
                                                            //             xtype: 'div',
                                                            //             cls: 'c-blue-grey fs-13',
                                                            //             html: 'Expires in <b>38 days</b>'
                                                            //         },
                                                            //         {
                                                            //             xtype: 'div',
                                                            //             cls: 'hbox ml-4 cursor-pointer',
                                                            //             html: '<i class="md-icon md-16">info</i>',
                                                            //             tooltip: {
                                                            //                 anchorToTarget: true,
                                                            //                 anchor: true,
                                                            //                 html: 'Last validated by G. Vasilev on 24 Sep - 10:54',
                                                            //                 align: 'bc-tc?',
                                                            //                 showDelay: 0,
                                                            //                 hideDelay: 0,
                                                            //                 dismissDelay: 0,
                                                            //                 allowOver: false,
                                                            //                 closeAction: 'destroy',
                                                            //             },
                                                            //         }
                                                            //     ]
                                                            // },
                                                            // {
                                                            //     xtype: 'button',
                                                            //     iconCls: 'md-icon md-icon-verified-user',
                                                            //     ui: 'bg-solid-teal-500',
                                                            //     text: 'Validate'
                                                            // },
                                                            {
                                                                xtype: 'div',
                                                                cls: 'a-sep-action',
                                                            },
                                                            {
                                                                xtype: 'button',
                                                                ui: 'tool-md round',
                                                                iconCls: 'md-icon md-icon-delete',
                                                                slug: 'settingsCompanyPublicBankDelete',
                                                                testId: 'settingsCompanyPublicBankDelete',
                                                                tooltip: {
                                                                    anchorToTarget: true,
                                                                    anchor: true,
                                                                    html: 'Remove',
                                                                    align: 'bc-tc?',
                                                                    showDelay: 0,
                                                                    hideDelay: 0,
                                                                    dismissDelay: 0,
                                                                    allowOver: false,
                                                                    closeAction: 'destroy',
                                                                },
                                                                handler: function (me) {
                                                                    let store = me.upVM().get('companyBankDetails'),
                                                                        currentUser = me.upVM().get('currentUser'),
                                                                        record = me.upVM().get('record');

                                                                    Ext.Msg.confirm(
                                                                        'Remove',
                                                                        'Are you sure you would like to remove this bank from public profile?',
                                                                        function (answer) {
                                                                            if (answer == 'yes') {
                                                                                record.set('is_public', 0);

                                                                                store.sync({
                                                                                    success: function () {
                                                                                        currentUser.set(
                                                                                            'update_user',
                                                                                            new Date()
                                                                                        );
                                                                                        Ext.toast(
                                                                                            'Bank removed from public profile',
                                                                                            1500
                                                                                        );
                                                                                    },
                                                                                    failure: function (
                                                                                        batch,
                                                                                        operations
                                                                                    ) {
                                                                                        Ext.Msg.alert(
                                                                                            'Something went wrong',
                                                                                            'Cannot update user'
                                                                                        );
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
                                                                                text: 'Remove',
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
                                        {
                                            xtype: 'button',
                                            text: 'Assign bank account',
                                            ui: 'normal small',
                                            iconCls: 'md-icon-add',
                                            testId: 'settingsCompanyBankAssignTestId',
                                            ui: 'normal small',
                                            iconCls: 'md-icon-add',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let dialog = Ext.create(
                                                    'Abraxa.view.settings.company.AssignBanksToPublicProfile',
                                                    {
                                                        viewModel: {
                                                            parent: me.upVM(),
                                                        },
                                                    }
                                                );

                                                dialog.show();
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    bind: {
                                        hidden: '{currentUserType == "principal" ? true : false}',
                                    },
                                    cls: 'a-company-about',
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'fw-b fs-16 mb-16',
                                            html: 'About us',
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-instructions-container a-froala-fix',
                                            items: [
                                                {
                                                    xtype: 'froalaeditorfield',
                                                    margin: '0 0 0 0',
                                                    name: 'body',
                                                    label: false,
                                                    shadow: false,
                                                    flex: 1,
                                                    labelAlign: 'top',
                                                    flex: 1,
                                                    ui: 'froala-classic',
                                                    editor: {
                                                        autofocus: true,
                                                        attribution: false,
                                                        quickInsertEnabled: false,
                                                        theme: 'royal',
                                                        pastePlain: true,
                                                        // enter: this.ENTER_BR,
                                                        imagePaste: false,
                                                        height: 180,
                                                        charCounterCount: false,
                                                        toolbarButtons: [
                                                            'bold',
                                                            'italic',
                                                            'underline',
                                                            'fontSize',
                                                            'backgroundColor',
                                                            'textColor',
                                                            'formatOL',
                                                            'formatUL',
                                                        ],
                                                    },
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            // Ugly fix
                                                            fn: function fn(me) {
                                                                const component = this.component;
                                                                setTimeout(() => {
                                                                    Ext.select(
                                                                        '.fr-element.fr-view'
                                                                    ).elements[0].focus();
                                                                }, 0);
                                                            },
                                                        },
                                                    },
                                                    bind: {
                                                        value: '{currentCompany.notes}',
                                                    },
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

import '../../../core/components/AbraxaPhoneField.jsx';
import '../../../core/components/AbraxaComponentDataview.jsx';
import '../../common/combo/PortsServed.jsx';
import '../../../core/components/AbraxaCountryCombo.jsx';
import '../../../core/components/Abraxa.CityCombo.jsx';
import '../../../core/components/combo/OrganizationCombo.jsx';
import './financials/overview/CreateReportingCurrency.jsx';

Ext.define('Abraxa.view.cdb.company.Summary', {
    extend: 'Ext.Container',
    margin: 0,
    flex: 1,
    xtype: 'cdb.company.summary',
    testId: 'cdbCompSummary',
    controller: 'cdb.company.controller',
    cls: 'a-cdb-summary',
    scrollable: 'y',
    layout: 'hbox',
    weighted: true,
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            testId: 'cdbCompSummaryTitleBar',
            minHeight: 64,
            docked: 'top',
            weight: 2,
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: 'Overview',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            width: 540,
            docked: 'left',
            scrollable: 'y',
            cls: 'a-br-100',
            weight: 1,
            items: [
                {
                    xtype: 'formpanel',
                    padding: 0,
                    margin: 0,
                    itemId: 'mainForm',
                    testId: 'cdbCompSummaryMainForm',
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'container',
                                    padding: '8 24 0 24',
                                    showNoPermissions: true,
                                    slug: 'cdbProfileCompanyInformation',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    defaults: {
                                        labelAlign: 'left',
                                        clearable: false,
                                        ui: 'classic hovered-border',
                                        slug: 'cdbProfileCompanyInformation',
                                        bind: {
                                            permission: '{userPermissions}',
                                        },
                                        listeners: {
                                            blur: 'saveObjectRecordOnFieldBlur',
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            placeholder: 'Enter company name',
                                            testId: 'cdbCompSummaryMCompanyNameField',
                                            bind: {
                                                permission: '{userPermissions}',
                                                value: '{object_record.org_name}',
                                            },
                                        },
                                        {
                                            xtype: 'emailfield',
                                            validators: 'email',
                                            label: 'Email',
                                            placeholder: 'Enter email address',
                                            testId: 'cdbCompSummaryEmailField',
                                            cls: 'a-field-icon icon-email icon-rounded',
                                            bind: {
                                                value: '{object_record.org_email}',
                                                permission: '{userPermissions}',
                                            },
                                            listeners: {
                                                blur: function (field) {
                                                    let record = field.upVM().get('object_record');
                                                    if (!field.isValid()) {
                                                        record.reject();
                                                        Ext.Msg.alert('Oops', 'Invalid email address!');
                                                        return;
                                                    }

                                                    field.lookupController().saveObjectRecordOnFieldBlur(field);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            defaults: {
                                                labelAlign: 'left',
                                                clearable: false,
                                                ui: 'classic hovered-border',
                                                slug: 'cdbProfileCompanyInformation',
                                                bind: {
                                                    permission: '{userPermissions}',
                                                },
                                                listeners: {
                                                    blur: 'saveObjectRecordOnFieldBlur',
                                                },
                                            },
                                            items: [
                                                {
                                                    xtype: 'abraxa.phonefield',
                                                    label: 'Phone',
                                                    testId: 'cdbCompSummaryPhoneField',
                                                    placeholder: 'Enter phone',
                                                    cls: 'a-field-icon icon-phone icon-rounded',
                                                    labelAlign: 'left',
                                                    clearable: false,
                                                    ui: 'classic hovered-border',
                                                    flex: 1,
                                                    bind: {
                                                        value: '{object_record.org_phone}',
                                                    },
                                                },
                                                {
                                                    xtype: 'button',
                                                    ui: 'small round tool-round normal',
                                                    iconCls: 'md-icon-outlined md-icon-add-circle-outline',
                                                    testId: 'cdbCompSummaryAddPhoneBtn',
                                                    tooltip: {
                                                        anchorToTarget: true,
                                                        html: 'Add phone',
                                                        align: 'bc-tc?',
                                                        showDelay: 0,
                                                        hideDelay: 0,
                                                        dismissDelay: 0,
                                                        allowOver: false,
                                                        closeAction: 'destroy',
                                                    },
                                                    handler: function () {
                                                        let store = this.upVM().get('phones'),
                                                            organization = this.upVM().get('object_record');

                                                        store.add({
                                                            org_id: organization.get('org_id'),
                                                        });
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'abraxa.componentdataview',
                                            bind: {
                                                permission: '{userPermissions}',
                                                store: '{phones}',
                                            },
                                            itemConfig: {
                                                xtype: 'container',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                },
                                                viewModel: {},
                                                defaults: {
                                                    slug: 'cdbProfileCompanyInformation',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                    },
                                                },
                                                items: [
                                                    {
                                                        xtype: 'abraxa.phonefield',
                                                        label: 'Phone',
                                                        testId: 'cdbCompSummaryPhoneSecondField',
                                                        placeholder: 'Enter phone',
                                                        cls: 'a-field-icon icon-phone icon-rounded',
                                                        labelAlign: 'left',
                                                        clearable: false,
                                                        ui: 'classic hovered-border',
                                                        flex: 1,
                                                        bind: {
                                                            value: '{record.phone}',
                                                        },
                                                        listeners: {
                                                            blur: function () {
                                                                let store = this.upVM().get('phones');

                                                                store.sync({
                                                                    success: function () {
                                                                        Ext.toast('Record updated');
                                                                    },
                                                                });
                                                            },
                                                        },
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        testId: 'cdbCompSummaryRemovePhoneSecondField',
                                                        ui: 'small round tool-round',
                                                        iconCls: 'md-icon-outlined md-icon-remove-circle-outline',
                                                        tooltip: {
                                                            anchorToTarget: true,
                                                            html: 'Remove phone',
                                                            align: 'bc-tc?',
                                                            showDelay: 0,
                                                            hideDelay: 0,
                                                            dismissDelay: 0,
                                                            allowOver: false,
                                                            closeAction: 'destroy',
                                                        },
                                                        handler: function (btn) {
                                                            let store = this.upVM().get('phones'),
                                                                record = btn.upVM().get('record');

                                                            store.remove(record);
                                                            store.sync({
                                                                success: function () {
                                                                    Ext.toast('Record updated');
                                                                },
                                                            });
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Website',
                                            testId: 'cdbCompSummaryWebsiteField',
                                            placeholder: 'Website address',
                                            cls: 'a-field-icon icon-link icon-rounded',
                                            bind: {
                                                value: '{object_record.org_website}',
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            valueField: 'org_t_id',
                                            displayField: 'org_t_name',
                                            forceSelection: true,
                                            multiSelect: true,
                                            queryMode: 'local',
                                            label: 'Type',
                                            testId: 'cdbCompSummaryTypeField',
                                            slug: 'cdbOrganizationType',
                                            placeholder: 'Choose type',
                                            bind: {
                                                value: '{object_record.org_types}',
                                                store: '{types}',
                                                permission: '{userPermissions}',
                                            },
                                            cls: 'a-field-icon icon-short icon-rounded',
                                        },
                                        {
                                            xtype: 'ports.served.combo',
                                            flex: 1,
                                            label: 'Related ports',
                                            testId: 'cdbCompSummaryRelatedPortsField',
                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-port icon-rounded',
                                            multiSelect: true,
                                            forceSelection: true,
                                            placeholder: 'Choose ports',
                                            hidden: true,
                                            bind: {
                                                hidden: '{currentUserType != "principal" ? false : true}',
                                                value: '{object_record.related_ports}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset offset-x0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'div',
                            html: '<div class="h5 my-16 mx-24">ADDRESS INFORMATION</div>',
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'container',
                                    padding: '0 24',
                                    showNoPermissions: true,
                                    slug: 'cdbProfileAddressInformation',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    defaults: {
                                        labelAlign: 'left',
                                        clearable: false,
                                        ui: 'classic hovered-border',
                                        slug: 'cdbProfileAddressInformation',
                                        bind: {
                                            permission: '{userPermissions}',
                                        },
                                        listeners: {
                                            blur: 'saveObjectRecordOnFieldBlur',
                                        },
                                        maxLength: 255,
                                    },
                                    items: [
                                        {
                                            xtype: 'country.combo',
                                            label: 'Country',
                                            testId: 'cdbCompSummaryCountryField',
                                            reference: 'companySideCountryCombo',
                                            cls: 'a-field-icon icon-public icon-rounded',
                                            placeholder: 'Choose country',
                                            clearable: true,
                                            bind: {
                                                value: '{object_record.org_country}',
                                                store: '{countryStore}',
                                            },
                                            listeners: {
                                                change: function (field, countryId, oldValue) {
                                                    if (!countryId) return;

                                                    let cityStore = Ext.getStore('cityStore');
                                                    if (!cityStore) return;

                                                    cityStore
                                                        .getProxy()
                                                        .setUrl(Env.ApiEndpoint + 'countries/' + countryId + '/cities');

                                                    cityStore.load();
                                                },
                                                blur: 'saveObjectRecordOnFieldBlur',
                                            },
                                        },
                                        {
                                            xtype: 'city.combo',
                                            label: 'City',
                                            testId: 'cdbCompSummaryCityField',
                                            required: false,
                                            clearable: true,
                                            minChars: 2,
                                            cls: 'a-field-icon icon-location_city icon-rounded',
                                            bind: {
                                                disabled: '{!companySideCountryCombo.value}',
                                                value: '{object_record.org_city}',
                                            },
                                            placeholder: 'Choose city',
                                            queryDelay: 10, // default is 10 for local queryMode
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Address 1',
                                            testId: 'cdbCompSummaryAddressField',
                                            placeholder: 'Enter address',
                                            cls: 'a-field-icon icon-location icon-rounded',
                                            bind: {
                                                value: '{object_record.org_address}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Address 2',
                                            testId: 'cdbCompSummaryAddress2Field',
                                            placeholder: 'Enter address',
                                            cls: 'a-field-icon icon-location icon-rounded',
                                            bind: {
                                                value: '{object_record.org_address_2}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Post code',
                                            testId: 'cdbCompSummaryPostCodeField',
                                            placeholder: 'Enter post code',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            bind: {
                                                value: '{object_record.org_post_code}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'P.O Box',
                                            testId: 'cdbCompSummaryPOBoxField',
                                            placeholder: 'Enter P.O Box',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            bind: {
                                                value: '{object_record.org_po_box}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Memo',
                                            testId: 'cdbCompSummaryMemoField',
                                            placeholder: 'Enter free text',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            bind: {
                                                value: '{object_record.org_memo}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset offset-x0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'div',
                            html: '<div class="h5 my-16 mx-24">ACCOUNT INFORMATION</div>',
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'container',
                                    testId: 'cdbCompSummaryProfileAccountInfoContainer',
                                    padding: '0 24',
                                    showNoPermissions: true,
                                    slug: 'cdbProfileAccountInformation',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    defaults: {
                                        labelAlign: 'left',
                                        clearable: false,
                                        ui: 'classic hovered-border',
                                        slug: 'cdbProfileAccountInformation',
                                        bind: {
                                            permission: '{userPermissions}',
                                        },
                                        listeners: {
                                            blur: 'saveObjectRecordOnFieldBlur',
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            label: 'VAT',
                                            testId: 'cdbCompSummaryVATnumberField',
                                            placeholder: 'VAT number',
                                            cls: 'a-field-icon icon-money icon-rounded',
                                            bind: {
                                                value: '{object_record.org_registration_number}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Company EORI',
                                            testId: 'cdbCompSummaryCompanyEORIField',
                                            placeholder: 'Enter EORI number',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            bind: {
                                                value: '{object_record.org_eori}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Client ID',
                                            testId: 'cdbCompSummaryClientIdField',
                                            placeholder: 'Enter Client ID',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            bind: {
                                                value: '{object_record.org_debtor_number}',
                                            },
                                        },
                                        {
                                            xtype: 'organization.combo',
                                            name: 'org_parent_id',
                                            label: 'Parent Company',
                                            testId: 'cdbCompSummaryParentCompanyField',
                                            placeholder: 'Parent company',
                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                            bind: {
                                                value: '{object_record.org_parent_id}',
                                                inputValue: '{object_record.parent_organization.org_name}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset offset-x0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<div class="h5 my-16 ml-24">REPORTING CURRENCY</div>',
                                },
                                {
                                    xtype: 'infoicon',
                                    infoText: 'Set the preferred reporting currency for this client',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            padding: '0 0 16 0',
                            items: [
                                {
                                    xtype: 'container',
                                    padding: '8 24',
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: 'Set reporting currency',
                                            testId: 'cdbCompSummaryReportingCurrencyField',
                                            iconCls: 'md-icon-check',
                                            ui: 'action small',
                                            hidden: true,
                                            showNoPermissions: true,
                                            slug: 'cdbFinancialOverviewSetCurrency',
                                            bind: {
                                                permission: '{userPermissions}',
                                                hidden: '{object_record.preferred_currency ? true : false}',
                                            },
                                            height: 30,
                                            handler: function (me) {
                                                Ext.create(
                                                    'Abraxa.view.cdb.company.financials.overview.CreateReportingCurrency',
                                                    {
                                                        viewModel: {
                                                            parent: me.upVM(),
                                                            data: {
                                                                editMode: false,
                                                            },
                                                        },
                                                    }
                                                ).show();
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'hbox',
                                            minHeight: 56,
                                            cls: 'a-list-item a-bb-0',
                                            bind: {
                                                hidden: '{object_record.preferred_currency ? false:true}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    cls: 'a-list-values',
                                                    viewModel: {
                                                        formulas: {
                                                            formattedROE: function (get) {
                                                                const reportingCurrency = get('reportingCurrency');
                                                                const exchangeRate =
                                                                    reportingCurrency.get('exchange_rate');
                                                                return Abraxa.utils.Functions.formatROE(exchangeRate);
                                                            },
                                                        },
                                                    },
                                                    bind: {
                                                        html: '<div class="flex-1 hbox"><img src="https://static.abraxa.com/flags/1x1/{reportingCurrency.currency:substr(0, 2):lowercase()}.svg" alt="" class="a-flag-x32 a-flag-outlined a-img-round" /><div class="fs-16 ml-16"><b class="d-inline-flex align-items-center">{reportingCurrency.currency}<i class="md-icon c-teal ml-8 fs-18">check</i></b><div class="sm-title"><b>Current ROE:</b> {formattedROE} {reportingCurrency.base_currency}</div></div></div>',
                                                    },
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-actions-hover',
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            testId: 'cdbCompSummaryEditFinancialBtn',
                                                            iconCls: 'md-icon-outlined md-icon-edit',
                                                            ui: 'round tool-round-md',
                                                            slug: 'cdbFinancialOverview',
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
                                                                Ext.create(
                                                                    'Abraxa.view.cdb.company.financials.overview.CreateReportingCurrency',
                                                                    {
                                                                        viewModel: {
                                                                            parent: me.upVM(),
                                                                            data: {
                                                                                editMode: true,
                                                                            },
                                                                        },
                                                                    }
                                                                ).show();
                                                            },
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            ui: 'round tool-round',
                                                            iconCls: 'md-icon-outlined md-icon-delete',
                                                            slug: 'cdbFinancialOverviewDeleteCurrency',
                                                            testId: 'cdbCompSummaryDeleteFinancialBtn',
                                                            bind: {
                                                                permission: '{userPermissions}',
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
                                                                let company = me.upVM().get('object_record'),
                                                                    currentUser = me.upVM().get('currentUser');
                                                                Ext.Msg.confirm(
                                                                    'Delete',
                                                                    'Are you sure you would like to delete this entry?',
                                                                    function (answer) {
                                                                        if (answer == 'yes') {
                                                                            company.set('preferred_currency', null);
                                                                            company.set(
                                                                                'updated_by_user',
                                                                                currentUser.getData()
                                                                            );
                                                                            company.set('updated_at', new Date());
                                                                            if (company.dirty) {
                                                                                company.save({
                                                                                    success: function (rec) {
                                                                                        Ext.toast(
                                                                                            'Record updated',
                                                                                            1000
                                                                                        );
                                                                                    },
                                                                                });
                                                                            }
                                                                        }
                                                                    },
                                                                    this,
                                                                    [
                                                                        {
                                                                            xtype: 'button',
                                                                            testId: 'cdbCompSummaryDeleteFinancialConfirmNoBtn',
                                                                            itemId: 'no',
                                                                            margin: '0 8 0 0',
                                                                            text: 'Cancel',
                                                                        },
                                                                        {
                                                                            xtype: 'button',
                                                                            testId: 'cdbCompSummaryDeleteFinancialConfirmYesBtn',
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
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-cdb-overview',
            scrollable: 'y',
            flex: 8,
            showNoPermissions: true,
            slug: 'cdbProfileKpis',
            bind: {
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'cdb.balance',
                    margin: 16,
                },
                {
                    xtype: 'cdb.portcalls',
                },
            ],
        },
    ],
});

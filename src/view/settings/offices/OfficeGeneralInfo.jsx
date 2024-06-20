import './OfficeController';

Ext.define('Abraxa.view.settings.offices.OfficeGeneralInfo', {
    extend: 'Ext.Container',
    xtype: 'settings.offices.general.info',
    hidden: true,
    scrollable: true,
    bind: {
        hidden: '{offices_tabbar.activeTabIndex == 0 ? false: true}',
    },
    controller: 'settings.office.controller',
    viewModel: {
        formulas: {
            office: {
                bind: {
                    bindTo: '{officesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record;
                    }
                },
            },
            officeLogo: {
                bind: {
                    bindTo: '{office}',
                    deep: true,
                },
                get: function (office) {
                    if (office) {
                        let image = office.get('logo'),
                            url;
                        if (image != '') {
                            url = image;
                        } else {
                            url = AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image-company.svg';
                        }
                        return url;
                    }
                },
            },
            officeSquareLogo: {
                bind: {
                    bindTo: '{office}',
                    deep: true,
                },
                get: function (office) {
                    if (office) {
                        let image = office.get('square_logo'),
                            url;
                        if (image != '') {
                            url = image;
                        } else {
                            url = AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image-company.svg';
                        }
                        return url;
                    }
                },
            },
        },
    },
    margin: 0,
    padding: 0,
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-company-heading a-bt-0 w-50',
            margin: '0 0 16 0',
            minWidth: 640,
            layout: {
                type: 'hbox',
            },
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'div',
                            html: '<h5>Company logo</h5>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-company-logo',
                            items: [
                                {
                                    xtype: 'image',
                                    itemId: 'officeLogo',
                                    bind: {
                                        src: '{officeLogo}',
                                    },
                                    mode: 'image',
                                    align: 'center',
                                },
                                {
                                    xtype: 'filefield',
                                    ui: 'default',
                                    cls: 'a-edit-image',
                                    accept: 'image',
                                    name: 'officeLogo',
                                    listeners: {
                                        change: 'uploadFile',
                                    },
                                },
                                {
                                    xtype: 'button',
                                    cls: 'a-delete-image',
                                    iconCls: 'md-icon-close',
                                    ui: 'round default',
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
                                        let record = this.upVM().get('office');
                                        if (record) {
                                            record.set('logo', '');
                                        }
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '0 0 0 64',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'text-center',
                            html: '<h5>Square logo</h5>',
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
                                    itemId: 'officeSquareLogo',
                                    bind: {
                                        src: '{officeSquareLogo}',
                                    },
                                    mode: 'image',
                                    align: 'center',
                                    height: 80,
                                    width: 80,
                                },
                                {
                                    xtype: 'filefield',
                                    ui: 'default',
                                    cls: 'a-edit-image',
                                    accept: 'image',
                                    name: 'squareOfficeLogo',
                                    listeners: {
                                        change: 'uploadFile',
                                    },
                                },
                                {
                                    xtype: 'button',
                                    cls: 'a-delete-image',
                                    top: 0,
                                    right: 0,
                                    iconCls: 'md-icon-close',
                                    ui: 'round default',
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
                                        let record = this.upVM().get('office');
                                        if (record) {
                                            record.set('square_logo', '');
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
            cls: 'general_data_container w-50',
            minWidth: 640,
            items: [
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    docked: 'top',
                },
                {
                    xtype: 'textfield',
                    testId: 'officeNameTestIdSettings',
                    ui: 'field-xl no-border classic',
                    label: false,
                    clearable: false,
                    placeholder: 'Office name',
                    required: true,
                    bind: {
                        value: '{office.name}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-general-form',
                    margin: '0 0 16 0',
                    defaults: {
                        clearable: false,
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                    },
                    items: [
                        {
                            xtype: 'country.combo',
                            testId: 'officeCountryComboTestIdSettings',
                            label: 'Country',
                            placeholder: 'Choose country',
                            reference: 'countryOfficeCombo',
                            cls: 'a-field-icon icon-rounded icon-public',
                            bind: {
                                value: '{office.country}',
                            },
                            triggers: {
                                search: false,
                            },
                            floatedPicker: {
                                listeners: {
                                    select: function (picker, selection) {
                                        if (selection) {
                                            picker
                                                .upVM()
                                                .get('office')
                                                .set('country_name', selection.get('country_name'));
                                            picker.upVM().set('office.city_name', '');
                                            picker.upVM().set('office.address', '');
                                        }
                                    },
                                },
                            },
                            listeners: {
                                // change: function (el, countryId, oldValue) {
                                //     let cityStore = Ext.getStore('cityStore');
                                //     cityStore.getProxy().setUrl(Env.ApiEndpoint + 'countries/' + countryId + '/cities');
                                //     cityStore.load();
                                // },
                            },
                        },
                        {
                            xtype: 'city.combo',
                            testId: 'officeCityComboTestIdSettings',
                            label: 'City',
                            placeholder: 'Enter city',
                            required: false,
                            disabled: false,
                            clearable: true,
                            cls: 'a-field-icon icon-rounded icon-location_city',
                            triggers: {
                                search: false,
                            },
                            bind: {
                                store: {
                                    type: 'cityStore',
                                    autoLoad: false,
                                    proxy: {
                                        extraParams: {
                                            country_id: '{countryOfficeCombo.selection.id}',
                                        },
                                    },
                                    updateProxy: function (proxy) {
                                        if (proxy) {
                                            proxy.onAfter('extraparamschanged', this.load, this);
                                        }
                                    },
                                },
                                value: '{office.city}',
                                inputValue: '{office.city_name}',
                            },
                            listeners: {
                                select: function (me, selection) {
                                    if (selection) {
                                        me.upVM().get('office').set('city_name', selection.get('city_name'));
                                    }
                                },
                                clearicontap: function (cmp, selection) {
                                    cmp.upVM().set('office.city', null);
                                    cmp.upVM().set('office.city_name', null);
                                },
                            },
                        },
                        {
                            xtype: 'textfield',
                            testId: 'officeAddressTestIdSettings',
                            label: 'Address',
                            placeholder: 'Office address',
                            cls: 'a-field-icon icon-rounded icon-location',
                            bind: {
                                value: '{office.address}',
                            },
                        },
                        {
                            xtype: 'abraxa.phonefield',
                            testId: 'officePhoneTestIdSettings',
                            label: 'Phone',
                            placeholder: 'Phone number',
                            cls: 'a-field-icon icon-rounded icon-phone',
                            bind: {
                                value: '{office.phone}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            testId: 'officeFaxTestIdSettings',
                            label: 'Fax',
                            placeholder: 'Fax number',
                            cls: 'a-field-icon icon-rounded icon-print',
                            bind: {
                                value: '{office.fax}',
                            },
                        },
                        {
                            xtype: 'abraxa.emailfield',
                            testId: 'officeEmailTestIdSettings',
                            label: 'Email',
                            placeholder: 'Email address',
                            itemId: 'officeEmail',
                            cls: 'a-field-icon icon-rounded icon-email',
                            required: true,
                            bind: {
                                value: '{office.email}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            testId: 'officeWebsiteTestIdSettings',
                            label: 'Website',
                            cls: 'a-field-icon icon-rounded icon-link',
                            placeholder: 'http://',
                            bind: {
                                value: '{office.website}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            testId: 'officeVatTestIdSettings',
                            label: 'VAT',
                            cls: 'a-field-icon icon-rounded icon-short',
                            placeholder: 'Enter VAT',
                            bind: {
                                value: '{office.vat}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            testId: 'officeTradeRegTestIdSettings',
                            label: 'Trage reg.',
                            cls: 'a-field-icon icon-rounded icon-short',
                            placeholder: 'Enter Trade reg.',
                            bind: {
                                value: '{office.trade_reg}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'toolbar',
            cls: 'w-50',
            items: [
                '->',
                {
                    xtype: 'button',
                    margin: '0 8 0 0',
                    text: 'Cancel',
                    handler: function (me) {
                        let record = me.upVM().get('office');
                        record.reject();
                    },
                },
                {
                    xtype: 'button',
                    testId: 'saveOfficeButtonTestIdSettings',
                    ui: 'action',
                    text: 'Save',
                    disabled: true,
                    bind: {
                        disabled: '{office.dirty ? false:true}',
                    },
                    handler: function (me) {
                        let record = me.upVM().get('office'),
                            emailField = Ext.ComponentQuery.query('[itemId=officeEmail]')[0];
                        me.upVM().getView().down('form\\.error').setHtml('').hide().removeCls('error');

                        if (!record.get('name').length || !record.get('email').length || !emailField.isValid()) {
                            me.upVM()
                                .getView()
                                .down('form\\.error')
                                .setHtml('Please fill in all required fields')
                                .show()
                                .addCls('error');
                            return false;
                        } else {
                            let store = me.upVM().get('companyOffices');
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.getCmp('main-viewport').upVM().get('currentCompany').load();

                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
            ],
        },
    ],
});

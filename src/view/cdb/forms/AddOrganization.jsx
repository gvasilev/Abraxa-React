import '../../../view/login/FormError';

Ext.define('Abraxa.view.cdb.forms.AddOrganization', {
    xtype: 'companydatabase.create',
    extend: 'Ext.Dialog',
    testId: 'cdbCreate',
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-company"><i class="md-icon md-icon-business"></i></div>Create company',
    showAnimation: 'pop',
    scrollable: 'y',
    width: 640,
    minHeight: 380,
    maxHeight: '90%',
    draggable: false,
    padding: 0,
    controller: 'cdb.maincontroller',
    tools: {
        close: {
            tooltip: {
                anchorToTarget: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                let record = this.upVM().get('selectedCompany');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
    },
    listeners: {
        destroy: function (me) {
            if (me.upVM().get('organizations') && me.upVM().get('organizations').needsSync) {
                me.upVM().get('organizations').rejectChanges();
            }
        },
    },
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            // showAnimation: 'fadeIn',
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            testId: 'cdbCreateForm',
            scrollable: false,
            itemId: 'mainForm',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-dialog-form a-general-form',
                    defaults: {
                        labelAlign: 'left',
                        clearable: false,
                        ui: 'classic hovered-border',
                        maxLength: 255,
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            testId: 'cdbCreateFormCmpNameField',
                            ui: 'field-xl no-border classic',
                            label: false,
                            placeholder: 'Enter company name',
                            required: true,
                            bind: '{selectedCompany.org_name}',
                            listeners: {
                                painted: function (me) {
                                    me.focus();
                                },
                            },
                        },
                        {
                            xtype: 'emailfield',
                            validators: 'email',
                            label: 'Email',
                            testId: 'cdbCreateFormEmailField',
                            placeholder: 'Enter email address',
                            cls: 'a-field-icon icon-email icon-rounded',
                            required: true,
                            bind: {
                                value: '{selectedCompany.org_email}',
                            },
                        },
                        {
                            xtype: 'abraxa.phonefield',
                            label: 'Phone',
                            testId: 'cdbCreateFormPhoneField',
                            placeholder: 'Enter phone',
                            cls: 'a-field-icon icon-phone icon-rounded',
                            bind: {
                                value: '{selectedCompany.org_phone}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Website',
                            testId: 'cdbCreateFormWebsiteField',
                            placeholder: 'Website address',
                            cls: 'a-field-icon icon-link icon-rounded',
                            bind: '{selectedCompany.org_website}',
                        },
                        {
                            xtype: 'selectfield',
                            valueField: 'org_t_id',
                            testId: 'cdbCreateFormTypeField',
                            displayField: 'org_t_name',
                            forceSelection: true,
                            multiSelect: true,
                            queryMode: 'local',
                            label: 'Type',
                            placeholder: 'Choose type',
                            bind: {
                                value: '{selectedCompany.org_types}',
                                store: '{types}',
                            },
                            cls: 'a-field-icon icon-short icon-rounded',
                        },
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset offset-x0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'div',
                            html: '<div class="h5 my-16">ADDRESS INFORMATION</div>',
                        },
                        {
                            xtype: 'country.combo',
                            label: 'Country',
                            testId: 'cdbCreateFormCountryField',
                            reference: 'companyCountryCombo',
                            clearable: true,
                            bind: {
                                value: '{selectedCompany.org_country}',
                                store: '{countryStore}',
                            },
                            cls: 'a-field-icon icon-public icon-rounded',
                            placeholder: 'Choose country',
                            floatedPicker: {
                                listeners: {
                                    select: function (el, selection) {
                                        let countryId = selection.get('id');
                                        if (countryId) {
                                            let cityStore = Ext.getStore('cityStore');
                                            cityStore.getProxy().setExtraParams({
                                                country_id: countryId,
                                            });
                                            cityStore.load();
                                        }
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'city.combo',
                            label: 'City',
                            testId: 'cdbCreateFormCityField',
                            clearable: true,
                            required: false,
                            cls: 'a-field-icon icon-location_city icon-rounded',
                            bind: {
                                disabled: '{!companyCountryCombo.value}',
                                value: '{selectedCompany.org_city}',
                            },
                            placeholder: 'Choose city',
                            listeners: {
                                painted: function (me) {
                                    let selectedCompany = me.upVM().get('selectedCompany');
                                    if (selectedCompany && selectedCompany.get('org_country')) {
                                        let cityStore = Ext.getStore('cityStore');
                                        cityStore.getProxy().setExtraParams({
                                            country_id: selectedCompany.get('org_country'),
                                        });
                                        cityStore.load();
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Address 1',
                            testId: 'cdbCreateFormAddressField',
                            placeholder: 'Enter address',
                            cls: 'a-field-icon icon-location icon-rounded',
                            bind: '{selectedCompany.org_address}',
                        },
                        {
                            xtype: 'textfield',
                            label: 'Address 2',
                            testId: 'cdbCreateFormAddress2Field',
                            placeholder: 'Enter address',
                            cls: 'a-field-icon icon-location icon-rounded',
                            bind: '{selectedCompany.org_address_2}',
                        },
                        {
                            xtype: 'textfield',
                            label: 'Post code',
                            testId: 'cdbCreateFormPCField',
                            placeholder: 'Enter post code',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: '{selectedCompany.org_post_code}',
                        },
                        {
                            xtype: 'textfield',
                            label: 'P.O Box',
                            testId: 'cdbCreateFormPOBoxField',
                            placeholder: 'Enter P.O Box',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: '{selectedCompany.org_po_box}',
                        },
                        {
                            xtype: 'textfield',
                            label: 'Memo',
                            testId: 'cdbCreateFormMemoField',
                            placeholder: 'Enter free text',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: '{selectedCompany.org_memo}',
                        },
                        {
                            xtype: 'div',
                            cls: 'divider divider-offset offset-x0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'div',
                            html: '<div class="h5 my-16">ACCOUNT INFORMATION</div>',
                            slug: 'cdbProfileAccountInformation',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'VAT',
                            testId: 'cdbCreateFormVATField',
                            placeholder: 'VAT number',
                            slug: 'cdbProfileAccountInformation',
                            cls: 'a-field-icon icon-money icon-rounded',
                            bind: {
                                value: '{selectedCompany.org_registration_number}',
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Company EORI',
                            testId: 'cdbCreateFormEORIField',
                            placeholder: 'Enter EORI number',
                            slug: 'cdbProfileAccountInformation',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: {
                                value: '{selectedCompany.org_eori}',
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Client ID',
                            testId: 'cdbCreateFormClientIDField',
                            placeholder: 'Enter Client ID',
                            cls: 'a-field-icon icon-short icon-rounded',
                            slug: 'cdbProfileAccountInformation',
                            bind: {
                                value: '{selectedCompany.org_debtor_number}',
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'organization.combo',
                            name: 'org_parent_id',
                            label: 'Parent Company',
                            testId: 'cdbCreateFormParentCmpField',
                            clearable: true,
                            placeholder: 'Parent company',
                            cls: 'a-field-icon icon-business-center icon-rounded',
                            bind: {
                                value: '{selectedCompany.org_parent_id}',
                                store: '{organizationsCombo}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [
        {
            xtype: 'container',
            itemId: 'errorLine',
            testId: 'addOrganizationErrorLine',
            hidden: true,
            left: 16,
            html: '<div class="col"><div class="alert-warning alert-danger"><i class="material-icons md-18 md-icon-info red"></i>Please fill in all required fields.</div></div>',
            showAnimation: {
                type: 'popIn',
                direction: 'right',
            },
        },
        {
            text: 'Cancel',
            testId: 'addOrganizationCancelButton',
            margin: '0 8 0 0',
            handler: function () {
                let combo = this.upVM().get('targetCombo');
                if (combo) {
                    combo.clearValue();
                    if (combo.getStore().soruce) {
                        combo.getStore().getSource().rejectChanges();
                    } else {
                        combo.getStore().rejectChanges();
                    }
                    combo.focus();
                }
                let record = this.upVM().get('selectedCompany');
                this.up('dialog').destroy();
            },
        },
        {
            bind: {
                text: '{is_created ? "Create":"Save"}',
            },
            testId: 'addOrganizationSaveButton',
            enableToggle: true,
            ui: 'action loading',
            handler: 'onCompanyFormSubmit',
        },
    ],
});

Ext.define('Abraxa.view.cdb.forms.AddOrganizationFromCombo', {
    xtype: 'companydatabase.create.combo',
    testId: 'companyDBCreateCombo',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-company"><i class="md-icon md-icon-business"></i></div>Create company',
    closable: true,
    draggable: false,
    width: 640,
    minHeight: 380,
    maxHeight: '90%',
    controller: 'cdb.maincontroller',
    scrollable: true,
    padding: 0,
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
                            testId: 'companyDBCreateComboNameField',
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
                            testId: 'companyDBCreateComboEmailField',
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
                            testId: 'companyDBCreateComboPhoneField',
                            placeholder: 'Enter phone',
                            cls: 'a-field-icon icon-phone icon-rounded',
                            bind: {
                                value: '{selectedCompany.org_phone}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Website',
                            testId: 'companyDBCreateComboWebsiteField',
                            placeholder: 'Website address',
                            cls: 'a-field-icon icon-link icon-rounded',
                            bind: '{selectedCompany.org_website}',
                        },
                        {
                            xtype: 'combobox',
                            valueField: 'org_t_id',
                            displayField: 'org_t_name',
                            multiSelect: true,
                            queryMode: 'local',
                            label: 'Type',
                            testId: 'companyDBCreateComboTypeField',
                            placeholder: 'Choose type',
                            bind: {
                                value: '{selectedCompany.org_types}',
                                store: '{typesStore}',
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
                            testId: 'companyDBCreateComboCountryField',
                            reference: 'companyCountryCombo',
                            clearable: true,
                            bind: {
                                value: '{selectedCompany.org_country}',
                                store: '{countryStore}',
                            },
                            cls: 'a-field-icon icon-public icon-rounded',
                            placeholder: 'Choose country',
                            listeners: {
                                change: function (el, countryId, oldValue) {
                                    if (countryId) {
                                        let cityStore = Ext.getStore('cityStore');
                                        cityStore
                                            .getProxy()
                                            .setUrl(Env.ApiEndpoint + 'countries/' + countryId + '/cities');
                                        cityStore.load();
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'city.combo',
                            label: 'City',
                            testId: 'companyDBCreateComboCityField',
                            clearable: true,
                            required: false,
                            cls: 'a-field-icon icon-location_city icon-rounded',
                            bind: {
                                disabled: '{!companyCountryCombo.value}',
                                value: '{selectedCompany.org_city}',
                            },
                            placeholder: 'Choose city',
                        },
                        {
                            xtype: 'textfield',
                            label: 'Address 1',
                            testId: 'companyDBCreateComboAddressField',
                            placeholder: 'Enter address',
                            cls: 'a-field-icon icon-location icon-rounded',
                            bind: '{selectedCompany.org_address}',
                        },
                        {
                            xtype: 'textfield',
                            label: 'Address 2',
                            testId: 'companyDBCreateComboAddress2Field',
                            placeholder: 'Enter address',
                            cls: 'a-field-icon icon-location icon-rounded',
                            bind: '{selectedCompany.org_address_2}',
                        },
                        {
                            xtype: 'textfield',
                            label: 'Post code',
                            testId: 'companyDBCreateComboPostCodeField',
                            placeholder: 'Enter post code',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: '{selectedCompany.org_post_code}',
                        },
                        {
                            xtype: 'textfield',
                            label: 'P.O Box',
                            testId: 'companyDBCreateComboPoBoxField',
                            placeholder: 'Enter P.O Box',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: '{selectedCompany.org_po_box}',
                        },
                        {
                            xtype: 'textfield',
                            label: 'Memo',
                            testId: 'companyDBCreateComboMemoField',
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
                        },
                        {
                            xtype: 'textfield',
                            label: 'VAT',
                            placeholder: 'VAT number',
                            testId: 'companyDBCreateComboVatField',
                            slug: 'cdbCompanyVat',
                            cls: 'a-field-icon icon-money icon-rounded',
                            bind: {
                                value: '{selectedCompany.org_registration_number}',
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Company EORI',
                            placeholder: 'Enter EORI number',
                            testId: 'companyDBCreateComboEoriField',
                            slug: 'cdbCompanyEori',
                            cls: 'a-field-icon icon-short icon-rounded',
                            bind: {
                                value: '{selectedCompany.org_eori}',
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'textfield',
                            label: 'Client ID',
                            placeholder: 'Enter Client ID',
                            testId: 'companyDBCreateComboClientIdField',
                            cls: 'a-field-icon icon-short icon-rounded',
                            slug: 'cdbCompanyDebtor',
                            bind: {
                                value: '{selectedCompany.org_debtor_number}',
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            xtype: 'organization.combo',
                            name: 'org_parent_id',
                            label: 'Parent Company',
                            clearable: true,
                            placeholder: 'Parent company',
                            testId: 'companyDBCreateComboParentCompanyField',
                            cls: 'a-field-icon icon-business-center icon-rounded',
                            bind: {
                                value: '{selectedCompany.org_parent_id}',
                                store: '{parentCompanyStore}',
                            },
                        },
                    ],
                },
            ],
        },
    ],

    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
    },

    buttons: [
        {
            xtype: 'container',
            itemId: 'errorLine',
            hidden: true,
            left: 16,
            html: '<div class="col"><div class="alert-warning alert-danger"><i class="material-icons md-icon-info md-18 red"></i>Please fill in all required fields.</div></div>',
            showAnimation: {
                type: 'popIn',
                direction: 'right',
            },
        },
        {
            text: 'Cancel',
            ui: 'default',
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
                record.reject();
                record.banks().rejectChanges();
                record.departments().rejectChanges();
                this.up('dialog').destroy();
            },
            margin: '0 8',
        },
        {
            text: 'Create',
            enableToggle: true,
            ui: 'action loading',
            handler: function (btn) {
                let dialog = this.up('dialog'),
                    form = dialog.queryById('mainForm'),
                    combo = dialog.getVM().get('targetCombo');

                if (form.validate()) {
                    dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                    let record = dialog.upVM().get('selectedCompany');
                    record.save({
                        success: function (record) {
                            if (combo) {
                                combo.getStore().add(record);
                                combo.setValue(record.get('org_id'));
                                combo.setInputValue(record.get('org_name'));
                            }
                            Ext.toast('Record created', 1000);
                            mixpanel.track('Created a company');
                            dialog.destroy();
                        },
                        failure: function (record, batch) {
                            btn.toggle();
                        },
                    });
                } else {
                    btn.toggle();
                    dialog.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                }
            },
        },
    ],
    listeners: {
        destroy: function (me) {
            if (me.upVM().get('organizations') && me.upVM().get('organizations').needsSync) {
                me.upVM().get('organizations').rejectChanges();
            }
        },
    },
});

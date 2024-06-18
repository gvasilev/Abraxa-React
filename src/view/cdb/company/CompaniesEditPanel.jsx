import '../../../core/plugins/Abraxa.LazyItems';
import '../../../core/components/AbraxaPhoneField';
import '../../../core/components/AbraxaComponentDataview';
import '../../../core/components/Abraxa.CityCombo';
import '../../../core/components/combo/OrganizationCombo';

Ext.define('Abraxa.view.cdb.company.CompanyEditPanel', {
    extend: 'Ext.Container',
    layout: 'hbox',
    cls: 'a-right-container a-cdb-right-container',
    xtype: 'company.editpanel',
    itemId: 'company-editpanel',
    testId: 'companyEditPanel',
    hidden: true,
    bind: {
        hidden: '{companyGrid.selection ? false : true}',
    },
    viewModel: {
        stores: {
            phones: {
                source: '{companyGrid.selection.phones}',
                extraParams: {
                    org_id: '{companyGrid.selection.org_id}',
                },
            },
        },
    },
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    cls: 'a-summary-container',
                    testId: 'companyEditPanelSummaryContainer',
                    flex: 1,
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar a-bb-100',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<div class="a-badge a-badge-company"><i class="md-icon md-icon-business"></i></div><div><span class="a-panel-title">{companyGrid.selection.org_name}</span><span class="a-panel-id">#CDB-{companyGrid.selection.org_id}</span></div>',
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 12',
                                            ui: 'status status-md default',
                                            testId: 'companyEditPanelStatusDropdownBtn',
                                            slug: 'cdb',
                                            bind: {
                                                text: '<i class="material-icons a-status-icon">star</i>{companyGrid.selection.rating.name}',
                                                cls: 'a-main-status a-has-icon status-{companyGrid.selection.rating.name}',
                                                permission: '{userPermissions}',
                                            },
                                            menu: {
                                                defaults: {
                                                    handler: function() {
                                                        var record = this.upVM().get('companyGrid.selection'),
                                                            status_id = this.statusId;

                                                        record.set('credit_rating', status_id);

                                                        record.save({
                                                            success: function() {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    },
                                                },
                                                listeners: {
                                                    painted: function(me) {
                                                        let store = Ext.ComponentQuery.query('[xtype=cdb\\.main]')[0]
                                                                .getVM()
                                                                .get('creditRatings'),
                                                            data = store.getData().getRange(),
                                                            items = [];
                                                        Ext.each(data, function(value) {
                                                            let item = {
                                                                text: value.get('name'),
                                                                record: value,
                                                                statusId: value.get('id'),
                                                            };
                                                            items.push(item);
                                                        });
                                                        me.setItems(items);
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-actions',
                                    testId: 'companyEditPanelActionsContainer',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'round tool-round',
                                            slug: 'cdb',
                                            testId: 'companyEditPanelDeleteBtn',
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
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            handler: function(me) {
                                                const myTasks = Ext.getCmp('main-viewport').getVM().get('myTasks'),
                                                    taskStore = Ext.getStore('tasks'),
                                                    agreements = Ext.getCmp('main-viewport').getVM().get('agreements'),
                                                    record = me.upVM().get('companyGrid.selection'),
                                                    compEditPanel = me.up('[xtype=company\\.editpanel]').hide();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you would like to delete this entry?',
                                                    function(answer) {
                                                        if (answer == 'yes') {
                                                            if (compEditPanel) compEditPanel.hide();

                                                            record.erase({
                                                                success: function() {
                                                                    if (myTasks) myTasks.reload();
                                                                    if (taskStore) taskStore.reload();
                                                                    if (agreements) agreements.reload();
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
                                                            testId: 'companyEditPanelDeleteConfirmNoBtn',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            testId: 'companyEditPanelDeleteConfirmYesBtn',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ],
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'round tool-round',
                                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                                            testId: 'companyEditPanelCloseBtn',
                                            tooltip: {
                                                anchorToTarget: true,
                                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                                align: 'bc-tc?',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                            },
                                            handler: function(me) {
                                                this.find('companies-grid').deselectAll();
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'formpanel',
                                    itemId: 'mainForm',
                                    testId: 'companyEditPanelForm',
                                    items: [
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'container',
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
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            ui: 'field-xl no-border classic',
                                                            label: false,
                                                            placeholder: 'Enter company name',
                                                            testId: 'companyEditPanelCompanyNameField',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_name}',
                                                            },
                                                            listeners: {
                                                                painted: function(me) {
                                                                    me.focus();
                                                                },
                                                                blur: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'emailfield',
                                                            validators: 'email',
                                                            testId: 'companyEditPanelEmailField',
                                                            label: 'Email',
                                                            required: true,
                                                            placeholder: 'Enter email address',
                                                            cls: 'a-field-icon icon-email icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_email}',
                                                            },
                                                            listeners: {
                                                                blur: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (!me.isValid()) {
                                                                        record.reject();
                                                                        Ext.Msg.alert('Oops', 'Invalid email address!');
                                                                        return;
                                                                    }
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                            failure: function(record, response) {
                                                                                var result =
                                                                                    response.error.response
                                                                                        .responseJson;
                                                                                record.reject();
                                                                                Ext.Msg.alert('Oops', result.message);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            testId: 'companyEditPanelCDBInfoContainer',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle',
                                                            },
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
                                                                    testId: 'companyEditPanelPhoneField',
                                                                    placeholder: 'Enter phone',
                                                                    cls: 'a-field-icon icon-phone icon-rounded',
                                                                    labelAlign: 'left',
                                                                    clearable: false,
                                                                    ui: 'classic hovered-border',
                                                                    flex: 1,
                                                                    bind: {
                                                                        value: '{companyGrid.selection.org_phone}',
                                                                    },
                                                                    listeners: {
                                                                        blur: function(me) {
                                                                            let record = me
                                                                                .upVM()
                                                                                .get('companyGrid.selection');
                                                                            if (record.dirty) {
                                                                                record.save({
                                                                                    success: function() {
                                                                                        Ext.toast(
                                                                                            'Record updated',
                                                                                            1000,
                                                                                        );
                                                                                    },
                                                                                });
                                                                            }
                                                                        },
                                                                    },
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    ui: 'small round tool-round normal',
                                                                    testId: 'companyEditPanelAddPhoneSmallBtn',
                                                                    iconCls:
                                                                        'md-icon-outlined md-icon-add-circle-outline',
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
                                                                    handler: function() {
                                                                        let store = this.upVM().get('phones'),
                                                                            organization =
                                                                                this.upVM().get(
                                                                                    'companyGrid.selection',
                                                                                );

                                                                        store.add({
                                                                            org_id: organization.get('id'),
                                                                        });
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            xtype: 'abraxa.componentdataview',
                                                            testId: 'companyEditPanelCompanyInfoDataView',
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
                                                                defaults: {
                                                                    slug: 'cdbProfileCompanyInformation',
                                                                    bind: {
                                                                        permission: '{userPermissions}',
                                                                    },
                                                                },
                                                                viewModel: {},
                                                                items: [
                                                                    {
                                                                        xtype: 'abraxa.phonefield',
                                                                        testId: 'companyEditPanelCompanyInfoDataViewEnterPhoneBtn',
                                                                        label: 'Phone',
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
                                                                            blur: function() {
                                                                                let store = this.upVM().get('phones');

                                                                                store.sync({
                                                                                    success: function() {
                                                                                        Ext.toast('Record updated');
                                                                                    },
                                                                                });
                                                                            },
                                                                        },
                                                                    },
                                                                    {
                                                                        xtype: 'button',
                                                                        ui: 'small round tool-round',
                                                                        testId: 'companyEditPanelCompanyInfoDataViewRemovePhoneBtn',
                                                                        iconCls:
                                                                            'md-icon-outlined md-icon-remove-circle-outline',
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
                                                                        handler: function(btn) {
                                                                            let store = this.upVM().get('phones'),
                                                                                record = btn.upVM().get('record');

                                                                            store.remove(record);
                                                                            store.sync({
                                                                                success: function() {
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
                                                            testId: 'companyEditPanelCompanyInfoDataViewWebsiteField',
                                                            placeholder: 'Website address',
                                                            cls: 'a-field-icon icon-link icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_website}',
                                                            },
                                                            listeners: {
                                                                blur: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'selectfield',
                                                            valueField: 'org_t_id',
                                                            testId: 'companyEditPanelCompanyInfoDataViewTypeField',
                                                            displayField: 'org_t_name',
                                                            forceSelection: true,
                                                            multiSelect: true,
                                                            queryMode: 'local',
                                                            label: 'Type',
                                                            slug: 'cdbOrganizationType',
                                                            placeholder: 'Choose type',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_types}',
                                                                store: '{types}',
                                                                permission: '{userPermissions}',
                                                            },
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            listeners: {
                                                                focusleave: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider divider-offset offset-x24',
                                            html: '<hr>',
                                        },
                                        {
                                            xtype: 'div',
                                            html: '<div class="h5 my-16">ADDRESS INFORMATION</div>',
                                        },
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    slug: 'cdbProfileAddressInformation',
                                                    testId: 'companyEditPanelCompanyAddressContainer',
                                                    showNoPermissions: true,
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
                                                        maxLength: 255,
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'country.combo',
                                                            label: 'Country',
                                                            testId: 'companyEditPanelCompanyAddressContainerCountryField',
                                                            reference: 'companySideCountryCombo',
                                                            cls: 'a-field-icon icon-public icon-rounded',
                                                            placeholder: 'Choose country',
                                                            clearable: true,
                                                            bind: {
                                                                value: '{companyGrid.selection.org_country}',
                                                                store: '{countryStore}',
                                                            },
                                                            listeners: {
                                                                change: function(el, countryId, oldValue) {
                                                                    if (countryId) {
                                                                        let me = this,
                                                                            cityStore = Ext.getStore('cityStore');
                                                                        if (cityStore) {
                                                                            cityStore
                                                                                .getProxy()
                                                                                .setUrl(
                                                                                    Env.ApiEndpoint +
                                                                                    'countries/' +
                                                                                    countryId +
                                                                                    '/cities',
                                                                                );
                                                                            cityStore.load();
                                                                        }
                                                                    }
                                                                },
                                                                blur: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'city.combo',
                                                            label: 'City',
                                                            testId: 'companyEditPanelCompanyAddressContainerCityField',
                                                            required: false,
                                                            clearable: true,
                                                            minChars: 2,
                                                            cls: 'a-field-icon icon-location_city icon-rounded',
                                                            bind: {
                                                                disabled: '{!companySideCountryCombo.value}',
                                                                value: '{companyGrid.selection.org_city}',
                                                                inputValue: '{companyGrid.selection.city_name}',
                                                            },
                                                            placeholder: 'Choose city',
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Address 1',
                                                            testId: 'companyEditPanelCompanyAddressContainerAddressField',
                                                            placeholder: 'Enter address',
                                                            cls: 'a-field-icon icon-location icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_address}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Address 2',
                                                            testId: 'companyEditPanelCompanyAddressContainerAddress2Field',
                                                            placeholder: 'Enter address',
                                                            cls: 'a-field-icon icon-location icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_address_2}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Post code',
                                                            testId: 'companyEditPanelCompanyAddressContainerPostCodeField',
                                                            placeholder: 'Enter post code',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_post_code}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            testId: 'companyEditPanelCompanyAddressContainerPOBoxField',
                                                            label: 'P.O Box',
                                                            placeholder: 'Enter P.O Box',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_po_box}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Memo',
                                                            testId: 'companyEditPanelCompanyAddressContainerMemoField',
                                                            placeholder: 'Enter free text',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_memo}',
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'divider divider-offset offset-x24',
                                            html: '<hr>',
                                        },
                                        {
                                            xtype: 'div',
                                            html: '<div class="h5 my-16">ACCOUNT INFORMATION</div>',
                                        },
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    showNoPermissions: true,
                                                    slug: 'cdbProfileAccountInformation',
                                                    testId: 'companyEditPanelProfileAccountInfoContainer',
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
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'VAT',
                                                            testId: 'companyEditPanelProfileAccountInfoContainerPOBoxField',
                                                            placeholder: 'VAT number',
                                                            cls: 'a-field-icon icon-money icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_registration_number}',
                                                            },
                                                            listeners: {
                                                                blur: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Company EORI',
                                                            testId: 'companyEditPanelProfileAccountInfoContainerEORIField',
                                                            placeholder: 'Enter EORI number',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_eori}',
                                                            },
                                                            listeners: {
                                                                blur: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Client ID',
                                                            testId: 'companyEditPanelProfileAccountInfoClientIDField',
                                                            placeholder: 'Enter Client ID',
                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                            bind: {
                                                                value: '{companyGrid.selection.org_debtor_number}',
                                                            },
                                                            listeners: {
                                                                blur: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                        {
                                                            xtype: 'organization.combo',
                                                            name: 'org_parent_id',
                                                            label: 'Parent Company',
                                                            testId: 'companyEditPanelProfileAccountParentCompanyField',
                                                            placeholder: 'Parent company',
                                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                                            clearable: true,
                                                            bind: {
                                                                value: '{companyGrid.selection.org_parent_id}',
                                                                inputValue: '{companyGrid.selection.parent.org_name}',
                                                            },
                                                            listeners: {
                                                                focusleave: function(me) {
                                                                    let record = me.upVM().get('companyGrid.selection');
                                                                    if (record.dirty) {
                                                                        record.save({
                                                                            success: function() {
                                                                                Ext.toast('Record updated', 1000);
                                                                            },
                                                                        });
                                                                    }
                                                                },
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
                        {
                            xtype: 'toolbar',
                            padding: '12 16',
                            layout: {
                                type: 'hbox',
                                pack: 'end',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'action',
                                    testId: 'companyEditPanelViewDetalsTbBtn',
                                    text: 'View details',
                                    bind: {
                                        hidden: '{view_details ? true:false}',
                                    },
                                    handler: function(me) {
                                        Ext.getCmp('main-viewport')
                                            .getController()
                                            .redirectTo(
                                                'company/' + me.upVM().get('companyGrid.selection').get('org_id'),
                                            );
                                        this.find('companies-grid').deselectAll();
                                        let storeCompanies = this.upVM().get('organizations');
                                        storeCompanies.clearFilter();
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

import './AddAdditionalQuantity';

Ext.define('Abraxa.view.portcall.appointment.DocumentaryInstructions', {
    extend: 'Ext.Container',
    xtype: 'appointment.documentary.instructions',
    padding: '8 24',
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'div',
                    html: '<div class=\'hbox\'><div class=\'a-badge a-badge-default\'><i class=\'md-icon-outlined\'>description</i></div><div class=\'a-panel-title fs-14\'>Documentary instructions</div></div>',
                    cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right',
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function fn() {
                                let component = this.component;
                                component.toggleCls('is-collapsed');
                                component
                                    .up('container')
                                    .up('container')
                                    .down('[cls~=a-collapsible-container]')
                                    .toggleCls('is-collapsed');
                            },
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-collapsible-container',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-appointments-form',
                    showNoPermissions: true,
                    slug: 'portcallDocumentaryInstructions',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    defaults: {
                                        labelAlign: 'left',
                                        ui: 'hovered-border classic',
                                        flex: 1,
                                        listeners: {
                                            blur: function(me) {
                                                let store = this.upVM().get('cargoes');
                                                store.sync({
                                                    success: function() {
                                                        let portcall = me.upVM().get('object_record');
                                                        if (portcall) {
                                                            portcall.set('updated_at', new Date());
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            maxWidth: 440,
                                            padding: '0 0 2 0',
                                            layout: {
                                                type: 'hbox',
                                                align: 'center',
                                            },

                                            items: [
                                                {
                                                    xtype: 'unit.field',
                                                    label: 'B/L quantity',
                                                    flex: 1,
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    ui: 'hovered-border classic',
                                                    labelAlign: 'left',
                                                    slug: 'portcallDocumentaryInstructionsBlQty',
                                                    subObject: 'cargo',
                                                    bind: {
                                                        value: '{firstAdditonalQuantity.quantity}',
                                                        valueUnit: '{firstAdditonalQuantity.unit}',
                                                        readOnly: '{nonEditable ? true : false}',
                                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                        permission: '{userPermissions}',
                                                        objectPermission: '{objectPermissions}',
                                                        options: '{defaultCargoUnits}',
                                                    },
                                                    listeners: {
                                                        blur: function(me) {
                                                            let store = this.upVM().get('additionalQuantity'),
                                                                cargo = me.upVM().get('cargoesGrid.selection');

                                                            cargo.set('bl_quantity', me.getParent().getValue());
                                                            cargo.set(
                                                                'bl_quantity_unit',
                                                                me.getParent().getValueUnit(),
                                                            );

                                                            store.sync({
                                                                success: function() {
                                                                    let portcall = me.upVM().get('object_record');
                                                                    if (portcall) {
                                                                        portcall.set('updated_at', new Date());
                                                                    }
                                                                    cargo.getProxy().setExtraParams({
                                                                        portcall_id: portcall.get('id'),
                                                                    });
                                                                    cargo.save();
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                            });
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'button',
                                                    margin: '0 4',
                                                    iconCls: 'md-icon-add-circle-outline',
                                                    ui: 'tool-sm normal round',
                                                    slug: 'portcallDocumentaryInstructionsBlQty',
                                                    bind: {
                                                        cls: '{nonEditable ? "hidden" : ""}',
                                                        permission: '{userPermissions}',
                                                    },
                                                    tooltip: {
                                                        anchorToTarget: true,
                                                        html: 'Add quantity',
                                                        align: 'bc-tc?',
                                                        showDelay: 0,
                                                        hideDelay: 0,
                                                        dismissDelay: 0,
                                                        allowOver: false,
                                                        closeAction: 'destroy',
                                                    },
                                                    // bind: {
                                                    //     badgeText: '{additionalQuantity.count}'
                                                    // },
                                                    handler: function(me) {
                                                        let cargo = me.upVM().get('cargoesGrid.selection');
                                                        Ext.create(
                                                            'Abraxa.view.portcall.appointment.AddAdditionalQuantity',
                                                            {
                                                                viewModel: {
                                                                    parent: me.upVM(),
                                                                    data: {
                                                                        cargoAdditional: Ext.create(
                                                                            'Abraxa.model.cargo.CargoAdditional',
                                                                            {
                                                                                portcall_id: cargo.get('portcall_id'),
                                                                                cargo_id: cargo.get('id'),
                                                                            },
                                                                        ),
                                                                        cargo: cargo,
                                                                    },
                                                                },
                                                            },
                                                        ).show();
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    margin: '0 0 0 2',
                                                    cls: 'c-link fw-b',
                                                    bind: {
                                                        html: '<a  href="javascript:void(0);">+ {additionalQuantityFiltered.count}</a>',
                                                        hidden: '{additionalQuantityFiltered.count ? false:true}',
                                                    },
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            delegate: 'a',
                                                            fn: function(el) {
                                                                let me = this,
                                                                    cmp = me.component,
                                                                    cargo = cmp.upVM().get('cargoesGrid.selection');
                                                                Ext.create(
                                                                    'Abraxa.view.portcall.appointment.AddAdditionalQuantity',
                                                                    {
                                                                        viewModel: {
                                                                            parent: cmp.upVM(),
                                                                            data: {
                                                                                cargoAdditional: Ext.create(
                                                                                    'Abraxa.model.cargo.CargoAdditional',
                                                                                    {
                                                                                        portcall_id:
                                                                                            cargo.get('portcall_id'),
                                                                                        cargo_id: cargo.get('id'),
                                                                                    },
                                                                                ),
                                                                                cargo: cargo,
                                                                            },
                                                                        },
                                                                    },
                                                                ).show();
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'textfield',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            label: 'B/L number',
                                            placeholder: 'Enter B/L number',
                                            slug: 'portcallDocumentaryInstructionsBlDetails',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.bl_number}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            label: 'Shippers reference',
                                            placeholder: 'Enter shippers reference',
                                            slug: 'portcallDocumentaryInstructionsBlDetails',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.shippers_reference}',
                                                hidden: '{!cargoesAdvanced}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            label: 'Letter of credit number',
                                            placeholder: 'Enter letter of credit number',
                                            slug: 'portcallDocumentaryInstructionsLetterOfCredit',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.letter_of_credit_number}',
                                                hidden: '{!cargoesAdvanced}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.datefield',
                                            cls: 'a-field-icon icon-date icon-rounded',
                                            label: 'CP date',
                                            placeholder: 'dd/mm/yy',
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            slug: 'portcallDocumentaryInstructionsCPDate',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.cp_date}',
                                                hidden: '{!cargoesAdvanced}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    defaults: {
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                        flex: 1,
                                        listeners: {
                                            blur: function(me) {
                                                let store = this.upVM().get('cargoes');

                                                store.sync({
                                                    success: function() {
                                                        let portcall = me.upVM().get('object_record');
                                                        if (portcall) {
                                                            portcall.set('updated_at', new Date());
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.datefield',
                                            cls: 'a-field-icon icon-date icon-rounded',
                                            label: 'B/L date',
                                            placeholder: 'dd/mm/yy',
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            slug: 'portcallDocumentaryInstructionsBlDetails',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.bl_date}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.datefield',
                                            cls: 'a-field-icon icon-date icon-rounded',
                                            label: 'Date shipped on board',
                                            placeholder: 'dd/mm/yy',
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            slug: 'portcallDocumentaryInstructionsBlDetails',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.shipped_onboard}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            label: 'Freight',
                                            placeholder: 'Enter freight',
                                            slug: 'portcallDocumentaryInstructionsBlDetails',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.freight}',
                                                hidden: '{!cargoesAdvanced}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.datefield',
                                            cls: 'a-field-icon icon-date icon-rounded',
                                            label: 'Letter of credit date',
                                            placeholder: 'dd/mm/yy',
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            slug: 'portcallDocumentaryInstructionsLetterOfCredit',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.letter_of_credit_date}',
                                                hidden: '{!cargoesAdvanced}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            label: 'AES ITN',
                                            placeholder: 'Enter AES ITN',
                                            slug: 'portcallDocumentaryInstructionsAesItn',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.aes_itn}',
                                                hidden: '{!cargoesAdvanced}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            padding: '16 0',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    defaults: {
                                        labelAlign: 'top',
                                        ui: 'classic',
                                        flex: 1,
                                        listeners: {
                                            blur: function(me) {
                                                let store = this.upVM().get('cargoes');
                                                store.sync({
                                                    success: function() {
                                                        let portcall = me.upVM().get('object_record');
                                                        if (portcall) {
                                                            portcall.set('updated_at', new Date());
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'organization.combo',
                                            cls: 'a-field-icon icon-business-center icon-rounded a-prepend-vert',
                                            label: 'Consigniee',
                                            placeholder: 'Choose company',
                                            slug: 'portcallDocumentaryInstructionsConsignee',
                                            subObject: 'cargo',
                                            compliantOnlyCheck: false,
                                            bind: {
                                                value: '{cargoesGrid.selection.consignee_id}',
                                                inputValue: '{cargoesGrid.selection.consignee_name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic bordered" : "classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            floatedPicker: {
                                                minWidth: 386,
                                                listeners: {
                                                    select: function(cmp, newValue) {
                                                        let record = this.upVM().get('cargoesGrid.selection');
                                                        record.set(
                                                            'consignee_name',
                                                            this.getSelection().get('org_name'),
                                                        );
                                                        if (newValue) {
                                                            var company = newValue.get('org_name')
                                                                    ? newValue.get('org_name') + '\xa0\n'
                                                                    : '',
                                                                address = newValue.get('org_address')
                                                                    ? newValue.get('org_address') + '\xa0\n'
                                                                    : '',
                                                                city = newValue.get('city_name')
                                                                    ? newValue.get('city_name') + '\xa0\n'
                                                                    : '',
                                                                country = newValue.get('country_name')
                                                                    ? newValue.get('country_name')
                                                                    : '';
                                                            var formattedAddress = company + address + city + country;
                                                            record.set('consignee_address', formattedAddress);
                                                        }
                                                    },
                                                },
                                            },
                                            listeners: {
                                                clearicontap: function() {
                                                    let record = this.upVM().get('cargoesGrid.selection');
                                                    record.set('consignee_address', null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textareafield',
                                            minHeight: 100,
                                            cls: 'a-append-vert',
                                            label: null,
                                            placeholder: 'Enter address',
                                            slug: 'portcallDocumentaryInstructionsConsignee',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.consignee_address}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic bordered" : "classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    margin: '0 24',
                                    flex: 1,
                                    defaults: {
                                        labelAlign: 'top',
                                        ui: 'classic',
                                        flex: 1,
                                        listeners: {
                                            blur: function(me) {
                                                let store = this.upVM().get('cargoes');
                                                store.sync({
                                                    success: function() {
                                                        let portcall = me.upVM().get('object_record');
                                                        if (portcall) {
                                                            portcall.set('updated_at', new Date());
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'organization.combo',
                                            cls: 'a-field-icon icon-business-center icon-rounded a-prepend-vert',
                                            label: 'Shipper',
                                            placeholder: 'Choose company',
                                            slug: 'portcallDocumentaryInstructionsShipper',
                                            subObject: 'cargo',
                                            compliantOnlyCheck: false,
                                            bind: {
                                                value: '{cargoesGrid.selection.shipper_id}',
                                                inputValue: '{cargoesGrid.selection.shipper}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic bordered" : "classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            floatedPicker: {
                                                minWidth: 386,
                                                listeners: {
                                                    select: function(cmp, newValue) {
                                                        let record = this.upVM().get('cargoesGrid.selection');
                                                        record.set('shipper', this.getSelection().get('org_name'));
                                                        if (newValue) {
                                                            var company = newValue.get('org_name')
                                                                    ? newValue.get('org_name') + '\xa0\n'
                                                                    : '',
                                                                address = newValue.get('org_address')
                                                                    ? newValue.get('org_address') + '\xa0\n'
                                                                    : '',
                                                                city = newValue.get('city_name')
                                                                    ? newValue.get('city_name') + '\xa0\n'
                                                                    : '',
                                                                country = newValue.get('country_name')
                                                                    ? newValue.get('country_name')
                                                                    : '';
                                                            var formattedAddress = company + address + city + country;
                                                            record.set('shipper_address', formattedAddress);
                                                        }
                                                    },
                                                },
                                            },
                                            listeners: {
                                                clearicontap: function() {
                                                    let record = this.upVM().get('cargoesGrid.selection');
                                                    record.set('shipper_address', null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textareafield',
                                            minHeight: 100,
                                            cls: 'a-append-vert',
                                            label: null,
                                            placeholder: 'Enter address',
                                            slug: 'portcallDocumentaryInstructionsShipper',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.shipper_address}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic bordered" : "classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    defaults: {
                                        labelAlign: 'top',
                                        ui: 'classic',
                                        flex: 1,
                                        listeners: {
                                            blur: function(me) {
                                                let store = this.upVM().get('cargoes');
                                                store.sync({
                                                    success: function() {
                                                        let portcall = me.upVM().get('object_record');
                                                        if (portcall) {
                                                            portcall.set('updated_at', new Date());
                                                        }
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'organization.combo',
                                            cls: 'a-field-icon icon-business-center icon-rounded a-prepend-vert',
                                            label: 'Notify address',
                                            placeholder: 'Choose company',
                                            slug: 'portcallDocumentaryInstructionsNotify',
                                            subObject: 'cargo',
                                            compliantOnlyCheck: false,
                                            bind: {
                                                value: '{cargoesGrid.selection.notify_id}',
                                                inputValue: '{cargoesGrid.selection.notify_name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic bordered" : "classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            floatedPicker: {
                                                minWidth: 386,
                                                listeners: {
                                                    select: function(cmp, newValue) {
                                                        let record = this.upVM().get('cargoesGrid.selection');
                                                        record.set('notify_name', this.getSelection().get('org_name'));
                                                        if (newValue) {
                                                            var company = newValue.get('org_name')
                                                                    ? newValue.get('org_name') + '\xa0\n'
                                                                    : '',
                                                                address = newValue.get('org_address')
                                                                    ? newValue.get('org_address') + '\xa0\n'
                                                                    : '',
                                                                city = newValue.get('city_name')
                                                                    ? newValue.get('city_name') + '\xa0\n'
                                                                    : '',
                                                                country = newValue.get('country_name')
                                                                    ? newValue.get('country_name')
                                                                    : '';
                                                            var formattedAddress = company + address + city + country;
                                                            record.set('notify_address', formattedAddress);
                                                        }
                                                    },
                                                },
                                            },
                                            listeners: {
                                                clearicontap: function() {
                                                    let record = this.upVM().get('cargoesGrid.selection');
                                                    record.set('notify_address', null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textareafield',
                                            minHeight: 100,
                                            cls: 'a-append-vert',
                                            label: null,
                                            placeholder: 'Enter address',
                                            slug: 'portcallDocumentaryInstructionsNotify',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoesGrid.selection.notify_address}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic bordered" : "classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'w-50',
                            defaults: {
                                labelAlign: 'left',
                                ui: 'classic',
                                flex: 1,
                                listeners: {
                                    blur: function(me) {
                                        let store = this.upVM().get('cargoes');
                                        store.sync({
                                            success: function() {
                                                let portcall = me.upVM().get('object_record');
                                                if (portcall) {
                                                    portcall.set('updated_at', new Date());
                                                }
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    },
                                },
                            },
                            items: [
                                {
                                    xtype: 'textareafield',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    labelAlign: 'top',
                                    labelCls: 'align-top',
                                    label: 'Description of goods',
                                    scrollable: false,
                                    maxWidth: '100%',
                                    minHeight: 60,
                                    margin: '8 0 0 0',
                                    placeholder: 'Description',
                                    slug: 'portcallDocumentaryInstructionsDescriptionOfGoods',
                                    subObject: 'cargo',
                                    bind: {
                                        value: '{cargoesGrid.selection.description_of_goods}',
                                        readOnly: '{nonEditable ? true : false}',
                                        ui: '{nonEditable ? "viewonly classic bordered" : "classic"}',
                                        permission: '{userPermissions}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    listeners: {
                                        change: function() {
                                            if (this.initialConfig.height) return;
                                            if (!this.inputElement.dom.style.overflow)
                                                this.inputElement.dom.style.overflow = 'hidden';
                                            this.setHeight(1);
                                            var reqHeight = this.inputElement.dom.scrollHeight;
                                            this.setHeight(reqHeight + 2);
                                            return;
                                        },
                                        painted: function() {
                                            if (this.initialConfig.height) return;
                                            if (!this.inputElement.dom.style.overflow)
                                                this.inputElement.dom.style.overflow = 'hidden';
                                            this.setHeight(1);
                                            var reqHeight = this.inputElement.dom.scrollHeight;
                                            this.setHeight(reqHeight + 2);
                                            return;
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
});

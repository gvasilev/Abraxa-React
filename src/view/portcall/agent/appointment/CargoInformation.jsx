Ext.define('Abraxa.view.portcall.appointment.CargoInformation', {
    extend: 'Ext.Container',
    xtype: 'appointment.cargo.information',
    padding: '8 24',
    items: [
        {
            xtype: 'container',
            // cls: 'hbox',
            items: [
                {
                    xtype: 'div',
                    html: "<div class='hbox'><div class='a-badge a-badge-cargo'><i></i></div><div class='a-panel-title fs-14'>Cargo information</div></div>",
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
                {
                    xtype: 'button',
                    height: 30,
                    right: 40,
                    bottom: 0,
                    top: 0,
                    style: 'margin: auto;',
                    ui: 'tool-text-sm normal',
                    iconCls: 'md-icon-outlined md-icon-unfold-more',
                    enableToggle: true,
                    text: 'Show advanced',
                    handler: function (me) {
                        if (me.upVM().get('cargoesAdvanced')) {
                            me.upVM().set('cargoesAdvanced', false);
                            me.setText('Show advanced');
                            me.setIconCls('md-icon-outlined md-icon-unfold-more');
                        } else {
                            me.upVM().set('cargoesAdvanced', true);
                            me.setText('Hide advanced');
                            me.setIconCls('md-icon-outlined md-icon-unfold-less');
                        }
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-collapsible-container a-appointments-form',
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
                            blur: function (me) {
                                let store = this.upVM().get('cargoes');

                                store.sync({
                                    success: function () {
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
                            xtype: 'unit.field',
                            label: 'Quantity',
                            cls: 'a-field-icon icon-short icon-rounded',
                            margin: '0 0 4 0',
                            maxWidth: 440,
                            slug: 'portcallCargoGeneral',
                            subObject: 'cargo',
                            bind: {
                                value: '{cargoesGrid.selection.quantity}',
                                valueUnit: '{cargoesGrid.selection.unit}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                options: '{defaultCargoUnits}',
                            },
                        },
                        {
                            xtype: 'unit.field',
                            label: 'Shore scale qty',
                            cls: 'a-field-icon icon-short icon-rounded',
                            maxWidth: 440,
                            slug: 'portcallCargoGeneral',
                            subObject: 'cargo',
                            bind: {
                                value: '{cargoesGrid.selection.shore_scale_quantity}',
                                valueUnit: '{cargoesGrid.selection.shore_scale_unit}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{!cargoesAdvanced}',
                                options: '{defaultCargoUnits}',
                            },
                        },
                        {
                            xtype: 'unit.field',
                            label: 'Outturn qty',
                            cls: 'a-field-icon icon-short icon-rounded',
                            margin: '4 0 0 0',
                            padding: '0 0 2 0',
                            maxWidth: 440,
                            flex: '1 1 auto',
                            slug: 'portcallCargoExtraMeasurements',
                            subObject: 'cargo',
                            bind: {
                                value: '{cargoesGrid.selection.outturn_quantity}',
                                valueUnit: '{cargoesGrid.selection.outturn_unit}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{!cargoesAdvanced}',
                                options: '{defaultCargoUnits}',
                            },
                        },
                        {
                            xtype: 'selectfield',
                            label: 'Operation',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: 'Choose operation',
                            options: ['Loading', 'Discharging', 'Transshipment', 'Lightering'],
                            reference: 'operationField',
                            slug: 'portcallCargoGeneral',
                            subObject: 'cargo',
                            bind: {
                                value: '{cargoesGrid.selection.function}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                        },
                        {
                            xtype: 'vessel.combo',
                            cls: 'a-field-icon icon-vessel icon-rounded',
                            slug: 'portcallCargoOriginDest',
                            subObject: 'cargo',
                            clearable: false,
                            triggers: {
                                search: {
                                    side: 'right',
                                    iconCls: 'md-icon-search',
                                    style: 'padding-right: 8px;',
                                },
                                tbn: null,
                                expand: null,
                            },
                            label: 'Transshipment from',
                            hidden: true,
                            bind: {
                                value: '{cargoesGrid.selection.transshipment_from}',
                                inputValue: '{cargoesGrid.selection.transshipment_from_name}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{operationField.selection.value == "Transshipment" ? false:true}',
                            },
                            listeners: {
                                select: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('transshipment_from_name', this.getSelection().get('name'));
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('transshipment_from_name', null);
                                },
                            },
                        },
                        {
                            xtype: 'vessel.combo',
                            cls: 'a-field-icon icon-vessel icon-rounded',
                            slug: 'portcallCargoOriginDest',
                            subObject: 'cargo',
                            clearable: false,
                            triggers: {
                                search: {
                                    side: 'right',
                                    iconCls: 'md-icon-search',
                                    style: 'padding-right: 8px;',
                                },
                                tbn: null,
                                expand: null,
                            },
                            label: 'Lightering from',
                            hidden: true,
                            bind: {
                                value: '{cargoesGrid.selection.lightering_from}',
                                inputValue: '{cargoesGrid.selection.lightering_from_name}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{operationField.selection.value == "Lightering" ? false:true}',
                            },
                            listeners: {
                                select: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('lightering_from_name', this.getSelection().get('name'));
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('lightering_from_name', null);
                                },
                            },
                        },
                        {
                            xtype: 'port.combo',
                            cls: 'a-field-icon icon-port icon-rounded',
                            slug: 'portcallCargoOriginDest',
                            subObject: 'cargo',
                            clearable: false,
                            label: 'Load port',
                            bind: {
                                value: '{cargoesGrid.selection.load_port_id}',
                                inputValue: '{cargoesGrid.selection.load_port_name}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            listeners: {
                                painted: function (me) {
                                    if (me.upVM().get('cargoesGrid.selection.load_port_id')) {
                                        me.getStore().load({
                                            params: {
                                                query: me.upVM().get('cargoesGrid.selection.load_port_name'),
                                            },
                                            callback: function (records, operation, success) {
                                                // do something after the load finishes
                                            },
                                            scope: this,
                                        });
                                        me.setValue(me.upVM().get('cargoesGrid.selection.load_port_id'));
                                        me.setInputValue(me.upVM().get('cargoesGrid.selection.load_port_name'));
                                    }
                                },
                                select: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('load_port_name', this.getSelection().get('port_name'));
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('load_port_name', null);
                                },
                            },
                        },
                        {
                            xtype: 'port.berths',
                            cls: 'a-field-icon icon-berth icon-rounded',
                            label: 'Berth',
                            placeholder: 'Enter berth name',
                            store: [],
                            subObject: 'berth',
                            slug: 'portcallCargoBerth',
                            reference: 'portcallCargoBerth',
                            bind: {
                                store: '{berthStore}',
                                value: '{cargoesGrid.selection.berth_id}',
                                inputValue: '{cargoesGrid.selection.berth_name}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            listeners: {
                                select: function () {
                                    if (this.getSelection()) {
                                        let cargoGridSelection = this.upVM().get('cargoesGrid.selection');
                                        if (cargoGridSelection) {
                                            cargoGridSelection.set('berth_name', this.getSelection().get('name'));
                                            cargoGridSelection.set(
                                                'terminal_id',
                                                parseInt(this.getSelection().get('terminal_id'))
                                            );
                                        }
                                    }
                                },
                                blur: function (me) {
                                    let store = this.upVM().get('cargoes');
                                    store.sync({
                                        success: function () {
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
                        {
                            xtype: 'organization.combo',
                            label: 'Charterer',
                            placeholder: 'Enter company',
                            slug: 'portcallCargoCharterer',
                            subObject: 'cargo',
                            cls: 'a-field-icon icon-business-center icon-rounded',
                            floatedPicker: {
                                minWidth: 284,
                            },
                            bind: {
                                value: '{nonEditable ? null : cargoesGrid.selection.charterer_id}',
                                inputValue: '{cargoesGrid.selection.charterer_name}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{!cargoesAdvanced}',
                            },
                            listeners: {
                                select: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('charterer_name', this.getSelection().get('org_name'));
                                    record.set('charterer_id', this.getSelection().get('org_id'));
                                },
                                painted: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');

                                    if (record) this.setInputValue(record.get('charterer_name'));
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('charterer_name', null);
                                    record.set('charterer_id', null);
                                },
                            },
                        },
                        // Laycan from
                        {
                            xtype: 'container',
                            flex: 1,
                            padding: '2 0',
                            margin: '0 56 0 0',
                            defaults: {
                                labelAlign: 'left',
                                ui: 'hovered-border classic',
                                listeners: {
                                    blur: function (me) {
                                        let store = this.upVM().get('cargoes');

                                        store.sync({
                                            success: function () {
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
                                    label: 'Laycan from',
                                    placeholder: 'dd/mm/yy',
                                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                    slug: 'portcallCargoLaycan',
                                    bind: {
                                        value: '{cargoesGrid.selection.laycan_from}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        hidden: '{!cargoesAdvanced}',
                                        permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        blur: function (me) {
                                            let record = me.upVM().get('cargoesGrid.selection'),
                                                date = me.getValue(),
                                                laycan_to = record.get('laycan_to'),
                                                store = this.upVM().get('cargoes');
                                            // me.up('container').removeCls('is-invalid');
                                            if (date && laycan_to) {
                                                if (moment(laycan_to).isBefore(date)) {
                                                    me.clearValue();
                                                    me.addCls('is-invalid');
                                                    me.setError('Start date cannot be before the end date.');
                                                }
                                            }
                                            store.sync({
                                                success: function () {
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
                            ],
                        },
                        // Laycan to
                        {
                            xtype: 'container',
                            flex: 1,
                            padding: '2 0',
                            margin: '0 56 0 0',
                            defaults: {
                                labelAlign: 'left',
                                ui: 'hovered-border classic',
                                listeners: {
                                    blur: function (me) {
                                        let store = this.upVM().get('cargoes');

                                        store.sync({
                                            success: function () {
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
                                    label: 'Laycan to',
                                    placeholder: 'dd/mm/yy',
                                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                    slug: 'portcallCargoLaycan',
                                    bind: {
                                        value: '{cargoesGrid.selection.laycan_to}',
                                        ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                        hidden: '{!cargoesAdvanced}',
                                        permission: '{userPermissions}',
                                        // disabled: '{cargoesGrid.selection.laycan_from ? false : true}'
                                    },
                                    listeners: {
                                        blur: function (me) {
                                            let record = me.upVM().get('cargoesGrid.selection'),
                                                date = me.getValue(),
                                                laycan_from = record.get('laycan_from'),
                                                store = this.upVM().get('cargoes');
                                            // me.up('container').removeCls('is-invalid');
                                            if (date && laycan_from) {
                                                if (moment(date).isBefore(laycan_from)) {
                                                    me.clearValue();
                                                    me.addCls('is-invalid');
                                                    me.setError('End date cannot be before the start date.');
                                                }
                                            }
                                            store.sync({
                                                success: function () {
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
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    defaults: {
                        labelAlign: 'left',
                        ui: 'hovered-border classic',
                        flex: 1,
                        listeners: {
                            blur: function (me) {
                                let store = this.upVM().get('cargoes');

                                store.sync({
                                    success: function () {
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
                            xtype: 'commodity.combo',
                            label: 'Commodity',
                            cls: 'a-field-icon icon-short icon-rounded',
                            valueField: 'id',
                            displayField: 'name',
                            clearable: true,
                            slug: 'portcallCargoGeneral',
                            subObject: 'cargo',
                            bind: {
                                value: '{cargoesGrid.selection.commodity_id}',
                                inputValue: '{cargoesGrid.selection.commodity}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            listeners: {
                                select: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('commodity', this.getSelection().get('name'));
                                },
                            },
                        },
                        {
                            xtype: 'unit.field',
                            label: 'Draft survey qty',
                            cls: 'a-field-icon icon-short icon-rounded',
                            margin: '2 0 0 0',
                            padding: '0 0 2 0',
                            maxWidth: 440,
                            slug: 'portcallCargoExtraMeasurements',
                            subObject: 'cargo',
                            bind: {
                                value: '{cargoesGrid.selection.draft_survey_quantity}',
                                valueUnit: '{cargoesGrid.selection.draft_survey_unit}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{!cargoesAdvanced}',
                                options: '{defaultCargoUnits}',
                            },
                        },
                        {
                            xtype: 'abraxa.numberfield',
                            label: 'Units',
                            cls: 'a-field-icon icon-short icon-rounded',
                            margin: '2 0 0 0',
                            padding: '0 0 2 0',
                            maxWidth: 440,
                            slug: 'portcallCargoExtraMeasurements',
                            subObject: 'cargo',
                            bind: {
                                value: '{cargoesGrid.selection.units}',
                                // valueUnit: "mts",
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{!cargoesAdvanced}',
                            },
                            // options: ["mts"]
                        },
                        {
                            xtype: 'draftfield',
                            cls: 'a-field-icon icon-short icon-rounded',
                            ui: 'hovered-border classic',
                            maxWidth: 440,
                            margin: '2 0 0 0',
                            padding: '0 0 2 0',
                            label: 'Stowage factor',
                            slug: 'portcallCargoStowage',
                            subObject: 'cargo',
                            options: ['cbm/mt', 'cbft/mt', 'cbm/lt', 'cbft/lt'],
                            bind: {
                                value: '{cargoesGrid.selection.stowage_factor}',
                                valueUnit: '{cargoesGrid.selection.stowage_factor_unit}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                        },
                        {
                            xtype: 'vessel.combo',
                            cls: 'a-field-icon icon-vessel icon-rounded',
                            slug: 'portcallCargoOriginDest',
                            subObject: 'cargo',
                            clearable: false,
                            triggers: {
                                search: {
                                    side: 'right',
                                    iconCls: 'md-icon-search',
                                    style: 'padding-right: 8px;',
                                },
                                tbn: null,
                                expand: null,
                            },
                            label: 'Transshipment to',
                            required: false,
                            bind: {
                                value: '{cargoesGrid.selection.transshipment_to}',
                                inputValue: '{cargoesGrid.selection.transshipment_to_name}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{operationField.selection.value == "Transshipment" ? false:true}',
                            },
                            listeners: {
                                select: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('transshipment_to_name', this.getSelection().get('name'));
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('transshipment_to_name', null);
                                },
                            },
                        },
                        {
                            xtype: 'vessel.combo',
                            cls: 'a-field-icon icon-vessel icon-rounded',
                            slug: 'portcallCargoOriginDest',
                            subObject: 'cargo',
                            clearable: false,
                            triggers: {
                                search: {
                                    side: 'right',
                                    iconCls: 'md-icon-search',
                                    style: 'padding-right: 8px;',
                                },
                                tbn: null,
                                expand: null,
                            },
                            label: 'Lightering to',
                            hidden: true,
                            bind: {
                                value: '{cargoesGrid.selection.lightering_to}',
                                inputValue: '{cargoesGrid.selection.lightering_to_name}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{operationField.selection.value == "Lightering" ? false:true}',
                            },
                            listeners: {
                                select: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('lightering_to_name', this.getSelection().get('name'));
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('lightering_to_name', null);
                                },
                            },
                        },
                        {
                            xtype: 'port.combo',
                            cls: 'a-field-icon icon-port icon-rounded',
                            slug: 'portcallCargoOriginDest',
                            subObject: 'cargo',
                            clearable: false,
                            label: 'Discharge port',
                            bind: {
                                value: '{cargoesGrid.selection.discharge_port_id}',
                                inputValue: '{cargoesGrid.selection.discharge_port_name}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            listeners: {
                                painted: function (me) {
                                    if (me.upVM().get('cargoesGrid.selection.discharge_port_id')) {
                                        me.getStore().load({
                                            params: {
                                                query: me.upVM().get('cargoesGrid.selection.discharge_port_name'),
                                            },
                                            callback: function (records, operation, success) {
                                                // do something after the load finishes
                                            },
                                            scope: this,
                                        });
                                        me.setValue(me.upVM().get('cargoesGrid.selection.discharge_port_id'));
                                        me.setInputValue(me.upVM().get('cargoesGrid.selection.discharge_port_name'));
                                    }
                                },
                                select: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('discharge_port_name', this.getSelection().get('port_name'));
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('discharge_port_name', null);
                                },
                            },
                        },
                        {
                            xtype: 'port.terminals',
                            cls: 'a-field-icon icon-short icon-rounded',
                            label: 'Terminal',
                            slug: 'portcallCargoBerth',
                            subObject: 'berth',
                            bind: {
                                store: '{terminals}',
                                value: '{cargoesGrid.selection.terminal_id}',
                                inputValue: '{cargoesGrid.selection.terminal_name}',
                                readOnly: true,
                                ui: 'viewonly classic',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                listeners: {
                                    select: function () {
                                        let record = this.upVM().get('cargoesGrid.selection');
                                        record.set('terminal_name', this.getSelection().get('name'));
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'organization.combo',
                            label: 'Receiver',
                            placeholder: 'Choose company',
                            slug: 'portcallCargoReceiver',
                            subObject: 'cargo',
                            cls: 'a-field-icon icon-business-center icon-rounded',
                            floatedPicker: {
                                minWidth: 284,
                            },
                            bind: {
                                value: '{nonEditable ? null : cargoesGrid.selection.receiver_id}',
                                inputValue: '{cargoesGrid.selection.receiver}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                hidden: '{!cargoesAdvanced}',
                            },
                            listeners: {
                                select: function (cmp, newValue) {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('receiver', this.getSelection().get('org_name'));
                                    record.set('receiver_id', this.getSelection().get('org_id'));
                                    if (newValue) {
                                        var address = newValue.get('org_address')
                                                ? newValue.get('org_address') + '\n'
                                                : '',
                                            city = newValue.get('city_name') ? newValue.get('city_name') + '\n' : '',
                                            country = newValue.get('country_name') ? newValue.get('country_name') : '';

                                        var formattedAddress = address + city + country;
                                        record.set('receiver_address', formattedAddress);
                                    }
                                },
                                painted: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');

                                    if (record) this.setInputValue(record.get('receiver'));
                                },
                                clearicontap: function () {
                                    let record = this.upVM().get('cargoesGrid.selection');
                                    record.set('receiver_address', null);
                                },
                            },
                        },
                        {
                            xtype: 'selectfield',
                            label: 'Customs status',
                            slug: 'portcallCargoCustoms',
                            subObject: 'cargo',
                            placeholder: 'Enter customs status',
                            cls: 'a-field-icon icon-short icon-rounded',
                            options: ['T2L', 'EU', 'T1', 'Export doc', 'Non EU'],
                            bind: {
                                value: '{cargoesGrid.selection.customs_status}',
                                readOnly: '{nonEditable ? true : false}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                hidden: '{!cargoesAdvanced}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});

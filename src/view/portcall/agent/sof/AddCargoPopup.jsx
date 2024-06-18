Ext.define('Abraxa.view.AddCargoPopup', {
    extend: 'Ext.Dialog',
    xtype: 'cargo.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 540,
    minHeight: 440,
    maxHeight: 860,
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    viewModel: {
        data: {
            cargoAdvanced: false,
        },
    },
    title: '<div class="a-badge a-badge-cargo"><i></i></div>Add cargo',
    items: [
        {
            xtype: 'formpanel',
            flex: 1,
            reference: 'createCargo',
            scrollable: 'y',
            layout: 'vbox',
            items: [
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    docked: 'top',
                },
                {
                    xtype: 'container',
                    scrollable: 'y',
                    flex: 1,
                    cls: 'general_data_container',
                    items: [
                        {
                            xtype: 'container',
                            margin: '0 24 0 72',
                            cls: 'a-dialog-form',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-data-item',
                                    defaults: {
                                        cls: 'a-field-icon icon-short icon-rounded',
                                        labelAlign: 'left',
                                        ui: 'hovered-border classic',
                                    },
                                    items: [
                                        {
                                            xtype: 'unit.field',
                                            margin: '0 0 4 0',
                                            slug: 'portcallCargoGeneral',
                                            subObject: 'cargo',
                                            label: 'Quantity',
                                            required: true,
                                            maxValue: 99999999, //DEV-1456
                                            bind: {
                                                value: '{cargoRecord.quantity}',
                                                valueUnit: '{cargoRecord.unit}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                options: '{defaultCargoUnits}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'commodity.combo',
                                            label: 'Commodity',
                                            required: true,
                                            clearable: true,
                                            valueField: 'id',
                                            displayField: 'name',
                                            slug: 'portcallCargoGeneral',
                                            subObject: 'cargo',
                                            bind: {
                                                value: '{cargoRecord.commodity_id}',
                                                inputValue: '{cargoRecord.commodity}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('commodity', this.getSelection().get('name'));
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Operation',
                                            placeholder: 'Choose operation',
                                            options: ['Loading', 'Discharging', 'Transshipment', 'Lightering'],
                                            reference: 'operationField',
                                            slug: 'portcallCargoGeneral',
                                            subObject: 'cargo',
                                            required: true,
                                            bind: {
                                                value: '{cargoRecord.function}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                            },
                                            listeners: {
                                                select: function (cmp, selection) {
                                                    let cargoRecord = this.upVM().get('cargoRecord'),
                                                        portCallRecord = this.upVM().get('portCallRecord');
                                                    if (
                                                        selection.get('value') === 'Loading' &&
                                                        !cargoRecord.get('load_port_id')
                                                    ) {
                                                        cargoRecord.set('load_port_id', portCallRecord.get('port_id'));
                                                        cargoRecord.set(
                                                            'load_port_name',
                                                            portCallRecord.get('port_name')
                                                        );
                                                    }
                                                    if (
                                                        selection.get('value') === 'Discharging' &&
                                                        !cargoRecord.get('discharge_port_id')
                                                    ) {
                                                        cargoRecord.set(
                                                            'discharge_port_id',
                                                            portCallRecord.get('port_id')
                                                        );
                                                        cargoRecord.set(
                                                            'discharge_port_name',
                                                            portCallRecord.get('port_name')
                                                        );
                                                    }
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
                                            label: 'Transshipment from',
                                            required: false,
                                            hidden: true,
                                            bind: {
                                                value: '{cargoRecord.transshipment_from}',
                                                inputValue: '{cargoRecord.transshipment_from_name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                                hidden: '{operationField.selection.value == "Transshipment" ? false:true}',
                                                // required: '{operationField.selection.value == "Transshipment" ? true:false}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set(
                                                        'transshipment_from_name',
                                                        this.getSelection().get('name')
                                                    );
                                                },
                                                clearicontap: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('transshipment_from_name', null);
                                                },
                                                painted: function () {
                                                    this.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'vessel.combo',
                                            cls: 'a-field-icon icon-vessel icon-rounded',
                                            slug: 'portcallCargoOriginDest',
                                            subObject: 'cargo',
                                            clearable: false,
                                            label: 'Transshipment to',
                                            triggers: {
                                                search: {
                                                    side: 'right',
                                                    iconCls: 'md-icon-search',
                                                    style: 'padding-right: 8px;',
                                                },
                                                tbn: null,
                                                expand: null,
                                            },
                                            required: false,
                                            hidden: true,
                                            bind: {
                                                value: '{cargoRecord.transshipment_to}',
                                                inputValue: '{cargoRecord.transshipment_to_name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                                hidden: '{operationField.selection.value == "Transshipment" ? false:true}',
                                                // required: '{operationField.selection.value == "Transshipment" ? true:false}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set(
                                                        'transshipment_to_name',
                                                        this.getSelection().get('name')
                                                    );
                                                },
                                                clearicontap: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('transshipment_to_name', null);
                                                },
                                                painted: function () {
                                                    this.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'vessel.combo',
                                            cls: 'a-field-icon icon-vessel icon-rounded',
                                            slug: 'portcallCargoOriginDest',
                                            subObject: 'cargo',
                                            clearable: false,
                                            label: 'Lightering from',
                                            triggers: {
                                                search: {
                                                    side: 'right',
                                                    iconCls: 'md-icon-search',
                                                    style: 'padding-right: 8px;',
                                                },
                                                tbn: null,
                                                expand: null,
                                            },
                                            required: false,
                                            hidden: true,
                                            bind: {
                                                value: '{cargoRecord.lightering_from}',
                                                inputValue: '{cargoRecord.lightering_from_name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                                hidden: '{operationField.selection.value == "Lightering" ? false:true}',
                                                // required: '{operationField.selection.value == "Lightering" ? true:false}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('lightering_from_name', this.getSelection().get('name'));
                                                },
                                                clearicontap: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('lightering_from_name', null);
                                                },
                                                painted: function () {
                                                    this.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'vessel.combo',
                                            cls: 'a-field-icon icon-vessel icon-rounded',
                                            slug: 'portcallCargoOriginDest',
                                            subObject: 'cargo',
                                            clearable: false,
                                            label: 'Lightering to',
                                            triggers: {
                                                search: {
                                                    side: 'right',
                                                    iconCls: 'md-icon-search',
                                                    style: 'padding-right: 8px;',
                                                },
                                                tbn: null,
                                                expand: null,
                                            },
                                            required: false,
                                            hidden: true,
                                            bind: {
                                                value: '{cargoRecord.lightering_to}',
                                                inputValue: '{cargoRecord.lightering_to_name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                                hidden: '{operationField.selection.value == "Lightering" ? false:true}',
                                                // required: '{operationField.selection.value == "Lightering" ? true:false}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('lightering_to_name', this.getSelection().get('name'));
                                                },
                                                clearicontap: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('lightering_to_name', null);
                                                },
                                                painted: function () {
                                                    this.setError(null);
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
                                            // required: false,
                                            bind: {
                                                value: '{cargoRecord.load_port_id}',
                                                inputValue: '{cargoRecord.load_port_name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                                // required:
                                                //     '{operationField.selection.value == "Loading" || operationField.selection.value == "Discharging" ? true : false}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('load_port_name', this.getSelection().get('port_name'));
                                                },
                                                clearicontap: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('load_port_name', null);
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
                                            // required: false,
                                            bind: {
                                                value: '{cargoRecord.discharge_port_id}',
                                                inputValue: '{cargoRecord.discharge_port_name}',
                                                readOnly: '{nonEditable ? true : false}',
                                                ui: '{nonEditable ? "viewonly classic" : "hovered-border classic"}',
                                                permission: '{userPermissions}',
                                                objectPermission: '{objectPermissions}',
                                                // required:
                                                //     '{operationField.selection.value == "Loading" || operationField.selection.value == "Discharging" ? true : false}',
                                            },
                                            listeners: {
                                                select: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set(
                                                        'discharge_port_name',
                                                        this.getSelection().get('port_name')
                                                    );
                                                },
                                                clearicontap: function () {
                                                    let record = this.upVM().get('cargoRecord');
                                                    record.set('discharge_port_name', null);
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
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'addCargoPopupCancelButton',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('cargoRecord');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            testId: 'addCargoPopupSaveButton',
            bind: {
                text: '{editMode ? "Save":"Add"}',
            },
            enableToggle: true,
            ui: 'action loading',
            handler: function (me) {
                let form = me.up('dialog').down('formpanel'),
                    record = me.upVM().get('cargoRecord'),
                    store = me.upVM().get('cargoStore'),
                    vm = this.upVM(),
                    allCargoes = Ext.ComponentQuery.query(Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main')[0]
                        .getVM()
                        .get('cargoes');

                if (form.validate()) {
                    if (!me.upVM().get('editMode')) {
                        store.add(record);
                    }
                    store.sync({
                        success: function (response, options) {
                            record.cargo_additional_quantity().setData(record.getData().cargo_additional_quantity);
                            allCargoes.add(record);
                            allCargoes.commitChanges();
                            vm.get('object_record').cargoes().add(record);
                            Ext.toast('Record created', 1000);
                            mixpanel.track('Add cargo - appointment tab');
                            me.up('dialog').destroy();
                        },
                    });
                } else {
                    me.toggle(false);
                    this.up('dialog')
                        .down('form\\.error')
                        .setHtml('Please fill all required fields')
                        .show()
                        .addCls('error');
                }
            },
        },
    ],
    listeners: {
        destroy: function () {
            let record = this.upVM().get('cargoRecord');
            if (record) {
                record.reject();
            }
        },
        painted: function () {
            this.focus();
            this.down('unit\\.field').focus();
        },
    },
});

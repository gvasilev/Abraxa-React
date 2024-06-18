import './VoyageController';
import './CreateVoyageViewModel';
import '../../store/voyage/VoyageTypes';

Ext.define('Abraxa.view.voyage.CreateVoyage', {
    extend: 'Ext.Container',
    xtype: 'CreateVoyage',
    testId: 'createVoyage',
    cls: 'a-card-layout-main-container a-voyage-main-container',
    viewModel: 'CreateVoyageViewModel',
    controller: 'VoyageController',
    reference: 'createVoyageRecord',
    publishes: ['record'],
    layout: 'vbox',
    scrollable: true,
    items: [
        {
            xtype: 'formpanel',
            cls: 'a-voyage-form',
            testId: 'createVoyageForm',
            flex: 1,
            layout: 'vbox',
            scrollable: true,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-card-layout-inner-container-md',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-card-layout-title',
                            testId: 'createVoyageTitle',
                            bind: {
                                html: '{isEdit ? "Edit voyage":"Let’s get you started with a new voyage"}',
                            },
                        },
                        // Form Error
                        {
                            xtype: 'form.error',
                            testId: 'createVoyageFormError',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            showAnimation: 'fadeIn',
                        },
                        // Voyage Info
                        {
                            xtype: 'container',
                            cls: 'a-card-container',
                            items: [
                                // Card Header
                                {
                                    xtype: 'container',
                                    cls: 'a-card-header',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Voyage info',
                                        },
                                    ],
                                },
                                // Card Body
                                {
                                    xtype: 'container',
                                    cls: 'a-card-body',
                                    items: [
                                        {
                                            xtype: 'container',
                                            cls: 'a-form-container a-form-2col',
                                            layout: {
                                                type: 'hbox',
                                                wrap: true,
                                            },
                                            defaults: {
                                                defaults: {
                                                    clearable: false,
                                                    labelAlign: 'top',
                                                    ui: 'classic',
                                                },
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-field-container',
                                                    items: [
                                                        {
                                                            xtype: 'vessel.combo',
                                                            label: 'Vessel',
                                                            testId: 'createVoyageVesselCombo',
                                                            required: true,
                                                            placeholder: 'Choose vessel',
                                                            bind: {
                                                                value: '{voyage.vessel.imo}',
                                                                inputValue: '{voyage.vessel.name}',
                                                                disabled: '{voyage.is_locked_for_editing}',
                                                            },
                                                            cls: 'a-field-icon icon-rounded icon-vessel a-classic-has-tbn',
                                                            listeners: {
                                                                painted: function (me) {
                                                                    me.focus();
                                                                    me.setError(null);
                                                                    let record = me.upVM().get('voyage');
                                                                    if (record) {
                                                                        if (record.get('vessel')) {
                                                                            me.setInputValue(record.get('vessel').name);
                                                                        }
                                                                    }
                                                                },
                                                                select: function () {
                                                                    let selection = this.getSelection(),
                                                                        voyage = this.upVM().get('voyage');
                                                                    if (selection) {
                                                                        voyage.set(
                                                                            'vessel_name',
                                                                            selection.get('name')
                                                                        );
                                                                        voyage.set('vessel_imo', selection.get('imo'));
                                                                        voyage.set('vessel_id', selection.get('id'));
                                                                    }
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-field-container',
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Voyage ID',
                                                            testId: 'createVoyageVoyageIDField',
                                                            required: true,
                                                            placeholder: 'Enter voyage ID',
                                                            cls: 'a-field-icon icon-rounded icon-tag',
                                                            bind: {
                                                                value: '{voyage.voyage_number}',
                                                                disabled: '{voyage.is_locked_for_editing}',
                                                            },
                                                            listeners: {
                                                                painted: function (me) {
                                                                    me.setError(null);
                                                                },
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-field-container',
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            label: 'Reference',
                                                            testId: 'createVoyageReferenceField',
                                                            placeholder: 'Enter reference number',
                                                            cls: 'a-field-icon icon-rounded icon-tag',
                                                            bind: {
                                                                value: '{voyage.reference_number}',
                                                                disabled: '{voyage.is_locked_for_editing}',
                                                            },
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-field-container',
                                                    items: [
                                                        {
                                                            xtype: 'selectfield',
                                                            label: 'Legal entity',
                                                            testId: 'createVoyageLegalEntityField',
                                                            placeholder: 'Choose legal entity',
                                                            valueField: 'id',
                                                            displayField: 'office_name',
                                                            bind: {
                                                                store: '{offices}',
                                                                value: '{voyage.office_id}',
                                                                disabled: '{voyage.is_locked_for_editing}',
                                                            },
                                                            cls: 'a-field-icon icon-rounded icon-business-center',
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-field-container',
                                                    items: [
                                                        {
                                                            xtype: 'user.combo',
                                                            label: 'Operator',
                                                            testId: 'createVoyageOperatorCombo',
                                                            clearable: true,
                                                            required: true,
                                                            bind: {
                                                                value: '{voyage.assigned_to}',
                                                            },
                                                            placeholder: 'Choose operator',
                                                            cls: 'a-field-icon icon-rounded icon-person',
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-field-container',
                                                    items: [
                                                        {
                                                            xtype: 'selectfield',
                                                            label: 'Voyage type',
                                                            testId: 'createVoyageVoyageTypeField',
                                                            required: true,
                                                            placeholder: 'Choose operator',
                                                            cls: 'a-field-icon icon-rounded icon-short',
                                                            displayField: 'name',
                                                            valueField: 'id',
                                                            store: {
                                                                type: 'voyageTypes',
                                                            },
                                                            bind: {
                                                                value: '{voyage.type_id}',
                                                                disabled: '{voyage.is_locked_for_editing}',
                                                            },
                                                            listeners: {
                                                                painted: function (me) {
                                                                    me.setError(null);
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
                        // Spacer
                        {
                            xtype: 'div',
                            height: 8,
                        },
                        // Port Itinerary Form
                        {
                            xtype: 'container',
                            cls: 'a-card-container',
                            items: [
                                // Card Header
                                {
                                    xtype: 'container',
                                    cls: 'a-card-header',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Port itinerary',
                                        },
                                    ],
                                },
                                // Card Body
                                {
                                    xtype: 'container',
                                    cls: 'a-card-body',
                                    items: [
                                        {
                                            xtype: 'abraxa.formlist',
                                            cls: 'a-form-itinerary-list a-form-3col',
                                            testId: 'createVoyagePortItineraryFormList',
                                            itemRipple: false,
                                            bind: {
                                                store: '{portcalls}',
                                            },
                                            itemConfig: {
                                                viewModel: {
                                                    formulas: {
                                                        recordIndex: {
                                                            bind: {
                                                                bindTo: '{record}',
                                                                deep: true,
                                                            },
                                                            get: function (record) {
                                                                if (record) {
                                                                    let store = this.get('portcalls');
                                                                    return store.indexOf(record);
                                                                }
                                                            },
                                                        },
                                                    },
                                                },
                                                xtype: 'container',
                                                cls: 'a-form-itinerary-row',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                    pack: 'space-between',
                                                },
                                                defaults: {
                                                    defaults: {
                                                        clearable: false,
                                                        labelAlign: 'top',
                                                        ui: 'classic',
                                                    },
                                                },
                                                items: [
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-itinerary-icon',
                                                        html: '<i class="md-icon">radio_button_unchecked</i>',
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-field-container',
                                                        items: [
                                                            {
                                                                xtype: 'port.combo',
                                                                flex: 1,
                                                                cls: 'a-field-icon icon-rounded icon-port',
                                                                placeholder: 'Choose port',
                                                                required: true,
                                                                disabled: false,
                                                                bind: {
                                                                    value: '{record.port_id}',
                                                                    inputValue: '{record.port_name}',
                                                                    label: '{recordIndex ? "":"Port"}',
                                                                    disabled: '{record.is_locked_for_editing}',
                                                                },
                                                                listeners: {
                                                                    painted: function (me) {
                                                                        let comboStore = me.getStore();
                                                                        if (comboStore) {
                                                                            comboStore.addFilter({
                                                                                id: 'port_team_filter',
                                                                                property: 'use_team_filter',
                                                                                operator: '=',
                                                                                value: true,
                                                                            });
                                                                        }
                                                                        let record = me.upVM().get('record');
                                                                        if (record && record.get('port')) {
                                                                            let portId = record.get('port').id,
                                                                                port_name = record.get('port').name;
                                                                            if (portId) {
                                                                                me.getStore().load({
                                                                                    params: {
                                                                                        query: port_name,
                                                                                    },
                                                                                    callback: function (
                                                                                        records,
                                                                                        operation,
                                                                                        success
                                                                                    ) {
                                                                                        // do something after the load finishes
                                                                                    },
                                                                                    scope: this,
                                                                                });
                                                                                me.setValue(portId);
                                                                                me.setInputValue(port_name);
                                                                            }
                                                                        }
                                                                    },
                                                                    select: function () {
                                                                        if (this.getSelection()) {
                                                                            let record = this.upVM().get('record');
                                                                            record.set(
                                                                                'port_name',
                                                                                this.getSelection().get('port_name')
                                                                            );
                                                                        }
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-field-container',
                                                        items: [
                                                            {
                                                                xtype: 'selectfield',
                                                                flex: 1,
                                                                cls: 'a-field-icon icon-rounded icon-short',
                                                                placeholder: 'Choose function',
                                                                forceSelection: true,
                                                                required: true,
                                                                queryMode: 'local',
                                                                valueField: 'name',
                                                                displayField: 'name',
                                                                disabled: false,
                                                                store: {
                                                                    type: 'berth.function',
                                                                },
                                                                bind: {
                                                                    label: '{recordIndex ? "":"Function"}',
                                                                    value: '{record.port_function}',
                                                                    disabled: '{record.is_locked_for_editing}',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-field-container',
                                                        items: [
                                                            {
                                                                xtype: 'abraxa.datetimefield',
                                                                flex: 1,
                                                                cls: 'a-field-icon icon-rounded icon-calendar',
                                                                placeholder: 'Choose ETA',
                                                                disabled: false,
                                                                required: true,
                                                                bind: {
                                                                    label: '{recordIndex ? "":"ETA"}',
                                                                    dateTime: '{record.port_eta}',
                                                                    disabled: '{record.is_locked_for_editing}',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        layout: {
                                                            type: 'hbox',
                                                            align: 'middle',
                                                            pack: 'end',
                                                        },
                                                        hideMode: 'opacity',
                                                        bind: {
                                                            hidden: '{recordIndex && !record.is_locked_for_editing ? false : true}',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'button',
                                                                ui: 'tool-md round remove_port',
                                                                iconCls: 'md-icon md-icon-delete',
                                                                tooltip: {
                                                                    anchorToTarget: true,
                                                                    anchor: true,
                                                                    html: 'Delete port',
                                                                    align: 'bc-tc?',
                                                                    showDelay: 0,
                                                                    hideDelay: 0,
                                                                    dismissDelay: 0,
                                                                    allowOver: false,
                                                                    closeAction: 'destroy',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            cls: 'mt-8',
                                            ui: 'normal small add_port',
                                            iconCls: 'md-icon md-icon-add',
                                            text: 'Add port',
                                            testId: 'createVoyageAddPortButton',
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
            docked: 'bottom',
            cls: 'a-card-footer',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-card-footer-inner',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            flex: 1,
                        },
                        {
                            xtype: 'button',
                            ui: 'default outlined voyage_cancel',
                            margin: '0 8',
                            text: 'Cancel',
                            testId: 'createVoyageCancelButton',
                        },
                        {
                            xtype: 'button',
                            enableToggle: true,
                            ui: 'action loading',
                            bind: {
                                text: '{isEdit ? "Update voyage": "Create voyage"}',
                            },
                            handler: 'voyageAction',
                            testId: 'createVoyageSubmitButton',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'button',
            ui: 'tool-lg round voyage_cancel',
            iconCls: 'md-icon md-icon-close',
            testId: 'createVoyageCloseButton',
            top: 16,
            right: 16,
        },
    ],
    initializeRecord: function (id = null) {
        let viewRecord = this.getRecord();
        if (id && viewRecord && viewRecord.get('id') == id) {
            return;
        }
        Ext.getCmp('main-viewport').setMasked({
            xtype: 'viewport.mask',
        });
        if (id) {
            let voyage = Ext.create('Abraxa.model.voyage.VoyagePrincipal', {
                id: id,
            });
            voyage.load({
                scope: this,
                success: function (record, operation) {
                    this.setRecord(record);
                    this.getViewModel().set('isEdit', true);
                    Ext.getCmp('main-viewport').setMasked(false);
                },
                failure: function (record, operation) {
                    Ext.Msg.alert('Error', 'Could not load record');
                },
            });
        } else {
            let currentUser = this.upVM().get('currentUser');
            let voyage = Ext.create('Abraxa.model.voyage.VoyagePrincipal', {
                assigned_to: currentUser.get('id'),
            });
            this.setRecord(voyage);
            this.getViewModel().set('isEdit', false);
            Ext.getCmp('main-viewport').setMasked(false);
        }
    },
});

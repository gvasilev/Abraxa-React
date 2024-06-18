import './CreateAppointmentViewModel';
import '../../voyage/VoyageAppointmentCargo';
import '../../voyage/VoyageAppointmentInstruction';

Ext.define('Abraxa.view.operations.PortcallsPrincipal.CreateAppointment', {
    extend: 'Ext.Container',
    xtype: 'CreateAppointment',
    testId: 'createAppointment',
    cls: 'a-card-layout-main-container a-voyage-main-container',
    viewModel: 'CreateAppointmentViewModel',
    reference: 'createAppointmentRecord',
    publishes: ['record'],
    layout: 'vbox',
    scrollable: true,
    controller: 'PortcallsPrincipalMainController',
    items: [
        {
            xtype: 'formpanel',
            cls: 'a-voyage-form',
            testId: 'createAppointmentForm',
            flex: 1,
            layout: 'vbox',
            scrollable: true,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-card-layout-inner-container',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-card-layout-title',
                            testId: 'createVoyageTitle',
                            bind: {
                                html: 'Let’s get you started with a new appointment',
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
                                // Card Body
                                {
                                    xtype: 'container',
                                    cls: 'a-card-body',
                                    padding: 0,
                                    items: [
                                        {
                                            xtype: 'container',
                                            cls: 'a-card-section a-bb-100',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    ripple: true,
                                                    html: 'Appointment details',
                                                    cls: 'a-collapsible-title a-collapsible-trigger a-trigger-left fs-14',
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            fn: function fn() {
                                                                let component = this.component;
                                                                component.toggleCls('is-collapsed');
                                                                component
                                                                    .up('container')
                                                                    .down('[cls~=a-collapsible-container]')
                                                                    .toggleCls('is-collapsed');
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-collapsible-container',
                                                    items: [
                                                        // Port Itinerary Form
                                                        {
                                                            xtype: 'container',
                                                            cls: 'a-form-container a-form-3col',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle',
                                                                pack: 'space-between',
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
                                                                                value: '{portcall.voyage.vessel.imo}',
                                                                                inputValue:
                                                                                    '{portcall.voyage.vessel.name}',
                                                                            },
                                                                            cls: 'a-field-icon icon-rounded icon-vessel a-classic-has-tbn',
                                                                            listeners: {
                                                                                painted: function(me) {
                                                                                    me.focus();
                                                                                    me.setError(null);
                                                                                    let record = me
                                                                                        .upVM()
                                                                                        .get('portcall')
                                                                                        .getVoyage();
                                                                                    if (record) {
                                                                                        if (record.get('vessel')) {
                                                                                            me.setInputValue(
                                                                                                record.get('vessel')
                                                                                                    .name,
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                },
                                                                                select: function() {
                                                                                    let selection = this.getSelection(),
                                                                                        voyage = this.upVM()
                                                                                            .get('portcall')
                                                                                            .getVoyage();
                                                                                    if (selection) {
                                                                                        voyage.set(
                                                                                            'vessel_name',
                                                                                            selection.get('name'),
                                                                                        );
                                                                                        voyage.set(
                                                                                            'vessel_imo',
                                                                                            selection.get('imo'),
                                                                                        );
                                                                                        voyage.set(
                                                                                            'vessel_id',
                                                                                            selection.get('id'),
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
                                                                            xtype: 'textfield',
                                                                            label: 'Voyage ID',
                                                                            testId: 'createVoyageVoyageIDField',
                                                                            placeholder: 'Enter voyage ID',
                                                                            cls: 'a-field-icon icon-rounded icon-tag',
                                                                            bind: {
                                                                                value: '{portcall.voyage.voyage_number}',
                                                                            },
                                                                            listeners: {
                                                                                painted: function(me) {
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
                                                                                value: '{portcall.voyage.reference_number}',
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
                                                                                value: '{portcall.voyage.office_id}',
                                                                            },
                                                                            cls: 'a-field-icon icon-rounded icon-business-center',
                                                                            listeners: {
                                                                                select: function(me, selection) {
                                                                                    if (selection) {
                                                                                        let voyage = this.upVM()
                                                                                            .get('portcall')
                                                                                            .getVoyage();
                                                                                        voyage.set(
                                                                                            'office_name',
                                                                                            selection.get('office_name'),
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
                                                                            xtype: 'user.combo',
                                                                            label: 'Operator',
                                                                            testId: 'createVoyageOperatorCombo',
                                                                            clearable: true,
                                                                            bind: {
                                                                                value: '{portcall.assigned_to}',
                                                                            },
                                                                            placeholder: 'Choose operator',
                                                                            cls: 'a-field-icon icon-rounded icon-person',
                                                                        },
                                                                    ],
                                                                },
                                                                // Spacer
                                                                {
                                                                    xtype: 'div',
                                                                    cls: 'a-field-container',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        // Section Port & Cargo details
                                        {
                                            xtype: 'container',
                                            cls: 'a-card-section a-bb-100',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    ripple: true,
                                                    html: 'Port & Cargo details',
                                                    cls: 'a-collapsible-title a-collapsible-trigger a-trigger-left fs-14',
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            fn: function fn() {
                                                                let component = this.component;
                                                                component.toggleCls('is-collapsed');
                                                                component
                                                                    .up('container')
                                                                    .down('[cls~=a-collapsible-container]')
                                                                    .toggleCls('is-collapsed');
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-collapsible-container',
                                                    items: [
                                                        // Port Itinerary Form
                                                        {
                                                            xtype: 'container',
                                                            cls: 'a-form-container a-form-3col',
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle',
                                                                pack: 'space-between',
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
                                                                            xtype: 'port.combo',
                                                                            cls: 'a-field-icon icon-rounded icon-port',
                                                                            label: 'Port',
                                                                            required: true,
                                                                            flex: 1,
                                                                            placeholder: 'Choose port',
                                                                            forceSelection: false,
                                                                            bind: {
                                                                                value: '{portcall.port_id}',
                                                                                inputValue: '{portcall.port_name}',
                                                                            },
                                                                            listeners: {
                                                                                painted: function(me) {
                                                                                    let comboStore = me.getStore();
                                                                                    if (comboStore) {
                                                                                        comboStore.addFilter({
                                                                                            id: 'port_team_filter',
                                                                                            property: 'use_team_filter',
                                                                                            operator: '=',
                                                                                            value: true,
                                                                                        });
                                                                                    }
                                                                                    if (
                                                                                        me
                                                                                            .upVM()
                                                                                            .get('portcall.port_id')
                                                                                    ) {
                                                                                        comboStore.load({
                                                                                            params: {
                                                                                                query: me
                                                                                                    .upVM()
                                                                                                    .get(
                                                                                                        'portcall.port_id',
                                                                                                    ),
                                                                                            },
                                                                                            callback: function(
                                                                                                records,
                                                                                                operation,
                                                                                                success,
                                                                                            ) {
                                                                                                // do something after the load finishes
                                                                                            },
                                                                                            scope: this,
                                                                                        });
                                                                                        me.setValue(
                                                                                            me
                                                                                                .upVM()
                                                                                                .get('portcall.port_id'),
                                                                                        );
                                                                                    }
                                                                                },
                                                                                select: function(me, selection) {
                                                                                    let record =
                                                                                        this.upVM().get('portcall');

                                                                                    record.set(
                                                                                        'port_name',
                                                                                        selection.get('port_name'),
                                                                                    );
                                                                                },
                                                                                clearicontap: function() {
                                                                                    let record =
                                                                                        this.upVM().get('portcall');
                                                                                    record.set('port_id', null);
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
                                                                            label: 'Port function',
                                                                            cls: 'a-field-icon icon-short icon-rounded',
                                                                            required: true,
                                                                            forceSelection: true,
                                                                            placeholder: 'Function',
                                                                            queryMode: 'local',
                                                                            valueField: 'name',
                                                                            displayField: 'name',
                                                                            bind: {
                                                                                value: '{nomination.port_function}',
                                                                            },
                                                                            store: {
                                                                                type: 'berth.function',
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
                                                                            label: 'ETA',
                                                                            required: true,
                                                                            bind: {
                                                                                dateTime: '{portcall.port_eta}',
                                                                            },
                                                                            flex: 1,
                                                                            cls: 'a-field-icon icon-rounded icon-calendar',
                                                                            placeholder: 'Choose ETA',
                                                                        },
                                                                    ],
                                                                },
                                                                {
                                                                    xtype: 'container',
                                                                    cls: 'a-field-container',
                                                                    items: [
                                                                        {
                                                                            xtype: 'port.combo',
                                                                            cls: 'a-field-icon icon-rounded icon-port',
                                                                            label: 'Previous port',
                                                                            flex: 1,
                                                                            placeholder: 'Choose port',
                                                                            valueField: 'port_name',
                                                                            displayField: 'port_name',
                                                                            forceSelection: false,
                                                                            floatedPicker: {
                                                                                listeners: {
                                                                                    select: function() {
                                                                                        let record =
                                                                                                this.upVM().get(
                                                                                                    'portcall',
                                                                                                ),
                                                                                            port_id =
                                                                                                this.getSelection().get(
                                                                                                    'port_id',
                                                                                                );

                                                                                        record.set(
                                                                                            'previous_port_id',
                                                                                            port_id,
                                                                                        );
                                                                                    },
                                                                                },
                                                                            },
                                                                            bind: {
                                                                                value: '{portcall.previous_port}',
                                                                                inputValue: '{portcall.previous_port}',
                                                                            },
                                                                            listeners: {
                                                                                painted: function(me) {
                                                                                    if (
                                                                                        me
                                                                                            .upVM()
                                                                                            .get(
                                                                                                'portcall.previous_port',
                                                                                            )
                                                                                    ) {
                                                                                        me.getStore().load({
                                                                                            params: {
                                                                                                query: me
                                                                                                    .upVM()
                                                                                                    .get(
                                                                                                        'portcall.previous_port',
                                                                                                    ),
                                                                                            },
                                                                                            callback: function(
                                                                                                records,
                                                                                                operation,
                                                                                                success,
                                                                                            ) {
                                                                                                // do something after the load finishes
                                                                                            },
                                                                                            scope: this,
                                                                                        });
                                                                                        me.setValue(
                                                                                            me
                                                                                                .upVM()
                                                                                                .get(
                                                                                                    'portcall.previous_port',
                                                                                                ),
                                                                                        );
                                                                                    }
                                                                                },
                                                                                clearicontap: function() {
                                                                                    let record =
                                                                                        this.upVM().get('portcall');
                                                                                    record.set(
                                                                                        'previous_port_id',
                                                                                        null,
                                                                                    );
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
                                                                            xtype: 'port.combo',
                                                                            cls: 'a-field-icon icon-rounded icon-port',
                                                                            label: 'Next port',
                                                                            flex: 1,
                                                                            placeholder: 'Choose port',
                                                                            valueField: 'port_name',
                                                                            displayField: 'port_name',
                                                                            forceSelection: false,
                                                                            floatedPicker: {
                                                                                listeners: {
                                                                                    select: function() {
                                                                                        let record =
                                                                                                this.upVM().get(
                                                                                                    'portcall',
                                                                                                ),
                                                                                            port_id =
                                                                                                this.getSelection().get(
                                                                                                    'port_id',
                                                                                                );

                                                                                        record.set(
                                                                                            'next_port_id',
                                                                                            port_id,
                                                                                        );
                                                                                    },
                                                                                },
                                                                            },
                                                                            bind: {
                                                                                value: '{portcall.next_port}',
                                                                                inputValue: '{portcall.next_port}',
                                                                            },
                                                                            listeners: {
                                                                                painted: function(me) {
                                                                                    if (
                                                                                        me
                                                                                            .upVM()
                                                                                            .get('portcall.next_port')
                                                                                    ) {
                                                                                        me.getStore().load({
                                                                                            params: {
                                                                                                query: me
                                                                                                    .upVM()
                                                                                                    .get(
                                                                                                        'portcall.next_port',
                                                                                                    ),
                                                                                            },
                                                                                            callback: function(
                                                                                                records,
                                                                                                operation,
                                                                                                success,
                                                                                            ) {
                                                                                                // do something after the load finishes
                                                                                            },
                                                                                            scope: this,
                                                                                        });
                                                                                        me.setValue(
                                                                                            me
                                                                                                .upVM()
                                                                                                .get(
                                                                                                    'portcall.next_port',
                                                                                                ),
                                                                                        );
                                                                                    }
                                                                                },
                                                                                clearicontap: function() {
                                                                                    let record =
                                                                                        this.upVM().get('portcall');
                                                                                    record.set('next_port_id', null);
                                                                                },
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                                // Spacer
                                                                {
                                                                    xtype: 'div',
                                                                    cls: 'a-field-container',
                                                                },
                                                            ],
                                                        },
                                                        // Cargo Form
                                                        {
                                                            xtype: 'VoyageAppointmentCargo',
                                                            bind: {
                                                                store: '{portcall.cargoes}',
                                                            },
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            items: [
                                                                {
                                                                    xtype: 'button',
                                                                    ui: 'normal small',
                                                                    iconCls: 'md-icon md-icon-add add_cargo',
                                                                    text: 'Add cargo',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        // Section Agent Nomination
                                        {
                                            xtype: 'container',
                                            cls: 'a-card-section a-bb-100',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    ripple: true,
                                                    html: 'Agent nomination',
                                                    cls: 'a-collapsible-title a-collapsible-trigger a-trigger-left fs-14',
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            fn: function fn() {
                                                                let component = this.component;
                                                                component.toggleCls('is-collapsed');
                                                                component
                                                                    .up('container')
                                                                    .down('[cls~=a-collapsible-container]')
                                                                    .toggleCls('is-collapsed');
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'container',
                                                    cls: 'a-collapsible-container',
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            layout: 'hbox',
                                                            items: [
                                                                {
                                                                    xtype: 'combobox',
                                                                    ui: 'classic filled-light',
                                                                    cls: 'a-field-icon icon-search',
                                                                    placeholder: 'Search agent',
                                                                    forceSelection: true,
                                                                    required: true,
                                                                    width: 340,
                                                                    name: 'agent_combo',
                                                                    valueField: 'id',
                                                                    displayField: 'name',
                                                                    reference: 'agentCombo',
                                                                    queryMode: 'local',
                                                                    bind: {
                                                                        store: '{agentsStore}',
                                                                        value: '{nomination.lead_agent_id}',
                                                                    },
                                                                    listeners: {
                                                                        initialize: function() {
                                                                            this.on('painted', function(me) {
                                                                                const currentUser = me
                                                                                    .upVM()
                                                                                    .get('currentUser');
                                                                                const nomination = me
                                                                                    .upVM()
                                                                                    .get('portcall')
                                                                                    .getNomination();
                                                                                if (
                                                                                    currentUser &&
                                                                                    currentUser.get(
                                                                                        'preferred_hub_agent_id',
                                                                                    )
                                                                                ) {
                                                                                    nomination.set(
                                                                                        'lead_agent_id',
                                                                                        currentUser.get(
                                                                                            'preferred_hub_agent_id',
                                                                                        ),
                                                                                    );
                                                                                    //pre-select HUB agent
                                                                                    nomination.set('agency_type_id', 9);
                                                                                }
                                                                            });
                                                                        },
                                                                        select: function() {
                                                                            let selection = this.getSelection(),
                                                                                record = this.upVM()
                                                                                    .get('portcall')
                                                                                    .getNomination();
                                                                            record.set(
                                                                                'lead_agent_name',
                                                                                selection.get('name'),
                                                                            );
                                                                            record.set(
                                                                                'lead_agent_email',
                                                                                selection.get('email'),
                                                                            );
                                                                        },
                                                                        painted: function(me) {
                                                                            me.setError(null);
                                                                        },
                                                                    },
                                                                },
                                                                {
                                                                    xtype: 'radiogroup',
                                                                    margin: '0 32',
                                                                    flex: 1,
                                                                    vertical: true,
                                                                    bind: {
                                                                        value: '{nomination.agency_type_id}',
                                                                    },
                                                                    height: 44,
                                                                    defaults: {
                                                                        width: '50%',
                                                                        padding: '0 4',
                                                                        height: 22,
                                                                        listeners: {
                                                                            check: function(me) {
                                                                                let nomination = me
                                                                                    .upVM()
                                                                                    .get('portcall')
                                                                                    .getNomination();
                                                                                nomination.set(
                                                                                    'agency_type_name',
                                                                                    me.getLabel(),
                                                                                );
                                                                            },
                                                                        },
                                                                    },
                                                                    listeners: {
                                                                        painted: function(me) {
                                                                            let nomination = me
                                                                                .upVM()
                                                                                .get('portcall')
                                                                                .getNomination();
                                                                            if (
                                                                                nomination &&
                                                                                nomination.get('agency_type_id')
                                                                            ) {
                                                                                me.setValue(
                                                                                    nomination.get('agency_type_id'),
                                                                                );
                                                                            } else {
                                                                                me.setValue(8);
                                                                            }
                                                                        },
                                                                    },
                                                                    items: [
                                                                        {
                                                                            label: 'Charterer’s Nominated',
                                                                            value: 8,
                                                                        },
                                                                        {
                                                                            label: 'Owner’s Protective',
                                                                            value: 4,
                                                                        },
                                                                        {
                                                                            label: 'Owner’s Nominated',
                                                                            value: 7,
                                                                        },
                                                                        {
                                                                            label: 'HUB agent',
                                                                            value: 9,
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            cls: 'a-nomination-item',
                                                            hidden: true,
                                                            bind: {
                                                                hidden: '{agentCombo.selection ? false:true}',
                                                            },
                                                            layout: {
                                                                type: 'hbox',
                                                                align: 'middle',
                                                                pack: 'space-between',
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'div',
                                                                    cls: 'hbox',
                                                                    html: '<i class="md-icon md-filled md-18 c-green-500">check_circle</i>',
                                                                },
                                                                {
                                                                    xtype: 'container',
                                                                    flex: 1,
                                                                    padding: '0 12',
                                                                    items: [
                                                                        {
                                                                            xtype: 'div',
                                                                            cls: 'hbox',
                                                                            bind: {
                                                                                html: '<span class="fw-b a-link fs-16">{agentCombo.selection.name}</span><i class="md-icon md-filled c-teal ml-2 md-16">verified_user</i>',
                                                                            },
                                                                        },
                                                                        {
                                                                            xtype: 'div',
                                                                            cls: 'c-blue-grey fs-13',
                                                                            bind: {
                                                                                html: '{agentCombo.selection.email}',
                                                                            },
                                                                        },
                                                                    ],
                                                                },

                                                                {
                                                                    xtype: 'div',
                                                                    flex: 1,
                                                                    bind: {
                                                                        html: '<div class="a-function"><span>{selectedAgencyPort}</span></div>',
                                                                    },
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    ui: 'tool-md round',
                                                                    iconCls: 'md-icon md-icon-delete remove_agent',
                                                                    tooltip: {
                                                                        anchorToTarget: true,
                                                                        anchor: true,
                                                                        html: 'Delete nomination',
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
                                            ],
                                        },
                                        // Section Appointment Instructions
                                        {
                                            xtype: 'container',
                                            cls: 'a-card-section',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'middle',
                                                        pack: 'space-between',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'div',
                                                            flex: 1,
                                                            ripple: true,
                                                            html: 'Appointing instructions',
                                                            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-left fs-14',
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
                                                            right: 44,
                                                            ui: 'normal-light small',
                                                            iconCls: 'md-icon md-icon-add add_instruction',
                                                            text: 'Add snippet',
                                                        },
                                                    ],
                                                },
                                                {
                                                    xtype: 'VoyageAppointmentInstruction',
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
                            xtype: 'button',
                            ui: 'default outlined',
                            cls: 'preview_draft',
                            text: 'Preview',
                        },
                        {
                            xtype: 'div',
                            flex: 1,
                        },
                        {
                            xtype: 'button',
                            ui: 'default outlined appointment_cancel',
                            margin: '0 8',
                            text: 'Cancel',
                        },
                        {
                            xtype: 'button',
                            enableToggle: true,
                            ui: 'action loading',
                            bind: {
                                text: 'Appoint agent',
                            },
                            handler: 'createAppointmentSubmitButton',
                            testId: 'createAppointmentSubmitButton',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'button',
            ui: 'tool-lg round appointment_cancel',
            iconCls: 'md-icon md-icon-close',
            top: 16,
            right: 16,
        },
    ],
    initializeRecord: function() {
        Ext.getCmp('main-viewport').setMasked({
            xtype: 'viewport.mask',
        });

        let currentUser = this.upVM().get('currentUser');
        let portcall = Ext.create('Abraxa.model.portcall.Portcall', {
            assigned_to: currentUser.get('id'),
            is_manual: true,
        });
        let voyage = Ext.create('Abraxa.model.voyage.Voyage');
        let nomination = Ext.create('Abraxa.model.nomination.Nomination');
        portcall.setVoyage(voyage);
        portcall.setNomination(nomination);
        this.setRecord(portcall);
        Ext.getCmp('main-viewport').setMasked(false);
    },
});

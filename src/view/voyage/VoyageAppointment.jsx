Ext.define('Abraxa.view.voyage.VoyageAppointment', {
    extend: 'Ext.Container',
    xtype: 'VoyageAppointment',
    items: [
        // Appointment Details
        {
            xtype: 'formpanel',
            cls: 'a-card-container a-voyage-appointment-form appointment_form',
            padding: 0,
            items: [
                // Card Header Tabs
                {
                    xtype: 'container',
                    cls: 'a-card-tabs-header a-bb-100',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'tabpanel',
                            ui: 'xl',
                            reference: 'activePortcallTab',
                            publishes: {
                                activeItem: true,
                            },
                            activeItem: 0,
                            bind: {
                                activeItem: '{setActiveTab}',
                                items: '{tabItems}',
                            },
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'middle',
                            },
                            defaults: {
                                ui: 'xl',
                            },
                        },
                    ],
                },
                // Form Error
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 16,
                    showAnimation: 'fadeIn',
                },
                // Card Body
                {
                    xtype: 'container',
                    cls: 'a-card-body',
                    padding: 0,
                    items: [
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
                                                    xtype: 'container',
                                                    cls: 'a-field-container',
                                                    items: [
                                                        {
                                                            xtype: 'abraxa.datetimefield',
                                                            required: true,
                                                            bind: {
                                                                label: 'ETA ({activePortcall.port.name})',
                                                                dateTime: '{activePortcall.port_eta}',
                                                                disabled: '{activePortcall.is_locked_for_editing}',
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
                                                                    select: function () {
                                                                        let record = this.upVM().get('activePortcall'),
                                                                            port_id =
                                                                                this.getSelection().get('port_id');

                                                                        record.set('previous_port_id', port_id);
                                                                    },
                                                                },
                                                            },
                                                            bind: {
                                                                value: '{activePortcall.previous_port}',
                                                                inputValue: '{activePortcall.previous_port}',
                                                                disabled: '{activePortcall.is_locked_for_editing}',
                                                            },
                                                            listeners: {
                                                                painted: function (me) {
                                                                    if (me.upVM().get('activePortcall.previous_port')) {
                                                                        me.getStore().load({
                                                                            params: {
                                                                                query: me
                                                                                    .upVM()
                                                                                    .get(
                                                                                        'activePortcall.previous_port'
                                                                                    ),
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
                                                                        me.setValue(
                                                                            me
                                                                                .upVM()
                                                                                .get('activePortcall.previous_port')
                                                                        );
                                                                    }
                                                                },
                                                                clearicontap: function () {
                                                                    let record = this.upVM().get('activePortcall');
                                                                    record.set('previous_port_id', null);
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
                                                                    select: function () {
                                                                        let record = this.upVM().get('activePortcall'),
                                                                            port_id =
                                                                                this.getSelection().get('port_id');

                                                                        record.set('next_port_id', port_id);
                                                                    },
                                                                },
                                                            },
                                                            bind: {
                                                                value: '{activePortcall.next_port}',
                                                                inputValue: '{activePortcall.next_port}',
                                                                disabled: '{activePortcall.is_locked_for_editing}',
                                                            },
                                                            listeners: {
                                                                painted: function (me) {
                                                                    if (me.upVM().get('activePortcall.next_port')) {
                                                                        me.getStore().load({
                                                                            params: {
                                                                                query: me
                                                                                    .upVM()
                                                                                    .get('activePortcall.next_port'),
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
                                                                        me.setValue(
                                                                            me.upVM().get('activePortcall.next_port')
                                                                        );
                                                                    }
                                                                },
                                                                clearicontap: function () {
                                                                    let record = this.upVM().get('activePortcall');
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
                                                store: '{activePortcall.cargoes}',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    ui: 'normal small',
                                                    bind: {
                                                        hidden: '{activePortcall.is_locked_for_editing || activePortcall.port_function !== "Cargo operations" ? true:false }',
                                                    },
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
                                                        disabled: '{activePortcall.is_locked_for_editing}',
                                                    },
                                                    listeners: {
                                                        initialize: function () {
                                                            this.on('painted', function (me) {
                                                                const currentUser = me.upVM().get('currentUser');
                                                                const nomination = me.upVM().get('nomination');
                                                                if (
                                                                    currentUser &&
                                                                    currentUser.get('preferred_hub_agent_id') &&
                                                                    !nomination.get('lead_agent_id')
                                                                ) {
                                                                    nomination.set(
                                                                        'lead_agent_id',
                                                                        currentUser.get('preferred_hub_agent_id')
                                                                    );
                                                                    //pre-select HUB agent
                                                                    nomination.set('agency_type_id', 9);
                                                                }
                                                            });
                                                        },
                                                        select: function () {
                                                            let selection = this.getSelection(),
                                                                record = this.upVM().get('nomination');
                                                            record.set('lead_agent_name', selection.get('name'));
                                                            record.set('lead_agent_email', selection.get('email'));
                                                        },
                                                        painted: function (me) {
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
                                                        disabled: '{activePortcall.is_locked_for_editing}',
                                                    },
                                                    height: 44,
                                                    defaults: {
                                                        width: '50%',
                                                        padding: '0 4',
                                                        height: 22,
                                                        bind: {
                                                            disabled: '{activePortcall.is_locked_for_editing}',
                                                        },
                                                        listeners: {
                                                            check: function (me) {
                                                                let nomination = me.upVM().get('nomination');
                                                                nomination.set('agency_type_name', me.getLabel());
                                                            },
                                                        },
                                                    },
                                                    listeners: {
                                                        painted: function (me) {
                                                            let nomination = me.upVM().get('nomination');
                                                            if (nomination && nomination.get('agency_type_id')) {
                                                                me.setValue(nomination.get('agency_type_id'));
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
                                                    bind: {
                                                        hidden: '{activePortcall.is_locked_for_editing}',
                                                    },
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
                                            bind: {
                                                hidden: '{activePortcall.is_locked_for_editing}',
                                            },
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
});
